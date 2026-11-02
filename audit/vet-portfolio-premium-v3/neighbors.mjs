import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const root='audit/vet-portfolio-premium-v3';
fs.mkdirSync(`${root}/neighbors`,{recursive:true});
const browser=await chromium.launch();const results=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const locale of ['en','ru'])for(const width of [1440,390])for(const slug of ['home','agent-ops-console','partner-portal','learn','pawly']) {
  const entry={locale,width,slug,versions:{},hashes:{},errors:[]};
  for(const phase of ['before','after']) {
    const p=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',timezoneId:'Europe/Moscow'});
    p.on('pageerror',e=>entry.errors.push(e.message));
    const route=(locale==='ru'?'/ru':'')+(slug==='home'?'/':`/work/${slug}`);
    await p.goto(`http://127.0.0.1:${phase==='before'?5381:5382}`+route,{waitUntil:'networkidle'});
    await p.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode()));});
    for(let y=0;y<await p.evaluate(()=>document.documentElement.scrollHeight);y+=750){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(20);}
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
    entry.versions[phase]=await p.locator('[data-story-version]').first().getAttribute('data-story-version').catch(()=>null);
    entry.hashes[phase]=hash(await p.screenshot({path:`${root}/neighbors/${locale}-${width}-${slug}-${phase}.png`,fullPage:true}));
    entry[`${phase}Overflow`]=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    await p.close();
  }
  entry.pixelIdentical=entry.hashes.before===entry.hashes.after;results.push(entry);console.log(locale,width,slug,entry.pixelIdentical?'IDENTICAL':'DIFF');
}
await browser.close();fs.writeFileSync(`${root}/neighbors/results.json`,JSON.stringify(results,null,2));
if(results.some(r=>!r.pixelIdentical||r.errors.length||r.beforeOverflow||r.afterOverflow))process.exitCode=1;
