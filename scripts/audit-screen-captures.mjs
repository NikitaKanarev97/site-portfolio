/** Review every local raster referenced by the public EN/RU pages.
 * Contact sheets include full images and enlarged top/bottom edges.
 * This reads files only; screenshots are never retouched.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const routes=['','about',...['agent-ops-console','partner-portal','learn','vet-clinic','pawly'].map(s=>`work/${s}`)];
const files=new Map();
for(const locale of ['en','ru'])for(const route of routes){
  const key=[locale==='ru'?'ru':'',route].filter(Boolean).join('/');
  const html=await readFile(`dist/${key?key+'/':''}index.html`,'utf8');
  for(const match of html.matchAll(/(?:src|srcset|data-zoom-src|poster)="([^" ]+\.(?:webp|png|jpe?g))(?:[^\"]*)"/g)) {
    const src=match[1];if(!src.startsWith('/media/'))continue;
    const entry=files.get(src)??{src,routes:[]};
    if(!entry.routes.includes('/'+key+'/'))entry.routes.push('/'+key+'/');
    files.set(src,entry);
  }
}
const dir='tmp/capture-audit';await mkdir(dir,{recursive:true});
const entries=[...files.values()].sort((a,b)=>a.src.localeCompare(b.src));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const tileWidth=520,tileHeight=500,columns=3,batch=18;
for(let start=0;start<entries.length;start+=batch){
  const group=entries.slice(start,start+batch),layers=[];
  for(let i=0;i<group.length;i++){
    const entry=group[i],file='public'+entry.src,meta=await sharp(file).metadata();
    const x=(i%columns)*tileWidth,y=Math.floor(i/columns)*tileHeight;
    const label=`${start+i+1}. ${entry.src.replace('/media/','')}`;
    const svg=Buffer.from(`<svg width="520" height="500"><rect width="520" height="500" fill="white"/><text x="8" y="20" font-family="Arial" font-size="12">${escape(label)}</text><text x="8" y="440" font-family="Arial" font-size="12">TOP EDGE</text><text x="8" y="480" font-family="Arial" font-size="12">BOTTOM EDGE</text></svg>`);
    layers.push({input:svg,left:x,top:y});
    layers.push({input:await sharp(file).flatten({background:'#ffffff'}).resize(500,400,{fit:'inside'}).png().toBuffer(),left:x+8,top:y+28});
    const edgeHeight=Math.min(6,meta.height);
    for(const [top,offset]of [[0,444],[meta.height-edgeHeight,484]])layers.push({input:await sharp(file).extract({left:0,top,width:meta.width,height:edgeHeight}).flatten({background:'#ffffff'}).resize(500,12,{fit:'fill'}).png().toBuffer(),left:x+8,top:y+offset});
    entry.width=meta.width;entry.height=meta.height;
    const edge=await sharp(file).extract({left:0,top:0,width:meta.width,height:Math.min(4,meta.height)}).flatten({background:'#ffffff'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
    entry.topEdgeCoverage=[];
    for(let row=0;row<edge.info.height;row++) {
      let gray=0;
      for(let col=0;col<edge.info.width;col++) {
        const k=(row*edge.info.width+col)*edge.info.channels,rgb=[edge.data[k],edge.data[k+1],edge.data[k+2]];
        if(Math.max(...rgb)-Math.min(...rgb)<5&&Math.min(...rgb)<252&&Math.min(...rgb)>210) gray++;
      }
      entry.topEdgeCoverage.push(gray/edge.info.width);
    }
    entry.neutralEdgeCandidate=entry.topEdgeCoverage[0]>.95&&entry.topEdgeCoverage.at(-1)<.05;
  }
  await sharp({create:{width:columns*tileWidth,height:Math.ceil(group.length/columns)*tileHeight,channels:3,background:'#e5e5e5'}}).composite(layers).jpeg({quality:95}).toFile(`${dir}/sheet-${String(start/batch+1).padStart(2,'0')}.jpg`);
}
await writeFile(`${dir}/inventory.json`,JSON.stringify({routes:14,files:entries},null,2));
console.log(JSON.stringify({files:entries.length,sheets:Math.ceil(entries.length/batch),edgeCandidates:entries.filter(e=>e.neutralEdgeCandidate).map(e=>e.src)},null,2));
