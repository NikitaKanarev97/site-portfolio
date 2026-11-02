// Static server for a built dist: node serve.mjs <dir> <port>. Mirrors Astro's directory/index.html routing.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
const [dir, port] = [process.argv[2], Number(process.argv[3])]
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' }
createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  let file = join(dir, path)
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html') } catch { file = join(dir, '404.html'); res.statusCode = 404 }
  try { const body = await readFile(file); res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream'); res.end(body) }
  catch { res.statusCode = 404; res.end('not found') }
}).listen(port, '127.0.0.1', () => console.log(`serving ${dir} on ${port}`))
