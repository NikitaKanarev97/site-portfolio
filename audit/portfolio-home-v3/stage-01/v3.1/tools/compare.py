"""Create review sheets from raw captures; originals stay untouched."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageStat
import json, re, hashlib, subprocess

p=Path('audit/portfolio-home-v3/stage-01/v3.1')
before=json.loads((p/'logs/before-capture.json').read_text(encoding='utf8'))
after=json.loads((p/'logs/after-capture.json').read_text(encoding='utf8'))
(p/'comparisons').mkdir(exist_ok=True)
rows=[]
gallery=[]
for a,b in zip(before['results'],after['results']):
    key=f"{a['locale']}-{a['width']}"
    assert (a['locale'],a['width'])==(b['locale'],b['width'])
    for section in ['first','work-agent-ops-console']:
        images=[Image.open(p/f'screenshots/{phase}/{key}-{section}.png').convert('RGB') for phase in ['before','after']]
        w=max(i.width for i in images)
        sheet=Image.new('RGB',(w*2,max(i.height for i in images)+32),'#efefec')
        d=ImageDraw.Draw(sheet)
        for n,(im,label) in enumerate(zip(images,['BEFORE c5fd121','AFTER V3.1 (unaccepted)'])):
            sheet.paste(im,(n*w,32)); d.text((n*w+12,10),f'{key} / {label}',fill='black')
        sheet.save(p/f'comparisons/{key}-{section}.jpg',quality=94)
    pawly_a=Image.open(p/f'screenshots/before/{key}-work-pawly.png').convert('RGB')
    pawly_b=Image.open(p/f'screenshots/after/{key}-work-pawly.png').convert('RGB')
    # Upstream fractional document Y can add a raster edge row. Preserve and
    # report raw sizes rather than resizing the actual evidence to force a match.
    diff=ImageChops.difference(pawly_a,pawly_b) if pawly_a.size==pawly_b.size else None
    aligned_a=Image.open(p/f'screenshots/before/{key}-pawly-aligned.png').convert('RGB')
    aligned_b=Image.open(p/f'screenshots/after/{key}-pawly-aligned.png').convert('RGB')
    assert aligned_a.size==aligned_b.size
    aligned_diff=ImageChops.difference(aligned_a,aligned_b)
    dom_equal=a['cards'][-1]['html']==b['cards'][-1]['html']
    assert dom_equal,f'{key}: frozen DOM changed'
    rows.append({'locale':a['locale'],'width':a['width'],'beforeTop':a['metrics']['productTop'],'afterTop':b['metrics']['productTop'],'beforeVisible':a['metrics']['productVisible'],'afterVisible':b['metrics']['productVisible'],'beforeWidth':a['metrics']['productWidth'],'afterWidth':b['metrics']['productWidth'],'pawlyExactDOM':dom_equal,'pawlyRawBeforeSize':pawly_a.size,'pawlyRawAfterSize':pawly_b.size,'pawlyRawPixelsEqual':diff is not None and diff.getbbox() is None,'pawlyRawMeanChannelDifference':ImageStat.Stat(diff).mean if diff else None,'pawlyRegisteredPixelsEqual':aligned_diff.getbbox() is None,'pawlyRegisteredMeanChannelDifference':ImageStat.Stat(aligned_diff).mean})
    gallery.append(f'<section><h2>{key}</h2><p><a href="comparisons/{key}-first.jpg">First fold pair</a> · <a href="comparisons/{key}-work-agent-ops-console.jpg">Agent pair</a></p>')
    for section in ['first','work-agent-ops-console','full','work-pawly','pawly-aligned']:
        gallery.append(f'<h3>{section}</h3><div class="pair">'+''.join(f'<figure><figcaption>{phase.upper()}</figcaption><a href="screenshots/{phase}/{key}-{section}.png"><img loading="lazy" src="screenshots/{phase}/{key}-{section}.png" alt="{key} {phase} {section}"></a></figure>'for phase in ['before','after'])+'</div>')
    gallery.append('</section>')
(p/'logs/pawly-and-fold.json').write_text(json.dumps(rows,indent=2),encoding='utf8')

# Case HTML must keep its complete content/DOM. Inline Home-module CSS may be
# emitted via static WorkStage imports; compare style elements separately.
base=Path('.tmp/before-dist'); current=Path('dist')
strip_styles=lambda s:re.sub(r'<style\b[^>]*>.*?</style>','',s,flags=re.S)
cases=[]
for f in list((base/'work').rglob('*.html'))+list((base/'ru/work').rglob('*.html')):
    rel=f.relative_to(base); a=f.read_text(encoding='utf8'); b=(current/rel).read_text(encoding='utf8')
    equal=strip_styles(a)==strip_styles(b)
    cases.append({'route':str(rel),'documentEqualExcludingInlineStyles':equal,'byteIdentical':a==b})
    assert equal,f'{rel}: case document changed'
(p/'logs/case-document-parity.json').write_text(json.dumps(cases,indent=2),encoding='utf8')

# Record byte identity with the reviewed Git source for every used Home image.
assets=json.loads((p/'logs/home-image-sources.json').read_text(encoding='utf8'))
for entry in assets:
    baseline=subprocess.check_output(['git','show',f'c5fd121:{entry["path"]}'])
    entry['reviewedBaseSHA256']=hashlib.sha256(baseline).hexdigest()
    assert entry['reviewedBaseSHA256']==entry['sha256']
(p/'logs/media-parity.json').write_text(json.dumps(assets,indent=2),encoding='utf8')

# Reference sheets contain real archived reference screenshots, not studies.
ref=Path('research/portfolio-premium-v3-2026-11-01/references/thumbs')
references=[('01-garri','en-1440','gr-thesis.jpg'),('02-ha','en-390','ha-cover.jpg'),('03-dounar','ru-360','dn-head.jpg'),('04-agent-garri','ru-1024','gr-swap1.jpg')]
for label,key,file in references:
    our=Image.open(p/f'screenshots/after/{key}-first.png').convert('RGB')
    other=Image.open(ref/file).convert('RGB')
    our.thumbnail((1100,950)); other.thumbnail((1100,950))
    sheet=Image.new('RGB',(our.width+other.width+48,max(our.height,other.height)+64),'#efefec')
    d=ImageDraw.Draw(sheet)
    d.text((12,10),f'V3.1 {key} / implementation evidence, not acceptance',fill='black')
    d.text((our.width+36,10),f'Saved original reference: {file}',fill='black')
    sheet.paste(our,(12,40)); sheet.paste(other,(our.width+36,40))
    sheet.save(p/f'comparisons/{label}.jpg',quality=94)

(p/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Homepage V3.1 evidence</title><style>body{font:16px/1.5 system-ui;margin:24px;background:#efefec;color:#1b1b18}section{margin:64px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0}img{display:block;max-width:100%;height:auto}figcaption{font-weight:600;margin:12px 0}a{color:#842014}</style><h1>Homepage Premium V3.1 — review evidence</h1><p>Exact paired viewports, Chromium DPR 1, reduced motion. BEFORE = c5fd121, AFTER = corrective source recorded in logs/provenance.json. Final visual acceptance belongs to ChatGPT.</p><p><a href="REPORT.md">Report</a> · <a href="REFERENCE-PAIRS.md">Reference comparison</a></p>'''+''.join(gallery)+'</html>',encoding='utf8')
print(json.dumps(rows,indent=2))
print(f'{len(cases)} case documents unchanged excluding inline styles; {len(assets)} used media files byte-identical to c5fd121.')
