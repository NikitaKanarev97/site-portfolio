import fs from 'node:fs/promises';import path from 'node:path';import {root} from './sweep.mjs';
const d=JSON.parse(await fs.readFile(path.join(root,'logs/sweep.json'),'utf8')),out=[];
function add(id,route,rect,selector='',width=1440,loc='en',live=false){out.push({id,route,loc,width,rect,selector,live});}
const page=r=>d.find(p=>p.route===r&&p.width===1440&&p.loc==='en');
add('V01','about',{x:70,y:100,w:850,h:550},'intro: index + portrait');
add('V02','about',{x:70,y:1090,w:900,h:450},'chapter number + divider');
add('V03','work/agent-ops-console',{x:65,y:110,w:900,h:600},'cover CAPS + panel axes');
add('V04','work/agent-ops-console',{x:80,y:1290,w:900,h:560},'heading gap + numbers glyph');
add('V05','work/agent-ops-console',{x:150,y:5290,w:900,h:600},'evidence white perimeter');
add('V06','work/partner-portal',{x:70,y:1140,w:900,h:500},'facts reconstruction + opening gap');
add('V07','work/partner-portal',{x:130,y:9380,w:900,h:580},'specimen font/table clutter');
add('V08','work/learn',{x:70,y:110,w:900,h:600},'cover explanations + status');
add('V09','work/learn',{x:70,y:4060,w:900,h:550},'routes caption + white edges');
add('V10','work/vet-clinic',{x:70,y:4350,w:900,h:590},'ONE VISIT / 01 VETERINARIAN TABLET / caption');
add('V11','work/pawly',{x:70,y:3740,w:900,h:600},'return boundary balance');
add('V12','work/pawly',{x:130,y:8220,w:900,h:580},'small specimen labels');
add('V13','work/vet-clinic',{x:125,y:1900,w:900,h:600},'queue gray field + nested white frame');
add('V14','work/vet-clinic',{x:130,y:5250,w:900,h:580},'invoice vs owner mass');
for(const [route,loc,cls,selector] of [['work/pawly','en','R1','a.case-screen__open'],['work/learn','ru','R1','a.case-screen__open'],['404','en','R1','a.ds-link.ds-link--arrow']]){const p=d.find(p=>p.route===route&&p.loc===loc&&p.width===360);let c=p.candidates.find(c=>c.cls===cls&&c.selector===selector&&c.detail.kind==='small-target');if(c)add(`M0${out.filter(t=>t.width===360).length+1}`,route,{x:0,y:c.rect.y-80,w:360,h:520},selector,360,loc);}
add('M04','work/learn',{x:0,y:90,w:360,h:550},'RU cover wrapping',360,'ru');
add('M05','about',{x:0,y:95,w:360,h:550},'RU headline and index',360,'ru');
add('M06','work/vet-clinic',{x:0,y:90,w:360,h:550},'RU cover wrapping',360,'ru');
await fs.writeFile(path.join(root,'logs/visual-targets.json'),JSON.stringify(out,null,2));console.log(`${out.length} targets, ${out.filter(t=>t.width===360).length} mobile; crops from existing full captures where available`);
