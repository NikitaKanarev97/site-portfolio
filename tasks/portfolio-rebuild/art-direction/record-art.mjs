import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const out=new URL('./',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});
const results=[];
const selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',').map(a=>a==='home'?'':a);
const slugs=selected||['','agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
await mkdir(`${out}/recordings/after`,{recursive:true});await mkdir(`${out}/shots/scenes`,{recursive:true});
for(const [lang,width,height] of [['en',1440,900],['ru',390,844]])for(const slug of slugs){
 const key=`${lang}-${width}-${slug||'home'}`;
 const c=await browser.newContext({viewport:{width,height},recordVideo:{dir:`${out}/recordings/after`,size:{width,height}}});
 const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
 const marks=[];let elapsed=1.5;
 for(let target=0;target<await p.evaluate(()=>document.documentElement.scrollHeight);target+=650){
  await p.mouse.wheel(0,650);await p.waitForTimeout(650);elapsed+=.65;
  if(slug==='learn' && !marks.includes('programme')){
   const summary=p.locator('[data-case-route]').nth(1).locator('summary');
   const r=await summary.boundingBox();
   if(r&&r.y>=0&&r.y<height-100){await summary.click();await p.waitForTimeout(800);elapsed+=.8;marks.push('programme');}
  }
 }
 await p.waitForTimeout(800);elapsed+=.8;
 if(slug){await p.locator('.case-next__link').click();await p.waitForTimeout(700);await p.goBack();await p.waitForTimeout(700);elapsed+=1.4;}
 await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(600);
 const video=p.video();await c.close();await video.saveAs(`${out}/recordings/after/${key}-walkthrough.webm`);
 results.push({key,approxSeconds:Math.round(elapsed*10)/10,marks,errors});console.log(JSON.stringify(results.at(-1)));
}
const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),p=await c.newPage();
const scenes=[['','work-agent-ops-console'],['','work-partner-portal'],['','work-learn'],['','work-vet-clinic'],['','work-pawly'],['partner-portal','buyer-decision'],['partner-portal','domain-system'],['learn','shared-material'],['vet-clinic','role-boundaries'],['pawly','return-boundary']];
for(const [slug,id] of scenes){
 await p.goto(`http://127.0.0.1:4394/${slug?`work/${slug}/`:''}`,{waitUntil:'networkidle'});
 const node=p.locator(`#${id}`);if(!await node.count()){console.log('Missing scene',id);continue;}
 await node.scrollIntoViewIfNeeded();await p.waitForTimeout(200);await node.screenshot({path:`${out}/shots/scenes/${id}.png`});
}
await c.close();await browser.close();let prior=[];try{prior=JSON.parse(await readFile(`${out}/walkthroughs.json`,'utf8')).results;}catch{}
const merged=[...prior.filter(r=>!results.some(n=>n.key===r.key)),...results];
await writeFile(`${out}/walkthroughs.json`,JSON.stringify({base:'http://127.0.0.1:4394',updated:new Date().toISOString(),results:merged},null,2));
