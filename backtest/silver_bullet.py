"""Silver Bullet strategy — mechanical implementation of ICT_STRATEGY_DIGEST.md §5.

Scope: NY AM window (10:00–11:00 ET) on EURUSD, 1-minute bid bars.

Audit tags: [ICT] = his stated rule, [COMMUNITY] = community codification we
adopted, [OURS] = our resolution where he is silent. See digest §5–§7.

v1 simplifications (documented, to revisit):
- Liquidity pools: previous day H/L, London session H/L, Asian range H/L,
  9:30–10:00 pre-window range H/L. The digest's "15-minute swings since
  8:30" pool is not yet implemented. [OURS]
- News filter: NFP days (first Friday) skipped. CPI/FOMC dates need a
  calendar dataset the backtest environment can't reach; the live EA gets a
  real calendar feed. Backtest results are therefore slightly OPTIMISTIC on
  news handling — flagged in reporting. [OURS]
"""
from dataclasses import dataclass, field
from datetime import datetime, time as dtime, timedelta
from typing import Optional

import pandas as pd

from .engine import Signal
from .sessions import NY, ny_time

PIP = 0.0001
TICK = 0.00001


@dataclass
class SBParams:
    bias_lookback_days: int = 20         # [ICT] 2018 IPDA lookback (digest §5.2)
    min_fvg_pips: float = 1.0            # [OURS] translated from 4 index ticks
    cost_mult_min_fvg: float = 2.0       # [OURS] gap must exceed 2x round-trip cost
    roundtrip_cost_pips: float = 0.75    # [OURS] spread + commission, pips
    sweep_confirm_bars: int = 5          # [OURS] close back inside within 5 bars
    run_bodies: int = 3                  # [OURS] 3 bodies beyond = run, disqualify
    min_draw_distance_pips: float = 15.0  # [ICT] forex minimum framework
    min_rr_floor: float = 1.5            # [OURS] disableable floor
    stop_buffer: float = TICK            # [OURS] 1 tick beyond swept extreme
    target_cushion_pips: float = 3.0     # [ICT] 3-5 pip "fluff"; we use 3
    window_start: dtime = dtime(10, 0)   # [ICT] NY AM Silver Bullet
    window_end: dtime = dtime(11, 0)
    sweep_from: dtime = dtime(9, 30)     # [OURS] opening stop-run counts


@dataclass
class DayPlan:
    bias: int = 0                # +1 long, -1 short, 0 = no-trade
    draw: Optional[float] = None
    sweep_pools: list = field(default_factory=list)   # opposite-bias levels
    guard_pools: list = field(default_factory=list)   # bias-side levels (range-day guard)
    no_trade_reason: str = ""


def _daily_table(bars: pd.DataFrame) -> pd.DataFrame:
    """High/low/count per NY calendar date. Excludes thin (<100 bar) days."""
    ny_idx = bars.index.tz_convert(NY)
    g = bars.groupby(ny_idx.date)
    t = pd.DataFrame({"high": g["high"].max(), "low": g["low"].min(),
                      "n": g["close"].count()})
    return t[t["n"] >= 100]


