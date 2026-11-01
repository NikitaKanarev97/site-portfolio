import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const browser=await chromium.launch();const results=[];
try{
 for(const locale of ['en','ru'])for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});page.setDefaultTimeout(8000);
  await page.goto(`http://127.0.0.1:4412/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  if(width<768)await page.locator('[data-navbar-trigger]').click();
  const link=page.locator('.navbar a[href$="#contact"]').filter({visible:true}).first();await link.click();await page.waitForFunction(()=>location.hash==='#contact');assert(await page.locator('#contact-heading').isVisible());
  const email=await page.locator('#contact a[href^="mailto:"]').getAttribute('href');assert(email.includes('nikita.kanarev.dev@outlook.com'));
  await page.keyboard.press('Tab');await page.locator('.hero__work-link').focus();
  const outline=await page.locator('.hero__work-link').evaluate(e=>{const s=getComputedStyle(e);return {style:s.outlineStyle,width:s.outlineWidth,color:s.outlineColor};});assert.notEqual(outline.style,'none');assert(parseFloat(outline.width)>=2);
  results.push({locale,width,contactAnchor:true,email,keyboardFocusOutline:outline});await page.close();
 }
 const p=await browser.newPage();await p.goto('http://127.0.0.1:4412/',{waitUntil:'networkidle'});
 const urls=await p.locator('[data-dialog-open]').evaluateAll(nodes=>nodes.map(a=>a.href));
 results.push({externalDemos:await Promise.all(urls.map(async url=>{try{const r=await p.request.get(url,{timeout:15000});return {url,status:r.status(),ok:r.ok()};}catch(e){return {url,error:e.message};}}))});
}finally{await browser.close();await writeFile('audit/portfolio-home-v3/stage-01/logs/conversion.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify(results,null,2));
