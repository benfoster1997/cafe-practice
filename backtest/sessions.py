"""Session and killzone time handling.

All strategy times are defined in New York time (America/New_York) because
that is how ICT defines them; conversion from UTC bar timestamps happens here
and nowhere else, so US/UK daylight-saving changes are handled automatically.

Window times are PROVISIONAL until confirmed by the strategy digest.
"""
from datetime import datetime, time, timezone
from zoneinfo import ZoneInfo

NY = ZoneInfo("America/New_York")

# name -> (start, end) in New York local time, end exclusive
KILLZONES: dict[str, tuple[time, time]] = {
    "ny_am_silver_bullet": (time(10, 0), time(11, 0)),  # PROVISIONAL
    "london_open_silver_bullet": (time(3, 0), time(4, 0)),  # PROVISIONAL
    "ny_pm_silver_bullet": (time(14, 0), time(15, 0)),  # PROVISIONAL
}


def ny_time(ts_utc: datetime) -> datetime:
    """Convert a UTC timestamp to New York local time."""
    if ts_utc.tzinfo is None:
        ts_utc = ts_utc.replace(tzinfo=timezone.utc)
    return ts_utc.astimezone(NY)


def in_window(ts_utc: datetime, window: tuple[time, time]) -> bool:
    """True if the timestamp falls inside [start, end) New York time."""
    start, end = window
    t = ny_time(ts_utc).time()
    return start <= t < end


def in_killzone(ts_utc: datetime, name: str) -> bool:
    return in_window(ts_utc, KILLZONES[name])


def ny_date(ts_utc: datetime):
    """The New York calendar date a timestamp belongs to (for daily limits)."""
    return ny_time(ts_utc).date()
