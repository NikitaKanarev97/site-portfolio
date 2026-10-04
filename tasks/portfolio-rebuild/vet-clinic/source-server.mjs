import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
const root='D:/Claude-projects/Veterinary-clinic/dist';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
http.createServer(async(req,res)=>{try{
 const uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=path.resolve(root,'.'+uri);
 if(!file.startsWith(path.resolve(root)+path.sep)&&file!==path.resolve(root))throw Error('path');
 try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');}catch{file=path.join(root,'index.html');}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'application/octet-stream'});res.end(await readFile(file));
}catch{res.writeHead(404);res.end('Not found');}}).listen(5261,'127.0.0.1',()=>console.log('Read-only Vet source http://127.0.0.1:5261'));
