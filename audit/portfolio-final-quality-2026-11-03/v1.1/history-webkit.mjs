import {launch,base,settled} from '../common.mjs';
import {writeFile} from 'node:fs/promises';
const b=await launch('webkit'),samples=[];
for(const zoom of [false,true]){
 const ctx=await b.newContext({viewport:{width:390,height:844}}),p=await ctx.newPage();
 await p.addInitScript(()=>{window.__loads=0;window.__scrollCalls=[];document.addEventListener('astro:page-load',()=>window.__loads++);
  const scroll=window.scrollTo.bind(window);window.scrollTo=(...args)=>{const before=scrollY;scroll(...args);window.__scrollCalls.push({args,before,after:scrollY,height:document.documentElement.scrollHeight,stack:new Error().stack});};
  for(const event of ['astro:before-preparation','astro:before-swap','astro:after-swap','astro:page-load'])document.addEventListener(event,()=>window.__scrollCalls.push({event,y:scrollY,state:history.state}));
 });
 const sample=async name=>{const d=await p.evaluate(()=>({y:scrollY,state:history.state,height:document.documentElement.scrollHeight,body:getComputedStyle(document.body).transform,entryTop:document.querySelector('[data-case-card="case-agent"] .featured-case__cta')?.getBoundingClientRect().top,entryHeight:document.querySelector('[data-case-card="case-agent"]')?.getBoundingClientRect().height,heroHeight:document.querySelector('.home-hero')?.getBoundingClientRect().height}));samples.push({zoom,name,...d});console.log(zoom,name,JSON.stringify(d));};
 await p.goto(base+'/');await settled(p);const entry=p.locator('[data-case-card="case-agent"] .featured-case__cta');await entry.scrollIntoViewIfNeeded();await entry.focus();await p.waitForTimeout(180);await sample('before');
 await p.keyboard.press('Enter');await p.waitForURL(u=>u.pathname.includes('agent-ops-console'));await settled(p);await p.waitForTimeout(1150);await sample('case');
 if(zoom){const trigger=p.locator('[data-zoom-trigger]').filter({visible:true}).first();await trigger.focus();await p.keyboard.press('Enter');await p.locator('[data-media-zoom]').waitFor({state:'visible'});await p.keyboard.press('Tab');await p.keyboard.press('Escape');await sample('after zoom');}
 const n=await p.evaluate(()=>window.__loads);await p.goBack();await p.waitForFunction(n=>window.__loads>n,n);await sample('after page-load');await settled(p);await sample('settled');await p.waitForTimeout(1500);await sample('later');samples.push({zoom,calls:await p.evaluate(()=>window.__scrollCalls)});await ctx.close();
}
await b.close();await writeFile(new URL('./logs/history-webkit.json',import.meta.url),JSON.stringify(samples,null,2));
