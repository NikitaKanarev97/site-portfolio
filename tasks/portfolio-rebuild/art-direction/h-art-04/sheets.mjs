import {readFile,mkdir,writeFile} from 'node:fs/promises';import {spawnSync} from 'node:child_process';import sharp from 'sharp';
const dir='tasks/portfolio-rebuild/art-direction/h-art-04';await mkdir(dir+'/frames',{recursive:true});
const walks=JSON.parse(await readFile(dir+'/walkthroughs.json','utf8')),metadata=[];
for(const r of walks.results){
 const file=`${dir}/recordings/${r.key}.webm`,probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=width,height','-of','json',file],{encoding:'utf8'});if(probe.status)throw new Error(probe.stderr);metadata.push({key:r.key,...JSON.parse(probe.stdout)});
 if(!(r.lang==='en'&&r.width===1440||r.lang==='ru'&&r.width===390))continue;
 let marks=r.marks.filter(m=>!['Next','Back','reverse reading'].includes(m.scene)).slice(0,6);if(marks.length<6)marks.push(...r.marks.slice(-6+marks.length));marks=marks.slice(0,6);
 const overlays=[],frameHeight=Math.round(480*(r.width===1440?900:844)/r.width);const cellHeight=frameHeight+32;
 for(let n=0;n<marks.length;n++){
  const time=Math.min(marks[n].seconds,Number(metadata.at(-1).format.duration)-.15),out=`${dir}/frames/${r.key}-${n}.png`;
  const f=spawnSync('ffmpeg',['-v','error','-y','-ss',String(time),'-i',file,'-frames:v','1','-update','1',out],{encoding:'utf8'});if(f.status)throw new Error(f.stderr);
  overlays.push({input:await sharp(out).resize({width:480}).png().toBuffer(),left:24+(n%3)*504,top:64+Math.floor(n/3)*cellHeight});
  overlays.push({input:Buffer.from(`<svg width="480" height="32"><text x="0" y="23" font-family="sans-serif" font-size="16" fill="#1b1b18">${time.toFixed(2)} s · native viewport</text></svg>`),left:24+(n%3)*504,top:64+Math.floor(n/3)*cellHeight+frameHeight});
 }
 await sharp({create:{width:1536,height:88+2*cellHeight,channels:3,background:'#ffffff'}}).composite([{input:Buffer.from(`<svg width="1488" height="40"><text x="0" y="28" font-family="sans-serif" font-size="24" fill="#1b1b18">H4 · ${r.key} · current native walkthrough</text></svg>`),left:24,top:16},...overlays]).png().toFile(`${dir}/${r.key}-motion-sheet.png`);console.log(r.key);
}
await writeFile(dir+'/video-metadata.json',JSON.stringify(metadata,null,2));console.log(`Probed ${metadata.length} native videos`);
