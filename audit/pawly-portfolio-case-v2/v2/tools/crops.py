"""Pawly Case V2 crops. Usage: python crops.py <captures-dir> <public-out-dir> <manifest.json>

Every crop is a full-width horizontal slice (0..390 CSS px) of a full-document DPR 2 capture. Vertical bounds come
from the measured DOM boxes in captures.json: the union of the named sections, extended by PAD CSS px into the
genuine 12 px gap around them, so rounded card corners and shadows sit on the product's own page surface.
No pixel is painted, masked or retouched; the output is the source crop re-encoded as WebP (quality 90).
"""
import hashlib, json, sys
from pathlib import Path
from PIL import Image

src, dst, manifest_path = map(Path, sys.argv[1:4])
dst.mkdir(parents=True, exist_ok=True)
caps = {}
for f in ('captures.json', 'captures-partial.json'):
    p = src / f
    if p.exists():
        caps.update({c['name']: c for c in json.loads(p.read_text('utf8'))['captures']})

SEARCH = 48  # CSS px: how far an edge may move outward to clear a card's drop shadow (product shadow 0 12 24)
# key: (shot, [(tag, class-prefix, nth match)], purpose)
SPEC = {
    'hero-status':      ('active-service-walking', [('section', '_status', 0), ('section', '_card', 0)], 'Hero: return expected, pickup photo received'),
    'match-list':       ('walker-list', [('section', '_request', 0), ('section', '_results', 0)], '01 Walker list: request and the one recorded match'),
    'match-profile':    ('walker-profile', [('section', '_section', 0)], '01 Walker profile: why this walker fits'),
    # Inner crop: neighbouring panels shadow into the 12 px gaps, so no full-width slice has clean edges here.
    'match-review':     ('booking-review', [('section', '_panel', 0)], '01 Booking review: before you confirm (card interior)', 'inner'),
    'role-owner':       ('active-service-walking', [('section', '_card', 1), ('section', '_card', 2)], '02 Owner: walk updates and a static route preview'),
    'role-walker':      ('walker-order-walking', [('section', '_card _hero', 0), ('section', 'j0wu', 0)], '02 Walker: deadline and handling notes'),
    # V2.1: 'follow' carries the slice on through the next content block below the sections (here the Cancel booking
    # row, which the decision text refers to as "the refund shown below"), up to the next empty run of page surface.
    'branch-reserve':   ('replacement-no-reserve', [('section', '_decision', 0), ('section', '_panel', 0)], '03 Before pickup: no compatible reserve, nobody assigned, cancel with refund', 'follow'),
    'branch-failed':    ('return-failed', [('section', '_proofCard', 0)], '03 At return: sending failed, photo saved'),
    # V2.1: the recovery actions live in each screen's fixed bottom bar, so they are cut as their own slice from the same
    # capture: the footer box below its 1 px top hairline, to the end of the document. Shown under the main slice, apart.
    'branch-reserve-action': ('replacement-no-reserve', [('footer', '_checkout', 0)], '03 Before pickup: the bar action, choose another time or walker', 'footer'),
    'branch-failed-action':  ('return-failed', [('footer', '_screenFooter', 0)], '03 At return: the bar actions, retry confirmation or retake', 'footer'),
    'proof-selected':   ('return-selected', [('section', '_proofCard', 0)], '04 Selected, not sent'),
    'proof-confirmed':  ('return-confirmed', [('section', '_proofCard', 0)], '04 Return confirmed after retry'),
    'proof-report':     ('order-details', [('section', '_hero', 0), ('section', '_card', 0)], '04 Owner report: Baikal is home, how the walk went'),
    'settle-earnings':  ('walker-earnings', [('section', '_care', 0), ('section', '_section', 0)], '05 Walker earnings after the confirmed return'),
    'settle-payment':   ('order-details', [('section', '_card pq6v_153', 0)], '05 Owner payment'),
}


def clean(im, y, ref):
    """A row is clean when every sampled pixel equals the page surface (±2 per channel): no card, border or shadow."""
    return all(max(abs(a - b) for a, b in zip(im.getpixel((x, y)), ref)) <= 2 for x in range(0, 780, 3))


def edge(im, start, step, ref):
    """First clean device row moving outward from a section boundary (plus up to 8 more clean rows). Sections that
    touch a neighbour with no gap fall back to the first clean row inside their own padding, at most 24 CSS px in."""
    def scan(y, direction, limit):
        for _ in range(limit):
            if 0 <= y < im.height and clean(im, y, ref):
                extra = 0
                while extra < 8 and 0 <= y + direction < im.height and clean(im, y + direction, ref):
                    y += direction; extra += 1
                return y
            y += direction
    y = scan(start, step, SEARCH * 2)
    if y is None:
        y = scan(start - step, -step, 48)
        if y is not None:  # inward: keep the clean row itself and stop there
            while clean(im, y + step, ref): y += step
    if y is None:
        raise SystemExit(f'no clean edge within {SEARCH}px out or 24px in from device row {start}')
    return y


def find(cap, tag, prefix, nth):
    seen, hits = set(), []
    for b in cap['blocks']:
        key = (b['y'], b['h'], b['x'])
        if b['tag'] == tag and key not in seen and b['cls'].startswith(prefix):
            seen.add(key)
            hits.append(b)
    return hits[nth]


