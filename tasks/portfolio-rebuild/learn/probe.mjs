import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire('D:/Claude-projects/b2b-dssl/package.json')('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'});const results=[];
for(const [width,rate,reduced] of [[1440,1,false],[390,4,false],[390,4,true]]){
 const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:reduced?'reduce':'no-preference'});const p=await ctx.newPage();
 const cdp=await ctx.newCDPSession(p);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate});
 await p.addInitScript(()=>{window.__learnProbe={cls:0,lcp:0,longTasks:[]};new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__learnProbe.cls+=e.value;})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>list.getEntries().forEach(e=>window.__learnProbe.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>list.getEntries().forEach(e=>window.__learnProbe.longTasks.push(e.duration))).observe({type:'longtask',buffered:true});});
 await p.goto('http://127.0.0.1:4360/preview/learn-rebuild/en/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(900);
 const metrics=await p.evaluate(()=>({fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,...window.__learnProbe,overflow:document.documentElement.scrollWidth-innerWidth}));results.push({width,rate,reduced,...metrics});await ctx.close();
}
await browser.close();await writeFile('tasks/portfolio-rebuild/learn/production-probe.json',JSON.stringify({method:'One cold local run per profile, CPU emulation only, no network throttle; after capture/verification finish. Initial viewport only, not a field measurement.',results},null,2));console.log(results);
