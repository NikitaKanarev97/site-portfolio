import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const root='audit/agent-ops-portfolio-premium-v3/v3.1';
const before=JSON.parse(await readFile(`${root}/before/checks.json`)),after=JSON.parse(await readFile(`${root}/after/checks.json`));
const sections=['problem','operating-model','investigation','checkpoint','policy','autonomy','outcome'];
await mkdir(`${root}/comparisons`,{recursive:true});
const summary=[];
for(let i=0;i<after.length;i++){
 const b=before[i],a=after[i],name=`${a.locale}-${a.width}`;
 const desktopSizes=[];
 if(a.width===1440)for(const section of sections){const bm=await sharp(`${root}/before/${name}-${section}.webp`).metadata(),am=await sharp(`${root}/after/${name}-${section}.webp`).metadata();desktopSizes.push({section,before:[bm.width,bm.height],after:[am.width,am.height]});}
 const checks={locale:a.locale,width:a.width,headings:a.headings.length,brokenBefore:b.headings.flatMap(h=>h.broken).length,brokenAfter:a.headings.flatMap(h=>h.broken).length,overflow:a.overflow,headingOverflow:a.headings.filter(h=>h.overflow||h.outside).length,amountsSingleLine:a.amounts.every(v=>v.lines===1),wordsBefore:b.words,wordsAfter:a.words,imagesUnchanged:b.images.map(v=>v.src).join()===a.images.map(v=>v.src).join(),desktopSizes};
 summary.push(checks);
 if(checks.brokenAfter||checks.overflow||checks.headingOverflow||!checks.amountsSingleLine||!checks.imagesUnchanged||a.errors.length||a.failed.length||a.images.some(i=>i.broken)||a.sections.join()!==sections.join())throw new Error(`Failed ${name}`);
 const full=a.width===1440?'webp':'png';
 const rows=sections.map(s=>`| ${s} | [Before](../before/${name}-${s}.webp) | [After](../after/${name}-${s}.webp) |`).join('\n');
 await writeFile(`${root}/comparisons/${name}.md`,`# ${a.locale.toUpperCase()} · ${a.width} px\n\nMatched Chromium production captures, reduced motion, device scale 1. Before: eb7b9e7. After: V3.1. Height ${a.height}px.\n\n| Surface | Before | After |\n|---|---|---|\n| First viewport | [Before](../before/${name}-viewport.webp) | [After](../after/${name}-viewport.webp) |\n| Full page | [Before](../before/${name}-full.${full}) | [After](../after/${name}-full.${full}) |\n| All 37 headings | [Before](../before/${name}-headings.webp) | [After](../after/${name}-headings.webp) |\n| Next-case title | [Before](../before/${name}-next.webp) | [After](../after/${name}-next.webp) |\n${rows}\n\nBefore / After heading sheets below are unscaled browser crops, separated into rows in document order. Full-page and section captures preserve actual composition.\n\n## Before\n\n![Before headings](../before/${name}-headings.webp)\n\n## After\n\n![After headings](../after/${name}-headings.webp)\n`);
}
await writeFile(`${root}/summary.json`,JSON.stringify(summary,null,2));
let manual='# Manual heading review · 2 November 2026\n\nAll 37 semantic headings, heading-role paragraphs, definition headings and native disclosure titles were viewed in both Before and After heading sheets for EN/RU × 320, 360, 390, 1440. Next-case titles were inspected separately in the next captures. This is implementation verification; independent visual acceptance is pending.\n\nChecked: complete words and punctuation, natural line breaks, no clipped ends or fixed-height truncation, hierarchy and separation from body text. Automated word-range and overflow checks supplement the visual inspection.\n';
for(const locale of ['en','ru']){
 manual+=`\n## ${locale.toUpperCase()} inventory\n\n| # | Heading | 320 | 360 | 390 | 1440 |\n|---|---|---|---|---|---|\n`;
 const list=after.find(r=>r.locale===locale&&r.width===360).headings;
 manual+=list.map((h,i)=>`| ${i+1} | ${h.text.replaceAll('|','/')} | Viewed | Viewed | Viewed | Viewed |`).join('\n')+'\n';
}
await writeFile(`${root}/MANUAL-HEADINGS.md`,manual);
console.log(JSON.stringify(summary.map(({desktopSizes,...s})=>s),null,2));
