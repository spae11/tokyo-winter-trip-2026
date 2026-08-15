const CACHE='travel-hub-v17';
const BASE='/tokyo-winter-trip-2026/';
const CORE=[BASE,BASE+'index.html',BASE+'manifest.webmanifest',BASE+'earth-icon-v14.svg'];

const PLAN_HEAD=`
<style id="hub-plan-motion">
.gate{display:none!important}
html.hub-plan-loading body{opacity:0;transform:translateY(14px) scale(.995);filter:blur(2px)}
html.hub-plan-ready body{opacity:1;transform:none;filter:none}
body{transition:opacity .58s ease,transform .58s cubic-bezier(.22,1,.36,1),filter .58s ease}
.day .body{display:block!important;height:0;overflow:hidden;opacity:0;transform:translateY(-10px);padding:0 16px!important;visibility:hidden;pointer-events:none;transition:height .52s cubic-bezier(.22,1,.36,1),opacity .34s ease,transform .42s cubic-bezier(.22,1,.36,1),padding-bottom .42s ease,visibility 0s linear .52s;will-change:height,opacity,transform}
.day.open .body{opacity:1;transform:translateY(0);padding-bottom:20px!important;visibility:visible;pointer-events:auto;transition:height .52s cubic-bezier(.22,1,.36,1),opacity .34s .04s ease,transform .42s cubic-bezier(.22,1,.36,1),padding-bottom .42s ease,visibility 0s}
.day .dayhero{opacity:.72;transform:scale(.994);transition:opacity .42s ease,transform .5s cubic-bezier(.22,1,.36,1)}
.day.open .dayhero{opacity:1;transform:scale(1)}
.daybtn>*:last-child{transition:transform .36s cubic-bezier(.22,1,.36,1)}
.day.open .daybtn>*:last-child{transform:rotate(180deg)}
@media(prefers-reduced-motion:reduce){body,.day .body,.day .dayhero,.daybtn>*:last-child{transition:none!important;transform:none!important}}
</style>
<script>document.documentElement.classList.add('hub-plan-loading');<\/script>`;

const PLAN_END=`
<script id="hub-plan-motion-script">
(()=>{
  sessionStorage.setItem('hubUnlocked','1');
  sessionStorage.setItem('unlock','1');
  document.querySelectorAll('#gate,.gate').forEach(el=>el.remove());

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setClosed=(day,animate=true)=>{
    const body=day.querySelector('.body');if(!body)return;
    const h=body.getBoundingClientRect().height||body.scrollHeight;
    if(!animate||reduce){body.style.height='0px';body.style.opacity='0';body.style.transform='translateY(-10px)';return}
    body.style.height=h+'px';body.style.opacity='1';body.style.transform='translateY(0)';
    body.offsetHeight;
    requestAnimationFrame(()=>{body.style.height='0px';body.style.opacity='0';body.style.transform='translateY(-10px)'});
  };
  const setOpen=(day,animate=true)=>{
    const body=day.querySelector('.body');if(!body)return;
    body.style.visibility='visible';body.style.pointerEvents='auto';
    if(!animate||reduce){body.style.height='auto';body.style.opacity='1';body.style.transform='translateY(0)';return}
    body.style.height='0px';body.style.opacity='0';body.style.transform='translateY(-10px)';
    body.offsetHeight;
    const target=body.scrollHeight;
    requestAnimationFrame(()=>{body.style.height=target+'px';body.style.opacity='1';body.style.transform='translateY(0)'});
    const done=e=>{if(e.propertyName==='height'&&day.classList.contains('open')){body.style.height='auto';body.removeEventListener('transitionend',done)}};
    body.addEventListener('transitionend',done);
  };
  const initDays=()=>{
    document.querySelectorAll('.day').forEach(day=>{
      const body=day.querySelector('.body');if(!body)return;
      if(day.classList.contains('open'))setOpen(day,false);else setClosed(day,false);
      new MutationObserver(muts=>{for(const m of muts){if(m.attributeName==='class'){day.classList.contains('open')?setOpen(day,true):setClosed(day,true);break}}}).observe(day,{attributes:true,attributeFilter:['class']});
    });
  };
  const boot=()=>{
    initDays();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      document.documentElement.classList.remove('hub-plan-loading');
      document.documentElement.classList.add('hub-plan-ready');
    }));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
<\/script>`;

const ROOT_HEAD=`
<style id="hub-root-motion-extra">
html.hub-trip-leave body{opacity:0!important;transform:translateY(7px)!important;filter:blur(2px)!important;transition:opacity .24s ease,transform .24s ease,filter .24s ease!important}
@media(prefers-reduced-motion:reduce){html.hub-trip-leave body{transition:none!important}}
</style>`;

const ROOT_END=`
<script id="hub-root-trip-transition">
(()=>{
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