"""Build M1 bid bars from the FX-Data (EA31337) Dukascopy tick archive.

Source: github.com/FX-Data/FX-Data-EURUSD-DS — per-year branches of hourly
tick CSVs (time, bid, ask, bidvol, askvol; UTC). We aggregate ticks to
1-minute bid OHLC and record each minute's mean spread in pips, so the cost
model can be calibrated from measured spreads instead of guesses.

Usage: python3 scripts/prepare_data.py <clone_dir> <out_dir> <year> [year...]
"""
import subprocess
import sys
from pathlib import Path

import pandas as pd

PIP = 0.0001


def process_year(clone: Path, out_dir: Path, year: int) -> None:
    subprocess.run(["git", "-C", str(clone), "fetch", "-q", "--depth", "1",
                    "origin", f"EURUSD-{year}"], check=True)
    frames = []
    for month in range(1, 13):
        rel = f"EURUSD/{year}/{month:02d}"
        r = subprocess.run(["git", "-C", str(clone), "checkout", "-q",
                            "FETCH_HEAD", "--", rel], capture_output=True)
        mdir = clone / rel
        if r.returncode != 0 or not mdir.exists():
            print(f"  {year}-{month:02d}: missing, skipped", flush=True)
            continue
        for f in sorted(mdir.glob("*.csv")):
            df = pd.read_csv(f, header=None,
                             names=["time", "bid", "ask", "bidvol", "askvol"])
            frames.append(df[["time", "bid", "ask"]])
        # Free worktree space as we go; blobs stay in .git.
        subprocess.run(["rm", "-rf", str(mdir)], check=True)
        print(f"  {year}-{month:02d}: {len(frames)} files cumulative", flush=True)

    if not frames:
        print(f"{year}: NO DATA", flush=True)
        return
    ticks = pd.concat(frames, ignore_index=True)
    ticks["time"] = pd.to_datetime(ticks["time"], format="%Y.%m.%d %H:%M:%S.%f",
                                   utc=True)
    # Sanity: ask should be >= bid for essentially every tick; a tiny number
    # of crossed quotes can occur in raw feeds, but a majority means the
    # columns are swapped and we must not silently proceed.
    crossed = (ticks["ask"] < ticks["bid"]).mean()
    if crossed > 0.5:
        raise SystemExit(f"{year}: bid/ask columns look swapped ({crossed:.0%} crossed)")
    ticks = ticks.set_index("time").sort_index()
    o = ticks["bid"].resample("1min").ohlc().dropna()
    spread = ((ticks["ask"] - ticks["bid"]).resample("1min").mean() / PIP)
    bars = o.join(spread.rename("spread_pips")).dropna()
    out = out_dir / f"EURUSD_M1_{year}.csv"
    bars.to_csv(out, index_label="time")
    print(f"{year}: {len(bars)} M1 bars -> {out} | "
          f"median spread {bars['spread_pips'].median():.2f} pips | "
          f"crossed-quote ticks {crossed:.4%}", flush=True)


def main() -> None:
    clone, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    for year in [int(y) for y in sys.argv[3:]]:
        print(f"=== {year}", flush=True)
        process_year(clone, out_dir, year)


if __name__ == "__main__":
    main()
