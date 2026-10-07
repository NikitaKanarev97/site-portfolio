import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.argv[2] ?? 'tasks/robert-review-2026-10-07/reports/07-build/dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf','.mp4':'video/mp4','.webm':'video/webm'};
http.createServer(async (req,res)=>{
  try {
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1:4407').pathname));
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');
    res.setHeader('Cache-Control','no-store');res.end(await readFile(file));
  }catch{res.writeHead(404).end('Not found');}
}).listen(4407,'127.0.0.1',()=>console.log(`Content preview http://127.0.0.1:4407/ from ${root}`));
