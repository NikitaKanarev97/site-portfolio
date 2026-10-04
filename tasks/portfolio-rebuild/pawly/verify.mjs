/** Real production-preview matrix, no changes to shared checks/runtime. */
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const origin='http://127.0.0.1:4370';
const dir='tasks/portfolio-rebuild/pawly/shots';
await mkdir(dir,{recursive:true});
const resume=process.argv.includes('--navigation-only');
const prior=resume?JSON.parse(await readFile('tasks/portfolio-rebuild/pawly/verification.json','utf8')):{records:[],failures:[]};
const records=prior.records.filter(r=>!r.id.startsWith('navigation-')),failures=prior.failures;
async function prepareTransition(p,js){if(js)await p.evaluate(()=>{window.__pawlyTransitionDone=false;document.addEventListener('astro:page-load',()=>{window.__pawlyTransitionDone=true;},{once:true});});}
async function finishTransition(p,js,url){await p.waitForURL(url);if(js)await p.waitForFunction(()=>window.__pawlyTransitionDone===true);await settle(p);}
async function settle(p){await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.loading!=='lazy'||i.complete).map(i=>i.decode().catch(()=>{})));});await p.waitForTimeout(180);}
async function check(p,id){
  const v=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelector('h1')?.textContent,states:document.querySelectorAll('[data-specimen-state]').length,blocks:[...document.querySelectorAll('[data-block-type]')].map(e=>e.id),pins:document.querySelectorAll('.pin-spacer').length,video:[...document.querySelectorAll('video')].map(e=>({controls:e.controls,loop:e.loop,autoplay:e.autoplay,paused:e.paused})),broken:[...document.images].filter(i=>i.getAttribute('src')&&getComputedStyle(i).display!=='none'&&i.complete&&!i.naturalWidth).map(i=>i.src),robots:document.querySelector('meta[name=robots]')?.content,canonical:!!document.querySelector('link[rel=canonical]')}));
  if(v.overflow>0||v.states!==11||v.pins||v.broken.length||!v.h1||!v.robots?.includes('noindex')||v.canonical||v.video.some(x=>!x.controls||x.loop||x.autoplay)) failures.push({id,...v});
  return v;
}
try{
  if(!resume)for(const locale of ['en','ru']) for(const [width,height] of [[1440,900],[1024,900],[390,844],[360,800],[1440,600]]) for(const mode of ['full','reduce','no-js']){
    const id=`${locale}-${width}-${height}-${mode}`;
    const p=await browser.newPage({viewport:{width,height},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference'});
    const errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.goto(`${origin}/preview/pawly-rebuild/${locale}/`,{waitUntil:'networkidle'});await settle(p);
    for(const block of await p.locator('[data-block-type],#return-proof').all()) {await block.scrollIntoViewIfNeeded();await settle(p);}
    const track=p.locator('[data-carousel-track]');
    await track.evaluate(e=>e.scrollTo({left:e.scrollWidth,behavior:'instant'}));await settle(p);
    await track.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));await settle(p);
    const measurements=await check(p,id);
    if(errors.length)failures.push({id,errors});
    if(mode==='reduce'&&[1440,390,360].includes(width)&&height!==600){
      await p.evaluate(()=>scrollTo(0,0));await settle(p);
      await p.screenshot({path:`${dir}/${id}-full.png`,fullPage:true});
      await p.screenshot({path:`${dir}/${id}-cover.png`});
      for(const block of ['compatibility','return-boundary','proof-system','walker-earnings','inspectable-care','return-proof']){
        const el=p.locator(`#${block}`);await el.scrollIntoViewIfNeeded();await settle(p);await el.screenshot({path:`${dir}/${id}-${block}.png`});
      }
      for(const set of ['photo-proof','timeline-row','info-note'])await p.locator(`[data-specimen-set=${set}]`).screenshot({path:`${dir}/${id}-${set}.png`});
    }
    if(mode==='full'){
      await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await p.mouse.wheel(0,-25000);await settle(p);
      await p.setViewportSize({width:width>=1024?390:1440,height});await settle(p);await p.setViewportSize({width,height});await settle(p);
      await p.emulateMedia({reducedMotion:'reduce'});await settle(p);await p.emulateMedia({reducedMotion:'no-preference'});await settle(p);
      measurements.lifecycle=await check(p,id+'-lifecycle');
    }
    records.push({id,errors,...measurements});await p.close();
    await writeFile('tasks/portfolio-rebuild/pawly/verification.json',JSON.stringify({origin,records,failures},null,2));
  }
  // Native locale and Next/Back, including no-JS. Use exact hrefs, no destinations invented.
  for(const locale of ['en','ru'])for(const js of [true,false]){
    const p=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:js,reducedMotion:'reduce'});
    await p.goto(`${origin}/preview/pawly-rebuild/${locale}/`);await settle(p);
    const other=locale==='en'?'ru':'en';
    if(js)await p.locator('[data-navbar-trigger]').click();
    await prepareTransition(p,js);await p.locator(`a[href='/preview/pawly-rebuild/${other}/']:visible`).first().click();await finishTransition(p,js,`**/preview/pawly-rebuild/${other}/`);
    await prepareTransition(p,js);await p.goBack();await finishTransition(p,js,`**/preview/pawly-rebuild/${locale}/`);
    const next=p.locator('.case-next a').first();await next.scrollIntoViewIfNeeded();const href=await next.getAttribute('href');await prepareTransition(p,js);await next.focus();await p.keyboard.press('Enter');await finishTransition(p,js,'**'+href);
    await prepareTransition(p,js);await p.goBack();await finishTransition(p,js,`**/preview/pawly-rebuild/${locale}/`);
    records.push({id:`navigation-${locale}-${js}`,href,url:p.url(),...(await check(p,`navigation-${locale}-${js}`))});await p.close();
    await writeFile('tasks/portfolio-rebuild/pawly/verification.json',JSON.stringify({origin,records,failures},null,2));
  }
  await writeFile('tasks/portfolio-rebuild/pawly/verification.json',JSON.stringify({origin,records,failures},null,2));
  console.log(JSON.stringify({profiles:records.length,failures},null,2));
  if(failures.length)process.exitCode=1;
}finally{await browser.close();}
