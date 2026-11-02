import {launch,root,json,settled,routes,base,sweep} from './common.mjs';
const b=await launch(),p=await b.newPage({viewport:{width:1440,height:900}}),samples=[],checks=[];
const dev='http://127.0.0.1:4463';
for(const locale of ['en','ru']){
 const path=(locale==='ru'?'/ru':'')+'/work/agent-ops-console/';await p.goto(dev+path,{waitUntil:'networkidle'});await settled(p);await p.waitForFunction(()=>typeof window.__dsMotionDebug==='function');
 const sample=async label=>{const d=await p.evaluate(()=>window.__dsMotionDebug());samples.push({locale,label,...d});checks.push({name:`${locale} ${label} no duplicate scenes`,pass:d.duplicateScenes===0,data:{triggers:d.triggers,pins:d.pins}});};
 await sample('initial');for(let i=0;i<4;i++){await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);await sample('reduce-'+i);await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(1100);await sample('full-'+i);}
 for(const [width,height] of [[768,1024],[1024,600],[1440,900]]){await p.setViewportSize({width,height});await p.waitForTimeout(500);await sample(`resize-${width}-${height}`);}
 for(let i=0;i<3;i++){await p.locator('.navbar__brand').click();await settled(p);await p.locator('[data-case-card] a').first().click();await settled(p);await sample('navigation-'+i);}
}
await p.close();
// Font substitution and direct entry on every localized route, production build.
for(const locale of ['en','ru'])for(const route of routes){const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.route('**/*.woff2',async r=>{await new Promise(resolve=>setTimeout(resolve,2200));await r.continue();});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+(locale==='ru'?'/ru':'')+route,{waitUntil:'networkidle'});await settled(page);await sweep(page);const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,hidden:[...document.querySelectorAll('main [data-motion]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).opacity==='0').length}));checks.push({name:`${locale} ${route} delayed fonts`,pass:!errors.length&&data.overflow===0&&data.hidden===0,data:{...data,errors}});await ctx.close();}
await b.close();await json(root+'/logs/lifecycle.json',{checks,samples});console.log('TOTAL',checks.length,'FAIL',checks.filter(x=>!x.pass).length);if(checks.some(x=>!x.pass))process.exitCode=1;
