import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const phase=process.argv[2],root=`audit/vet-cover-spacing-2026-11-02/${phase}`;
fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch(),results=[];
for(const locale of ['en','ru'])for(const width of [1440,390,320]) {
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 const entry={locale,width,errors:[]};
 page.on('pageerror',e=>entry.errors.push(e.message));
 await page.goto(`http://localhost:5391/${locale==='ru'?'ru/':''}work/vet-clinic/`,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.vet-cover img').decode();});
 const cover=page.locator('.vet-cover__media');
 await cover.screenshot({path:`${root}/${locale}-${width}-cover.png`});
 entry.geometry=await cover.evaluate(e=>{const media=e.querySelector('.case-screen__media'),img=e.querySelector('img'),r=media.getBoundingClientRect(),i=img.getBoundingClientRect(),s=getComputedStyle(media);return {radius:s.borderRadius,overflow:s.overflow,bottomField:r.bottom-i.bottom,imageWidth:i.width,imageHeight:i.height,src:img.currentSrc,alt:img.alt,documentOverflow:document.documentElement.scrollWidth-innerWidth};});
 const target=page.locator('.vet-cover .case-screen__open');
 await target.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
 entry.keyboard=await target.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible'));
 await target.click();
 entry.zoom=await page.locator('[data-media-zoom][open],dialog[open]').count()>0;
 await page.keyboard.press('Escape');
 results.push(entry);await page.close();
}
await browser.close();fs.writeFileSync(`${root}/metrics.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(r=>({locale:r.locale,width:r.width,...r.geometry,keyboard:r.keyboard,zoom:r.zoom,errors:r.errors})),null,2));
