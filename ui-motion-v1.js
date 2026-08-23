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

/* Live price refresh is shared by the home screen and every trip page. */
if(!window.__livePriceRefreshV1&&!document.querySelector('script[data-live-price-refresh]')){
  const s=document.createElement('script');
  s.src='/tokyo-winter-trip-2026/live-price-refresh-v1.js?v=1';
  s.async=false;
  s.dataset.livePriceRefresh='1';
  document.head.appendChild(s);
}

/* Make the price source itself the booking/details link. */
if(!window.__livePriceBookingLinksV1&&!document.querySelector('script[data-live-price-booking-links]')){
  const s=document.createElement('script');
  s.src='/tokyo-winter-trip-2026/live-price-booking-links-v1.js?v=1';
  s.async=false;
  s.dataset.livePriceBookingLinks='1';
  document.head.appendChild(s);
}
})();
