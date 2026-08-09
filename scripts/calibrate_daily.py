"""One pre-registered variant sweep for the daily families, IN-SAMPLE only.

SELECTION RULE (pre-registered, same as before; do not edit after results):
  Eligible: >=30 IS trades, expectancy > 0, PF >= 1.2, positive total R in
  at least 4 of 6 IS years (2013-2018). Best PF among eligible with a
  majority-eligible neighborhood. Survivors go to VALIDATION 2019-2020;
  verdict period stays locked.

Soup grid: entry close/limit x stop extreme/mid x hold 4/10 x target 1R/2R.
Trend grid: channels (20,10) (55,20) (100,50).

Usage: python3 scripts/calibrate_daily.py <komo_dir>
"""
import itertools
import sys
from multiprocessing import Pool
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel, RiskRails, SymbolSpec, TradeManagement  # noqa: E402
from backtest.daily_strategies import DonchianTrend, TurtleSoup  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import summarize  # noqa: E402

UNIVERSE = {
    "EURUSD": (0.6, 10.0), "GBPUSD": (1.0, 10.0), "AUDUSD": (0.8, 10.0),
    "USDJPY": (0.7, 9.0), "USDCHF": (1.2, 11.0), "USDCAD": (1.2, 7.5),
}
END_IS = "2019-01-01"

SOUP_GRID = [dict(entry_mode=e, stop_mode=s, max_hold_days=h, target_r=t)
             for e, s, h, t in itertools.product(
                 ["close", "limit"], ["extreme", "mid"], [4, 10], [1.0, 2.0])]
TREND_GRID = [dict(entry_n=a, exit_n=b) for a, b in [(20, 10), (55, 20), (100, 50)]]

_D = {}


def _init(komo_str):
    komo = Path(komo_str)
    for pair in UNIVERSE:
        df = pd.read_csv(komo / pair / f"{pair}d1.csv", parse_dates=["Date"])
        df = df.set_index("Date").sort_index()
        scale = 1000.0 if "JPY" in pair else 100000.0
        _D[pair] = (df[["open", "high", "low", "close"]] / scale)


def _run(job):
    fam, combo = job
    trades = []
    for pair, (spread, pipval) in UNIVERSE.items():
        daily = _D[pair][_D[pair].index < END_IS]
        pip = 0.01 if "JPY" in pair else 0.0001
        sym = SymbolSpec(name=pair, pip_size=pip, pip_value_per_lot=pipval,
                         digits=3 if "JPY" in pair else 5)
        costs = CostModel(spread_pips=spread, commission_per_lot_side=3.5,
                          slippage_pips=0.3, holding_cost_pips_per_day=0.4)
        if fam == "soup":
            kw = {k: v for k, v in combo.items() if k != "target_r"}
            strat = TurtleSoup(daily, pip, **kw)
            mgmt = TradeManagement(partial_fraction=0.5, partial_at_r=1.0,
                                   breakeven_buffer_pips=0.5,
                                   final_target_r=combo["target_r"])
        else:
            strat = DonchianTrend(daily, pip, **combo)
            mgmt = TradeManagement(partial_fraction=0.0, final_target_r=1e6)
        bt = Backtester(daily, strat, symbol=sym, costs=costs,
                        rails=RiskRails(1.0, 1, 90.0), mgmt=mgmt,
                        initial_balance=10_000.0)
        trades += [t for t in bt.run()
                   if t.entry_time.year >= 2013 and t.exit_reason != "data_end"]
    s = summarize(sorted(trades, key=lambda t: t.entry_time), 10_000.0)
    yearly = {}
    for t in trades:
        yearly[t.entry_time.year] = yearly.get(t.entry_time.year, 0.0) + t.r_multiple
    return {"family": fam, **combo, "trades": s.n_trades,
            "exp_r": round(s.expectancy_r, 3), "pf": round(s.profit_factor, 2),
            "win_pct": round(s.win_rate_pct, 1),
            "pos_years": sum(1 for v in yearly.values() if v > 0)}


def main():
    jobs = ([("soup", c) for c in SOUP_GRID] + [("trend", c) for c in TREND_GRID])
    with Pool(6, initializer=_init, initargs=(sys.argv[1],)) as pool:
        results = pool.map(_run, jobs)
    df = pd.DataFrame(results).sort_values(["family", "pf"], ascending=[True, False])
    print(df.to_string(index=False))
    elig = df[(df["trades"] >= 30) & (df["exp_r"] > 0) & (df["pf"] >= 1.2)
              & (df["pos_years"] >= 4)]
    print(f"\nEligible: {len(elig)}/{len(df)}")
    print(elig.to_string(index=False) if len(elig) else
          "RESULT: no eligible config in either family.")


if __name__ == "__main__":
    main()
