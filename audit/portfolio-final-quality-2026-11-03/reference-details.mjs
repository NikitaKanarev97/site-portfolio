import {launch,root,json,shot} from './common.mjs';
import {mkdir} from 'node:fs/promises';
const browser=await launch(),results=[];
for(const [id,url,selector] of [
 ['blinkov-case','https://antonblinkov.com/','a[href="https://antonblinkov.com/tbank"]'],
 ['malugin-project','https://malugin.me/','a[href="#smartcat"]'],
 ['repponen-project','https://repponen.com/','a[href="#m-plus"]'],
 ['ha-case','https://hainteractive.com/work/','a'],
 ['dounar','https://ilyadounar.com/projects/myteam',null],
]){
 const dir=`${root}/references/${id}`;await mkdir(dir,{recursive:true});const ctx=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}}});const p=await ctx.newPage(),r={id,url,frames:[],errors:[]};p.on('pageerror',e=>r.errors.push(e.message));
 try{
  r.status=(await p.goto(url,{waitUntil:'domcontentloaded',timeout:30000})).status();await p.waitForTimeout(1800);
  if(selector){const el=p.locator(selector).first();if(await el.count()){
   await el.scrollIntoViewIfNeeded();await p.waitForTimeout(700);r.frames.push(await shot(p,`${dir}/rest`));r.target=await el.getAttribute('href');
   await el.hover();for(const ms of [100,500]){await p.waitForTimeout(ms);r.frames.push(await shot(p,`${dir}/hover-${ms}`));}
   r.styles=await el.evaluate(e=>({transition:getComputedStyle(e).transition,transform:getComputedStyle(e).transform,animations:document.getAnimations().map(a=>({timing:a.effect?.getTiming(),state:a.playState})).slice(0,10)}));
   await el.focus();r.frames.push(await shot(p,`${dir}/focus`));await el.click({noWaitAfter:true,timeout:8000});for(const ms of [100,500,1500]){await p.waitForTimeout(ms);r.frames.push(await shot(p,`${dir}/click-${ms}`));}
  }else r.missingTarget=selector;}
  r.destination=p.url();r.text=(await p.locator('body').innerText()).slice(0,1800);for(let i=0;i<3;i++){await p.mouse.wheel(0,700);await p.waitForTimeout(650);r.frames.push(await shot(p,`${dir}/section-${i}`));}
  await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'reduce'});await p.reload({waitUntil:'domcontentloaded'});await p.waitForTimeout(1800);r.frames.push(await shot(p,`${dir}/mobile-reduce`));
 }catch(e){r.limitation=e.message;}
 const v=p.video();await ctx.close();await v.saveAs(`${dir}/browser.webm`);r.video=`${dir}/browser.webm`;results.push(r);await json(`${root}/references/details.json`,results);console.log(id,r.destination,r.limitation??r.missingTarget??'captured');
}
await browser.close();
