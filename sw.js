const CACHE='travel-hub-v16';
const BASE='/tokyo-winter-trip-2026/';
const CORE=[BASE,BASE+'index.html',BASE+'manifest.webmanifest',BASE+'earth-icon-v14.svg'];

const PLAN_HEAD=`
<style id="hub-plan-motion">
.gate{display:none!important}
html.hub-plan-loading body{opacity:0;transform:translateY(14px) scale(.995);filter:blur(2px)}
html.hub-plan-ready body{opacity:1;transform:none;filter:none}
body{transition:opacity .58s ease,transform .58s cubic-bezier(.22,1,.36,1),filter .58s ease}
.day.open .body{animation:hubDayFadeIn .42s cubic-bezier(.22,1,.36,1) both}
.day.open .dayhero{animation:hubImageFadeIn .5s ease both}
@keyframes hubDayFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes hubImageFadeIn{from{opacity:.35;transform:scale(.992)}to{opacity:1;transform:scale(1)}}
@media(prefers-reduced-motion:reduce){body{transition:none!important}.day.open .body,.day.open .dayhero{animation:none!important}}
</style>
<script>document.documentElement.classList.add('hub-plan-loading');<\/script>`;

const PLAN_END=`
<script id="hub-plan-motion-script">
(()=>{
  sessionStorage.setItem('hubUnlocked','1');
  sessionStorage.setItem('unlock','1');
  document.querySelectorAll('#gate,.gate').forEach(el=>el.remove());
  const show=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.documentElement.classList.remove('hub-plan-loading');
    document.documentElement.classList.add('hub-plan-ready');
  }));
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',show,{once:true}); else show();
})();
<\/script>`;

const ROOT_HEAD=`
<style id="hub-root-motion-extra">
html.hub-trip-leave body{opacity:0!important;transform:translateY(7px)!important;filter:blur(2px)!important;transition:opacity .24s ease,transform .24s ease,filter .24s ease!important}
@media(prefers-reduced-motion:reduce){html.hub-trip-leave body{transition:none!important}}
</style>`;

const ROOT_END=`
<script id="hub-install-state-script">
(()=>{
  const installCard=document.querySelector('.install-card');
  const installTop=document.getElementById('installTop');
  const installBtn=document.getElementById('installBtn');
  const markInstalled=()=>{
    try{localStorage.setItem('travelHubInstalled','1')}catch(e){}
    if(installCard){installCard.hidden=true;installCard.style.display='none'}
    if(installTop)installTop.hidden=true;
    if(installBtn)installBtn.hidden=true;
  };
  let remembered=false;
  try{remembered=localStorage.getItem('travelHubInstalled')==='1'}catch(e){}
  const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  if(standalone||remembered)markInstalled();
  window.addEventListener('appinstalled',markInstalled);
  document.querySelectorAll('a[href="./tokyo/"],a[href="./hongkong/"]').forEach(a=>a.addEventListener('click',e=>{
    if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();
    document.documentElement.classList.add('hub-trip-leave');
    setTimeout(()=>location.href=a.href,220);
  }));
})();
<\/script>`;

function injectHtml(text,url){
  const isPlan=url.pathname.startsWith(BASE+'tokyo/')||url.pathname.startsWith(BASE+'hongkong/');
  const isRoot=url.pathname===BASE||url.pathname===BASE+'index.html';
  if(isPlan){
    text=text.replace(/<\/head>/i,PLAN_HEAD+'</head>');
    text=text.replace(/<\/body>/i,PLAN_END+'</body>');
  }else if(isRoot){
    text=text.replace(/<\/head>/i,ROOT_HEAD+'</head>');
    text=text.replace(/<\/body>/i,ROOT_END+'</body>');
  }
  return text;
}

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});

self.addEventListener('activate',e=>e.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
  self.clients.claim()
])));

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(e.request.mode==='navigate'&&url.origin===self.location.origin&&url.pathname.startsWith(BASE)){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
      const text=injectHtml(await r.text(),url);
      const headers=new Headers(r.headers);
      headers.set('Content-Type','text/html; charset=utf-8');
      headers.set('Cache-Control','no-store');
      return new Response(text,{status:r.status,statusText:r.statusText,headers});
    }).catch(()=>caches.match(BASE+'index.html')));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    const copy=r.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match(BASE+'index.html'))));
});