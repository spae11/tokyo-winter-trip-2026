(()=>{
'use strict';
if(window.__priceSanityV1)return;window.__priceSanityV1=true;
const LIVE_KEY='travelHubLivePricesV2',TRIP_KEY='travelHubTripPricesV1';
const MIN_NIGHTLY={tokyo:900,kansai:900,hongkong:1000,danang:350,yunnan:400,chongqing:450,harbin:500};
function load(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function invalid(h){
 if(!h||h.status!=='live')return false;
 const n=Number(h.nights),total=Number(h.totalTHB),nightly=Number(h.nightlyTHB),floor=MIN_NIGHTLY[h.tripId]||300;
 if(!(n>0&&total>0&&nightly>0))return true;
 const implied=total/n,diff=Math.abs(implied-nightly)/Math.max(implied,nightly);
 if(implied<floor||nightly<floor*.8)return true;
 if(diff>.18)return true;
 if(total<floor*n*.9)return true;
 return false;
}
function sanitizeHotel(h){
 if(!invalid(h))return h;
 const out={...h,status:'unavailable',message:'Price verification failed consistency check',verification:'rejected_inconsistent'};
 delete out.nightlyTHB;delete out.totalTHB;delete out.baseNightlyTHB;delete out.candidatesTHB;out.estimatedTotal=false;
 return out;
}
function sanitizeData(data){if(!data||typeof data!=='object')return data;return{...data,hotels:(data.hotels||[]).map(sanitizeHotel)}}
function cleanStorage(){
 let changed=false;
 const live=load(LIVE_KEY,null);if(live){const x=sanitizeData(live);if(JSON.stringify(x)!==JSON.stringify(live)){save(LIVE_KEY,x);changed=true}}
 const by=load(TRIP_KEY,{})||{};let byChanged=false;for(const k of Object.keys(by)){const x=sanitizeData(by[k]);if(JSON.stringify(x)!==JSON.stringify(by[k])){by[k]=x;byChanged=true}}if(byChanged){save(TRIP_KEY,by);changed=true}
 if(changed)window.dispatchEvent(new CustomEvent('travelhub:trip-price-updated',{detail:{reason:'price-sanity'}}));
}
const nativeFetch=window.fetch.bind(window);
window.fetch=async function(input,init){
 const r=await nativeFetch(input,init);
 try{
  const u=new URL(typeof input==='string'?input:input?.url||'',location.href);
  if(u.hostname==='travel-hub-api.mlrkdee44.workers.dev'&&u.pathname==='/api/prices/refresh'&&r.ok){
   const data=await r.clone().json(),safe=sanitizeData(data),headers=new Headers(r.headers);headers.set('content-type','application/json; charset=utf-8');
   return new Response(JSON.stringify(safe),{status:r.status,statusText:r.statusText,headers});
  }
 }catch(e){console.warn('[price-sanity]',e)}
 return r;
};
window.OUR_JOURNEY_PRICE_SANITY={minNightlyTHB:MIN_NIGHTLY,isInvalid:invalid,sanitizeData};
cleanStorage();
window.addEventListener('storage',e=>{if(e.key===LIVE_KEY||e.key===TRIP_KEY)setTimeout(cleanStorage,0)});
})();