import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const base='http://127.0.0.1:4394';
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});
const profiles=[],failures=[],fastScroll=[];
for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js']){
 const c=await browser.newContext({viewport:{width,height:844},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage();
 for(const slug of ['','learn']){
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`${base}/${lang==='ru'?'ru/':''}${slug?'work/learn/':''}`,{waitUntil:'networkidle'});
  const passport=p.locator('.work-stage--learn .case-screen--native img').last();
  await passport.scrollIntoViewIfNeeded();await p.waitForTimeout(mode==='full'?1250:100);
  const media=await passport.evaluate(e=>({src:e.currentSrc,loaded:e.complete&&e.naturalWidth>0,width:e.getBoundingClientRect().width,opacity:Number(getComputedStyle(e).opacity),radius:getComputedStyle(e.closest('.case-screen')).borderRadius,overflow:getComputedStyle(e.closest('.case-screen')).overflow,shadow:getComputedStyle(e.closest('.case-screen')).boxShadow}));
  let disclosure;
  if(slug){const d=p.locator('[data-case-route]').nth(1);await d.locator('summary').press('Enter');disclosure=await d.getAttribute('open')!==null;}
  const header=await p.locator('.work-stage--learn .case-screen--native img').first().evaluate(e=>({loaded:e.complete&&e.naturalWidth>0,radius:getComputedStyle(e.closest('.case-screen')).borderRadius,overflow:getComputedStyle(e.closest('.case-screen')).overflow,shadow:getComputedStyle(e.closest('.case-screen')).boxShadow}));
  const r={lang,width,mode,slug,media,header,disclosure,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),errors};
  profiles.push(r);if(!media.loaded||media.opacity!==1||media.radius!=='0px'||media.overflow!=='visible'||media.shadow!=='none'||!header.loaded||header.radius!=='0px'||header.overflow!=='visible'||header.shadow!=='none'||r.overflow||disclosure===false||errors.length)failures.push(r);
 }
 await c.close();
}
for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js']){
 const c=await browser.newContext({viewport:{width,height:844},reducedMotion:mode==='reduce'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${base}/kit/#h-native-routes`,{waitUntil:'networkidle'});const d=p.locator('#h-native-routes [data-case-route]').nth(1);await d.locator('summary').press('Enter');await p.waitForTimeout(100);
 const r={slug:'kit',width,mode,opened:await d.getAttribute('open')!==null,mediaVisible:await d.locator('img').isVisible(),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),errors};profiles.push(r);if(!r.opened||!r.mediaVisible||r.overflow||errors.length)failures.push(r);await c.close();
}
const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage();await p.goto(`${base}/ru/`,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
for(let n=0;n<20;n++){await p.mouse.wheel(0,650);await p.waitForTimeout(650);fastScroll.push({step:n,...await p.evaluate(()=>({y:scrollY,visible:[...document.querySelectorAll('.work-stage img')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>({src:e.currentSrc,complete:e.complete,naturalWidth:e.naturalWidth,opacity:Number(getComputedStyle(e).opacity),top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}))}))});}
await c.close();await browser.close();
const alpha=[];
for(const file of ['passport-desktop.png','passport-mobile.png']){const {data,info}=await sharp(`public/media/art-direction/learn/${file}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});const a=(x,y)=>data[(y*info.width+x)*info.channels+3];alpha.push({file,width:info.width,height:info.height,corners:[a(0,0),a(info.width-1,0),a(0,info.height-1),a(info.width-1,info.height-1)]});}
if(alpha.some(a=>a.corners.some(v=>v!==0)))failures.push({issue:'passport exterior alpha',alpha});
await writeFile(new URL('./final-scene-verification.json',import.meta.url),JSON.stringify({base,created:new Date().toISOString(),profiles,fastScroll,alpha,failures},null,2));console.log(JSON.stringify({profiles:profiles.length,alpha,failures,fastScroll:fastScroll.filter(s=>s.visible.some(e=>e.opacity<.05))}));
