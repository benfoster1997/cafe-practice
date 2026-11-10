"""Historical bar data for the ICT intraday research (M1 in, M15/H1/H4/D1 out).

SOURCE. HistData.com "ASCII M1" files: one row per minute,
    YYYYMMDD HHMMSS;open;high;low;close;volume
Prices are BID quotes and the timestamp is the bar's OPEN time.

THE VENDOR CLOCK IS NOT WHAT THE VENDOR SAYS IT IS. HistData documents its
stamps as "EST without daylight saving" (UTC-5 all year). Measured on the
files themselves (10 Nov 2026, EURUSD 2019/2023/2025) that is false:
  * the US jobs report, released 08:30 New York time, spikes at stamp 08:30
    in July as well as January (fixed EST would put it at 07:30 in July);
  * the week ends at stamp 16:59 on Fridays all year, EXCEPT the Fridays
    between the US and European clock changes (second Sunday of March to
    the last Sunday of March; last Sunday of October to the first Sunday of
    November), when it ends at 15:59 and the jobs report lands at 07:30.
Both facts fit exactly one clock: UTC-5 in European winter, UTC-4 in
European summer - an MT4-style broker server on Eastern European Time
(UTC+2/+3, EUROPEAN daylight-saving dates) with seven hours subtracted.
So: stamp + 7 hours is wall-clock time in Eastern European Time, and that
is converted to UTC with the proper zone rules.
That holds for 2019 onward. For 2015-2018 the same Friday-close test shows
the vendor clock following the US clock changes instead (the week ends at
stamp 16:59 even in the March and October/November mismatch weeks), i.e.
plain New York local time. The two rules agree outside the mismatch weeks
and both give UTC-5 at the 2018/2019 year boundary, so the switch is clean. Getting this wrong shifts
every New York session window by an hour for about seven months a year,
which for a method built on New York clock times is fatal.
tests/test_fxdesk_data.py pins the conversion to those measured events.
We convert to UTC once, here, and nothing downstream ever sees the vendor
clock.

BAR CONVENTIONS (the same ones the live app must use):
  * every bar is stamped with its OPEN time, in UTC;
  * M15 and H1 bars sit on clock quarter-hours / hours;
  * the trading DAY runs 17:00 -> 17:00 New York time (the forex
    convention, and what an MT5 broker on a GMT+2/+3 server shows), so a
    week has five daily bars and Sunday evening belongs to Monday;
  * H4 bars are anchored to that same 17:00 New York open
    (17, 21, 01, 05, 09, 13 New York time).
A higher-timeframe bar is only ever complete once its LAST minute has
closed; `closed_before()` is the single helper strategies use to ask "which
bars were finished at time T", so no strategy can peek into a bar that is
still forming.
"""
from __future__ import annotations

import io
import zipfile
from dataclasses import dataclass
from pathlib import Path
from zoneinfo import ZoneInfo

import numpy as np
import pandas as pd

NY = ZoneInfo("America/New_York")
VENDOR_SERVER_TZ = ZoneInfo("Europe/Helsinki")  # EET/EEST, European DST rules
VENDOR_SHIFT = pd.Timedelta(hours=7)  # vendor stamp = server wall time - 7h
VENDOR_EU_RULE_FROM_YEAR = 2019  # earlier files follow the US clock changes

PIP = {
    "EURUSD": 0.0001, "GBPUSD": 0.0001, "AUDUSD": 0.0001, "NZDUSD": 0.0001,
    "USDCAD": 0.0001, "USDCHF": 0.0001, "USDJPY": 0.01,
}
DIGITS = {p: (3 if p.endswith("JPY") else 5) for p in PIP}


def read_histdata_zip(path: Path) -> pd.DataFrame:
    """One HistData zip -> M1 bars indexed by UTC open time."""
    with zipfile.ZipFile(path) as z:
        name = next(n for n in z.namelist() if n.lower().endswith(".csv"))
        raw = z.read(name)
    df = pd.read_csv(io.BytesIO(raw), sep=";", header=None,
                     names=["stamp", "open", "high", "low", "close", "volume"],
                     dtype={"stamp": str})
    df.index = vendor_stamp_to_utc(
        pd.to_datetime(df["stamp"], format="%Y%m%d %H%M%S"))
    df.index.name = "time"
    # The market is shut at the hour the server clock changes (03:00-04:00
    # server time on a Sunday), so no real bar can be ambiguous or
    # nonexistent; anything that is gets dropped rather than guessed.
    return df.loc[~df.index.isna(), ["open", "high", "low", "close"]]


def vendor_stamp_to_utc(stamps) -> pd.DatetimeIndex:
    """HistData stamps -> UTC (see the module docstring for the evidence)."""
    stamps = pd.DatetimeIndex(stamps)
    eu = ((stamps + VENDOR_SHIFT)
          .tz_localize(VENDOR_SERVER_TZ, ambiguous="NaT", nonexistent="NaT")
          .tz_convert("UTC"))
    us = (stamps.tz_localize(NY, ambiguous="NaT", nonexistent="NaT")
          .tz_convert("UTC"))
    return eu.where(stamps.year >= VENDOR_EU_RULE_FROM_YEAR, us)


