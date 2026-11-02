"""V2.1.2 comparison boards and measurement table from raw captures (scaled and placed side by side with labels only).
Usage: python boards.py   (repository root, after capture-page.mjs, measure.py and seam.py for before/ and after/)

- comparisons/section-<chapter>-<locale>-{desktop,tablet,between,mobile}.jpg: BEFORE | AFTER for the changed chapters
  (choosing, return, handoff) at 1440 / 1024+768 / 1279+1100+900+800 / 390+360+320 (mobile: Return)
- comparisons/full-<locale>-<width>.jpg: whole page BEFORE | AFTER at 1440, 1024 and 768
- comparisons/reference-<chapter>.jpg: the saved reference image(s) | AFTER at 1440, 1024, 768, 390
- FIELDS.md: per image, BEFORE -> AFTER: scale, caption place, image-to-caption, plate field, uneven plate height
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

V = Path('audit/pawly-portfolio-case-v2/v2.1.2')
OUT = V / 'comparisons'
OUT.mkdir(exist_ok=True)
REF = Path('research/portfolio-benchmark/case-blueprint/img')
BG, INK = (236, 233, 228), (30, 30, 30)
FONT = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 24)
CHAPTERS = ['choosing', 'return', 'handoff']
REFS = {'choosing': ['ha-phones.jpg'], 'return': ['tr-quote.jpg', 'ha-phones.jpg'], 'handoff': ['gr-comp.jpg']}


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
    return out


made = []
for ch in CHAPTERS:
    for loc in ('en', 'ru'):
        sec = lambda side, w: V / side / f'{loc}-{w}-section-{ch}.png'
        kinds = [('desktop', [1440], 2200), ('tablet', [1024, 768], 2800), ('between', [1279, 1100, 900, 800], 2800)]
        if ch == 'return':
            kinds.append(('mobile', [390, 360, 320], 3200))
        for kind, widths, h in kinds:
            panels = [(f'BEFORE {w}', sec('before', w)) for w in widths] + [(f'AFTER {w}', sec('after', w)) for w in widths]
            made.append(board(panels, OUT / f'section-{ch}-{loc}-{kind}.jpg', h))
    refs = [(f'REF {r}', REF / r) for r in REFS[ch]]
    made.append(board(refs + [(f'AFTER en {w}', V / 'after' / f'en-{w}-section-{ch}.png') for w in (1440, 1024, 768, 390)],
                      OUT / f'reference-{ch}.jpg', 1600))
for loc in ('en', 'ru'):
    for w in (1440, 1024, 768):
        made.append(board([(f'BEFORE {loc} {w}', V / 'before' / f'{loc}-{w}-full.png'), (f'AFTER {loc} {w}', V / 'after' / f'{loc}-{w}-full.png')],
                          OUT / f'full-{loc}-{w}.jpg', 4000))

# Measurement table, BEFORE -> AFTER, for the chapters this revision changes.
rows = {t: json.loads((V / t / 'media-fields.json').read_text('utf8')) for t in ('before', 'after')}
key = lambda r: (r['page'], r['src'])
before = {key(r): r for r in rows['before']}
WIDTHS = ['1440', '1279', '1100', '1024', '900', '800', '768', '390', '360', '320']


def cap(r):
    if not r or 'caption' not in r:
        return '—'
    if r['caption']['place'] == 'beside':
        return f"beside, gap {r['besideGap']}, centre {r['centreOffset']:+d}"
    return f"below {r['imgToCaption']} (panel {r['panelToCaption']})"


fld = lambda r: f"{r['plateField']['top']}/{r['plateField']['bottom']}" if r and r.get('plateField') else '—'
lines = ['# Pawly V2.1.2 — media geometry, BEFORE (`ba611ba`) → AFTER', '',
         'Measured by `tools/measure.py` from the DOM boxes `tools/capture-page.mjs` records (CSS px, DPR 1 captures).',
         '- **Caption**: `below N (panel M)` = distance from the image\'s own bottom edge (N) and from the visible screen panel\'s',
         '  bottom edge (M) to the caption\'s top. `beside` = the caption sits next to the screen: horizontal gap from the plate,',
         '  and how far the label + caption block\'s centre sits from the panel\'s centre.',
         '- **Plate field**: plate surface above / below the panel. **Uneven**: bottom − top, the unused height a stretched',
         '  plate leaves under a shorter screen. **Scale**: rendered width / native (DPR 2 capture ÷ 2).',
         '- Pixel-based fields (V2.1 method) are still in `before/` and `after/media-fields.json` (`panel`, `field`).', '']
# Summary first: worst below-caption distance per chapter, width and locale.
lines += ['## Worst image-to-caption distance (Choosing and Return)', '', '| locale | width | chapter | BEFORE | AFTER | AFTER: captions beside their screen |', '|---|---|---|---|---|---|']
for loc in ('en', 'ru'):
    for w in ('1440', '1024'):
        for ch in ('choosing', 'return'):
            sel = lambda side: [r for r in rows[side] if r['page'] == f'{loc}-{w}' and r['section'] == ch]
            worst = lambda side: max((r['imgToCaption'] for r in sel(side) if r.get('imgToCaption') is not None), default=None)
            beside = sum(1 for r in sel('after') if r.get('caption', {}).get('place') == 'beside')
            lines.append(f'| {loc} | {w} | {ch} | {worst("before")} | {worst("after")} | {beside} |')
lines.append('')
for loc in ('en', 'ru'):
    lines += [f'## {loc.upper()}', '', '| width | chapter | image | scale BEFORE → AFTER | caption BEFORE | caption AFTER | plate field BEFORE → AFTER | uneven BEFORE → AFTER |', '|---|---|---|---|---|---|---|---|']
    for w in WIDTHS:
        for r in rows['after']:
            if r['page'] != f'{loc}-{w}' or r['section'] not in CHAPTERS:
                continue
            b = before.get(key(r))
            lines.append(f"| {w} | {r['section']} | `{r['src']}` | {b['scale'] if b else '—'} → {r['scale']} | {cap(b)} | {cap(r)} | {fld(b)} → {fld(r)} | "
                         f"{b.get('unevenY', '—') if b else '—'} → {r.get('unevenY', '—')} |")
    lines.append('')
(V / 'FIELDS.md').write_text('\n'.join(lines), 'utf8')
print(len(made), 'boards; FIELDS.md written')
