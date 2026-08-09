"""Multi-asset Donchian trend — staged runs per docs/MULTIASSET_PLAN.md.

Usage: python3 scripts/run_multiasset.py <daily_dir> <is|val|verdict> [--confirm]
val and verdict stages require --confirm (run once, only after prior pass).
Verdict window ends 2020-05-14 — the archive's end, recorded as a
data-imposed trim of the registered 2019-2020 window.
"""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backtest.config import CostModel, RiskRails, SymbolSpec, TradeManagement  # noqa: E402
from backtest.daily_strategies import DonchianTrend  # noqa: E402
from backtest.engine import Backtester  # noqa: E402
from backtest.metrics import summarize  # noqa: E402

# name: (pip_size, spread_pips, financing_annual)
SPECS = {
    "SPX500_USD": (1.0, 0.6, 0.03), "NAS100_USD": (1.0, 1.5, 0.03),
    "JP225_USD": (1.0, 10.0, 0.03), "UK100_GBP": (1.0, 1.5, 0.03),
    "FR40_EUR": (1.0, 1.5, 0.03), "AU200_AUD": (1.0, 2.0, 0.03),
    "USB10Y_USD": (0.01, 3.0, 0.01), "USB02Y_USD": (0.01, 2.0, 0.01),
    "DE10YB_EUR": (0.01, 2.0, 0.01), "UK10YB_GBP": (0.01, 3.0, 0.01),
    "XAU_USD": (0.1, 3.0, 0.03), "WTICO_USD": (0.01, 4.0, 0.03),
    "NATGAS_USD": (0.001, 5.0, 0.03), "WHEAT_USD": (0.001, 5.0, 0.03),
    "EUR_USD": (0.0001, 0.6, None), "GBP_USD": (0.0001, 1.0, None),
    "AUD_USD": (0.0001, 0.8, None), "USD_CAD": (0.0001, 1.2, None),
}
STAGES = {"is": ("2006-01-01", "2017-01-01"),
          "val": ("2017-01-01", "2019-01-01"),
          "verdict": ("2019-01-01", "2020-05-15")}
CONFIGS = {"primary(100,50)": (100, 50), "secondary(55,20)": (55, 20)}


def digits_for(pip):
    return {1.0: 1, 0.1: 2, 0.01: 3, 0.001: 4, 0.0001: 5}[pip]


def run_config(daily_dir, entry_n, exit_n, start, end):
    trades = []
    for name, (pip, spread, fin) in SPECS.items():
        df = pd.read_csv(daily_dir / f"{name}.csv", parse_dates=["time"])
        daily = df.set_index("time").sort_index()
        daily = daily[daily.index < end]
        hold = (0.4 if fin is None
                else float(daily["close"].median()) * fin / 365.0 / pip)
        costs = CostModel(spread_pips=spread, commission_per_lot_side=3.5,
                          slippage_pips=spread,  # one extra spread per market fill
                          holding_cost_pips_per_day=round(hold, 3))
        sym = SymbolSpec(name=name, pip_size=pip, pip_value_per_lot=10.0,
                         digits=digits_for(pip))
        strat = DonchianTrend(daily, pip, entry_n=entry_n, exit_n=exit_n)
        bt = Backtester(daily, strat, symbol=sym, costs=costs,
                        rails=RiskRails(1.0, 1, 90.0),
                        mgmt=TradeManagement(partial_fraction=0.0,
                                             final_target_r=1e6),
                        initial_balance=10_000.0)
        for t in bt.run():
            if (pd.Timestamp(start) <= pd.Timestamp(t.entry_time)
                    and t.exit_reason != "data_end"):
                t.tag = f"{name}"
                trades.append(t)
    return sorted(trades, key=lambda t: t.entry_time)


def report(trades, label):
    s = summarize(trades, 10_000.0)
    print(f"\n=== {label}: n={s.n_trades} | exp {s.expectancy_r:+.3f}R | "
          f"PF {s.profit_factor:.2f} | win {s.win_rate_pct:.0f}% | "
          f"maxDD {s.max_drawdown_pct:.1f}% | streak {s.longest_loss_streak}")
    yearly = {}
    classes = {"S": "equity", "N": "equity", "J": "equity", "U": None,
               "F": "equity", "A": None, "X": "commodity", "W": "commodity",
               "D": "bond", "E": "fx", "G": "fx"}
    for t in trades:
        yearly.setdefault(t.entry_time.year, []).append(t.r_multiple)
    years = sorted(yearly)
    for y in years:
        print(f"   {y}: n={len(yearly[y])} {sum(yearly[y]):+.1f}R")
    rolls = [(a, sum(sum(yearly[y]) for y in years if a <= y <= a + 2))
             for a in years if a + 2 <= years[-1]]
    bad = [f"{a}-{a+2}: {r:+.1f}R" for a, r in rolls if r < 0]
    print("   rolling-3y negative windows: " + (", ".join(bad) if bad else "none"))
    return s


def main():
    daily_dir, stage = Path(sys.argv[1]), sys.argv[2]
    if stage in ("val", "verdict") and "--confirm" not in sys.argv:
        raise SystemExit(f"{stage} requires --confirm (run once, after prior pass)")
    start, end = STAGES[stage]
    for label, (en, ex) in CONFIGS.items():
        if stage != "is" and label.startswith("secondary"):
            continue  # only the IS-surviving primary advances
        trades = run_config(daily_dir, en, ex, start, end)
        report(trades, f"{label} {stage.upper()} {start}..{end}")


if __name__ == "__main__":
    main()
