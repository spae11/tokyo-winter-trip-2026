from pathlib import Path


def read(p):
    return Path(p).read_text(encoding='utf-8')


def write(p, s):
    Path(p).write_text(s, encoding='utf-8')


def require_replace(s, old, new, label, count=-1):
    if old not in s:
        raise SystemExit(f'MISSING {label}: {old[:120]}')
    return s.replace(old, new, count)


# Root: persist successful unlock on this device and make navigation lighter.
p = 'index.html'
s = read(p)
if 'ourJourneyUnlockedV1' not in s:
    s = require_replace(
        s,
        '<title>Our Journey</title>',
        "<title>Our Journey</title>\n<script>try{if(localStorage.getItem('ourJourneyUnlockedV1')==='1')document.documentElement.classList.add('journey-unlocked')}catch(e){}</script>",
        'index unlock head',
    )
    s = require_replace(
        s,
        '[hidden]{display:none!important}',
        "[hidden]{display:none!important}.journey-unlocked .gate{display:none!important}.journey-unlocked .app-shell{opacity:1!important;transform:none!important;filter:none!important}",
        'index unlock css',
    )
    old = "function unlock(animated=true){sessionStorage.setItem('hubUnlocked','1');sessionStorage.setItem('unlock','1');document.body.classList.add('unlocked');"
    new = "function unlock(animated=true){sessionStorage.setItem('hubUnlocked','1');sessionStorage.setItem('unlock','1');try{localStorage.setItem('ourJourneyUnlockedV1','1');document.documentElement.classList.add('journey-unlocked')}catch(e){}document.body.classList.add('unlocked');"
    s = require_replace(s, old, new, 'index unlock fn')
    old = "if(sessionStorage.getItem('hubUnlocked')==='1'||sessionStorage.getItem('unlock')==='1')unlock(false);"
    new = "if(sessionStorage.getItem('hubUnlocked')==='1'||sessionStorage.getItem('unlock')==='1'||localStorage.getItem('ourJourneyUnlockedV1')==='1')unlock(false);"
    s = require_replace(s, old, new, 'index unlock check')
s = s.replace(
    "body.page-leaving .app-shell{opacity:0!important;transform:translateY(8px) scale(.995)!important;filter:blur(3px)!important}",
    "body.page-leaving .app-shell{opacity:.78!important;transform:translateY(2px)!important;filter:none!important;transition:opacity .08s ease,transform .08s ease!important}",
)
s = s.replace("setTimeout(()=>location.href=a.href,240)", "setTimeout(()=>location.href=a.href,70)")
s = s.replace('manifest.webmanifest?v=65', 'manifest.webmanifest?v=72')
s = s.replace('ourJourneySWReloadV71', 'ourJourneySWReloadV72').replace('./sw.js?v=71', './sw.js?v=72')
write(p, s)

# Never sync the local unlock convenience flag to another phone.
p = 'trip-cloud-sync-v3.js'
s = read(p)
s = s.replace(
    "const EXCLUDED=/^travelToolsCloudV\\d+$/;",
    "const EXCLUDED=/^(?:travelToolsCloudV\\d+|ourJourneyUnlockedV1)$/;",
)
write(p, s)

# Combo-box selection also controls the active trip preview image.
p = 'plan-first-v1.js'
s = read(p)
old = "function paint(key){localStorage.setItem(FOCUS_KEY,key);"
new = "function paint(key){d.dataset.pfxTrip=key;localStorage.setItem(FOCUS_KEY,key);"
if old in s:
    s = s.replace(old, new, 1)
elif 'd.dataset.pfxTrip=key' not in s:
    raise SystemExit('MISSING dashboard paint hook')
write(p, s)

# Preview image selectors still referenced the removed trip-pill UI.
p = 'plan-first-v2.css'
s = read(p)
pairs = {
    'body.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus="tokyo"].on) .pfx-trip-main:before': 'body.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip="tokyo"] .pfx-trip-main:before',
    'body.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus="hongkong"].on) .pfx-trip-main:before': 'body.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip="hongkong"] .pfx-trip-main:before',
    'body.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus="danang"].on) .pfx-trip-main:before': 'body.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip="danang"] .pfx-trip-main:before',
    'body.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus="yunnan"].on) .pfx-trip-main:before': 'body.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip="yunnan"] .pfx-trip-main:before',
}
for a, b in pairs.items():
    s = s.replace(a, b)
if 'data-pfx-trip="chongqing"' not in s:
    needle = "body.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip=\"yunnan\"] .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=1400&q=82')}"
    add = needle + "\nbody.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip=\"chongqing\"] .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://whlyw.cq.gov.cn/zjwl/yzq/jqjd_1/202203/W020260304344750661362.jpeg')}"
    s = require_replace(s, needle, add, 'chongqing preview')
s = s.replace(
    "body.pfx-v2.pfx-page-leaving{opacity:0;transform:translateY(6px);filter:blur(2px);transition:opacity .2s ease,transform .22s ease,filter .2s ease}",
    "body.pfx-v2.pfx-page-leaving{opacity:.78;transform:translateY(2px);filter:none;transition:opacity .08s ease,transform .08s ease}",
)
write(p, s)

