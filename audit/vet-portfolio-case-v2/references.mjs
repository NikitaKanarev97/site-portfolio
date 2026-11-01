import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch();
const results=[];
for(const width of [1440,390]) for(const slug of ['vet-clinic','agent-ops-console','partner-portal']) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 const url=`https://kanarev.com/work/${slug}`;
 try{
  await page.goto(url,{waitUntil:'networkidle',timeout:45000});
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{})))});
  for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80)}
  await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(800);
  const file=`audit/vet-portfolio-case-v2/references/${slug}-${width}`;
  await page.screenshot({path:file+'-viewport.png'});await page.screenshot({path:file+'-full.png',fullPage:true});
  fs.writeFileSync(file+'.txt',await page.locator('main').innerText());
  results.push({url,width,title:await page.title(),version:await page.locator('[data-story-version]').getAttribute('data-story-version'),height:await page.evaluate(()=>document.documentElement.scrollHeight)});
 }catch(e){results.push({url,width,error:e.message})}
 await page.close(); console.log(slug,width);
}
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
try{await page.goto('https://veterinary-clinic-gules.vercel.app/app/visit-record?patient=marsik',{waitUntil:'networkidle',timeout:45000});await page.waitForTimeout(1600);await page.screenshot({path:'audit/vet-portfolio-case-v2/references/published-product-1440.png'});fs.writeFileSync('audit/vet-portfolio-case-v2/references/published-product.txt',await page.locator('body').innerText());results.push({url:page.url(),title:await page.title(),product:await page.locator('[data-visit-record]').count()})}catch(e){results.push({productError:e.message})}
fs.writeFileSync('audit/vet-portfolio-case-v2/references/results.json',JSON.stringify(results,null,2));
await browser.close();
