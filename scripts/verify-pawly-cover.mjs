import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('D:/Claude-projects/PETS-walking/package.json');
const {chromium}=require('playwright');
const origin=process.env.PORTFOLIO_ORIGIN??'http://127.0.0.1:4321';
const live=origin.startsWith('https:');
const output='D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case';
const records=[],errors=[];
const browser=await chromium.launch({headless:true});
try{
  for(const locale of ['en','ru'])for(const width of live?[390,1440]:[360,390,1440]){
    const prefix=locale==='ru'?'/ru':'';
    const p=await browser.newPage({viewport:{width,height:960},reducedMotion:'reduce'});
    p.on('pageerror',e=>errors.push(e.message));
    await p.goto(origin+prefix+'/');
    await p.locator('[data-more-cases] summary').click();
    const link=p.locator(`a[href="${prefix}/work/pawly"]`).first();
    await link.scrollIntoViewIfNeeded();
    const img=link.locator('img');
    await img.evaluate(i=>{i.loading='eager';return Promise.race([i.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Cover image decode timeout: '+i.src)),5000))]);});
    assert.equal(await img.count(),1);
    assert((await img.getAttribute('src')).endsWith('/cover/story.webp'));
    // Since 25.09.2026: three whole phones (status bar, screen, home bar), scripts/build-secondary-covers.mjs.
    const geometry=await img.evaluate(i=>{const r=i.getBoundingClientRect(),c=i.closest('.case-artwork__canvas').getBoundingClientRect();return{natural:[i.naturalWidth,i.naturalHeight],inside:r.top>=c.top-1&&r.bottom<=c.bottom+1&&r.left>=c.left-1&&r.right<=c.right+1};});
    assert.deepEqual(geometry.natural,[2067,1532]);
    assert.equal(geometry.inside,true);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(!live)await link.screenshot({path:`${output}/cover-after-${locale}-${width}.png`});
    await link.click();
    await p.waitForURL(/\/work\/pawly\/?$/);
    assert((await p.locator('.case-cover img').getAttribute('src')).endsWith('/cover/story.webp'));
    records.push({locale,width,cover:'three whole phones: before, during, after',geometry,pass:true});
    await p.close();
  }
  assert.equal(errors.length,0);
  await fs.writeFile(`${output}/cover-${live?'live':'local'}-checks.json`,JSON.stringify({date:new Date().toISOString(),origin,records,errors,pass:true},null,2));
  console.log(JSON.stringify({checks:records.length,errors,pass:true}));
}finally{await browser.close();}
