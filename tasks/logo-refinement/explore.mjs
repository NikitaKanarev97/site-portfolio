import { mkdir, writeFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';

const variants = [{"label":"A","n":{"p":[[0,0],[18,0],[55,65.45413597180931],[55,0],[73,0],[73,100],[55,100],[18,34.54586402819069],[18,100],[0,100]],"v":34.54586402819069},"k":[[0,0],[20,0],[20,43],[57,0],[81,0],[39,48],[84,100],[59,100],[26.5,62],[20,69.6],[20,100],[0,100]]},{"label":"B","n":{"p":[[0,0],[19,0],[55,64.21402845512678],[55,0],[74,0],[74,100],[55,100],[19,35.78597154487322],[19,100],[0,100]],"v":35.78597154487322},"k":[[0,0],[20,0],[20,42],[57,0],[81,0],[39,48],[82,100],[57,100],[26.5,62],[20,69.6],[20,100],[0,100]]},{"label":"C","n":{"p":[[0,0],[19,0],[55,63.501789999074674],[55,0],[74,0],[74,100],[55,100],[19,36.498210000925326],[19,100],[0,100]],"v":36.498210000925326},"k":[[0,0],[21,0],[21,42],[58,0],[82,0],[40,48],[83,100],[58,100],[27.5,62],[21,69.6],[21,100],[0,100]]},{"label":"D","n":{"p":[[0,0],[18,0],[50,63.38721527751106],[50,0],[68,0],[68,100],[50,100],[18,36.61278472248894],[18,100],[0,100]],"v":36.61278472248894},"k":[[0,0],[21,0],[21,44],[58,0],[84,0],[41,49],[85,100],[58,100],[28,63],[21,71],[21,100],[0,100]]},{"label":"E","n":{"p":[[0,0],[18,0],[52,63.83673069854426],[52,0],[70,0],[70,100],[52,100],[18,36.16326930145574],[18,100],[0,100]],"v":36.16326930145574},"k":[[0,0],[21,0],[21,44],[58,0],[84,0],[41,49],[85,100],[58,100],[28,63],[21,71],[21,100],[0,100]]},{"label":"F","n":{"p":[[0,0],[18,0],[50,62.63434594547088],[50,0],[68,0],[68,100],[50,100],[18,37.36565405452912],[18,100],[0,100]],"v":37.36565405452912},"k":[[0,0],[21,0],[21,44],[58,0],[83,0],[40,49],[84,100],[58,100],[28,63],[21,71],[21,100],[0,100]]}];
const dir = new URL('./', import.meta.url);
await mkdir(dir, { recursive: true });
const path = points => 'M' + points.map(p => p.map(n => Number(n.toFixed(3))).join(' ')).join('L') + 'Z';
const old = await readFile(new URL('../../Images/logo-portfolio-v3-mono.svg', import.meta.url), 'utf8');
const oldBody = old.match(/<g[\s\S]*<\/g>/)[0];
const entries = [{label:'CURRENT',width:162,body:oldBody},...variants.map(v=>({
  label:v.label,width:v.n.p[4][0]+9+Math.max(...v.k.map(p=>p[0])),
  body:`<g fill="currentColor"><path d="${path(v.n.p)}"/><path transform="translate(${v.n.p[4][0]+9} 0)" d="${path(v.k)}"/></g>`
}))];
const cells = entries.map((v,i)=>{
  const x = i%3*400, y = Math.floor(i/3)*280;
  return `<g transform="translate(${x} ${y})"><text x="32" y="34" font-family="Arial" font-size="14" fill="#6E6E67">${v.label}</text><svg x="32" y="60" width="${v.width*1.15}" height="115" viewBox="0 0 ${v.width} 100" color="#1B1B18">${v.body}</svg>${[16,24,40].map((s,j)=>`<svg x="${32+j*110}" y="218" width="${v.width*s/100}" height="${s}" viewBox="0 0 ${v.width} 100" color="#1B1B18">${v.body}</svg>`).join('')}</g>`
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840"><rect width="1200" height="840" fill="#FAF9F6"/>${cells.join('')}</svg>`;
await writeFile(new URL('exploration.svg',dir),svg);
await sharp(Buffer.from(svg)).png().toFile(new URL('exploration.png',dir).pathname.replace(/^\/D:/,'D:'));
console.log('Written tasks/logo-refinement/exploration.png');
