(()=>{
'use strict';
if(window.__journeyUiMotionV1)return;window.__journeyUiMotionV1=true;
window.OUR_JOURNEY_APP_VERSION='v90';
const $=(s,r=document)=>r.querySelector(s);
const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Self-heal installed PWA clients that are still controlled by an older service worker.
if('serviceWorker' in navigator){
 const reloadKey='ourJourneyAppUpgradeV90';
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(sessionStorage.getItem(reloadKey))return;
  sessionStorage.setItem(reloadKey,'1');
  location.reload();
 });
 navigator.serviceWorker.register('/tokyo-winter-trip-2026/sw.js?v=90',{updateViaCache:'none'}).then(async r=>{
  try{await r.update()}catch{}
  if(r.waiting)r.waiting.postMessage('SKIP_WAITING');
 }).catch(()=>{});
}

function play(el,dir='in',duration){if(!el||reduce()||!el.animate)return Promise.resolve();const incoming=dir==='in';const a=el.animate(incoming?[{opacity:0,transform:'translateY(6px)',filter:'blur(2px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}]:[{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(5px)',filter:'blur(1.5px)'}],{duration:duration||(incoming?220:135),easing:incoming?'cubic-bezier(.22,1,.36,1)':'ease-in',fill:'both'});return a.finished.catch(()=>{}).finally(()=>{try{a.cancel()}catch{}})}
document.addEventListener('click',e=>{const tab=e.target.closest?.('.tt-tab');if(!tab||tab.dataset.motionBypass==='1')return;const next=tab.dataset.tab,current=$('.tt-panel.on');if(!next||current?.dataset.panel===next)return;e.preventDefault();e.stopImmediatePropagation();play(current,'out',120).then(()=>{tab.dataset.motionBypass='1';tab.click();delete tab.dataset.motionBypass;requestAnimationFrame(()=>play($(`.tt-panel.on[data-panel="${CSS.escape(next)}"]`)||$('.tt-panel.on'),'in',210))})},true);
document.addEventListener('click',e=>{if(e.target.closest?.('[data-pfx-focus]'))requestAnimationFrame(()=>requestAnimationFrame(()=>play($('#pfxTripDashboard .pfx-trip-main'),'in',230))) });
document.addEventListener('toggle',e=>{const d=e.target;if(!(d instanceof HTMLDetailsElement)||!d.open)return;[...d.children].filter(x=>x.tagName!=='SUMMARY').forEach(x=>play(x,'in',200))},true);
function load(src,key,version='1'){
 const marker=`dyn-${src}`;
 if(window[key]||document.querySelector(`script[data-dyn-loader="${marker}"]`))return;
 const s=document.createElement('script');s.src=`/tokyo-winter-trip-2026/${src}.js?v=${version}`;s.async=false;s.dataset.dynLoader=marker;document.head.appendChild(s)
}
load('price-sanity-v1','__priceSanityV1','2');
load('hotel-quality-v1','__hotelQualityV1','2');
load('shanghai-register-v1','__shanghaiRegisterV1','3');
load('live-price-v2','__livePriceV2','5');
load('trip-live-budget-sync-v2','__tripLiveBudgetSyncV2','3');
load('trip-page-ux-v2','__tripPageUxV2','2');
load('trip-jump-fix-v1','__tripJumpFixV1','1');
load('app-layout-polish-v1','__appLayoutPolishV1','1');
if(location.pathname.includes('/tokyo/'))load('tokyo-flight-option-v1','__tokyoFlightOptionV1','2');
load('trip-settings-all-v1','__tripSettingsAllV1','3');
})();