"""Build daily bars (NY 17:00 close) for the multi-asset universe from the
FutureSharks/financial-data OANDA M1 archive.

Usage: python3 scripts/prepare_multiasset.py <fs_clone_dir> <out_dir>
"""
import subprocess
import sys
from pathlib import Path

import pandas as pd

INSTRUMENTS = [
    "SPX500_USD", "NAS100_USD", "JP225_USD", "UK100_GBP", "FR40_EUR",
    "AU200_AUD", "USB10Y_USD", "USB02Y_USD", "DE10YB_EUR", "UK10YB_GBP",
    "XAU_USD", "WTICO_USD", "NATGAS_USD", "WHEAT_USD",
    "EUR_USD", "GBP_USD", "AUD_USD", "USD_CAD",
]
BASE = "pyfinancialdata/data/currencies/oanda"


def build(clone: Path, out_dir: Path, name: str) -> None:
    rel = f"{BASE}/{name}"
    subprocess.run(["git", "-C", str(clone), "sparse-checkout", "add", rel],
                   check=True, capture_output=True)
    files = sorted((clone / rel).rglob("*.csv"))
    if not files:
        print(f"{name}: NO FILES", flush=True)
        return
    frames = [pd.read_csv(f) for f in files]
    m1 = pd.concat(frames, ignore_index=True)
    m1["time"] = pd.to_datetime(m1["time"], utc=True)
    m1 = m1.set_index("time").sort_index()
    m1 = m1[~m1.index.duplicated(keep="first")]
    # Daily bars on the NY 17:00 boundary: shift +7h so the FX day rolls at
    # midnight of the shifted clock (OANDA stamps are UTC; NY is UTC-4/-5 —
    # a fixed 7h shift keeps the roll within the 16:00-17:00 dead hour in
    # both DST regimes, which is close enough for daily bars).
    shifted = m1.index + pd.Timedelta(hours=7)
    g = m1.groupby(shifted.date)
    daily = pd.DataFrame({
        "open": g["open"].first(), "high": g["high"].max(),
        "low": g["low"].min(), "close": g["close"].last(),
        "bars": g["close"].count(),
    })
    daily = daily[daily["bars"] >= 60]  # drop dead/partial sessions
    daily.index = pd.to_datetime(daily.index)
    out = out_dir / f"{name}.csv"
    daily.drop(columns="bars").to_csv(out, index_label="time")
    print(f"{name}: {len(daily)} days {daily.index[0].date()}..{daily.index[-1].date()}",
          flush=True)


def main():
    clone, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    for name in INSTRUMENTS:
        try:
            build(clone, out_dir, name)
        except Exception as e:  # keep going; report at the end
            print(f"{name}: ERROR {e}", flush=True)


if __name__ == "__main__":
    main()
