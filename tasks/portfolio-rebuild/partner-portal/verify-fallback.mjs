import {browser} from './source-runtime.mjs';import {writeFileSync} from 'node:fs';
const b=await browser(),results=[],failures=[];
try{
 for(const mode of ['no-js','blocked-js'])for(const lang of ['en','ru'])for(const width of [1440,390]){
  const c=await b.newContext({viewport:{width,height:900},javaScriptEnabled:mode!=='no-js'}),p=await c.newPage();
  if(mode==='blocked-js')await p.route('**/*.js',r=>r.abort());
  await p.goto(`http://127.0.0.1:4354/preview/partner-portal-rebuild/${lang}/`,{waitUntil:'networkidle'});
  await p.locator('img').evaluateAll(es=>es.forEach(i=>i.loading='eager'));await p.waitForFunction(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth));
  const read=async()=>{if(mode==='blocked-js')await p.waitForFunction(()=>!document.documentElement.classList.contains('js'));return p.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,pins:document.querySelectorAll('.pin-spacer').length,blank:[...document.querySelectorAll('[data-h="thesis"],[data-h="para"]')].filter(e=>+getComputedStyle(e).opacity===0).length,stages:document.querySelectorAll('.case-steps__step').length}));};
  const initial=await read();await p.locator('.portal-preview-links a').click();const target=lang==='en'?'ru':'en';await p.waitForURL(`**/partner-portal-rebuild/${target}/`);const translated=await read();
  await p.goBack();await p.waitForURL(`**/partner-portal-rebuild/${lang}/`);const back=await read();
  const r={mode,lang,width,initial,translated,back};results.push(r);if([initial,translated,back].some(s=>s.overflow||s.pins||s.blank||s.stages!==3)||translated.lang!==target)failures.push(r);await c.close();
 }
 const c=await b.newContext({viewport:{width:1440,height:900}}),p=await c.newPage();await p.goto('http://127.0.0.1:4355/preview/partner-portal-rebuild/en/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
 const next=p.locator('.case-next__link');await next.evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(500);
 const transform=()=>p.locator('[data-motion="marquee"]').evaluate(e=>getComputedStyle(e).transform);
 const first=await transform();await next.hover();await p.waitForTimeout(250);const hover=await transform();await next.focus();await p.waitForTimeout(250);const focus=await transform();
 const tab=await c.newPage();await tab.goto('about:blank');await tab.bringToFront();const hidden=await p.evaluate(()=>document.hidden);await p.bringToFront();await p.waitForTimeout(250);const restored=await transform();
 const cdp=await c.newCDPSession(p);await cdp.send('Page.setWebLifecycleState',{state:'frozen'});await new Promise(r=>setTimeout(r,250));await cdp.send('Page.setWebLifecycleState',{state:'active'});await p.waitForTimeout(300);const thawed=await transform();
 const lifecycle={scenario:'fresh Next hover / focus / headless tabs / CDP freeze',first,hover,focus,hidden,restored,thawed};results.push(lifecycle);if(first===hover||hover===focus||focus===restored||restored===thawed)failures.push(lifecycle);await c.close();
}finally{await b.close();writeFileSync('tasks/portfolio-rebuild/partner-portal/fallback-verification.json',JSON.stringify({results,failures,visibilityLimit:'Headless tabs may stay visible; hidden field records actual observation, not physical tab acceptance'},null,2));}
console.log({profiles:results.length,failures:failures.length});if(failures.length)throw Error('Fallback/lifecycle failure');
