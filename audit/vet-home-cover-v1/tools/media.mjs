import sharp from 'sharp';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const product='D:/Claude-projects/vet-main-accepted-7266c19';
const root='audit/vet-home-cover-v1';
await mkdir(`${root}/sources`,{recursive:true});
await mkdir(`${root}/candidates`,{recursive:true});
await mkdir('public/media/vet-home-cover-v1',{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const entries=[];
for(const locale of ['en','ru']) for(const width of [1440,390]) {
  const relative=`audit/visit-record-premium-v1/v1.3/after/${width}-${locale}-normal.png`;
  const bytes=await readFile(`${product}/${relative}`);
  const committed=execFileSync('git',['-C',product,'show',`5ae80f674170ab59d09bf3704fbface87d63e003:${relative}`],{maxBuffer:20e6});
  if(!bytes.equals(committed)) throw new Error(`Source differs from accepted delivery: ${relative}`);
  const local=`${root}/sources/visit-${locale}-${width}.png`;
  await copyFile(`${product}/${relative}`,local);
  // Rectangular editorial excerpt only. No pixel painting, rearrangement or restyling.
  const crop=width===1440?{left:88,top:196,width:1264,height:locale==='en'?674:694}:{left:0,top:110,width:390,height:582};
  const output=`public/media/vet-home-cover-v1/visit-${locale}-${width}.webp`;
  await sharp(bytes).extract(crop).webp({lossless:true}).toFile(output);
  entries.push({locale,width,source:relative,local,sourceSha:'5ae80f674170ab59d09bf3704fbface87d63e003',sha256:hash(bytes),crop,output,outputSha256:hash(await readFile(output))});
  if(locale==='en') {
    const overview=width===1440?{left:16,top:72,width:1408,height:1420}:{left:0,top:72,width:390,height:1360};
    await sharp(bytes).extract(overview).png().toFile(`${root}/candidates/A-${width}.png`);
    await sharp(bytes).extract(crop).png().toFile(`${root}/candidates/B-${width}.png`);
    const invoice=`audit/vet-invoice-draft-premium-v1/v1/after/${width}-en-normal.png`;
    await copyFile(`${product}/${invoice}`,`${root}/sources/invoice-en-${width}.png`);
    const invoiceCrop=width===1440?{left:246,top:176,width:1144,height:670}:{left:0,top:118,width:390,height:900};
    await sharp(`${product}/${invoice}`).extract(invoiceCrop).png().toFile(`${root}/candidates/C-${width}.png`);
  }
}
await writeFile(`${root}/sources/manifest.json`,JSON.stringify({acceptedMerge:'3835c4ffe224a1077d131d2882878d3d373d56e5',invoiceDelivery:'3112fc053f4ed76c65ddaabae7f28f06fb1db33e',operation:'exact archived browser PNG -> rectangular crop -> lossless WebP; no fresh product capture',entries},null,2)+'\n');
console.log('Verified 4 committed Visit Record sources; generated lossless cover excerpts and 3 candidate pairs.');
