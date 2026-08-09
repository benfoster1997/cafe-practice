"""Locked-config verification: 2018-2020 stability, then ONE out-of-sample run.

LOCKED (round 4, pre-registered rule; do not edit): London 3-4am ET window,
10-pip stop floor, draw target, 4:30 flatten, wick MSS, c3 FVG window,
min_fvg 0.2, draw distance >= 8 pips, rr floor 1.0, sweep confirm 5 bars.

Stage 1: run on 2018+2019+2020 (in-sample stability; 2018 must not flip it).
Stage 2: ONLY if stage 1 expectancy > 0: run 2020-2022, count 2021+ trades
as the out-of-sample verdict against the demo gate. Run stage 2 once, ever.
"""
import sys
from datetime import time as dtime
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import evaluate_gate, summarize  # noqa: E402
from backtest.sessions import NY  # noqa: E402
from backtest.silver_bullet import SBParams, SilverBullet  # noqa: E402

LOCKED = dict(window_start=dtime(3, 0), window_end=dtime(4, 0),
              sweep_from=dtime(2, 0), min_stop_pips=10.0, target_mode="draw",
              mss_mode="wick", fvg_window="c3", min_fvg_pips=0.2,
              cost_mult_min_fvg=0.0, min_draw_distance_pips=8.0,
              min_rr_floor=1.0, sweep_confirm_bars=5, roundtrip_cost_pips=1.0)
FLATTEN = dtime(4, 30)


def run_years(data_dir, years):
    frames = [pd.read_csv(data_dir / f"EURUSD_M1_{y}.csv", parse_dates=["time"])
              .set_index("time").sort_index() for y in years]
    full = pd.concat(frames).sort_index()
    full = full[~full.index.duplicated(keep="first")]
    ny = full.index.tz_convert(NY)
    mins = ny.hour * 60 + ny.minute
    ohlc = full[["open", "high", "low", "close"]]
    strat = SilverBullet(ohlc, SBParams(**LOCKED))
    bt = Backtester(ohlc[(mins >= 120) & (mins < 970)], strat,
                    costs=CostModel(0.3, 3.5, 0.2), initial_balance=10_000.0,
                    time_exit_ny=FLATTEN)
    return bt.run()


def report(trades, label):
    s = summarize(trades, 10_000.0)
    print(f"{label}: {s.n_trades} trades | exp {s.expectancy_r:+.3f}R | "
          f"PF {s.profit_factor:.2f} | win {s.win_rate_pct:.0f}% | "
          f"maxDD {s.max_drawdown_pct:.1f}% | streak {s.longest_loss_streak}")
    for y in sorted({t.entry_time.year for t in trades}):
        yt = [t for t in trades if t.entry_time.year == y]
        print(f"   {y}: n={len(yt)} sumR={sum(t.r_multiple for t in yt):+.1f}")
    return s


def main():
    data_dir = Path(sys.argv[1])
    stage = sys.argv[2]  # "stability" | "oos"
    if stage == "stability":
        trades = run_years(data_dir, [2018, 2019, 2020])
        report(trades, "IS 2018-2020 (locked config)")
    else:
        trades = run_years(data_dir, [2020, 2021, 2022])
        oos = [t for t in trades if t.entry_time.year >= 2021]
        s = report(oos, "OOS 2021-2022H1 (one-shot verdict)")
        passed, lines = evaluate_gate(s)
        print(f"\nDEMO GATE vs OOS: {'PASS' if passed else 'FAIL'}")
        for ln in lines:
            print("   " + ln)


if __name__ == "__main__":
    main()
