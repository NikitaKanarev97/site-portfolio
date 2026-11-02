import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
const root='audit/vet-portfolio-premium-v3';
const added=JSON.parse(fs.readFileSync('src/data/vet-v3-media.json','utf8'));
const original=JSON.parse(fs.readFileSync('src/data/vet-v2-media.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const results=[];
for(const [key,m] of Object.entries(added)) {
  const image='public'+m.src;
  const r={left:m.clip.x*2,top:m.clip.y*2,width:m.width,height:m.height};
  const raw=await sharp(m.source).extract(r).ensureAlpha().raw().toBuffer();
  const output=await sharp(image).ensureAlpha().raw().toBuffer();
  results.push({key,source:m.source,clip:m.clip,sha256:hash(fs.readFileSync(image)),sourceSha256:hash(fs.readFileSync(m.source)),exactPixels:raw.equals(output),fileHashMatches:hash(fs.readFileSync(image))===m.sha256});
}
const preserved=[];
for(const [key,m] of Object.entries(original)) preserved.push({key,unchanged:hash(fs.readFileSync('public'+m.src))===m.sha256});
const sourceFiles=['src/copy/cases/vet-v2.ts','src/copy/ru/cases/vet-v2.ts','src/data/vet-v2-media.json','src/components/vet/VetHome.astro','ds/tokens.css','src/styles/tokens.css','src/components/MediaZoom.astro','src/components/CaseNext.astro'];
const shared=sourceFiles.map(file=>({file,unchanged:execFileSync('git',['diff','1edb887cdc237ebca2c99b29b1259bb40435605a','--',file]).length===0}));
const report={newAssets:results,originalAssets:preserved,preservedFiles:shared,tokenMirror:fs.readFileSync('ds/tokens.css').equals(fs.readFileSync('src/styles/tokens.css'))};
fs.writeFileSync(`${root}/media-integrity.json`,JSON.stringify(report,null,2));
console.log(`${results.length} additive assets: exact source pixels and hashes; ${preserved.length} original media hashes; ${shared.length} preserved source files.`);
if(results.some(r=>!r.exactPixels||!r.fileHashMatches)||preserved.some(r=>!r.unchanged)||shared.some(r=>!r.unchanged)||!report.tokenMirror)process.exitCode=1;
