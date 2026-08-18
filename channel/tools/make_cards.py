"""Generate Cooked Books quote/stat/end cards (1920x1080) and thumbnails.

Setup: pip install playwright   (Chromium pre-installed at /opt/pw-browsers/chromium)
Usage: edit CARDS below, then  python3 make_cards.py
House style: see channel/tools/README.md. Video 1's set is preserved here.
"""
import html as H
import os

from playwright.sync_api import sync_playwright

# (filename, kind, main_text, attribution/sub_text)
CARDS = [
    ("card-01-quote-stockfall", "quote",
     "During the 2-week period in which Dirks pursued his investigation… the price of "
     "Equity Funding stock fell from $26 per share to less than $15 per share.",
     "Dirks v. SEC, 463 U.S. 646 (1983) — Supreme Court of the United States"),
    ("card-02-quote-firealarm", "quote",
     "…played an important role in bringing the massive fraud to light.",
     "The SEC's own censure order on Ray Dirks — quoted in Dirks v. SEC (1983)"),
    ("card-03-quote-incredible", "quote",
     "…a series of detailed but nearly incredible allegations.",
     "Dirks v. SEC, 681 F.2d 824 (D.C. Cir. 1982) — on Secrist's whistleblower account"),
    ("card-04-quote-wsj", "quote",
     "…did not believe that such a massive fraud could go undetected.",
     "The Supreme Court, on why the Wall Street Journal declined the story"),
    ("card-05-quote-motive", "quote",
     "…motivated by a desire to expose the fraud… received no monetary or personal benefit.",
     "Dirks v. SEC, 463 U.S. 646 (1983) — on the whistleblowers"),
    ("card-06-stat-64000", "stat", "64,000",
     "invented policyholders · $2 billion of life insurance on people who never existed"),
    ("card-07-stat-indictment", "stat", "22 · 105",
     "defendants indicted · federal counts · 1 November 1973"),
    ("card-08-stat-fine", "stat", "$20,000",
     "Stanley Goldblum's fine — against a two-billion-dollar phantom empire"),
    ("card-09-stat-tenyears", "stat", "10 YEARS",
     "for the man who exposed it to clear his own name · decided 1 July 1983"),
    ("card-10-endcard", "end", "NEXT WEEK",
     "The Victorian fraudster who built a ballroom at the bottom of a lake"),
]


def render(kind, a, b):
    if kind == "quote":
        body = (f'<div class="rule"></div><div class="q">“{H.escape(a)}”</div>'
                f'<div class="att">{H.escape(b)}</div>')
    elif kind == "stat":
        body = f'<div class="rule"></div><div class="big">{H.escape(a)}</div><div class="att">{H.escape(b)}</div>'
    else:
        body = (f'<div class="brand">COOKED BOOKS</div><div class="rule"></div>'
                f'<div class="big" style="font-size:120px">{H.escape(a)}</div>'
                f'<div class="att" style="font-size:40px">{H.escape(b)}</div>')
    return f'''<!doctype html><html><head><style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1920px;height:1080px;background:radial-gradient(120% 120% at 30% 30%, #151C23 0%, #0A0E12 100%);
display:flex;align-items:center;justify-content:center;font-family:"DejaVu Sans",Arial,sans-serif}}
.wrap{{max-width:1480px;padding:60px}}
.rule{{width:120px;height:6px;background:#F2A33C;margin-bottom:48px}}
.q{{font-family:"DejaVu Serif",Georgia,serif;font-size:58px;line-height:1.45;color:#E8EDF1;font-style:italic}}
.att{{margin-top:44px;font-size:30px;color:#8FA0AE;letter-spacing:1px;text-transform:uppercase}}
.big{{font-size:220px;font-weight:800;color:#F2A33C;letter-spacing:2px;line-height:1.05}}
.brand{{font-size:44px;font-weight:800;color:#E8EDF1;letter-spacing:14px;margin-bottom:36px}}
</style></head><body><div class="wrap">{body}</div></body></html>'''


def main():
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = br.new_page(viewport={"width": 1920, "height": 1080})
        for name, kind, a, b in CARDS:
            open("card.html", "w").write(render(kind, a, b))
            page.goto("file://" + os.getcwd() + "/card.html")
            page.screenshot(path=f"{name}.png")
            print(name, "done")
        br.close()


if __name__ == "__main__":
    main()
