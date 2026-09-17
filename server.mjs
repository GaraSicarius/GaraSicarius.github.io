import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {Readable} from 'node:stream';
import {createChatHandler} from './chat-handler.mjs';
import {readProfile} from './profile.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const publicRoot=path.join(root,'dist');
const handler=createChatHandler(readProfile());
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1:8765');
    if(url.pathname==='/api/chat'||url.pathname==='/api/chat/status'){
      let local={};try{local=parseEnv(fs.readFileSync(path.join(root,'.env'),'utf8'));}catch{}
      const request=new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Readable.toWeb(req),duplex:'half'})});
      const result=await handler(request,{...process.env,...local});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));return;
    }
    const name=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
    const file=path.resolve(publicRoot,'.'+name);
    const relative=path.relative(publicRoot,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)||relative.split(/[\\/]/).some(p=>p.startsWith('.')||p==='server')||!types[path.extname(file)]||!['GET','HEAD'].includes(req.method)){res.writeHead(404);res.end('Not found');return;}
    const content=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:content);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(8765,'127.0.0.1',()=>console.log('Portfolio ready at http://127.0.0.1:8765'));
