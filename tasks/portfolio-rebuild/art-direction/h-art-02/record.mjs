import{createRequire}from'node:module';import{mkdir,writeFile}from'node:fs/promises';
const{chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const dir='tasks/portfolio-rebuild/art-direction/h-art-02';await mkdir(dir+'/recordings',{recursive:true});
const b=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'}),results=[];
try{for(const[lang,width,height]of[['en',1440,900],['ru',390,844]])for(const slug of['','learn','vet-clinic']){
 const key=`${lang}-${width}-${slug||'home'}`,c=await b.newContext({viewport:{width,height},recordVideo:{dir:dir+'/recordings',size:{width,height}}}),p=await c.newPage(),errors=[],marks=[];const started=Date.now();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}${slug?`work/${slug}/`:''}`,{waitUntil:'networkidle'});await p.waitForTimeout(1800);marks.push({scene:'settled opening',seconds:(Date.now()-started)/1000});
 let prior=-1,programme=false;const seen=new Set();
 for(let n=0;n<65;n++){
  await p.mouse.wheel(0,500);await p.waitForTimeout(750);
  const scenes=await p.evaluate(()=>[...document.querySelectorAll('.work-stage')].filter(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight*.65&&r.bottom>innerHeight*.35}).map(e=>e.closest('.featured-case')?.id||'case-cover'));
  for(const scene of scenes)if(!seen.has(scene)){seen.add(scene);marks.push({scene,seconds:(Date.now()-started)/1000});await p.waitForTimeout(1700);}
  if(slug==='learn'&&!programme){const d=p.locator('[data-case-route]').nth(1),summary=d.locator('summary'),r=await summary.boundingBox();if(r&&r.y>=0&&r.y<height-100){await summary.click();programme=true;marks.push({scene:'native programme disclosure',seconds:(Date.now()-started)/1000});await p.waitForTimeout(1700);}}
  const y=await p.evaluate(()=>scrollY);if(y===prior)break;prior=y;
 }
 if(slug){await p.locator('.case-next__link').click();await p.waitForTimeout(900);await p.goBack({waitUntil:'networkidle'});await p.waitForTimeout(900);marks.push({scene:'Next / Back',seconds:(Date.now()-started)/1000});}
 await p.mouse.wheel(0,-1800);await p.waitForTimeout(1000);const video=p.video();await c.close();await video.saveAs(`${dir}/recordings/${key}-walkthrough.webm`);results.push({key,marks,errors});console.log(JSON.stringify(results.at(-1)));
}}finally{await b.close();}
await writeFile(dir+'/walkthroughs.json',JSON.stringify({base:'http://127.0.0.1:4394',results,recording:'Native wheel and native disclosure/Next/Back. Times are wall-clock observations; use ffprobe/frame evidence for exact video duration.'},null,2));
