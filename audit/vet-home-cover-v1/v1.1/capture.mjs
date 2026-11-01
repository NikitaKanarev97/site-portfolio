import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const phase=process.argv[2]??'before';
const root='audit/vet-home-cover-v1/v1.1';
await mkdir(`${root}/${phase}`,{recursive:true});
const browser=await chromium.launch();const results=[];
try {
 for(const locale of ['en','ru'])for(const [width,height] of [[1440,900],[390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:4434/${locale==='ru'?'ru/':''}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>!i.closest('dialog')).map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));});
  await page.locator('#work-vet-clinic').screenshot({path:`${root}/${phase}/${locale}-${width}-vet.png`});
  const metrics=await page.locator('#work-vet-clinic').evaluate(card=>{
   const stage=card.querySelector('.vet-home'),r=card.getBoundingClientRect();
   return {cardWidth:r.width,cardHeight:r.height,gap:getComputedStyle(stage).gap,padding:getComputedStyle(stage).padding,images:[...stage.querySelectorAll('img')].map(i=>({src:i.currentSrc,width:i.width,height:i.height})),overflow:document.documentElement.scrollWidth-innerWidth};
  });
  results.push({locale,width,height,errors,...metrics});await page.close();
 }
}finally{await browser.close();}
await writeFile(`${root}/${phase}/manifest.json`,JSON.stringify({phase,browser:browser.version(),results},null,2)+'\n');
console.log(JSON.stringify(results));
