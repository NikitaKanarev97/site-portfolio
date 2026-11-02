import fs from 'node:fs';
const root='audit/vet-portfolio-premium-v3/v3.1';
const before=JSON.parse(fs.readFileSync(`${root}/before/metrics.json`));
const after=JSON.parse(fs.readFileSync(`${root}/after/metrics.json`));
const motion=JSON.parse(fs.readFileSync(`${root}/after/motion.json`));
const tests=[],alignment=[];
const norm=s=>s.replace(/\u2060/g,'').replace(/\s+/g,' ').trim();
function check(name,pass,detail){tests.push({name,pass:!!pass,detail});if(!pass)console.log('FAIL',name,JSON.stringify(detail));}
check('All 36 matched route/locale/width combinations',before.length===36&&after.length===36);
for(const a of after) {
 const b=before.find(b=>b.key===a.key),tag=a.key;
 check(`${tag} HTTP/assets/console`,a.status===200&&!a.errors.length&&!a.failedAssets.length,{status:a.status,errors:a.errors,assets:a.failedAssets});
 check(`${tag} no new overflow`,a.page.overflow===b.page.overflow,{before:b.page.overflow,after:a.page.overflow});
 check(`${tag} visible narrative unchanged`,norm(a.page.text)===norm(b.page.text));
 check(`${tag} sections and headings geometry unchanged`,JSON.stringify(a.page.sections)===JSON.stringify(b.page.sections));
 check(`${tag} image sources, alt, dimensions unchanged`,JSON.stringify(a.page.images)===JSON.stringify(b.page.images));
 check(`${tag} untouched image pixels identical`,a.specimenHash===b.specimenHash);
 check(`${tag} keyboard focus in every captured state`,a.captures.every(c=>c.keyboardFocus));
 check(`${tag} href/target/rel and labels unchanged`,a.links.length===b.links.length&&a.links.every((l,i)=>['href','target','rel','text'].every(k=>l[k]===b.links[i][k])));
 for(let i=0;i<a.links.length;i++) {
  const l=a.links[i];if(!l.icon)continue;
  const last=l.lines.at(-1),old=b.links[i],oldLine=old.lines.at(-1);
  const delta=l.icon.y+l.icon.h/2-(last.y+last.h/2);
  const gap=l.icon.x-(last.x+last.w);
  alignment.push({tag,text:l.text,lines:l.lines.length,beforeDelta:old.icon.y+old.icon.h/2-(oldLine.y+oldLine.h/2),afterDelta:delta,gap,targetHeight:l.link.h});
  check(`${tag} ${l.text}: marker on last text line`,Math.abs(delta)<=2,{delta,lines:l.lines.length});
  check(`${tag} ${l.text}: token gap without orphan`,Math.abs(gap-8)<0.1,{gap});
  if(l.href.includes('veterinary-clinic-gules')||old.link.h>=48)check(`${tag} ${l.text}: 48px target retained`,l.link.h>=48,l.link.h);
 }
}
for(const m of motion) {
 if(m.state==='hover')check(`${m.id} existing directional hover`,m.transform==='matrix(1, 0, 0, 1, 4, -4)',m.transform);
 if(m.state==='reduced-hover')check(`${m.id} reduced motion`,m.transform==='none'&&parseFloat(m.transition)<=0.001,m);
 if(m.state==='focus')check(`${m.id} keyboard focus without hover`,m.focusVisible&&!m.hover,m);
}
fs.writeFileSync(`${root}/comparison.json`,JSON.stringify({summary:{passed:tests.filter(t=>t.pass).length,total:tests.length},alignment,tests},null,2));
console.log(`${tests.filter(t=>t.pass).length}/${tests.length} comparison checks passed`);
if(tests.some(t=>!t.pass))process.exitCode=1;
