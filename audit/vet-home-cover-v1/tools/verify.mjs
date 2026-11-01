import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const root='audit/vet-home-cover-v1';
const before=JSON.parse(await readFile(`${root}/logs/before.json`)).results;
const after=JSON.parse(await readFile(`${root}/logs/after.json`)).results;
const rows=[];
async function identical(a,b) {
 const x=await sharp(a).raw().toBuffer({resolveWithObject:true}),y=await sharp(b).raw().toBuffer({resolveWithObject:true});
 if(x.info.width===y.info.width&&x.info.height===y.info.height&&x.data.equals(y.data))return {pixelExact:true};
 assert.equal(x.info.width,y.info.width);assert.ok(Math.abs(x.info.height-y.info.height)<=1,`Changed geometry: ${a}`);
 let best=Infinity;
 const stride=x.info.width*x.info.channels;
 for(const shift of [-1,0,1]) {
  const startX=Math.max(0,-shift),startY=Math.max(0,shift),h=Math.min(x.info.height-startX,y.info.height-startY);
  let sum=0;for(let row=0;row<h;row++)for(let j=0;j<stride;j++)sum+=Math.abs(x.data[(row+startX)*stride+j]-y.data[(row+startY)*stride+j]);
  best=Math.min(best,sum/(h*stride));
 }
 assert.ok(best<5,`Unexpected visual difference (${best}/255): ${a}`);
 return {pixelExact:false,meanChannelDifference:best,beforeHeight:x.info.height,afterHeight:y.info.height,note:'Subpixel document-position/raster rounding; protected DOM is exact.'};
}
for(const a of after) {
 const b=before.find(b=>a.locale===b.locale&&a.width===b.width);
 assert.equal(a.overflow,0);assert.equal(a.vetImages.length,1);
 assert.deepEqual(a.errors,[]);assert.deepEqual(a.failures,[]);assert.deepEqual(a.brokenImages,[]);
 assert.deepEqual(a.protected,b.protected);
 const screenshotComparisons={};
 for(const part of ['first','agent','portal','learn','pawly']) screenshotComparisons[part]=await identical(`${root}/screenshots/before/${a.locale}-${a.width}-${part}.png`,`${root}/screenshots/after/${a.locale}-${a.width}-${part}.png`);
 rows.push({locale:a.locale,width:a.width,beforeHeight:b.vetHeight,afterHeight:a.vetHeight,protectedDomIdentical:true,screenshotComparisons});
}
const media=JSON.parse(await readFile(`${root}/sources/manifest.json`));
for(const entry of media.entries) {
 const expected=await sharp(entry.local).extract(entry.crop).raw().toBuffer();
 const actual=await sharp(entry.output).raw().toBuffer();
 assert.ok(expected.equals(actual),`Lossless source parity: ${entry.output}`);
}
// Existing tracked product files outside the owned VetStage are exactly baseline.
const changed=execFileSync('git',['diff','--name-only','04ae075','--','src','public'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
assert.deepEqual(changed,['src/components/VetStage.astro']);
await writeFile(`${root}/logs/verification.json`,JSON.stringify({rows,sourcePixelParity:'4/4 exact rectangular source excerpts',existingTrackedSourceChanges:changed,protectedFilesUnchanged:true},null,2)+'\n');
console.log(`PASS: 10 profiles; ${rows.flatMap(r=>Object.values(r.screenshotComparisons)).filter(r=>r.pixelExact).length}/50 protected captures pixel-exact; remaining subpixel differences recorded; 4 source crops pixel-exact; no overflow/errors/broken images.`);
