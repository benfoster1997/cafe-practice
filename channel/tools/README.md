# Channel production tools

Scripts that regenerate the channel's assets in any session. All run on
CPU in the standard remote container.

## Narration — `generate_narration.py`

Regenerates narration WAVs from a `NARRATION_TEXT.md` (per-section, so a
single edited section re-renders in ~1 min). Setup and usage in the
script's docstring. **Voice is locked: Kokoro `bm_george`, speed 0.95,
`en-gb`** — changing it changes the channel's identity; don't.

## Thumbnails & cards — `make_cards.py`

Generates the channel-style quote cards, stat cards, end cards (1920×1080)
and code-drawn thumbnails (1280×720) via HTML → Playwright screenshot.
Setup: `pip install playwright` (Chromium is pre-installed at
`/opt/pw-browsers/chromium`). House style: slate `#0A0E12–#151C23` radial
ground, amber `#F2A33C` accent + rule, serif italic quotes `#E8EDF1`,
uppercase attribution `#8FA0AE`, DejaVu faces. Edit the CARDS list at the
top and run. Video 1's card set + thumbnail were generated with this on
11 Aug 2026 and delivered in `cookedbooks-video1-mediapack.zip`.

## Environment notes

- Egress proxy blocks gov sites (loc.gov, sec.gov, gov.uk,
  support.google.com): court-PDF fetches fail here — the owner screenshots
  those at home (instructions per-video in ASSEMBLY_GUIDE.md).
- Audio/zip deliverables go to the owner via chat file sends, NOT into
  git (keep the repo lean). Text, scripts, and PNG-generating code DO go
  into git so everything is reproducible.
