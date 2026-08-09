"""Silver Bullet strategy — mechanical implementation of ICT_STRATEGY_DIGEST.md §5.

Scope: NY AM window (10:00–11:00 ET) on EURUSD, 1-minute bid bars.

Audit tags: [ICT] = his stated rule, [COMMUNITY] = community codification we
adopted, [OURS] = our resolution where he is silent. See digest §5–§7.

v1 simplifications (documented, to revisit):
- Liquidity pools: previous day H/L, London session H/L, Asian range H/L,
  9:30–10:00 pre-window range H/L. The digest's "15-minute swings since
  8:30" pool is not yet implemented. [OURS]
- The swing buffer for the MSS starts at 9:30 NY; swings formed earlier in
  the morning are not eligible. [OURS]
- News filter: NFP days (first Friday) skipped. CPI/FOMC dates need a
  calendar dataset the backtest environment can't reach; the live EA gets a
  real calendar feed. Backtest results are therefore slightly OPTIMISTIC on
  news handling — flagged in reporting. [OURS]
"""
from dataclasses import dataclass, field
from datetime import datetime, time as dtime
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
    roundtrip_cost_pips: float = 0.75    # set by the runner from the CostModel
    sweep_confirm_bars: int = 5          # [OURS] close back inside within 5 bars
    run_bodies: int = 3                  # [OURS] 3 closes beyond = run, disqualify
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
    sweep_pools: list = field(default_factory=list)   # (level, active_from_ny_minute)
    guard_pools: list = field(default_factory=list)   # bias-side levels beyond open price
    no_trade_reason: str = ""


def _daily_table(bars: pd.DataFrame) -> pd.DataFrame:
    """High/low/bar-count per NY calendar date, Sundays excluded [ICT §5.2a]."""
    ny_idx = bars.index.tz_convert(NY)
    keep = ny_idx.weekday != 6
    b, ni = bars[keep], ny_idx[keep]
    g = b.groupby(ni.date)
    return pd.DataFrame({"high": g["high"].max(), "low": g["low"].min(),
                         "n": g["close"].count()})


