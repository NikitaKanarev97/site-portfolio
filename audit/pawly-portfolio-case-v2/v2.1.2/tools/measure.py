"""Media field measurement, identical for BEFORE and AFTER. Usage: python measure.py <capture-dir> <out.json>

For every product image recorded in facts.json (`media`), reads the full-page DPR 1 capture.
`panel` (V2.1.1): the visible screen panel's own field, clean surface between its content and its edge (see below).
`field`: walks outward from the middle of each panel edge while the pixel stays the colour found 2 px outside that edge (±4 per channel). The walk length
is the image's visual field on that side: the run of one surface before the next edge (a plate edge, a neighbouring
screen, text, a border or the sheet). A 1 px border right outside the image counts as a field of 0-1.
Also reports the gap from the label's bottom to the image's top, and from the image's bottom to its caption's top
(including any field in between), the rendered scale against the DPR 2 capture, and the plate colour.

V2.1.2 adds DOM geometry per image (capture-page.mjs records image, frame = visible screen panel, plate, caption):
`caption.place` is `below` or `beside` (the caption overlaps the image's rows); for `below`, `imgToCaption` runs from the
image's own bottom edge and `panelToCaption` from the panel's bottom edge to the caption's top. `plateField` is the
plate's DOM field above and below the panel; `unevenY` = bottom - top of that field, the unused height a stretched
plate leaves under a shorter screen (0 for a content-height plate). For `beside`: `besideGap` (plate edge to words)
and `centreOffset` (words block centre minus panel centre). Zoom captures (no full page) are skipped.
"""
import json, sys
from pathlib import Path
from PIL import Image

cap, out = Path(sys.argv[1]), Path(sys.argv[2])
facts = json.loads((cap / 'facts.json').read_text('utf8'))
TOL, LIMIT = 4, 400


def walk(im, x, y, dx, dy):
    """A fractional image edge can leave one blended pixel row between the image and the surface. When the walk stops
    at once and that pixel lies between the image's edge pixel and the surface beyond it on every channel, it is a blend,
    not a border: skip it and count it in. A real 1 px border is darker than both sides, so it still measures 0."""
    n, ref = _walk(im, x, y, dx, dy)
    if n == 0 and 0 <= x + 3 * dx < im.width and 0 <= y + 3 * dy < im.height:
        inner, mid, outer = im.getpixel((x - dx, y - dy)), im.getpixel((x, y)), im.getpixel((x + 3 * dx, y + 3 * dy))
        if all(min(i, o) - 2 <= m <= max(i, o) + 2 for i, m, o in zip(inner, mid, outer)):
            n, ref = _walk(im, x + dx, y + dy, dx, dy)
            n = n + 1 if n else 0
    return n, ref


def _walk(im, x, y, dx, dy):
    if not (0 <= x < im.width and 0 <= y < im.height):
        return 0, None
    ref = im.getpixel((x + 2 * dx if 0 <= x + 2 * dx < im.width else x, y + 2 * dy if 0 <= y + 2 * dy < im.height else y))
    n, cx, cy = 0, x, y
    while n < LIMIT and 0 <= cx < im.width and 0 <= cy < im.height:
        p = im.getpixel((cx, cy))
        if max(abs(a - b) for a, b in zip(p, ref)) > TOL:
            break
        n += 1; cx += dx; cy += dy
    return n, ref


# Slice surfaces by published file name (both locales), from the media index crops.py writes.
SURFACE = {Path(v['src']).name: tuple(int(v['surface'][i:i + 2], 16) for i in (1, 3, 5))
           for v in json.loads(Path('src/data/pawly-case-v2-media.json').read_text('utf8')).values() if 'surface' in v}
def geometry(m):
    img, fr, pl, c = m['img'], m.get('frame'), m.get('plate'), m.get('caption')
    g = {}
    if fr and pl:
        top, bottom = fr['y'] - pl['y'], (pl['y'] + pl['h']) - (fr['y'] + fr['h'])
        g['plateField'] = {'top': top, 'bottom': bottom}
        g['unevenY'] = bottom - top
    if c:
        beside = c['y'] < img['y'] + img['h'] and c['y'] + c['h'] > img['y']
        g['caption'] = {'place': 'beside' if beside else 'below'}
        if beside and pl:
            # Side caption: horizontal gap from the plate to the words, and how far the words' block (label + caption)
            # sits from the screen's vertical centre (0 = centred on it).
            lab = m.get('label') or c
            g['besideGap'] = c['x'] - (pl['x'] + pl['w']) if c['x'] >= pl['x'] + pl['w'] else pl['x'] - (c['x'] + c['w'])
            g['centreOffset'] = round((lab['y'] + c['y'] + c['h']) / 2 - (fr or img)['y'] - (fr or img)['h'] / 2)
        if not beside:
            g['imgToCaption'] = c['y'] - (img['y'] + img['h'])
            if fr: g['panelToCaption'] = c['y'] - (fr['y'] + fr['h'])
    return g


