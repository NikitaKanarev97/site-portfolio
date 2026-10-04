import {createRequire} from 'node:module';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const base='http://127.0.0.1:4366';const results=[];const failures=[];const task='tasks/portfolio-rebuild/vet-clinic';await mkdir(task+'/shots',{recursive:true});
const check=(ok,where,detail)=>{if(!ok)failures.push({where,detail});};
async function snapshot(p){return p.evaluate(()=>({
 overflow:document.documentElement.scrollWidth-innerWidth,
 focus:document.querySelector('[data-motion="focus-stage"]')?.classList.contains('is-focused'),
 pinSpacers:document.querySelectorAll('#one-visit .pin-spacer').length,
 states:[...document.querySelectorAll('[data-focus-state]')].map(e=>{const img=e.querySelector('img'),r=img.getBoundingClientRect();return {title:e.querySelector('h3').textContent.trim(),opacity:+getComputedStyle(e).opacity,visibility:getComputedStyle(e).visibility,height:e.getBoundingClientRect().height,imageTop:r.top,imageBottom:r.bottom,captionBottom:e.querySelector('.case-steps__caption')?.getBoundingClientRect().bottom??r.bottom,cropRatio:img.naturalWidth/img.naturalHeight/(r.width/r.height)};}),
 broken:[...document.querySelectorAll('.case-story img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc||i.src),
 sections:document.querySelectorAll('[data-block-type]').length,
 contract:[...document.querySelectorAll('[data-block-type]')].map(e=>[e.id,e.dataset.blockType,e.dataset.evidenceId,e.dataset.mediaId,e.dataset.storyMotion]),
 noindex:document.querySelector('meta[name="robots"]')?.content.includes('noindex'),canonical:document.querySelector('link[rel="canonical"]')?.href??null,
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
 // Native horizontal reading exposes all three real state/action panels.
 const track=p.locator('[data-carousel-track]');
 for(const slide of await p.locator('.case-carousel__slide').all()){
  const left=await slide.evaluate(e=>e.offsetLeft);await track.evaluate((e,left)=>e.scrollTo({left,behavior:'instant'}),left);
  await slide.locator('img').scrollIntoViewIfNeeded();await p.waitForFunction(e=>e.complete&&e.naturalWidth,await slide.locator('img').elementHandle(),{timeout:5000});
 }
 await track.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));
}
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js','short']){
 const height=mode==='short'?600:900;const where=`${lang} ${width}x${height} ${mode}`;
 const ctx=await browser.newContext({viewport:{width,height},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});const p=await ctx.newPage();const errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto(`${base}/preview/vet-clinic-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(350);
 await readAll(p);const s=await snapshot(p);
 check(response.status()===200,where,'Page response');check(s.overflow===0,where,'Horizontal overflow');check(s.sections===5,where,'Complete story');check(s.broken.length===0,where,'Broken media');check(errors.length===0,where,'Page errors');check(s.noindex&&!s.canonical,where,'Preview indexing boundary');
 const enhanced=mode==='full'&&width>=1024;check(s.focus===enhanced,where,'Expected focus enhancement/fallback');
 check(s.pinSpacers===(enhanced?1:0),where,'Exactly one central pin, none in fallback');
 if(!enhanced)check(s.states.every(v=>v.opacity===1&&v.visibility==='visible'&&v.height>0),where,'All three fallback panels visible');
 if(enhanced){
  const start=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
  s.stops=[];
  for(const [index,offset] of [100,750,1250,750,100].entries()){
   await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+offset);await p.waitForTimeout(450);const state=await snapshot(p);const visible=state.states.filter(v=>v.opacity>0.99&&v.visibility==='visible');
   check(visible.length===1,where,`One whole panel at ${offset}`);const expected=offset===100?0:offset===750?1:2;check(visible[0]?.title===state.states[expected].title,where,`Correct forward/reverse panel at ${offset}`);
   check(visible[0]?.imageTop>=0&&visible[0]?.imageBottom<=height&&visible[0]?.captionBottom<=height,where,`Whole material and caption fit at ${offset}`);
   check(Math.abs(visible[0]?.cropRatio-1)<0.003,where,`Source image has no content crop at ${offset}`);
   await p.waitForFunction(e=>e.complete&&e.naturalWidth,await p.locator('[data-focus-state]').nth(expected).locator('img').elementHandle(),{timeout:5000});
   s.stops.push({offset,visible:visible.map(v=>v.title)});
   if(width===1440&&index<3)await p.screenshot({path:`${task}/shots/${lang}-1440-motion-${index+1}.png`});
  }
 }
 if(width===360&&mode==='no-js')await p.locator('#one-visit').screenshot({path:`${task}/shots/${lang}-360-no-js.png`});
 if(width===1440&&mode==='short')await p.screenshot({path:`${task}/shots/${lang}-1440-short-end.png`});
 results.push({where,...s,errors});console.log(where,s.focus?'focus':'native',failures.length);await ctx.close();
}
// Lifecycle on the current central material, with actual viewport and preference changes.
for(const lang of ['en','ru']){
 const where=lang+' lifecycle';const ctx=await browser.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${base}/preview/vet-clinic-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.waitForTimeout(400);
 const start=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
 await p.evaluate(y=>scrollTo(0,y),start+750);await p.waitForTimeout(150);
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>!document.querySelector('[data-motion="focus-stage"]').classList.contains('is-focused')&&[...document.querySelectorAll('[data-focus-state]')].every(e=>+getComputedStyle(e).opacity===1),null,{timeout:5000});let s=await snapshot(p);check(!s.focus&&s.states.every(v=>v.opacity===1),where,'Live reduce restores native flow');
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
 check(before!==after,where,'Visible CaseNext marquee moves');
 await p.locator('.case-next__link').click();await p.waitForURL(`**/${lang==='ru'?'ru/':''}work/pawly/**`);await p.waitForTimeout(250);check((await p.locator('main h1').innerText()).includes('Pawly'),where,'Native Next click');
 await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(350);check(p.url().includes(`/preview/vet-clinic-rebuild/${lang}/`),where,'Back restores Vet');
 await p.goForward({waitUntil:'networkidle'});await p.waitForTimeout(200);check(p.url().includes('/work/pawly'),where,'Forward restores next case');await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(300);
 s=await snapshot(p);check(s.pinSpacers===1&&s.focus,where,'Back restores exactly one central scene');check(errors.length===0,where,'Lifecycle errors');results.push({where,resizes,visibility,marquee:{before,after,moving:before!==after},errors});await ctx.close();
}
// EN/RU identifiers, meaning and motion variants agree; real native links work.
const pair=results.filter(r=>r.where==='en 1440x900 reduce'||r.where==='ru 1440x900 reduce');check(JSON.stringify(pair[0]?.contract)===JSON.stringify(pair[1]?.contract),'pair','Ordered bilingual story contract');
const ctx=await browser.newContext({reducedMotion:'reduce'});const p=await ctx.newPage();await p.goto(base+'/preview/vet-clinic-rebuild/en/',{waitUntil:'networkidle'});
await p.locator('a[href="/preview/vet-clinic-rebuild/ru/"]').first().click();await p.waitForURL('**/preview/vet-clinic-rebuild/ru/');check(await p.locator('#one-visit').innerText().then(t=>t.toLowerCase().includes('один визит')),'locale','RU body');
const links=[];for(const lang of ['en','ru']){await p.goto(`${base}/preview/vet-clinic-rebuild/${lang}/`);links.push({locale:lang,next:await p.locator('.case-next__link').getAttribute('href'),prototype:await p.locator('.case-next__proto a').getAttribute('href')});}
check(links.every(l=>l.prototype===`https://veterinary-clinic-gules.vercel.app/${l.locale==='ru'?'ru/':''}`),'links','Localized prototype destinations');
const sitemap=await readFile('dist/sitemap.xml','utf8');check(!sitemap.includes('/preview/'),'sitemap','Preview remains excluded');await ctx.close();
for(const lang of ['en','ru']){
 const c=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false});const page=await c.newPage();await page.goto(`${base}/preview/vet-clinic-rebuild/${lang}/`);
 await page.locator('[data-carousel-track]').scrollIntoViewIfNeeded();await page.locator('[data-carousel-track]').focus();for(let i=0;i<16;i++)await page.keyboard.press('ArrowRight');await page.waitForTimeout(500);check(await page.locator('[data-carousel-track]').evaluate(e=>e.scrollLeft>0),lang+' no-js keyboard','Native state carousel advances with arrow keys');
 await page.locator('[data-carousel-track]').hover();await page.mouse.wheel(650,0);await page.waitForTimeout(500);check(await page.locator('[data-carousel-track]').evaluate(e=>e.scrollLeft>400),lang+' no-js scroll','Native state carousel advances with horizontal wheel');
 await page.locator('.case-next__link').scrollIntoViewIfNeeded();await page.locator('.case-next__link').click();await page.waitForURL(`**/${lang==='ru'?'ru/':''}work/pawly/**`);
 check((await page.locator('main h1').innerText()).includes('Pawly'),lang+' no-js navigation','Next native anchor works');await page.goBack();check(page.url().includes(`/preview/vet-clinic-rebuild/${lang}/`),lang+' no-js navigation','Back works');await c.close();
}
const mobile=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});const mp=await mobile.newPage();await mp.goto(base+'/preview/vet-clinic-rebuild/en/');await mp.locator('[data-navbar-trigger]').click();await mp.locator('[data-navbar-panel] a[href="/preview/vet-clinic-rebuild/ru/"]').click();await mp.waitForURL('**/preview/vet-clinic-rebuild/ru/');check((await mp.locator('#prototype-boundary').innerText()).includes('Несохранённые'), 'mobile locale','Mobile locale navigation');await mobile.close();
await browser.close();await writeFile(task+'/verification.json',JSON.stringify({matrixProfiles:32,results,links,failures,visibilityLimit:'Headless Chromium keeps document visible when switching pages. Actual focus/blur was exercised; hidden-tab pause is not claimed.'},null,2));
console.log('FAILURES',JSON.stringify(failures));if(failures.length)process.exitCode=1;
