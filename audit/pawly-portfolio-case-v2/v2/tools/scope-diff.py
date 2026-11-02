"""Scope proof: compare two built sites file by file. Usage: python scope-diff.py <before-dist> <after-dist>

Lists every built file that differs. HTML that differs only in hashed /_astro/ asset names is reported separately,
then each such page's external CSS is compared by rule text to show whether its own styles changed.
"""
import os, re, sys
from pathlib import Path

A, B = map(Path, sys.argv[1:3])
files = lambda root: {p.relative_to(root).as_posix(): p for p in root.rglob('*') if p.is_file()}
a, b = files(A), files(B)
norm = lambda s: re.sub(r'/_astro/[^"\')\s]+', '/_astro/X', s)
same, renamed_only, changed, added, removed = [], [], [], [], []
for k in sorted(set(a) | set(b)):
    if k not in a: added.append(k); continue
    if k not in b: removed.append(k); continue
    x, y = a[k].read_bytes(), b[k].read_bytes()
    if x == y: same.append(k)
    elif k.endswith('.html') and norm(x.decode('utf8', 'replace')) == norm(y.decode('utf8', 'replace')): renamed_only.append(k)
    else: changed.append(k)

pages = [k for k in a if k.endswith('.html')]
print(f'pages compared: {len(pages)}; byte-identical files: {len(same)}')
print('HTML with content changes:')
for k in changed:
    if k.endswith('.html'): print('  ', k)
print('HTML that differs only in hashed asset names:', len(renamed_only))
for k in renamed_only: print('  ', k)
print('non-HTML changed:', [k for k in changed if not k.endswith('.html')])
print('added (excluding media/pawly-case-v2):', [k for k in added if not k.startswith('media/pawly-case-v2/') and not k.startswith('_astro/')])
print('added media/pawly-case-v2 files:', len([k for k in added if k.startswith('media/pawly-case-v2/')]))
print('added/removed _astro bundles:', len([k for k in added if k.startswith('_astro/')]), '/', len([k for k in removed if k.startswith('_astro/')]))
print('removed (excluding _astro):', [k for k in removed if not k.startswith('_astro/')])

# For pages whose HTML changed only by asset hash: is the CSS they load identical as text?
css_of = lambda root, html: ''.join(sorted((root / m.lstrip('/')).read_text('utf8') for m in re.findall(r'href="(/_astro/[^"]+\.css)"', (root / html).read_text('utf8'))))
print('CSS identity for hash-only pages:')
for k in renamed_only:
    ca, cb = css_of(A, k), css_of(B, k)
    print(f"   {k}: {'identical CSS text' if ca == cb else f'CSS differs ({len(ca)} -> {len(cb)} chars)'}")

# Inline <style> rule sets for content-changed pages other than the Pawly case: every BEFORE rule must survive,
# and every added rule must be scoped to the Pawly V2 components (their data-astro-cid values, read from the build).
pawly_cids = set(re.findall(r'data-astro-cid-(\w+)', re.sub(r'(?s).*?(<div class="pawly-case")', r'\1', (B / 'work/pawly/index.html').read_text('utf8'))))
def rules(root, k):
    css = ''.join(re.findall(r'(?s)<style>(.*?)</style>', (root / k).read_text('utf8')))
    out, depth, cur = [], 0, ''
    for ch in css:  # top-level blocks, so @media groups stay whole
        cur += ch
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0: out.append(cur.strip()); cur = ''
    return out
print('Inline style audit (non-Pawly pages):')
others = [k for k in changed if k.endswith('.html') and '/pawly/' not in k]
for k in others:
    ra, rb = rules(A, k), rules(B, k)
    lost = [r for r in ra if r not in rb]
    new = [r for r in rb if r not in ra]
    foreign = [r for r in new if not (set(re.findall(r'data-astro-cid-(\w+)', r)) and set(re.findall(r'data-astro-cid-(\w+)', r)) <= pawly_cids)]
    print(f'   {k}: before {len(ra)} blocks, after {len(rb)}; removed/altered {len(lost)}; added {len(new)}, of which not Pawly-scoped {len(foreign)}')
    for r in foreign[:3]: print('      FOREIGN:', r[:160])
    if foreign:
        print(f"      inert unless the page has .pawly-case: present here = {'class=\"pawly-case\"' in (B / k).read_text('utf8')}")
    # Outside <style>, the page markup must be byte-identical.
    strip = lambda root: re.sub(r'(?s)<style>.*?</style>', '', (root / k).read_text('utf8'))
    print(f"      markup outside <style> identical: {strip(A) == strip(B)}")
