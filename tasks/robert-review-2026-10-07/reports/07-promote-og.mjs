// Promote the existing OG renderer output; preserve the native UI half exactly.
import { copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const source='tasks/robert-review-2026-10-07/reports/07-build/dist/og/work-vet-clinic-onest.png';
const target='public/media/linkedin/og/work-vet-clinic.png';
const half=file=>sharp(file).extract({left:600,top:0,width:600,height:630}).ensureAlpha().raw().toBuffer();
const before=await half(target),after=await half(source);
if(!before.equals(after))throw new Error('Documentary half changed; refusing promotion');
await copyFile(source,target);
await writeFile('tasks/robert-review-2026-10-07/reports/07-og-promotion.json',JSON.stringify({source,target,documentaryPixelsEqual:true,sha256:createHash('sha256').update(after).digest('hex')},null,2));
console.log('Vet source OG updated; documentary pixel buffer unchanged.');
