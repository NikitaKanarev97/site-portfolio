import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright'),dir='tasks/portfolio-rebuild/art-direction/h-art-04';
const first=JSON.parse(await readFile(dir+'/verification.json','utf8'));
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
for(const r of first.failures){
 const c=await b.newContext({viewport:{width:r.width,height:900},reducedMotion:r.mode==='reduce'?'reduce':'no-preference'}),p=await c.newPage();await p.goto(`http://127.0.0.1:4395/${r.lang==='ru'?'ru/':''}work/${r.slug}/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(const summary of await p.locator('details:not([open]) summary').all())await summary.click();
 for(const screen of await p.locator('.case-screen').all()){
  await screen.scrollIntoViewIfNeeded();const imgs=screen.locator('img');if(await imgs.count())await imgs.evaluate(i=>i.decode());await p.waitForTimeout(r.mode==='full'?1050:20);
 }
 const images=await p.locator('.case-screen img').evaluateAll(imgs=>imgs.map(i=>{const e=i.closest('.case-screen'),s=getComputedStyle(i),r=i.getBoundingClientRect(),box=e.getBoundingClientRect();return {src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,ratio:Math.abs(parseFloat(s.height)-parseFloat(s.width)*i.naturalHeight/i.naturalWidth),padding:parseFloat(getComputedStyle(e).paddingLeft),radius:getComputedStyle(e).borderRadius,fit:s.objectFit,mask:s.clipPath,innerRadius:s.borderRadius,inside:r.left>=box.left&&r.right<=box.right&&r.top>=box.top&&r.bottom<=box.bottom};}));
 let video;
 if(r.slug==='pawly'){
  const v=p.locator('.case-screen video');await v.scrollIntoViewIfNeeded();await v.evaluate(v=>new Promise(resolve=>{if(v.readyState)resolve();else v.addEventListener('loadedmetadata',resolve,{once:true});}));await v.press('Space');await p.waitForTimeout(1200);const playing=await v.evaluate(v=>!v.paused&&v.currentTime>0);await v.press('Space');video=await v.evaluate(v=>({paused:v.paused,controls:v.controls,loop:v.loop,time:v.currentTime,innerPadding:getComputedStyle(v.closest('.media-frame__frame')).padding,ratio:Math.abs(parseFloat(getComputedStyle(v).height)-parseFloat(getComputedStyle(v).width)*v.videoHeight/v.videoWidth)}));video.playing=playing;
 }
 for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=650){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(140);}await p.waitForTimeout(1100);
 await p.evaluate(()=>scrollTo(0,0));if(r.mode==='full')await p.screenshot({path:`${dir}/final/${r.lang}-${r.width}-${r.slug}-full.png`,fullPage:true});
 const failures=images.filter(i=>!i.loaded||!i.inside||i.ratio>.2||i.padding<16||i.radius!=='16px'||i.fit!=='contain'||i.mask!=='none'||i.innerRadius!=='0px');const badVideo=video&&(!video.playing||!video.paused||!video.controls||video.loop||video.innerPadding!=='0px'||video.ratio>.2);
 results.push({lang:r.lang,width:r.width,mode:r.mode,slug:r.slug,images,video,failures,badVideo});await c.close();console.log(`${r.lang} ${r.width} ${r.mode} ${r.slug}: ${failures.length} image flags, badVideo=${Boolean(badVideo)}`);
}
await b.close();const unresolved=results.filter(r=>r.failures.length||r.badVideo);
await writeFile(dir+'/followup-verification.json',JSON.stringify({results,unresolved},null,2));await writeFile(dir+'/verification-resolved.json',JSON.stringify({primaryProfiles:first.profiles.length,homeLightboxes:first.zooms.length,primaryRawFlags:first.failures.length,followupProfiles:results.length,reason:'Four Pawly entries are video carriers without img; verified native controls, play/pause and full ratio separately. Four Vet entries opened a lazy image in a disclosure at the end of the scan without bringing it into view; every current disclosure image was brought into view, decoded, and final complete captures refreshed. Original raw flags retained.',unresolved:unresolved.length},null,2));if(unresolved.length)process.exitCode=1;
