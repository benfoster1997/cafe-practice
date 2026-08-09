"""Killzone windows must survive both US daylight-saving regimes."""
from datetime import datetime, timezone

from backtest.sessions import KILLZONES, in_killzone, ny_time

UTC = timezone.utc


def test_summer_edt_offset():
    # July: New York is UTC-4, so 14:00 UTC == 10:00 NY.
    ts = datetime(2024, 7, 10, 14, 0, tzinfo=UTC)
    assert ny_time(ts).hour == 10
    assert in_killzone(ts, "ny_am_silver_bullet")


def test_winter_est_offset():
    # January: New York is UTC-5, so 15:00 UTC == 10:00 NY.
    ts = datetime(2024, 1, 10, 15, 0, tzinfo=UTC)
    assert ny_time(ts).hour == 10
    assert in_killzone(ts, "ny_am_silver_bullet")


def test_window_edges_are_half_open():
    inside_last = datetime(2024, 7, 10, 14, 59, tzinfo=UTC)   # 10:59 NY
    at_end = datetime(2024, 7, 10, 15, 0, tzinfo=UTC)          # 11:00 NY
    before = datetime(2024, 7, 10, 13, 59, tzinfo=UTC)         # 09:59 NY
    assert in_killzone(inside_last, "ny_am_silver_bullet")
    assert not in_killzone(at_end, "ny_am_silver_bullet")
    assert not in_killzone(before, "ny_am_silver_bullet")


def test_all_killzones_defined_sanely():
    for name, (start, end) in KILLZONES.items():
        assert start < end, name
