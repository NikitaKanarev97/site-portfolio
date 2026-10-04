import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-03',base='http://127.0.0.1:4394';
await mkdir(dir+'/final',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const slugs=['','agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
const results=[],failures=[],zooms=[],lifecycle=[],focus=[];
const url=(lang,slug)=>base+`/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`;
async function scan(profile){
 const {lang,width,mode,slug}=profile;
 const c=await browser.newContext({viewport:{width,height:width>1000?900:844},reducedMotion:mode==='full'?'no-preference':'reduce',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto(url(lang,slug),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(mode==='full'?1400:100);
 const opening=await p.evaluate(()=>({h1:document.querySelectorAll('h1').length,index:[...document.querySelectorAll('.work-index a')].map(e=>e.getBoundingClientRect().bottom),proof:document.querySelector('.hero__proof img')?.getBoundingClientRect().top,height:innerHeight}));
 const key=`${lang}-${width}-${slug||'home'}`;
 if(mode==='reduce'&&[1440,390].includes(width))await p.screenshot({path:`${dir}/final/${key}-opening.png`});
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=650){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(15);}
 if(slug==='learn')for(const summary of await p.locator('details:not([open]) summary').all())await summary.press('Enter');
 for(const track of await p.locator('[data-carousel-track]').all()){
  await track.scrollIntoViewIfNeeded();await track.evaluate(e=>{e.scrollLeft=e.scrollWidth;});await p.waitForTimeout(150);await track.evaluate(e=>{e.scrollLeft=0;});
 }
 await p.waitForTimeout(mode==='full'?1100:80);
 const geometry=await p.evaluate(()=>{
  const screens=[...document.querySelectorAll('.case-screen')].filter(e=>e.getClientRects().length).map(e=>{
   const i=e.querySelector('img'),r=e.getBoundingClientRect(),b=i?.getBoundingClientRect(),s=getComputedStyle(e);
   return {src:i?.currentSrc,loaded:!i||i.complete&&i.naturalWidth>0,radius:s.borderRadius,padding:parseFloat(s.paddingLeft),overflow:s.overflow,
    fit:i&&getComputedStyle(i).objectFit,ratio:i&&Math.abs(i.clientHeight-i.clientWidth*i.naturalHeight/i.naturalWidth),
    left:b&&b.left-r.left,right:b&&r.right-b.right,masked:i&&getComputedStyle(i).borderRadius!=='0px'};
  });
  return {overflow:document.documentElement.scrollWidth>innerWidth+1,dialogCount:document.querySelectorAll('[data-media-zoom]').length,
   nested:document.querySelectorAll('a a,a button,button a,button button').length,
   cards:[...document.querySelectorAll('.featured-case,.case-plate,.case-specimen__set')].map(e=>getComputedStyle(e).borderRadius),screens};
 });
 const r={...profile,status:response.status(),opening,...geometry,errors};results.push(r);
 if(response.status()!==200||opening.h1!==1||geometry.overflow||geometry.dialogCount!==1||geometry.nested||geometry.cards.some(v=>v!=='16px')||geometry.screens.some(s=>s.radius!=='16px'||s.padding<16||s.overflow!=='visible'||s.masked||!s.loaded||s.src&&(s.fit!=='contain'||s.ratio>1.5||s.left<14||s.right<14))||errors.length||!slug&&(opening.index.length!==5||opening.index.some(y=>y>opening.height)||opening.proof>opening.height-100))failures.push(r);
 if(mode==='reduce'&&[1440,390].includes(width)){
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${dir}/final/${key}-full.png`,fullPage:true});
  if(!slug)for(const name of slugs.filter(Boolean)){
   const scene=p.locator('#work-'+name);await scene.scrollIntoViewIfNeeded();await scene.screenshot({path:`${dir}/final/${lang}-${width}-work-${name}.png`});
  }
  const triggers=p.locator('.case-screen [data-zoom-trigger]');
  for(let n=0;n<await triggers.count();n++){
   const t=triggers.nth(n);if(!await t.isVisible())continue;
   await t.scrollIntoViewIfNeeded();const expected=await t.locator('img').evaluate(e=>e.currentSrc);await t.press('Enter');
   await p.locator('dialog[open] [data-media-zoom-image]').evaluate(e=>e.decode());
   const z=await p.locator('dialog[open]').evaluate(e=>{
    const i=e.querySelector('img'),v=e.querySelector('[data-media-zoom-viewport]'),cap=e.querySelector('figcaption'),panel=e.firstElementChild,b=i.getBoundingClientRect(),vr=v.getBoundingClientRect(),cr=cap.getBoundingClientRect(),pr=panel.getBoundingClientRect();
    return {src:i.src,alt:i.alt,text:cap.textContent,padding:parseFloat(getComputedStyle(v).paddingLeft),radius:getComputedStyle(panel).borderRadius,
     separate:cr.top>=vr.bottom-1,contained:pr.left>=0&&pr.right<=innerWidth&&pr.top>=0&&pr.bottom<=innerHeight,
     fullRatio:Math.abs(b.width/b.height-i.naturalWidth/i.naturalHeight)<.015,
     scrollable:v.scrollHeight>v.clientHeight,focusClose:document.activeElement===e.querySelector('button')};
   });
   if(z.scrollable){await p.locator('[data-media-zoom-viewport]').press('End');await p.waitForFunction(()=>{const e=document.querySelector('[data-media-zoom-viewport]');return e.scrollTop+e.clientHeight>=e.scrollHeight-2;},undefined,{timeout:2000});z.bottomReachable=true;}
   if(n===0)await p.screenshot({path:`${dir}/final/${key}-lightbox.png`});
   await p.keyboard.press('Escape');const returned=await t.evaluate(e=>document.activeElement===e);
   const zr={lang,width,slug,index:n,...z,expected,returned,urlUnchanged:p.url()===url(lang,slug)};zooms.push(zr);
   if(z.src!==expected||!z.alt||!z.text||!z.separate||!z.contained||!z.fullRatio||!z.focusClose||!returned||!zr.urlUnchanged||z.padding<16||z.radius!=='16px'||z.scrollable&&!z.bottomReachable)failures.push(zr);
  }
 }
 await c.close();console.log(key,mode,failures.includes(r)?'FAIL':'OK');
}
try{
 const profiles=[];for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js'])for(const slug of slugs)profiles.push({lang,width,mode,slug});
 for(let i=0;i<profiles.length;i+=3)await Promise.all(profiles.slice(i,i+3).map(scan));
 for(const lang of ['en','ru'])for(const width of [1440,390]){
  const c=await browser.newContext({viewport:{width,height:600}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url(lang,''),{waitUntil:'networkidle'});const opener=p.locator('.hero__proof [data-zoom-trigger]');await opener.click();await p.getByRole('button',{name:lang==='ru'?'Закрыть':'Close',exact:true}).click();
  await p.locator('.featured-case__cta').first().click();await p.waitForTimeout(700);await p.locator('[data-zoom-trigger]').first().click();await p.keyboard.press('Escape');await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(700);
  await p.setViewportSize({width:width===1440?1024:360,height:600});await p.emulateMedia({reducedMotion:'reduce'});await p.mouse.wheel(0,2000);await p.mouse.wheel(0,-2000);await p.waitForTimeout(500);await p.locator('.hero__proof [data-zoom-trigger]').click();
  const r={lang,width,errors,dialogCount:await p.locator('dialog[open]').count(),url:p.url(),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)};lifecycle.push(r);if(r.errors.length||r.dialogCount!==1||r.url!==url(lang,'')||r.overflow)failures.push(r);
  await p.keyboard.press('Escape');await c.close();
 }
 const alpha=[];for(const f of ['public/media/art-direction/learn/passport-desktop.png','public/media/art-direction/learn/passport-mobile.png','public/media/rebuild/common/portal/availability-stale-288.webp']){
  const bytes=await readFile(f),{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true}),a=(x,y)=>data[(y*info.width+x)*info.channels+3];
  const r={file:f,sha256:createHash('sha256').update(bytes).digest('hex'),corners:[a(0,0),a(info.width-1,0),a(0,info.height-1),a(info.width-1,info.height-1)]};alpha.push(r);if(r.corners.some(v=>v!==0))failures.push(r);
 }
 await writeFile(dir+'/verification.json',JSON.stringify({base,created:new Date().toISOString(),results,zooms,lifecycle,focus,alpha,failures},null,2));
 console.log(JSON.stringify({profiles:results.length,zooms:zooms.length,lifecycle:lifecycle.length,failures:failures.length}));if(failures.length)process.exitCode=1;
}finally{await browser.close();}
