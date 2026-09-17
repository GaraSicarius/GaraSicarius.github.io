import fs from 'node:fs';
import path from 'node:path';
import {readProfile} from './profile.mjs';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const assets={};
function collect(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name.startsWith('.')||entry.name==='server'||entry.name==='chatbot.js')continue;const name=prefix+'/'+entry.name,file=path.join(dir,entry.name);if(entry.isDirectory())collect(file,name);else if(types[path.extname(file)])assets[name]={body:fs.readFileSync(file).toString('base64'),type:types[path.extname(file)]};}}
collect('dist');
const handler=fs.readFileSync('chat-handler.mjs','utf8').replace('export function createChatHandler','function createChatHandler');
const source=handler+'\nconst handleChat=createChatHandler('+JSON.stringify(readProfile())+');\nconst assets='+JSON.stringify(assets)+';\nexport default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==="/api/chat"||url.pathname==="/api/chat/status")return handleChat(request,env);if(!["GET","HEAD"].includes(request.method))return new Response("Method not allowed",{status:405});const asset=assets[url.pathname==="/"?"/index.html":url.pathname];if(!asset)return new Response("Not found",{status:404});return new Response(request.method==="HEAD"?null:Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)),{headers:{"Content-Type":asset.type,"Cache-Control":"no-cache","X-Content-Type-Options":"nosniff"}});}};\n';
fs.mkdirSync('dist/server',{recursive:true});fs.writeFileSync('dist/server/index.js',source);
fs.mkdirSync('dist/.openai',{recursive:true});fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built Worker with Gemini endpoint and '+Object.keys(assets).length+' public assets. No secret values included.');
