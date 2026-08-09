"""Calibrate [OURS]-tagged Silver Bullet parameters on IN-SAMPLE years only.

PRE-REGISTERED SELECTION RULE (written before any results were seen; do not
edit after):
  Eligible configs must have, on the in-sample years combined:
    - >= 30 trades
    - expectancy > 0 after full costs
    - profit factor >= 1.2
    - positive total R in at least 2 of the 3 in-sample years (stability)
  Among eligible configs, choose the one with the best profit factor whose
  GRID NEIGHBORS (one step in any single dimension) are also eligible in
  majority — a spike surrounded by failures is overfit, not edge. If NO
  config is eligible, the honest result is "no edge at these translations"
  and that is what gets reported.

Usage: python3 scripts/calibrate.py <data_dir> <year> [year...]  (IS years)
"""
import itertools
import sys
from datetime import time as dtime
from multiprocessing import Pool
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import summarize  # noqa: E402
from backtest.sessions import NY  # noqa: E402
from backtest.silver_bullet import SBParams, SilverBullet, build_day_plans  # noqa: E402

GRID = {
    "min_fvg_pips": [0.3, 0.6, 1.0],
    "cost_mult_min_fvg": [1.0, 2.0],
    "min_draw_distance_pips": [8.0, 15.0],
    "min_rr_floor": [1.0, 1.5],
    "sweep_confirm_bars": [5, 10],
}

_SHARED = {}


def _init(bars, plans, engine_bars, costs):
    _SHARED.update(bars=bars, plans=plans, engine_bars=engine_bars, costs=costs)


def _run_config(combo: dict) -> dict:
    params = SBParams(roundtrip_cost_pips=_SHARED["costs"].spread_pips
                      + 2 * _SHARED["costs"].commission_per_lot_side / 10.0,
                      **combo)
    strat = SilverBullet(_SHARED["bars"], params, plans=_SHARED["plans"])
    bt = Backtester(_SHARED["engine_bars"], strat, costs=_SHARED["costs"],
                    initial_balance=10_000.0, time_exit_ny=dtime(11, 30))
    trades = bt.run()
    s = summarize(trades, 10_000.0)
    yearly = {}
    for t in trades:
        yearly.setdefault(t.entry_time.year, []).append(t.r_multiple)
    pos_years = sum(1 for rs in yearly.values() if sum(rs) > 0)
    return {**combo, "trades": s.n_trades, "exp_r": round(s.expectancy_r, 3),
            "pf": round(s.profit_factor, 2), "win_pct": round(s.win_rate_pct, 1),
            "max_dd": round(s.max_drawdown_pct, 1), "pos_years": pos_years,
            "per_year": {y: len(rs) for y, rs in sorted(yearly.items())}}


def main() -> None:
    data_dir = Path(sys.argv[1])
    years = [int(y) for y in sys.argv[2:]]
    frames = [pd.read_csv(data_dir / f"EURUSD_M1_{y}.csv", parse_dates=["time"])
              .set_index("time").sort_index() for y in years]
    full = pd.concat(frames).sort_index()
    full = full[~full.index.duplicated(keep="first")]

    ny_idx = full.index.tz_convert(NY)
    ny_min = ny_idx.hour * 60 + ny_idx.minute
    am = full[(ny_min >= 570) & (ny_min < 690)]
    spread_cost = max(0.3, round(float(am["spread_pips"].quantile(0.75)), 2))
    costs = CostModel(spread_pips=spread_cost, commission_per_lot_side=3.5,
                      slippage_pips=0.2)
    ohlc = full[["open", "high", "low", "close"]]
    plans = build_day_plans(ohlc, SBParams())
    engine_bars = ohlc[(ny_min >= 540) & (ny_min < 720)]
    print(f"IS years {years} | spread {spread_cost} pips | "
          f"{sum(1 for p in plans.values() if p.bias != 0)} tradeable days",
          flush=True)

    keys = list(GRID)
    combos = [dict(zip(keys, vals)) for vals in itertools.product(*GRID.values())]
    with Pool(6, initializer=_init,
              initargs=(ohlc, plans, engine_bars, costs)) as pool:
        results = pool.map(_run_config, combos)

    df = pd.DataFrame(results).sort_values("pf", ascending=False)
    out = data_dir / "calibration_results.csv"
    df.to_csv(out, index=False)
    print(df.to_string(index=False))

    def eligible(r):
        return (r["trades"] >= 30 and r["exp_r"] > 0 and r["pf"] >= 1.2
                and r["pos_years"] >= 2)

    elig = df[df.apply(eligible, axis=1)]
    print(f"\nEligible configs: {len(elig)}/{len(df)}")
    if elig.empty:
        print("RESULT: no edge at these translations on the in-sample years.")
    else:
        print("Top eligible (verify neighbor stability before locking):")
        print(elig.head(10).to_string(index=False))


if __name__ == "__main__":
    main()
