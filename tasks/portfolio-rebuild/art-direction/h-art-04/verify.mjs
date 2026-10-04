import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const base='http://127.0.0.1:4395',dir='tasks/portfolio-rebuild/art-direction/h-art-04/final';
await mkdir(dir,{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),profiles=[],zooms=[],failures=[],errors=[];
const slugs=['','agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
const url=(lang,slug)=>`${base}/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`;
async function view(lang,width,mode,slug){
 const c=await b.newContext({viewport:{width,height:900},javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduce'?'reduce':'no-preference'}),p=await c.newPage();p.on('pageerror',e=>errors.push({lang,width,mode,slug,error:e.message}));
 await p.goto(url(lang,slug),{waitUntil:'networkidle'});if(mode!=='nojs')await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(mode==='full'?1100:100);
 let hero;
 if(!slug)hero=await p.evaluate(()=>({ui:document.querySelector('.hero__proof img').getBoundingClientRect().toJSON(),nav:[...document.querySelectorAll('.work-index a')].map(a=>a.getBoundingClientRect().toJSON()),actions:document.querySelector('.hero__actions').getBoundingClientRect().toJSON(),role:document.querySelector('.hero__name').innerText,headline:[...document.querySelectorAll('.hero__role>span')].map(e=>e.getBoundingClientRect().toJSON())}));
 const height=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<height;y+=650){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(mode==='full'?140:15);}await p.waitForTimeout(mode==='full'?1100:100);
 for(const el of await p.locator('details:not([open]) summary').all()){await el.click();}await p.waitForTimeout(100);
 const geometry=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,images:[...document.querySelectorAll('.case-screen')].filter(e=>e.getClientRects().length).map(e=>{const i=e.querySelector('img'),s=getComputedStyle(e),cs=i&&getComputedStyle(i),box=e.getBoundingClientRect(),r=i?.getBoundingClientRect();return{src:i?.currentSrc,loaded:!i||i.complete&&i.naturalWidth>0,padding:parseFloat(s.paddingLeft),radius:s.borderRadius,fit:cs?.objectFit,mask:cs?.clipPath,innerRadius:cs?.borderRadius,ratio:i&&Math.abs(parseFloat(cs.height)-parseFloat(cs.width)*i.naturalHeight/i.naturalWidth),inside:!i||r.left>=box.left&&r.right<=box.right&&r.top>=box.top&&r.bottom<=box.bottom};})}));
 const r={lang,width,mode,slug,hero,...geometry};profiles.push(r);
 if(geometry.overflow>1||geometry.images.some(i=>!i.loaded||!i.inside||i.padding<16||i.radius!=='16px'||i.fit!=='contain'||i.mask!=='none'||i.innerRadius!=='0px'||i.ratio>.2))failures.push(r);
 if(hero&&(hero.nav.length!==5||Math.max(...hero.nav.map(n=>n.bottom))>600||hero.ui.top>650||hero.actions.bottom>(width<768?1624:2160)))failures.push({reason:'Home first impression / access budget',...r});
 if(mode==='full'&&(width===1440||width===390)){
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(200);await p.screenshot({path:`${dir}/${lang}-${width}-${slug||'home'}-full.png`,fullPage:true});
  if(!slug){await p.locator('.hero').screenshot({path:`${dir}/${lang}-${width}-home-hero.png`});for(const a of await p.locator('.featured-case').all()){await a.scrollIntoViewIfNeeded();await p.waitForTimeout(600);await a.screenshot({path:`${dir}/${lang}-${width}-${await a.getAttribute('id')}.png`});}}
  else {await p.locator('.case-opening').screenshot({path:`${dir}/${lang}-${width}-${slug}-cover.png`});}
 }
 if(!slug&&mode==='full'&&(width===1440||width===390)){
  for(const a of await p.locator('.case-screen__open').all()){
   await a.scrollIntoViewIfNeeded();const src=await a.locator('img').evaluate(i=>i.currentSrc);await a.click();await p.locator('[data-media-zoom-image]').evaluate(i=>i.decode());
   const z=await p.locator('dialog[open]').evaluate(e=>{const i=e.querySelector('[data-media-zoom-image]'),vp=e.querySelector('[data-media-zoom-viewport]'),s=getComputedStyle(i),r=e.getBoundingClientRect();return{src:i.src,caption:e.querySelector('figcaption').textContent,ratio:Math.abs(parseFloat(s.height)-parseFloat(s.width)*i.naturalHeight/i.naturalWidth),contained:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,scrollable:vp.scrollHeight>vp.clientHeight};});
   await p.keyboard.press('Escape');const focus=await a.evaluate(e=>document.activeElement===e),same=p.url().split('#')[0]===url(lang,'');zooms.push({lang,width,source:src,...z,focus,same});if(z.src!==src||!z.caption||z.ratio>.2||!z.contained||!focus||!same)failures.push({reason:'zoom',lang,width,...z,focus,same});
  }
 }
 await c.close();console.log(`${lang} ${width} ${mode} ${slug||'home'} ${geometry.images.length} images`);
}
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','nojs'])for(const slug of ['', 'vet-clinic'])await view(lang,width,mode,slug);
for(const lang of ['en','ru'])for(const width of [1440,390])for(const slug of slugs.filter(s=>s&&s!=='vet-clinic'))await view(lang,width,'full',slug);
await b.close();await writeFile('tasks/portfolio-rebuild/art-direction/h-art-04/verification.json',JSON.stringify({profiles,zooms,failures,errors},null,2));console.log(JSON.stringify({profiles:profiles.length,zooms:zooms.length,failures:failures.length,errors:errors.length}));if(failures.length||errors.length)process.exitCode=1;
