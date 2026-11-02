import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const require = createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const { chromium } = require('playwright');
const root = 'audit/vet-portfolio-premium-v3';
const product = 'D:/Claude-projects/Veterinary-clinic';
const sha = execFileSync('git',['rev-parse','HEAD'],{cwd:product}).toString().trim();
if (sha !== '3835c4ffe224a1077d131d2882878d3d373d56e5' || execFileSync('git',['status','--porcelain'],{cwd:product}).length) throw Error('Unverified product source');
fs.mkdirSync(`${root}/product-captures`,{recursive:true});
const browser = await chromium.launch();
const media = {};
for (const locale of ['en','ru']) for (const width of [1440,390]) {
  const ctx = await browser.newContext({viewport:{width,height:900},deviceScaleFactor:2,reducedMotion:'reduce',timezoneId:'Europe/Moscow'});
  const page = await ctx.newPage();
  const device = width===1440?'desktop':'mobile';
  for (const [key,route,selector] of [
    ['queue','vet-day-queue','[data-day-queue]'],
    ['trace','visit-quick-trace','[data-screen-trace]'],
    ['publish','discharge-preview','#discharge-publishing'],
  ]) {
    const url = `http://127.0.0.1:5370/${locale==='ru'?'ru/':''}app/${route}?patient=marsik`;
    await page.goto(url,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
    await page.waitForTimeout(1200);
    const full = `${root}/product-captures/${locale}-${key}-${device}-full.png`;
    await page.screenshot({path:full,fullPage:true});
    let sel = selector;
    if (key==='trace' && !await page.locator(sel).count()) sel='[data-motion-screen]';
    const box = await page.locator(sel).first().boundingBox();
    if (!box) throw Error('Missing '+sel);
    // Queue: complete heading, queue context and the complete at-clinic group.
    // Trace: the complete native screen, including validation/saving boundary.
    let clip = {x:Math.floor(box.x),y:Math.floor(box.y+await page.evaluate(()=>scrollY)),width:Math.ceil(box.x+box.width)-Math.floor(box.x),height:Math.ceil(box.height)};
    if (key==='queue') {
      const section = page.locator('[data-day-queue] > section').first();
      const atClinic = await section.boundingBox();
      clip.height = Math.ceil(atClinic.y+atClinic.height)-clip.y;
    }
    if (key==='trace') {
      const weight = await page.locator('[aria-labelledby="trace-weight"]').boundingBox();
      clip = {x:Math.floor(weight.x),y:Math.floor(weight.y),width:Math.ceil(weight.width),height:Math.ceil(weight.height)};
    }
    if(key==='publish' && width===1440) {
      const status = await page.locator('[data-publication-status]').boundingBox();
      clip.y = Math.floor(status.y); clip.height = Math.ceil(box.y+box.height)-clip.y;
    }
    // On phone the status precedes the document; crop the complete controls
    // at their own native position rather than merging nonadjacent regions.
    const size=await sharp(full).metadata();
    const rect={left:clip.x*2,top:clip.y*2,width:Math.min(clip.width*2,size.width-clip.x*2),height:Math.min(clip.height*2,size.height-clip.y*2)};
    const dst=`public/media/case-vet-v3/${locale}/${key}-${device}.webp`;
    fs.mkdirSync(`public/media/case-vet-v3/${locale}`,{recursive:true});
    const info = await sharp(full).extract(rect).webp({lossless:true}).toFile(dst);
    if(key!=='publish') {
      const completeDst=`public/media/case-vet-v3/${locale}/${key}-full-${device}.webp`;
      const all=await sharp(full).webp({lossless:true}).toFile(completeDst);
      media[`${locale}/${key}-full-${device}`]={src:'/'+completeDst.slice(7),width:all.width,height:all.height,cssWidth:all.width/2,cssHeight:all.height/2,sourceCommit:sha,sourceRepository:'NikitaKanarev97/veterinary-clinic',route:new URL(url).pathname+new URL(url).search,locale,viewport:{width,height:900,dpr:2},state:'Untouched locale-specific seed; complete browser screen, including native prototype chrome and mobile sticky action',source:full,clip:{x:0,y:0,width:all.width/2,height:all.height/2},sha256:createHash('sha256').update(fs.readFileSync(completeDst)).digest('hex'),rawSha256:createHash('sha256').update(fs.readFileSync(full)).digest('hex')};
    }
    media[`${locale}/${key}-${device}`]={src:'/'+dst.slice(7),width:info.width,height:info.height,cssWidth:rect.width/2,cssHeight:rect.height/2,sourceCommit:sha,sourceRepository:'NikitaKanarev97/veterinary-clinic',route:new URL(url).pathname+new URL(url).search,locale,viewport:{width,height:900,dpr:2},state:'Untouched locale-specific seed; unpublished clinical record',selector:sel,clip,source:full,sha256:createHash('sha256').update(fs.readFileSync(dst)).digest('hex'),rawSha256:createHash('sha256').update(fs.readFileSync(full)).digest('hex')};
    console.log(locale,key,device,clip);
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync('src/data/vet-v3-media.json',JSON.stringify(media,null,2)+'\n');
