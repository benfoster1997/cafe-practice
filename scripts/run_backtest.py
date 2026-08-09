"""Run the Silver Bullet backtest over prepared M1 data.

Usage: python3 scripts/run_backtest.py <data_dir> <year> [year...]

The LAST year listed is treated as out-of-sample and gets the gate verdict.
Costs: spread = 75th percentile of measured NY-morning spread (floored at
0.3 pips) + 0.2 pips slippage + $3.50/lot/side commission — deliberately
above typical raw-account conditions.
"""
import sys
from collections import Counter
from datetime import time as dtime
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import evaluate_gate, summarize  # noqa: E402
from backtest.sessions import NY  # noqa: E402
from backtest.silver_bullet import SilverBullet  # noqa: E402


def load_year(data_dir: Path, year: int) -> pd.DataFrame:
    df = pd.read_csv(data_dir / f"EURUSD_M1_{year}.csv", parse_dates=["time"])
    return df.set_index("time").sort_index()


def main() -> None:
    data_dir = Path(sys.argv[1])
    years = [int(y) for y in sys.argv[2:]]
    frames = {y: load_year(data_dir, y) for y in years}
    full = pd.concat([frames[y] for y in years]).sort_index()
    full = full[~full.index.duplicated(keep="first")]

    ny_idx = full.index.tz_convert(NY)
    ny_min = ny_idx.hour * 60 + ny_idx.minute
    am = full[(ny_min >= 570) & (ny_min < 690)]  # 9:30-11:30 NY
    spread_p50 = am["spread_pips"].median()
    spread_p75 = am["spread_pips"].quantile(0.75)
    spread_cost = max(0.3, round(float(spread_p75), 2))
    print(f"Measured NY-AM spread: median {spread_p50:.2f} / p75 {spread_p75:.2f} pips"
          f" -> modelled spread {spread_cost} pips + 0.2 slippage + $3.5/side")

    costs = CostModel(spread_pips=spread_cost, commission_per_lot_side=3.5,
                      slippage_pips=0.2)
    strategy = SilverBullet(full[["open", "high", "low", "close"]])

    reasons = Counter(p.no_trade_reason or "tradeable" for p in strategy.plans.values())
    print(f"\nDay census ({sum(reasons.values())} days): "
          + ", ".join(f"{k}={v}" for k, v in reasons.most_common()))

    engine_bars = full[(ny_min >= 540) & (ny_min < 720)][["open", "high", "low", "close"]]
    bt = Backtester(engine_bars, strategy, costs=costs, initial_balance=10_000.0,
                    time_exit_ny=dtime(11, 30))
    trades = bt.run()

    print(f"\n=== ALL YEARS {years[0]}-{years[-1]}: {len(trades)} trades, "
          f"final balance {bt.balance:,.2f}")
    for y in years:
        yt = [t for t in trades if t.entry_time.year == y]
        s = summarize(yt, 10_000.0)
        tag = " (OUT-OF-SAMPLE)" if y == years[-1] else ""
        print(f"\n--- {y}{tag}: {s.n_trades} trades | win {s.win_rate_pct:.0f}% | "
              f"PF {s.profit_factor:.2f} | expectancy {s.expectancy_r:+.2f}R | "
              f"maxDD {s.max_drawdown_pct:.1f}% | worst streak {s.longest_loss_streak}")
        by_reason = Counter(t.exit_reason for t in yt)
        print(f"    exits: {dict(by_reason)}")

    oos = [t for t in trades if t.entry_time.year == years[-1]]
    s = summarize(oos, 10_000.0)
    passed, lines = evaluate_gate(s)
    print(f"\n=== DEMO-GATE CRITERIA vs OUT-OF-SAMPLE {years[-1]}: "
          f"{'PASS' if passed else 'FAIL'}")
    for line in lines:
        print("   " + line)


if __name__ == "__main__":
    main()