manifest = []
for key, (shot, parts, purpose, *mode) in SPEC.items():
    for locale in ('en', 'ru'):
        cap = caps[f'{shot}-{locale}']
        boxes = [find(cap, *p) for p in parts]
        full = src / f'{shot}-{locale}-full.png'
        im = Image.open(full).convert('RGB')
        assert im.width == 780, (full, im.size)
        top, bottom = min(b['y'] for b in boxes) * 2, max(b['y'] + b['h'] for b in boxes) * 2
        ref = max((im.getpixel((2, y)) for y in range(top, bottom, 4)), key=sum)  # page surface: brightest margin pixel (shadows only darken)
        if mode == ['inner']:
            # 8 CSS px inside the card on every side: past its 1 px border and inside its 16 px corner arc
            # (corner centre at 16,16; the point 8,8 is 11.3 px from it), so every pixel is card surface.
            b = boxes[0]
            rect = ((b['x'] + 8) * 2, (b['y'] + 8) * 2, (b['x'] + b['w'] - 8) * 2, (b['y'] + b['h'] - 8) * 2)
            ref = im.getpixel((rect[0] + 2, rect[1] + 2))
        elif mode == ['footer']:
            b = boxes[0]
            y0 = b['y'] * 2
            while not clean(im, y0, (255, 255, 255)): y0 += 1  # skip the bar's top hairline
            assert y0 - b['y'] * 2 <= 4, (key, locale, y0)
            y1 = min(b['y'] * 2 + b['h'] * 2, im.height)  # a fixed bar ends with the document (boxes round up a pixel)
            assert clean(im, y1 - 1, (255, 255, 255)), (key, locale, 'footer bottom not clean')
            ref, rect = (255, 255, 255), (0, y0, 780, y1)
        else:
            y0, y1 = edge(im, top - 1, -1, ref), edge(im, bottom, 1, ref) + 1
            if mode == ['follow']:
                y = y1
                while y < y1 + 128 and clean(im, y, ref): y += 1  # next content within 64 CSS px
                assert y < y1 + 128, (key, locale, 'nothing to follow')
                while True:  # content ends at the first run of 16 CSS px of clean page surface
                    run = 0
                    while run < 32 and clean(im, y + run, ref): run += 1
                    if run == 32: break
                    y += run + 1
                y1 = y + 24  # 12 CSS px of the page surface under the last line, as the product's own section gap
                assert all(clean(im, r, ref) for r in range(y, y1)), (key, locale, 'follow tail not clean')
            rect = (0, y0, 780, y1)
        y0, y1 = rect[1], rect[3]
        out = dst / f'{key}-{locale}.webp'
        im.crop(rect).save(out, 'WEBP', quality=90, method=6)
        manifest.append({
            'key': key, 'locale': locale, 'purpose': purpose, 'file': out.as_posix(), 'width': rect[2] - rect[0], 'height': y1 - y0,
            'cssWidth': (rect[2] - rect[0]) // 2, 'source': full.as_posix(), 'sourceSha256': hashlib.sha256(full.read_bytes()).hexdigest(),
            'route': cap['url'], 'fixture': f"{cap['state']} / {cap['step']}", 'cropDevicePx': rect, 'pageSurface': ref,
            'sections': [f"{b['tag']}.{b['cls'][:24]} y{b['y']} h{b['h']}" for b in boxes],
            'sha256': hashlib.sha256(out.read_bytes()).hexdigest(),
        })
        print(f'{key}-{locale}: device y {y0}..{y1} ({(y1 - y0) / 2:.0f} css px), surface {ref}')
manifest_path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + '\n', 'utf8')

# Site media index (src/data/pawly-case-v2-media.json): one entry per locale/key, plus the product's own pickup frame,
# byte-copied from pawly/public/assets/proof/handover-pickup.webp at a327d73 (square, shown uncropped).
import shutil
photo_src = Path('D:/Claude-projects/PETS-walking/public/assets/proof/handover-pickup.webp')
photo = dst / 'pickup-photo.webp'
shutil.copyfile(photo_src, photo)
# V2.1.1: each slice's own page surface and how far it extends above and below the content (clean rows from the edge,
# in CSS px). PawlyShot paints its frame in that surface and pads the short side up to INSET, so the visible screen panel
# has the same field above and below as at its sides. The pixels are not touched; only the frame around them.
INSET = 16
def margins(m):
    im, ref = Image.open(m['file']).convert('RGB'), tuple(m['pageSurface'])
    row = lambda y: all(max(abs(a - b) for a, b in zip(im.getpixel((x, y)), ref)) <= 3 for x in range(0, im.width, 2))
    t = 0
    while t < im.height and row(t): t += 1
    b = 0
    while b < im.height and row(im.height - 1 - b): b += 1
    return t / 2, b / 2
for m in manifest:
    m['surfaceTop'], m['surfaceBottom'] = margins(m)
manifest_path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + '\n', 'utf8')
index = {f"{m['locale']}/{m['key']}": {'src': '/' + Path(m['file']).as_posix().split('public/', 1)[1], 'width': m['width'], 'height': m['height'],
         'surface': '#%02x%02x%02x' % tuple(m['pageSurface']),
         'padTop': max(0, round(INSET - m['surfaceTop'])), 'padBottom': max(0, round(INSET - m['surfaceBottom'])),
         # Interior crops (card surface, no shadow at the sides) also sit 8 px from their text sideways: pad those too.
         'padInline': 8 if 'card interior' in m['purpose'] else 0} for m in manifest}
index['photo/pickup'] = {'src': '/media/pawly-case-v2/pickup-photo.webp', 'width': 900, 'height': 900, 'sha256': hashlib.sha256(photo.read_bytes()).hexdigest()}
Path('src/data/pawly-case-v2-media.json').write_text(json.dumps(index, indent=1) + '\n', 'utf8')
