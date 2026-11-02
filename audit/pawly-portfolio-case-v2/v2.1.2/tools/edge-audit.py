"""Edge audit for the published Pawly V2 crops. Usage: python edge-audit.py <crops.json>

For every final WebP, the outermost 2 device px on each side must be one flat surface: the page colour for
full-width slices, or the card colour for interior crops. Reports the worst per-channel deviation per edge
(WebP quality 90 allows small noise: PASS <= 4) and flags anything that would read as a grey strip,
a cut shadow, a border fragment or a square corner.
"""
import json, sys
from PIL import Image

rows = json.load(open(sys.argv[1], encoding='utf8'))
fail = 0
for m in rows:
    im = Image.open(m['file']).convert('RGB')
    w, h = im.size
    ref = tuple(m['pageSurface']) if 'interior' not in m['purpose'] else im.getpixel((4, 4))
    dev = lambda px: max(abs(a - b) for a, b in zip(px, ref))
    edges = {
        'top': max(dev(im.getpixel((x, y))) for x in range(w) for y in (0, 1)),
        'bottom': max(dev(im.getpixel((x, y))) for x in range(w) for y in (h - 2, h - 1)),
        'left': max(dev(im.getpixel((x, y))) for y in range(h) for x in (0, 1)),
        'right': max(dev(im.getpixel((x, y))) for y in range(h) for x in (w - 2, w - 1)),
    }
    # Full-width slices: a product card legitimately meets the side edges (cards run 16 px in from the screen edge,
    # so the side columns are page surface everywhere; a non-zero value there means a shadow reaching the screen edge).
    bad = {k: v for k, v in edges.items() if v > 4}
    fail += bool(bad)
    print(f"{'FAIL' if bad else 'PASS'} {m['key']}-{m['locale']:2} {w}x{h} " + ' '.join(f'{k}={v}' for k, v in edges.items()))
print(f'{len(rows) - fail}/{len(rows)} pass')
sys.exit(1 if fail else 0)