def build_day_plans(bars: pd.DataFrame, p: SBParams) -> dict:
    """Precompute per-day bias/pools/draw using ONLY pre-window data.

    Everything here derives from bars strictly before 10:00 NY of the day in
    question (or previous days), so no plan can leak future prices. Whether
    TODAY gets a plan depends only on pre-window data; the completed-day bar
    count filter applies to history days alone (no same-day lookahead).
    """
    ny_idx = bars.index.tz_convert(NY)
    dates = pd.Series(ny_idx.date, index=bars.index)
    ny_minutes = pd.Series(ny_idx.hour * 60 + ny_idx.minute, index=bars.index)
    daily = _daily_table(bars)
    plans: dict = {}
    day_list = list(daily.index)

    for i, day in enumerate(day_list):
        plan = DayPlan()
        plans[day] = plan
        d = pd.Timestamp(day)
        if d.weekday() == 4 and d.day <= 7:
            plan.no_trade_reason = "nfp_day"  # [ICT] NFP = no trading
            continue
        hist = daily.iloc[:i]
        hist = hist[hist["n"] >= 100]  # completed prior days only
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

        midnight_bars = today & (ny_minutes < 60)
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

        # Pools [OURS list, digest §5.3]. Each records when it becomes an
        # eligible sweep source and when its "untapped" check window starts.
        london = today & (ny_minutes >= 120) & (ny_minutes < 300)     # 2:00-5:00
        prev_day_rows = dates == day_list[i - 1]
        asia_prev = prev_day_rows & (ny_minutes >= 1200)              # 20:00+ prev day
        pre_ny = today & (ny_minutes >= 570) & (ny_minutes < 600)     # 9:30-10:00
        prev = hist.iloc[-1]

        def seg_extremes(mask):
            if not mask.any():
                return None, None
            seg = bars.loc[mask]
            return float(seg["high"].max()), float(seg["low"].min())

        lon_h, lon_l = seg_extremes(london)
        asia_h, asia_l = seg_extremes(asia_prev)
        pre_h, pre_l = seg_extremes(pre_ny)

        def untapped(level, is_high, check_mask):
            """Pool still holds stops: nothing traded beyond it after it
            formed (checked over pre-window bars only). [OURS]"""
            if level is None or not check_mask.any():
                return level is not None
            seg = bars.loc[check_mask]
            return (seg["high"].max() < level) if is_high else (seg["low"].min() > level)

        after_midnight = today & (ny_minutes < 570)   # 00:00-9:30
        after_london = today & (ny_minutes >= 300) & (ny_minutes < 570)  # 5:00-9:30

        highs = [(prev["high"], untapped(prev["high"], True, after_midnight), 570),
                 (asia_h, untapped(asia_h, True, after_midnight), 570),
                 (lon_h, untapped(lon_h, True, after_london), 570),
                 (pre_h, True, 600)]
        lows = [(prev["low"], untapped(prev["low"], False, after_midnight), 570),
                (asia_l, untapped(asia_l, False, after_midnight), 570),
                (lon_l, untapped(lon_l, False, after_london), 570),
                (pre_l, True, 600)]
        highs = [(lv, ok, act) for lv, ok, act in highs if lv is not None]
        lows = [(lv, ok, act) for lv, ok, act in lows if lv is not None]

        if plan.bias > 0:
            plan.sweep_pools = [(lv, act) for lv, ok, act in lows if ok]
            draws = [lv for lv, ok, act in highs if ok and lv > price_at_open]
            plan.guard_pools = sorted(set(draws))
            plan.draw = min(draws) if draws else None            # nearest above
        else:
            plan.sweep_pools = [(lv, act) for lv, ok, act in highs if ok]
            draws = [lv for lv, ok, act in lows if ok and lv < price_at_open]
            plan.guard_pools = sorted(set(draws), reverse=True)
            plan.draw = max(draws) if draws else None            # nearest below
        if plan.draw is None or not plan.sweep_pools:
            plan.bias = 0
            plan.no_trade_reason = "no_draw" if plan.draw is None else "no_sweep_pool"
    return plans


