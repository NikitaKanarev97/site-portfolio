import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-06';await mkdir(dir+'/quick',{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
try{for(const lang of ['en','ru'])for(const width of [1440,390]){
 const key=`${lang}-${width}-home-quick`,height=width===390?844:900,c=await b.newContext({viewport:{width,height},recordVideo:{dir:dir+'/quick',size:{width,height}}}),p=await c.newPage(),errors=[],observations=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:4399/${lang==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1000);
 for(let n=0;n<5;n++){
  const link=p.locator('.work-index a').nth(n),id=(await link.getAttribute('href')).slice(1);await link.click();await p.waitForTimeout(100);
  const data=await p.locator('#'+id).evaluate(e=>({id:e.id,hash:location.hash,frames:[...e.querySelectorAll('.case-screen')].map(s=>{const i=s.querySelector('img');return{frame:getComputedStyle(s).opacity,image:getComputedStyle(i).opacity,loaded:i.complete&&i.naturalWidth>0,motion:s.dataset.motion??null,innerMotion:i.dataset.motion??null};})}));observations.push(data);
  await p.screenshot({path:`${dir}/quick/${lang}-${width}-${id}-entry.png`});
 }
 for(let n=0;n<20;n++){await p.mouse.wheel(0,850);await p.waitForTimeout(100);}await p.mouse.wheel(0,-1800);await p.waitForTimeout(150);
 const builds=await p.locator('.dev__preview').evaluateAll(es=>es.map(e=>{const i=e.querySelector('img');return{motion:e.dataset.motion??null,opacity:getComputedStyle(i).opacity,clip:getComputedStyle(i).clipPath,loaded:i.complete&&i.naturalWidth>0};}));
 const pass=observations.every(o=>o.hash==='#'+o.id&&o.frames.every(f=>f.frame==='1'&&f.image==='1'&&f.loaded&&!f.motion&&!f.innerMotion))&&builds.every(f=>!f.motion&&f.opacity==='1'&&f.loaded);
 const v=p.video();await c.close();await v.saveAs(`${dir}/quick/${key}.webm`);await v.delete();results.push({key,pass,errors,observations,builds});console.log(key,pass);
}}finally{await b.close();}
await writeFile(dir+'/quick-verification.json',JSON.stringify({sourceRef:process.env.H6_SOURCE_REF||'working-tree',scenario:'Native five quick links, 100ms first observation, fast native wheel and reverse. Screenshots preserve the complete viewport.',results},null,2)+'\n');if(results.some(r=>!r.pass||r.errors.length))process.exitCode=1;
