"""Performance metrics and the demo-gate scorer.

The gate mirrors docs/PLAN.md section 6 exactly. There is deliberately no
win-rate criterion: win rate can be manufactured by bad reward-to-risk, and
profit factor cannot.
"""
from dataclasses import dataclass

from .config import GateCriteria
from .engine import Trade


@dataclass
class Summary:
    n_trades: int
    net_pnl: float
    win_rate_pct: float
    profit_factor: float
    expectancy_r: float
    max_drawdown_pct: float
    longest_loss_streak: int
    rule_violations: int


def summarize(trades: list[Trade], initial_balance: float) -> Summary:
    closed = [t for t in trades if t.closed]
    n = len(closed)
    if n == 0:
        return Summary(0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0)

    wins = [t.pnl_quote for t in closed if t.pnl_quote > 0]
    losses = [-t.pnl_quote for t in closed if t.pnl_quote < 0]
    gross_win = sum(wins)
    gross_loss = sum(losses)
    profit_factor = gross_win / gross_loss if gross_loss > 0 else float("inf")

    # Equity curve and max drawdown, trade by trade.
    equity = initial_balance
    peak = equity
    max_dd = 0.0
    streak = longest = 0
    for t in closed:
        equity += t.pnl_quote
        peak = max(peak, equity)
        if peak > 0:
            max_dd = max(max_dd, (peak - equity) / peak * 100.0)
        if t.pnl_quote < 0:
            streak += 1
            longest = max(longest, streak)
        else:
            streak = 0

    return Summary(
        n_trades=n,
        net_pnl=sum(t.pnl_quote for t in closed),
        win_rate_pct=len(wins) / n * 100.0,
        profit_factor=profit_factor,
        expectancy_r=sum(t.r_multiple for t in closed) / n,
        max_drawdown_pct=max_dd,
        longest_loss_streak=longest,
        rule_violations=sum(len(t.violations) for t in closed),
    )


def evaluate_gate(s: Summary, gate: GateCriteria = GateCriteria()) -> tuple[bool, list[str]]:
    """Returns (passed, reasons). Reasons list every criterion's verdict."""
    checks = [
        (s.n_trades >= gate.min_trades,
         f"trades: {s.n_trades}/{gate.min_trades} required"),
        (s.net_pnl > 0,
         f"net P&L after costs: {s.net_pnl:+.2f}"),
        (s.profit_factor >= gate.min_profit_factor,
         f"profit factor: {s.profit_factor:.2f} (need >= {gate.min_profit_factor})"),
        (s.max_drawdown_pct <= gate.max_drawdown_pct,
         f"max drawdown: {s.max_drawdown_pct:.1f}% (limit {gate.max_drawdown_pct}%)"),
        (s.rule_violations <= gate.max_rule_violations,
         f"rule violations: {s.rule_violations} (limit {gate.max_rule_violations})"),
    ]
    passed = all(ok for ok, _ in checks)
    reasons = [("PASS  " if ok else "FAIL  ") + msg for ok, msg in checks]
    return passed, reasons
