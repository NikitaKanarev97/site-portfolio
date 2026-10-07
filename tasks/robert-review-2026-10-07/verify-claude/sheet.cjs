const sharp=require('D:/Claude-projects/Site-portfolio/node_modules/sharp');
const [,,outName,width,...files]=process.argv;const W=+width;
(async()=>{const parts=[];let y=0;for(const f of files){const b=await sharp('crops/'+f+'.jpg').resize({width:W,withoutEnlargement:true}).toBuffer({resolveWithObject:true});parts.push({input:b.data,top:y,left:0});y+=b.info.height+16;}
await sharp({create:{width:W,height:y,channels:3,background:'#ff00ff'}}).composite(parts).jpeg({quality:72}).toFile('sheets/'+outName+'.jpg');console.log(outName,W,y)})();
