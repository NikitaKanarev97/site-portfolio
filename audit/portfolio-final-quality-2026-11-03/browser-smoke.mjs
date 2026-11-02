import {launch,root,base,routes,json,settled,watch} from './common.mjs';
const engine=process.argv[2]??'webkit',b=await launch(engine),checks=[],issues=[];
const check=(name,pass,data)=>{checks.push({name,pass:!!pass,data});if(!pass)console.log('FAIL',name,JSON.stringify(data));};
async function axe(p,name){await p.addScriptTag({path:'D:/Claude-projects/Agent-ops-console/node_modules/axe-core/axe.min.js'});const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});check(name,violations.length===0,violations);}
for(const locale of ['en','ru'])for(const width of [1440,390]){
 const ctx=await b.newContext({viewport:{width,height:width===390?844:900}}),p=await ctx.newPage(),events=watch(p),prefix=locale==='ru'?'/ru':'';
 try{
  for(const route of routes){
   await p.goto(base+prefix+route,{waitUntil:'networkidle'});await settled(p);
   if(width===390){const menu=p.locator('[data-navbar-trigger]');await menu.click();check(`${locale} ${route} mobile menu open`,await menu.getAttribute('aria-expanded')==='true');if(engine==='chromium'&&route==='/')await axe(p,`${locale} mobile menu axe`);await p.keyboard.press('Escape');check(`${locale} ${route} menu returns focus`,await menu.evaluate(e=>e===document.activeElement));}
   const zoom=p.locator('[data-zoom-trigger]').filter({visible:true}).first();
   if(await zoom.count()){await zoom.focus();await p.keyboard.press('Enter');const d=p.locator('[data-media-zoom]');await d.waitFor({state:'visible'});let trapped=true;for(let i=0;i<7;i++){await p.keyboard.press('Tab');trapped&&=await d.evaluate(e=>e.contains(document.activeElement));}check(`${locale}-${width} ${route} zoom trap`,trapped);if(engine==='chromium'&&route.includes('agent-ops'))await axe(p,`${locale}-${width} zoom axe`);await p.keyboard.press('Escape');check(`${locale}-${width} ${route} zoom restore`,await zoom.evaluate(e=>e===document.activeElement));}
   if(route==='/'){const trigger=p.locator('[data-dialog-open]').first();await trigger.focus();await p.keyboard.press('Enter');const d=p.locator('[data-project-dialog][open]');await d.waitFor({state:'visible'});let trapped=true;for(let i=0;i<7;i++){await p.keyboard.press('Tab');trapped&&=await d.evaluate(e=>e.contains(document.activeElement));}check(`${locale}-${width} project trap`,trapped);if(engine==='chromium')await axe(p,`${locale}-${width} project axe`);await p.keyboard.press('Escape');check(`${locale}-${width} project restore`,await trigger.evaluate(e=>e===document.activeElement));}
   const next=p.locator('a[data-case-next]');if(await next.count()){const href=await next.getAttribute('href');await next.click();await p.waitForURL(u=>u.pathname.replace(/\/$/,'')===new URL(href,base).pathname.replace(/\/$/,''));await settled(p);check(`${locale}-${width} ${route} next visible`,await p.locator('body').evaluate(e=>getComputedStyle(e).opacity==='1'));await p.goBack();await settled(p);}
   await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(150);check(`${locale}-${width} ${route} reduce`,await p.locator('[data-motion-intro] [data-motion]').evaluateAll(es=>es.filter(e=>e.getClientRects().length).every(e=>getComputedStyle(e).opacity==='1')));await p.emulateMedia({reducedMotion:'no-preference'});
  }
  check(`${locale}-${width} runtime`,events.errors.length===0&&events.failed.length===0,events);
 }catch(e){issues.push({locale,width,error:e.message});console.log('EXCEPTION',locale,width,e.message);}await ctx.close();await json(root+`/logs/${engine}-smoke.json`,{checks,issues});
}
await b.close();console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length,'EXCEPTIONS',issues.length);if(checks.some(c=>!c.pass)||issues.length)process.exitCode=1;
