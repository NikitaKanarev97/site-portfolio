// Independent raster check of REAL normal-motion browser captures, not DOM renders.
import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./',import.meta.url));
const checks=[],frames=[];
const near=(data,i,rgb)=>rgb.every((v,c)=>Math.abs(data[i+c]-v)<=3);
for(const phase of ['before','after'])for(const engine of phase==='before'?['chromium']:['chromium','webkit']){
 const results=JSON.parse(await readFile(`${root}/${phase}/${engine}/results.json`,'utf8'));
 for(const transition of results.transitions.filter(t=>['agent','portal'].includes(t.key)))for(const frame of transition.frames){
  const {data,info}=await sharp(`${root}/${frame.file}`).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const expected=transition.key==='agent'?[247,247,245]:[237,242,248];
  const obsolete=transition.key==='agent'?[37,51,50]:[243,230,174];
  let current=0,old=0;
  for(let i=0;i<data.length;i+=info.channels){if(near(data,i,expected))current++;if(near(data,i,obsolete))old++;}
  const d={phase,engine,id:transition.id,source:transition.source,key:transition.key,...frame,currentFraction:current/(info.width*info.height),obsoleteFraction:old/(info.width*info.height)};
  frames.push(d);
  // At the out/in boundary (~300 ms), the group backdrop must be exposed.
  // Other times may include legitimate product pixels; report rather than ban them.
  if(phase==='after'&&frame.target===300){const pass=d.currentFraction>.02&&d.obsoleteFraction<.005;checks.push({name:`${engine} ${transition.id} ${transition.source}→${transition.key} real 300ms surface`,pass,data:d});if(!pass)console.log('FAIL',checks.at(-1));}
 }
}
await writeFile(`${root}/logs/frame-colors.json`,JSON.stringify({checks,frames},null,2));
console.log('TOTAL',checks.length,'FAIL',checks.filter(c=>!c.pass).length,'FRAMES',frames.length);
if(checks.some(c=>!c.pass))process.exitCode=1;
