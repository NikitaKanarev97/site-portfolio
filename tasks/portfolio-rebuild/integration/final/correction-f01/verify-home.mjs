/** G-final-F01: only changed Home promises and their responsive/native presentation. */
import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
const base='http://127.0.0.1:4392',out='tasks/portfolio-rebuild/integration/final/correction-f01';
mkdirSync(out+'/shots',{recursive:true});
const slugs=['agent-ops-console','partner-portal','learn','vet-clinic','pawly'];
const promise={en:'Match a product to the source row, then place the order.',ru:'Сначала подобрать товар по исходной строке, затем оформить заказ.'};
const browser=await createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
const results=[],failures=[],links=[];
try{
 for(const lang of ['en','ru'])for(const width of [1440,1024,390,360])for(const mode of ['full','reduce','no-js']){
  const context=await browser.newContext({viewport:{width,height:width<768?844:900},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='full'?'no-preference':'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(base+(lang==='ru'?'/ru/':'/'),{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  const portal=page.locator('.featured-case').nth(1);await portal.scrollIntoViewIfNeeded();
  for(const img of await portal.locator('img').all())if(await img.isVisible())await img.evaluate(e=>e.decode());
  await page.waitForTimeout(mode==='full'?450:80);
  const data=await page.evaluate(()=>{const card=document.querySelectorAll('.featured-case')[1],p=card.querySelector('.featured-case__outcome'),rect=p.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(p);return {overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelector('h1')?.textContent,promise:p.textContent.trim(),promiseBox:rect.toJSON(),lines:[...range.getClientRects()].filter(r=>r.width>0).map(r=>r.toJSON()),cards:[...document.querySelectorAll('.featured-case')].map(e=>({href:new URL(e.href).pathname,visible:getComputedStyle(e).display!=='none'})),truncation:{overflow:getComputedStyle(p).overflow,textOverflow:getComputedStyle(p).textOverflow,lineClamp:getComputedStyle(p).webkitLineClamp}};});
  const expected=slugs.map(s=>(lang==='ru'?'/ru':'')+'/work/'+s);
  if(data.promise!==promise[lang]||data.overflow>1||data.cards.length!==5||data.cards.some((c,i)=>c.href.replace(/\/$/,'')!==expected[i]||!c.visible)||errors.length||!data.lines.length||data.lines.some(r=>r.left<data.promiseBox.left-1||r.right>data.promiseBox.right+1||r.bottom>data.promiseBox.bottom+1))failures.push({lang,width,mode,data,errors});
  if(mode==='reduce'&&[1440,390].includes(width))await portal.screenshot({path:`${out}/shots/${lang}-portal-home-${width}.png`});
  results.push({lang,width,mode,...data,errors});await context.close();
 }
 for(const lang of ['en','ru'])for(const slug of slugs){const path=(lang==='ru'?'/ru':'')+'/work/'+slug+'/';const response=await fetch(base+path);links.push({path,status:response.status});if(response.status!==200)failures.push({path,reason:'case link status'});}
}finally{await browser.close();writeFileSync(out+'/home-verification.json',JSON.stringify({base,scope:'Changed Home only; cases and motion reuse byte-identical prior proof',results,links,failures},null,2));}
console.log(JSON.stringify({homeProfiles:results.length,caseLinks:links.length,failures:failures.length}));if(failures.length)process.exitCode=1;
