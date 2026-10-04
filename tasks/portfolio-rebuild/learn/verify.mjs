import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const base='http://127.0.0.1:4360';const results=[];const failures=[];const task='tasks/portfolio-rebuild/learn';await mkdir(task+'/shots',{recursive:true});
const check=(ok,where,detail)=>{if(!ok)failures.push({where,detail});};
async function snapshot(p){return p.evaluate(()=>({
 overflow:document.documentElement.scrollWidth-innerWidth,
 focus:document.querySelector('[data-motion="focus-stage"]')?.classList.contains('is-focused'),
 pinSpacers:document.querySelectorAll('#one-material .pin-spacer').length,
 states:[...document.querySelectorAll('[data-focus-state]')].map(e=>({title:e.querySelector('h3').textContent.trim(),opacity:+getComputedStyle(e).opacity,visibility:getComputedStyle(e).visibility,height:e.getBoundingClientRect().height})),
 broken:[...document.querySelectorAll('.case-story img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src),
 sections:document.querySelectorAll('[data-block-type]').length,
}));}
async function readAll(p){
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(30);}
 // Expose native images individually. A fast scan can pass a lazy-loading
 // threshold between browser frames; an unexposed image is not a failed asset.
 const images=p.locator('.case-story img');const focused=await p.locator('[data-motion="focus-stage"]').evaluate(e=>e.classList.contains('is-focused'));
 for(let n=0;n<await images.count();n++){
  const img=images.nth(n);if(focused&&await img.evaluate(e=>Boolean(e.closest('[data-focus-state]'))))continue;
  await img.scrollIntoViewIfNeeded();await p.waitForFunction(e=>e.complete&&e.naturalWidth,await img.elementHandle(),{timeout:5000});
 }
 await p.waitForTimeout(300);
}
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js','short']){
 const height=mode==='short'?600:900;const where=`${lang} ${width}x${height} ${mode}`;
 const ctx=await browser.newContext({viewport:{width,height},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});const p=await ctx.newPage();const errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto(`${base}/preview/learn-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(350);
 await readAll(p);const s=await snapshot(p);
 check(response.status()===200,where,'Page response');check(s.overflow===0,where,'Horizontal overflow');check(s.sections===7,where,'Complete story');check(s.broken.length===0,where,'Broken media');check(errors.length===0,where,'Page errors');
 const enhanced=mode==='full'&&width>=1024;check(s.focus===enhanced,where,'Expected focus enhancement/fallback');
 if(!enhanced)check(s.states.every(v=>v.opacity===1&&v.visibility==='visible'&&v.height>0),where,'All three fallback panels visible');
 if(enhanced){
  const start=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
  s.stops=[];
  for(const [index,offset] of [100,750,1250,750,100].entries()){
   await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+offset);await p.waitForTimeout(450);const state=await snapshot(p);const visible=state.states.filter(v=>v.opacity>0.99&&v.visibility==='visible');
   check(visible.length===1,where,`One whole panel at ${offset}`);const expected=offset===100?0:offset===750?1:2;check(visible[0]?.title===state.states[expected].title,where,`Correct forward/reverse panel at ${offset}`);
   await p.waitForFunction(e=>e.complete&&e.naturalWidth,await p.locator('[data-focus-state]').nth(expected).locator('img').elementHandle(),{timeout:5000});
   s.stops.push({offset,visible:visible.map(v=>v.title)});
   if(width===1440&&index<3)await p.screenshot({path:`${task}/shots/${lang}-1440-motion-${index+1}.png`});
  }
 }
 if(width===360&&mode==='no-js')await p.locator('#one-material').screenshot({path:`${task}/shots/${lang}-360-no-js.png`});
 if(width===1440&&mode==='short')await p.screenshot({path:`${task}/shots/${lang}-1440-short-end.png`});
 results.push({where,...s,errors});console.log(where,s.focus?'focus':'native',failures.length);await ctx.close();
}
// Lifecycle on the current central material, with actual viewport and preference changes.
for(const lang of ['en','ru']){
 const where=lang+' lifecycle';const ctx=await browser.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${base}/preview/learn-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.waitForTimeout(400);
 const start=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
 await p.evaluate(y=>scrollTo(0,y),start+750);await p.waitForTimeout(150);
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(400);let s=await snapshot(p);check(!s.focus&&s.states.every(v=>v.opacity===1),where,'Live reduce restores native flow');
 await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(400);
 const resizes=[];for(const width of [390,1440,1024,360,1440]){
  await p.setViewportSize({width,height:900});await p.waitForTimeout(400);s=await snapshot(p);check(s.overflow===0,where,'Resize overflow');check(s.focus===(width>=1024),where,'Resize enhancement');resizes.push({width,focus:s.focus});
 }
 const a=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
 await p.evaluate(y=>scrollTo(0,y),a+100);await p.mouse.wheel(0,1700);await p.waitForTimeout(300);await p.mouse.wheel(0,-1700);await p.waitForTimeout(300);s=await snapshot(p);check(s.states.filter(v=>v.opacity===1&&v.visibility==='visible').length===1,where,'Fast wheel reverses to one panel');
 // A real second page exercises focus/blur; headless visibility state is recorded, not spoofed.
 const second=await ctx.newPage();await second.goto('about:blank');await second.bringToFront();await p.waitForTimeout(150);const visibility=await p.evaluate(()=>document.visibilityState);await p.bringToFront();await second.close();
 await p.locator('.case-next__link').scrollIntoViewIfNeeded();await p.waitForTimeout(250);
 const track=p.locator('.case-next__track');const before=await track.evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(350);const after=await track.evaluate(e=>getComputedStyle(e).transform);
 await p.locator('.case-next__link').click();await p.waitForURL(`**/${lang==='ru'?'ru/':''}work/vet-clinic/**`);await p.waitForTimeout(250);check((await p.locator('main h1').innerText()).includes(lang==='ru'?'ветклиники':'Vet Clinic'),where,'Native Next click');
 await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(350);check(p.url().includes(`/preview/learn-rebuild/${lang}/`),where,'Back restores Learn');
 await p.goForward({waitUntil:'networkidle'});await p.waitForTimeout(200);check(p.url().includes('/work/vet-clinic'),where,'Forward restores next case');await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(300);
 check(errors.length===0,where,'Lifecycle errors');results.push({where,resizes,visibility,marquee:{before,after,moving:before!==after},errors});await ctx.close();
}
// Actual links on the served production build, including locale switch and product deep URLs.
const ctx=await browser.newContext({reducedMotion:'reduce'});const p=await ctx.newPage();await p.goto(base+'/preview/learn-rebuild/en/',{waitUntil:'networkidle'});
await p.locator('a[href="/preview/learn-rebuild/ru/"]').first().click();await p.waitForURL('**/preview/learn-rebuild/ru/');check(await p.locator('#shared-material').innerText().then(t=>t.includes('Один материал')),'locale','RU body');
const links=[];for(const url of ['/prototypes/learn/home?lang=en','/prototypes/learn/home?lang=ru','/prototypes/learn-landing/?lang=en','/prototypes/learn-landing/?lang=ru']){
 const r=await p.goto(base+url,{waitUntil:'networkidle'});const h1=await p.locator('h1').first().innerText();links.push({url,status:r.status(),h1});check(r.status()===200&&h1.length>5,'links',url);
}
await ctx.close();await browser.close();await writeFile(task+'/verification.json',JSON.stringify({results,links,failures},null,2));
console.log('FAILURES',JSON.stringify(failures));if(failures.length)process.exitCode=1;
