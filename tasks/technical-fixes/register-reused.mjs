import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const records=JSON.parse(await readFile('tasks/technical-fixes/captures.json','utf8'));
records.forEach(r=>{if(r.source.startsWith('http'))r.viewport={width:r.file.includes('trust')||r.file.includes('progress')?320:r.file.includes('mobile')?390:1440,height:r.file.includes('trust')||r.file.includes('progress')?1000:1600};});
async function add(file,source,extra){
 const bytes=await readFile(file),meta=await sharp(bytes).metadata();
 const record={file,source,width:meta.width,height:meta.height,reused:true,sha256:createHash('sha256').update(bytes).digest('hex'),...extra};
 const i=records.findIndex(r=>r.file===file);if(i<0)records.push(record);else records[i]=record;
}
for(const locale of ['en','ru'])for(const [name,original] of [['address-input','address-input'],['verification-details','clip-verification-poster']]){
 await add(`public/media/rebuild/pawly/${locale}/${name}.webp`,`public/media/case-pawly${locale==='ru'?'-ru':''}/${original}.webp`,{id:`${locale}-${name}`,locale,selection:'Complete native screen reused without pixel changes.'});
}
await add('public/media/rebuild/learn/archive-catalog.webp','D:/Claude-projects/Site-portfolio/public/media/rebuild/learn/archive-catalog.webp',{id:'archive-catalog',selection:'Existing corrected native archive catalog, ending after the first complete card row.'});
await writeFile('tasks/technical-fixes/captures.json',JSON.stringify(records,null,2));
const file='tasks/portfolio-rebuild/learn/captures.json';
const previous=JSON.parse(await readFile(file,'utf8'));
await writeFile(file,JSON.stringify(previous.map(r=>{const replacement=records.find(n=>n.file===r.file);return replacement?{...r,...replacement}:r;}),null,2));
