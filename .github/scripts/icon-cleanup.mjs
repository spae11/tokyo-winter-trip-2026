import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skipDirs=new Set(['.git','node_modules','.github']);
const binaryExt=new Set(['.png','.jpg','.jpeg','.gif','.webp','.ico','.pdf','.zip','.gz','.woff','.woff2','.ttf','.otf','.mp4','.mov','.webm','.heic','.heif']);
const VERSION='26';
const ICON180='/tokyo-winter-trip-2026/our-journey-icon-180-v2.png';
const ICON192='/tokyo-winter-trip-2026/our-journey-icon-192-v2.png';
const ICON512='/tokyo-winter-trip-2026/our-journey-icon-512-v2.png';

const oldIconFiles=[
  'apple-touch-icon.png','apple-touch-icon-180x180.png','apple-touch-icon-precomposed.png','apple-touch-icon-v18.png',
  'earth-emoji-v13.svg','earth-icon-v14.svg','globe-192-v2.png','globe-512-v2.png',
  'globe-install-192-v7.png','globe-install-512-v7.png','icon-192.png','icon-512.png',
  'page-globe-v6.svg','travel-globe-192-v3.png','travel-globe-512-v3.png','travel-globe-v6.svg'
];

const replacements=new Map([
  ['apple-touch-icon.png','our-journey-icon-180-v2.png'],
  ['apple-touch-icon-180x180.png','our-journey-icon-180-v2.png'],
  ['apple-touch-icon-precomposed.png','our-journey-icon-180-v2.png'],
  ['apple-touch-icon-v18.png','our-journey-icon-180-v2.png'],
  ['earth-emoji-v13.svg','our-journey-icon-192-v2.png'],
  ['earth-icon-v14.svg','our-journey-icon-192-v2.png'],
  ['globe-192-v2.png','our-journey-icon-192-v2.png'],
  ['globe-512-v2.png','our-journey-icon-512-v2.png'],
  ['globe-install-192-v7.png','our-journey-icon-192-v2.png'],
  ['globe-install-512-v7.png','our-journey-icon-512-v2.png'],
  ['icon-192.png','our-journey-icon-192-v2.png'],
  ['icon-512.png','our-journey-icon-512-v2.png'],
  ['page-globe-v6.svg','our-journey-icon-192-v2.png'],
  ['travel-globe-192-v3.png','our-journey-icon-192-v2.png'],
  ['travel-globe-512-v3.png','our-journey-icon-512-v2.png'],
  ['travel-globe-v6.svg','our-journey-icon-192-v2.png']
]);

function listFiles(dir){
  const out=[];
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if(skipDirs.has(ent.name))continue;
    const full=path.join(dir,ent.name);
    if(ent.isDirectory())out.push(...listFiles(full)); else out.push(full);
  }
  return out;
}
function isTextFile(file){
  if(binaryExt.has(path.extname(file).toLowerCase()))return false;
  const buf=fs.readFileSync(file);
  return !buf.includes(0);
}
function normalizeHtml(text){
  text=text.replace(/<meta name="apple-mobile-web-app-title" content="[^"]*">/gi,'<meta name="apple-mobile-web-app-title" content="Our Journey">');
  text=text.replace(/<title>Our Travel Hub<\/title>/gi,'<title>Our Journey</title>');
  text=text.replace(/<title>Travel Hub<\/title>/gi,'<title>Our Journey</title>');
  text=text.replace(/<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed|icon)["'][^>]*>\s*/gi,'');
  const tags=`<link rel="icon" type="image/png" sizes="192x192" href="${ICON192}?v=${VERSION}">\n<link rel="apple-touch-icon" sizes="180x180" href="${ICON180}?v=${VERSION}">\n<link rel="apple-touch-icon-precomposed" sizes="180x180" href="${ICON180}?v=${VERSION}">\n`;
  text=text.replace(/<\/head>/i,tags+'</head>');
  text=text.replace(/manifest\.webmanifest\?v=\d+/g,`manifest.webmanifest?v=${VERSION}`);
  text=text.replace(/sw\.js\?v=\d+/g,`sw.js?v=${VERSION}`);
  return text;
}

let changed=0;
for(const file of listFiles(root)){
  if(!isTextFile(file))continue;
  let text=fs.readFileSync(file,'utf8');
  const before=text;
  text=text.replace(/Our Travel Hub/g,'Our Journey').replace(/Travel Hub/g,'Our Journey');
  for(const [from,to] of replacements)text=text.split(from).join(to);
  if(path.extname(file).toLowerCase()==='.html')text=normalizeHtml(text);
  if(text!==before){fs.writeFileSync(file,text);changed++}
}

const manifestPath=path.join(root,'manifest.webmanifest');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.name='Our Journey';
manifest.short_name='Our Journey';
manifest.description='Shared travel plans and memories for us';
manifest.start_url='/tokyo-winter-trip-2026/?pwa=19';
manifest.icons=[
  {src:ICON180,sizes:'180x180',type:'image/png',purpose:'any'},
  {src:ICON192,sizes:'192x192',type:'image/png',purpose:'any'},
  {src:ICON512,sizes:'512x512',type:'image/png',purpose:'any'}
];
fs.writeFileSync(manifestPath,JSON.stringify(manifest));

const swPath=path.join(root,'sw.js');
let sw=fs.readFileSync(swPath,'utf8');
sw=sw.replace(/^const CACHE='[^']+';/m,"const CACHE='our-journey-v56';");
sw=sw.replace(/const CORE=\[BASE,BASE\+'index\.html',BASE\+'manifest\.webmanifest',[\s\S]*?BASE\+'photo-delete-everywhere-v1\.js'/,
  "const CORE=[BASE,BASE+'index.html',BASE+'manifest.webmanifest',BASE+'our-journey-icon-180-v2.png',BASE+'our-journey-icon-192-v2.png',BASE+'our-journey-icon-512-v2.png',BASE+'photo-delete-everywhere-v1.js'");
sw=sw.replace(/<link rel="apple-touch-icon"[^>]*>/g,`<link rel="apple-touch-icon" sizes="180x180" href="${ICON180}?v=${VERSION}">`);
sw=sw.replace(/<link rel="apple-touch-icon-precomposed"[^>]*>/g,`<link rel="apple-touch-icon-precomposed" sizes="180x180" href="${ICON180}?v=${VERSION}">`);
sw=sw.replace(/\?v=\d+/g,`?v=56`);
fs.writeFileSync(swPath,sw);

for(const name of oldIconFiles){
  const p=path.join(root,name);
  if(fs.existsSync(p))fs.rmSync(p);
}

console.log(`Updated ${changed} text files and removed ${oldIconFiles.length} legacy icon paths.`);
