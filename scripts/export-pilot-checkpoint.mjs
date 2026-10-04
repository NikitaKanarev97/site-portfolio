/** Review artifacts from real browser captures. Does not alter source UI. */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const shots='research/portfolio-benchmark/shots/pilot-checkpoint';
const old='research/portfolio-benchmark/shots/pilot-art-direction';
const label=(text,width=1440)=>Buffer.from(`<svg width="${width}" height="60"><rect width="100%" height="100%" fill="white"/><text x="32" y="40" font-family="sans-serif" font-size="24" fill="#1b1b18">${text}</text></svg>`);
await sharp({create:{width:2880,height:960,channels:3,background:'white'}}).composite([
 {input:label('BEFORE · 1440 × 900'),left:0,top:0}, {input:label('CHECKPOINT · 1440 × 900'),left:1440,top:0},
 {input:`${old}/1440-state-1950.png`,left:0,top:60},{input:`${shots}/1440-state-1950.png`,left:1440,top:60},
]).jpeg({quality:94}).toFile('outputs/agent-ops-checkpoint-before-after.jpg');
const frames=await Promise.all([0,650,1300,1950].map(d=>sharp(`${shots}/1440-state-${d}.png`).resize(720,450).toBuffer()));
await sharp({create:{width:1440,height:900,channels:3,background:'white'}}).composite(frames.map((input,i)=>({input,left:i%2*720,top:Math.floor(i/2)*450}))).jpeg({quality:94}).toFile('outputs/agent-ops-checkpoint-scene-sheet.jpg');
const {phase}=JSON.parse(readFileSync(`${shots}/recording.json`));
for(const [name,start,end] of [['cover',0,phase.coverEnd],['focus',phase.sceneStart,phase.reverseEnd]]) {
 const result=spawnSync('ffmpeg',['-y','-ss',String(start),'-i',`${shots}/1440-native-wheel.webm`,'-t',String(end-start),'-an','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',`outputs/agent-ops-checkpoint-${name}.mp4`],{encoding:'utf8',windowsHide:true});
 if(result.status!==0)throw new Error(result.stderr);
}
// Samples from the actual exported movie, for human inspection of its states.
const video=spawnSync('ffmpeg',['-y','-i','outputs/agent-ops-checkpoint-focus.mp4','-vf','fps=1/2,scale=480:-1,tile=4x2','-frames:v','1','outputs/agent-ops-checkpoint-video-sheet.jpg'],{encoding:'utf8',windowsHide:true});
if(video.status!==0)throw new Error(video.stderr);
console.log('Exported comparison, scene sheet, actual cover/focus videos and video review sheet.');
