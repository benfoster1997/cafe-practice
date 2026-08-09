"""Bar-driven backtest engine.

Design principles (the "honest backtest" rules):

1. PESSIMISTIC INTRABAR RESOLUTION. On a single bar we cannot know whether
   the high or the low printed first. Whenever both a stop and a target lie
   inside one bar's range, the STOP is assumed to fill first. Backtests built
   on the optimistic assumption look better and lie.
2. EVERY FILL PAYS COSTS. Spread on entry, slippage on every market-order
   fill, commission per side. There is no zero-cost path through the engine.
3. RAILS OUTRANK STRATEGY. Daily trade limits and the daily loss cutoff are
   enforced here, not in the strategy, so no future strategy change can
   accidentally remove them.

Prices in bar data are treated as BID. Longs enter at ask (bid + spread) and
exit at bid; shorts enter at bid and exit at ask. This is how retail FX quotes
work and it makes the spread a real cost on every round trip.
"""
from dataclasses import dataclass, field
from datetime import datetime, time as dtime
from typing import Callable, Optional

import pandas as pd

from .config import CostModel, RiskRails, SymbolSpec, TradeManagement
from .sessions import ny_date, ny_time


@dataclass
class Signal:
    """A strategy's request to enter a trade at the current bar's close."""
    direction: int  # +1 long, -1 short
    stop_price: float
    tag: str = ""


@dataclass
class Trade:
    entry_time: datetime
    direction: int
    entry_price: float  # actual fill (includes spread + slippage)
    stop_price: float
    initial_risk: float  # price distance entry->stop, always > 0
    size_lots: float  # remaining open size; shrinks at partials
    original_size_lots: float = 0.0  # size at entry; R math uses this, always
    tag: str = ""
    partial_time: Optional[datetime] = None
    partial_price: Optional[float] = None
    exit_time: Optional[datetime] = None
    exit_price: Optional[float] = None
    exit_reason: str = ""
    moved_to_breakeven: bool = False
    pnl_quote: float = 0.0  # net, in quote currency (USD), costs included
    r_multiple: float = 0.0  # net R after costs
    violations: list[str] = field(default_factory=list)

    @property
    def closed(self) -> bool:
        return self.exit_time is not None


# A strategy is a callable: (history_bars, now_utc) -> Optional[Signal].
# history_bars contains all bars up to and including the current one, so a
# strategy is structurally incapable of seeing the future.
Strategy = Callable[[pd.DataFrame, datetime], Optional[Signal]]


