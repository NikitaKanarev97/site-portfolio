import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-03';await mkdir(dir+'/focus-final',{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
for(const lang of ['en','ru'])for(const width of [1440,1024]){
 const c=await b.newContext({viewport:{width,height:900}}),p=await c.newPage();await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}work/agent-ops-console/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1300);
 const scene=p.locator('.case-steps--checkpoint');const top=await scene.evaluate(e=>e.getBoundingClientRect().top+scrollY);
 for(let n=0;n<4;n++){
  await p.evaluate(y=>scrollTo(0,y),top-24+n*650+150);await p.waitForTimeout(1300);
  const r=await scene.evaluate(e=>{const stage=e.querySelector('.case-steps__stage').getBoundingClientRect();return{focused:e.classList.contains('is-focused'),stage:stage.toJSON(),visible:[...e.querySelectorAll('[data-focus-state]')].filter(s=>getComputedStyle(s).visibility!=='hidden'&&Number(getComputedStyle(s).opacity)>.99).map(s=>({name:s.dataset.scene,screen:s.querySelector('.case-screen').getBoundingClientRect().toJSON(),img:s.querySelector('img').getBoundingClientRect().toJSON()}))};});
  results.push({lang,width,index:n,...r});await p.screenshot({path:`${dir}/focus-final/${lang}-${width}-${n}.png`});
 }
 await c.close();
}
await b.close();await writeFile(dir+'/focus-verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({lang:r.lang,width:r.width,index:r.index,focused:r.focused,visible:r.visible.map(v=>({name:v.name,bottom:v.screen.bottom,stageBottom:r.stage.bottom,imageBottom:v.img.bottom}))})),null,2));
