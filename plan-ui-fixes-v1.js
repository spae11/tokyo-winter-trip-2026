(()=>{
'use strict';
if(window.__planUiFixesV1)return;window.__planUiFixesV1=true;
const BASE='/tokyo-winter-trip-2026/';
const path=location.pathname;const planPaths=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];if(!planPaths.some(p=>path.startsWith(BASE+p+'/')))return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const style=document.createElement('style');style.textContent=`
body .hub-back-btn,body .floatback{display:none!important}
body.pfx-plan{padding-bottom:104px!important}
#tt-overlay .tt-tabs{box-sizing:border-box!important;display:flex!important;flex:0 0 auto!important;align-items:center!important;gap:7px!important;width:100%!important;height:auto!important;min-height:58px!important;max-height:none!important;overflow-x:auto!important;overflow-y:hidden!important;padding:10px 12px 9px!important;position:relative!important;z-index:6!important;scrollbar-width:none!important}
#tt-overlay .tt-tabs::-webkit-scrollbar{display:none!important}
#tt-overlay .tt-tab{box-sizing:border-box!important;display:inline-flex!important;flex:0 0 auto!important;align-items:center!important;justify-content:center!important;height:38px!important;min-height:38px!important;max-height:38px!important;margin:0!important;padding:8px 12px!important;line-height:1.2!important;overflow:visible!important;visibility:visible!important;opacity:1!important;white-space:nowrap!important}
#tt-overlay .tt-main{flex:1 1 auto!important;min-height:0!important;position:relative!important;z-index:1!important}
@media(max-width:520px){body.pfx-plan{padding-bottom:108px!important}#tt-overlay .tt-tabs{min-height:60px!important;padding:10px 10px!important}#tt-overlay .tt-tab{height:40px!important;min-height:40px!important;max-height:40px!important}}
`;document.head.appendChild(style);
function removeFloatingBack(){$$('.hub-back-btn,.floatback').forEach(x=>x.remove())}
function moveSeason(){const main=$('main'),days=$('#days'),season=$('#best-season');if(!main||!days||!season)return;const daySection=days.closest('section')||days;if(daySection.parentNode===season.parentNode&&daySection.nextElementSibling!==season)daySection.insertAdjacentElement('afterend',season);$$('main section').forEach(sec=>{if(sec===season)return;const h=sec.querySelector('.head h2,h2');const t=(h?.textContent||'').trim();if(/ทริปนี้เหมาะช่วงไหน|best season/i.test(t))sec.style.display='none'})}
function guardPlanLayout(){removeFloatingBack();moveSeason();const nav=$('#pfxBottomNav');if(nav)nav.style.zIndex='10020';const tabs=$('#tt-overlay .tt-tabs');if(tabs){tabs.style.height='auto';tabs.style.minHeight='58px';tabs.style.maxHeight='none'}}
let n=0;const timer=setInterval(()=>{guardPlanLayout();if(++n>80)clearInterval(timer)},100);
new MutationObserver(()=>guardPlanLayout()).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',()=>setTimeout(guardPlanLayout,50));
document.addEventListener('travelhub:plan-refresh',()=>setTimeout(guardPlanLayout,30));
guardPlanLayout();
})();
