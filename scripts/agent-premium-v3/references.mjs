import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const paths=['research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg','research/portfolio-benchmark/case-blueprint/img/gr-swap1.jpg','research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png','research/portfolio-benchmark/case-blueprint/img/ha-wire.jpg','research/portfolio-benchmark/case-blueprint/img/ha-components.jpg','research/portfolio-rebuild-2026-10-03/references/ha-component-library.png','research/portfolio-benchmark/case-blueprint/img/dn-impact.jpg'];
const tiles=[];
for(let i=0;i<paths.length;i++){
 const data=await sharp(paths[i]).resize({width:720,height:620,fit:'inside'}).png().toBuffer();const m=await sharp(data).metadata();
 tiles.push({input:data,left:(i%2)*760+20,top:Math.floor(i/2)*680+40});
 tiles.push({input:Buffer.from(`<svg width="720" height="30"><text x="0" y="22" font-size="18">${i+1}: ${paths[i].split('/').at(-1)}</text></svg>`),left:(i%2)*760+20,top:Math.floor(i/2)*680+5});
}
await sharp({create:{width:1520,height:2720,channels:3,background:'#ffffff'}}).composite(tiles).png().toFile('audit/agent-ops-portfolio-premium-v3/references/inspected-pack.png');
await writeFile('audit/agent-ops-portfolio-premium-v3/references/paths.json',JSON.stringify(await Promise.all(paths.map(async path=>({path,sha256:createHash('sha256').update(await readFile(path)).digest('hex')}))),null,2));
