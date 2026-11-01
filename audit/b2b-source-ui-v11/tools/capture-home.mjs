import { createRequire } from 'node:module';
import { mkdir,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const {chromium}=require('playwright');
const phase=process.argv[2]??'before';const root='audit/b2b-source-ui-v11';
await mkdir(`${root}/${phase}`,{recursive:true});
const browser=await chromium.launch();const entries=[];
try{
  for(const locale of ['en','ru'])for(const width of [1440,1024,768,390,360]){
    const context=await browser.newContext({viewport:{width,height:width<768?844:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
    const page=await context.newPage();const errors=[],failures=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
    await page.goto(`http://127.0.0.1:4423/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const card=page.locator('#work-partner-portal');
    await card.locator('img').evaluate(i=>i.decode());
    await card.screenshot({path:`${root}/${phase}/${locale}-${width}-portal.png`});
    const protectedData=await page.evaluate(()=>({
      hero:document.querySelector('.hero').outerHTML,
      agent:document.querySelector('#work-agent-ops-console').outerHTML,
      pawly:document.querySelector('#work-pawly').outerHTML,
      vet:document.querySelector('#work-vet-clinic').outerHTML,
    }));
    const protectedHashes=Object.fromEntries(Object.entries(protectedData).map(([key,value])=>[key,createHash('sha256').update(value).digest('hex')]));
    const metrics=await page.evaluate(()=>{const i=document.querySelector('#work-partner-portal img');return {overflow:document.documentElement.scrollWidth-innerWidth,source:i.currentSrc.replace(location.origin,''),complete:i.complete&&!!i.naturalWidth,portraitWidth:document.querySelector('.hero__portrait').getBoundingClientRect().width};});
    entries.push({locale,width,metrics,protectedHashes,errors,failures});await context.close();
  }
}finally{await browser.close();await writeFile(`${root}/logs/${phase}-home.json`,JSON.stringify({phase,browser:browser.version(),entries},null,2)+'\n');}
console.log(`Captured ${entries.length} Portal Home profiles; recorded frozen hero/Agent/Pawly/Vet DOM hashes.`);
