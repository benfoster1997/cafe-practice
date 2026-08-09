"""Bar data loading and validation.

The harness consumes 1-minute OHLC bars with a UTC datetime index. Real data
arrives via CSV (scripts/download_data.py documents acquisition); tests use
the synthetic builder so the engine's arithmetic is verified independently of
any data vendor.
"""
from datetime import datetime, timedelta, timezone

import pandas as pd

REQUIRED = ["open", "high", "low", "close"]


def load_m1_csv(path: str) -> pd.DataFrame:
    """Load M1 bars from CSV with columns: time, open, high, low, close[, volume].

    `time` must be UTC (ISO format or epoch seconds).
    """
    df = pd.read_csv(path)
    cols = {c.lower().strip(): c for c in df.columns}
    missing = [c for c in ["time", *REQUIRED] if c not in cols]
    if missing:
        raise ValueError(f"CSV missing columns: {missing}")
    df = df.rename(columns={v: k for k, v in cols.items()})
    df["time"] = pd.to_datetime(df["time"], utc=True)
    df = df.set_index("time").sort_index()
    df = df[~df.index.duplicated(keep="first")]
    bad = df[(df["high"] < df["low"])
             | (df["high"] < df[["open", "close"]].max(axis=1))
             | (df["low"] > df[["open", "close"]].min(axis=1))]
    if len(bad):
        raise ValueError(f"{len(bad)} bars violate OHLC sanity (first: {bad.index[0]})")
    return df[REQUIRED + (["volume"] if "volume" in df.columns else [])]


def synthetic_bars(start_utc: datetime, closes: list[float],
                   spread_range: float = 0.0) -> pd.DataFrame:
    """Deterministic M1 bars from a list of close prices, for tests.

    Each bar's high/low extends `spread_range` beyond the open/close span so
    tests can trigger (or avoid) intrabar stop/target touches precisely.
    """
    if start_utc.tzinfo is None:
        start_utc = start_utc.replace(tzinfo=timezone.utc)
    rows = []
    prev = closes[0]
    for i, c in enumerate(closes):
        o = prev
        rows.append({
            "time": start_utc + timedelta(minutes=i),
            "open": o,
            "high": max(o, c) + spread_range,
            "low": min(o, c) - spread_range,
            "close": c,
        })
        prev = c
    return pd.DataFrame(rows).set_index("time")
