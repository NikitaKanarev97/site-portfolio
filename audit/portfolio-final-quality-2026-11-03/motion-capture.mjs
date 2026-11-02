import {launch,root,base,json,shot,settled,watch} from './common.mjs';
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const phase=process.argv[2]??'before',browser=await launch(),results=[];
for(const route of ['/','/work/agent-ops-console/','/work/learn/']){
 const slug=route==='/'?'home':route.split('/').filter(Boolean).at(-1),dir=`${root}/motion-${phase}/${slug}`;await mkdir(dir,{recursive:true});
 const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}}});
 await context.addInitScript(()=>{window.__qaSamples=[];const start=performance.now();let last=-150;const frame=t=>{if(t-last>=120){last=t;window.__qaSamples.push({t:Math.round(performance.now()-start),scrollY,body:getComputedStyle(document.body??document.documentElement).opacity,targets:[...document.querySelectorAll('[data-motion-intro] [data-motion]')].map(e=>({mode:e.dataset.motion,opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,willChange:e.style.willChange}))});}if(performance.now()-start<8000)requestAnimationFrame(frame);};requestAnimationFrame(frame);});
 const page=await context.newPage(),events=watch(page);await page.goto(base+route,{waitUntil:'domcontentloaded'});await settled(page);
 const result={phase,route,sourceCommit,viewport:{width:1440,height:900},motion:'no-preference',...events,samples:await page.evaluate(()=>window.__qaSamples)};
 await shot(page,`${dir}/entrance-settled`);await page.mouse.wheel(0,700);await page.waitForTimeout(800);await shot(page,`${dir}/scroll`);await page.mouse.wheel(0,-500);await page.waitForTimeout(500);
 if(route.includes('agent-ops'))for(const i of [0,1,2,1]){await page.locator(`[data-agent-reading-step="${i}"]`).evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight/2+20));await page.waitForTimeout(400);await shot(page,`${dir}/reading-${i}`);}
 const zoom=page.locator('[data-zoom-trigger]').first();if(await zoom.count()){await zoom.scrollIntoViewIfNeeded();await zoom.focus();await page.keyboard.press('Enter');await page.waitForTimeout(400);await shot(page,`${dir}/zoom`);await page.keyboard.press('Escape');await page.waitForTimeout(200);}
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(400);await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(500);
 const video=page.video();await context.close();await video.saveAs(`${dir}/browser.webm`);result.video=`${dir}/browser.webm`;results.push(result);await json(`${root}/logs/motion-${phase}.json`,results);console.log(phase,slug,'captured');
}
await browser.close();
