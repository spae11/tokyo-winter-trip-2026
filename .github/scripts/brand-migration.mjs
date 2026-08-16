import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skipDirs=new Set(['.git','node_modules']);
const binaryExt=new Set(['.png','.jpg','.jpeg','.gif','.webp','.ico','.pdf','.zip','.gz','.woff','.woff2','.ttf','.otf','.mp4','.mov','.webm','.heic','.heif']);

function brandReplace(input){
  let s=input;
  s=s.replace(/Our Travel Hub/g,'Our Journey');
  s=s.replace(/OUR TRAVEL HUB/g,'OUR JOURNEY');
  s=s.replace(/our travel hub/g,'our journey');
  s=s.replace(/Travel Hub/g,'Our Journey');
  s=s.replace(/TRAVEL HUB/g,'OUR JOURNEY');
  s=s.replace(/travel hub/g,'our journey');
  s=s.replace(/travelHub/g,'travelJourney');
  s=s.replace(/TravelHub/g,'TravelJourney');
  s=s.replace(/travelhub/g,'traveljourney');
  s=s.replace(/(^|[^A-Za-z0-9])Hub(?=[A-Z0-9_:\-.])/gm,'$1Journey');
  s=s.replace(/(^|[^A-Za-z0-9])hub(?=[A-Z0-9_:\-.])/gm,'$1journey');
  s=s.replace(/(^|[^A-Za-z0-9])HUB(?=[A-Z0-9_:\-.])/gm,'$1JOURNEY');
  s=s.replace(/(^|[^A-Za-z0-9])Hub(?=$|[^A-Za-z0-9])/gm,'$1Journey');
  s=s.replace(/(^|[^A-Za-z0-9])hub(?=$|[^A-Za-z0-9])/gm,'$1journey');
  s=s.replace(/(^|[^A-Za-z0-9])HUB(?=$|[^A-Za-z0-9])/gm,'$1JOURNEY');
  return s;
}

const brandPattern=/(?:Our Travel Hub|Travel Hub|travelHub|TravelHub|travelhub|(^|[^A-Za-z0-9])(?:Hub|hub|HUB)(?=$|[^A-Za-z0-9]|[A-Z0-9_:\-.]))/m;

function listFiles(dir){
  const out=[];
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if(skipDirs.has(ent.name))continue;
    const full=path.join(dir,ent.name);
    if(ent.isDirectory())out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function isTextFile(file){
  if(binaryExt.has(path.extname(file).toLowerCase()))return false;
  const buf=fs.readFileSync(file);
  if(buf.includes(0))return false;
  return true;
}

let changed=0;
const files=listFiles(root);
for(const file of files){
  if(!isTextFile(file))continue;
  let text=fs.readFileSync(file,'utf8');
  const before=text;
  text=brandReplace(text);

  if(path.extname(file).toLowerCase()==='.html'){
    if(!text.includes('storage-migration-v1.js')){
      text=text.replace(/<head([^>]*)>/i,'<head$1>\n<script src="/tokyo-winter-trip-2026/storage-migration-v1.js?v=1"></script>');
    }
    text=text.replace(/manifest\.webmanifest\?v=\d+/g,'manifest.webmanifest?v=24');
    text=text.replace(/sw\.js\?v=\d+/g,'sw.js?v=24');
    text=text.replace(/apple-touch-icon([^"']*)\?v=\d+/g,'apple-touch-icon$1?v=24');
  }

  if(path.basename(file)==='manifest.webmanifest'){
    text=text.replace(/"name":"[^"]*"/,'"name":"Our Journey"');
    text=text.replace(/"short_name":"[^"]*"/,'"short_name":"Our Journey"');
    text=text.replace(/"start_url":"\/tokyo-winter-trip-2026\/\?pwa=\d+"/,'"start_url":"/tokyo-winter-trip-2026/?pwa=18"');
  }

  if(path.basename(file)==='sw.js'){
    const m=text.match(/const CACHE='travel-journey-v(\d+)'/);
    const next=m?Math.max(55,Number(m[1])+1):55;
    text=text.replace(/const CACHE='travel-journey-v\d+'/,`const CACHE='travel-journey-v${next}'`);
    text=text.replace(/\?v=\d+/g,`?v=${next}`);
    if(!text.includes("BASE+'storage-migration-v1.js'")){
      text=text.replace('const CORE=[BASE,',"const CORE=[BASE,BASE+'storage-migration-v1.js',");
    }
  }

  if(text!==before){fs.writeFileSync(file,text);changed++}
}

// Rename any project path that still uses the old brand as a standalone/camel token.
const allPaths=listFiles(root).sort((a,b)=>b.length-a.length);
for(const full of allPaths){
  const rel=path.relative(root,full);
  const nextRel=brandReplace(rel);
  if(nextRel!==rel){
    const dest=path.join(root,nextRel);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.renameSync(full,dest);
    changed++;
  }
}

const remaining=[];
for(const file of listFiles(root)){
  if(!isTextFile(file))continue;
  const text=fs.readFileSync(file,'utf8');
  if(brandPattern.test(text))remaining.push(path.relative(root,file));
}
if(remaining.length){
  console.error('Legacy brand tokens remain in:',remaining.join(', '));
  process.exit(2);
}

console.log(`Journey migration updated ${changed} files/paths.`);