rows = []
for f in facts:
    if not (cap / f"{f['name']}-full.png").exists():
        continue
    im = Image.open(cap / f"{f['name']}-full.png").convert('RGB')
    for m in f.get('media', []):
        b = m['img']
        cx, cy = b['x'] + b['w'] // 2, b['y'] + b['h'] // 2
        lab, capb = m.get('label'), m.get('caption')
        natural = Image.open(Path('public/media/pawly-case-v2') / m['src']).width if (Path('public/media/pawly-case-v2') / m['src']).exists() else None
        # V2.1.1 — the visible screen panel. A slice shows its own page surface around its content; whatever continues that
        # exact surface outside the image (±2, so a plate 3/255 away does not count) is part of the same panel. `panel` is
        # clean surface between the content and the panel edge: lines inside the image whose every pixel matches the edge
        # colour, plus the run of that colour outside it. Card shadows are content here, so sides read low where a card's
        # shadow reaches the crop edge.
        def same(p, q, tol=2): return max(abs(x - y) for x, y in zip(p, q)) <= tol
        # Reference = the slice's own page surface as measured by crops.py (src/data/pawly-case-v2-media.json), not the first
        # pixel: the edge row of a scaled image blends with whatever borders it, so it is skipped and counted in.
        surf = SURFACE.get(m['src'])
        def inside(side):
            if surf is None:
                return 0, None
            # Lines are checked 10 px in from each end: the frame's 8 px radius clips the image corners to the plate colour.
            x0, y0, x1, y1 = b['x'] + 10, b['y'] + 1, b['x'] + b['w'] - 10, b['y'] + b['h'] - 2
            yy0, yy1 = b['y'] + 10, b['y'] + b['h'] - 10
            if side in ('top', 'bottom'):
                start, step, end = (y0, 1, y1) if side == 'top' else (y1, -1, y0)
                n, y = 0, start
                while (y - end) * step < 0 and all(same(im.getpixel((x, y)), surf, 3) for x in range(x0, x1, 2)): n += 1; y += step
            else:
                start, step, end = (b['x'] + 1, 1, b['x'] + b['w'] - 2) if side == 'left' else (b['x'] + b['w'] - 2, -1, b['x'] + 1)
                n, x = 0, start
                while (x - end) * step < 0 and all(same(im.getpixel((x, y)), surf, 3) for y in range(yy0, yy1, 2)): n += 1; x += step
            return (n + 1 if n else 0), surf
        def outside(side, ref_):
            if ref_ is None:
                return 0
            dx, dy = {'top': (0, -1), 'bottom': (0, 1), 'left': (-1, 0), 'right': (1, 0)}[side]
            x, y = {'top': (cx, b['y'] - 1), 'bottom': (cx, b['y'] + b['h']), 'left': (b['x'] - 1, cy), 'right': (b['x'] + b['w'], cy)}[side]
            n = 0
            while 0 <= x < im.width and 0 <= y < im.height and same(im.getpixel((x, y)), ref_): n += 1; x += dx; y += dy
            return n
        panel, off = {}, {}
        for side in ('top', 'bottom', 'left', 'right'):
            n, ref_ = inside(side)
            off[side] = outside(side, ref_)
            panel[side] = n + off[side]
        # The plate field is walked from the panel's edge (the image edge when nothing continues it, as in BEFORE).
        top, ref = walk(im, cx, b['y'] - 1 - off['top'], 0, -1)
        bottom, _ = walk(im, cx, b['y'] + b['h'] + off['bottom'], 0, 1)
        left, _ = walk(im, b['x'] - 1 - off['left'], cy, -1, 0)
        right, _ = walk(im, b['x'] + b['w'] + off['right'], cy, 1, 0)
        rows.append({
            'page': f['name'], 'section': m['section'], 'src': m['src'], 'w': b['w'], 'h': b['h'],
            'scale': round(b['w'] / (natural / 2), 2) if natural and 'photo' not in m['src'] else None,
            'panel': panel,
            'field': {'top': top, 'bottom': bottom, 'left': left, 'right': right}, 'surface': '#%02X%02X%02X' % ref if ref else None,
            'labelGap': b['y'] - (lab['y'] + lab['h']) if lab else None,
            'captionGap': capb['y'] - (b['y'] + b['h']) if capb else None,
            **geometry(m),
        })
out.write_text(json.dumps(rows, indent=1) + '\n', 'utf8')
print(f"{len(rows)} images measured -> {out}")
