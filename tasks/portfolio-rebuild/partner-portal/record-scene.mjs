import {browser} from './source-runtime.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const out='tasks/portfolio-rebuild/partner-portal/recording';mkdirSync(out,{recursive:true});
const b=await browser(),records=[];
try{for(const width of [1440,390]){
 const viewport={width,height:width===1440?900:844};
 const c=await b.newContext({viewport,recordVideo:{dir:out,size:viewport}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4354/preview/partner-portal-rebuild/en/',{waitUntil:'networkidle'});await p.waitForTimeout(1400);
 const scene=p.locator('.case-steps');const start=await scene.evaluate(e=>(e.closest('.pin-spacer')||e).getBoundingClientRect().top+scrollY-24);
 await p.evaluate(y=>scrollTo(0,y),start);await p.waitForTimeout(750);
 const focus=await scene.evaluate(e=>e.classList.contains('is-focused'));
 const distance=focus?2000:await scene.evaluate(e=>e.offsetHeight);
 for(let i=0;i<=3;i++){
  await p.screenshot({path:`${out}/${width}-stage-${i}.png`});
  if(i===3)break;
  const step=distance/3;for(let d=0;d<step;d+=40){await p.mouse.wheel(0,Math.min(40,step-d));await p.waitForTimeout(45);}await p.waitForTimeout(1000);
 }
 for(let d=0;d<distance;d+=80){await p.mouse.wheel(0,-Math.min(80,distance-d));await p.waitForTimeout(40);}await p.waitForTimeout(600);
 await c.close();await p.video().saveAs(`${out}/${width}-central-scene.webm`);
 const r=spawnSync('ffmpeg',['-y','-i',`${out}/${width}-central-scene.webm`,'-an','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',`${out}/${width}-central-scene.mp4`],{encoding:'utf8',windowsHide:true});if(r.status)throw Error(r.stderr);
 records.push({width,viewport,focus,distance,errors,method:'native wheel forward, three stages, reverse; original timing',cpu:'none; no parallel measurement'});
}}
finally{await b.close();writeFileSync(out+'/recording.json',JSON.stringify(records,null,2));}
if(records.some(r=>r.errors.length))throw Error('Recording has runtime errors');