# Remove costly whole-page blur and reduce redundant cloud polling.
p = 'plan-first-v2.js'
s = read(p)
s = s.replace(
    "[{opacity:0,transform:'translateY(8px)',filter:'blur(2px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}]",
    "[{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}]",
)
s = s.replace(
    "[{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(7px)',filter:'blur(2px)'}]",
    "[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(3px)'}]",
)
s = s.replace('duration:incoming?260:175', 'duration:incoming?150:90')
s = s.replace('setTimeout(()=>location.href=href,185)', 'setTimeout(()=>location.href=href,70)')
s = s.replace('now-lastRemoteCheck<1800', 'now-lastRemoteCheck<8000')
s = s.replace('setInterval(()=>checkRemote(false),2500)', 'setInterval(()=>checkRemote(false),12000)')
s = s.replace('mo._pfx=setTimeout(cleanupUI,50)', 'mo._pfx=setTimeout(cleanupUI,120)')
write(p, s)

# PWA v72: cache local app assets/pages instead of waiting on network for every GET.
p = 'sw.js'
s = read(p)
s = s.replace("const CACHE='our-journey-v71';", "const CACHE='our-journey-v72';")
s = s.replace(
    "BASE+'index.html',BASE+'danang/index.html'",
    "BASE+'index.html',BASE+'tokyo/index.html',BASE+'hongkong/index.html',BASE+'danang/index.html'",
)
s = s.replace('?v=71', '?v=72')
s = s.replace(
    'html.hub-plan-loading body{opacity:0;transform:translateY(14px) scale(.995);filter:blur(2px)}',
    'html.hub-plan-loading body{opacity:.78;transform:translateY(2px)}',
)
s = s.replace(
    'html.hub-plan-leaving body{opacity:0;transform:translateY(8px) scale(.995);filter:blur(2px)}',
    'html.hub-plan-leaving body{opacity:.78;transform:translateY(2px)}',
)
s = s.replace(
    'body{transition:opacity .58s ease,transform .58s cubic-bezier(.22,1,.36,1),filter .58s ease}',
    'body{transition:opacity .12s ease,transform .12s ease}',
)
s = s.replace(
    'html.hub-trip-leave body{opacity:0!important;transform:translateY(7px)!important;filter:blur(2px)!important;transition:opacity .24s ease,transform .24s ease,filter .24s ease!important}',
    'html.hub-trip-leave body{opacity:.78!important;transform:translateY(2px)!important;filter:none!important;transition:opacity .08s ease,transform .08s ease!important}',
)
s = s.replace(
    "(()=>{sessionStorage.setItem('hubUnlocked','1');sessionStorage.setItem('unlock','1');",
    "(()=>{sessionStorage.setItem('hubUnlocked','1');sessionStorage.setItem('unlock','1');try{localStorage.setItem('ourJourneyUnlockedV1','1')}catch(e){}",
)
s = s.replace(
    "if(sessionStorage.getItem('hubUnlocked')==='1'||sessionStorage.getItem('unlock')==='1'){document.body.classList.add('unlocked');",
    "if(sessionStorage.getItem('hubUnlocked')==='1'||sessionStorage.getItem('unlock')==='1'||localStorage.getItem('ourJourneyUnlockedV1')==='1'){document.body.classList.add('unlocked');",
)
s = s.replace("setTimeout(()=>{clearTimeout(fallback);location.href=a.href},220)", "setTimeout(()=>{clearTimeout(fallback);location.href=a.href},70)")
marker = "self.addEventListener('fetch',e=>"
if marker not in s:
    raise SystemExit('MISSING sw fetch handler')
s = s[:s.index(marker)] + """function navCachePath(path){if(path===BASE)return BASE+'index.html';if(path.endsWith('/'))return path+'index.html';return path}\nasync function injectedResponse(r,url){const text=injectHtml(await r.clone().text(),url),headers=new Headers(r.headers);headers.set('Content-Type','text/html; charset=utf-8');headers.set('Cache-Control','no-store');return new Response(text,{status:r.status,statusText:r.statusText,headers})}\nself.addEventListener('fetch',e=>{\n  if(e.request.method!=='GET')return;\n  const url=new URL(e.request.url);\n  if(url.origin!==self.location.origin)return;\n  if(e.request.mode==='navigate'&&url.pathname.startsWith(BASE)){\n    e.respondWith((async()=>{\n      const cache=await caches.open(CACHE),key=navCachePath(url.pathname),cached=await cache.match(key,{ignoreSearch:true});\n      if(cached)return injectedResponse(cached,url);\n      try{const r=await fetch(e.request);if(r.ok)await cache.put(key,r.clone());return injectedResponse(r,url)}catch(err){const home=await cache.match(BASE+'index.html',{ignoreSearch:true});if(home)return injectedResponse(home,new URL(self.location.origin+BASE));return new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}\n    })());return;\n  }\n  e.respondWith((async()=>{\n    const cache=await caches.open(CACHE),cached=await cache.match(e.request,{ignoreSearch:true});\n    if(cached)return cached;\n    try{const r=await fetch(e.request);if(r.ok)await cache.put(e.request,r.clone());return r}catch(err){return new Response('',{status:504})}\n  })());\n});\n"""
write(p, s)

# Bump installed-app generation URL.
p = 'manifest.webmanifest'
s = read(p)
s = s.replace('/?pwa=23&app=61', '/?pwa=24&app=72')
write(p, s)
