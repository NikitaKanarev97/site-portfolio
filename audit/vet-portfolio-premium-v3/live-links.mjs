import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const root='audit/vet-portfolio-premium-v3';fs.mkdirSync(`${root}/live-product`,{recursive:true});
const b=await chromium.launch();const results=[];
for(const locale of ['en','ru'])for(const screen of ['visit-record','visit-quick-trace','discharge-preview','dose-calculator']) {
  const page=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const url=`https://veterinary-clinic-gules.vercel.app/${locale==='ru'?'ru/':''}app/${screen}?patient=marsik`;
  try {
    const r=await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
    const content=await page.locator('body').innerText();
    const pass=r.ok()&&content.includes(locale==='ru'?'Марсик':'Marsik')&&!content.includes('This screen does not exist');
    results.push({locale,screen,url,status:r.status(),pass,sha:'Deployment SHA not exposed or inferred'});
    if(screen==='visit-record')await page.screenshot({path:`${root}/live-product/${locale}-1440-visit-record.png`});
    console.log(locale,screen,r.status(),pass);
  } catch(e) {results.push({locale,screen,url,pass:false,error:e.message});console.log('FAIL',url,e.message);}
  await page.close();
}
await b.close();fs.writeFileSync(`${root}/live-product/results.json`,JSON.stringify(results,null,2));if(results.some(r=>!r.pass))process.exitCode=1;
