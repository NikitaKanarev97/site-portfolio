import{createRequire}from'node:module';
import{writeFile}from'node:fs/promises';
import assert from'node:assert/strict';
const{chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
const origin='http://127.0.0.1:4399';
try{
 for(const slug of process.argv.includes('--portal-ru')?['partner-portal']:['agent-ops-console','partner-portal'])for(const locale of process.argv.includes('--portal-ru')?['ru']:['en','ru']){
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${origin}/${locale==='ru'?'ru/':''}work/${slug}/`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
  const scene=page.locator('.case-steps--focus');
  const base=await scene.evaluate(e=>e.closest('.pin-spacer').getBoundingClientRect().top+scrollY);
  await page.evaluate(y=>scrollTo(0,y),base-24+650*1.15);await page.waitForTimeout(500);
  const selected=await scene.locator('[data-focus-state]').evaluateAll(es=>es.findIndex(e=>getComputedStyle(e).visibility==='visible'));
  for(const viewport of [{width:1024,height:1000},{width:390,height:844},{width:1440,height:1000},{width:1440,height:740},{width:1440,height:1000}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(650);
   const data=await scene.evaluate(e=>({focused:e.classList.contains('is-focused'),y:scrollY,base:(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY,overflow:document.documentElement.scrollWidth-innerWidth,states:[...e.querySelectorAll('[data-focus-state]')].map(n=>({visible:getComputedStyle(n).visibility,display:getComputedStyle(n).display,top:n.getBoundingClientRect().top,style:n.querySelector('.case-screen').style.getPropertyValue('--focus-screen-width')}))}));
   results.push({slug,locale,viewport,...data});
   assert(data.overflow<=1);assert.equal(data.focused,viewport.width>=1024&&viewport.height>=820);
   if(data.focused)assert.equal(data.states.findIndex(n=>n.visible==='visible'),selected,JSON.stringify(data));
   else assert(data.states.every(n=>n.style===''));
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(650);
  assert.equal(await scene.evaluate(e=>e.classList.contains('is-focused')),false);
  assert.equal(await scene.locator('[data-focus-state]').evaluateAll(es=>es.every(e=>getComputedStyle(e).visibility!=='hidden')),true);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(650);
  assert.equal(await scene.locator('[data-focus-state]').evaluateAll(es=>es.findIndex(e=>getComputedStyle(e).visibility==='visible')),selected);
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.evaluate(()=>document.documentElement.style.overflowAnchor),'');
  assert.equal(errors.length,0);await page.close();console.log('resize/preferences',slug,locale);
 }
 for(const locale of ['en','ru'])for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${origin}/${locale==='ru'?'ru/':''}work/pawly/`,{waitUntil:'networkidle'});
  const carousel=page.locator('#compatibility .case-carousel');
  await carousel.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
  // Three consecutive actions while native smooth scrolling is still running.
  await carousel.locator('[data-carousel-next]').click({force:true});
  await carousel.locator('[data-carousel-next]').click({force:true});
  await carousel.locator('[data-carousel-next]').click({force:true});
  await page.waitForFunction(()=>document.querySelector('#compatibility [data-carousel-next]').disabled);
  assert.equal(await carousel.locator('[data-carousel-index]').innerText(),'4');
  await carousel.locator('[data-carousel-prev]').click();
  await page.waitForFunction(()=>document.querySelector('#compatibility [data-carousel-index]').textContent!=='4');
  await page.waitForTimeout(500);
  await carousel.locator('[data-carousel-prev]').click({force:true});await carousel.locator('[data-carousel-prev]').click({force:true});
  await page.waitForFunction(()=>document.querySelector('#compatibility [data-carousel-prev]').disabled);
  assert.equal(await carousel.locator('[data-carousel-index]').innerText(),'1');
  await carousel.locator('[data-carousel-track]').press('ArrowRight');await page.waitForTimeout(400);
  await page.setViewportSize({width:width===1440?390:1440,height:1000});await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  const next=page.locator('.case-next');await next.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
  const bounds=await next.evaluate(e=>{const a=e.querySelector('.case-next__marquee').getBoundingClientRect(),b=e.querySelector('.case-next__title').getBoundingClientRect();return{top:b.top-a.top,bottom:a.bottom-b.bottom};});
  assert(bounds.top>=0&&bounds.bottom>=0);
  if(width===1440){await page.setViewportSize({width:1440,height:1000});await next.scrollIntoViewIfNeeded();await page.waitForTimeout(500);await next.screenshot({path:`tasks/portfolio-rebuild/art-direction/h-art-06/evidence/${locale}-next-agent-ops.png`});}
  assert.equal(errors.length,0);results.push({locale,width,carousel:'rapid forward/back; keyboard; resize',nextAgentOps:bounds,errors});
  await page.close();console.log('carousel',locale,width);
 }
 for(const slug of ['learn','pawly'])for(const width of [390,1440]){
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width,height:1000}});
  await page.goto(`${origin}/ru/work/${slug}/`,{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.notEqual(await page.locator('.case-screen__open').first().getAttribute('data-zoom-trigger'),null);
  if(slug==='pawly')assert.equal(await page.locator('#compatibility [data-carousel-bar]').isVisible(),false);
  results.push({slug,width,noJS:true});await page.close();
 }
 await writeFile('tasks/portfolio-rebuild/art-direction/h-art-06/lifecycle-verification.json',JSON.stringify({passed:true,results},null,2));
}catch(e){await writeFile('tasks/portfolio-rebuild/art-direction/h-art-06/lifecycle-failure.json',JSON.stringify({error:String(e),results},null,2));throw e;}
finally{await browser.close();}
