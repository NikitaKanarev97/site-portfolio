import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
const publicRoot=path.resolve('public');
const catalogRoot='D:/Claude-projects/learn/storybook-static';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
http.createServer(async(req,res)=>{
  try {
    const uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const catalog=uri.startsWith('/storybook/');
    const root=catalog?catalogRoot:publicRoot;
    const rel=catalog?uri.slice(11):uri.slice(1);
    let file=path.resolve(root,rel);
    if(!file.startsWith(path.resolve(root)+path.sep) && file!==path.resolve(root)) throw Error('path');
    try { if((await stat(file)).isDirectory()) file=path.join(file,'index.html'); }
    catch { if(uri.startsWith('/prototypes/learn/')) file=path.join(publicRoot,'prototypes/learn/index.html'); else throw Error('missing'); }
    const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'application/octet-stream'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(4362,'127.0.0.1',()=>process.stdout.write('Learn read-only source preview: http://127.0.0.1:4362\n'));
