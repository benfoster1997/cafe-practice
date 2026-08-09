"""Metrics and demo-gate scoring on hand-built trade lists."""
from datetime import datetime, timezone

from backtest.config import GateCriteria
from backtest.engine import Trade
from backtest.metrics import evaluate_gate, summarize

T = datetime(2024, 7, 10, 14, 0, tzinfo=timezone.utc)


def mk_trade(pnl: float, r: float) -> Trade:
    t = Trade(entry_time=T, direction=1, entry_price=1.1, stop_price=1.099,
              initial_risk=0.001, size_lots=1.0, original_size_lots=1.0)
    t.exit_time = T
    t.exit_price = 1.1
    t.pnl_quote = pnl
    t.r_multiple = r
    return t


def test_summary_arithmetic():
    trades = [mk_trade(100, 1.0), mk_trade(100, 1.0), mk_trade(-100, -1.0),
              mk_trade(-100, -1.0), mk_trade(200, 2.0)]
    s = summarize(trades, initial_balance=10_000)
    assert s.n_trades == 5
    assert abs(s.net_pnl - 200) < 1e-9
    assert abs(s.win_rate_pct - 60.0) < 1e-9
    assert abs(s.profit_factor - 2.0) < 1e-9  # 400 gross win / 200 gross loss
    assert abs(s.expectancy_r - 0.4) < 1e-9
    assert s.longest_loss_streak == 2


def test_gate_passes_on_good_run():
    trades = ([mk_trade(200, 2.0), mk_trade(-100, -1.0)] * 20) + [mk_trade(200, 2.0)]
    s = summarize(trades, initial_balance=10_000)
    passed, reasons = evaluate_gate(s, GateCriteria())
    assert passed, reasons


def test_gate_fails_on_too_few_trades():
    trades = [mk_trade(200, 2.0)] * 10
    s = summarize(trades, initial_balance=10_000)
    passed, reasons = evaluate_gate(s, GateCriteria())
    assert not passed
    assert any("trades" in r for r in reasons if r.startswith("FAIL"))


def test_gate_fails_on_deep_drawdown():
    # Nine big losses in a row dig >10% at 10k scale, then recovery.
    trades = [mk_trade(-150, -1.0)] * 9 + [mk_trade(300, 2.0)] * 40
    s = summarize(trades, initial_balance=10_000)
    passed, reasons = evaluate_gate(s, GateCriteria())
    assert not passed
    assert any("drawdown" in r for r in reasons if r.startswith("FAIL"))