class SilverBullet:
    """Stateful per-day machine: sweep -> MSS -> FVG -> limit signal."""

    def __init__(self, bars: pd.DataFrame, params: SBParams = SBParams(),
                 plans: Optional[dict] = None):
        self.p = params
        # Day plans depend only on bias_lookback_days, not on entry-gate
        # params, so calibration sweeps can precompute them once.
        self.plans = plans if plans is not None else build_day_plans(bars, params)
        self._day = None
        self.outcomes: dict = {}  # funnel diagnostics: day -> terminal state
        self._reset_day_state()

    def _classify_day(self):
        """Record how far the previous tradeable day got (diagnostics only)."""
        if self._day is None:
            return
        plan = self.plans.get(self._day)
        if plan is None or plan.bias == 0:
            return
        if self.signaled:
            state = "signaled"
        elif self.mss_confirmed:
            state = "mss_no_fvg"
        elif self.sweep_confirmed:
            state = "sweep_no_mss" if not self.done else "guard_stand_down"
        else:
            state = "no_sweep"
        self.outcomes[self._day] = state

    def _reset_day_state(self):
        self.signaled = False
        self.done = False
        self.pool_state: dict = {}
        self.swept_extreme: Optional[float] = None
        self.sweep_confirmed = False
        self.sweep_end_idx: Optional[int] = None  # index into self.recent
        self.mss_level: Optional[float] = None
        self.mss_confirmed = False
        self.leg_extreme: Optional[float] = None
        self.recent = []  # (time, o, h, l, c) completed bars since 9:30 NY

    def __call__(self, history: pd.DataFrame, now: datetime) -> Optional[Signal]:
        nt = ny_time(now)
        day = nt.date()
        if day != self._day:
            self._classify_day()
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
        minute = nt.hour * 60 + nt.minute

        if not self.sweep_confirmed:
            self._track_sweep(plan, minute, o, h, l, c)
            return None

        # Range-day guard [OURS, digest §6 "both sides swept before fill"]:
        # armed only after OUR sweep; fires when a bias-side pool beyond the
        # window-open price is taken before entry.
        for gp in plan.guard_pools:
            if (b > 0 and h > gp) or (b < 0 and l < gp):
                self.done = True
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
                # fall through: the MSS bar itself may complete the entry FVG
            else:
                return None

        # FVG phase: first qualifying 3-candle gap, all bars at/after 10:00 [ICT+OURS]
        self.leg_extreme = max(self.leg_extreme, h) if b > 0 else min(self.leg_extreme, l)
        sig = self._check_fvg(plan, now)
        if sig is not None:
            self.done = True  # one entry per window [COMMUNITY]
            self.signaled = True
        return sig

    # -- sweep tracking ----------------------------------------------------

    def _track_sweep(self, plan: DayPlan, minute: int, o, h, l, c) -> None:
        b = plan.bias
        for level, active_from in plan.sweep_pools:
            if minute < active_from:
                continue
            st = self.pool_state.setdefault(level, {"pen": False, "extreme": None,
                                                    "bars": 0, "bodies": 0, "dead": False})
            if st["dead"]:
                continue
            beyond = l < level if b > 0 else h > level
            close_beyond = c < level if b > 0 else c > level  # CLOSE, not body edge
            closed_back = c > level if b > 0 else c < level
            if not st["pen"]:
                if beyond:
                    st["pen"] = True
                    st["extreme"] = l if b > 0 else h
                    st["bars"] = 0
                    st["bodies"] = 1 if close_beyond else 0
                    if closed_back:  # same-bar reclaim = 1-bar sweep [OURS]
                        self._confirm_sweep(st)
                        return
                continue
            st["bars"] += 1
            st["extreme"] = min(st["extreme"], l) if b > 0 else max(st["extreme"], h)
            # Reclaim is judged BEFORE the run-death count: a bar that closes
            # back inside is a sweep no matter where it opened. [review fix]
            if closed_back:
                if st["bars"] <= self.p.sweep_confirm_bars:
                    self._confirm_sweep(st)
                    return
                st["dead"] = True  # took too long to reclaim [OURS]
                continue
            if close_beyond:
                st["bodies"] += 1
                if st["bodies"] >= self.p.run_bodies:
                    st["dead"] = True  # a run, not a sweep [OURS]

    def _confirm_sweep(self, st) -> None:
        self.sweep_confirmed = True
        self.swept_extreme = st["extreme"]
        self.sweep_end_idx = len(self.recent) - 1

    # -- structure ---------------------------------------------------------

    def _find_opposing_swing(self, b: int) -> Optional[float]:
        """Most recent 3-candle swing against the bias, formed before or
        during the sweep (never after it). Exact ties on a neighbor extend
        the comparison one candle further out. [ICT swing; digest §6 ties]
        """
        bars = self.recent[: (self.sweep_end_idx or 0) + 1]
        n = len(bars)

        def extreme(i):
            return bars[i][2] if b > 0 else bars[i][3]  # high for longs

        def better(x, y):  # x strictly beyond y in the swing direction
            return x > y if b > 0 else x < y

        for i in range(n - 2, 0, -1):
            v = extreme(i)
            j = i - 1
            while j > 0 and extreme(j) == v:
                j -= 1
            k = i + 1
            while k < n - 1 and extreme(k) == v:
                k += 1
            if j >= 0 and k <= n - 1 and better(v, extreme(j)) and better(v, extreme(k)):
                return v
        return None

    # -- entry -------------------------------------------------------------

    def _check_fvg(self, plan: DayPlan, now: datetime) -> Optional[Signal]:
        p, b = self.p, plan.bias
        if len(self.recent) < 3:
            return None
        (t1, _, h1, l1, _), _, (t3, _, h3, l3, _) = self.recent[-3:]
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
