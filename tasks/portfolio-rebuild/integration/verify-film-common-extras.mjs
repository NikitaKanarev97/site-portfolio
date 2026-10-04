import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(process.argv.find(a=>a.startsWith('--root='))?.slice(7)||'.');
const dir=resolve(process.argv.find(a=>a.startsWith('--output-dir='))?.slice(13)||root+'/tasks/portfolio-rebuild/integration/film-common');
mkdirSync(dir,{recursive:true});
const base=process.argv.find(a=>a.startsWith('--base='))?.slice(7)||'http://127.0.0.1:4381', results=[], failures=[];
const browser=await createRequire('D:/Claude-projects/PETS-walking/package.json')('playwright').chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});
try {
 for(const mode of ['full','no-js']) {
  const context=await browser.newContext({viewport:{width:mode==='full'?1440:360,height:844},javaScriptEnabled:mode!=='no-js'});
  const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/kit/',{waitUntil:'networkidle'});
  await page.locator('.case-specimen').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const state=await page.evaluate(()=>({mediaFrames:document.querySelectorAll('.media-frame').length,specimens:document.querySelectorAll('.case-specimen').length,screens:document.querySelectorAll('.case-screen').length,mediaFrameClips:document.querySelectorAll('video[data-clip]').length,loadedImages:[...document.querySelectorAll('.case-specimen img')].filter(e=>e.complete&&e.naturalWidth).length,pendingLazyImages:[...document.querySelectorAll('.case-specimen img')].filter(e=>!e.complete||!e.currentSrc).length,brokenImages:[...document.querySelectorAll('.case-specimen img')].filter(e=>e.complete&&e.currentSrc&&!e.naturalWidth).map(e=>e.currentSrc)}));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  if(state.mediaFrames!==10||state.specimens!==1||state.screens!==33||state.mediaFrameClips!==0||!state.loadedImages||state.brokenImages.length||overflow||errors.length)failures.push({mode,state,overflow,errors});
  results.push({mode,route:'/kit/',state,overflow,errors});await context.close();
 }
 const media=JSON.parse(readFileSync(root+'/tasks/portfolio-rebuild/integration/film-common/media.json','utf8')).media;
 const responses=[];
 for(const entry of media){
  const response=await fetch(base+'/'+entry.file.replace(/^public\//,''));
  const bytes=Buffer.from(await response.arrayBuffer());
  const sha256=createHash('sha256').update(bytes).digest('hex');
  if(response.status!==200||sha256!==entry.sha256||bytes.length!==entry.bytes)failures.push({file:entry.file,status:response.status,sha256});
  responses.push({file:entry.file,status:response.status,bytes:bytes.length,sha256});
 }
 writeFileSync(dir+'/clean-extras.json',JSON.stringify({base,results,mediaResponses:responses,failures},null,2)+'\n');
 console.log(JSON.stringify({kitProfiles:results.length,mediaResponses:responses.length,failures}));
 if(failures.length)process.exitCode=1;
}finally{await browser.close();}
