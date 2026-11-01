import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const require=createRequire('D:/Claude-projects/b2b-dssl/package.json');
const {chromium}=require('playwright');
const root='audit/home-cover-polish';
const before=JSON.parse(await readFile(`${root}/logs/before.json`,'utf8'));
const after=JSON.parse(await readFile(`${root}/logs/after.json`,'utf8'));
for(const a of after.results){
  const b=before.results.find(b=>b.locale===a.locale&&b.width===a.width);
  assert.equal(a.overflow,0);assert.deepEqual(a.errors,[]);assert.deepEqual(a.failures,[]);
  assert.deepEqual(a.protected,b.protected,'Pawly/Vet card changed');
  assert.ok(a.protected.pawly&&a.protected['vet-clinic']);
  assert.ok(a.images.every(i=>i.complete));
  assert.equal(a.portraitWidth,a.width>=1024?112:a.width>=768?80:64);
}
const manifest=JSON.parse(await readFile(`${root}/sources/manifest.json`,'utf8'));
for(const e of manifest.entries.filter(e=>e.product==='b2b-dssl')){
  assert.ok(e.borders.every(sides=>sides.every(s=>s==='1px')));
  assert.ok(e.text.includes('KX-7608NXI-K2')&&e.text.includes('KX-7608NI-K2'));
  assert.ok(e.text.includes(e.locale==='en'?'Apply to line 19':'Применить к строке 19'));
  const {data,info}=await sharp(`public${e.src}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const cornerAlpha=[[0,0],[info.width-1,0],[0,info.height-1],[info.width-1,info.height-1]].map(([x,y])=>data[(y*info.width+x)*4+3]);
  assert.deepEqual(cornerAlpha,[0,0,0,0],`${e.key}: opaque corner background`);
  const sideAlpha=[[Math.floor(info.width/2),0],[0,Math.floor(info.height/2)],[info.width-1,Math.floor(info.height/2)],[Math.floor(info.width/2),info.height-1]].map(([x,y])=>data[(y*info.width+x)*4+3]);
  assert.ok(sideAlpha.every(a=>a===255),`${e.key}: incomplete outer border`);
}
const browser=await chromium.launch();
const checks=[];
try{
  for(const locale of ['en','ru']) for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'no-preference'});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const prefix=locale==='ru'?'/ru':'';
    await page.goto(`http://127.0.0.1:4417${prefix}/`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1200);
    for(const slug of ['agent-ops-console','partner-portal']){
      const card=page.locator(`#work-${slug}`);
      const image=card.locator('img');await image.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      assert.ok(await image.evaluate(e=>e.complete&&e.naturalWidth>0));
      const target=card.locator(slug==='agent-ops-console'?'.agent-shot__image':'.featured-case__cta');
      await target.focus();
      assert.ok(await target.evaluate(e=>e.matches(':focus-visible')));
      await page.screenshot({path:`${root}/screenshots/after/${locale}-${width}-${slug}-focus.png`});
      const expected=`${prefix}/work/${slug}`;
      assert.equal(await target.getAttribute('href'),expected);
      await target.press('Enter');
      await page.waitForURL(`**${expected}`);
      await page.locator('h1').waitFor();
      await page.goBack({waitUntil:'networkidle'});
      await page.locator(`#work-${slug} img`).waitFor();
    }
    assert.deepEqual(errors,[]);
    checks.push({locale,width,fullMotion:true,keyboardFocus:true,caseNavigationAndBack:true,errors});
    await context.close();
  }
  for(const locale of ['en','ru']){
    const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
    const page=await context.newPage();await page.goto(`http://127.0.0.1:4417/${locale==='ru'?'ru/':''}`);
    for(const slug of ['agent-ops-console','partner-portal']){
      const image=page.locator(`#work-${slug} img`);await image.scrollIntoViewIfNeeded();
      await image.evaluate(i=>i.decode());assert.ok(await image.isVisible());
    }
    checks.push({locale,width:390,noJavaScript:true,nativeMediaVisible:true});
    await context.close();
  }
} finally {await browser.close();}
await writeFile(`${root}/logs/verification.json`,JSON.stringify({matchedPairs:after.results.length,protectedCardsUnchanged:true,uniformPortalBorders:true,transparentPortalCorners:true,intactPortalBorderMidpoints:true,checks},null,2)+'\n');
console.log('PASS: 10 matched pairs; Pawly/Vet DOM hashes unchanged; 4 source captures with uniform 1px borders, transparent corners and intact border midpoints; EN/RU keyboard + navigation/Back + full-motion + no-JS.');
