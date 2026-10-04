import {browser} from './source-runtime.mjs';
import {writeFileSync} from 'node:fs';
const b=await browser(),results=[];
try{for(const width of [1440,390])for(const cpu of [1,6]){
 const c=await b.newContext({viewport:{width,height:width===1440?900:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu});await cdp.send('Performance.enable');
 await p.addInitScript(()=>{window.__paintProbe={lcp:null,cls:0};new PerformanceObserver(l=>{const e=l.getEntries().at(-1);window.__paintProbe.lcp={ms:e.startTime,element:e.element?.tagName,url:e.url};}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__paintProbe.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
 await p.goto('http://127.0.0.1:4354/preview/partner-portal-rebuild/en/',{waitUntil:'networkidle'});await p.waitForTimeout(1800);
 const startup=await p.evaluate(()=>({...window.__paintProbe,production:!window.__dsMotionDebug,booted:window.__dsMotionBooted,transferredKB:performance.getEntriesByType('resource').reduce((a,r)=>a+r.transferSize,0)/1024}));
 await p.locator('#source-line').scrollIntoViewIfNeeded();await p.waitForTimeout(600);const before=(await cdp.send('Performance.getMetrics')).metrics;
 const gaps=await p.evaluate(async()=>{const a=[];let last=performance.now();for(let i=0;i<200;i++){await new Promise(requestAnimationFrame);const t=performance.now();a.push(t-last);last=t;scrollBy(0,i<100?24:-24);}return a.sort((a,b)=>a-b);});
 const after=(await cdp.send('Performance.getMetrics')).metrics;
 const r={width,cpu,startup,frameMedian:gaps[100],frameP95:gaps[190],framesOver34ms:gaps.filter(x=>x>34).length,costs:Object.fromEntries(['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration'].map(n=>[n,after.find(v=>v.name===n).value-before.find(v=>v.name===n).value])),errors};results.push(r);console.log(width,cpu,'LCP',startup.lcp?.ms,'CLS',startup.cls,'p95',r.frameP95);await c.close();
}}finally{await b.close();writeFileSync('tasks/portfolio-rebuild/partner-portal/production-probe.json',JSON.stringify({network:'local unthrottled',physicalDevice:false,samples:1,concurrentCaptureOrEncoding:false,results},null,2));}
if(results.some(r=>r.errors.length||!r.startup.production||!r.startup.booted))throw Error('Production startup failed');
