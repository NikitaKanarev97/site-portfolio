import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {isolateAssessment} from '../../../scripts/lib/learn-frame-fields.mjs';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const dir='public/media/rebuild/learn/';
let entries=JSON.parse(await readFile('tasks/portfolio-rebuild/learn/captures.json','utf8'));
async function save(id,buffer,source,extra={}){
 const file=dir+id+'.webp'; const info=await sharp(buffer).webp({quality:94}).toFile(file);
 const bytes=await readFile(file);entries=entries.filter(e=>e.id!==id);entries.push({id,file,source,locale:'en',width:info.width,height:info.height,dpr:2,sha256:createHash('sha256').update(bytes).digest('hex'),...extra});
 console.log(id,info.width,info.height);
}
for(const width of [1440,390,320]){
 const ctx=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});const p=await ctx.newPage();
 await p.goto('http://127.0.0.1:4362/prototypes/learn/material/onvif-not-found?lang=en',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const trust=p.locator('div[class*="_root_"]').filter({has:p.locator('span[class*="_version_"]')}).last();
 if(width!==320){
  const boxes=await Promise.all([trust.boundingBox(),p.locator('h1').boundingBox(),p.locator('header[class*="pageHeader"] p').boundingBox()]);
  const x=Math.min(...boxes.map(b=>b.x)),y=Math.min(...boxes.map(b=>b.y));
  const right=Math.max(...boxes.map(b=>b.x+b.width)),bottom=Math.max(...boxes.map(b=>b.y+b.height));
  await save('cover-answer-'+(width===1440?'desktop':'mobile'),await p.screenshot({clip:{x,y,width:right-x,height:bottom-y}}),p.url(),{crop:'Whole version/date, title and lead; no body or action is cut.',viewport:p.viewportSize()});
 }else{
  await save('trust-mobile',await trust.screenshot(),p.url(),{nativeWidth:288,viewport:p.viewportSize()});
  await save('trust-desktop',await trust.screenshot(),p.url(),{nativeWidth:288,viewport:p.viewportSize(),fixture:'Compact native component at 288 CSS pixels, documentary selection.'});
  const state=JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-one.json','utf8'));state.toasts=[];
  await p.evaluate(s=>sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s)),state);
  await p.goto('http://127.0.0.1:4362/prototypes/learn/player/puskonaladka/2?lang=en',{waitUntil:'networkidle'});
  const meter=p.locator('div[class*="_meter_"]').first();
  await save('progress-mobile',await meter.screenshot(),p.url(),{nativeWidth:288,viewport:p.viewportSize(),fixture:'Current position 3/11, not completion.'});
  await save('progress-desktop',await meter.screenshot(),p.url(),{nativeWidth:288,viewport:p.viewportSize(),fixture:'Compact native position meter at 288 CSS pixels, not completion.'});
 }
 await ctx.close();
}
// Assessment: complete introduction and rules, ending before the next section.
for(const width of [1024,390]){
 const ctx=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
 const state=JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-ready.json','utf8'));state.toasts=[];
 await ctx.addInitScript(s=>sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s)),state);const p=await ctx.newPage();
 await p.goto('http://127.0.0.1:4362/prototypes/learn/assessment/intro?trajectoryId=proekt&lang=en',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const rules=p.locator('div[class*="_card_"]').filter({has:p.getByText('Attempts remaining',{exact:true})}).first();
 const frame=await isolateAssessment(p,rules);
 await save('assessment-'+(width===1024?'desktop':'mobile'),await frame.screenshot(),p.url(),{crop:'Whole title, lead, notice and rules with native page fields on all four sides. Integer origin. Ends before the additional-bank section.',viewport:p.viewportSize(),fixture:'state-marina-ready; introduction only, no result.'});
 await ctx.close();
}
// Compose only captured semantic regions, at one original scale. No UI is redrawn.
for(const variant of ['desktop','mobile']){
 const a=await sharp(dir+'cover-answer-'+variant+'.webp').metadata();const b=await sharp(dir+'cover-programme-'+variant+'.webp').metadata();
 const mobile=variant==='mobile';const gap=mobile?64:96;
 const width=mobile?Math.max(a.width,b.width):a.width+b.width+gap;
 const height=mobile?a.height+b.height+gap:Math.max(b.height,a.height+180);
 const data=await sharp({create:{width,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([
  {input:dir+'cover-answer-'+variant+'.webp',left:0,top:mobile?0:180},
  {input:dir+'cover-programme-'+variant+'.webp',left:mobile?0:a.width+gap,top:mobile?a.height+gap:0},
 ]).png().toBuffer();
 await save('cover-'+variant,data,'cover-answer-'+variant+' + cover-programme-'+variant,{composition:'Separate whole source regions, same DPR and scale, transparent field; asymmetric on desktop, stacked mobile.',alpha:true});
}
await browser.close();await writeFile('tasks/portfolio-rebuild/learn/captures.json',JSON.stringify(entries,null,2));