def build_pair(pair: str, zips_dir: Path, out_dir: Path) -> dict:
    """Concatenate every zip for a pair, validate, and cache as .npz."""
    files = sorted(zips_dir.glob(f"{pair}_*.zip"))
    if not files:
        raise FileNotFoundError(f"no zips for {pair} in {zips_dir}")
    df = pd.concat([read_histdata_zip(f) for f in files]).sort_index()
    dup = int(df.index.duplicated().sum())
    df = df[~df.index.duplicated(keep="first")]
    bad = ((df["high"] < df["low"])
           | (df["high"] < df[["open", "close"]].max(axis=1))
           | (df["low"] > df[["open", "close"]].min(axis=1))
           | (df[["open", "high", "low", "close"]] <= 0).any(axis=1))
    n_bad = int(bad.sum())
    df = df[~bad]
    out_dir.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(
        out_dir / f"{pair}_M1.npz",
        # as_unit("s") first: pandas may hold these stamps at second or
        # nanosecond resolution depending on version, and asi8 follows it.
        t=df.index.as_unit("s").asi8.astype(np.int64),
        o=df["open"].to_numpy(np.float64), h=df["high"].to_numpy(np.float64),
        l=df["low"].to_numpy(np.float64), c=df["close"].to_numpy(np.float64))
    return {"pair": pair, "files": len(files), "bars": len(df),
            "first": str(df.index[0]), "last": str(df.index[-1]),
            "duplicates_dropped": dup, "bad_bars_dropped": n_bad}


def load_m1(pair: str, data_dir: Path) -> pd.DataFrame:
    z = np.load(data_dir / f"{pair}_M1.npz")
    idx = pd.to_datetime(z["t"], unit="s", utc=True)
    return pd.DataFrame({"open": z["o"], "high": z["h"], "low": z["l"],
                         "close": z["c"]}, index=pd.Index(idx, name="time"))


# ---------------------------------------------------------------- resampling

@dataclass(frozen=True)
class Frame:
    """Bars of one timeframe. `open_time` and `close_time` are UTC; a bar is
    usable by a strategy only at or after its close_time."""
    minutes: int
    bars: pd.DataFrame  # index = open time (UTC); open/high/low/close/close_time

    def closed_before(self, now) -> pd.DataFrame:
        """Bars whose final minute has finished at instant `now` (UTC)."""
        return self.bars[self.bars["close_time"] <= now]


def _agg(m1: pd.DataFrame, key: pd.Series, span: pd.Timedelta) -> pd.DataFrame:
    g = m1.groupby(key.to_numpy())
    out = pd.DataFrame({
        "open": g["open"].first(), "high": g["high"].max(),
        "low": g["low"].min(), "close": g["close"].last(),
        "n_m1": g["open"].size(),
    })
    out.index = pd.DatetimeIndex(out.index, tz="UTC", name="time")
    out["close_time"] = out.index + span
    return out


def resample_clock(m1: pd.DataFrame, minutes: int) -> Frame:
    """M5/M15/H1 bars on clock boundaries (identical in UTC and New York,
    because both offsets are whole hours)."""
    key = m1.index.floor(f"{minutes}min")
    return Frame(minutes, _agg(m1, pd.Series(key), pd.Timedelta(minutes=minutes)))


def _ny_anchor_floor(idx: pd.DatetimeIndex, hours: int) -> pd.DatetimeIndex:
    """Floor each UTC instant to the latest `hours`-block boundary counted
    from 17:00 New York time, honouring daylight saving."""
    local = idx.tz_convert(NY)
    # Shift so that 17:00 NY becomes midnight, floor on the wall clock, shift
    # back. Flooring is done on naive wall time so a DST change cannot split
    # or merge a block.
    wall = local.tz_localize(None) - pd.Timedelta(hours=17)
    floored = wall.floor(f"{hours}h") + pd.Timedelta(hours=17)
    back = floored.tz_localize(NY, ambiguous="NaT", nonexistent="shift_forward")
    return back.tz_convert("UTC")


def resample_ny(m1: pd.DataFrame, hours: int) -> Frame:
    """H4 (hours=4) or D1 (hours=24) bars anchored to 17:00 New York."""
    key = _ny_anchor_floor(m1.index, hours)
    bars = _agg(m1[~key.isna()], pd.Series(key[~key.isna()]),
                pd.Timedelta(hours=hours))
    # Wall-clock block length is `hours`, but across a DST change the UTC
    # span differs by an hour, so derive close_time from the NY wall clock.
    local_open = bars.index.tz_convert(NY).tz_localize(None)
    close_wall = local_open + pd.Timedelta(hours=hours)
    bars["close_time"] = (pd.DatetimeIndex(close_wall)
                          .tz_localize(NY, ambiguous="NaT",
                                       nonexistent="shift_forward")
                          .tz_convert("UTC"))
    if hours == 24:
        # Drop stub "days" made only of a few stray weekend ticks.
        bars = bars[bars["n_m1"] >= 60]
    return Frame(hours * 60, bars)


def trading_day(ts_utc: pd.Timestamp):
    """The forex trading day (a date) that a UTC instant belongs to: the
    New York date of the 17:00 close that ends it."""
    local = ts_utc.tz_convert(NY)
    return (local + pd.Timedelta(hours=7)).date()
