import {readFile,writeFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('./',import.meta.url)),summary={};
for(const [label,file,count] of [
 ['chromium transitions','after/chromium/results.json',316],
 ['webkit transitions','after/webkit/results.json',316],
 ['chromium states','logs/states-chromium.json',290],
 ['webkit states','logs/states-webkit.json',290],
 ['chromium existing smoke','logs/chromium-smoke.json',138],
 ['webkit existing smoke','logs/webkit-smoke.json',128],
 ['captured raster colors','logs/frame-colors.json',48],
]){const d=JSON.parse(await readFile(root+file,'utf8'));assert.equal(d.checks.length,count,label);assert.equal(d.checks.filter(c=>!c.pass).length,0,label);assert.equal(d.issues?.length??0,0,label);summary[label]={checks:count,failures:0};}
const manifest=JSON.parse(await readFile(root+'evidence-manifest.json','utf8'));
for(const f of manifest){const bytes=await readFile(root+f.file);assert.equal(bytes.length,f.bytes,f.file);assert.equal(createHash('sha256').update(bytes).digest('hex'),f.sha256,f.file);}
summary.hashedMedia=manifest.length;
for(const file of ['index.html','REPORT.md','TRANSITION-MATRIX.md']){
 const s=await readFile(root+file,'utf8');
 const links=file.endsWith('.html')?[...s.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...s.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
 for(const link of links.filter(l=>!l.includes('://')&&!l.startsWith('#')))await access(root+link);
 summary[file]={links:links.length,missing:0};
}
assert.deepEqual(await readFile(new URL('../../../ds/tokens.css',import.meta.url)),await readFile(new URL('../../../src/styles/tokens.css',import.meta.url)));
summary.tokenMirrors='byte-identical';
await writeFile(root+'logs/evidence-verification.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
