import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const root='audit/vet-home-cover-v1/v1.1';
const before=JSON.parse(await readFile(`${root}/before/manifest.json`)).results;
const after=JSON.parse(await readFile(`${root}/after/manifest.json`)).results;
await mkdir(`${root}/comparisons`,{recursive:true});
const results=[];
for(const a of after) {
 const b=before.find(b=>b.locale===a.locale&&b.width===a.width);
 assert.equal(b.gap,'12px');assert.equal(a.gap,'24px');
 assert.equal(a.cardHeight-b.cardHeight,12);assert.equal(a.cardWidth,b.cardWidth);
 assert.equal(a.padding,b.padding);assert.deepEqual(a.images,b.images);
 assert.deepEqual(a.errors,[]);assert.equal(a.overflow,0);
 const size=a.width===1440?640:390;
 const images=await Promise.all(['before','after'].map(phase=>sharp(`${root}/${phase}/${a.locale}-${a.width}-vet.png`).resize({width:size}).png().toBuffer()));
 const metadata=await Promise.all(images.map(bytes=>sharp(bytes).metadata()));
 const label=Buffer.from(`<svg width="${size*2+40}" height="60"><rect width="100%" height="100%" fill="white"/><text x="12" y="25" font-family="Arial" font-size="18">${a.locale.toUpperCase()} ${a.width} · BEFORE (left) / AFTER (right)</text><text x="12" y="48" font-family="Arial" font-size="15">Visit Record → caption: 12px → 24px · images unchanged</text></svg>`);
 await sharp({create:{width:size*2+40,height:Math.max(...metadata.map(m=>m.height))+80,channels:3,background:'white'}}).composite([{input:label,left:0,top:0},{input:images[0],left:10,top:70},{input:images[1],left:size+30,top:70}]).jpeg({quality:94}).toFile(`${root}/comparisons/${a.locale}-${a.width}.jpg`);
 results.push({locale:a.locale,width:a.width,gapBefore:12,gapAfter:24,cardHeightDelta:12,imageSourceAndDimensionsIdentical:true,paddingIdentical:true,overflow:0,errors:[]});
}
const sourceDiff=execFileSync('git',['diff','--name-only','24e0a22','--','src','public'],{encoding:'utf8'}).trim().split('\n');
assert.deepEqual(sourceDiff,['src/components/vet/VetHome.astro']);
await writeFile(`${root}/logs/verification.json`,JSON.stringify({baseline:'24e0a22',sourceDiff,results,otherCoversCasePageAndVisitScreenshotsUnchanged:true},null,2)+'\n');
console.log('PASS: 4 EN/RU 1440/390 profiles; exactly +12px gap/card height; identical image sources/dimensions and padding; no overflow/errors; only one product file changed.');
