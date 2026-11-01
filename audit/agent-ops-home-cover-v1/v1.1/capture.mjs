import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const root='audit/agent-ops-home-cover-v1/v1.1';
const baseline=JSON.parse(await readFile('audit/agent-ops-home-cover-v1/v1/logs/after.json','utf8'));
const expected={en:'A $120 credit needs human approval.',ru:'Зачёт $120 требует согласования.'};
const browser=await chromium.launch();const results=[];
try{
 for(const locale of ['en','ru'])for(const [width,height] of [[1440,900],[390,844],[360,800]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[],failures=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
  await page.goto(`http://127.0.0.1:4404/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{
   await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));
   for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.75){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}
   scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  });
  const card=page.locator('#work-agent-ops-console');
  await card.screenshot({path:`${root}/after/${locale}-${width}-cover.png`});
  await page.locator('.agent-home').screenshot({path:`${root}/after/${locale}-${width}-stage.png`});
  const m=await page.evaluate(()=>{
   const c=document.querySelector('#work-agent-ops-console'),s=c.querySelector('.agent-home'),t=s.querySelector('.ds-heading-3xl'),i=s.querySelector('img');
   const b=t.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(t);
   const rects=[...range.getClientRects()].filter(r=>r.width>0),style=getComputedStyle(t);
   return {title:t.textContent,lineCount:new Set(rects.map(r=>Math.round(r.top))).size,titleBox:{width:b.width,height:b.height},
    textWithinInlineBox:rects.every(r=>r.left>=b.left-.5&&r.right<=b.right+.5),titleOverflowStyle:style.overflow,
    titleOverflow:t.scrollWidth-t.clientWidth,pageOverflow:document.documentElement.scrollWidth-innerWidth,
    font:style.fontFamily,fontSize:style.fontSize,lineHeight:style.lineHeight,
    imageSrc:i.currentSrc.replace(location.origin,''),imageWidth:i.width,imageHeight:i.height,
    radius:getComputedStyle(s.querySelector('.agent-shot__image')).borderRadius,
    brokenImages:[...document.images].filter(i=>!i.closest('dialog')&&(!i.complete||!i.naturalWidth)).map(i=>i.src),
    protected:Object.fromEntries(['.hero','#work-partner-portal','#work-learn','#work-vet-clinic','#work-pawly'].map(sel=>[sel,document.querySelector(sel).outerHTML])),
    links:[...c.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),label:a.getAttribute('aria-label')||a.textContent.trim()}))};
  });
  m.protected=Object.fromEntries(Object.entries(m.protected).map(([k,v])=>[k,createHash('sha256').update(v).digest('hex')]));
  const b=baseline.results.find(b=>b.locale===locale&&b.width===width);
  // The existing site typographer inserts nonbreaking spaces at render time.
  assert.equal(m.title.replaceAll('\u00a0',' '),expected[locale]);assert.equal(m.pageOverflow,0);assert.equal(m.titleOverflow,0);assert(m.textWithinInlineBox);assert.equal(m.titleOverflowStyle,'visible');
  assert.equal(m.radius,'16px');assert.deepEqual(m.protected,b.protected);assert.deepEqual(m.links,b.links);
  assert.equal(m.imageSrc,b.imageSrc);assert.equal(m.imageWidth,Math.round(b.image.width));assert.equal(m.imageHeight,Math.round(b.image.height));
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);assert.deepEqual(m.brokenImages,[]);
  results.push({locale,width,height,...m,errors,failures});await context.close();
 }
}finally{await browser.close();await writeFile(`${root}/logs/browser.json`,JSON.stringify({browser:browser.version(),dpr:1,reducedMotion:'reduce',results},null,2)+'\n');}
console.log(JSON.stringify(results.map(({locale,width,title,lineCount,pageOverflow,textWithinInlineBox,radius})=>({locale,width,title,lineCount,pageOverflow,textWithinInlineBox,radius})),null,2));
