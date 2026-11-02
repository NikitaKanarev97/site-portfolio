"""Return surface seams, BEFORE and AFTER. Usage: python seam.py <capture-dir> <out.json>

For every Return screen in facts.json (1x and the 200% zoom runs), reads <name>-section-return.png. The section is
full-bleed, so a document point (x, y) is pixel ((x) * dpr, (y - section top) * dpr). Three surfaces meet at each edge
of a screen: the slice's own edge pixels (`img`), the panel padding PawlyShot paints in the measured surface (`pad`)
and the plate (`plate`). Sampled at the middle of the top and bottom edges and 24 CSS px in from each corner, 3 CSS px
from the boundary on each side; reports the worst per-channel difference img↔pad and pad↔plate, and the corner pixel
(inside the panel's rounded corner) against the plate. 0-2 is invisible; the V2.1.1 gray-50 plate was 3/255 away.
"""
import json, sys
from pathlib import Path
from PIL import Image

cap, out = Path(sys.argv[1]), Path(sys.argv[2])
facts = json.loads((cap / 'facts.json').read_text('utf8'))
diff = lambda p, q: max(abs(a - b) for a, b in zip(p, q))
rows = []
for f in facts:
    png = cap / f"{f['name']}-section-return.png"
    sec = next((s for s in f['sections'] if s['id'] == 'return'), None)
    if not png.exists() or not sec:
        continue
    im = Image.open(png).convert('RGB')
    dpr = round(im.width / f['width'])
    px = lambda x, y: im.getpixel((min(im.width - 1, round(x * dpr)), min(im.height - 1, round((y - sec['top']) * dpr))))
    for m in f['media']:
        if m['section'] != 'return' or not m.get('frame') or not m.get('plate'):
            continue
        i, fr = m['img'], m['frame']
        worst = {'imgPad': 0, 'padPlate': 0, 'cornerPlate': 0}
        for x in (i['x'] + 24, i['x'] + i['w'] // 2, i['x'] + i['w'] - 24):
            for edge_img, edge_fr, s in ((i['y'], fr['y'], -1), (i['y'] + i['h'], fr['y'] + fr['h'], 1)):
                inner = px(x, edge_img - s * 3) if s > 0 else px(x, edge_img + 3)
                pad = px(x, (edge_img + edge_fr) / 2) if abs(edge_fr - edge_img) >= 6 else inner
                plate = px(x, edge_fr + s * 3)
                worst['imgPad'] = max(worst['imgPad'], diff(inner, pad))
                worst['padPlate'] = max(worst['padPlate'], diff(pad, plate))
        for cx, cy, sx, sy in ((fr['x'], fr['y'], 1, 1), (fr['x'] + fr['w'], fr['y'], -1, 1), (fr['x'], fr['y'] + fr['h'], 1, -1), (fr['x'] + fr['w'], fr['y'] + fr['h'], -1, -1)):
            corner = px(cx + sx * 1, cy + sy * 1)
            plate = px(cx - sx * 3, cy + sy * 24) if 0 <= cx - sx * 3 < f['width'] else corner
            worst['cornerPlate'] = max(worst['cornerPlate'], diff(corner, plate))
        rows.append({'page': f['name'], 'dpr': dpr, 'src': m['src'], **worst})
out.write_text(json.dumps(rows, indent=1) + '\n', 'utf8')
print(len(rows), 'screens; worst imgPad', max(r['imgPad'] for r in rows), 'padPlate', max(r['padPlate'] for r in rows), 'cornerPlate', max(r['cornerPlate'] for r in rows))
