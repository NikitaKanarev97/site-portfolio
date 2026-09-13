/** One inspectable proof card instead of three unreadable phone screens.
 * Crop the accepted 06 screenshots at their original 1.5x density.
 * No retouching, invented UI, colour treatment or regenerated content.
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';
const records=[];
for(const locale of ['en','ru']) {
  const root=`public/media/case-pawly${locale==='ru'?'-ru':''}`;
  const source=`${root}/order-details.webp`;
  const bounds={left:24,top:347,width:537,height:397};
  const file=`${root}/cover/return-confirmed.webp`;
  await fs.mkdir(`${root}/cover`,{recursive:true});
  const meta=await sharp(source).metadata();
  if(meta.width!==585||meta.height!==1266)throw Error('Source dimensions changed; recheck the card bounds.');
  await sharp(source).extract(bounds).webp({quality:94}).toFile(file);
  records.push({locale,source,bounds,file});
}
await fs.writeFile('D:/Claude-projects/PETS-walking/audit/product-polish/evidence/06-case/cover-manifest.json',JSON.stringify({date:new Date().toISOString(),records,note:'User-requested Home thumbnail: one real confirmed-return card. Original complete report remains in the case evidence.'},null,2));
console.log('EN/RU cover: confirmed-return card cropped from accepted real screenshots');
