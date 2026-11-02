"""V2.1.2 compared layouts as injected CSS on the built page, rendered by explore.mjs (only the empty-CSS entries ship).
Usage (repository root):
  python alternatives.py audit/.../v2.1.2/alternatives/spec.json
  node explore.mjs dist audit/.../v2.1.2/alternatives audit/.../v2.1.2/alternatives/spec.json
  python alternatives.py --boards      -> comparisons/alternatives-{1024,768}-<chapter>-<locale>.jpg
Shipped: 1024 = A-centre, 768 = Alt2-alternating (both the built page, no CSS injected).
"""
import json, sys

ROW = '.pawly-steps, .pawly-proof__grid'
LAST = ':is(.pawly-steps__item, .pawly-proof__item):last-child'
ITEM = ':is(.pawly-steps__item, .pawly-proof__item)'
# Undo the built "final step beside its words" so an alternative can place the third step as a plain figure.
RESET = f"""
{LAST} {{ grid-column: auto !important; grid-template-columns: none !important; }}
{LAST} > .pawly-shot {{ grid-column: auto !important; grid-template-columns: none !important; grid-template-rows: auto 1fr auto !important; }}
{LAST} .pawly-shot__label {{ grid-column: auto !important; grid-row: 1 !important; padding-block-start: 0 !important; }}
{LAST} .pawly-shot__plate {{ grid-column: auto !important; grid-row: 2 !important; }}
{LAST} .pawly-shot__caption {{ grid-column: auto !important; grid-row: 3 !important; margin-block-start: var(--space-4) !important; font-size: var(--size-sm) !important; }}
"""
# The first V2.1.2 build: words pinned to the top of the row, the label level with the screen's top.
TOP = f"""
{LAST} > .pawly-shot {{ grid-template-rows: auto 1fr !important; }}
{LAST} .pawly-shot__label {{ grid-row: 1 !important; padding-block-start: var(--plate-y) !important; }}
{LAST} .pawly-shot__caption {{ grid-row: 2 !important; }}
"""
MIRROR = f"""
{LAST} .pawly-shot__plate {{ grid-column: 2 !important; }}
{LAST} :is(.pawly-shot__label, .pawly-shot__caption) {{ grid-column: 1 !important; }}
"""
LG = {
    'A-top': TOP,
    'A-centre': '',
    'A-mirror-centre': MIRROR,
    'B-stacked': RESET + f"""
{ITEM}:nth-child(1) {{ grid-column: 1 !important; grid-row: 1 !important; }}
{ITEM}:nth-child(2) {{ grid-column: 1 !important; grid-row: 2 !important; }}
{LAST} {{ grid-column: 2 !important; grid-row: 1 / span 2 !important; }}
""",
    'F-centred-orphan': RESET + f"{LAST} {{ grid-column: 1 / -1 !important; justify-self: center; inline-size: calc(50% - var(--gutter) / 2); }}",
    'C-three-columns': RESET + f"{ROW} {{ grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }}",
}
MD_ITEM_SHOT = f'{ITEM} > .pawly-shot'
MD = {
    'Alt2-alternating': '',
    'Alt2-plates-left': f"""
{ITEM}:nth-child(even) > .pawly-shot {{ grid-template-columns: minmax(0, calc(var(--shot-frame) + 2 * var(--plate-x))) minmax(0, 1fr) !important; }}
{ITEM}:nth-child(even) .pawly-shot__plate {{ grid-column: 1 !important; }}
{ITEM}:nth-child(even) :is(.pawly-shot__label, .pawly-shot__caption) {{ grid-column: 2 !important; }}
""",
    # Alternative 1: two screens side by side, the third under them; plate side field cut to 8 so the screens get the most width.
    'Alt1-paired': f"""
{ROW} {{ grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }}
{MD_ITEM_SHOT} {{ grid-template-columns: none !important; grid-template-rows: auto 1fr auto !important; --plate-x: var(--space-2) !important; }}
{ITEM} .pawly-shot__label {{ grid-column: auto !important; grid-row: 1 !important; padding-block-start: 0 !important; }}
{ITEM} .pawly-shot__plate {{ grid-column: auto !important; grid-row: 2 !important; }}
{ITEM} .pawly-shot__caption {{ grid-column: auto !important; grid-row: 3 !important; margin-block-start: var(--space-4) !important; }}
""",
}
spec = []
for loc in ('en', 'ru'):
    for sec in ('choosing', 'return'):
        for name, css in LG.items():
            spec.append({'name': f'lg-{name}-{loc}-{sec}', 'locale': loc, 'width': 1024, 'section': sec, 'css': css})
        for name, css in MD.items():
            spec.append({'name': f'md-{name}-{loc}-{sec}', 'locale': loc, 'width': 768, 'section': sec, 'css': css})
if sys.argv[1] != '--boards':
    json.dump(spec, open(sys.argv[1], 'w'), indent=1)
    print(len(spec), 'renders')
    sys.exit()

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
V = Path('audit/pawly-portfolio-case-v2/v2.1.2')
F = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 26)


def board(names, dst, h):
    ims = []
    for n in names:
        im = Image.open(V / 'alternatives' / f'{n}.png').convert('RGB')
        s = h / im.height if im.height > h else 1
        ims.append((n + (' (shipped)' if n.startswith(('lg-A-centre', 'md-Alt2-alternating')) else ''), im.resize((round(im.width * s), round(im.height * s)))))
    W = sum(i.width for _, i in ims) + 30 * (len(ims) + 1); H = max(i.height for _, i in ims) + 80
    c = Image.new('RGB', (W, H), (236, 233, 228)); g = ImageDraw.Draw(c); x = 30
    for n, i in ims:
        g.text((x, 20), n, fill=(30, 30, 30), font=F); c.paste(i, (x, 64)); x += i.width + 30
    c.save(dst, quality=84)


for loc in ('en', 'ru'):
    for sec in ('choosing', 'return'):
        board([f'lg-{k}-{loc}-{sec}' for k in LG], V / 'comparisons' / f'alternatives-1024-{sec}-{loc}.jpg', 1700)
        board([f'md-{k}-{loc}-{sec}' for k in MD], V / 'comparisons' / f'alternatives-768-{sec}-{loc}.jpg', 2200)
print('alternative boards written')
