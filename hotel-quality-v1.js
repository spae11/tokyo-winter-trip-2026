(()=>{
'use strict';
if(window.__hotelQualityV1)return;window.__hotelQualityV1=true;

const API_HOST='travel-hub-api.mlrkdee44.workers.dev';
const LIVE_KEY='travelHubLivePricesV2',TRIP_KEY='travelHubTripPricesV1',STATE_KEY='travelHubStateV2',TT_KEY='travelToolsV1';
const ROUTES=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];
const LABEL={tokyo:'Tokyo',kansai:'Kansai',hongkong:'Hong Kong',danang:'Da Nang + Hoi An',yunnan:'Yunnan',chongqing:'Chongqing',harbin:'Harbin + Yabuli'};
const CATALOG={
 tokyo:[
  {name:'APA Hotel Asakusa Kuramae Kita',area:'Asakusa / Kuramae',review:4.2,reviewCount:541,ota:8.6,otaCount:6693,stars:3,source:'Google + Booking'},
  {name:'Tosei Hotel Cocone Asakusa Kuramae',area:'Asakusa / Kuramae',review:4.1,reviewCount:444,ota:8.7,otaCount:2435,stars:3,source:'Google + Booking'}
 ],
 kansai:[
  {name:'KOKO HOTEL Osaka Namba Sennichimae',area:'Namba / Dotonbori',review:4.4,reviewCount:278,ota:8.7,otaCount:2443,stars:4,source:'Google + Booking'},
  {name:'Hotel Sobial Namba Daikokucho',area:'Daikokucho / Namba',review:4.0,ota:8.8,otaCount:2974,stars:4,source:'Google + Booking'}
 ],
 hongkong:[
  {name:'Page148, Page Hotels',area:'Jordan / Tsim Sha Tsui',review:4.7,reviewCount:1442,ota:8.7,otaCount:1699,stars:4,source:'Google + Booking'},
  {name:'The Cityview - Chinese YMCA of Hong Kong',area:'Yau Ma Tei',review:4.0,ota:8.5,otaCount:2566,stars:4,source:'Google + Booking'},
  {name:'Dorsett Mongkok, Hong Kong',area:'Olympic / Mong Kok',review:4.1,reviewCount:2506,ota:8.0,otaCount:3697,stars:4,source:'Google + Booking'}
 ],
 danang:[
  {name:'Monarque Hotel Danang',area:'My Khe Beach • Da Nang',review:5.0,reviewCount:3826,ota:9.5,otaCount:480,stars:4,source:'Google + Booking'},
  {name:'HAIAN Beach Hotel & Spa',area:'My Khe Beach • Da Nang',review:4.9,reviewCount:4457,ota:9.1,otaCount:2815,stars:4,source:'Google + Booking'},
  {name:'La Charm Hoi An Hotel - Peaceful Boutique In Old Town',area:'Hoi An Old Town',ota:9.5,otaCount:5583,stars:4,source:'Booking'}
 ],
 yunnan:[
  {name:'Holiday Inn Express Kunming Panlong by IHG',aliases:['Holiday Inn Express Kunming Panlong, an IHG Hotel'],area:'Kunming',ota:8.9,otaCount:54,stars:4,source:'Booking'},
  {name:'Hilton Garden Inn Dali Ancient City',area:'Dali Ancient City',ota:9.4,otaCount:1545,stars:4,source:'Trip.com + Booking'}
 ],
 chongqing:[
  {name:'Mercure Hotel Chongqing Jiefangbei',area:'Jiefangbei',review:4.5,ota:9.5,otaCount:10181,stars:4,source:'Google + Trip.com'},
  {name:'Glenview ITC Plaza Chongqing',area:'Jiefangbei / Yuzhong',review:4.5,reviewCount:147,ota:8.0,stars:5,source:'Google + Booking'}
 ],
 harbin:[
  {name:'Mercure Harbin Central Street Sophia Church',area:'Central Street / Sophia Church',review:4.2,ota:9.7,otaCount:6096,stars:4,source:'Google + Trip.com'},
  {name:'Yabu Loni Hotel Yabuli',area:'Yabuli Sunshine Resort',ota:8.7,otaCount:543,stars:5,source:'Trip.com'}
 ]
};
const REPLACE={
 'Travelodge Kowloon':'Page148, Page Hotels',
 'APA Hotel Asakusa Tawaramachi-Ekimae':'APA Hotel Asakusa Kuramae Kita',
 'Richmond Hotel Premier Asakusa International':'Tosei Hotel Cocone Asakusa Kuramae',
 'Sotetsu Fresa Inn Osaka-Namba':'KOKO HOTEL Osaka Namba Sennichimae',
 'Hotel Keihan Namba Grande':'Hotel Sobial Namba Daikokucho',
 'Silka Far East Hotel':'Page148, Page Hotels',
 'Ramada Grand Tsim Sha Tsui':'Page148, Page Hotels',
 'Silka Tsuen Wan, Hong Kong':'The Cityview - Chinese YMCA of Hong Kong',
 'Little Riverside Hoi An':'La Charm Hoi An Hotel - Peaceful Boutique In Old Town',
 'Dali Old Courtyard Boutique Inn':'Hilton Garden Inn Dali Ancient City',
 'Ascott Raffles City Chongqing':'Mercure Hotel Chongqing Jiefangbei',
 'Holiday Inn Express Harbin Central Avenue':'Mercure Harbin Central Street Sophia Church',
 'Fairfield by Marriott Harbin Downtown':'Mercure Harbin Central Street Sophia Church',
 'Yabuli Sun Mountain Resort':'Yabu Loni Hotel Yabuli'
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9ก-๙一-龥]+/g,' ').trim();
const fmt=n=>Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0});
function load(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function tripId(){return ROUTES.find(x=>location.pathname.includes('/'+x+'/'))||''}
function candidates(id){return CATALOG[id]||[]}
function names(id){return candidates(id).map(x=>x.name)}
function meta(id,name){const n=norm(name);return candidates(id).find(x=>[x.name,...(x.aliases||[])].some(a=>{const q=norm(a);return q===n||q.includes(n)||n.includes(q)}))||null}
function approved(id,name){return!!meta(id,name)}
function dates(id){const st=load(STATE_KEY,{})||{},tt=load(TT_KEY,{})||{},x=st?.[id]||st?.trips?.[id]||{};return{start:x.start||tt?.dates?.[id]||'',end:x.end||''}}
function bookingUrl(name,id){const d=dates(id),q=new URLSearchParams({ss:name,lang:'th',selected_currency:'THB',group_adults:'2',group_children:'0',no_rooms:'1'});if(/^\d{4}-\d{2}-\d{2}$/.test(d.start))q.set('checkin',d.start);if(/^\d{4}-\d{2}-\d{2}$/.test(d.end))q.set('checkout',d.end);return'https://www.booking.com/searchresults.html?'+q.toString()}
function matchResult(data,id,name){const n=norm(name);return(data?.hotels||[]).find(h=>h.tripId===id&&(()=>{const q=norm(h.name);return q===n||q.includes(n)||n.includes(q)||!!meta(id,h.name)&&meta(id,h.name)===meta(id,name)})())||null}
function budgetBand(h){if(h?.status!=='live'||!(Number(h.totalTHB)>0))return 2;const t=Number(h.totalTHB);return t<=10000?0:t<=15000?1:3}
function bandLabel(h){const b=budgetBand(h);return b===0?'✓ ≤10K ดีมาก':b===1?'✓ ≤15K รับได้':b===3?'เกิน 15K':'กด ↻ เช็กราคา'}
function reviewLabel(m){if(Number(m.review)>=4)return`⭐ ${m.review.toFixed(1)}/5${m.reviewCount?' • '+fmt(m.reviewCount)+' รีวิว':''}`;return`⭐ ${Number(m.ota||0).toFixed(1)}/10 OTA${m.otaCount?' • '+fmt(m.otaCount)+' รีวิว':''}`}
function sortWithPrice(data,id){return [...candidates(id)].sort((a,b)=>{const ha=matchResult(data,id,a.name),hb=matchResult(data,id,b.name),ba=budgetBand(ha),bb=budgetBand(hb);if(ba!==bb)return ba-bb;const pa=Number(ha?.totalTHB||1e12),pb=Number(hb?.totalTHB||1e12);if(pa!==pb)return pa-pb;return Number(b.review||b.ota/2)-Number(a.review||a.ota/2)})}

// Make the existing price client send only the approved shortlist to the backend.
if(!window.__hotelQualityFetchWrapped){
 window.__hotelQualityFetchWrapped=true;
 const nativeFetch=window.fetch.bind(window);
 window.fetch=async function(input,init){
  try{
   const u=new URL(typeof input==='string'?input:input?.url||'',location.href);
   if(u.hostname===API_HOST&&u.pathname==='/api/prices/refresh'&&String(init?.method||'GET').toUpperCase()==='POST'&&typeof init?.body==='string'){
    const body=JSON.parse(init.body),ids=Array.isArray(body.tripIds)?body.tripIds.filter(x=>ROUTES.includes(x)):[];
    const byTrip={};for(const h of body.hotels||[]){if(h?.tripId&&!byTrip[h.tripId])byTrip[h.tripId]={start:h.start||'',end:h.end||''}}
    body.hotels=[];
    for(const id of ids){const d=byTrip[id]||dates(id);for(const name of names(id))body.hotels.push({tripId:id,name,start:d.start||'',end:d.end||''})}
    init={...init,body:JSON.stringify(body)};
   }
  }catch(e){console.warn('[hotel-quality] request policy skipped',e)}
  return nativeFetch(input,init)
 }
}
window.OUR_JOURNEY_HOTEL_POLICY={catalog:CATALOG,preferredTotalTHB:10000,maxTotalTHB:15000,minReview5:4,minOta10:8};

function filterData(data){if(!data||typeof data!=='object')return data;return{...data,hotels:(data.hotels||[]).filter(h=>!ROUTES.includes(h.tripId)||approved(h.tripId,h.name))}}
function cleanStored(){
 const live=load(LIVE_KEY,null);if(live){const next=filterData(live);if(JSON.stringify(next.hotels)!==JSON.stringify(live.hotels||[]))save(LIVE_KEY,next)}
 const store=load(TRIP_KEY,{})||{};let changed=false;for(const id of ROUTES){if(!store[id])continue;const hs=(store[id].hotels||[]).filter(h=>approved(id,h.name));if(JSON.stringify(hs)!==JSON.stringify(store[id].hotels||[])){store[id]={...store[id],hotels:hs};changed=true}}if(changed)save(TRIP_KEY,store)
}
function currentData(id){const by=load(TRIP_KEY,{})||{};if(by[id])return by[id];const all=load(LIVE_KEY,null);return all?{...all,hotels:(all.hotels||[]).filter(x=>x.tripId===id)}:null}

function style(){if($('#hq-style'))return;const s=document.createElement('style');s.id='hq-style';s.textContent=`
#lpr2HotelOptions{display:none!important}.hq-unapproved{display:none!important}.hq-wrap{width:min(1100px,calc(100% - 20px));margin:10px auto 18px;background:#fff;border:1px solid #0001;border-radius:20px;padding:13px;box-shadow:0 10px 30px #251e1911;font-family:'Noto Sans Thai',system-ui}.hq-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}.hq-head h2{font-size:1.22rem;line-height:1.2;margin:2px 0}.hq-sub{font-size:.76rem;color:#72777b;line-height:1.45}.hq-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.hq-card{border:1px solid #0001;background:#faf9f6;border-radius:16px;padding:11px;min-width:0}.hq-card.hq-best{border-color:#1f8b4c55;box-shadow:inset 0 0 0 1px #1f8b4c18}.hq-name{display:block;color:#1e2428;text-decoration:none;font-weight:900;line-height:1.25;font-size:.94rem}.hq-meta{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}.hq-pill{display:inline-flex;align-items:center;min-height:26px;border-radius:999px;background:#f1ede5;padding:4px 8px;font-size:.68rem;font-weight:850}.hq-pill.good{background:#e4f2e9;color:#176a3b}.hq-pill.ok{background:#fff1d9;color:#8b5d0c}.hq-pill.over{background:#f7e2e4;color:#9d2430}.hq-price{font-weight:900;font-size:.92rem;margin:5px 0}.hq-note{font-size:.72rem;color:#74797d;line-height:1.4}.hq-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.hq-book{display:inline-flex;align-items:center;justify-content:center;min-height:34px;border-radius:999px;background:#176a3b;color:#fff!important;text-decoration:none;padding:6px 10px;font-size:.72rem;font-weight:900}.hq-existing-quality{display:inline-flex;margin:0 0 7px;padding:5px 8px;border-radius:999px;background:#e4f2e9;color:#176a3b;font-size:.68rem;font-weight:900}.hq-policy-note{margin-top:8px;padding:8px 10px;border-radius:12px;background:#f5efe4;font-size:.7rem;color:#555}.hq-triptools-note{color:#176a3b!important;font-weight:800!important}
@media(max-width:620px){.hq-wrap{padding:11px;margin:8px auto 14px}.hq-grid{grid-template-columns:1fr}.hq-head h2{font-size:1.12rem}.hq-card{padding:10px}.hq-name{font-size:.9rem}}
`;document.head.appendChild(s)}
function markOldCards(id){
 $$('.hotelcard,.hotel-card,[data-hotel-name]').forEach(card=>{
  if(card.closest('#hqHotelOptions,#lpr2TicketSummary'))return;
  const h=$('h3,h2',card),name=(card.dataset.hotelName||h?.textContent||'').replace(/↗/g,'').trim();if(!name)return;
  const m=meta(id,name);card.classList.toggle('hq-unapproved',!m);if(!m)return;
  if(!$('.hq-existing-quality',card)){const badge=document.createElement('span');badge.className='hq-existing-quality';badge.textContent=reviewLabel(m);(h||card).insertAdjacentElement(h?'afterend':'afterbegin',badge)}
 })
}
function cardHtml(m,h,best){const b=budgetBand(h),book=bookingUrl(m.name,tripId());const price=h?.status==='live'&&Number(h.totalTHB)>0?`<div class="hq-price">฿${fmt(h.totalTHB)} / ${Number(h.nights)||'?'} คืน <span class="hq-note">• ฿${fmt(h.nightlyTHB)}/คืน</span></div>`:`<div class="hq-price">ยังไม่มีราคาสด</div>`;return`<article class="hq-card${best?' hq-best':''}" data-hotel-name="${esc(m.name)}"><a class="hq-name" href="${esc(book)}" target="_blank" rel="noopener noreferrer">${esc(m.name)} ↗</a><div class="hq-note">${esc(m.area)}${m.stars?' • '+m.stars+'-star hotel':''}</div><div class="hq-meta"><span class="hq-pill good">${esc(reviewLabel(m))}</span><span class="hq-pill ${b===0?'good':b===1?'ok':b===3?'over':''}">${esc(bandLabel(h))}</span></div>${price}<div class="hq-note">${esc(m.source)} • เป้าราคารวม ≤10K / ยอมรับได้ถึง 15K</div><div class="hq-actions"><a class="hq-book" href="${esc(book)}" target="_blank" rel="noopener noreferrer">จอง / ดูราคา ↗</a></div></article>`}
function renderTripHotels(){const id=tripId();if(!id)return;style();markOldCards(id);const data=currentData(id),arr=sortWithPrice(data,id);let box=$('#hqHotelOptions');if(!box){box=document.createElement('section');box.id='hqHotelOptions';box.className='hq-wrap';const stay=$('#stay');if(stay)stay.insertAdjacentElement('afterend',box);else{const main=$('main')||document.body;main.insertAdjacentElement('afterbegin',box)}}box.innerHTML=`<div class="hq-head"><div><div class="hq-sub">REVIEW ≥ 4★ • BUDGET-FIRST</div><h2>🏨 โรงแรมแนะนำ • ${esc(LABEL[id])}</h2><div class="hq-sub">คัดเฉพาะโรงแรมรีวิวดี • เลือกราคาสด ≤10,000 บาทก่อน และยอมรับได้ถึงประมาณ 15,000 บาท</div></div></div><div class="hq-grid">${arr.map((m,i)=>cardHtml(m,matchResult(data,id,m.name),i===0)).join('')}</div><div class="hq-policy-note">↻ หลังเช็กราคา ระบบจะจัดตัวเลือกตามยอดรวมจริงของวันที่ทริป • ถ้าเกิน 15K จะไม่ถือเป็นตัวเลือกหลัก</div>`}
function cleanSheet(){const id=tripId();$$('#lpr2-sheet .lpr2-group').forEach(g=>{const h=$('h3',g);if(!h||!/^🏨/.test((h.textContent||'').trim()))return;$$('.lpr2-row',g).forEach(row=>{const name=$('.lpr2-link',row)?.textContent?.trim()||'';if(name&&!approved(id||ROUTES.find(x=>meta(x,name)),name))row.remove();else if(name){const rid=id||ROUTES.find(x=>approved(x,name)),m=meta(rid,name),p=$('.lpr2-price',row),total=currentData(rid)?.hotels?.find(x=>norm(x.name)===norm(name))?.totalTHB;if(m&&!$('.hq-sheet-review',row)){const x=document.createElement('div');x.className='lpr2-muted hq-sheet-review';x.textContent=`${reviewLabel(m)} • ${total?bandLabel({status:'live',totalTHB:total}):'ผ่านเกณฑ์รีวิว'}`;(p||$('.lpr2-link',row))?.insertAdjacentElement('afterend',x)}}})})}
function patchTripTools(){const root=$('#tt-overlay');if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes){let t=n.nodeValue||'',next=t;for(const [oldName,newName] of Object.entries(REPLACE))if(next.includes(oldName))next=next.split(oldName).join(newName);if(next!==t)n.nodeValue=next}}
function apply(){cleanStored();renderTripHotels();cleanSheet();patchTripTools()}
window.addEventListener('travelhub:trip-price-updated',()=>setTimeout(apply,20));
window.addEventListener('storage',e=>{if([LIVE_KEY,TRIP_KEY,STATE_KEY,TT_KEY].includes(e.key||''))setTimeout(apply,40)});
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{renderTripHotels();cleanSheet();patchTripTools()},100)}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,100),{once:true});else setTimeout(apply,40);
})();