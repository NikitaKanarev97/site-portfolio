import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-02',base='http://127.0.0.1:4394';
await mkdir(dir+'/after',{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[],lifecycle=[];
const profiles=[];
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js'])for(const slug of ['','learn','vet-clinic'])profiles.push({lang,width,mode,slug});
async function verify({lang,width,mode,slug}){
 const c=await b.newContext({viewport:{width,height:width>1000?900:844},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const path=`/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`;
 const response=await p.goto(base+path,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(mode==='full'?1450:120);
 const opening=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,index:[...document.querySelectorAll('.work-index a')].map(e=>({text:e.textContent,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})),proof:[...document.querySelectorAll('.hero__proof img')].map(e=>({loaded:e.complete&&e.naturalWidth>0,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,opacity:Number(getComputedStyle(e).opacity)})),height:innerHeight}));
 const key=`${lang}-${width}-${slug||'home'}`;
 if(mode==='reduce'&&[1440,390].includes(width))await p.screenshot({path:`${dir}/after/${key}-opening.png`});
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(35);}
 await p.waitForTimeout(mode==='full'?1200:30);
 let disclosure;
 if(slug==='learn'){const d=p.locator('[data-case-route]').nth(1);await d.locator('summary').press('Enter');disclosure=await d.getAttribute('open')!==null;await d.locator('img').scrollIntoViewIfNeeded();await d.locator('img').evaluate(e=>e.decode());}
 // Include the native horizontal states in future runs. The saved first run's
 // four unvisited lazy slides are retained and resolved by verify-followup.mjs.
 if(slug==='vet-clinic'&&width===1440&&mode!=='no-js'){
  const block=p.locator('#save-is-not-publish');await block.scrollIntoViewIfNeeded();
  for(let n=0;n<2;n++){await block.locator('[data-carousel-next]').click();await p.waitForTimeout(600);}
  await block.locator('img').last().evaluate(e=>e.decode());
 }
 const geometry=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(e=>!e.closest('dialog:not([open]), details:not([open])')&&e.getClientRects().length&&(!e.complete||!e.naturalWidth)).map(e=>({src:e.getAttribute('src'),currentSrc:e.currentSrc,alt:e.alt})),learn:[...document.querySelectorAll('.learn-stage .case-screen')].map(e=>({radius:getComputedStyle(e).borderRadius,overflow:getComputedStyle(e).overflow,shadow:getComputedStyle(e).boxShadow,src:e.querySelector('img').currentSrc})),vet:[...document.querySelectorAll('.vet-stage figure')].map(e=>({name:e.className,width:e.getBoundingClientRect().width}))}));
 if(mode==='reduce'&&[1440,390].includes(width)){
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${dir}/after/${key}-full.png`,fullPage:true});
  if(!slug){for(const scene of ['work-agent-ops-console','work-partner-portal','work-learn','work-vet-clinic','work-pawly']){await p.locator('#'+scene).scrollIntoViewIfNeeded();await p.locator('#'+scene).screenshot({path:`${dir}/after/${lang}-${width}-${scene}.png`});}}
 }
 const r={lang,width,mode,slug,status:response.status(),opening,...geometry,disclosure,errors};results.push(r);
 if(r.status!==200||opening.overflow||opening.h1!==1||geometry.overflow||geometry.broken.length||errors.length||disclosure===false||geometry.learn.some(e=>e.radius!=='0px'||e.overflow!=='visible'||e.shadow!=='none')||(!slug&&(opening.index.length!==5||opening.index.some(e=>e.top<0||e.bottom>opening.height)||!opening.proof[0]?.loaded||opening.proof[0].top>opening.height-150||opening.proof[0].opacity!==1)))failures.push(r);
 await c.close();console.log(key,mode,failures.includes(r)?'FAIL':'OK');
}
try{
 for(let n=0;n<profiles.length;n+=3)await Promise.all(profiles.slice(n,n+3).map(verify));
 for(const lang of ['en','ru'])for(const width of [1440,390])for(const slug of ['','learn','vet-clinic']){
  const c=await b.newContext({viewport:{width,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const url=base+`/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`;await p.goto(url,{waitUntil:'networkidle'});
  await p.mouse.wheel(0,2400);await p.waitForTimeout(1200);await p.mouse.wheel(0,-2400);await p.waitForTimeout(1200);
  await p.setViewportSize({width:width===1440?1024:360,height:600});await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(150);
  let nextBack=true;
  if(slug){await p.locator('.case-next__link').click();await p.waitForTimeout(700);await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(700);nextBack=new URL(p.url()).pathname.replace(/\/$/,'')===new URL(url).pathname.replace(/\/$/,'');}
  const r={lang,width,slug,fastReverse:true,resize:true,preference:true,nextBack,returnedUrl:p.url(),errors,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)};lifecycle.push(r);if(!nextBack||r.overflow||errors.length)failures.push(r);await c.close();
 }
 for(const slug of ['agent-ops-console','partner-portal','pawly'])for(const width of [1440,390]){
  const c=await b.newContext({viewport:{width,height:844},reducedMotion:'reduce'}),p=await c.newPage();await p.goto(`${base}/work/${slug}/`,{waitUntil:'networkidle'});const r={slug,width,neighbor:true,status:'checked',overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)};results.push(r);if(r.overflow)failures.push(r);await c.close();
 }
 const c=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();
 await p.goto(`${base}/work/partner-portal/#domain-system`,{waitUntil:'networkidle'});await p.locator('[data-specimen-set="availability"]').scrollIntoViewIfNeeded();await p.locator('[data-specimen-set="availability"]').screenshot({path:`${dir}/after/availability-red-edge.png`});await c.close();
}finally{await b.close();}
const alpha=[];for(const f of ['public/media/art-direction/learn/passport-desktop.png','public/media/art-direction/learn/passport-mobile.png','public/media/rebuild/common/portal/availability-stale-288.webp']){const bytes=await readFile(f),{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});const a=(x,y)=>data[(y*info.width+x)*info.channels+3];const entry={file:f,sha256:createHash('sha256').update(bytes).digest('hex'),corners:[a(0,0),a(info.width-1,0),a(0,info.height-1),a(info.width-1,info.height-1)]};alpha.push(entry);if(entry.corners.some(v=>v!==0))failures.push(entry);}
await writeFile(`${dir}/verification.json`,JSON.stringify({base,created:new Date().toISOString(),results,lifecycle,alpha,failures},null,2));console.log(JSON.stringify({profiles:results.length,lifecycle:lifecycle.length,failures:failures.length}));if(failures.length)process.exitCode=1;
