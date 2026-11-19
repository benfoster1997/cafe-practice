"""Download free M1 forex bars from HistData.com (personal research use).

HistData serves one zip per pair per YEAR for past years and one per MONTH
for the current year. Each download needs a token scraped from the pair's
page, then a POST to get.php with that page as the referer. We go one file
at a time with a pause between requests, and skip anything already on disk.

Usage: python3 fxdesk/scripts/download_histdata.py <out_dir> <first_year> <last_year> PAIR [PAIR...]
"""
import re
import sys
import time
import urllib.parse
import urllib.request
from http.cookiejar import CookieJar
from pathlib import Path

BASE = "https://www.histdata.com/download-free-forex-historical-data/?/ascii/1-minute-bar-quotes"
UA = "Mozilla/5.0 (X11; Linux x86_64)"
PAUSE = 1.5


def fetch(opener, pair: str, year: int, month, out: Path) -> str:
    if out.exists() and out.stat().st_size > 1000:
        return "have"
    page_url = f"{BASE}/{pair.lower()}/{year}" + (f"/{month}" if month else "")
    req = urllib.request.Request(page_url, headers={"User-Agent": UA})
    html = opener.open(req, timeout=60).read().decode("utf-8", "replace")
    m = re.search(r'id="tk" value="([0-9a-f]+)"', html)
    if not m:
        return "no-token"
    datemonth = f"{year}{month:02d}" if month else str(year)
    body = urllib.parse.urlencode({
        "tk": m.group(1), "date": str(year), "datemonth": datemonth,
        "platform": "ASCII", "timeframe": "M1", "fxpair": pair.upper(),
    }).encode()
    req = urllib.request.Request(
        "https://www.histdata.com/get.php", data=body,
        headers={"User-Agent": UA, "Referer": page_url})
    data = opener.open(req, timeout=180).read()
    if not data.startswith(b"PK"):
        return "not-a-zip"
    out.write_bytes(data)
    return f"ok {len(data) // 1024}KB"


def main() -> None:
    out_dir = Path(sys.argv[1])
    y0, y1 = int(sys.argv[2]), int(sys.argv[3])
    pairs = sys.argv[4:]
    out_dir.mkdir(parents=True, exist_ok=True)
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(CookieJar()))
    now = time.gmtime()
    for pair in pairs:
        for year in range(y0, y1 + 1):
            if year < now.tm_year:
                jobs = [(None, out_dir / f"{pair}_{year}.zip")]
            else:
                jobs = [(mth, out_dir / f"{pair}_{year}{mth:02d}.zip")
                        for mth in range(1, now.tm_mon + 1)]
            for month, path in jobs:
                status = "error"
                for attempt in range(3):
                    try:
                        status = fetch(opener, pair, year, month, path)
                        break
                    except Exception as exc:  # network hiccup: back off, retry
                        status = f"error {type(exc).__name__}: {exc}"
                        time.sleep(4 * (attempt + 1))
                print(f"{pair} {year}{'' if not month else f'-{month:02d}'}: {status}",
                      flush=True)
                if not status.startswith("have"):
                    time.sleep(PAUSE)


if __name__ == "__main__":
    main()
