import sharp from 'sharp';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const media={},provenance=[];
for(const locale of ['en','ru'])for(const layout of ['desktop','mobile']){
 const source=`public/media/rebuild/agent-ops/v2/${locale}/autonomy-${layout}.webp`;
 const bounds=layout==='desktop'?{left:488,top:542,width:1374,height:locale==='ru'?1096:976}: {left:0,top:locale==='ru'?980:904,width:780,height:locale==='ru'?1556:1320};
 const target=`/media/rebuild/agent-ops/premium-v3/${locale}/autonomy-states-${layout}.webp`;
 await mkdir(`public/media/rebuild/agent-ops/premium-v3/${locale}`,{recursive:true});
 await sharp(source).extract(bounds).webp({lossless:true}).toFile(`public${target}`);
 media[`${locale}/autonomy-states-${layout}`]={src:target,width:bounds.width,height:bounds.height,cssWidth:bounds.width/2};
 provenance.push({source,sourceSha256:createHash('sha256').update(await readFile(source)).digest('hex'),bounds,target,operation:'Rectangular pixel excerpt of three complete native capability rows and their group labels. No repaint, stitching, scaling or recoloring.',fullSource:`/media/rebuild/agent-ops/v2/${locale}/autonomy-${layout}.webp`});
}
await writeFile('src/data/agent-ops-premium-media.json',JSON.stringify(media,null,2)+'\n');
await writeFile('audit/agent-ops-portfolio-premium-v3/specimen-provenance.json',JSON.stringify(provenance,null,2)+'\n');
