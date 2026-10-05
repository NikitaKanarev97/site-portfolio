/** Native Russian media for every active Learn case fragment. */
import {createRequire}from'node:module';import{mkdir,readFile,writeFile,copyFile}from'node:fs/promises';
import{createHash}from'node:crypto';import assert from'node:assert/strict';import sharp from'sharp';
import {isolateAssessment, isolateLanding} from './lib/learn-frame-fields.mjs';
const{chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const origin=process.argv[2]??'http://127.0.0.1:4475',catalog=process.argv[3]??'http://127.0.0.1:4362';
const dir='public/media/rebuild/learn-ru';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const report=[];
const one=JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-one.json','utf8'));
const ready=JSON.parse(await readFile('../learn/audit/product-polish/evidence/07/state-marina-ready.json','utf8'));
async function page(width,fixture){const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:2,reducedMotion:'reduce',locale:'ru-RU'});
if(fixture){fixture.toasts=[];await page.addInitScript(s=>{sessionStorage.setItem('learn-prototype-v1',JSON.stringify(s));sessionStorage.setItem('learn-account-v2:'+encodeURIComponent(s.session.identifier),JSON.stringify(s));},fixture);}return page;}
async function go(p,route){await p.goto(origin+route+(route.includes('?')?'&':'?')+'lang=ru',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);assert.equal(await p.locator('html').getAttribute('lang'),'ru');}
async function save(p,id,locator,clip){const text=await(locator??p.locator('body')).innerText();assert(/[А-Яа-я]/.test(text),id);
assert(!/TRASSIR cannot discover|Complete and continue|Attempts remaining|Know how\.|Current unit/.test(text),`${id}: English interface`);
const bytes=locator?await locator.screenshot({animations:'disabled'}):await p.screenshot({animations:'disabled',...(clip?{clip}:{})});
const file=dir+'/'+id+'.webp';const info=await sharp(bytes).webp({quality:94}).toFile(file);
report.push({id,file,url:p.url(),lang:'ru',viewport:p.viewportSize(),width:info.width,height:info.height,text,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});}
try{
for(const width of[1440,390]){
 const v=width===1440?'desktop':'mobile',p=await page(width);
 await go(p,'/prototypes/learn/material/onvif-not-found');await save(p,'answer-'+v);
 const player=await page(width,one);await go(player,'/prototypes/learn/player/puskonaladka/2');
 if(width<768){await player.locator('h1').scrollIntoViewIfNeeded();await player.evaluate(()=>scrollBy(0,-130));}
 await save(player,'programme-'+v);
 // Capture the complete ending in normal flow: the action owns this document
 // boundary, so include the final content section and both complete controls.
 await player.evaluate(()=>{
 const section=document.querySelector('[data-material-body]').lastElementChild;
 const button=[...document.querySelectorAll('button')].find(n=>n.textContent.includes('Завершить и далее'));
 const actions=button.parentElement;const frame=document.createElement('div');frame.dataset.endingCapture='';
 frame.style.cssText=`position:absolute;left:0;top:0;width:${innerWidth<768?innerWidth-32:960}px;padding:16px;box-sizing:border-box;background:var(--surface-default);z-index:2147483647;display:grid;gap:32px;`;
 frame.append(section,actions);document.body.append(frame);
 });
 await save(player,'completion-'+v,player.locator('[data-ending-capture]'));
 await p.close();await player.close();
 const assessment=await page(width===1440?1024:width,ready);
 await go(assessment,'/prototypes/learn/assessment/intro?trajectoryId=proekt');
 const rules=assessment.locator('div[class*="_card_"]').filter({has:assessment.getByText('Попыток осталось',{exact:true})}).first();
 await save(assessment,'assessment-'+v,await isolateAssessment(assessment,rules));await assessment.close();
 const landing=await page(width);await go(landing,'/prototypes/learn-landing/');
 await save(landing,'landing-'+v,await isolateLanding(landing));await landing.close();
}
const compact=await page(320,one);await go(compact,'/prototypes/learn/material/onvif-not-found');
const trust=compact.locator('div[class*="_root_"]').filter({has:compact.locator('span[class*="_version_"]')}).last();
await save(compact,'trust-mobile',trust);await copyFile(dir+'/trust-mobile.webp',dir+'/trust-desktop.webp');
await go(compact,'/prototypes/learn/player/puskonaladka/2');
await save(compact,'progress-mobile',compact.locator('div[class*="_meter_"]').first());await copyFile(dir+'/progress-mobile.webp',dir+'/progress-desktop.webp');await compact.close();
const cards=[['setup','Setup','Пусконаладка TRASSIR OS на объекте до 32 камер','Развернуть и сдать объект самостоятельно','11 единиц'],['project','Project','Проектирование системы на 64+ камеры','Рассчитать нагрузку и защитить проект','9 единиц'],['handover','Handover','Сдача объекта заказчику','Проверить готовность объекта и пакет документов','7 единиц'],['explore','Explore','Основы линейки TRASSIR','Подобрать оборудование под задачу','7 единиц']];
for(const[id,mode,title,result,meta]of cards)for(const width of[312,288]){
 const p=await page(800);const url=new URL('/storybook/iframe.html',catalog);url.searchParams.set('id','components-card--default');url.searchParams.set('viewMode','story');url.searchParams.set('globals','contentMode:'+mode);
 await p.goto(url.href,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 // Storybook's URL-args sanitizer rejects Cyrillic. Its native args channel
 // renders the React component with these documented RU fixture properties.
 await p.evaluate(args=>window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs',{storyId:'components-card--default',updatedArgs:args}),{title,result,meta});
 await p.getByText(title,{exact:true}).waitFor();
 const card=p.locator('#storybook-root div[class*="_root_"]').first();await card.evaluate((n,w)=>n.parentElement.style.width=w+'px',width);
 assert((await card.innerText()).includes(title),'Native Card fixture');await save(p,`theme-${id}-${width===312?'desktop':'mobile'}`,card);await p.close();
}
// The active cover uses LearnStage. Keep a localized fallback for the story's
// documentary shot and preview consumers without altering the source pixels.
for(const v of['desktop','mobile'])await sharp(`public/media/art-direction/learn-ru/material-${v}.png`).webp({quality:94}).toFile(dir+`/cover-${v}.webp`);
}finally{await browser.close();await writeFile('tasks/portfolio-rebuild/integration/learn-story-ru-captures.json',JSON.stringify(report,null,2));}
console.log(`Captured ${report.length} Russian Learn case fragments`);
