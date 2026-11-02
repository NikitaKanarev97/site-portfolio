import {launch,root} from './capture.mjs';
import {writeFile} from 'node:fs/promises';
const b=await launch(),results=[];
try {for(const locale of ['en','ru'])for(const width of [1440,390]){
 const c=await b.newContext({viewport:{width,height:width===1440?900:844}}),p=await c.newPage();
 await p.addInitScript(()=>{
  window.__localPerf={cls:0,lcp:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__localPerf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__localPerf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
 });
 const route=(locale==='ru'?'/ru':'')+'/work/agent-ops-console/';
 await p.goto('http://127.0.0.1:4406'+route,{waitUntil:'networkidle'});await p.waitForTimeout(1600);
 const data=await p.evaluate(()=>{
  const fg=getComputedStyle(document.querySelector('.agent-cover__head')).color,bg=getComputedStyle(document.querySelector('.agent-cover')).backgroundColor;
  const lum=c=>{const rgb=c.match(/[\d.]+/g).slice(0,3).map(v=>{const n=Number(v)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  const ratio=(a,b)=>{a=lum(a);b=lum(b);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
  const colors=[...document.querySelectorAll('.agent-cover .agent-label,.agent-cover .agent-body,.agent-index a')].map(el=>({text:el.textContent.trim().slice(0,50),color:getComputedStyle(el).color,contrast:ratio(getComputedStyle(el).color,el.closest('.agent-cover')?bg:'rgb(255,255,255)')}));
  return {localPerformance:window.__localPerf,headingContrast:ratio(fg,bg),textColors:colors,imageArea:[...document.querySelectorAll('.agent-case img')].map(i=>({src:i.currentSrc,width:i.width,height:i.height,reserved:!!i.getAttribute('width')&&!!i.getAttribute('height')})),resources:performance.getEntriesByType('resource').filter(r=>r.initiatorType==='script').map(r=>({name:r.name.split('/').at(-1),bytes:r.transferSize})),overflow:document.documentElement.scrollWidth-innerWidth};
 });
 const anchorPage=await c.newPage();await anchorPage.goto('http://127.0.0.1:4406'+route+'#policy',{waitUntil:'networkidle'});await anchorPage.waitForTimeout(1200);
 data.directAnchor=await anchorPage.locator('#policy').evaluate(el=>({top:el.getBoundingClientRect().top,y:scrollY,state:history.state}));
 data.pass=data.localPerformance.cls<=.1&&data.textColors.every(x=>x.contrast>=4.5)&&data.headingContrast>=3&&Math.abs(data.directAnchor.top)<100&&data.imageArea.every(i=>i.reserved)&&!data.overflow;
 results.push({locale,width,...data});await c.close();
}}finally{await b.close();await writeFile(`${root}/accessibility-performance.json`,JSON.stringify(results,null,2));}
console.log(JSON.stringify(results.map(x=>({locale:x.locale,width:x.width,pass:x.pass,cls:x.localPerformance.cls,lcpMs:x.localPerformance.lcp,directAnchorTop:x.directAnchor.top}))));
if(results.some(x=>!x.pass))process.exitCode=1;
