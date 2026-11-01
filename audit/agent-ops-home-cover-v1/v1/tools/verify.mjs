import {createRequire}from'node:module';
import{readFile,writeFile}from'node:fs/promises';
import assert from'node:assert/strict';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const root='audit/agent-ops-home-cover-v1/v1';
const before=JSON.parse(await readFile(`${root}/logs/before.json`)),after=JSON.parse(await readFile(`${root}/logs/after.json`));
const report={protected:[],interactions:[],noJS:[]};
for(const b of before.results){const a=after.results.find(a=>a.locale===b.locale&&a.width===b.width);
 assert.equal(a.overflow,0);assert.deepEqual(a.errors,[]);assert.deepEqual(a.failures,[]);assert.deepEqual(a.brokenImages,[]);assert.deepEqual(a.protected,b.protected);
 assert(a.imageSrc.includes(a.width<768?'approval-consequences-mobile':'approval-consequences-desktop'));
 assert(a.story.y<a.image.y||a.width>=1440);report.protected.push({locale:a.locale,width:a.width,heroAndFourOtherCovers:'identical DOM SHA256',beforeHeight:b.cover.height,afterHeight:a.cover.height});
}
const browser=await chromium.launch();
try{
for(const locale of['en','ru'])for(const width of[1440,360])for(const reducedMotion of['reduce','no-preference']){
 const context=await browser.newContext({viewport:{width,height:width===1440?900:800},deviceScaleFactor:1,reducedMotion});const page=await context.newPage();
 const route=`/${locale==='ru'?'ru/':''}`;await page.goto(`http://127.0.0.1:4404${route}`,{waitUntil:'networkidle'});
 const seen=[];
 for(let i=0;i<70;i++){
  await page.keyboard.press('Tab');
  const f=await page.evaluate(()=>{const a=document.activeElement,c=a.closest('#work-agent-ops-console');if(!c)return null;const s=getComputedStyle(a);return {tag:a.tagName,href:a.getAttribute('href'),id:a.id,focusVisible:a.matches(':focus-visible'),outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineColor:s.outlineColor,role:a.querySelector('picture')?'scene':a.closest('h2')?'title':'cta'};});
  if(f){seen.push(f);assert(f.focusVisible);if(f.role==='cta')break;}
 }
 assert.deepEqual(seen.map(f=>f.role),['title','scene','cta']);assert(seen.every(f=>f.href===`${route}work/agent-ops-console`));
 await page.locator('#work-agent-ops-console').screenshot({path:`${root}/after/${locale}-${width}-focus-${reducedMotion}.png`});
 await page.keyboard.press('Enter');await page.waitForURL(`**${route}work/agent-ops-console`);assert(await page.locator('h1').count());
 await page.goBack({waitUntil:'networkidle'});await page.locator('#work-agent-ops-console').hover();await page.waitForTimeout(400);
 const motion=await page.locator('#work-agent-ops-console .featured-case__stage').evaluate(e=>({transform:getComputedStyle(e).transform,hidden:getComputedStyle(e).opacity==='0'}));
 assert(!motion.hidden);if(reducedMotion==='reduce')assert.equal(motion.transform,'none');
 report.interactions.push({locale,width,reducedMotion,tabStops:seen,enter:'case route opens',back:'home restored',motion});await context.close();
}
for(const locale of['en','ru'])for(const width of[1440,360]){
 const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false,reducedMotion:'reduce'}),page=await context.newPage();
 await page.goto(`http://127.0.0.1:4404/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
 const m=await page.locator('.agent-home').evaluate(e=>({height:e.getBoundingClientRect().height,opacity:getComputedStyle(e).opacity,image:e.querySelector('img').naturalWidth,href:e.querySelector('a').getAttribute('href'),overflow:document.documentElement.scrollWidth-innerWidth}));
 assert.equal(m.overflow,0);assert.equal(m.opacity,'1');assert(m.height>0&&m.image>0);report.noJS.push({locale,width,...m});await context.close();
}
}finally{await browser.close();await writeFile(`${root}/logs/verification.json`,JSON.stringify(report,null,2)+'\n');}
console.log('PASS: 10 EN/RU responsive states; unchanged hero/4 covers; 8 keyboard/motion flows; 4 no-JS states.');
