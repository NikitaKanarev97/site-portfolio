import {launch,base,root,json,shot} from './common.mjs';
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const phase=process.argv[2]??'before',browser=await launch(),results=[];
for(const [slug,route] of [['home','/'],['agent','/work/agent-ops-console/'],['learn','/work/learn/']]){
 const dir=`${root}/motion-${phase}/late-${slug}`;await mkdir(dir,{recursive:true});
 const ctx=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}}});
 await ctx.route('**/_astro/*.js',async r=>{await new Promise(resolve=>setTimeout(resolve,3200));await r.continue();});
 await ctx.addInitScript(()=>{
  window.__late=[];let last=0;function frame(t){if(t-last>80){last=t;const targets=[...document.querySelectorAll('[data-motion-intro] [data-motion]')];window.__late.push({t:Math.round(t),js:document.documentElement.classList.contains('js'),booted:!!window.__dsMotionBooted,targets:targets.map(e=>({mode:e.dataset.motion,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,lines:[...e.querySelectorAll('.ds-split-line')].map(e=>getComputedStyle(e).transform)}))});}if(t<11500)requestAnimationFrame(frame);}requestAnimationFrame(frame);
 });
 const p=await ctx.newPage();await p.goto(base+route,{waitUntil:'commit'});await p.waitForTimeout(2200);await shot(p,dir+'/fallback-visible');await p.waitForTimeout(4200);await shot(p,dir+'/bundle-arrival');await p.waitForTimeout(4500);
 const samples=await p.evaluate(()=>window.__late);const exposed=samples.find(s=>s.t>2000&&!s.js&&!s.booted&&s.targets.length&&s.targets.every(t=>t.opacity==='1'));
 const regressions=exposed?samples.filter(s=>s.t>exposed.t&&s.booted&&s.targets.some(t=>Number(t.opacity)<.99||t.lines.some(v=>v!=='none'&&v!=='matrix(1, 0, 0, 1, 0, 0)'))):[];
 const r={phase,route,sourceCommit,exposedAt:exposed?.t,regressions:regressions.length,samples};results.push(r);const v=p.video();await ctx.close();await v.saveAs(dir+'/browser.webm');await json(`${root}/logs/late-bundle-${phase}.json`,results);console.log(slug,'exposed',r.exposedAt,'regressions',r.regressions);
}
await browser.close();
if(phase==='after'&&results.some(r=>!r.exposedAt||r.regressions))process.exitCode=1;
