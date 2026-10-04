import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-03';
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
for(const mode of ['full','reduce','no-js']){
 const c=await b.newContext({viewport:{width:360,height:844},reducedMotion:mode==='full'?'no-preference':'reduce',javaScriptEnabled:mode!=='no-js'}),p=await c.newPage();
 await p.goto('http://127.0.0.1:4394/ru/work/vet-clinic/',{waitUntil:'networkidle'});
 const track=p.locator('[data-carousel-track]');await track.scrollIntoViewIfNeeded();await track.evaluate(e=>e.scrollLeft=e.scrollWidth);await p.waitForTimeout(1200);
 const publication=p.locator('img[src*="/publication-ru-"]').first();await publication.scrollIntoViewIfNeeded();await publication.evaluate(i=>i.decode());
 const rows=await publication.evaluateAll(images=>images.map(i=>{const s=getComputedStyle(i);return{src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,width:s.width,height:s.height,delta:Math.abs(parseFloat(s.height)-parseFloat(s.width)*i.naturalHeight/i.naturalWidth),fit:s.objectFit};}));
 results.push({width:360,lang:'ru',slug:'vet-clinic',mode,rows,passed:rows.every(r=>r.loaded&&r.fit==='contain'&&r.delta<.1)});await c.close();
}
for(const lang of ['en','ru'])for(const width of [1440,390]){
 const c=await b.newContext({viewport:{width,height:844},reducedMotion:'reduce'}),p=await c.newPage();await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}work/partner-portal/#domain-system`,{waitUntil:'networkidle'});
 const set=p.locator('[data-specimen-set="availability"]');await set.scrollIntoViewIfNeeded();await set.screenshot({path:`${dir}/final/${lang}-${width}-availability-native-context.png`});
 results.push({lang,width,kit:false,alphaEdgeContext:true,passed:await set.locator('img').evaluateAll(images=>images.every(i=>getComputedStyle(i).borderRadius==='0px'&&getComputedStyle(i).objectFit==='contain'))});
 await p.goto('http://127.0.0.1:4394/kit/',{waitUntil:'networkidle'});await p.locator('button[data-zoom-trigger]').first().click();const opened=await p.locator('dialog[open]').count();await p.keyboard.press('Escape');results.push({lang,width,kit:true,passed:opened===1&&await p.locator('[data-media-zoom]').count()===1});await c.close();
}
await b.close();await writeFile(dir+'/followup-verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify({profiles:results.length,failures:results.filter(r=>!r.passed).length}));
const primary=JSON.parse(await readFile(dir+'/verification.json','utf8'));
const unresolved=primary.failures.filter(r=>!r.mode||r.lang!=='ru'||r.width!==360||r.slug!=='vet-clinic');
unresolved.push(...results.filter(r=>!r.passed));
await writeFile(dir+'/verification-resolved.json',JSON.stringify({primary:'verification.json',primaryProfiles:primary.results.length,lightboxOpenings:primary.zooms.length,lifecycle:primary.lifecycle.length,followup:results.length,initialFlags:primary.failures.length,reason:'Three RU360 tall images flagged by integer clientWidth/clientHeight quantization. All three modes rechecked with computed fractional CSS dimensions; native ratio within 0.1 CSS pixel. No image or UI pixel changes.',unresolved},null,2));
if(unresolved.length)process.exitCode=1;
