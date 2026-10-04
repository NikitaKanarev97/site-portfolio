import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),c=await b.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),results=[];
await p.goto('http://127.0.0.1:4396/art-review.html',{waitUntil:'networkidle'});
for(const lang of ['en','ru'])for(const width of ['1440','390'])for(const page of ['home','agent-ops-console','partner-portal','learn','vet-clinic','pawly']){
 await p.locator('#lang').selectOption(lang);await p.locator('#width').selectOption(width);await p.locator('#page').selectOption(page);
 await p.locator('main img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
 const broken=await p.locator('main img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));results.push({lang,width,page,broken});
}
await p.locator('#lang').selectOption('ru');await p.locator('#width').selectOption('390');await p.locator('[data-scene="vet-clinic"] .after').click();await p.locator('#viewer-image').evaluate(i=>i.decode());
const modal=await p.locator('dialog[open]').evaluate(e=>({count:document.querySelectorAll('dialog[open]').length,caption:e.querySelector('figcaption').textContent,ratio:Math.abs(e.querySelector('img').clientWidth/e.querySelector('img').clientHeight-e.querySelector('img').naturalWidth/e.querySelector('img').naturalHeight)}));
await p.screenshot({path:'tasks/portfolio-rebuild/art-direction/h-art-03/final/gallery-lightbox-ru.png'});await p.keyboard.press('Escape');const closed=await p.locator('dialog[open]').count()===0;
await b.close();await writeFile('tasks/portfolio-rebuild/art-direction/h-art-03/gallery-verification.json',JSON.stringify({results,modal,closed,failures:results.filter(r=>r.broken.length)},null,2));console.log(JSON.stringify({combinations:results.length,missingAssets:results.reduce((n,r)=>n+r.broken.length,0),modal,closed}));
