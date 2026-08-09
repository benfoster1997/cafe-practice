"""Locked trend-family validation sequence. Config: Donchian (100, 50).

Stages: is (2013-2018) | val (2019-2020, run ONCE) | verdict (2021-2022Q1,
run ONCE, only with --confirm-val-passed after a recorded VAL pass).
Rule: see docs/TREND_PREREG.md (committed before the first val run).
"""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel, RiskRails, SymbolSpec, TradeManagement  # noqa: E402
from backtest.daily_strategies import DonchianTrend  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import summarize  # noqa: E402

UNIVERSE = {
    "EURUSD": (0.6, 10.0), "GBPUSD": (1.0, 10.0), "AUDUSD": (0.8, 10.0),
    "USDJPY": (0.7, 9.0), "USDCHF": (1.2, 11.0), "USDCAD": (1.2, 7.5),
    "EURGBP": (1.0, 12.5), "EURJPY": (1.0, 9.0), "GBPJPY": (1.8, 9.0),
    "AUDJPY": (1.5, 9.0), "EURCHF": (1.8, 11.0),
}
STAGES = {"is": ("2013-01-01", "2019-01-01"),
          "val": ("2019-01-01", "2021-01-01"),
          "verdict": ("2021-01-01", "2022-04-01")}
ENTRY_N, EXIT_N = 100, 50


def main():
    komo, stage = Path(sys.argv[1]), sys.argv[2]
    if stage == "verdict" and "--confirm-val-passed" not in sys.argv:
        raise SystemExit("verdict stage requires --confirm-val-passed")
    start, end = STAGES[stage]
    trades = []
    for pair, (spread, pipval) in UNIVERSE.items():
        df = pd.read_csv(komo / pair / f"{pair}d1.csv", parse_dates=["Date"])
        df = df.set_index("Date").sort_index()
        scale = 1000.0 if "JPY" in pair else 100000.0
        daily = (df[["open", "high", "low", "close"]] / scale)
        daily = daily[daily.index < end]  # later data never loads
        pip = 0.01 if "JPY" in pair else 0.0001
        sym = SymbolSpec(name=pair, pip_size=pip, pip_value_per_lot=pipval,
                         digits=3 if "JPY" in pair else 5)
        costs = CostModel(spread_pips=spread, commission_per_lot_side=3.5,
                          slippage_pips=0.3, holding_cost_pips_per_day=0.4)
        strat = DonchianTrend(daily, pip, entry_n=ENTRY_N, exit_n=EXIT_N)
        bt = Backtester(daily, strat, symbol=sym, costs=costs,
                        rails=RiskRails(1.0, 1, 90.0),
                        mgmt=TradeManagement(partial_fraction=0.0,
                                             final_target_r=1e6),
                        initial_balance=10_000.0)
        for t in bt.run():
            if (pd.Timestamp(start) <= pd.Timestamp(t.entry_time)
                    and t.exit_reason != "data_end"):
                t.tag = f"{pair} {t.tag}"
                trades.append(t)
    trades.sort(key=lambda t: t.entry_time)
    s = summarize(trades, 10_000.0)
    print(f"=== trend(100,50) {stage.upper()} {start}..{end}")
    print(f"n={s.n_trades} | exp {s.expectancy_r:+.3f}R | PF {s.profit_factor:.2f}"
          f" | win {s.win_rate_pct:.0f}% | maxDD {s.max_drawdown_pct:.1f}%"
          f" | streak {s.longest_loss_streak}")
    yearly = {}
    for t in trades:
        yearly[t.entry_time.year] = yearly.get(t.entry_time.year, 0.0) + t.r_multiple
    for y in sorted(yearly):
        print(f"   {y}: {yearly[y]:+.1f}R")
    years = sorted(yearly)
    rolls = [(a, sum(yearly[y] for y in years if a <= y <= a + 2))
             for a in years if a + 2 <= years[-1]]
    for a, r in rolls:
        print(f"   rolling {a}-{a+2}: {r:+.1f}R")


if __name__ == "__main__":
    main()
