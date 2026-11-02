import {launch,root,base,routes,json,settled,sweep,shot,watch} from './common.mjs';
const browser=await launch(),checks=[],axe=[],external=[],links=new Map(),issues=[];
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});if(!pass)console.log('FAIL',name,JSON.stringify(data));};
for(const locale of ['en','ru'])for(const width of [1440,390]){
 const ctx=await browser.newContext({viewport:{width,height:width<768?844:900},reducedMotion:'reduce'}),p=await ctx.newPage();
 for(const route of routes){const path=(locale==='ru'?'/ru':'')+route;try{
  await p.goto(base+path,{waitUntil:'networkidle'});await settled(p);await sweep(p);
  await p.addScriptTag({path:'D:/Claude-projects/Agent-ops-console/node_modules/axe-core/axe.min.js'});
  const a=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length};});
  axe.push({path,width,...a});console.log('AXE',path,width,a.violations.map(v=>v.id).join(',')||'PASS');
  if(process.env.FINAL_CAPTURE){const name=`${locale}-${width}-${route==='/'?'home':route.split('/').filter(Boolean).at(-1)}`;await shot(p,`${root}/after/${name}-viewport`);await shot(p,`${root}/after/${name}-full`,{fullPage:true});}
  for(const link of await p.locator('a[href]').evaluateAll(es=>es.map(e=>({href:e.href,text:e.innerText.trim()}))))if(!/^(mailto|tel):/.test(link.href)&&!link.href.includes('#'))links.set(link.href,link);
 }catch(e){issues.push({path,width,error:e.message});}await json(`${root}/logs/accessibility.json`,{axe,issues});}
 await ctx.close();
}
if(process.env.AXE_ONLY){await browser.close();console.log('AXE TOTAL',axe.length,'FAIL',axe.filter(a=>a.violations.length).length);if(issues.length||axe.some(a=>a.violations.length))process.exitCode=1;process.exit();}
// Short height and a DPR-2 720x450 desktop layout: reflow equivalent of 200% in 1440x900.
for(const [name,viewport,deviceScaleFactor] of [['short',{width:1440,height:600},1],['200pct-reflow',{width:720,height:450},2]]){
 const ctx=await browser.newContext({viewport,deviceScaleFactor,reducedMotion:'reduce'}),p=await ctx.newPage();
 for(const locale of ['en','ru'])for(const route of routes){const path=(locale==='ru'?'/ru':'')+route;await p.goto(base+path,{waitUntil:'networkidle'});await settled(p);const data=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,heading:[...document.querySelectorAll('h1,h2,h3')].filter(e=>e.getClientRects().length&&e.scrollWidth>e.clientWidth+2).map(e=>e.innerText)}));check(`${name} ${path}`,data.overflow===0&&!data.heading.length,data);}
 await ctx.close();
}
const ctx=await browser.newContext({viewport:{width:1440,height:900}}),p=await ctx.newPage(),events=watch(p);
for(const prefix of ['','/ru']){
 await p.goto(base+prefix+'/work/agent-ops-console/');await settled(p);
 for(let i=0;i<4;i++){await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(120);}
 check(`${prefix} preference rebuild no duplicate state`,await p.locator('[data-agent-reading]').count()===1);
 for(const [width,height] of [[1280,900],[768,1024],[1024,600],[1440,900]]){await p.setViewportSize({width,height});await p.waitForTimeout(300);check(`${prefix} resize ${width}x${height}`,await p.evaluate(()=>document.documentElement.scrollWidth===innerWidth));}
 await p.goto(base+prefix+'/');await settled(p);
 for(let i=0;i<3;i++){
  await p.locator('a[href="'+prefix+'/about"]').first().evaluate(e=>e.click());await p.waitForTimeout(80);
  await p.locator('.navbar__brand').evaluate(e=>e.click());await p.waitForTimeout(650);
 }
 await p.waitForTimeout(1300);check(`${prefix} rapid navigation endpoint`,await p.locator('body').evaluate(e=>getComputedStyle(e).opacity==='1'&&!e.classList.contains('ds-scroll-locked')),{url:p.url()});
 await p.locator('a[href="'+prefix+'/about"]').first().evaluate(e=>e.click());await p.waitForTimeout(80);await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(1000);check(`${prefix} preference during navigation visible`,await p.locator('body').evaluate(e=>getComputedStyle(e).opacity==='1'));await p.emulateMedia({reducedMotion:'no-preference'});
 await p.goto(base+prefix+'/work/agent-ops-console/');await settled(p);await p.locator('[data-zoom-trigger]').first().focus();await p.keyboard.press('Enter');await p.waitForTimeout(100);await p.goto(base+prefix+'/about/');await settled(p);check(`${prefix} navigation from open zoom unlocks`,await p.locator('body').evaluate(e=>!e.classList.contains('ds-scroll-locked')));
}
// Real background/foreground tab switch, not a synthetic visibility event.
await p.goto(base+'/work/agent-ops-console/');await settled(p);const other=await ctx.newPage();await other.goto('about:blank');await other.bringToFront();await p.waitForTimeout(300);await p.bringToFront();await p.waitForTimeout(300);check('background tab return visible',await p.locator('body').evaluate(e=>getComputedStyle(e).opacity==='1'));await other.close();
const notFound=await p.goto(base+'/quality-audit-missing-route/');check('404 uses error status',notFound.status()===404,{status:notFound.status(),title:await p.title()});
for(const link of links.values()){
 const u=new URL(link.href);
 if(u.origin===base){const r=await ctx.request.get(link.href);const type=r.headers()['content-type']??'';check('internal '+u.pathname,r.status()===200,{status:r.status(),type});if(/\.pdf$/i.test(u.pathname)){const bytes=await r.body();check('CV PDF '+u.pathname,bytes.subarray(0,4).toString()==='%PDF',{bytes:bytes.length});}}
}
check('core interactions runtime errors',!events.errors.length,events.errors);
await ctx.close();
// Actual browser navigation to linked demos and public social destinations.
for(const link of [...links.values()].filter(l=>new URL(l.href).origin!==base)){
 const ctx=await browser.newContext({viewport:{width:1280,height:900}}),p=await ctx.newPage(),r={...link};
 try{const response=await p.goto(link.href,{waitUntil:'domcontentloaded',timeout:25000});await p.waitForTimeout(700);r.status=response?.status();r.destination=p.url();r.title=await p.title();r.text=(await p.locator('body').innerText()).slice(0,250);}catch(e){r.limitation=e.message;}external.push(r);console.log('EXTERNAL',r.href,r.status??r.limitation);await ctx.close();await json(`${root}/logs/destinations.json`,external);
}
await browser.close();await json(`${root}/logs/supplemental.json`,{checks,issues,external});console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length,'AXE',axe.filter(a=>a.violations.length).length);if(issues.length||checks.some(c=>!c.pass)||axe.some(a=>a.violations.length))process.exitCode=1;
