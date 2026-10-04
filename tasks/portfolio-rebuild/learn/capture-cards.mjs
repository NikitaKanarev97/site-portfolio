import {createRequire} from 'node:module';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const dir='public/media/rebuild/learn/';
const cards=[['setup','Setup','Commissioning TRASSIR OS at a site with up to 32 cameras','Deploy and hand over a site independently','11 units'],['project','Project','Designing a system for 64 cameras or more','Calculate the load and defend the design','9 units'],['handover','Handover','Site handover to the customer','Check site readiness and the document pack','7 units'],['explore','Explore','TRASSIR product range fundamentals','Select hardware for the task without escalation','7 units']];
const report=JSON.parse(await readFile('tasks/portfolio-rebuild/learn/captures.json','utf8')).filter(c=>!c.id.startsWith('theme-'));
for(const [id,mode,title,result,meta] of cards)for(const width of [312,288]){
 const p=await browser.newPage({viewport:{width:800,height:600},deviceScaleFactor:2,reducedMotion:'reduce'});
 const url='http://127.0.0.1:4362/storybook/iframe.html?id=components-card--default&viewMode=story&globals=contentMode:'+mode+'&args=title:'+title+';result:'+result+';meta:'+meta;
 await p.goto(url,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const card=p.locator('#storybook-root div[class*="_root_"]').first();await card.evaluate((e,w)=>{e.parentElement.style.width=w+'px'},width);
 if(!(await card.innerText()).includes(title))throw Error('Card args did not apply');
 await p.addStyleTag({content:'html,body,#storybook-root,.sb-canvas{background:transparent!important;}'});
 const b=await card.boundingBox();const buffer=await p.screenshot({omitBackground:true,clip:{x:b.x-2,y:b.y-2,width:b.width+4,height:b.height+4}});
 const name='theme-'+id+'-'+(width===312?'desktop':'mobile');const file=dir+name+'.webp';const info=await sharp(buffer).webp({quality:94}).toFile(file);
 report.push({id:name,file,source:url,locale:'en',fixture:{mode,title,result,meta},viewport:p.viewportSize(),dpr:2,nativeWidth:width+4,width:info.width,height:info.height,alpha:true,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});
 console.log(name,await card.innerText());await p.close();
}
await browser.close();await writeFile('tasks/portfolio-rebuild/learn/captures.json',JSON.stringify(report,null,2));
for(const f of ['onest-bold.woff2'])await copyFile('D:/Claude-projects/learn/landing/app/public/fonts/'+f,dir+f);
