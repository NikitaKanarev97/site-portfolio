import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const origin='http://127.0.0.1:4395', records=[];
await mkdir('tasks/technical-fixes',{recursive:true});
const one=JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-one.json','utf8'));
const ready=JSON.parse(await readFile('D:/Claude-projects/learn/audit/product-polish/evidence/07/state-marina-ready.json','utf8'));
one.toasts=[]; ready.toasts=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
async function save(page,file,buffer,selection){
  await sharp(buffer).toFile(file);
  const bytes=await readFile(file),meta=await sharp(bytes).metadata();
  records.push({file,source:page.url(),selection,viewport:page.viewportSize(),width:meta.width,height:meta.height,dpr:2,sha256:hash(bytes)});
  console.log(file,meta.width,meta.height);
}
async function go(page,path){await page.goto(origin+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);}
async function region(page,boxes,pad=24){
  const width=page.viewportSize().width;
  const x=Math.max(0,Math.floor(Math.min(...boxes.map(b=>b.x))-pad));
  const y=Math.max(0,Math.floor(Math.min(...boxes.map(b=>b.y))-pad));
  const right=Math.min(width,Math.ceil(Math.max(...boxes.map(b=>b.x+b.width))+pad));
  const bottom=Math.ceil(Math.max(...boxes.map(b=>b.y+b.height))+pad);
  return page.screenshot({fullPage:true,clip:{x,y,width:right-x,height:bottom-y},animations:'disabled'});
}
try{
 for(const width of [1440,390]){
  const variant=width===1440?'desktop':'mobile';
  const context=await browser.newContext({viewport:{width,height:1600},deviceScaleFactor:2,reducedMotion:'reduce'});
  const page=await context.newPage();
  await go(page,'/prototypes/learn/material/onvif-not-found?lang=en');
  const trust=page.locator('div[class*="_root_"]').filter({has:page.locator('span[class*="_version_"]')}).last();
  const section=page.locator('main section').filter({has:page.locator('h2')}).first();
  const boxes=await Promise.all([trust.boundingBox(),page.locator('h1').boundingBox(),section.boundingBox()]);
  if(width===1440){const rail=await page.locator('aside').boundingBox();boxes.push({...rail,height:Math.min(rail.height,boxes[2].y+boxes[2].height-rail.y)});}
  await save(page,`public/media/art-direction/learn/material-${variant}.png`,await region(page,boxes),'Version, whole title and first complete diagnostic section with native pale-blue fields on all four sides. Related rail retained on desktop. Native UI untouched.');
  await save(page,`public/media/rebuild/learn/answer-${variant}.webp`,await region(page,boxes),'Same complete first diagnostic section and native fields.');
  await page.evaluate(s=>sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s)),one);
  await go(page,'/prototypes/learn/player/puskonaladka/2?lang=en');
  const article=await page.locator('article').boundingBox();
  const lastHeading=await page.getByRole('heading',{name:'If nothing helped',exact:true}).boundingBox();
  const action=await page.getByRole('button',{name:'Complete and continue',exact:true}).boundingBox();
  const endBox={x:article.x,y:lastHeading.y,width:article.width,height:action.y+action.height-lastHeading.y};
  await save(page,`public/media/rebuild/learn/completion-${variant}.webp`,await region(page,[endBox,action]),'Whole final diagnostic section, completion notice and next action. Curriculum outside the selected region; no clipped curriculum row. Native UI untouched.');
  await page.evaluate(s=>sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s)),ready);
  await go(page,'/prototypes/learn/assessment/intro?trajectoryId=proekt&lang=en');
  const title=await page.locator('h1').boundingBox();
  const rules=await page.locator('div[class*="_card_"]').filter({has:page.getByText('Attempts remaining',{exact:true})}).first().boundingBox();
  await save(page,`public/media/rebuild/learn/assessment-${variant}.webp`,await region(page,[title,rules],32),'Whole assessment heading, notice and rules with 32px native blue above and below; symmetric native page gutters.');
  await go(page,'/prototypes/learn-landing/?lang=en');
  const hero=page.locator('.ed-hero');
  const bottom=await hero.boundingBox();
  await save(page,`public/media/rebuild/learn/landing-${variant}.webp`,await page.screenshot({fullPage:true,clip:{x:0,y:0,width,height:Math.ceil(bottom.y+bottom.height)},animations:'disabled'}),'Full landing navigation and hero, ending at the section boundary before the next heading.');
  await context.close();
 }
 // Isolate native component alpha; only outer page wrappers become transparent.
 const context=await browser.newContext({viewport:{width:320,height:1000},deviceScaleFactor:2,reducedMotion:'reduce'});
 const page=await context.newPage();
 for(const type of ['trust','progress']){
  await page.evaluate(s=>sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s)),one).catch(()=>{});
  await go(page,type==='trust'?'/prototypes/learn/material/onvif-not-found?lang=en':'/prototypes/learn/player/puskonaladka/2?lang=en');
  const el=type==='trust'?page.locator('div[class*="_root_"]').filter({has:page.locator('span[class*="_version_"]')}).last():page.locator('div[class*="_meter_"]').first();
  await el.evaluate(node=>{let p=node.parentElement;while(p){p.style.background='transparent';p=p.parentElement;}});
  const buffer=await el.screenshot({omitBackground:true,animations:'disabled'});
  for(const variant of ['desktop','mobile'])await save(page,`public/media/rebuild/learn/${type}-${variant}.webp`,buffer,'Whole native component with true outer transparency. Original component typography, border, padding and alpha preserved.');
 }
 await context.close();
 for(const locale of ['en','ru'])for(const [name,original] of [['address-input','address-input'],['verification-details','clip-verification-poster']]){
  const source=`public/media/case-pawly${locale==='ru'?'-ru':''}/${original}.webp`;
  const file=`public/media/rebuild/pawly/${locale}/${name}.webp`;
  await copyFile(source,file);
  const bytes=await readFile(file),meta=await sharp(bytes).metadata();
  records.push({id:`${locale}-${name}`,file,source,locale,width:meta.width,height:meta.height,reused:true,selection:'Complete native screen reused without pixel changes.',sha256:hash(bytes)});
 }
 const archive='public/media/rebuild/learn/archive-catalog.webp';
 const archiveBytes=await readFile(archive),archiveMeta=await sharp(archiveBytes).metadata();
 records.push({id:'archive-catalog',file:archive,source:'D:/Claude-projects/Site-portfolio/public/media/rebuild/learn/archive-catalog.webp',width:archiveMeta.width,height:archiveMeta.height,selection:'Existing corrected native archive catalog, ending after the first complete card row.',reused:true,sha256:hash(archiveBytes)});
 await writeFile('tasks/technical-fixes/captures.json',JSON.stringify(records,null,2));
 const previous=JSON.parse(await readFile('tasks/portfolio-rebuild/learn/captures.json','utf8'));
 await writeFile('tasks/portfolio-rebuild/learn/captures.json',JSON.stringify(previous.map(r=>{const replacement=records.find(n=>n.file===r.file);return replacement?{...r,...replacement}:r;}),null,2));
}finally{await browser.close();}
