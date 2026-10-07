import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const dir = new URL('../evidence/followup/', import.meta.url);
const files = ['local-en-1440-hero.png','local-ru-1440-hero.png','local-en-360-hero.png','local-ru-360-hero.png', 'local-en-1440-portal.png', 'local-en-1440-pawly.png'];
const buffers = await Promise.all(files.map(name => sharp(fileURLToPath(new URL(name, dir))).resize({width:480,height:620,fit:'contain',background:'#eeeeee'}).png().toBuffer()));
await sharp({create:{width:1440,height:1240,channels:3,background:'#eeeeee'}}).composite(buffers.map((input,i)=>({input,left:(i%3)*480,top:Math.floor(i/3)*620}))).png().toFile(fileURLToPath(new URL('review-sheet.png',dir)));
