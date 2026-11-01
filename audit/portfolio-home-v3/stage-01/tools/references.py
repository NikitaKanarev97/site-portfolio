from PIL import Image, ImageOps, ImageDraw
from pathlib import Path
root = Path('research/portfolio-premium-v3-2026-11-01/references/thumbs')
files = ['gr-thesis.jpg','ha-cover.jpg','dn-head.jpg','gr-swap1.jpg','gr-comp.jpg','dn-diag.jpg','ha-phones.jpg','ha-flow.jpg','ha-aims.jpg','dn-impact.jpg','tb-texture.jpg','np-hand.jpg']
sheet = Image.new('RGB', (1800, 4*450), '#efefec')
d = ImageDraw.Draw(sheet)
for i,name in enumerate(files):
    x,y = (i%3)*600, (i//3)*450
    im = Image.open(root/name).convert('RGB')
    im.thumbnail((580,405))
    sheet.paste(im,(x+10,y+30))
    d.text((x+10,y+8),name,fill='black')
out = Path('audit/portfolio-home-v3/stage-01/reference-contact.jpg')
sheet.save(out,quality=92)
print(out)
