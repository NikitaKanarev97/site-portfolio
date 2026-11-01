import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const root='audit/vet-home-cover-v1';
await mkdir(`${root}/screenshots/states`,{recursive:true});
const browser=await chromium.launch();
const results=[];
try {
for(const locale of ['en','ru']) for(const width of [1440,390]) {
 const pathname=locale==='ru'?'/ru/':'/';
 const pair=[];
 for(const [phase,port] of [['before',4433],['after',4434]]) {
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:${port}${pathname}work/vet-clinic/`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.case-opening img')].map(i=>i.decode()));});
  const path=`${root}/screenshots/states/${phase}-${locale}-${width}-case-cover.png`;
  await page.locator('.case-opening').screenshot({path});
  pair.push(await sharp(path).raw().toBuffer({resolveWithObject:true}));
  await page.close();
 }
 assert.deepEqual(pair[0].info,pair[1].info);assert.ok(pair[0].data.equals(pair[1].data),'Vet case cover pixels changed');
 results.push({locale,width,caseCoverPixelIdentical:true});
}
for(const locale of ['en','ru']) for(const mode of ['no-js','reduce','normal']) {
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference'});
 const page=await context.newPage();
 await page.goto(`http://127.0.0.1:4434/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
 const card=page.locator('#work-vet-clinic');await card.scrollIntoViewIfNeeded();
 if(mode!=='no-js')await page.evaluate(()=>document.fonts.ready);
 await page.locator('#work-vet-clinic img').waitFor({state:'visible'});
 const image=await page.locator('#work-vet-clinic img').evaluate(async i=>{await i.decode();return {loaded:i.complete&&!!i.naturalWidth,width:i.width,src:i.currentSrc};});
 assert.ok(image.loaded);assert.ok(image.src.includes(`visit-${locale}-390`));
 const anchor=card.locator('.case-screen__open');await anchor.focus();
 const focus=await anchor.evaluate(a=>({focused:document.activeElement===a,outline:getComputedStyle(a).outlineStyle,outlineWidth:getComputedStyle(a).outlineWidth,href:a.getAttribute('href'),label:a.getAttribute('aria-label')}));
 assert.ok(focus.focused);assert.notEqual(focus.outline,'none');assert.ok(focus.label);
 await card.screenshot({path:`${root}/screenshots/states/${locale}-${mode}-390.png`});
 await page.keyboard.press('Enter');await page.waitForURL('**/work/vet-clinic/');
 assert.equal(await page.locator('h1').count(),1);
 results.push({locale,mode,width:390,image,focus,keyboardEnterNavigates:true});
 await context.close();
}
}finally{await browser.close();}
await writeFile(`${root}/logs/browser-qa.json`,JSON.stringify(results,null,2)+'\n');
console.log('PASS: 4 unchanged case-cover pixel comparisons; 6 no-JS/reduce/normal Home focus and real Enter-navigation checks.');
