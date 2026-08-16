(()=>{
'use strict';
if(window.__planUiFixesV1)return;window.__planUiFixesV1=true;
const BASE='/tokyo-winter-trip-2026/';
const path=location.pathname;if(!path.startsWith(BASE+'tokyo/')&&!path.startsWith(BASE+'hongkong/')&&!path.startsWith(BASE+'danang/')&&!path.startsWith(BASE+'yunnan/'))return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const style=document.createElement('style');style.textContent=`
body .hub-back-btn,body .floatback{display:none!important}
body.pfx-plan{padding-bottom:104px!important}
@media(max-width:520px){body.pfx-plan{padding-bottom:108px!important}}
`;document.head.appendChild(style);
function removeFloatingBack(){$$('.hub-back-btn,.floatback').forEach(x=>x.remove())}
function moveSeason(){const main=$('main'),days=$('#days'),season=$('#best-season');if(!main||!days||!season)return;const daySection=days.closest('section')||days;if(daySection.parentNode===season.parentNode&&daySection.nextElementSibling!==season)daySection.insertAdjacentElement('afterend',season);$$('main section').forEach(sec=>{if(sec===season)return;const h=sec.querySelector('.head h2,h2');const t=(h?.textContent||'').trim();if(/ทริปนี้เหมาะช่วงไหน|best season/i.test(t))sec.style.display='none'})}
function guardPlanLayout(){removeFloatingBack();moveSeason();const nav=$('#pfxBottomNav');if(nav)nav.style.zIndex='10020'}
let n=0;const timer=setInterval(()=>{guardPlanLayout();if(++n>80)clearInterval(timer)},100);
new MutationObserver(()=>guardPlanLayout()).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',()=>setTimeout(guardPlanLayout,50));
document.addEventListener('travelhub:plan-refresh',()=>setTimeout(guardPlanLayout,30));
guardPlanLayout();
})();
