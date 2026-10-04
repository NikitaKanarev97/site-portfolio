import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const {chromium}=require('playwright');
const origin='http://127.0.0.1:5261', task='tasks/portfolio-rebuild/vet-clinic', out='public/media/rebuild/vet-clinic';
await mkdir(out,{recursive:true});await mkdir(task+'/source-shots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const captures=[], checks=[], errors=[];
const key='vet-clinic-wire-data-v6';
const log=(name,ok,details)=>{checks.push({name,ok,details});if(!ok)throw Error(name+': '+details);};
async function go(p,route,locale='en'){await p.goto(origin+(locale==='ru'?'/ru':'')+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);}
async function snap(p,id,loc,fixture,extra={}){
 const b=await loc.screenshot();const f=out+'/'+id+'.webp';const info=await sharp(b).webp({quality:94}).toFile(f);
 captures.push({id,file:f,route:p.url(),fixture,locale:id.includes('-ru')?'ru':'en',viewport:p.viewportSize(),dpr:2,width:info.width,height:info.height,sha256:createHash('sha256').update(await readFile(f)).digest('hex'),...extra});console.log(id,info.width,info.height);
}
async function collate(p,id,locators,fixture){
 const parts=[];let height=0,width=0;
 for(const loc of locators){const b=await loc.screenshot();const info=await sharp(b).metadata();width=Math.max(width,info.width);parts.push({input:b,left:0,top:height});height+=info.height+24;}
 const file=out+'/'+id+'.webp';await sharp({create:{width,height:height-24,channels:4,background:'#ffffff'}}).composite(parts).webp({quality:94}).toFile(file);
 captures.push({id,file,route:p.url(),fixture,locale:id.includes('-ru')?'ru':'en',viewport:p.viewportSize(),dpr:2,width,height:height-24,composition:'Unaltered DOM crops in source order; omitted unrelated form blocks; 12 CSS px editorial gaps',sha256:createHash('sha256').update(await readFile(file)).digest('hex')});console.log(id,width,height-24);
}
const ctx=await browser.newContext({viewport:{width:1440,height:1400},deviceScaleFactor:2,reducedMotion:'reduce'});
const p=await ctx.newPage();p.on('pageerror',e=>errors.push(String(e)));
await go(p,'/app/vet-day-queue');
log('current built source has clinical queue',await p.getByRole('heading',{name:"Today's visits"}).count()===1,'source dist 13.09.2026');
await go(p,'/app/visit-quick-trace?patient=marsik');
await p.getByLabel('Weight, kg').fill('4.9');await p.waitForTimeout(200);
log('unsaved state', (await p.locator('#root').innerText()).includes('Unsaved changes'),'4.9 form; 4.8 stored');
await p.reload({waitUntil:'networkidle'});
log('unsaved draft lost on reload',await p.getByLabel('Weight, kg').inputValue()==='4.8','No draft recovery; explicit Save required');
await p.getByLabel('Weight, kg').fill('4.9');await p.locator('[data-track="visit-quick-trace-save"]').click();await p.waitForTimeout(1100);
log('saved 09:12', (await p.locator('#root').innerText()).includes('Saved at 09:12'),'demo clock');
await p.reload({waitUntil:'networkidle'});log('saved survives reload',await p.getByLabel('Weight, kg').inputValue()==='4.9','4.9');
const saved=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);await writeFile(task+'/fixture-saved.json',JSON.stringify(saved,null,2));
await go(p,'/app/visit-record?patient=marsik');
const planBefore=await p.getByLabel('Plan').inputValue();
await p.getByLabel('Plan').fill('Stop ear drops. Recheck in 7 days.');await p.locator('[data-track="visit-record-publish"]').click();await p.waitForTimeout(1400);
await p.locator('[data-track="discharge-publish"]').click();await p.waitForTimeout(1100);
const published=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
log('published snapshot',published.visits.marsik.published?.revision===1&&published.visits.marsik.published?.publishedAt==='09:13','v1 09:13');
await writeFile(task+'/fixture-published.json',JSON.stringify(published,null,2));
await go(p,'/app/owner-home?patient=marsik');let owner=await p.locator('#root').innerText();
log('owner same dose and plan',owner.includes('1.00 ml')&&owner.includes('Recheck in 7 days.'),'1.00 / 7 days');
await go(p,'/app/visit-record?patient=marsik');await p.getByLabel('Plan').fill('Stop ear drops. Recheck in 10 days.');await p.getByRole('button',{name:'Save and return to the queue',exact:true}).click();await p.waitForTimeout(1400);
const behind=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);await writeFile(task+'/fixture-behind.json',JSON.stringify(behind,null,2));
await go(p,'/app/owner-home?patient=marsik');owner=await p.locator('#root').innerText();
log('saved edit does not change owner snapshot',owner.includes('Recheck in 7 days.')&&!owner.includes('Recheck in 10 days.'),'record10 / owner7');
await ctx.close();
for(const locale of ['en','ru']){
 const localSaved=locale==='ru'?JSON.parse(await readFile(task+'/fixture-saved-ru.json','utf8')):saved;
 const localPublished=locale==='ru'?JSON.parse(await readFile(task+'/fixture-published-ru.json','utf8')):published;
 const localBehind=locale==='ru'?JSON.parse(await readFile(task+'/fixture-behind-ru.json','utf8')):behind;
 for(const width of [1440,390]){
  const variant=width===1440?'wide':'narrow';
  const c=await browser.newContext({viewport:{width,height:width===1440?900:844},deviceScaleFactor:2,reducedMotion:'reduce'});
  const page=await c.newPage();page.on('pageerror',e=>errors.push(String(e)));
  await go(page,'/app/visit-quick-trace?patient=marsik',locale);
  if(width===390)await collate(page,'cover-'+locale+'-narrow',[page.locator('[class*="_visitHeader_"]').first(),page.locator('[class*="_quickTraceStep_"]').first(),page.locator('[class*="_traceDose_"]'),page.locator('[class*="_quickTraceActions_"]')],'seed Marsik4.8/0.95; selected weight/dose/actions');
  if(width===1440){await page.setViewportSize({width:768,height:900});await page.waitForTimeout(200);}
  await page.getByLabel(locale==='ru'?'Вес, кг':'Weight, kg').fill('4.9');
  await collate(page,'draft-'+locale+'-'+variant,[page.locator('[class*="_visitHeader_"]').first(),page.locator('[class*="_quickTraceStep_"]').first(),page.locator('[class*="_quickTraceActions_"]')],'form4.9; stored4.8');
  await page.evaluate(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key,saved:localSaved});await go(page,'/app/visit-quick-trace?patient=marsik',locale);
  await collate(page,'saved-'+locale+'-'+variant,[page.locator('[class*="_visitHeader_"]').first(),page.locator('[class*="_quickTraceStep_"]').first(),page.locator('[class*="_quickTraceActions_"]')],'saved4.9 at09:12');
  if(width===1440){await page.setViewportSize({width:1024,height:900});await page.waitForTimeout(200);}
  await go(page,'/app/visit-record?patient=marsik',locale);
  await collate(page,'trace-'+locale+'-'+variant,[page.locator('[class*="_visitHeader_"]').first(),page.locator('[class*="_traceFacts_"]')],'saved4.9; real facts with origin');
  if(width===1440){await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(200);}
  await go(page,'/app/invoice-draft?patient=marsik',locale);
  await snap(page,'invoice-'+locale+'-'+variant,page.locator('[class*="_invoiceDoc_"]'),'Marsik services; unpaid; no diagnosis');
  await page.evaluate(({key,behind})=>localStorage.setItem(key,JSON.stringify(behind)),{key,behind:localBehind});await go(page,'/app/discharge-preview?patient=marsik',locale);
  if(width===1440)await collate(page,'publication-'+locale+'-'+variant,[page.locator('[class*="_publishPanel_"] > [class*="_publishState_"]'),page.locator('[class*="_publishPanel_"] > [role="status"]'),page.locator('[class*="_publishPanel_"] > [data-layout="stacked"]')],'record10 days / published7 days at09:13; real publication state, warning and whole action bar');
  else await snap(page,'publication-'+locale+'-'+variant,page.locator('[class*="_publishPanel_"]'),'record10 days / published7 days at09:13');
  if(width===390){
   await page.evaluate(({key,published})=>localStorage.setItem(key,JSON.stringify(published)),{key,published:localPublished});await go(page,'/app/owner-home?patient=marsik',locale);
   await snap(page,'owner-'+locale,page.locator('[class*="_device_"]'),'published v1 09:13,4.9/1.00,7days');
   await collate(page,'owner-detail-'+locale,[page.locator('[class*="_ownerPet_"]'),page.locator('[class*="_ownerStatus_"]'),page.locator('[aria-labelledby="owner-prescription"]'),page.locator('[data-track="owner-discharge-open"]')],'selected phone details; publication, same dose, complete discharge action');
   await page.evaluate(()=>localStorage.clear());await go(page,'/app/vet-day-queue',locale);await collate(page,'queue-'+locale+'-narrow',[page.locator('[class*="_dayBlock_"]').first(),page.locator('[class*="_queueSection_"]').first()],'seed; day header + whole At clinic group; Expected omitted');
  }
  await c.close();
 }
 for(const file of ['visit-quick-trace.webp','cover/vet-day-queue.webp']){
  const from='public/media/case-vet'+(locale==='ru'?'-ru':'')+'/'+file,name=file.includes('cover/')?'queue-'+locale+'.webp':'cover-'+locale+'-wide.webp';await copyFile(from,out+'/'+name);
  captures.push({id:name.replace('.webp',''),file:out+'/'+name,source:from,locale,fixture:'seed4.8/0.95',reused:true,sourceDate:'2026-09-13',sha256:createHash('sha256').update(await readFile(out+'/'+name)).digest('hex')});
 }
}
await browser.close();await writeFile(task+'/captures.json',JSON.stringify(captures,null,2));await writeFile(task+'/source-chain.json',JSON.stringify({checks,errors,failures:checks.filter(c=>!c.ok)},null,2));
const sourceRoot='D:/Claude-projects/Veterinary-clinic', files=['src/screens/ProductScreens.tsx','src/data/clinicData.tsx','src/i18n/RussianLocalization.tsx','src/screens/PolishScreens.module.css','ds/foundation.md','ds/components.md','ia/flows/visit-trace.mmd','ia/flows/discharge-and-invoice.mmd','audit/product-polish/07-acceptance.md','audit/product-polish/08-case-release.md'];
const hashes=[];for(const f of files)hashes.push({file:f,sha256:createHash('sha256').update(await readFile(sourceRoot+'/'+f)).digest('hex')});
const builds=[];for(const f of await readdir(sourceRoot+'/dist/assets'))if(/\.(js|css)$/.test(f))builds.push({file:'dist/assets/'+f,sha256:createHash('sha256').update(await readFile(sourceRoot+'/dist/assets/'+f)).digest('hex')});
await writeFile(task+'/source-verification.json',JSON.stringify({sourceRoot,sourceHead:'78772df6735d90d3ba79704fe51bb225cd927ebf',accepted:'c2a65cc',sourceFiles:hashes,observedExistingBuild:builds,buildDate:'2026-09-13; no build written in source',checks},null,2));
