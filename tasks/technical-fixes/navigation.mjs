import{createRequire}from'node:module';
import{writeFile}from'node:fs/promises';
import assert from'node:assert/strict';
const{chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
const origin='http://127.0.0.1:4397';
try{
 for(const [locale,width] of [['en',1440],['ru',1440],['ru',390]]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const prefix=locale==='ru'?'/ru':'';
  for(const selector of ['.hero__proof .case-screen',...Array.from({length:5},(_,i)=>`.featured-case:nth-child(${i+1})`)]){
   await page.goto(origin+prefix+'/',{waitUntil:'networkidle'});
   let item=page.locator(selector);
   // FeaturedCase has siblings: use its own article collection's index.
   if(selector.startsWith('.featured'))item=page.locator('.featured-case').nth(Number(selector.match(/\d+/)[0])-1);
   const href=await item.locator('a[href*="/work/"]').first().getAttribute('href');
   await item.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-100));
   const box=await item.boundingBox();
   await page.mouse.click(box.x+8,box.y+30);
   await page.waitForURL(origin+href,{waitUntil:'networkidle'});
   assert.equal(await page.locator('dialog[open]').count(),0);
   results.push({locale,width,selector,href,wholeContainer:true});
  }
  await page.goto(`${origin}${prefix}/work/learn/`,{waitUntil:'networkidle'});
  await page.locator('#one-material .case-screen__open').first().click();
  await page.locator('dialog[open]').waitFor({state:'visible'});
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
  assert.equal(errors.length,0);results.push({locale,width,detailZoom:true,errors});
  await page.close();console.log('whole-card and zoom',locale,width);
 }
 await writeFile('tasks/technical-fixes/navigation-verification.json',JSON.stringify({passed:true,results},null,2));
}catch(e){await writeFile('tasks/technical-fixes/navigation-failure.json',JSON.stringify({error:String(e),results},null,2));throw e;}
finally{await browser.close();}
