import {launch,root,base,json,settled} from './common.mjs';
import {writeFile,readdir,readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const browser=await launch(),results=[];
for(const route of ['/','/work/agent-ops-console/','/work/learn/','/work/pawly/']){
 const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await ctx.addInitScript(()=>{
  window.__perf={lcp:[],cls:0,longTasks:[],events:[],frames:[]};
  new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__perf.lcp.push({t:e.startTime,size:e.size,element:e.element?.tagName,url:e.url}))).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__perf.cls+=e.value;})).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__perf.longTasks.push({t:e.startTime,duration:e.duration}))).observe({type:'longtask',buffered:true});
  new PerformanceObserver(l=>l.getEntries().filter(e=>e.interactionId).forEach(e=>window.__perf.events.push({name:e.name,duration:e.duration,interactionId:e.interactionId}))).observe({type:'event',buffered:true,durationThreshold:16});
  let last;function f(t){if(last)window.__perf.frames.push(t-last);last=t;if(t<20000)requestAnimationFrame(f);}requestAnimationFrame(f);
 });
 const p=await ctx.newPage(),cdp=await ctx.newCDPSession(p),trace=[];
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8,connectionType:'cellular4g'});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 cdp.on('Tracing.dataCollected',e=>trace.push(...e.value));await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,loading',transferMode:'ReportEvents'});
 await p.goto(base+route,{waitUntil:'networkidle',timeout:60000});
 // Performance uses native lazy loading. Visual QA's settled() eagerly decodes
 // the whole page for complete screenshots and must not contaminate this lab.
 await p.waitForFunction(()=>[...document.querySelectorAll('[data-motion-intro] [data-motion]')].filter(e=>e.getClientRects().length).every(e=>getComputedStyle(e).opacity==='1'&&!e.style.willChange.includes('opacity')),{},{timeout:20000});
 await p.waitForTimeout(400);const entry=await p.evaluate(()=>structuredClone(window.__perf));
 for(let i=0;i<6;i++){await p.mouse.wheel(0,600);await p.waitForTimeout(160);}
 const t=p.locator('[data-zoom-trigger]').first();if(await t.count()){await t.scrollIntoViewIfNeeded();await t.click();await p.waitForTimeout(250);await p.keyboard.press('Escape');}
 await p.waitForTimeout(300);const end=await p.evaluate(()=>({...window.__perf,resources:performance.getEntriesByType('resource').filter(r=>r.initiatorType==='script').map(r=>({url:r.name,transfer:r.transferSize,encoded:r.encodedBodySize,decoded:r.decodedBodySize}))}));
 const complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');await complete;
 const slug=route==='/'?'home':route.split('/').filter(Boolean).at(-1);await writeFile(`${root}/logs/${slug}-mobile-trace.json.gz`,gzipSync(JSON.stringify({traceEvents:trace})));
 const frames=end.frames.slice().sort((a,b)=>a-b);results.push({route,conditions:{viewport:'390x844',cpu:4,latency_ms:150,download_mbps:1.6,coldContext:true},entry,end,summary:{LCP_ms:entry.lcp.at(-1)?.t,CLS:end.cls,longTasks:entry.longTasks.length,longTaskTotal_ms:entry.longTasks.reduce((n,t)=>n+t.duration,0),maxSyntheticEvent_ms:Math.max(0,...end.events.map(e=>e.duration)),rafP95_ms:frames[Math.floor(frames.length*.95)],framesOver50ms:end.frames.filter(t=>t>50).length,frameCount:end.frames.length}});console.log(slug,results.at(-1).summary);await ctx.close();await json(`${root}/logs/performance.json`,results);
}
const bundles=[];for(const file of await readdir('dist/_astro'))if(file.endsWith('.js')){const bytes=await readFile('dist/_astro/'+file);bundles.push({file,raw:bytes.length,gzip:gzipSync(bytes).length});}await json(`${root}/logs/javascript-weight.json`,{bundles,totalRaw:bundles.reduce((n,b)=>n+b.raw,0),totalGzip:bundles.reduce((n,b)=>n+b.gzip,0)});await browser.close();
