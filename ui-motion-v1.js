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
  play(current,'out',120).then(()=>{
    tab.dataset.motionBypass='1';
    tab.click();
    delete tab.dataset.motionBypass;
    requestAnimationFrame(()=>play($(`.tt-panel.on[data-panel="${CSS.escape(next)}"]`)||$('.tt-panel.on'),'in',210));
  });
},true);

document.addEventListener('click',e=>{
  if(!e.target.closest?.('[data-pfx-focus]'))return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>play($('#pfxTripDashboard .pfx-trip-main'),'in',230)));
});

document.addEventListener('toggle',e=>{
  const d=e.target;
  if(!(d instanceof HTMLDetailsElement)||!d.open)return;
  const body=[...d.children].filter(x=>x.tagName!=='SUMMARY');
  body.forEach(x=>play(x,'in',200));
},true);

/* Shared current-price engine for home + every registered trip. */
if(!window.__livePriceRefreshV2&&!document.querySelector('script[data-live-price-refresh-v2]')){
  const s=document.createElement('script');
  s.src='/tokyo-winter-trip-2026/live-price-refresh-v2.js?v=2';
  s.async=false;
  s.dataset.livePriceRefreshV2='1';
  document.head.appendChild(s);
}

/* Make hotel / ticket price sources clickable. */
if(!window.__livePriceBookingLinksV1&&!document.querySelector('script[data-live-price-booking-links]')){
  const s=document.createElement('script');
  s.src='/tokyo-winter-trip-2026/live-price-booking-links-v1.js?v=2';
  s.async=false;
  s.dataset.livePriceBookingLinks='1';
  document.head.appendChild(s);
}

/* Visible price UX: one clear refresh bar, reliable booking links, compact hotel cards and full trip parity. */
if(!document.getElementById('pui-hide-old-refresh')){
  const st=document.createElement('style');st.id='pui-hide-old-refresh';st.textContent='.lpr-refresh-trip{display:none!important}';document.head.appendChild(st);
}
if(!window.__priceUiV2&&!document.querySelector('script[data-price-ui-v2]')){
  const s=document.createElement('script');
  s.src='/tokyo-winter-trip-2026/price-ui-v2.js?v=2';
  s.async=false;
  s.dataset.priceUiV2='1';
  document.head.appendChild(s);
}
})();
