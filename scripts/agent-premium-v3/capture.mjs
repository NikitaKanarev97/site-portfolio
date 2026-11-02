import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
export const root = 'audit/agent-ops-portfolio-premium-v3';
export const launch = () => chromium.launch({ executablePath: 'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
export async function ready(page) {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager'; return i.decode().catch(()=>{});})); });
  for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60);}
  await page.waitForTimeout(1100); await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(600);
}
export async function save(page, path, locator, fullPage=false) {
  const data = locator ? await locator.screenshot({timeout:20000}) : await page.screenshot({fullPage});
  const {height}=await sharp(data).metadata();
  if(height>16383) {await writeFile(path+'.png',data);return path+'.png';}
  await sharp(data).webp({lossless:true,effort:2}).toFile(path+'.webp'); return path+'.webp';
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/capture.mjs')){
 const phase=process.argv[2]??'before', origin=process.argv[3]??'http://127.0.0.1:4404';
 const browser=await launch(), checks=[];
 try{for(const locale of (process.env.LOCALES?.split(',')??['en','ru']))for(const width of (process.env.WIDTHS?.split(',').map(Number)??[1440,390,360,768,1024])){
  const height=width===360?800:width===390?844:900;
  const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768});
  const page=await context.newPage(), errors=[], failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
  await page.goto(`${origin}${locale==='ru'?'/ru':''}/work/agent-ops-console/`,{waitUntil:'networkidle'});await ready(page);
  const name=`${locale}-${width}`;await mkdir(`${root}/${phase}`,{recursive:true});
  await save(page,`${root}/${phase}/${name}-viewport`);await save(page,`${root}/${phase}/${name}-full`,null,true);
  if([1440,390,360].includes(width)) for(const id of ['problem','operating-model','investigation','checkpoint','policy','autonomy','outcome']) {
   const el=page.locator('#'+id);await el.scrollIntoViewIfNeeded();await page.waitForTimeout(400);await save(page,`${root}/${phase}/${name}-${id}`,el);
  }
  checks.push({locale,width,height,errors,failed,...await page.evaluate(()=>({height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.currentSrc),sections:[...document.querySelectorAll('.agent-section')].map(e=>e.id),words:document.querySelector('.agent-case').innerText.split(/\s+/).length,debug:window.__dsMotionDebug?.()}))});
  await context.close();console.log(`${phase} ${name} captured`);
 }}finally{await writeFile(`${root}/${phase}/checks.json`,JSON.stringify(checks,null,2));await browser.close();}
}
