"""Phone regression: full-page pixel diff BEFORE vs AFTER at 390 / 360 / 320. Usage: python regress.py
(repository root, after capture-page.mjs for both sets). V2.1.2 changes no phone layout; the only intended phone change
is the Return plate tone (gray-50 -> the slices' own measured surface, 3/255). For each page: equal heights, and every
differing pixel row grouped into runs, each run attributed to the chapter it falls in, with its worst channel difference.
"""
import json
from pathlib import Path
from PIL import Image, ImageChops

V = Path('audit/pawly-portfolio-case-v2/v2.1.2')
facts = {s: {f['name']: f for f in json.loads((V / s / 'facts.json').read_text('utf8'))} for s in ('before', 'after')}
for loc in ('en', 'ru'):
    for w in (390, 360, 320):
        n = f'{loc}-{w}'
        a, b = (Image.open(V / s / f'{n}-full.png').convert('RGB') for s in ('before', 'after'))
        if a.size != b.size:
            print(n, 'SIZE DIFFERS', a.size, b.size)
            continue
        d = ImageChops.difference(a, b)
        bbox_rows = [y for y in range(d.height) if d.crop((0, y, d.width, y + 1)).getbbox()]
        runs = []
        for y in bbox_rows:
            if runs and y == runs[-1][1] + 1:
                runs[-1][1] = y
            else:
                runs.append([y, y])
        secs = facts['after'][n]['sections']
        where = lambda y: next((s['id'] for s in secs if s['top'] <= y < s['top'] + s['height'] and s['id'] != 'case-pawly'), 'other')
        out = []
        for y0, y1 in runs:
            strip = d.crop((0, y0, d.width, y1 + 1))
            out.append(f"{where(y0)} y{y0}-{y1} max {max(hi for _, hi in strip.getextrema())}")
        print(n, 'height', a.height, 'identical' if not runs else f'{len(runs)} differing runs: ' + '; '.join(out))
