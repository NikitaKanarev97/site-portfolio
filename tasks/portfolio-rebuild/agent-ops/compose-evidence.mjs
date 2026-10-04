/** Review contact sheets only; public source UI is never edited here. */
import sharp from 'sharp';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const out='tasks/portfolio-rebuild/agent-ops',root='D:/Claude-projects/Site-portfolio/research/portfolio-benchmark/shots/pilot-checkpoint',sources=[];
const label=(text,width=1440)=>Buffer.from(`<svg width="${width}" height="32"><rect width="100%" height="100%" fill="#333"/><text x="12" y="22" fill="white" font-family="Arial" font-size="16">${text}</text></svg>`);
const panels=[];
for(const [row,d] of [0,650,1300,1950].entries())for(const [col,file] of [`${root}/1440-state-${d}.png`,`${out}/shots/en-1440-full-scene-${d}.png`,`${out}/shots/ru-1440-full-scene-${d}.png`].entries()){
 const b=readFileSync(file);sources.push({file,sha256:createHash('sha256').update(b).digest('hex'),state:d});panels.push({input:await sharp(b).resize({width:480}).png().toBuffer(),left:col*480,top:32+row*300});
}
await sharp({create:{width:1440,height:1232,channels:3,background:'#333'}}).composite([{input:label('Accepted checkpoint / F EN / F RU · actual 1440×900 · rows overview, workspace, promise, decision'),left:0,top:0},...panels]).png().toFile(out+'/shots/checkpoint-comparison.png');
const records=JSON.parse(readFileSync(out+'/recordings/recording.json')),filmPanels=[];
for(const [row,r] of records.entries())for(const [col,state] of r.states.slice(0,4).entries()){
 // The stop is observed after the native wheel and paint; extract half a second later.
 const seconds=state.time/1000+.5,file=`${out}/recordings/${r.lang}-hold-${col}.png`;
 execFileSync('D:/Programs/ffmpeg/bin/ffmpeg.exe',['-hide_banner','-loglevel','error','-y','-ss',String(seconds),'-i',`${out}/recordings/${r.lang}-1440-native-wheel.mp4`,'-frames:v','1',file]);
 filmPanels.push({input:await sharp(file).resize({width:360}).png().toBuffer(),left:col*360,top:32+row*225});
}
await sharp({create:{width:1440,height:482,channels:3,background:'#333'}}).composite([{input:label('Actual encoded film frames · EN then RU · natural wheel cadence, no retiming'),left:0,top:0},...filmPanels]).png().toFile(out+'/recordings/film-contact.png');
const pages=['en-1440-reduce-full.png','ru-1440-reduce-full.png','en-390-nojs-full.png','ru-390-nojs-full.png'],pagePanels=[],heights=[];
for(const [i,file] of pages.entries()){
 const b=await sharp(out+'/shots/'+file).resize({width:i<2?360:195}).png().toBuffer();heights.push((await sharp(b).metadata()).height);pagePanels.push({input:b,left:[0,368,736,939][i],top:32});
}
await sharp({create:{width:1134,height:Math.max(...heights)+32,channels:3,background:'#333'}}).composite([{input:label('EN 1440 reduce / RU 1440 reduce / EN 390 no-JS / RU 390 no-JS',1134),left:0,top:0},...pagePanels]).png().toFile(out+'/shots/static-overview.png');
writeFileSync(out+'/comparison-sources.json',JSON.stringify({sources,reviewOnly:true,publicUiUnchanged:true},null,2));
