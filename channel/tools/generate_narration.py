"""Regenerate the channel's narration audio from a NARRATION_TEXT.md file.

Setup (fresh container, ~10 min):
    pip install kokoro-onnx soundfile
    # model files (~340MB total):
    #   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    #   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

Usage:
    python3 generate_narration.py <NARRATION_TEXT.md> [section-name]
    # e.g. regenerate only act 3 after a script edit:
    python3 generate_narration.py ../video-01-equity-funding/NARRATION_TEXT.md 04-act3

Channel voice is locked: bm_george, speed 0.95, en-gb (see channel/STATUS.md).
Sections are '## SECTION <name>' headings; blank lines separate paragraphs
(0.7s pause inserted between them).
"""
import re
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE, SPEED, LANG, PAUSE_S = "bm_george", 0.95, "en-gb", 0.7


def parse_sections(path):
    text = open(path).read()
    sections = {}
    for m in re.split(r"^## SECTION ", text, flags=re.M)[1:]:
        name, _, body = m.partition("\n")
        paras = [p.strip().replace("\n", " ") for p in body.split("\n\n")
                 if p.strip() and not p.strip().startswith("#")]
        sections[name.strip()] = paras
    return sections


def main():
    src = sys.argv[1]
    only = sys.argv[2] if len(sys.argv) > 2 else None
    kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
    for name, paras in parse_sections(src).items():
        if only and name != only:
            continue
        parts, sr = [], 24000
        for para in paras:
            samples, sr = kokoro.create(para, voice=VOICE, speed=SPEED, lang=LANG)
            parts.append(samples)
            parts.append(np.zeros(int(sr * PAUSE_S), dtype=samples.dtype))
        audio = np.concatenate(parts)
        out = f"narration-{name}.wav"
        sf.write(out, audio, sr)
        print(f"{out}: {len(audio)/sr/60:.1f} min")


if __name__ == "__main__":
    main()
