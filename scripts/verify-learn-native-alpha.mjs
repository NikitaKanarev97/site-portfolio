/** Native component captures must retain their transparent contour in both languages.
 * node scripts/verify-learn-native-alpha.mjs [origin]; ALPHA_BROWSER=webkit
 */
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const engine=process.env.ALPHA_BROWSER??'chromium';
const origin=process.argv[2]??'http://127.0.0.1:4475';
const output=`tmp/native-alpha/${origin.includes('127.0.0.1')?'local':'production'}-${engine}`;
await mkdir(output,{recursive:true});
const report={origin,engine,assets:[],pages:[],failures:[]};
for(const lang of ['en','ru']) for(const size of ['desktop','mobile']) {
  const suffix=lang==='ru'?'-ru':'';
  const files=[`art-direction/learn${suffix}/passport-${size}.png`,
    ...['trust','progress',...['setup','project','handover','explore'].map(s=>`theme-${s}`)]
      .map(s=>`rebuild/learn${suffix}/${s}-${size}.webp`)];
  for(const file of files) {
    const bytes=await readFile(`public/media/${file}`);
    const meta=await sharp(bytes).metadata();
    const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const corners=[0,info.width-1,(info.height-1)*info.width,info.width*info.height-1].map(i=>data[i*4+3]);
    let opaque=0;for(let i=3;i<data.length;i+=4) if(data[i]===255) opaque++;
    const opaqueRatio=opaque/(info.width*info.height);
    const response=await fetch(`${origin}/media/${file}`);
    const live=Buffer.from(await response.arrayBuffer());
    const sha256=createHash('sha256').update(bytes).digest('hex');
    if(!meta.hasAlpha||corners.some(a=>a!==0)||opaqueRatio<0.05) report.failures.push({file,issue:'Native contour lost',corners,opaqueRatio});
    if(response.status!==200||createHash('sha256').update(live).digest('hex')!==sha256) report.failures.push({file,issue:'Served asset differs'});
    report.assets.push({file,width:meta.width,height:meta.height,corners,opaqueRatio,sha256});
  }
}
const playwright=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const browser=await playwright[engine].launch(engine==='chromium'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
try {
  for(const width of [390,820,1440]) for(const lang of ['en','ru']) for(const path of ['/','/work/learn/']) {
    const route=(lang==='ru'?'/ru':'')+path;
    const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
    page.on('pageerror',error=>report.failures.push({route,width,error:error.message}));
    const response=await page.goto(origin+route,{waitUntil:'load'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});
    const result=await page.evaluate(()=>{
      const failures=[];
      if(document.documentElement.scrollWidth>innerWidth+1) failures.push('Horizontal overflow');
      const images=[...document.images].filter(img=>/\/(passport|theme-[a-z]+|trust|progress)-(desktop|mobile)\.(png|webp)/.test(img.currentSrc));
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      const context=canvas.getContext('2d',{willReadFrequently:true});
      const rendered=images.map(img=>{
        if(!img.naturalWidth) {failures.push('Broken image: '+img.currentSrc);return {src:img.currentSrc};}
        const corners=[[0,0],[img.naturalWidth-1,0],[0,img.naturalHeight-1],[img.naturalWidth-1,img.naturalHeight-1]].map(([x,y])=>{
          context.clearRect(0,0,1,1);context.drawImage(img,-x,-y);return context.getImageData(0,0,1,1).data[3];
        });
        if(corners.some(a=>a!==0)) failures.push('Opaque displayed corner: '+img.currentSrc);
        const box=img.getBoundingClientRect();
        if(Math.abs(box.height-box.width*img.naturalHeight/img.naturalWidth)>1) failures.push('Image stretched: '+img.currentSrc);
        return {src:new URL(img.currentSrc).pathname,width:box.width,height:box.height,corners};
      });
      if(!images.some(img=>img.currentSrc.includes('/passport-'))) failures.push('Programme passport absent');
      return {rendered,failures};
    });
    if(response.status()!==200) result.failures.push(`HTTP ${response.status()}`);
    for(const issue of result.failures) report.failures.push({route,width,issue});
    report.pages.push({route,width,...result});
    if(lang==='ru'&&path==='/work/learn/') {
      await page.locator('.learn-stage__passport').screenshot({path:`${output}/passport-${width}.png`});
      if(width===1440) await page.locator('[data-specimen-part="tasks"]').first().screenshot({path:`${output}/cards-${width}.png`});
    }
    await page.close();
  }
}finally{await browser.close();}
await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({origin,engine,assets:report.assets.length,pages:report.pages.length,failures:report.failures}));
if(report.failures.length) process.exitCode=1;
