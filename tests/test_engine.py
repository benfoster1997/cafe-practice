"""Engine arithmetic verified against hand-computed scenarios.

All scenarios use zero costs unless the test is specifically about costs, so
expected values can be computed by hand and any drift in engine arithmetic
fails loudly.
"""
from datetime import datetime, timezone

from backtest.config import CostModel, RiskRails, SymbolSpec, TradeManagement
from backtest.data import synthetic_bars
from backtest.engine import Backtester, Signal

UTC = timezone.utc
NO_COSTS = CostModel(spread_pips=0.0, commission_per_lot_side=0.0, slippage_pips=0.0)
MGMT = TradeManagement(partial_fraction=0.5, partial_at_r=1.0,
                       breakeven_buffer_pips=0.0, final_target_r=2.0)
# July timestamps => EDT, so 14:xx UTC is 10:xx in New York (inside a session,
# irrelevant to these tests but realistic).
T0 = datetime(2024, 7, 10, 14, 0, tzinfo=UTC)


def enter_long_at(ts_target, stop):
    def strategy(history, now):
        return Signal(1, stop) if now == ts_target else None
    return strategy


def enter_short_at(ts_target, stop):
    def strategy(history, now):
        return Signal(-1, stop) if now == ts_target else None
    return strategy


def run(closes, strategy, **kw):
    bars = synthetic_bars(T0, closes, spread_range=kw.pop("spread_range", 0.0))
    bt = Backtester(bars, strategy, symbol=SymbolSpec(), mgmt=MGMT,
                    initial_balance=10_000.0, costs=kw.pop("costs", NO_COSTS), **kw)
    bt.run()
    return bt


def test_partial_then_target_is_one_and_a_half_r():
    # Entry 1.1000, stop 10 pips. Partial (1R) at 1.1010, runner target 1.1020.
    bt = run([1.1000, 1.1000, 1.1010, 1.1020],
             enter_long_at(T0.replace(minute=1), stop=1.0990))
    t = bt.trades[0]
    assert t.closed and t.exit_reason == "target"
    assert abs(t.r_multiple - 1.5) < 1e-9
    # 1% of 10k risked = $100 -> +1.5R = +$150.
    assert abs(bt.balance - 10_150.0) < 1e-6


def test_short_side_mirror():
    bt = run([1.1000, 1.1000, 1.0990, 1.0980],
             enter_short_at(T0.replace(minute=1), stop=1.1010))
    t = bt.trades[0]
    assert t.exit_reason == "target"
    assert abs(t.r_multiple - 1.5) < 1e-9


def test_straight_stop_is_minus_one_r():
    bt = run([1.1000, 1.1000, 1.0989],
             enter_long_at(T0.replace(minute=1), stop=1.0990))
    t = bt.trades[0]
    assert t.exit_reason == "stop"
    assert abs(t.r_multiple - (-1.0)) < 1e-9
    assert abs(bt.balance - 9_900.0) < 1e-6


def test_partial_then_breakeven_keeps_half_r():
    bt = run([1.1000, 1.1000, 1.1010, 1.0995],
             enter_long_at(T0.replace(minute=1), stop=1.0990))
    t = bt.trades[0]
    assert t.exit_reason == "breakeven"
    assert abs(t.r_multiple - 0.5) < 1e-9


def test_intrabar_ambiguity_resolves_to_stop():
    # One bar spans both the stop and both targets: pessimistic rule says stop.
    bt = run([1.1000, 1.1000, 1.1025],
             enter_long_at(T0.replace(minute=1), stop=1.0990),
             spread_range=0.0015)
    t = bt.trades[0]
    assert t.exit_reason == "stop"
    assert abs(t.r_multiple - (-1.0)) < 1e-9


def test_costs_make_losses_worse_than_one_r():
    costs = CostModel(spread_pips=0.3, commission_per_lot_side=3.0, slippage_pips=0.2)
    bt = run([1.1000, 1.1000, 1.0985],
             enter_long_at(T0.replace(minute=1), stop=1.0990), costs=costs)
    t = bt.trades[0]
    assert t.exit_reason == "stop"
    assert t.r_multiple < -1.0  # spread+slippage+commission push past -1R
    assert t.r_multiple > -1.2  # sanity: costs are pips, not catastrophe


def test_max_trades_per_day_rail():
    def always_long(history, now):
        return Signal(1, history.iloc[-1]["close"] - 0.0010)
    closes = [1.1000] * 3 + [1.0985] + [1.1000, 1.0985] * 5
    bars = synthetic_bars(T0, closes)
    bt = Backtester(bars, always_long, mgmt=MGMT, initial_balance=10_000.0,
                    costs=NO_COSTS, rails=RiskRails(max_trades_per_day=2,
                                                    daily_loss_cutoff_pct=50.0))
    bt.run()
    assert len(bt.trades) == 2  # rail cuts it off regardless of signals


def test_daily_loss_cutoff_rail():
    def always_long(history, now):
        return Signal(1, history.iloc[-1]["close"] - 0.0010)
    # Monotonic decline: every trade stops out with no bounce that could win.
    # Risk is 1% of CURRENT balance, so losses compound slightly under 1%:
    # -1.00%, -0.99%, -0.98% -> cumulative 2.97% crosses the 2% cutoff only
    # after the third loss, so exactly three trades are allowed today.
    closes = [1.1000, 1.0985, 1.0970, 1.0955, 1.0940, 1.0925]
    bars = synthetic_bars(T0, closes)
    bt = Backtester(bars, always_long, mgmt=MGMT, initial_balance=10_000.0,
                    costs=NO_COSTS, rails=RiskRails(max_trades_per_day=99,
                                                    daily_loss_cutoff_pct=2.0))
    bt.run()
    assert len(bt.trades) == 3
    assert all(t.exit_reason == "stop" for t in bt.trades)
