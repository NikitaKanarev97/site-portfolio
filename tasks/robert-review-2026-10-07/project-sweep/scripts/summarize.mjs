import fs from 'node:fs/promises';
import {root} from './sweep.mjs';
import path from 'node:path';
const d=JSON.parse(await fs.readFile(path.join(root,'logs/sweep.json'),'utf8'));
const out=[];
for(const p of d.filter(p=>p.loc==='en'&&p.width===1440)){out.push(`\n${p.route}: words ${p.wordCount}, page h ${Math.max(...p.sections.map(s=>s.rect.y+s.rect.h))}`);out.push('HEAD '+p.headings.map(h=>`${h.selector}: ${h.size}px ${h.rect.y} ${h.text.slice(0,40)}`).join(' | '));for(const cls of ['C2','L1','L2','X2'])for(const c of p.candidates.filter(c=>c.cls===cls))out.push(`${cls} ${c.component} ${c.selector} ${c.text.slice(0,60)} ${JSON.stringify(c.detail).slice(0,450)} RECT ${JSON.stringify(c.rect)}`);out.push('MEDIA '+p.media.map(m=>`${m.selector} ${m.rect.w}x${m.rect.h} y${m.rect.y} ${m.src.split('/').pop().slice(0,80)}`).join(' | '));}
out.push('\nMOBILE');for(const p of d.filter(p=>p.width===360)){const rr=p.candidates.filter(c=>c.cls==='R1'&&!/sr-only|ds-skip-link/.test(c.selector));out.push(`${p.loc}/${p.route}: scroll ${p.bodyWidth}; short targets ${JSON.stringify(rr.filter(c=>c.detail.kind==='small-target').map(c=>({s:c.selector,t:c.text,h:c.rect.h,w:c.rect.w,inline:c.detail.inline})))}`);}
await fs.writeFile(path.join(root,'logs/measure-summary.txt'),out.join('\n'));
console.log(out.slice(-15).join('\n'));
