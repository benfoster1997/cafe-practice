"""Pins the historical-data conventions the ICT research depends on.

The vendor clock tests use real, dated market events rather than invented
numbers: if these fail, every New York session window in the backtest is
wrong by an hour for part of the year.
"""
import pandas as pd

from fxdesk.backtest import data as D


def utc(stamp: str) -> pd.Timestamp:
    return D.vendor_stamp_to_utc(pd.to_datetime([stamp]))[0]


def test_vendor_clock_follows_european_dst_from_2019():
    # US jobs report, 08:30 New York: 13:30 UTC in winter, 12:30 UTC in summer.
    assert utc("2023-01-06 08:30:00") == pd.Timestamp("2023-01-06 13:30", tz="UTC")
    assert utc("2023-07-07 08:30:00") == pd.Timestamp("2023-07-07 12:30", tz="UTC")
    # 3 Nov 2023: Europe had left summer time, the US had not. The vendor
    # stamped the 12:30 UTC release at 07:30, proving it follows Europe.
    assert utc("2023-11-03 07:30:00") == pd.Timestamp("2023-11-03 12:30", tz="UTC")
    # Friday close in the March mismatch weeks is stamped 15:59 (20:59 UTC).
    assert utc("2025-03-14 15:59:00") == pd.Timestamp("2025-03-14 20:59", tz="UTC")


def test_vendor_clock_follows_us_dst_before_2019():
    # 2015-2018 files end the week at stamp 16:59 even in the March mismatch
    # weeks, i.e. New York local time: 16:59 EDT = 20:59 UTC.
    assert utc("2017-03-17 16:59:00") == pd.Timestamp("2017-03-17 20:59", tz="UTC")
    assert utc("2017-01-13 16:59:00") == pd.Timestamp("2017-01-13 21:59", tz="UTC")
    assert utc("2017-07-14 16:59:00") == pd.Timestamp("2017-07-14 20:59", tz="UTC")


def test_both_rules_agree_at_the_changeover_year_boundary():
    assert utc("2018-12-31 12:00:00") == pd.Timestamp("2018-12-31 17:00", tz="UTC")
    assert utc("2019-01-02 12:00:00") == pd.Timestamp("2019-01-02 17:00", tz="UTC")


def _m1(start: str, minutes: int, price: float = 1.1) -> pd.DataFrame:
    idx = pd.date_range(start, periods=minutes, freq="1min", tz="UTC")
    return pd.DataFrame({"open": price, "high": price + 0.001,
                         "low": price - 0.001, "close": price}, index=idx)


def test_daily_bar_runs_1700_to_1700_new_york_in_winter_and_summer():
    # Winter: 17:00 New York = 22:00 UTC.
    w = D.resample_ny(_m1("2025-01-13 22:00", 3 * 1440), 24).bars
    assert list(w.index.tz_convert(D.NY).hour) == [17, 17, 17]
    assert (w["close_time"] - w.index == pd.Timedelta(hours=24)).all()
    # Summer: 17:00 New York = 21:00 UTC.
    s = D.resample_ny(_m1("2025-07-14 21:00", 3 * 1440), 24).bars
    assert list(s.index.tz_convert(D.NY).hour) == [17, 17, 17]


def test_h4_bars_are_anchored_to_the_new_york_close():
    b = D.resample_ny(_m1("2025-07-14 21:00", 1440), 4).bars
    assert list(b.index.tz_convert(D.NY).hour) == [17, 21, 1, 5, 9, 13]


def test_closed_before_never_returns_a_bar_that_is_still_forming():
    frame = D.resample_clock(_m1("2025-07-14 12:00", 45), 15)
    now = pd.Timestamp("2025-07-14 12:29", tz="UTC")
    done = frame.closed_before(now)
    assert len(done) == 1 and done.index[0] == pd.Timestamp("2025-07-14 12:00", tz="UTC")
    assert len(frame.closed_before(pd.Timestamp("2025-07-14 12:30", tz="UTC"))) == 2


def test_trading_day_assigns_sunday_evening_to_monday():
    sunday_evening = pd.Timestamp("2025-07-13 21:30", tz="UTC")  # 17:30 NY Sunday
    assert str(D.trading_day(sunday_evening)) == "2025-07-14"
    before_close = pd.Timestamp("2025-07-14 20:59", tz="UTC")  # 16:59 NY Monday
    assert str(D.trading_day(before_close)) == "2025-07-14"
    after_close = pd.Timestamp("2025-07-14 21:00", tz="UTC")  # 17:00 NY Monday
    assert str(D.trading_day(after_close)) == "2025-07-15"
