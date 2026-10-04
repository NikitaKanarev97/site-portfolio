from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
ROOT=Path('D:/Claude-projects/Site-portfolio/research/portfolio-benchmark')
PAGE='''<!doctype html><html lang="en"><meta charset="utf-8"><title>H saved motion references</title><style>body{margin:24px;font:16px system-ui;background:#eee;color:#111}nav{display:flex;flex-wrap:wrap;gap:8px}button,a{font:inherit;padding:12px}video{display:block;width:100%;max-height:75vh;background:#111;margin-top:24px}</style><h1>Saved references — review only</h1><nav><button data-src="/ha-src/rec-case/case.webm">HA Atlant Telecom</button><button data-src="/blinkov-rec/home.webm">Anton Blinkov</button><button data-src="/motion-rec/dounar/rec.webm">Ilya Dounar</button><button data-src="/motion-rec/garri/rec.webm">Garri</button><button data-src="/motion-rec/tubik/rec.webm">Tubik</button><a href="/case-blueprint/case-blueprint.html">Case blueprint</a></nav><p id="label">Choose an archived recording</p><nav><button data-time="0">Start</button><button data-time="15">15 seconds</button><button data-time="30">30 seconds</button><button data-time="45">45 seconds</button><button data-time="60">60 seconds</button></nav><video controls playsinline preload="metadata"></video><script>const v=document.querySelector('video');for(const b of document.querySelectorAll('[data-src]'))b.onclick=()=>{v.src=b.dataset.src;document.querySelector('#label').textContent=b.textContent;v.play()};for(const b of document.querySelectorAll('[data-time]'))b.onclick=()=>{v.currentTime=Number(b.dataset.time);v.play()};</script></html>'''.encode('utf-8')
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
 def do_GET(self):
  if self.path=='/':
   self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(PAGE)));self.end_headers();self.wfile.write(PAGE)
  elif Path(self.translate_path(self.path)).is_file():
   path=Path(self.translate_path(self.path));size=path.stat().st_size;start=0;end=size-1
   hit=re.match(r'bytes=(\d+)-(\d*)',self.headers.get('Range',''))
   if hit:start=int(hit.group(1));end=min(end,int(hit.group(2))) if hit.group(2) else end
   self.send_response(206 if hit else 200);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Accept-Ranges','bytes');self.send_header('Content-Length',str(end-start+1))
   if hit:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
   self.end_headers()
   try:
    with path.open('rb') as stream:
     stream.seek(start);remaining=end-start+1
     while remaining>0:
      chunk=stream.read(min(1024*1024,remaining))
      if not chunk:break
      self.wfile.write(chunk);remaining-=len(chunk)
   except (BrokenPipeError,ConnectionResetError):pass
  else:super().do_GET()
ThreadingHTTPServer(('127.0.0.1',4395),Handler).serve_forever()
