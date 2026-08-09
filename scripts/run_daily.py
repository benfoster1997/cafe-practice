"""Multi-pair daily-bar backtest for the evidence-based families.

Usage: python3 scripts/run_daily.py <komo_dir> <family: soup|trend> [--val]

Splits (pre-registered):
  IN-SAMPLE   2013-01-01 .. 2018-12-31   (this script's default range)
  VALIDATION  2019-01-01 .. 2020-12-31   (--val; run sparingly)
  VERDICT     2021-01-01 .. 2022-03-31   (NOT runnable here — see
              scripts/verdict_daily.py, to be created only after IS+VAL
              both pass; this script refuses those dates on purpose)

Costs per pair are deliberately retail-pessimistic: full spread, slippage,
commission, and a flat 0.4 pips/day holding charge on multi-day positions
(real swaps are sometimes positive; we never credit them).
"""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel, RiskRails, SymbolSpec, TradeManagement  # noqa: E402
from backtest.daily_strategies import DonchianTrend, TurtleSoup  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import summarize  # noqa: E402

# (spread pips, approx pip value USD/lot at recent rates)
UNIVERSE = {
    "EURUSD": (0.6, 10.0), "GBPUSD": (1.0, 10.0), "AUDUSD": (0.8, 10.0),
    "USDJPY": (0.7, 9.0), "USDCHF": (1.2, 11.0), "USDCAD": (1.2, 7.5),
}
IS_RANGE = ("2013-01-01", "2019-01-01")
VAL_RANGE = ("2019-01-01", "2021-01-01")


def load_pair(komo: Path, pair: str) -> pd.DataFrame:
    df = pd.read_csv(komo / pair / f"{pair}d1.csv", parse_dates=["Date"])
    df = df.set_index("Date").sort_index()
    scale = 1000.0 if "JPY" in pair else 100000.0
    return df[["open", "high", "low", "close"]] / scale


def run_family(komo: Path, family: str, start: str, end: str):
    all_trades, lines = [], []
    for pair, (spread, pipval) in UNIVERSE.items():
        daily = load_pair(komo, pair)
        pip = 0.01 if "JPY" in pair else 0.0001
        # Strategy sees history through `end` only — verdict data never loads.
        daily = daily[daily.index < end]
        sym = SymbolSpec(name=pair, pip_size=pip, pip_value_per_lot=pipval,
                         digits=3 if "JPY" in pair else 5)
        costs = CostModel(spread_pips=spread, commission_per_lot_side=3.5,
                          slippage_pips=0.3, holding_cost_pips_per_day=0.4)
        if family == "soup":
            strat = TurtleSoup(daily, pip)
            mgmt = TradeManagement(partial_fraction=0.5, partial_at_r=1.0,
                                   breakeven_buffer_pips=0.5, final_target_r=2.0)
        else:
            strat = DonchianTrend(daily, pip)
            mgmt = TradeManagement(partial_fraction=0.0, partial_at_r=1.0,
                                   breakeven_buffer_pips=0.0, final_target_r=1e6)
        rails = RiskRails(risk_pct=1.0, max_trades_per_day=1,
                          daily_loss_cutoff_pct=90.0)  # daily bars: cutoff n/a
        bt = Backtester(daily, strat, symbol=sym, costs=costs, rails=rails,
                        mgmt=mgmt, initial_balance=10_000.0)
        trades = [t for t in bt.run()
                  if pd.Timestamp(start) <= pd.Timestamp(t.entry_time) < pd.Timestamp(end)
                  and t.exit_reason != "data_end"]
        for t in trades:
            t.tag = f"{pair} {t.tag}"
        all_trades += trades
        s = summarize(trades, 10_000.0)
        lines.append(f"  {pair}: n={s.n_trades:3d} exp {s.expectancy_r:+.2f}R "
                     f"PF {s.profit_factor:4.2f} win {s.win_rate_pct:3.0f}%")
    return all_trades, lines


def main():
    komo = Path(sys.argv[1])
    family = sys.argv[2]
    period = VAL_RANGE if "--val" in sys.argv else IS_RANGE
    label = "VALIDATION 2019-2020" if "--val" in sys.argv else "IN-SAMPLE 2013-2018"
    trades, lines = run_family(komo, family, *period)
    print(f"=== {family} | {label}")
    print("\n".join(lines))
    s = summarize(sorted(trades, key=lambda t: t.entry_time), 10_000.0)
    print(f"PORTFOLIO: n={s.n_trades} | exp {s.expectancy_r:+.3f}R | "
          f"PF {s.profit_factor:.2f} | win {s.win_rate_pct:.0f}% | "
          f"streak {s.longest_loss_streak}")
    years = sorted({t.entry_time.year for t in trades})
    for y in years:
        yr = [t.r_multiple for t in trades if t.entry_time.year == y]
        print(f"   {y}: n={len(yr)} sumR={sum(yr):+.1f}")


if __name__ == "__main__":
    main()
