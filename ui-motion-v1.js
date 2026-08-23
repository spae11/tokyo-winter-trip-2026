(()=>{
'use strict';
if(window.__journeyUiMotionV1)return;window.__journeyUiMotionV1=true;
const $=(s,r=document)=>r.querySelector(s);
const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function play(el,dir='in',duration){
  if(!el||reduce()||!el.animate)return Promise.resolve();
  const incoming=dir==='in';
  const a=el.animate(incoming?
    [{opacity:0,transform:'translateY(6px)',filter:'blur(2px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}]:
    [{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(5px)',filter:'blur(1.5px)'}],
    {duration:duration||(incoming?220:135),easing:incoming?'cubic-bezier(.22,1,.36,1)':'ease-in',fill:'both'});
  return a.finished.catch(()=>{}).finally(()=>{try{a.cancel()}catch{}})
}
document.addEventListener('click',e=>{
  const tab=e.target.closest?.('.tt-tab');
  if(!tab||tab.dataset.motionBypass==='1')return;
  const next=tab.dataset.tab,current=$('.tt-panel.on');
  if(!next||current?.dataset.panel===next)return;
  e.preventDefault();e.stopImmediatePropagation();
  play(current,'out',120).then(()=>{tab.dataset.motionBypass='1';tab.click();delete tab.dataset.motionBypass;requestAnimationFrame(()=>play($(`.tt-panel.on[data-panel="${CSS.escape(next)}"]`)||$('.tt-panel.on'),'in',210))});
},true);
document.addEventListener('click',e=>{if(e.target.closest?.('[data-pfx-focus]'))requestAnimationFrame(()=>requestAnimationFrame(()=>play($('#pfxTripDashboard .pfx-trip-main'),'in',230))) });
document.addEventListener('toggle',e=>{const d=e.target;if(!(d instanceof HTMLDetailsElement)||!d.open)return;[...d.children].filter(x=>x.tagName!=='SUMMARY').forEach(x=>play(x,'in',200))},true);
/* Single source of truth for price refresh and per-trip price data. */
if(!window.__livePriceV2&&!document.querySelector('script[data-live-price-v2]')){
  const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/live-price-v2.js?v=5';s.async=false;s.dataset.livePriceV2='1';document.head.appendChild(s);
}
/* Budget-only sync: does not rewrite ticket DOM. */
if(!window.__tripLiveBudgetSyncV2&&!document.querySelector('script[data-trip-live-budget-sync-v2]')){
  const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/trip-live-budget-sync-v2.js?v=2';s.async=false;s.dataset.tripLiveBudgetSyncV2='1';document.head.appendChild(s);
}
/* Stable all-trip long-page UX: section jump, CSS-based hide/unhide and booking navigation. */
if(!window.__tripPageUxV2&&!document.querySelector('script[data-trip-page-ux-v2]')){
  const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/trip-page-ux-v2.js?v=2';s.async=false;s.dataset.tripPageUxV2='1';document.head.appendChild(s);
}
/* Quick-jump target filter/fix: only real top-level sections are listed and scrolled to. */
if(!window.__tripJumpFixV1&&!document.querySelector('script[data-trip-jump-fix-v1]')){
  const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/trip-jump-fix-v1.js?v=1';s.async=false;s.dataset.tripJumpFixV1='1';document.head.appendChild(s);
}
/* Shared spacing/card proportions for Home and all trip pages. */
if(!window.__appLayoutPolishV1&&!document.querySelector('script[data-app-layout-polish-v1]')){
  const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/app-layout-polish-v1.js?v=1';s.async=false;s.dataset.appLayoutPolishV1='1';document.head.appendChild(s);
}
})();