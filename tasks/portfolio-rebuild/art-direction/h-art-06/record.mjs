import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-06';await mkdir(dir+'/recordings',{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
const tasks=['en','ru'].flatMap(lang=>[1440,390].flatMap(width=>['','agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(slug=>({lang,width,slug}))));
async function film({lang,width,slug}){
 const key=`${lang}-${width}-${slug||'home'}`,c=await b.newContext({viewport:{width,height:width===390?844:900},recordVideo:{dir:dir+'/recordings',size:{width,height:width===390?844:900}}}),p=await c.newPage(),marks=[],errors=[],seen=new Set();const started=Date.now();
 const mark=scene=>marks.push({scene,seconds:Number(((Date.now()-started)/1000).toFixed(2))});p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:4399/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);mark('settled opening');
 let previous=-1,programme=false;
 for(let n=0;n<100;n++){
  await p.mouse.wheel(0,650);await p.waitForTimeout(350);
  const scenes=await p.evaluate(()=>[...document.querySelectorAll('.work-stage,.case-plate,.case-steps,.case-artifact,.case-next,[data-specimen-set],[data-specimen-part="foundation"]')].filter(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight*.7&&r.bottom>innerHeight*.3;}).map(e=>{
   const states=[...e.querySelectorAll('[data-focus-state]')].filter(s=>getComputedStyle(s).visibility!=='hidden'&&Number(getComputedStyle(s).opacity)>.7).map(s=>s.dataset.scene);
   return (e.closest('.featured-case')?.id||e.id||e.dataset.specimenSet||e.dataset.specimenPart||e.className.split(' ').slice(0,2).join(' '))+(states.length?' · '+states.join(','):'');
  }));
  for(const s of scenes)if(!seen.has(s)){seen.add(s);await p.waitForTimeout(1000);mark(s);}
  if(slug==='learn'&&!programme){const summaries=await p.locator('[data-case-route] summary').all();if(summaries.length>1){const r=await summaries[1].boundingBox();if(r&&r.y>0&&r.y<600){await summaries[1].click();programme=true;mark('native programme disclosure');await p.waitForTimeout(1000);}}}
  const y=await p.evaluate(()=>scrollY);if(y===previous)break;previous=y;
 }
 mark('page end');
 if(slug){await p.locator('.case-next__link').click();await p.waitForTimeout(800);mark('Next');await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(1000);mark('Back');}
 await p.mouse.wheel(0,-1500);await p.waitForTimeout(800);mark('reverse reading');
 const video=p.video();await c.close();await video.saveAs(`${dir}/recordings/${key}.webm`);await video.delete();const r={key,lang,width,slug,marks,errors};results.push(r);console.log(JSON.stringify({key,seconds:marks.at(-1).seconds,scenes:seen.size,errors:errors.length}));
}
try{let cursor=0;await Promise.all([0,1].map(async()=>{while(cursor<tasks.length)await film(tasks[cursor++]);}));}finally{await b.close();}
await writeFile(dir+'/walkthroughs.json',JSON.stringify({base:'http://127.0.0.1:4399',sourceRef:process.env.H6_SOURCE_REF || 'working-tree',recording:'Current H6 comparative families and atomic media production preview. Native wheel, programme disclosure, Next/Back and reverse reading. Mark times are wall-clock observations from navigation, not frame-accurate video timecodes.',results},null,2));if(results.some(r=>r.errors.length))process.exitCode=1;
