"""V2.1 comparison boards and field table from raw captures (scaled and placed side by side with labels only).
Usage: python boards.py   (run from the repository root, after capture-page.mjs and measure.py for before/ and after/)

- comparisons/section-<chapter>-<locale>-{desktop,tablet,mobile}.jpg: BEFORE | AFTER at 1440 / 1024+768 / 390+360+320
- comparisons/reference-<chapter>.jpg: the saved reference image(s) this chapter answers to | AFTER 1440 | AFTER 390
- FIELDS.md: per image and width, the measured field (top/bottom/left/right) and rendered scale, BEFORE → AFTER
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

V = Path('audit/pawly-portfolio-case-v2/v2.1')
OUT = V / 'comparisons'
OUT.mkdir(exist_ok=True)
REF = Path('research/portfolio-benchmark/case-blueprint/img')
BG, INK = (236, 233, 228), (30, 30, 30)
try:
    FONT = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 24)
except OSError:
    FONT = ImageFont.load_default()
CHAPTERS = ['hero', 'choosing', 'handoff', 'exceptions', 'return', 'settlement']
# The saved references each chapter is compared with (audit/pawly-portfolio-case-v2/REFERENCES.md, rows H1-H7).
REFS = {
    'hero': ['tr-quote.jpg', 'np-hand.jpg'], 'choosing': ['ha-phones.jpg'], 'handoff': ['gr-comp.jpg'],
    'exceptions': ['dn-diag.jpg'], 'return': ['tr-quote.jpg', 'ha-phones.jpg'], 'settlement': ['ha-components.jpg'],
}


def load(p, max_h):
    im = Image.open(p).convert('RGB')
    return im.resize((round(im.width * max_h / im.height), max_h)) if im.height > max_h else im


def board(panels, out, max_h, gap=28, head=48):
    ims = [(l, load(p, max_h)) for l, p in panels if Path(p).exists()]
    W = sum(i.width for _, i in ims) + gap * (len(ims) + 1)
    H = max(i.height for _, i in ims) + head + gap
    c = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(c)
    x = gap
    for label, im in ims:
        d.text((x, 12), label, fill=INK, font=FONT)
        c.paste(im, (x, head))
        x += im.width + gap
    c.save(out, quality=84)


made = []
for ch in CHAPTERS:
    for loc in ('en', 'ru'):
        sec = lambda side, w: V / side / f'{loc}-{w}-section-{ch}.png'
        for kind, widths, h in (('desktop', [1440], 2200), ('tablet', [1024, 768], 2600), ('mobile', [390, 360, 320], 3200)):
            panels = [(f'BEFORE {w}', sec('before', w)) for w in widths] + [(f'AFTER {w}', sec('after', w)) for w in widths]
            out = OUT / f'section-{ch}-{loc}-{kind}.jpg'
            board(panels, out, h)
            made.append(out)
    refs = [(f'REF {r}', REF / r) for r in REFS[ch]]
    out = OUT / f'reference-{ch}.jpg'
    board(refs + [('AFTER en 1440', V / 'after' / f'en-1440-section-{ch}.png'), ('AFTER en 390', V / 'after' / f'en-390-section-{ch}.png')], out, 1400)
    made.append(out)

# Field table: BEFORE → AFTER per image, EN, every width.
rows = {t: json.loads((V / t / 'media-fields.json').read_text('utf8')) for t in ('before', 'after')}
key = lambda r: (r['page'], r['src'])
before = {key(r): r for r in rows['before']}
fmt = lambda f: f"{f['top']}/{f['bottom']}/{f['left']}/{f['right']}"
lines = ['# Media fields, BEFORE → AFTER', '',
         'Measured by `tools/measure.py` from the full-page DPR 1 captures (`before/`, `after/`), `T/B/L/R` in CSS px.',
         '**Panel**: clean product surface between the screen content and the edge of the visible screen panel (card shadows count',
         'as content, so sides read low where a shadow reaches the crop). **Plate**: one surface from the panel edge to the next edge. Scale = rendered width / native',
         '(DPR 2 capture ÷ 2). Hero photo has no native scale. On shared stages (Choosing and Return at 1440) the bottom field',
         'of a shorter screen runs to the stage edge, so it is larger than its top.', '']
for loc in ('en', 'ru'):
    lines += [f'## {loc.upper()}', '', '| width | chapter | image | panel BEFORE | panel AFTER | plate BEFORE | plate AFTER | scale BEFORE → AFTER | label gap | caption gap |', '|---|---|---|---|---|---|---|---|---|---|']
    for r in rows['after']:
        if not r['page'].startswith(loc):
            continue
        b = before.get(key(r))
        lines.append(f"| {r['page'].split('-')[1]} | {r['section']} | `{r['src']}` | {fmt(b['panel']) if b else 'new'} | {fmt(r['panel'])} | {fmt(b['field']) if b else 'new'} | {fmt(r['field'])} | "
                     f"{(b['scale'] if b else '—')} → {r['scale']} | {(b['labelGap'] if b else '—')} → {r['labelGap']} | {(b['captionGap'] if b else '—')} → {r['captionGap']} |")
    lines.append('')
(V / 'FIELDS.md').write_text('\n'.join(lines), 'utf8')
print(len(made), 'boards;', 'FIELDS.md written')
