import {createRequire}from'node:module';
import{readFile,writeFile}from'node:fs/promises';
import assert from'node:assert/strict';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const root='audit/trassir-learn-home-cover-v1/v1.1';
const before=JSON.parse(await readFile(`${root}/logs/before.json`)),after=JSON.parse(await readFile(`${root}/logs/after.json`));
const report={protected:[],interactions:[],noJS:[],geometry:[]};
for(const b of before.results){const a=after.results.find(a=>a.locale===b.locale&&a.width===b.width);
 assert.equal(a.overflow,0);assert.deepEqual(a.errors,[]);assert.deepEqual(a.failures,[]);assert.deepEqual(a.brokenImages,[]);assert.deepEqual(a.protected,b.protected);
 // Shortening Learn shifts later cards onto different fractional document Y
 // coordinates. Their raster edges may change despite identical local geometry.
 for(const selector of Object.keys(b.protectedPixels))if(a.width===1440||!['#work-vet-clinic','#work-pawly'].includes(selector))assert.equal(a.protectedPixels[selector],b.protectedPixels[selector]);
 assert.equal(a.images.length,2);assert(a.images[0].src.includes(a.width<1440?'answer-detail':'reference'));assert(a.images[1].src.includes(a.width<768?'programme-mobile':'path-progress'));assert(a.images.every(i=>i.src.includes(`/${a.locale}/`)&&i.loaded));
 // Onest heading ink extends past its line box in V1 too; visible overflow
 // does not truncate it. Reject any newly overflowing text or line clamp.
 assert(a.text.every(t=>t.lineClamp==='none'&&(!t.overflow||b.text.some(o=>o.text===t.text&&o.overflow&&o.fontSize===t.fontSize))));
 if(a.width===1440)assert.equal(a.cover.height,b.cover.height);
 if(a.width===1440)assert.deepEqual(await readFile(`${root}/before/${a.locale}-1440-cover.png`),await readFile(`${root}/after/${a.locale}-1440-cover.png`));
 report.protected.push({locale:a.locale,width:a.width,heroAndFourOtherCovers:'identical DOM SHA256; identical pixel hashes above Learn and on desktop',beforeHeight:b.cover.height,afterHeight:a.cover.height});
}
const browser=await chromium.launch();
try{
for(const locale of['en','ru'])for(const width of[1440,390,360]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),pages=await Promise.all([context.newPage(),context.newPage()]);
 const geometry=await Promise.all(pages.map(async(page,index)=>{
  await page.goto(`http://127.0.0.1:${index?4406:4405}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{})}))});
  return page.evaluate(()=>Object.fromEntries(['.hero','#work-agent-ops-console','#work-partner-portal','#work-vet-clinic','#work-pawly'].map(selector=>{
   const root=document.querySelector(selector),r=root.getBoundingClientRect();
   return [selector,[root,...root.querySelectorAll('*')].map(e=>{const b=e.getBoundingClientRect();return b.width||b.height?[b.width,b.height,b.x-r.x,b.y-r.y]:[0,0,0,0]})];
  })));
 }));
 let maxDelta=0;
 for(const selector of Object.keys(geometry[0])){
  assert.equal(geometry[0][selector].length,geometry[1][selector].length);
  geometry[0][selector].forEach((r,i)=>r.forEach((n,j)=>{const delta=Math.abs(n-geometry[1][selector][i][j]);maxDelta=Math.max(maxDelta,delta);assert(delta<0.05,`${locale}/${width} ${selector} local geometry drift: ${delta}`)}));
 }
 report.geometry.push({locale,width,allProtectedDescendants:'same local position and dimensions',maxDelta});await context.close();
}
for(const locale of['en','ru'])for(const width of[1440,360])for(const reducedMotion of['reduce','no-preference']){
 const context=await browser.newContext({viewport:{width,height:width===1440?900:844},deviceScaleFactor:1,reducedMotion}),page=await context.newPage();
 const route=`/${locale==='ru'?'ru/':''}`,caseRoute=`${route}work/learn`;
 await page.goto(`http://127.0.0.1:4406${route}`,{waitUntil:'networkidle'});const seen=[];
 assert.equal(await page.locator('#title-learn').evaluate(e=>getComputedStyle(e).overflow),'visible');
 for(let i=0;i<80;i++){
  await page.keyboard.press('Tab');
  const f=await page.evaluate(()=>{const a=document.activeElement,c=a.closest('#work-learn');if(!c)return null;const s=getComputedStyle(a);return {href:a.getAttribute('href'),id:a.id,focusVisible:a.matches(':focus-visible'),outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineColor:s.outlineColor,role:a.closest('h2')?'title':a.id==='cta-learn'?'cta':'screen'};});
  if(f){seen.push(f);assert(f.focusVisible);assert.equal(f.outlineStyle,'solid');assert(parseFloat(f.outlineWidth)>0);if(f.role==='cta')break;}
 }
 assert.deepEqual(seen.map(f=>f.role),['title','screen','screen','cta']);assert(seen.every(f=>f.href.replace(/\/$/,'')===caseRoute));
 await page.locator('#work-learn').screenshot({path:`${root}/after/${locale}-${width}-focus-${reducedMotion}.png`});
 await page.keyboard.press('Enter');await page.waitForURL(url=>url.pathname.replace(/\/$/,'')===caseRoute);assert(await page.locator('h1').count());
 await page.goBack({waitUntil:'networkidle'});await page.locator('#work-learn').hover();await page.waitForTimeout(450);
 const motion=await page.locator('#work-learn .featured-case__stage').evaluate(e=>({transform:getComputedStyle(e).transform,hidden:getComputedStyle(e).opacity==='0'}));assert(!motion.hidden);if(reducedMotion==='reduce')assert.equal(motion.transform,'none');
 report.interactions.push({locale,width,reducedMotion,tabStops:seen,enter:'case route opens',back:'home restored',motion});await context.close();
}
for(const locale of['en','ru'])for(const width of[1440,360]){
 const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false,reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto(`http://127.0.0.1:4406/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
 const m=await page.locator('.learn-home').evaluate(e=>({height:e.getBoundingClientRect().height,opacity:getComputedStyle(e).opacity,images:[...e.querySelectorAll('img')].map(i=>i.naturalWidth),href:e.querySelector('a').getAttribute('href'),overflow:document.documentElement.scrollWidth-innerWidth}));assert.equal(m.overflow,0);assert.equal(m.opacity,'1');assert(m.height>0&&m.images.every(w=>w>0));
 await page.locator('#work-learn').screenshot({path:`${root}/after/${locale}-${width}-nojs.png`});await page.locator('#cta-learn').click();assert(page.url().includes('/work/learn'));report.noJS.push({locale,width,...m,cta:'case opened'});await context.close();
}
}finally{await browser.close();await writeFile(`${root}/logs/verification.json`,JSON.stringify(report,null,2)+'\n')}
 console.log('PASS: 6 EN/RU states; identical desktop Learn pixels; identical hero/4 covers DOM and local geometry; 8 keyboard/motion flows; 4 no-JS CTA flows.');
