// Rebuild derived assets and review boards from the editable v4 SVG.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../../', import.meta.url);
const out = new URL('./', import.meta.url);
const css = (await readFile(new URL('ds/tokens.css', root), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
const declarations = new Map([...css.matchAll(/--([\w-]+)\s*:\s*([^;{}]+);/g)].map(m => [m[1], m[2].trim()]));
function token(name) {
  let value = declarations.get(name);
  for (let i=0; i<8; i++) {
    const ref = value?.match(/^var\(--([\w-]+)\)$/);
    if (!ref) { if (!value) throw new Error(`Missing token ${name}`); return value; }
    value = declarations.get(ref[1]);
  }
  throw new Error(`Circular token ${name}`);
}
const ink=token('text-default'), paper=token('surface-subtle'), white=token('text-on-inverse'), muted=token('text-muted');
const current = await readFile(new URL('Images/logo-portfolio-v4.svg', root), 'utf8');
const previous = await readFile(new URL('Images/logo-portfolio-v3-mono.svg', root), 'utf8');
const body = current.match(/<g[\s\S]*<\/g>/)[0];
const oldBody = previous.match(/<g[\s\S]*<\/g>/)[0];
const compactBody = body.replace('translate(77 0)', 'translate(80 0)');
const compact = current.replace('162 101.5','165 101.5').replace('width="162"','width="165"').replace(body,compactBody);
await writeFile(new URL('Images/logo-portfolio-v4-compact.svg',root), compact);
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" role="img" aria-label="Nikita Kanarev"><rect width="32" height="32" rx="7" fill="${ink}"/><svg x="2" y="7.388" width="28" height="17.224" viewBox="0 -0.75 165 101.5" color="${paper}">${compactBody}</svg></svg>`;
await writeFile(new URL('Images/favicon-v4.svg',root),icon+'\n');
for (const size of [16,32,48]) {
  await sharp(Buffer.from(icon)).resize(size,size).png().toFile(fileURLToPath(new URL(`Images/favicon-v4-${size}.png`,root)));
}
for (const [name,color] of [['ink',ink],['white',white]]) {
  const fixed = current.replace('<g fill="currentColor">',`<g fill="${color}">`);
  await writeFile(new URL(`logo-${name}.svg`,out),fixed);
  await sharp(Buffer.from(fixed)).resize({width:1620}).png().toFile(fileURLToPath(new URL(`logo-${name}.png`,out)));
}
const logo = (content,viewbox,x,y,h,color) => `<svg x="${x}" y="${y}" width="${162*h/101.5}" height="${h}" viewBox="${viewbox}" color="${color}">${content}</svg>`;
const text = (x,y,label,size=14,color=muted) => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}">${label}</text>`;
const beforeAfter = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="330"><rect width="960" height="330" fill="${paper}"/>${text(48,44,'Было · v3')}${text(508,44,'Стало · v4')}${logo(oldBody,'0 0 162 100',48,76,180,ink)}${logo(body,'0 -0.75 162 101.5',508,76,180,ink)}</svg>`;
await writeFile(new URL('before-after.svg',out),beforeAfter);
await sharp(Buffer.from(beforeAfter)).png().toFile(fileURLToPath(new URL('before-after.png',out)));
const rows=[16,24,40,64].map((h,i)=>`${text(48,427+i*84,`${h} px`)}${logo(body,'0 -0.75 162 101.5',146,409+i*84,h,ink)}${logo(body,'0 -0.75 162 101.5',550,409+i*84,h,white)}`).join('');
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="800"><rect width="960" height="800" fill="${paper}"/><rect x="480" width="480" height="800" fill="${ink}"/>${text(48,48,'NK · Nikita Kanarev',18)}${text(528,48,'Инверсное применение',18,paper)}${logo(body,'0 -0.75 162 101.5',48,108,186,ink)}${logo(body,'0 -0.75 162 101.5',528,108,186,white)}${text(48,376,'Проверка масштаба')}${text(528,376,'Проверка масштаба',14,paper)}${rows}${text(48,771,'Favicon · 16 / 32 / 48 px')}${[16,32,48].map((s,i)=>`<svg x="${320+i*66}" y="728" width="${s}" height="${s}" viewBox="0 0 32 32">${icon.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>`).join('')}</svg>`;
await writeFile(new URL('review-sheet.svg',out),sheet);
await sharp(Buffer.from(sheet)).png().toFile(fileURLToPath(new URL('review-sheet.png',out)));
async function area(path,viewbox) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1620" height="1015" viewBox="${viewbox}">${path}</svg>`;
  const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let sum=0; for(let i=info.channels-1;i<data.length;i+=info.channels)sum+=data[i]/255;
  return sum/100;
}
const metrics={};
for (const [version,content,viewbox] of [['v3',oldBody,'0 -0.75 162 101.5'],['v4',body,'0 -0.75 162 101.5']]) {
  const paths=[...content.matchAll(/<path[^>]*\/>/g)].map(m=>m[0]);
  const [n,k]=await Promise.all(paths.map(p=>area(p,viewbox)));
  metrics[version]={nArea:+n.toFixed(2),kArea:+k.toFixed(2),nToK:+(n/k).toFixed(4)};
}
await writeFile(new URL('geometry.json',out),JSON.stringify(metrics,null,2)+'\n');
console.log(JSON.stringify(metrics));
