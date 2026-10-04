import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const b=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[];
for(const lang of ['en','ru'])for(const width of [1440,1024])for(const height of [900,820]){
 const p=await b.newPage({viewport:{width,height}});await p.goto(`http://127.0.0.1:4366/preview/vet-clinic-rebuild/${lang}/`,{waitUntil:'networkidle'});await p.waitForTimeout(350);
 const start=await p.locator('[data-motion="focus-stage"]').evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
 for(const offset of [100,750,1250]){await p.evaluate(y=>scrollTo(0,y),start+offset);await p.waitForTimeout(200);
  const panels=await p.locator('[data-focus-state]').evaluateAll(es=>es.filter(e=>getComputedStyle(e).visibility==='visible').map(e=>{const img=e.querySelector('img'),frame=e.querySelector('.case-screen'),plate=e.querySelector('.case-plate'),r=img.getBoundingClientRect(),f=frame.getBoundingClientRect();return {title:e.querySelector('h3').textContent,image:[r.width,r.height],frame:[f.width,f.height],natural:[img.naturalWidth,img.naturalHeight],plateHeight:plate.getBoundingClientRect().height,cropRatio:img.naturalWidth/img.naturalHeight/(r.width/r.height),imageTop:r.top,imageBottom:r.bottom,captionBottom:e.querySelector('.case-steps__caption')?.getBoundingClientRect().bottom??r.bottom};}));
  const result={lang,width,height,offset,panels};results.push(result);if(panels.length!==1||panels.some(v=>Math.abs(v.cropRatio-1)>0.003||v.imageTop<0||v.imageBottom>height||v.captionBottom>height))failures.push(result);
  if(height===900)await p.screenshot({path:`tasks/portfolio-rebuild/vet-clinic/shots/${lang}-${width}-focus-${offset}.png`});
 }
 await p.close();
}
await b.close();
await writeFile('tasks/portfolio-rebuild/vet-clinic/focus-geometry.json',JSON.stringify({results,failures},null,2));console.log(JSON.stringify({stops:results.length,failures},null,2));if(failures.length)process.exitCode=1;
