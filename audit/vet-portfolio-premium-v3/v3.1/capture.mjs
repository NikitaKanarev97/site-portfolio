import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');
const {chromium}=require('playwright');
const phase=process.argv[2];
if(!['before','after'].includes(phase)) throw Error('Use before or after');
const root=`audit/vet-portfolio-premium-v3/v3.1/${phase}`;
fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch();
const results=[];
const routes=['/','/work/agent-ops-console','/work/partner-portal','/work/learn','/work/vet-clinic','/work/pawly'];
const digest=b=>createHash('sha256').update(b).digest('hex');
async function capture(page,link,name) {
  await link.scrollIntoViewIfNeeded();
  await page.waitForTimeout(70);
  const box=await link.boundingBox();
  const vp=page.viewportSize();
  const x=Math.max(0,Math.floor(box.x-12)),y=Math.max(0,Math.floor(box.y-16));
  await page.screenshot({path:`${root}/${name}.png`,clip:{x,y,width:Math.min(vp.width-x,Math.ceil(box.width+24)),height:Math.min(vp.height-y,Math.ceil(box.height+32))}});
}
async function linksMetrics(page) {
 return page.locator('a.ds-link').evaluateAll(as=>as.filter(a=>a.getClientRects().length).map(a=>{
  const label=a.querySelector('.ds-link__label'),icon=a.querySelector('svg'),s=getComputedStyle(a);
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height};};
  const walker=document.createTreeWalker(label,NodeFilter.SHOW_TEXT);const lines=[];
  for(let n;(n=walker.nextNode());) if(n.textContent.trim()) {const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects()) if(b.width) lines.push({x:b.x,y:b.y+scrollY,w:b.width,h:b.height});}
  return {text:label.textContent.trim(),class:a.className,href:a.getAttribute('href'),target:a.target,rel:a.rel,link:rect(a),label:rect(label),icon:icon?rect(icon):null,lines,font:s.font,lineHeight:s.lineHeight,align:s.alignItems};
 }));
}
for(const locale of ['en','ru']) for(const width of [1440,390,320]) for(const route of routes) {
 const key=`${locale}-${width}-${route==='/'?'home':route.split('/').at(-1)}`;
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',locale:locale==='ru'?'ru-RU':'en-GB',timezoneId:'Europe/Moscow'});
 const entry={key,route,locale,width,errors:[],failedAssets:[],captures:[]};results.push(entry);
 page.on('pageerror',e=>entry.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)entry.failedAssets.push({url:r.url(),status:r.status()});});
 const response=await page.goto('http://127.0.0.1:5391'+(locale==='ru'?'/ru':'')+route,{waitUntil:'networkidle'});
 entry.status=response.status();
 await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.decode().catch(()=>{})));});
 // Reveal existing sections through scrolling; motion is disabled by the real preference.
 for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(5);}
 await page.evaluate(()=>scrollTo(0,0));
 entry.links=await linksMetrics(page);
 entry.page=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,text:document.body.innerText,images:[...document.images].map(i=>({src:i.getAttribute('src'),srcset:i.getAttribute('srcset'),alt:i.alt,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,width:i.width,height:i.height})),sections:[...document.querySelectorAll('main section,main h1,main h2')].map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,x:r.x,y:r.y,w:r.width,h:r.height};})}));
 // One untouched product/portrait specimen per route, matched exactly after the edit.
 const image=page.locator('main img').first();
 if(await image.count()) {await image.scrollIntoViewIfNeeded();entry.specimenHash=digest(await image.screenshot({path:`${root}/${key}-unchanged-image.png`}));}
 const all=page.locator('a.ds-link');
 const selected=[];const patterns=new Set();
 for(let i=0;i<await all.count();i++) {
  const a=all.nth(i);if(!await a.isVisible())continue;
  const info=await a.evaluate(a=>({text:a.querySelector('.ds-link__label').textContent.trim(),pattern:[a.classList.contains('ds-link--inline')?'inline':a.classList.contains('ds-link--nav')?'nav':'arrow',a.querySelector('.ds-link__external')?'external':a.querySelector('.ds-link__arrow')?'directional':'plain',a.classList.contains('is-inverse')?'inverse':'default'].join('-'),vet:a.closest('#process,#outcome')&&a.closest('.vet-case')}));
  if(info.vet||!patterns.has(info.pattern)) {selected.push({i,...info});patterns.add(info.pattern);}
 }
 for(const {i,pattern} of selected) {
  const a=all.nth(i),id=`${key}-link${i}-${pattern}`;
  await page.mouse.move(0,0);await a.evaluate(e=>e.blur());await capture(page,a,`${id}-normal`);
  await a.hover();await page.waitForTimeout(300);await capture(page,a,`${id}-hover`);
  await page.mouse.move(0,0);
  await a.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  entry.captures.push({id,text:await a.locator('.ds-link__label').textContent(),keyboardFocus:await a.evaluate(a=>a===document.activeElement&&a.matches(':focus-visible'))});
  await capture(page,a,`${id}-focus`);
 }
 // Inline TextLink is used in Home's native project dialog. Open through its trigger.
 if(route==='/') {
  const trigger=page.locator('[data-dialog-open]').first();
  if(await trigger.count()) {
   await trigger.click();
   const a=page.locator('dialog[open] a.ds-link--inline').last();
   if(await a.count()) for(const state of ['normal','hover','focus']) {
    if(state==='normal'){await page.mouse.move(0,0);await a.evaluate(a=>a.blur());}
    if(state==='hover'){await a.hover();await page.waitForTimeout(300);}
    if(state==='focus'){await page.mouse.move(0,0);await a.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');}
    await capture(page,a,`${key}-dialog-inline-${state}`);
   }
   entry.dialogLinks=await linksMetrics(page);
   await page.keyboard.press('Escape');
  }
 }
 await page.close();
 fs.writeFileSync(`${root}/metrics.json`,JSON.stringify(results,null,2));
 console.log(`${phase}: ${key}, ${entry.links.length} links, ${entry.captures.length} patterns, HTTP ${entry.status}`);
}
await browser.close();
