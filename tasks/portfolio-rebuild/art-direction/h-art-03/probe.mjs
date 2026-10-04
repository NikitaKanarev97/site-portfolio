import {createRequire} from 'node:module';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
for(const width of [1440,390]){
 const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();
 await p.goto('http://127.0.0.1:4394/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:`tasks/portfolio-rebuild/art-direction/h-art-03/after/en-${width}-home-opening.png`});
 for(const slug of ['agent-ops-console','vet-clinic','learn']){
  await p.locator('#work-'+slug).scrollIntoViewIfNeeded();
  await p.locator('#work-'+slug).screenshot({path:`tasks/portfolio-rebuild/art-direction/h-art-03/after/en-${width}-work-${slug}.png`});
 }
 await p.locator('#work-vet-clinic [data-zoom-trigger]').first().click();await p.locator('[data-media-zoom-image]').evaluate(e=>e.decode());
 console.log(width,await p.locator('dialog[open]').evaluate(e=>({height:e.getBoundingClientRect().height,panel:e.firstElementChild.getBoundingClientRect().height,image:e.querySelector('img').getBoundingClientRect().toJSON(),viewport:e.querySelector('[data-media-zoom-viewport]').getBoundingClientRect().toJSON(),caption:e.querySelector('figcaption').getBoundingClientRect().toJSON()})));
 await p.screenshot({path:`tasks/portfolio-rebuild/art-direction/h-art-03/after/en-${width}-vet-lightbox.png`});await c.close();
}
await b.close();