def build_day_plans(bars: pd.DataFrame, p: SBParams) -> dict:
    """Precompute per-day bias/pools/draw using ONLY pre-window data.

    Everything here derives from bars strictly before 10:00 NY of the day in
    question (or previous days), so no plan can leak future prices.
    """
    ny_idx = bars.index.tz_convert(NY)
    dates = pd.Series(ny_idx.date, index=bars.index)
    ny_minutes = pd.Series(ny_idx.hour * 60 + ny_idx.minute, index=bars.index)
    daily = _daily_table(bars)
    plans: dict = {}

    for i, day in enumerate(daily.index):
        plan = DayPlan()
        plans[day] = plan
        d = pd.Timestamp(day)
        if d.weekday() == 4 and d.day <= 7:
            plan.no_trade_reason = "nfp_day"  # [ICT] NFP = no trading
            continue
        hist = daily.iloc[:i]  # strictly previous trading days
        if len(hist) < p.bias_lookback_days:
            plan.no_trade_reason = "warmup"
            continue
        look = hist.tail(p.bias_lookback_days)
        equilibrium = (look["high"].max() + look["low"].min()) / 2.0

        today = dates == day
        pre_window = today & (ny_minutes < 600)  # before 10:00
        if not pre_window.any():
            plan.no_trade_reason = "no_pre_window_data"
            continue
        price_at_open = bars.loc[pre_window, "close"].iloc[-1]

        midnight_bars = today & (ny_minutes >= 0) & (ny_minutes < 60)
        if not midnight_bars.any():
            plan.no_trade_reason = "no_midnight_open"
            continue
        midnight_open = bars.loc[midnight_bars, "open"].iloc[0]

        # Two-factor bias, both must agree [OURS, from ICT components]
        eq_bias = 1 if price_at_open < equilibrium else -1
        mo_bias = 1 if price_at_open < midnight_open else -1
        if eq_bias != mo_bias:
            plan.no_trade_reason = "bias_conflict"
            continue
        plan.bias = eq_bias

        # Pools [OURS list, digest §5.3]
        prev = hist.iloc[-1]
        london = today & (ny_minutes >= 120) & (ny_minutes < 300)     # 2:00-5:00
        asia_prev = (dates == daily.index[i - 1]) & (ny_minutes >= 1200)  # 20:00-24:00 prev day
        pre_ny = today & (ny_minutes >= 570) & (ny_minutes < 600)     # 9:30-10:00
        highs, lows = [prev["high"]], [prev["low"]]
        for mask in (london, asia_prev, pre_ny):
            if mask.any():
                highs.append(bars.loc[mask, "high"].max())
                lows.append(bars.loc[mask, "low"].min())

        if plan.bias > 0:
            plan.sweep_pools = sorted(set(lows), reverse=True)   # below price
            plan.guard_pools = sorted(set(highs))
            draws = [h for h in highs if h > price_at_open]
            plan.draw = min(draws) if draws else None            # nearest above
        else:
            plan.sweep_pools = sorted(set(highs))                # above price
            plan.guard_pools = sorted(set(lows), reverse=True)
            draws = [x for x in lows if x < price_at_open]
            plan.draw = max(draws) if draws else None            # nearest below
        if plan.draw is None:
            plan.bias = 0
            plan.no_trade_reason = "no_draw"
    return plans


