"""Configuration objects for the backtest harness.

Values here mirror docs/PLAN.md. Anything marked PROVISIONAL is a placeholder
awaiting Phase 1 (strategy digest) or Phase 2 (calibration) and must not be
treated as final.
"""
from dataclasses import dataclass


@dataclass(frozen=True)
class SymbolSpec:
    """Contract arithmetic for one instrument."""
    name: str = "EURUSD"
    pip_size: float = 0.0001
    pip_value_per_lot: float = 10.0  # USD per pip per 1.0 lot
    min_lot: float = 0.01
    lot_step: float = 0.01
    digits: int = 5  # price decimals; all computed levels round to this


@dataclass(frozen=True)
class CostModel:
    """All trading costs, deliberately pessimistic.

    Defaults approximate a Pepperstone Razor account plus a safety margin:
    spread is set above the typical raw spread, and every market order pays
    slippage. A strategy that only survives with optimistic costs is not a
    strategy.
    """
    spread_pips: float = 0.3
    commission_per_lot_side: float = 3.0  # USD per 1.0 lot, each side
    slippage_pips: float = 0.2  # applied to every market-order fill


@dataclass(frozen=True)
class RiskRails:
    """Hard limits enforced by the engine regardless of strategy opinion."""
    risk_pct: float = 1.0  # % of equity risked per trade
    max_trades_per_day: int = 2
    daily_loss_cutoff_pct: float = 2.0  # stop trading for the day at -2%


@dataclass(frozen=True)
class TradeManagement:
    """Owner-selected management scheme (PLAN.md section 4)."""
    partial_fraction: float = 0.5  # fraction closed at the partial target
    partial_at_r: float = 1.0  # partial target in R multiples
    breakeven_buffer_pips: float = 0.2  # stop moves to entry + buffer after partial
    final_target_r: float = 2.0  # PROVISIONAL: runner target pending calibration


@dataclass(frozen=True)
class GateCriteria:
    """The demo gate (PLAN.md section 6). No win-rate criterion on purpose."""
    min_trades: int = 40
    min_profit_factor: float = 1.5
    max_drawdown_pct: float = 10.0
    max_rule_violations: int = 0
