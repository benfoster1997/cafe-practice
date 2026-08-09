"""Limit-order semantics: fills, expiry, cancel conditions, same-bar pessimism."""
from datetime import datetime, time as dtime, timezone

from backtest.config import CostModel, TradeManagement
from backtest.data import synthetic_bars
from backtest.engine import Backtester, Signal

UTC = timezone.utc
NO_COSTS = CostModel(spread_pips=0.0, commission_per_lot_side=0.0, slippage_pips=0.0)
MGMT = TradeManagement(partial_fraction=0.5, partial_at_r=1.0,
                       breakeven_buffer_pips=0.0, final_target_r=2.0)
T0 = datetime(2024, 7, 10, 14, 0, tzinfo=UTC)  # 10:00 New York (EDT)


def limit_once(at_ts, **kw):
    state = {"placed": False}

    def strategy(history, now):
        if now == at_ts and not state["placed"]:
            state["placed"] = True
            return Signal(direction=1, stop_price=1.0990, entry_type="limit",
                          entry_price=1.0995, **kw)
        return None
    return strategy


def run(closes, strategy):
    bars = synthetic_bars(T0, closes)
    bt = Backtester(bars, strategy, mgmt=MGMT, initial_balance=10_000.0,
                    costs=NO_COSTS)
    bt.run()
    return bt


def test_limit_fill_partial_then_price_target():
    bt = run([1.1005, 1.1005, 1.0995, 1.0997, 1.1001, 1.1015],
             limit_once(T0.replace(minute=1), target_price=1.1015))
    t = bt.trades[0]
    assert t.entry_price == 1.0995  # limit fill at the level, no slippage
    assert t.exit_reason == "target"
    # 5-pip risk: partial 0.5x at +1R, runner 0.5x to +4R => 2.5R net
    assert abs(t.r_multiple - 2.5) < 1e-9


def test_limit_fill_and_same_bar_stop_is_pessimistic():
    bt = run([1.1005, 1.1005, 1.0985],
             limit_once(T0.replace(minute=1)))
    t = bt.trades[0]
    assert t.exit_reason == "stop"
    assert abs(t.r_multiple - (-1.0)) < 1e-9


def test_unfilled_order_expires_at_window_end():
    # Signal at 10:57 NY, expiry 11:00; the dip to the level comes at 11:02.
    sig_ts = T0.replace(minute=57)
    closes = [1.1005] * 58 + [1.1005, 1.1005, 1.1005, 1.1005, 1.0994]
    bt = run(closes, limit_once(sig_ts, expire_at_ny=dtime(11, 0)))
    assert bt.trades == []


def test_unfilled_order_cancels_when_draw_reached_first():
    bt = run([1.1005, 1.1005, 1.1021, 1.0995],
             limit_once(T0.replace(minute=1), cancel_if_touch=1.1020))
    assert bt.trades == []


def test_unfilled_order_cancels_on_body_through_gap():
    # Bar 2 closes at 1.0999 (below 1.1000) WITHOUT its low reaching the
    # 1.0995 level: premise dead, order pulled. Bar 3's dip would have
    # filled it — too late. No trade.
    bt = run([1.1005, 1.1005, 1.0999, 1.0994],
             limit_once(T0.replace(minute=1), cancel_if_body_beyond=1.1000))
    assert bt.trades == []


def test_touch_outranks_same_bar_body_cancel():
    # Bar 2 both touches the level (low 1.0995) and closes beyond the cancel
    # line (1.0995 < 1.1000). The touch happened before the close finalized,
    # so the order fills; the trade then lives or dies by its stop.
    bt = run([1.1005, 1.1005, 1.0995, 1.0994],
             limit_once(T0.replace(minute=1), cancel_if_body_beyond=1.1000))
    assert len(bt.trades) == 1
    assert bt.trades[0].entry_price == 1.0995


def test_pending_cleared_at_day_boundary():
    closes = [1.1005] * 3
    bars = synthetic_bars(T0, closes)
    # Move the last bar to the next day, dipping through the level.
    idx = list(bars.index)
    idx[-1] = idx[-1].replace(day=11)
    bars.index = idx
    bars.iloc[-1, bars.columns.get_loc("low")] = 1.0990
    bt = Backtester(bars, limit_once(T0.replace(minute=1)), mgmt=MGMT,
                    initial_balance=10_000.0, costs=NO_COSTS)
    bt.run()
    assert bt.trades == []
