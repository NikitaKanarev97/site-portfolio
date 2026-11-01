from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageOps, ImageStat
import json, re, hashlib, html
p=Path('audit/portfolio-home-v3/stage-01')
before=json.loads((p/'logs/before-capture.json').read_text(encoding='utf8'))
after=json.loads((p/'logs/after-capture.json').read_text(encoding='utf8'))
rows=[]
for x,y in zip(before['results'],after['results']):
    key=f"{x['locale']}-{x['width']}"
    a=Image.open(p/f'screenshots/before/{key}-work-pawly.png').convert('RGB')
    b=Image.open(p/f'screenshots/after/{key}-work-pawly.png').convert('RGB')
    diff=ImageChops.difference(a,b) if a.size==b.size else None
    norm=lambda s:re.sub(r' data-astro-cid-[a-z0-9]+(?:="")?','',s)
    same=norm(x['cards'][-1]['html'])==norm(y['cards'][-1]['html'])
    aligned_a=Image.open(p/f'screenshots/before/{key}-pawly-aligned.png').convert('RGB')
    aligned_b=Image.open(p/f'screenshots/after/{key}-pawly-aligned.png').convert('RGB')
    aligned_diff=ImageChops.difference(aligned_a,aligned_b) if aligned_a.size==aligned_b.size else None
    rows.append({'locale':x['locale'],'width':x['width'],'size':a.size,'sameMarkupIgnoringCompilerScopeIds':same,'pixelsIdentical':diff is not None and diff.getbbox() is None,'rawMeanChannelDifference':ImageStat.Stat(diff).mean if diff is not None else None,'alignedPixelsIdentical':aligned_diff is not None and aligned_diff.getbbox() is None,'alignedMeanChannelDifference':ImageStat.Stat(aligned_diff).mean if aligned_diff is not None else None,'beforeProductTop':x['metrics']['productTop'],'afterProductTop':y['metrics']['productTop'],'afterVisible':y['metrics']['productVisible']})
    if diff is not None: diff.save(p/f'screenshots/after/{key}-pawly-diff.png')
(p/'logs/pawly-and-fold.json').write_text(json.dumps(rows,indent=2))
# Verify that case document content is unchanged; Home-only CSS is emitted by
# WorkStage's existing static imports, so compiled style bytes necessarily differ.
a=Path('.tmp/home-v3-baseline/dist'); b=Path('dist'); case_rows=[]
norm=lambda s:re.sub(r'<style\b[^>]*>.*?</style>','',s,flags=re.S)
for f in list((a/'work').rglob('*.html'))+list((a/'ru/work').rglob('*.html')):
    relative=f.relative_to(a)
    case_rows.append({'route':str(relative),'contentEqualExcludingStyles':norm(f.read_text(encoding='utf8'))==norm((b/relative).read_text(encoding='utf8'))})
(p/'logs/case-document-parity.json').write_text(json.dumps(case_rows,indent=2))
print(json.dumps({'pawly':rows,'caseDocuments':case_rows},indent=2))

ref=Path('research/portfolio-premium-v3-2026-11-01/references/thumbs')
pairs=[('Hero / Garri','en-1440-first.png','gr-thesis.jpg'),('First product / HA','en-1440-first.png','ha-cover.jpg'),('Mobile / Dounar','ru-390-first.png','dn-head.jpg'),('Agent / one decision','en-1440-work-agent-ops-console.png','gr-swap1.jpg'),('Portal / comparison','en-1440-work-partner-portal.png','gr-comp.jpg'),('Learn / clear paths','en-1440-work-learn.png','dn-diag.jpg'),('Vet / role flow','en-1440-work-vet-clinic.png','ha-flow.jpg'),('Webflow / context','en-1440-dev.png','tb-texture.jpg'),('Process / aims','en-1440-about.png','ha-aims.jpg'),('Contact / editorial closure','en-1440-contact.png','dn-impact.jpg')]
(p/'comparisons').mkdir(exist_ok=True)
for i,(label,shot,benchmark) in enumerate(pairs):
    out=Image.new('RGB',(1600,760),'#f7f7f5'); d=ImageDraw.Draw(out)
    d.text((20,12),label+' | IMPLEMENTATION / SAVED HISTORICAL REFERENCE',fill='black')
    for x,file in [(20,p/'screenshots/after'/shot),(820,ref/benchmark)]:
        im=Image.open(file).convert('RGB');im.thumbnail((760,690));out.paste(im,(x,48));d.text((x,30),file.name,fill='black')
    out.save(p/f'comparisons/{i+1:02d}.jpg',quality=93)
# An honest pixel gallery: original screenshots, no artificial viewport cropping.
parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Homepage V3 evidence — pending independent acceptance</title><style>body{margin:32px;font:16px/1.5 system-ui;background:#f7f7f5;color:#1b1b18}h1{max-width:900px}section{padding:32px 0;border-top:1px solid #ccc}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}img{display:block;width:100%;height:auto}figure{margin:0;min-width:0}figcaption{margin:8px 0}a{color:#a72819}nav{display:flex;gap:18px;flex-wrap:wrap}@media(max-width:700px){body{margin:20px}.pair{grid-template-columns:1fr}}</style><h1>kanarev.com · Homepage Premium V3</h1><p>Option A — Editorial Bridge. Real Chromium captures of the pinned source and implementation, both static previews. Independent acceptance pending. References below are historical saved captures by their original authors.</p><nav><a href="REPORT.md">Report</a><a href="TESTS.md">Tests</a><a href="REFERENCE-PAIRS.md">Comparison notes</a><a href="COMPARE-PAWLY.md">Pawly freeze</a></nav>']
for locale in ['en','ru']:
 for w in [1440,390,360,1024]:
  key=f'{locale}-{w}'
  parts.append(f'<section><h2>{key}: first viewport</h2><div class="pair">')
  for phase in ['before','after']:parts.append(f'<figure><figcaption>{phase.upper()}</figcaption><a href="screenshots/{phase}/{key}-full.png"><img loading="lazy" src="screenshots/{phase}/{key}-first.png" alt="{phase} {key} first viewport"></a><a href="screenshots/{phase}/{key}-full.png">Full page</a></figure>')
  parts.append('</div><details><summary>Five cards and lower sections — matched captures</summary>')
  for section in ['work-agent-ops-console','work-partner-portal','work-learn','work-vet-clinic','work-pawly','dev','about','contact','footer']:
   parts.append(f'<h3>{section}</h3><div class="pair">')
   for phase in ['before','after']:parts.append(f'<figure><figcaption>{phase.upper()}</figcaption><a href="screenshots/{phase}/{key}-{section}.png"><img loading="lazy" src="screenshots/{phase}/{key}-{section}.png" alt="{phase} {key} {section}"></a></figure>')
   parts.append('</div>')
  parts.append('</details></section>')
parts.append('<section><h2>Actual reference comparisons</h2>')
for i,(label,_,_) in enumerate(pairs):parts.append(f'<figure><figcaption>{html.escape(label)}</figcaption><a href="comparisons/{i+1:02d}.jpg"><img loading="lazy" src="comparisons/{i+1:02d}.jpg" alt="{html.escape(label)}: actual implementation beside saved reference"></a></figure>')
parts.append('</section></html>')
(p/'index.html').write_text(''.join(parts),encoding='utf8')
files={str(f.relative_to(p)):{'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for folder in ['screenshots','comparisons'] for f in (p/folder).rglob('*') if f.is_file()}
(p/'logs/image-hashes.json').write_text(json.dumps(files,indent=2))
