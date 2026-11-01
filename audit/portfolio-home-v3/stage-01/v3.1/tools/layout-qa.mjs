import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(`${process.env.PLAYWRIGHT_REPO??'D:/Claude-projects/b2b-dssl'}/package.json`)('playwright');
const browser=await chromium.launch({headless:true});
const root='audit/portfolio-home-v3/stage-01/v3.1';
const results=[];
const origin=process.env.PORTFOLIO_ORIGIN??'http://127.0.0.1:4422';
try {
 for(const locale of ['en','ru']) for(const width of [360,390,767,768,1023,1024,1439,1440]) {
  const height=width===360?800:width===390?844:900;
  const p=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await p.goto(origin+(locale==='ru'?'/ru/':'/'),{waitUntil:'networkidle'});
  await p.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.agent-home img').decode();});
  const geometry=await p.evaluate(()=>{
   const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
   const links=[...document.querySelectorAll('.hero__actions > a')];
   return {actions:[...links,document.querySelector('.hero__actions button')].map(e=>({text:e.innerText,box:box(e),color:getComputedStyle(e).color})),arrows:links.map(e=>({label:box(e.querySelector('.ds-link__label')),arrow:box(e.querySelector('svg'))})),image:box(document.querySelector('.agent-home img')),source:document.querySelector('.agent-home img').currentSrc,overflow:document.documentElement.scrollWidth>innerWidth,sceneColumns:getComputedStyle(document.querySelector('.agent-home')).gridTemplateColumns,h1:getComputedStyle(document.querySelector('h1')).fontSize};
  });
  assert(!geometry.overflow,`${locale}/${width}: overflow`);
  assert(geometry.actions.every(a=>a.box.h>=48),`${locale}/${width}: tap targets`);
  for(const {label,arrow} of geometry.arrows) assert(Math.abs(label.y+label.h/2-arrow.y-arrow.h/2)<0.1,`${locale}/${width}: arrow alignment`);
  if(width<1440) {
   assert(Math.abs(geometry.actions[1].box.y-geometry.actions[2].box.y)<0.1,`${locale}/${width}: CV/copy row`);
   assert(geometry.actions[0].box.y+geometry.actions[0].box.h<=geometry.actions[1].box.y,`${locale}/${width}: work row`);
  }
  assert.notEqual(geometry.actions[0].color,geometry.actions[1].color);
  assert(geometry.source.endsWith(width<768?'approval-consequences-mobile.webp':'approval-consequences-desktop.webp'));
  if(width===360||width===390) {
   // In the unchanged native capture, the amount occupies the upper ~20%.
   // This verifies it has entered the viewport; screenshots remain the visual evidence.
   assert(geometry.image.y+geometry.image.h*0.21<height,`${locale}/${width}: native $120 below fold`);
   assert.equal(geometry.h1,'36px');
  }
  // Tab from Work must reach CV and then Copy; each retains a visible outline.
  await p.locator('.hero__work-link').focus();
  const focus=[];
  for(const selector of ['.hero__work-link','.hero__cv-link','.hero__actions button']) {
   assert(await p.locator(selector).evaluate(e=>document.activeElement===e));
   focus.push(await p.locator(selector).evaluate(e=>({outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth})));
   assert.equal(focus.at(-1).outline,'solid');
   await p.keyboard.press('Tab');
  }
  if(width===390) {
   await p.evaluate(()=>document.activeElement.blur());
   await p.locator('.agent-home__scene').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-16));
   await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await p.screenshot({path:`${root}/screenshots/states/${locale}-390-native-context.png`});
  }
  results.push({locale,width,height,geometry,focus,pass:true});
  await p.close();
 }
} finally {await browser.close();await writeFile(`${root}/logs/layout-qa.json`,JSON.stringify(results,null,2));}
console.log(`${results.length} responsive action, keyboard, source and native-proof checks passed`);