class Backtester:
    # Bars of history handed to the strategy each call. Bounded for speed and
    # so strategies can't quietly depend on unbounded memory.
    LOOKBACK = 2000

    def __init__(
        self,
        bars: pd.DataFrame,  # index: UTC datetime; columns: open, high, low, close
        strategy: Strategy,
        symbol: SymbolSpec = SymbolSpec(),
        costs: CostModel = CostModel(),
        rails: RiskRails = RiskRails(),
        mgmt: TradeManagement = TradeManagement(),
        initial_balance: float = 100.0,
        time_exit_ny: Optional[dtime] = None,  # flatten at this NY time if set
    ):
        self.bars = bars
        self.strategy = strategy
        self.symbol = symbol
        self.costs = costs
        self.rails = rails
        self.mgmt = mgmt
        self.initial_balance = initial_balance
        self.time_exit_ny = time_exit_ny

        self.balance = initial_balance
        self.trades: list[Trade] = []
        self.open_trade: Optional[Trade] = None
        self._day = None
        self._day_start_balance = initial_balance
        self._trades_today = 0

    # ---------- cost helpers ----------

    def _round(self, price: float) -> float:
        """Round to symbol precision. Every computed level (entry fill, targets,
        break-even stop) passes through here so levels compare exactly against
        bar prices instead of missing them by float residue — a real broker
        quotes in ticks, and so must we."""
        return round(price, self.symbol.digits)

    def _pips(self, price_distance: float) -> float:
        return price_distance / self.symbol.pip_size

    def _entry_fill(self, direction: int, bid_close: float) -> float:
        adj = (self.costs.spread_pips + self.costs.slippage_pips) * self.symbol.pip_size
        return self._round(bid_close + adj if direction > 0 else bid_close - adj)

    def _exit_fill(self, direction: int, bid_price: float, market_order: bool) -> float:
        # Longs exit at bid; shorts exit at ask (bid + spread).
        price = bid_price if direction > 0 else bid_price + self.costs.spread_pips * self.symbol.pip_size
        if market_order:
            price -= direction * self.costs.slippage_pips * self.symbol.pip_size
        return self._round(price)

    def _commission(self, lots: float) -> float:
        # Charged per side; a partial exit pays commission on the closed part.
        return self.costs.commission_per_lot_side * lots

    # ---------- sizing ----------

    def _size(self, stop_distance: float) -> float:
        risk_amount = self.balance * self.rails.risk_pct / 100.0
        stop_pips = self._pips(stop_distance)
        if stop_pips <= 0:
            return 0.0
        lots = risk_amount / (stop_pips * self.symbol.pip_value_per_lot)
        # Floor to lot step with an epsilon so 1.0 / 0.01 doesn't floor to 99
        # steps on float residue.
        steps = int(lots / self.symbol.lot_step + 1e-9)
        lots = steps * self.symbol.lot_step
        return max(lots, 0.0)

    # ---------- daily rails ----------

    def _roll_day(self, ts: datetime) -> None:
        d = ny_date(ts)
        if d != self._day:
            self._day = d
            self._day_start_balance = self.balance
            self._trades_today = 0

    def _daily_loss_hit(self) -> bool:
        dd = (self._day_start_balance - self.balance) / self._day_start_balance * 100.0
        return dd >= self.rails.daily_loss_cutoff_pct

    # ---------- trade lifecycle ----------

    def _book_exit(self, trade: Trade, ts: datetime, bid_price: float,
                   fraction: float, reason: str, market_order: bool) -> None:
        fill = self._exit_fill(trade.direction, bid_price, market_order)
        lots = trade.size_lots * fraction
        move = (fill - trade.entry_price) * trade.direction
        pnl = self._pips(move) * self.symbol.pip_value_per_lot * lots
        pnl -= self._commission(lots)  # exit-side commission
        trade.pnl_quote += pnl
        self.balance += pnl
        if fraction >= 1.0 or reason != "partial":
            trade.exit_time = ts
            trade.exit_price = fill
            trade.exit_reason = reason
            risk_quote = (self._pips(trade.initial_risk)
                          * self.symbol.pip_value_per_lot * trade.original_size_lots)
            trade.r_multiple = trade.pnl_quote / risk_quote if risk_quote else 0.0
        else:
            trade.partial_time = ts
            trade.partial_price = fill
            trade.size_lots -= lots

    def _manage_open(self, ts: datetime, bar) -> None:
        t = self.open_trade
        if t is None:
            return
        d = t.direction
        lo, hi = bar["low"], bar["high"]

        # Stop check FIRST (pessimistic resolution — see module docstring).
        stop_hit = lo <= t.stop_price if d > 0 else hi >= t.stop_price
        if stop_hit:
            reason = "breakeven" if t.moved_to_breakeven else "stop"
            self._book_exit(t, ts, t.stop_price, 1.0, reason, market_order=False)
            self.open_trade = None
            return

        # Partial at +partial_at_r, then break-even.
        if t.partial_time is None:
            partial_target = self._round(
                t.entry_price + d * self.mgmt.partial_at_r * t.initial_risk)
            partial_hit = hi >= partial_target if d > 0 else lo <= partial_target
            if partial_hit:
                self._book_exit(t, ts, partial_target, self.mgmt.partial_fraction,
                                "partial", market_order=False)
                buffer = self.mgmt.breakeven_buffer_pips * self.symbol.pip_size
                t.stop_price = self._round(t.entry_price + d * buffer)
                t.moved_to_breakeven = True

        # Final target for the runner.
        final_target = self._round(
            t.entry_price + d * self.mgmt.final_target_r * t.initial_risk)
        target_hit = hi >= final_target if d > 0 else lo <= final_target
        if target_hit and t.partial_time is not None:
            self._book_exit(t, ts, final_target, 1.0, "target", market_order=False)
            self.open_trade = None
            return

        # Optional time-based exit.
        if self.time_exit_ny is not None and ny_time(ts).time() >= self.time_exit_ny:
            self._book_exit(t, ts, bar["close"], 1.0, "time", market_order=True)
            self.open_trade = None

    def _try_enter(self, ts: datetime, bar, signal: Signal) -> None:
        if self._trades_today >= self.rails.max_trades_per_day:
            return
        if self._daily_loss_hit():
            return
        entry = self._entry_fill(signal.direction, bar["close"])
        stop = self._round(signal.stop_price)
        risk = (entry - stop) * signal.direction
        if risk <= 0:
            return  # stop on the wrong side of entry — refuse, don't "fix"
        lots = self._size(risk)
        if lots < self.symbol.min_lot:
            return
        trade = Trade(
            entry_time=ts, direction=signal.direction, entry_price=entry,
            stop_price=stop, initial_risk=risk, size_lots=lots,
            original_size_lots=lots, tag=signal.tag,
        )
        self.balance -= self._commission(lots)  # entry-side commission
        trade.pnl_quote -= self._commission(lots)
        self.trades.append(trade)
        self.open_trade = trade
        self._trades_today += 1

    # ---------- main loop ----------

    def run(self) -> list[Trade]:
        idx = self.bars.index
        for i in range(len(self.bars)):
            ts = idx[i].to_pydatetime()
            bar = self.bars.iloc[i]
            self._roll_day(ts)
            self._manage_open(ts, bar)
            if self.open_trade is None and not self._daily_loss_hit():
                history = self.bars.iloc[max(0, i - self.LOOKBACK + 1): i + 1]
                signal = self.strategy(history, ts)
                if signal is not None:
                    self._try_enter(ts, bar, signal)
        # Force-close anything still open at data end so stats are complete.
        if self.open_trade is not None:
            last_ts = idx[-1].to_pydatetime()
            self._book_exit(self.open_trade, last_ts, self.bars.iloc[-1]["close"],
                            1.0, "data_end", market_order=True)
            self.open_trade = None
        return self.trades
