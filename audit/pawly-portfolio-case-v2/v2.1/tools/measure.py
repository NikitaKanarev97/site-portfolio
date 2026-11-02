"""Media field measurement, identical for BEFORE and AFTER. Usage: python measure.py <capture-dir> <out.json>

For every product image recorded in facts.json (`media`), reads the full-page DPR 1 capture and walks outward from the
middle of each image edge while the pixel stays the colour found 2 px outside that edge (±4 per channel). The walk length
is the image's visual field on that side: the run of one surface before the next edge (a plate edge, a neighbouring
screen, text, a border or the sheet). A 1 px border right outside the image counts as a field of 0-1.
Also reports the gap from the label's bottom to the image's top, and from the image's bottom to its caption's top
(including any field in between), the rendered scale against the DPR 2 capture, and the plate colour.
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


rows = []
for f in facts:
    im = Image.open(cap / f"{f['name']}-full.png").convert('RGB')
    for m in f.get('media', []):
        b = m['img']
        cx, cy = b['x'] + b['w'] // 2, b['y'] + b['h'] // 2
        top, ref = walk(im, cx, b['y'] - 1, 0, -1)
        bottom, _ = walk(im, cx, b['y'] + b['h'], 0, 1)
        left, _ = walk(im, b['x'] - 1, cy, -1, 0)
        right, _ = walk(im, b['x'] + b['w'], cy, 1, 0)
        lab, capb = m.get('label'), m.get('caption')
        natural = Image.open(Path('public/media/pawly-case-v2') / m['src']).width if (Path('public/media/pawly-case-v2') / m['src']).exists() else None
        rows.append({
            'page': f['name'], 'section': m['section'], 'src': m['src'], 'w': b['w'], 'h': b['h'],
            'scale': round(b['w'] / (natural / 2), 2) if natural and 'photo' not in m['src'] else None,
            'field': {'top': top, 'bottom': bottom, 'left': left, 'right': right}, 'surface': '#%02X%02X%02X' % ref if ref else None,
            'labelGap': b['y'] - (lab['y'] + lab['h']) if lab else None,
            'captionGap': capb['y'] - (b['y'] + b['h']) if capb else None,
        })
out.write_text(json.dumps(rows, indent=1) + '\n', 'utf8')
print(f"{len(rows)} images measured -> {out}")
