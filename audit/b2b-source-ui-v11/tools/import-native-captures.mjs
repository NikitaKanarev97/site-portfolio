import { readFile,mkdir,writeFile,copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const product=process.env.PRODUCT_FIX_ROOT??'D:/Claude-projects/sp-b2b-source-ui-v11';
const root='audit/b2b-source-ui-v11';
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:product,encoding:'utf8'}).trim();
const sourceOrigin=execFileSync('git',['remote','get-url','origin'],{cwd:product,encoding:'utf8'}).trim();
const native=JSON.parse(await readFile(`${product}/audit/source-ui-v11/after/manifest.json`,'utf8'));
const media=JSON.parse(await readFile('src/data/partner-portal-v2-media.json','utf8'));
await mkdir(`${root}/product`,{recursive:true});
const entries=[];
for(const entry of native.entries){
  const key=`${entry.locale}-${entry.width}`;
  const raw=await readFile(`${product}/audit/source-ui-v11/${entry.source}`);
  assert.equal(createHash('sha256').update(raw).digest('hex'),entry.sha256);
  const metadata=await sharp(raw).metadata();
  // Format-only cutout: use the application's measured native outer radius.
  // No UI is rearranged, repainted, padded, replaced or newly rounded here.
  // Raw browser screenshots (including their page backdrop) remain untouched.
  const radius=entry.geometry.radius*entry.dpr;
  const silhouette=Buffer.from(`<svg width="${metadata.width}" height="${metadata.height}"><rect width="${metadata.width}" height="${metadata.height}" rx="${radius}" fill="white"/></svg>`);
  const target=`public/media/home-cover-polish/portal-${entry.locale}-${entry.width}.webp`;
  await sharp(raw).ensureAlpha().composite([{input:silhouette,blend:'dest-in'}]).webp({lossless:true,effort:6}).toFile(target);
  const output=await sharp(target).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const input=await sharp(raw).ensureAlpha().raw().toBuffer();
  let opaquePixelCount=0;
  for(let i=0;i<output.data.length;i+=4)if(output.data[i+3]===255){
    assert.equal(output.data[i],input[i]);assert.equal(output.data[i+1],input[i+1]);assert.equal(output.data[i+2],input[i+2]);opaquePixelCount++;
  }
  const corners=[0,metadata.width-1,metadata.width*(metadata.height-1),metadata.width*metadata.height-1].map(p=>output.data[p*4+3]);
  assert.deepEqual(corners,[0,0,0,0]);
  await copyFile(`${product}/audit/source-ui-v11/${entry.source}`,`${root}/product/${key}-native.png`);
  for(const phase of ['before','after'])for(const kind of ['decision','context'])await copyFile(`${product}/audit/source-ui-v11/${phase}/${key}-${kind}.png`,`${root}/product/${phase}-${key}-${kind}.png`);
  const src=`/media/home-cover-polish/portal-${entry.locale}-${entry.width}.webp`;
  media[`${entry.locale}/home-decision-${entry.width}`]={src,width:metadata.width,height:metadata.height,source:`${root}/product/${key}-native.png`,commit:sourceCommit,route:entry.route,export:'Native production component crop. External alpha follows its measured source radius; no capture-time CSS or DOM mutation.'};
  entries.push({...entry,src,sourceRepository:sourceOrigin,sourceCommit,outputWidth:metadata.width,outputHeight:metadata.height,sourceRadius:entry.geometry.radius,cornerAlpha:corners,opaquePixelCount,opaqueRGBUnchanged:true,rawSha256:entry.sha256,webpSha256:createHash('sha256').update(await readFile(target)).digest('hex')});
}
await writeFile('src/data/partner-portal-v2-media.json',JSON.stringify(media,null,2)+'\n');
await writeFile(`${root}/product/manifest.json`,JSON.stringify({sourceRepository:sourceOrigin,sourceCommit,nativeRecipe:'audit/source-ui-v11/tools/capture.mjs',capturePolicy:'No injected CSS, artificial DOM wrapper or text replacement. Alpha conversion affects only the external measured native silhouette.',entries},null,2)+'\n');
for(const file of ['browser-qa.json','scope-proof.json','test-results.json'])await copyFile(`${product}/audit/source-ui-v11/logs/${file}`,`${root}/product/${file}`);
console.log(`Imported 4 native Portal images from ${sourceCommit}; opaque RGB unchanged and transparent corners verified.`);
