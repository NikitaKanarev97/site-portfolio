"""Reproducible asset audit for the Robert 01 typography package."""
from pathlib import Path
from hashlib import sha256
import json
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[2]
source = root / 'node_modules/@fontsource-variable/onest'
assets = []
for subset, text in [('latin', 'Nikita Kanarev Complex systems Clear decisions 2026'),
                     ('cyrillic', 'Никита Канарев Сложные системы Ясные решения Ёё')]:
    name = f'onest-{subset}-wght-normal.woff2'
    file = root / 'public/fonts' / name
    font = TTFont(file)
    cmap = font.getBestCmap()
    missing = [c for c in set(text) if ord(c) not in cmap and not c.isspace()]
    entry = {'file': str(file.relative_to(root)), 'bytes': file.stat().st_size,
             'sha256': sha256(file.read_bytes()).hexdigest(),
             'matches_fontsource': file.read_bytes() == (source / 'files' / name).read_bytes(),
             'axes': [{ 'tag': a.axisTag, 'min': a.minValue, 'max': a.maxValue }
                      for a in font['fvar'].axes], 'missing': missing}
    assert entry['matches_fontsource'] and not missing, entry
    assets.append(entry)

for weight in [400, 500, 800]:
    file = root / f'scripts/og-fonts/Onest-{weight}.ttf'
    font = TTFont(file)
    cmap = font.getBestCmap()
    text = 'Nikita Kanarev Никита Канарев Ёё 2026'
    missing = [c for c in set(text) if ord(c) not in cmap and not c.isspace()]
    entry = {'file': str(file.relative_to(root)), 'bytes': file.stat().st_size,
             'sha256': sha256(file.read_bytes()).hexdigest(),
             'weight': font['OS/2'].usWeightClass, 'variable': 'fvar' in font,
             'family': font['name'].getDebugName(1), 'missing': missing}
    assert entry['weight'] == weight and not entry['variable'] and not missing, entry
    assets.append(entry)

license_source = (source / 'LICENSE').read_bytes()
for file in [root / 'public/fonts/OFL-Onest.txt', root / 'scripts/og-fonts/OFL-Onest.txt']:
    # The source uses LF; local copied license may use CRLF.
    assert file.read_bytes().replace(b'\r\n', b'\n') == license_source.replace(b'\r\n', b'\n'), file

tokens_match = (root / 'ds/tokens.css').read_bytes() == (root / 'src/styles/tokens.css').read_bytes()
assert tokens_match
report = {'date': '2026-10-07', 'assets': assets, 'licenses_match': True, 'tokens_byte_equal': tokens_match}
(Path(__file__).parent / 'font-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('PASS: Latin/Cyrillic coverage, variable axes, static OG weights, licenses, byte-identical tokens')
