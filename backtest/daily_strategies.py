"""Daily-bar strategy families with published, replicated evidence lineage.

1. TurtleSoup — Connors & Raschke (1995) false-breakout fade: today takes
   out an N-day extreme that is at least `min_age` days old, then closes
   back through it. Fade the failed breakout, stop beyond today's extreme.
   This is the documented ancestor of the ICT liquidity-sweep idea, on the
   timeframe where its geometry clears retail costs.
2. DonchianTrend — classic channel breakout (Turtle S1/S2 lineage,
   time-series momentum family): enter on a close beyond the N-day extreme,
   trail the M-day opposite extreme, no profit target.

Lookahead discipline: every reference level is computed from a window that
ENDS YESTERDAY (shift-by-one), so today's bar can trigger against it but
never contribute to it. Entries are market-at-close of the completed
signal bar; trails update using data through the prior day.
"""
from typing import Optional

import numpy as np
import pandas as pd

from .engine import Signal


def _prep(daily: pd.DataFrame) -> pd.DataFrame:
    df = daily[["open", "high", "low", "close"]].copy()
    df = df[~df.index.duplicated(keep="first")].sort_index()
    return df


class TurtleSoup:
    """entry_mode 'close': market at the reclaim bar's close (conservative).
    entry_mode 'limit': resting limit AT the broken level for `ttl` days —
    the retest entry, closest daily-bar analogue of Connors' original
    intraday stop-entry at the level. stop_mode 'extreme': beyond the sweep
    bar's extreme; 'mid': the sweep bar's midpoint (tighter, snapback
    geometry)."""

    def __init__(self, daily: pd.DataFrame, pip: float, lookback: int = 20,
                 min_age: int = 4, stop_buffer_pips: float = 2.0,
                 max_hold_days: int = 10, entry_mode: str = "close",
                 stop_mode: str = "extreme", limit_ttl_days: int = 2):
        self.df = _prep(daily)
        self.pip = pip
        self.min_age = min_age
        self.max_hold = max_hold_days
        self.entry_mode = entry_mode
        self.stop_mode = stop_mode
        self.limit_ttl = limit_ttl_days
        lo, hi = self.df["low"], self.df["high"]
        # Window ends yesterday: shift(1). Age = days since that extreme printed.
        self.prior_low = lo.rolling(lookback).min().shift(1)
        self.prior_high = hi.rolling(lookback).max().shift(1)
        # Days-ago measured from the SIGNAL day: yesterday (window's last
        # slot, pre-shift) is age 1, not 0.
        rev = np.arange(1, lookback + 1)[::-1]

        def age_of_min(x):
            return rev[int(np.argmin(x))]

        def age_of_max(x):
            return rev[int(np.argmax(x))]

        self.low_age = lo.rolling(lookback).apply(age_of_min, raw=True).shift(1)
        self.high_age = hi.rolling(lookback).apply(age_of_max, raw=True).shift(1)
        self.buffer = stop_buffer_pips * pip
        self.pos = {ts: i for i, ts in enumerate(self.df.index)}

    def __call__(self, history: pd.DataFrame, now) -> Optional[Signal]:
        i = self.pos.get(pd.Timestamp(now))
        if i is None or np.isnan(self.prior_low.iloc[i]):
            return None
        o, h, l, c = self.df.iloc[i][["open", "high", "low", "close"]]
        pl, ph = self.prior_low.iloc[i], self.prior_high.iloc[i]

        def build(direction, level, extreme):
            mid = (h + l) / 2.0
            if direction > 0:
                stop = (extreme - self.buffer if self.stop_mode == "extreme"
                        else min(mid, level) - self.buffer)
            else:
                stop = (extreme + self.buffer if self.stop_mode == "extreme"
                        else max(mid, level) + self.buffer)
            if self.entry_mode == "limit":
                return Signal(direction=direction, stop_price=stop,
                              entry_type="limit", entry_price=level,
                              ttl_bars=self.limit_ttl, tag="soup")
            return Signal(direction=direction, stop_price=stop, tag="soup")

        if l < pl and c > pl and self.low_age.iloc[i] >= self.min_age:
            return build(1, pl, l)
        if h > ph and c < ph and self.high_age.iloc[i] >= self.min_age:
            return build(-1, ph, h)
        return None

    def manage(self, trade, ts):
        # Trading bars held, not calendar days — weekends don't count.
        i_now = self.pos.get(pd.Timestamp(ts))
        i_in = self.pos.get(pd.Timestamp(trade.entry_time))
        if i_now is not None and i_in is not None and i_now - i_in >= self.max_hold:
            return ("exit",)
        return None


class DonchianTrend:
    def __init__(self, daily: pd.DataFrame, pip: float, entry_n: int = 55,
                 exit_n: int = 20):
        self.df = _prep(daily)
        hi, lo = self.df["high"], self.df["low"]
        self.entry_hi = hi.rolling(entry_n).max().shift(1)
        self.entry_lo = lo.rolling(entry_n).min().shift(1)
        self.exit_lo = lo.rolling(exit_n).min().shift(1)
        self.exit_hi = hi.rolling(exit_n).max().shift(1)
        self.pos = {ts: i for i, ts in enumerate(self.df.index)}

    def __call__(self, history: pd.DataFrame, now) -> Optional[Signal]:
        i = self.pos.get(pd.Timestamp(now))
        if i is None or np.isnan(self.entry_hi.iloc[i]):
            return None
        c = self.df["close"].iloc[i]
        if c > self.entry_hi.iloc[i] and not np.isnan(self.exit_lo.iloc[i]):
            return Signal(direction=1, stop_price=float(self.exit_lo.iloc[i]),
                          tag="trend-long")
        if c < self.entry_lo.iloc[i] and not np.isnan(self.exit_hi.iloc[i]):
            return Signal(direction=-1, stop_price=float(self.exit_hi.iloc[i]),
                          tag="trend-short")
        return None

    def manage(self, trade, ts):
        i = self.pos.get(pd.Timestamp(ts))
        if i is None:
            return None
        level = self.exit_lo.iloc[i] if trade.direction > 0 else self.exit_hi.iloc[i]
        if np.isnan(level):
            return None
        return ("stop", float(level))  # engine enforces tighten-only
