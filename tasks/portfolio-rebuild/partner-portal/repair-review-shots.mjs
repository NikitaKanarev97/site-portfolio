/** Narrow handoff correction. No story, runtime or build mutation. */
import {browser} from './source-runtime.mjs';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const task='tasks/portfolio-rebuild/partner-portal',shots=task+'/shots';
const base='http://127.0.0.1:4354';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
async function inspect(file){
 const bytes=readFileSync(shots+'/'+file),pixels=await sharp(bytes).stats(),size=await sharp(bytes).metadata();
 return {file,bytes:bytes.length,sha256:sha(bytes),width:size.width,height:size.height,
  white:pixels.channels.slice(0,3).every(c=>c.min===255&&c.max===255),
  rgb:pixels.channels.slice(0,3).map(({min,max,mean,stdev})=>({min,max,mean,stdev}))};
}
const files=readdirSync(shots).filter(f=>f.endsWith('.png')),before=[];
for(const file of files)before.push(await inspect(file));
const blank=before.filter(s=>s.white),repaired=[];const b=await browser();
try{for(const original of blank){
 const match=/^(en|ru)-(1440|390)-(.+)\.png$/.exec(original.file);
 if(!match||['full','cover'].includes(match[3]))throw Error('Unexpected blank shot requiring review: '+original.file);
 const [,lang,widthText,id]=match,width=Number(widthText),viewport={width,height:width===390?844:900};
 const c=await b.newContext({viewport,reducedMotion:'reduce'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const route=`/preview/partner-portal-rebuild/${lang}/`;
 await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.locator('img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));
 await p.waitForFunction(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth));
 const el=p.locator('#'+id);await el.evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(700);
 await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const state=await el.evaluate(el=>({text:el.innerText,bounds:el.getBoundingClientRect().toJSON(),
  ancestors:(()=>{const a=[];for(let n=el;n;n=n.parentElement){const s=getComputedStyle(n);a.push({tag:n.tagName,id:n.id,opacity:s.opacity,display:s.display,visibility:s.visibility});}return a;})()}));
 const bytes=await el.screenshot(),pixels=await sharp(bytes).stats();
 if(pixels.channels.slice(0,3).every(c=>c.min===255&&c.max===255))throw Error('Replacement is blank: '+original.file);
 if(errors.length)throw Error(errors.join('\n'));
 writeFileSync(shots+'/'+original.file,bytes);
 const after=await inspect(original.file);repaired.push({original,after,route,viewport,mode:'reduce',waitAfterScrollMs:700,twoAnimationFrames:true,state,errors});
 console.log('repaired',original.file,original.bytes,'->',after.bytes);await c.close();
}}
finally{await b.close();}
const after=[];for(const file of files)after.push(await inspect(file));
const remainingWhite=after.filter(s=>s.white);
writeFileSync(task+'/shot-repair.json',JSON.stringify({base,originalCommit:'172a468fc5570ada70aae033a52ecc3b78c11d69',checkedPngCount:files.length,originalWhite:blank.map(s=>s.file),repaired,remainingWhite:remainingWhite.map(s=>s.file),after},null,2));
console.log({checked:files.length,repaired:repaired.length,remainingWhite:remainingWhite.length});
if(remainingWhite.length)throw Error('Entirely white review shots remain');
