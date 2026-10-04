import{readFileSync,writeFileSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash}from'node:crypto';
const git=(args,opts={})=>execFileSync('git',args,{maxBuffer:512*1024*1024,...opts});
const ref=git(['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const previous=JSON.parse(readFileSync('tasks/portfolio-rebuild/integration/focus-common-base-manifest.json'));
const inputs=JSON.parse(readFileSync('tasks/portfolio-rebuild/integration/final/inputs.json'));
const code=JSON.parse(readFileSync('tasks/portfolio-rebuild/integration/final/code-files.json'));
const paths=[...new Set([...previous.files.map(x=>x.path),...inputs.cases.flatMap(x=>x.paths),...code])].sort();
const tree=new Map(git(['ls-tree','-r','--long',ref],{encoding:'utf8'}).trim().split('\n').map(line=>{const[m,path]=line.split('\t'),[mode,type,blob,size]=m.trim().split(/\s+/);return[path,{mode,type,blob,bytes:+size}]}));
const files=[];
for(let i=0;i<paths.length;i+=50){const selected=paths.slice(i,i+50),items=selected.map(path=>{const item=tree.get(path);if(!item||item.type!=='blob')throw Error('Missing committed canonical path '+path);return{path,...item}});const buffer=git(['cat-file','--batch'],{input:items.map(x=>x.blob).join('\n')+'\n'});let offset=0;for(const item of items){const end=buffer.indexOf(10,offset);const header=buffer.subarray(offset,end).toString().split(' ');if(header[0]!==item.blob||+header[2]!==item.bytes)throw Error('Unexpected blob header '+item.path);offset=end+1;const bytes=buffer.subarray(offset,offset+item.bytes);files.push({path:item.path,gitBlob:item.blob,bytes:item.bytes,sha256:createHash('sha256').update(bytes).digest('hex')});offset+=item.bytes+1;}}
writeFileSync('tasks/portfolio-rebuild/integration/final/code-manifest.json',JSON.stringify({ref,previous:previous.ref,canonicalBytes:'Exact Git blobs; LF normalization for text, binaries unchanged',coverage:'Frozen common canonical paths plus all exact accepted D/E/F payloads and the G-final code whitelist',files,totalBytes:files.reduce((n,x)=>n+x.bytes,0)},null,2));
console.log(JSON.stringify({ref,files:files.length,bytes:files.reduce((n,x)=>n+x.bytes,0)}));
