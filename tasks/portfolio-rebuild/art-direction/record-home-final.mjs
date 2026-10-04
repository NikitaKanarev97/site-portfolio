import{createRequire}from'node:module';import{mkdir,readFile,writeFile,rename}from'node:fs/promises';
const require=createRequire('D:/Claude-projects/Agent-ops-console/package.json');const{chromium}=require('playwright');
const dir='tasks/portfolio-rebuild/art-direction';await mkdir(`${dir}/recordings/fast-home`,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});const results=[];
for(const[lang,width,height]of[['en',1440,900],['ru',390,844]]){
 const key=`${lang}-${width}-home`,dest=`${dir}/recordings/after/${key}-walkthrough.webm`;
 try{await rename(dest,`${dir}/recordings/fast-home/${key}-fast-scroll.webm`)}catch{}
 const c=await browser.newContext({viewport:{width,height},recordVideo:{dir:`${dir}/recordings/after`,size:{width,height}}}),p=await c.newPage(),errors=[],marks=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:4394/${lang==='ru'?'ru/':''}`,{waitUntil:'networkidle'});await p.waitForTimeout(1800);
 let prior=-1;
 for(let n=0;n<40;n++){
  await p.mouse.wheel(0,500);await p.waitForTimeout(900);
  const seen=await p.evaluate(()=>[...document.querySelectorAll('.work-stage')].filter(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight*.7&&r.bottom>innerHeight*.3}).map(e=>e.closest('.featured-case').id));
  for(const id of seen)if(!marks.includes(id)){await p.waitForTimeout(2000);marks.push(id);}
  const y=await p.evaluate(()=>scrollY);if(y===prior)break;prior=y;
 }
 await p.waitForTimeout(1000);await p.keyboard.press('Home');await p.waitForTimeout(700);const video=p.video();await c.close();await video.saveAs(dest);const r={key,marks,errors,recording:'Native wheel 500 px / 900 ms, 2 seconds at the first arrival of each WorkStage. Original fast traversal retained separately.'};results.push(r);console.log(JSON.stringify(r));
}
await browser.close();const prior=JSON.parse(await readFile(`${dir}/walkthroughs.json`,'utf8'));prior.results=[...prior.results.filter(r=>!results.some(n=>n.key===r.key)),...results];prior.updated=new Date().toISOString();await writeFile(`${dir}/walkthroughs.json`,JSON.stringify(prior,null,2));
