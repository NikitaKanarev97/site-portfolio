"""Comparison boards from raw captures (no retouching; scaled and placed side by side with labels only).
Usage: python boards.py   (run from the repository root)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

V2 = Path('audit/pawly-portfolio-case-v2/v2')
OUT = V2 / 'comparisons'
OUT.mkdir(exist_ok=True)
BG, INK = (236, 233, 228), (30, 30, 30)
try:
    FONT = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 22)
except OSError:
    FONT = ImageFont.load_default()


def board(panels, out, gap=24, head=44, max_h=None):
    """panels: [(label, image path or Image)]. Images keep their aspect; optional common height cap."""
    ims = [(l, p if isinstance(p, Image.Image) else Image.open(p).convert('RGB')) for l, p in panels]
    if max_h:
        ims = [(l, i.resize((round(i.width * max_h / i.height), max_h)) if i.height > max_h else i) for l, i in ims]
    W = sum(i.width for _, i in ims) + gap * (len(ims) + 1)
    H = max(i.height for _, i in ims) + head + gap
    c = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(c)
    x = gap
    for label, im in ims:
        d.text((x, 10), label, fill=INK, font=FONT)
        c.paste(im, (x, head))
        x += im.width + gap
    c.save(out, quality=86)
    return out


def scaled(path, width):
    im = Image.open(path).convert('RGB')
    return im.resize((width, round(im.height * width / im.width)))


made = []
# 1. First viewport, BEFORE | AFTER, every locale × width.
for loc in ('en', 'ru'):
    for w in (1440, 1024, 768, 390, 360, 320):
        made.append(board([(f'BEFORE · {loc.upper()} {w} · first viewport', V2 / f'before/{loc}-{w}-viewport.png'),
                           (f'AFTER · {loc.upper()} {w} · first viewport', V2 / f'after/{loc}-{w}-viewport.png')],
                          OUT / f'viewport-{loc}-{w}.jpg', max_h=1100))
# 2. Whole page, BEFORE | AFTER, scaled to a common width.
for loc in ('en', 'ru'):
    for w, sw in ((1440, 480), (390, 300)):
        made.append(board([(f'BEFORE · {loc.upper()} {w} · full page', scaled(V2 / f'before/{loc}-{w}-full.png', sw)),
                           (f'AFTER · {loc.upper()} {w} · full page', scaled(V2 / f'after/{loc}-{w}-full.png', sw))],
                          OUT / f'full-{loc}-{w}.jpg'))
# 3. Product evidence: the old case media vs the fresh capture of the same screen (same EN fixture where it exists).
old = Path('public/media/rebuild/pawly/en')
pairs = [('active-service', 'hero-status'), ('walker-profile', 'match-profile'), ('order-details', 'proof-report')]
for o, n in pairs:
    made.append(board([(f'BEFORE · old {o}.webp', scaled(old / f'{o}.webp', 390)),
                       (f'AFTER · {n}-en (a327d73)', scaled(Path('public/media/pawly-case-v2') / f'{n}-en.webp', 390))],
                      OUT / f'media-{o}.jpg'))
# 4. Benchmarks: the saved reference screenshot beside the AFTER chapter that adapts it.
ref = Path('research/portfolio-benchmark/case-blueprint/img')
bench = [
    ('hero', [('H7 tr-quote.jpg', ref / 'tr-quote.jpg'), ('HC Pawly Home cover (accepted)', Path('audit/pawly-home-cover-premium-v1/v1/after/en-1440-pawly.png'))], 'en-1440-section-case-pawly.png'),
    ('choosing', [('H1 ha-phones.jpg', ref / 'ha-phones.jpg')], 'en-1440-section-choosing.png'),
    ('handoff', [('H6 gr-comp.jpg', ref / 'gr-comp.jpg')], 'en-1440-section-handoff.png'),
    ('exceptions', [('H5 dn-diag.jpg', ref / 'dn-diag.jpg')], 'en-1440-section-exceptions.png'),
    ('return', [('Rover · Wag · Pawly cover (benchmark-external.jpg)', Path('audit/pawly-home-cover-premium-v1/v1/comparisons/benchmark-external.jpg'))], 'en-1440-section-return.png'),
    ('settlement', [('H2 ha-components.jpg', ref / 'ha-components.jpg')], 'en-1440-section-settlement.png'),
    ('mobile', [('H6 gr-comp.jpg (mobile UI legibility)', ref / 'gr-comp.jpg'), ('H4 np-hand.jpg', ref / 'np-hand.jpg')], 'en-390-viewport.png'),
]
for name, refs, after in bench:
    panels = [(l, scaled(p, 760) if Image.open(p).width > 760 else p) for l, p in refs]
    a = V2 / 'after' / after
    panels.append((f'AFTER · {after}', scaled(a, 760) if Image.open(a).width > 760 else a))
    made.append(board(panels, OUT / f'benchmark-{name}.jpg', max_h=1500))
print(len(made), 'boards')
