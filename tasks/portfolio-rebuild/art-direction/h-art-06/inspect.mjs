import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const dir='tasks/portfolio-rebuild/art-direction/h-art-06',ref='0bfd9644207f6cd972c0941ce47742dd79ee2462';
await mkdir(dir+'/moments',{recursive:true});
const times=[2.23,2.80,6.74,7.20,8.49,9.00,10.61,11.20];
for(const seconds of times){const r=spawnSync('ffmpeg',['-v','error','-y','-ss',seconds.toFixed(2),'-i',dir+'/recordings/en-1440-home.webm','-frames:v','1','-update','1',`${dir}/moments/home-en-1440-${seconds.toFixed(2)}s.png`],{encoding:'utf8'});if(r.status)throw new Error(r.stderr);}
const quick=[];for(const lang of ['en','ru'])for(const width of [1440,390]){const key=`${lang}-${width}-home-quick`,r=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=width,height','-of','json',`${dir}/quick/${key}.webm`],{encoding:'utf8'});if(r.status)throw new Error(r.stderr);quick.push({key,...JSON.parse(r.stdout)});}
await writeFile(dir+'/quick-video-metadata.json',JSON.stringify({sourceRef:ref,results:quick},null,2)+'\n');
for(const name of ['composition-verification','lifecycle-verification','navigation-verification']){const path=dir+'/'+name+'.json',data=JSON.parse(await readFile(path,'utf8'));data.sourceRef=ref;data.build='dist-h6';data.provenance='Verified against the identical working tree then committed as sourceRef; token/motion mirrors unchanged.';await writeFile(path,JSON.stringify(data,null,2)+'\n');}
const capture=JSON.parse(await readFile(dir+'/capture-verification.json','utf8'));
const hidden=capture.results.flatMap(r=>r.frames.filter(f=>!f.loaded).map(f=>({lang:r.lang,width:r.width,slug:r.slug,src:f.src})));
const report={sourceRef:ref,captureProfiles:capture.results.length,overflowProfiles:capture.results.filter(r=>r.overflow>1),pageErrors:capture.results.flatMap(r=>r.errors),badFrames:capture.results.flatMap(r=>r.frames.filter(f=>!f.inside||f.fit&&f.fit!=='contain'||f.mask&&f.mask!=='none'||f.ratio>2)),unloaded: hidden};
await writeFile(dir+'/proof-summary.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
