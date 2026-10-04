import sharp from 'sharp';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const task='tasks/portfolio-rebuild/learn/';
const timeline=JSON.parse(await readFile(task+'motion/timeline.json','utf8'));
const {spawnSync}=await import('node:child_process');
const panels=[];
for(const [i,event] of timeline.events.entries()){
 const file=task+'motion/frame-'+(i+1)+'.png';const timestamp=event.seconds+0.25;
 const ff=spawnSync('D:/Programs/ffmpeg/bin/ffmpeg.exe',['-y','-ss',String(timestamp),'-i',task+'motion/central-raw.webm','-frames:v','1',file],{stdio:'pipe'});if(ff.status!==0)throw Error(ff.stderr.toString());
 const frame=await sharp(file).resize({width:480}).png().toBuffer();const header=Buffer.from(`<svg width="480" height="44"><rect width="480" height="44" fill="white"/><text x="12" y="28" font-family="Arial" font-size="18">${timestamp.toFixed(2)} s · ${event.action}</text></svg>`);
 panels.push({input:header,left:(i%3)*500,top:Math.floor(i/3)*364});panels.push({input:frame,left:(i%3)*500,top:Math.floor(i/3)*364+44});
}
await sharp({create:{width:1480,height:708,channels:4,background:'#ffffff'}}).composite(panels).png().toFile(task+'motion/contact-sheet.png');
for(const [kind,reference,block] of [['map','ha-screen-map.png','shared-material'],['theme','ha-component-library.png','content-language']]){
 const left=await sharp('research/portfolio-rebuild-2026-10-03/references/'+reference).resize({width:1000}).png().toBuffer();
 const right=await sharp(task+'shots/en-1440-'+block+'.png').resize({width:1000}).png().toBuffer();
 const a=await sharp(left).metadata(),b=await sharp(right).metadata();
 const header=Buffer.from('<svg width="2048" height="70"><rect width="2048" height="70" fill="white"/><g font-family="Arial" font-size="24" fill="#15243b"><text x="24" y="44">HA reference: '+reference+'</text><text x="1048" y="44">Learn: current rendered artifact</text></g></svg>');
 await sharp({create:{width:2048,height:Math.max(a.height,b.height)+100,channels:4,background:'#ffffff'}}).composite([{input:header,left:0,top:0},{input:left,left:24,top:80},{input:right,left:1048,top:80}]).png().toFile(task+'comparison-reference-'+kind+'.png');
}
const captures=JSON.parse(await readFile(task+'captures.json','utf8'));const covered=new Set(captures.map(v=>v.file));const media=[];
for(const file of await readdir('public/media/rebuild/learn')){
 const path='public/media/rebuild/learn/'+file;const b=await readFile(path);media.push({file:path,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),captureId:captures.find(c=>c.file===path)?.id??null,source:file==='archive-catalog.webp'?'Byte reuse of public/media/case-learn/before-catalog.webp':file.endsWith('.woff2')?'Byte reuse of D:/Claude-projects/learn/landing/app/public/fonts/'+file:undefined});
 if(!covered.has(path)&&!['archive-catalog.webp','onest-bold.woff2'].includes(file))throw Error('Missing media inventory: '+file);
}
await writeFile(task+'media-manifest.json',JSON.stringify(media,null,2));
const verification=JSON.parse(await readFile(task+'source-verification.json','utf8'));
for(const file of ['ia/wireframes/materialpage.md','src/screens/assessmentintro/AssessmentIntro.tsx','src/tokens/typography.css','landing/app/public/fonts/onest-bold.woff2']){
 const bytes=await readFile('D:/Claude-projects/learn/'+file);verification.sourceFiles=verification.sourceFiles.filter(v=>v.file!==file);verification.sourceFiles.push({file,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await writeFile(task+'source-verification.json',JSON.stringify(verification,null,2));
