import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch();const results=[];
try {
for(const locale of ['en','ru']) for(const width of [1440,1024,768,390,360]) {
 const pair=[];
 for(const port of [4433,4434]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:${port}/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));});
  pair.push(await page.evaluate(()=>Object.fromEntries(['.hero','#work-agent-ops-console','#work-partner-portal','#work-learn','#work-pawly'].map(selector=>{
   const card=document.querySelector(selector);
   return [selector,[card,...card.querySelectorAll('*')].map(el=>{
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    if(r.width<=1||r.height<=1||cs.visibility==='hidden'||cs.display==='none')return null;
    return {tag:el.tagName,width:r.width,height:r.height,relativeX:r.x-card.getBoundingClientRect().x,relativeY:r.y-card.getBoundingClientRect().y,style:Object.fromEntries(['display','gridTemplateColumns','gap','padding','color','backgroundColor','border','borderRadius','fontFamily','fontSize','lineHeight','objectFit'].map(k=>[k,cs[k]]))};
   }).filter(Boolean)];
  }))));
  await page.close();
 }
 assert.deepEqual(pair[0],pair[1],`Protected geometry/styles: ${locale}/${width}`);
 results.push({locale,width,allFiveProtectedTreesGeometryAndComputedStylesIdentical:true});
}
}finally{await browser.close();}
await writeFile('audit/vet-home-cover-v1/logs/protected-geometry.json',JSON.stringify(results,null,2)+'\n');
console.log('PASS: all visible protected descendant geometry and selected computed styles match across 10 profiles; document Y intentionally excluded.');
