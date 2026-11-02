import sharp from 'sharp';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {root} from './capture.mjs';
const maps=[
 ['hero','en-1440-viewport.webp','research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg','R1 / Garri: hierarchy'],
 ['problem','en-1440-problem.webp','research/portfolio-benchmark/case-blueprint/img/gr-thesis.jpg','R1 / Garri: editorial thesis'],
 ['operating-model','en-1440-operating-model.webp','research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png','R3 / HA: connected decisions'],
 ['investigation','en-1440-investigation.webp','research/portfolio-benchmark/case-blueprint/img/gr-swap1.jpg','R2 / Garri: staged evidence'],
 ['checkpoint','en-1440-checkpoint.webp','research/portfolio-benchmark/case-blueprint/img/gr-swap1.jpg','R2 / Garri: focal product'],
 ['policy','en-1440-policy.webp','research/portfolio-rebuild-2026-10-03/references/ha-user-flow.png','R3 / HA: lifecycle'],
 ['autonomy','en-1440-autonomy.webp','research/portfolio-benchmark/case-blueprint/img/ha-components.jpg','R4 / HA: real system states'],
 ['outcome','en-1440-outcome.webp','research/portfolio-benchmark/case-blueprint/img/dn-impact.jpg','R5 / Dounar: structured outcomes'],
];
async function board(left,right,path,lLabel,rLabel,width=720){
 const l=await sharp(left).resize({width}).png().toBuffer(),r=await sharp(right).resize({width}).png().toBuffer();
 const height=Math.max((await sharp(l).metadata()).height,(await sharp(r).metadata()).height)+70;
 const label=(text)=>Buffer.from(`<svg width="${width}" height="40"><text x="0" y="25" font-family="sans-serif" font-size="18">${text.replaceAll('&','&amp;')}</text></svg>`);
 const out=sharp({create:{width:width*2+60,height,channels:3,background:'#ffffff'}}).composite([{input:l,left:20,top:55},{input:r,left:width+40,top:55},{input:label(lLabel),left:20,top:5},{input:label(rLabel),left:width+40,top:5}]);
 await out.webp({lossless:true,effort:2}).toFile(path);
}
for(const [id,final,ref,label]of maps)await board(ref,`${root}/after/${final}`,`${root}/comparisons/reference-${id}.webp`,label,'FINAL / Agent Ops V3');
for(const locale of ['en','ru'])for(const width of [1440,390,360,768,1024]){
 const name=`${locale}-${width}`,exists=async p=>!!await stat(p).catch(()=>null);
 const full=async phase=>`${phase}/${name}-full.${await exists(`${root}/${phase}/${name}-full.png`)?'png':'webp'}`;
 await board(`${root}/before/${name}-viewport.webp`,`${root}/after/${name}-viewport.webp`,`${root}/comparisons/${name}-viewport.webp`,'BEFORE / V2','AFTER / V3',width<768?width:720);
 await writeFile(`${root}/comparisons/${name}.md`,`# ${locale.toUpperCase()} · ${width}px\n\nMatched Chromium captures, same source baseline and final implementation.\n\n![First viewport comparison](${name}-viewport.webp)\n\n| Before · complete page | After · complete page |\n|---|---|\n| ![Before](../${await full('before')}) | ![After](../${await full('after')}) |\n\n${width===1440||width<768?['problem','operating-model','investigation','checkpoint','policy','autonomy','outcome'].map(id=>`- ${id}: [before](../before/${name}-${id}.webp) / [after](../after/${name}-${id}.webp)`).join('\n'):''}\n`);
}
// Reconstruct protected baseline from the screenshot files, including the corrected Learn route.
const protectedResults=[];
for(const locale of ['en','ru'])for(const width of [1440,390])for(const slug of ['home','partner-portal','learn','vet-clinic','pawly']){
 const name=`protected-${locale}-${width}-${slug}.webp`,before=await readFile(`${root}/before/${name}`),after=await readFile(`${root}/after/${name}`);
 const digest=b=>createHash('sha256').update(b).digest('hex');
 let pixelDifference;
 if(!before.equals(after)){
  const a=await sharp(before).raw().toBuffer({resolveWithObject:true}),b=await sharp(after).raw().toBuffer({resolveWithObject:true});
  let changed=0,total=0,max=0;for(let i=0;i<a.data.length;i++){const d=Math.abs(a.data[i]-b.data[i]);total+=d;max=Math.max(max,d);if(d)changed++;}
  pixelDifference={sameDimensions:a.info.width===b.info.width&&a.info.height===b.info.height,meanChannelDifference:total/a.data.length,changedChannels:changed,maxChannelDifference:max};
 }
 protectedResults.push({locale,width,slug,beforeSha256:digest(before),afterSha256:digest(after),identical:before.equals(after),pixelDifference});
}
await writeFile(`${root}/protected-comparison.json`,JSON.stringify(protectedResults,null,2));
await writeFile(`${root}/before/protected.json`,JSON.stringify(protectedResults.map(x=>({locale:x.locale,width:x.width,route:(x.locale==='ru'?'/ru':'')+(x.slug==='home'?'/':`/work/${x.slug}/`),file:`${root}/before/protected-${x.locale}-${x.width}-${x.slug}.webp`,sha256:x.beforeSha256})),null,2));
await writeFile(`${root}/REFERENCE-MAP.md`,'# Actual reference comparisons\n\nAll seven specified source images were opened as pixels. These boards pair complete final sections with proportionally scaled source captures. No claim about the current external sites or their animation. Originals stay in the existing research directories.\n\n| Composition | Actual source | Final comparison |\n|---|---|---|\n'+maps.map(([id,,ref,label])=>`| ${id} | [${label}](../../${ref}) | [Side by side](comparisons/reference-${id}.webp) |`).join('\n')+'\n\nSupplementary inspected sources: `ha-wire.jpg`, `ha-component-library.png`, plus the consolidated [pixel sheet](references/inspected-pack.png). Reference image hashes and paths are recorded in references/paths.json; complete source pixels remain in the repository.\n');
console.log(JSON.stringify({referenceBoards:maps.length,beforeAfterComparisons:10,protectedIdentical:protectedResults.filter(x=>x.identical).length,protectedTotal:protectedResults.length}));
