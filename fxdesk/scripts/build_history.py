"""Turn downloaded HistData zips into clean UTC M1 arrays, twice over:
  data/histdata/m1/<PAIR>_M1.npz   for Python
  data/histdata/bin/<PAIR>.m1.bin  for the TypeScript backtest

The .bin layout is deliberately trivial so any language can read it:
  8 bytes   little-endian uint64 N (number of bars)
  N * 8     float64 open TIME, seconds since 1970 UTC
  N * 8     float64 open
  N * 8     float64 high
  N * 8     float64 low
  N * 8     float64 close
Also prints a data-quality report per pair.

Usage: python3 fxdesk/scripts/build_history.py PAIR [PAIR...]
"""
import json
import struct
import sys
from pathlib import Path

import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from fxdesk.backtest import data as D  # noqa: E402

ZIPS = Path("data/histdata/zips")
NPZ = Path("data/histdata/m1")
BIN = Path("data/histdata/bin")


def quality(pair: str, m1: pd.DataFrame) -> dict:
    ny = m1.index.tz_convert(D.NY)
    clock = pd.Series(ny.strftime("%H:%M"), index=ny.date)
    dow = pd.Series(ny.day_of_week, index=ny.date)
    fri = clock[dow.values == 4].groupby(level=0).last()
    m15 = D.resample_clock(m1, 15).bars
    n15 = m15.index.tz_convert(D.NY)
    active = m15[(n15.hour >= 2) & (n15.hour < 16) & (n15.day_of_week < 5)]
    asia = m15[(n15.hour >= 19) & (n15.day_of_week < 5)]
    pip = D.PIP[pair]
    jump = (m1["open"] - m1["close"].shift()).abs() / pip
    gap = m1.index.to_series().diff().dt.total_seconds()
    return {
        "pair": pair,
        "bars": int(len(m1)),
        "first": str(m1.index[0]), "last": str(m1.index[-1]),
        "friday_close_at_1659_share": round(float((fri == "16:59").mean()), 3),
        "friday_close_after_1700": int((fri > "17:00").sum()),
        "active_m15_thin_share": round(float((active["n_m1"] < 10).mean()), 4),
        "asia_m15_thin_share": round(float((asia["n_m1"] < 8).mean()), 4),
        "asia_thin_share_by_year": {int(y): round(float(v), 3) for y, v in
                                    (asia["n_m1"] < 8).groupby(asia.index.year).mean().items()},
        "bars_by_year": {int(y): int(v) for y, v in m1.groupby(m1.index.year).size().items()},
        "intra_session_jumps_over_30_pips": int(((jump > 30) & (gap <= 120)).sum()),
        "max_m1_range_pips": round(float(((m1["high"] - m1["low"]) / pip).max()), 1),
    }


def main() -> None:
    BIN.mkdir(parents=True, exist_ok=True)
    report = []
    for pair in sys.argv[1:]:
        info = D.build_pair(pair, ZIPS, NPZ)
        m1 = D.load_m1(pair, NPZ)
        t = (m1.index.as_unit("s").asi8).astype("<f8")
        with open(BIN / f"{pair}.m1.bin", "wb") as f:
            f.write(struct.pack("<Q", len(m1)))
            for arr in (t, m1["open"], m1["high"], m1["low"], m1["close"]):
                f.write(np.ascontiguousarray(np.asarray(arr, dtype="<f8")).tobytes())
        q = quality(pair, m1)
        q["duplicates_dropped"] = info["duplicates_dropped"]
        q["bad_bars_dropped"] = info["bad_bars_dropped"]
        report.append(q)
        print(json.dumps(q), flush=True)
    Path("data/histdata/quality.json").write_text(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
