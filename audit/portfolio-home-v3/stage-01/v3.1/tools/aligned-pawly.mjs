/** Diagnostic only: actual raw page screenshots stay untouched. Subpixel Y
 * registration removes page-length rounding from the frozen card comparison. */
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const browser=await chromium.launch({headless:true});const rows=[];
try {
 for(const [phase,port] of [['before',4421],['after',4422]])for(const locale of ['en','ru'])for(const [width,height]of [[1440,900],[390,844],[360,800],[1024,900]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:${port}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready);
  const card=page.locator('#work-pawly'); await card.scrollIntoViewIfNeeded();
  await card.evaluate(async e=>{for(const i of e.querySelectorAll('img'))await i.decode();});
  await page.mouse.move(0,0);
  const detail=await card.evaluate(e=>{const r=e.getBoundingClientRect();const delta=Math.round(r.top)-r.top;e.style.marginBlockStart=`${delta}px`;return {delta,originalTop:r.top,cardWidth:r.width,height:r.height};});
  await card.screenshot({path:`audit/portfolio-home-v3/stage-01/v3.1/screenshots/${phase}/${locale}-${width}-pawly-aligned.png`});rows.push({phase,locale,width,...detail});await page.close();
 }
}finally{await browser.close();await writeFile('audit/portfolio-home-v3/stage-01/v3.1/logs/pawly-alignment.json',JSON.stringify(rows,null,2));}

