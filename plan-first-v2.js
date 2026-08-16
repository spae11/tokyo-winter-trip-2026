(()=>{
'use strict';
if(window.__planFirstV2)return;window.__planFirstV2=true;
const BASE='/tokyo-winter-trip-2026/',API='https://travel-hub-api.mlrkdee44.workers.dev',CFG='travelToolsCloudV3',TAB_KEY='travelHubHomeTabV1';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const path=location.pathname,isRoot=path===BASE||path===BASE+'index.html',isPlan=path.startsWith(BASE+'tokyo/')||path.startsWith(BASE+'hongkong/')||path.startsWith(BASE+'danang/')||path.startsWith(BASE+'yunnan/')||path.startsWith(BASE+'chongqing/')||path.startsWith(BASE+'harbin/');if(!isRoot&&!isPlan)return;
document.body.classList.add('pfx-v2');
if(isPlan&&!document.querySelector('script[data-plan-photo-memory]')){const s=document.createElement('script');s.src=BASE+'plan-photo-memory-v1.js?v=69';s.async=true;s.dataset.planPhotoMemory='1';document.head.appendChild(s)}
if(isRoot&&!document.querySelector('script[data-memory-delete-everywhere]')){const s=document.createElement('script');s.src=BASE+'memory-delete-everywhere-v1.js?v=69';s.async=true;s.dataset.memoryDeleteEverywhere='1';document.head.appendChild(s)}
function load(k,d={}){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let tabMotionToken=0;
function visibleTop(nodes){const a=[...new Set(nodes.filter(Boolean))];return a.filter(el=>!a.some(other=>other!==el&&other.contains(el)))}
async function fadeNodes(nodes,dir='in'){
  const els=visibleTop(nodes);
  if(!els.length||reduced()||typeof Element==='undefined'||!Element.prototype.animate)return;
  const incoming=dir==='in';
  await Promise.all(els.map(el=>{
    const frames=incoming?
      [{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}]:
      [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(3px)'}];
    const a=el.animate(frames,{duration:incoming?150:90,easing:incoming?'cubic-bezier(.22,1,.36,1)':'ease-in',fill:'both'});
    return a.finished.catch(()=>{}).finally(()=>{try{a.cancel()}catch{}})
  }))
}
function pageFadeTo(href){if(reduced()){location.href=href;return}document.body.classList.add('pfx-page-leaving');setTimeout(()=>location.href=href,70)}
function simplifyDashboard(){const title=$('.pfx-dash-title'),sub=$('.pfx-dash-sub');if(title)title.textContent='ทริปของเรา';if(sub)sub.textContent='เปิดดูหรือแก้ไขแพลนร่วมกันได้ทันที';const top=$('.pfx-dash-top');if(top&&!$('.pfx-live-dot',top)){const d=document.createElement('div');d.className='pfx-live-dot';d.textContent='Auto update';top.querySelector('div')?.appendChild(d)}const plan=$('#pfxBottomNav .pfx-navbtn:first-child');if(plan){plan.lastChild.nodeValue='Trips';plan.setAttribute('aria-label','Trips')}}
function clearOpened(){document.body.classList.remove('pfx-show-all');$$('.pfx-extra-open').forEach(x=>x.classList.remove('pfx-extra-open'))}
function reveal(sel){const el=$(sel);if(!el)return null;const sec=el.closest('.section');if(sec)sec.classList.add('pfx-extra-open');el.classList.add('pfx-extra-open');return sec||el}
function setNavActive(tab){const nav=$('#pfxBottomNav');if(!nav)return;$$('.pfx-navbtn',nav).forEach(x=>x.classList.remove('active'));const target=tab==='map'?$('a[href="#planWorldMap"]',nav):tab==='memories'?$('a[href="#memories"]',nav):tab==='more'?$('[data-pfx-more]',nav):$('.pfx-navbtn:first-child',nav);target?.classList.add('active')}
async function activateTab(tab,{scroll=true,hash=true,animate=true}={}){
  if(!isRoot)return;
  const token=++tabMotionToken;
  const outgoing=visibleTop($$('.pfx-extra-open'));
  if(animate&&outgoing.length)await fadeNodes(outgoing,'out');
  if(token!==tabMotionToken)return;
  clearOpened();
  let target=null,incoming=[];
  if(tab==='map'){target=reveal('#planWorldMap');if(target)incoming.push(target)}
  else if(tab==='memories'){
    ['#memories','#memoryMoments','#memoryRecap'].forEach(sel=>{const x=reveal(sel);if(x)incoming.push(x)});
    target=$('#memories')||$('#memoryMoments')||$('#memoryRecap')
  }else{
    target=$('#pfxTripDashboard');tab='trips';if(target)incoming.push(target)
  }
  sessionStorage.setItem(TAB_KEY,tab);setNavActive(tab);
  if(hash){const h=tab==='map'?'#planWorldMap':tab==='memories'?'#memories':'#pfxTripDashboard';history.replaceState(null,'',h)}
  if(animate&&incoming.length)requestAnimationFrame(()=>fadeNodes(incoming,'in'));
  if(scroll&&target)setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),animate?135:40)
}
function markRootExtras(){if(!isRoot)return;document.body.classList.add('pfx-root');const tripList=$('.trip-list'),tripSec=tripList?.closest('.section');if(tripSec)tripSec.classList.add('pfx-core-section');$$('.section').forEach(sec=>{if(sec!==tripSec)sec.classList.add('pfx-extra-section')});const hero=$('.hero');if(hero)hero.classList.add('pfx-extra-special');const h=location.hash;if(h==='#memories'||h==='#memoryMoments'||h==='#memoryRecap')activateTab('memories',{scroll:false,hash:false,animate:false});else if(h==='#planWorldMap')activateTab('map',{scroll:false,hash:false,animate:false});else activateTab(sessionStorage.getItem(TAB_KEY)||'trips',{scroll:false,hash:false,animate:false})}
function ensureMore(){let sh=$('#pfxV2More');if(sh)return sh;sh=document.createElement('div');sh.id='pfxV2More';sh.className='pfx-v2-more';const root=isRoot?'./':'../';sh.innerHTML=`<div class="pfx-v2-more-panel"><div class="pfx-v2-more-head"><h3>เมนูเพิ่มเติม</h3><button class="pfx-v2-more-close" type="button">×</button></div><div class="pfx-v2-menu"><button class="pfx-v2-item primary" type="button" data-v2-tools>🧰 Trip Tools<span>Storage, Wallet, Notes, PDF และการตั้งค่า</span></button><a class="pfx-v2-item" href="${root}#memories" data-v2-root-tab="memories">❤️ Memories<span>Journal, Moments, Recap, Photos, Video และ Documents</span></a><a class="pfx-v2-item" href="${root}#planWorldMap" data-v2-root-tab="map">🗺️ Map<span>Memory locations และ Travel Map</span></a><button class="pfx-v2-item" type="button" data-v2-history>🕘 Recent Changes<span>ประวัติการแก้แพลนและ Undo</span></button></div></div>`;document.body.appendChild(sh);sh.addEventListener('click',e=>{if(e.target===sh||e.target.closest('.pfx-v2-more-close'))closeMore();if(e.target.closest('[data-v2-tools]')){closeMore();setTimeout(()=>$('#tt-launch')?.click(),170)}if(e.target.closest('[data-v2-history]')){closeMore();setTimeout(()=>$('[data-pfx-history]')?.click(),170)}const a=e.target.closest('[data-v2-root-tab]');if(a&&isRoot){e.preventDefault();closeMore();setTimeout(()=>activateTab(a.dataset.v2RootTab),150)}});return sh}
function openMore(){setNavActive('more');ensureMore().classList.add('open')}function closeMore(){$('#pfxV2More')?.classList.remove('open');if(isRoot)setTimeout(()=>setNavActive(sessionStorage.getItem(TAB_KEY)||'trips'),130)}
function bindNav(){document.addEventListener('click',e=>{const more=e.target.closest('#pfxBottomNav [data-pfx-more]');if(more){e.preventDefault();e.stopImmediatePropagation();openMore();return}if(isRoot){const trips=e.target.closest('#pfxBottomNav .pfx-navbtn:first-child');if(trips){e.preventDefault();activateTab('trips');return}const map=e.target.closest('#pfxBottomNav a[href="#planWorldMap"]');if(map){e.preventDefault();activateTab('map');return}const mem=e.target.closest('#pfxBottomNav a[href="#memories"]');if(mem){e.preventDefault();activateTab('memories');return}}else if(isPlan){const link=e.target.closest('#pfxBottomNav a[href]');if(link){const u=new URL(link.href,location.href);if(u.pathname!==location.pathname){e.preventDefault();e.stopImmediatePropagation();pageFadeTo(u.href)}}}},true)}
function cleanupUI(){document.querySelectorAll('.floatback,.hub-back-btn,#pfxFeatureTabs,.pfx-v2-extra-banner').forEach(x=>x.remove());const navs=$$('#pfxBottomNav');navs.slice(1).forEach(x=>x.remove());if(isRoot){$$('body>.bottomnav').forEach(x=>x.remove());const tripList=$('.trip-list'),tripSec=tripList?.closest('.section');if(tripSec)tripSec.classList.add('pfx-core-section')}if(isPlan){$$('body>.bottomnav').forEach(x=>x.remove())}const sheet=$('#memorySheet');if(sheet){const fields=$$('.mm-field',sheet);fields.slice(1).forEach(x=>x.remove());if(sheet.dataset.mediaV4==='1'&&!$('#mmPickVideo',sheet)){sheet.removeAttribute('data-media-v4');window.__memoryMediaV4=false}}
}
let checking=false,lastRemoteCheck=0;async function checkRemote(force=false){if(checking||!navigator.onLine||document.hidden)return;const cfg=load(CFG,{});if(!cfg?.token||cfg.auto===false)return;const now=Date.now();if(!force&&now-lastRemoteCheck<8000)return;lastRemoteCheck=now;checking=true;try{const r=await fetch(API+'/api/state',{headers:{Authorization:'Bearer '+cfg.token},cache:'no-store'});if(!r.ok)return;const data=await r.json();const remoteV=Number(data?.version)||0,localV=Number(load(CFG,{}).version)||0;if(remoteV>localV)window.dispatchEvent(new Event('online'))}catch{}finally{checking=false}}
let localTimer=0;function localChanged(){clearTimeout(localTimer);localTimer=setTimeout(()=>{if(navigator.onLine)window.dispatchEvent(new Event('online'))},120)}function liveSync(){setInterval(()=>checkRemote(false),12000);window.addEventListener('focus',()=>checkRemote(true));document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkRemote(true)});window.addEventListener('travelhub:plan-edits-updated',localChanged);window.addEventListener('travelhub:plan-activity',localChanged);window.addEventListener('travelhub:memory-updated',localChanged);window.addEventListener('storage',e=>{if(e.key&&e.key!==CFG)checkRemote(true)})}
window.addEventListener('pageshow',()=>document.body.classList.remove('pfx-page-leaving'));
let tries=0;const boot=setInterval(()=>{tries++;simplifyDashboard();cleanupUI();if(isRoot)markRootExtras();if($('#pfxBottomNav')){clearInterval(boot);simplifyDashboard();cleanupUI();if(isRoot)markRootExtras();bindNav();liveSync();const mo=new MutationObserver(()=>{clearTimeout(mo._pfx);mo._pfx=setTimeout(cleanupUI,120)});mo.observe(document.documentElement,{childList:true,subtree:true});}else if(tries>160){clearInterval(boot);bindNav();liveSync()}},80);
})();