class SilverBullet:
    """Stateful per-day machine: sweep -> MSS -> FVG -> limit signal."""

    def __init__(self, bars: pd.DataFrame, params: SBParams = SBParams()):
        self.p = params
        self.plans = build_day_plans(bars, params)
        self._day = None
        self._reset_day_state()

    def _reset_day_state(self):
        self.done = False
        self.pool_state: dict = {}   # level -> {"pen": bool, "extreme": float,
                                     #           "bars_since": int, "bodies": int, "dead": bool}
        self.swept_extreme: Optional[float] = None
        self.sweep_confirmed = False
        self.mss_level: Optional[float] = None   # opposing swing to break
        self.mss_confirmed = False
        self.leg_extreme: Optional[float] = None  # far end of displacement leg
        self.recent = []  # (time, o, h, l, c) completed bars today since 9:00

    def __call__(self, history: pd.DataFrame, now: datetime) -> Optional[Signal]:
        nt = ny_time(now)
        day = nt.date()
        if day != self._day:
            self._day = day
            self._reset_day_state()
        plan = self.plans.get(day)
        if plan is None or plan.bias == 0 or self.done:
            return None
        t = nt.time()
        if t < self.p.sweep_from or t >= self.p.window_end:
            return None

        bar = history.iloc[-1]
        o, h, l, c = bar["open"], bar["high"], bar["low"], bar["close"]
        self.recent.append((now, o, h, l, c))
        b = plan.bias

        # Range-day guard [OURS]: bias-side pool violated before entry => stand down.
        for gp in plan.guard_pools:
            if (b > 0 and h > gp) or (b < 0 and l < gp):
                self.done = True
                return None

        if not self.sweep_confirmed:
            self._track_sweep(plan, o, h, l, c)
            return None

        # MSS phase: 1m body close beyond opposing swing, at/after 10:00 [COMMUNITY]
        if not self.mss_confirmed:
            if t < self.p.window_start:
                return None
            if self.mss_level is None:
                self.mss_level = self._find_opposing_swing(b)
                if self.mss_level is None:
                    self.done = True
                    return None
            if (b > 0 and c > self.mss_level) or (b < 0 and c < self.mss_level):
                self.mss_confirmed = True
                self.leg_extreme = h if b > 0 else l
            return None

        # FVG phase: first qualifying 3-candle gap, all bars at/after 10:00 [ICT+OURS]
        self.leg_extreme = max(self.leg_extreme, h) if b > 0 else min(self.leg_extreme, l)
        sig = self._check_fvg(plan, now)
        if sig is not None:
            self.done = True  # one entry per window [COMMUNITY]
        return sig

    # -- sweep tracking ----------------------------------------------------

    def _track_sweep(self, plan: DayPlan, o, h, l, c) -> None:
        b = plan.bias
        for level in plan.sweep_pools:
            st = self.pool_state.setdefault(level, {"pen": False, "extreme": None,
                                                    "bars": 0, "bodies": 0, "dead": False})
            if st["dead"]:
                continue
            beyond = l < level if b > 0 else h > level
            body_beyond = (min(o, c) < level) if b > 0 else (max(o, c) > level)
            closed_back = c > level if b > 0 else c < level
            if not st["pen"]:
                if beyond:
                    st["pen"] = True
                    st["extreme"] = l if b > 0 else h
                    st["bodies"] = 1 if body_beyond else 0
                    st["bars"] = 0
                    # Same-bar close back inside = 1-bar sweep [OURS]
                    if closed_back:
                        self._confirm_sweep(st)
                        return
                continue
            st["bars"] += 1
            st["extreme"] = min(st["extreme"], l) if b > 0 else max(st["extreme"], h)
            st["bodies"] = st["bodies"] + 1 if body_beyond else 0
            if st["bodies"] >= self.p.run_bodies:
                st["dead"] = True  # a run, not a sweep [OURS]
                continue
            if closed_back:
                if st["bars"] <= self.p.sweep_confirm_bars:
                    self._confirm_sweep(st)
                    return
                st["dead"] = True  # took too long to reclaim [OURS]

    def _confirm_sweep(self, st) -> None:
        self.sweep_confirmed = True
        self.swept_extreme = st["extreme"]

    # -- structure ---------------------------------------------------------

    def _find_opposing_swing(self, b: int) -> Optional[float]:
        """Most recent 3-candle swing against the bias, before/during the sweep.

        Long bias: most recent swing HIGH (candle with lower highs both
        sides). Short bias: most recent swing LOW. [ICT 3-candle swing]
        """
        bars = self.recent
        for i in range(len(bars) - 2, 0, -1):
            _, _, h1, l1, _ = bars[i - 1]
            _, _, h2, l2, _ = bars[i]
            _, _, h3, l3, _ = bars[i + 1]
            if b > 0 and h2 > h1 and h2 > h3:
                return h2
            if b < 0 and l2 < l1 and l2 < l3:
                return l2
        return None

    # -- entry -------------------------------------------------------------

    def _check_fvg(self, plan: DayPlan, now: datetime) -> Optional[Signal]:
        p, b = self.p, plan.bias
        if len(self.recent) < 3:
            return None
        (t1, _, h1, l1, _), (t2, _, _, _, _), (t3, _, h3, l3, _) = self.recent[-3:]
        if ny_time(t1).time() < p.window_start:
            return None  # whole triple must sit at/after 10:00 [OURS]
        if b > 0:
            if not h1 < l3:
                return None
            gap_size = (l3 - h1) / PIP
            edge, far = l3, h1
        else:
            if not l1 > h3:
                return None
            gap_size = (l1 - h3) / PIP
            edge, far = h3, l1
        min_size = max(p.min_fvg_pips, p.cost_mult_min_fvg * p.roundtrip_cost_pips)
        if gap_size < min_size:
            return None

        # Discount/premium half of the displacement leg [OURS hardening]
        leg_mid = (self.swept_extreme + self.leg_extreme) / 2.0
        if (b > 0 and edge > leg_mid) or (b < 0 and edge < leg_mid):
            return None

        draw = plan.draw
        stop = self.swept_extreme - p.stop_buffer if b > 0 else self.swept_extreme + p.stop_buffer
        stop_pips = abs(edge - stop) / PIP
        draw_pips = abs(draw - edge) / PIP
        if draw_pips < p.min_draw_distance_pips:          # [ICT]
            return None
        if stop_pips <= 0 or draw_pips < p.min_rr_floor * stop_pips:  # [OURS]
            return None
        cushion = p.target_cushion_pips * PIP
        target = draw - cushion if b > 0 else draw + cushion
        return Signal(
            direction=b, stop_price=stop, entry_type="limit", entry_price=edge,
            target_price=target, cancel_if_touch=draw, cancel_if_body_beyond=far,
            expire_at_ny=p.window_end, tag=f"SB {ny_time(now).date()}",
        )
