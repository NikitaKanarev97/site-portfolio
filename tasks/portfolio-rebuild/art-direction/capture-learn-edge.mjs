import{createRequire}from'node:module';import{mkdir,writeFile,readFile}from'node:fs/promises';import{createHash}from'node:crypto';
const{chromium}=createRequire('D:/Claude-projects/Agent-ops-console/package.json')('playwright');
const browser=await chromium.launch({executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe',headless:true});const entries=[];
await mkdir('public/media/art-direction/learn',{recursive:true});
for(const width of[1440,390]){
 const c=await browser.newContext({viewport:{width,height:1200},deviceScaleFactor:2,reducedMotion:'reduce'}),p=await c.newPage();await p.goto('http://127.0.0.1:4362/prototypes/learn/trajectory/puskonaladka?lang=en',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const card=p.locator('aside').first();const before=await card.evaluate(e=>({rect:e.getBoundingClientRect().toJSON(),radius:getComputedStyle(e).borderRadius,border:getComputedStyle(e).border,shadow:getComputedStyle(e).boxShadow,text:e.innerText}));
 await card.evaluate(e=>{for(let node=e.parentElement;node;node=node.parentElement)node.style.background='transparent';});
 const file=`public/media/art-direction/learn/passport-${width===1440?'desktop':'mobile'}.png`;await card.screenshot({path:file,omitBackground:true});const bytes=await readFile(file);
 entries.push({file,source:p.url(),viewport:{width,height:1200},dpr:2,...before,sha256:createHash('sha256').update(bytes).digest('hex'),capture:'Native aside; only ancestor background made transparent. No component style, text, border, radius, action or pixel retouch.'});await c.close();
}
await browser.close();await writeFile('tasks/portfolio-rebuild/art-direction/learn-captures.json',JSON.stringify(entries,null,2));console.log(JSON.stringify(entries.map(e=>({file:e.file,rect:e.rect,radius:e.radius}))));
