(()=>{
'use strict';
if(window.__tripLiveBudgetSyncV1)return;window.__tripLiveBudgetSyncV1=true;

const TRIP_KEY='travelHubTripPricesV1';
const LIVE_KEY='travelHubLivePricesV2';
const ROUTES=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];
const CURRENT_HOTEL={
  tokyo:'APA Hotel Asakusa Tawaramachi-Ekimae',
  kansai:'Sotetsu Fresa Inn Osaka-Namba',
  hongkong:'Ramada Grand Tsim Sha Tsui',
  danang:'HAIAN Beach Hotel & Spa + Little Riverside Hoi An',
  yunnan:'Kunming + Dali hotel options',
  chongqing:'Jiefangbei hotel options',
  harbin:'Harbin + Yabuli hotel options'
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0});
function load(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
function id(){return ROUTES.find(x=>location.pathname.includes('/'+x+'/'))||''}
function money(t){const s=String(t||'').replace(/[^0-9.]/g,'');return Number(s)||0}
function stamp(iso){if(!iso)return'ยังไม่เคยเช็ก';const d=new Date(iso);if(Number.isNaN(d.getTime()))return'ยังไม่เคยเช็ก';return d.toLocaleString('th-TH',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
function dataFor(trip){
  const byTrip=load(TRIP_KEY,{})||{};
  if(byTrip[trip])return byTrip[trip];
  const all=load(LIVE_KEY,null);if(!all)return null;
  const hotels=(all.hotels||[]).filter(x=>x.tripId===trip),tickets=(all.tickets||[]).filter(x=>x.tripId===trip);
  if(!hotels.length&&!tickets.length)return null;
  return{tripId:trip,checkedAt:all.checkedAtByTrip?.[trip]||all.checkedAt||'',hotels,tickets,fx:all.fx||null};
}
function hkMode(){return localStorage.getItem('hk-trip-mode')==='5d4n'?'5d4n':'6d5n'}
function baseDays(trip){return trip==='hongkong'&&hkMode()==='5d4n'?{days:5,nights:4}:{days:6,nights:5}}
function setBase(item){
  const amount=$('.px-bg-money',item);if(!amount)return;
  if(!item.dataset.liveBudgetBase)item.dataset.liveBudgetBase=String(money(amount.textContent));
  if(!item.dataset.liveBudgetDesc){const d=$('.px-bg-desc',item);item.dataset.liveBudgetDesc=d?.textContent||''}
}
function baseValue(item){setBase(item);return Number(item.dataset.liveBudgetBase)||0}
function setAmount(item,value,label='ESTIMATE'){
  const el=$('.px-bg-money',item);if(!el)return;el.textContent=`~${fmt(value)} ฿`;el.dataset.priceKind=label;
}
function setDesc(item,text){const el=$('.px-bg-desc',item);if(el)el.textContent=text}
function category(item){return ($('.px-bg-name',item)?.textContent||'').trim()}
function bestHotel(data){return(data?.hotels||[]).filter(x=>x.status==='live'&&Number(x.totalTHB)>0).sort((a,b)=>Number(a.totalTHB)-Number(b.totalTHB))[0]||null}
function ticketCalc(data){
  const all=data?.tickets||[],live=all.filter(x=>x.status==='live'&&Number(x.minTHB)>0);
  if(!all.length)return{complete:false,count:0,total:0,names:[]};
  return{complete:live.length===all.length,count:live.length,total:live.reduce((s,x)=>s+Number(x.minTHB||0)*2,0),names:live.map(x=>x.name)};
}
function updateBudget(){
  const trip=id(),sec=$('#trip-budget-breakdown');if(!trip||!sec)return;
  const data=dataFor(trip),when=data?.checkedAt||'';
  const dn=baseDays(trip),items=$$('.px-bg-item',sec);if(!items.length)return;
  let total=0,liveParts=0;
  const hotel=bestHotel(data),tickets=ticketCalc(data);
  for(const item of items){
    setBase(item);const name=category(item),base=baseValue(item);let value=base;
    if(/โรงแรม/i.test(name)){
      if(hotel){value=Number(hotel.totalTHB);liveParts++;setAmount(item,value,'LIVE');setDesc(item,`LIVE • ${hotel.name} • ${hotel.nights||dn.nights} คืน • เช็ก ${stamp(when)} • ${hotel.source||'current source'}`)}
      else{
        if(trip==='hongkong'&&hkMode()==='5d4n')value=Math.round(base*4/5);
        setAmount(item,value,'ESTIMATE');setDesc(item,`ESTIMATE • ตัวเลือกปัจจุบัน: ${CURRENT_HOTEL[trip]||'โรงแรมในแพลน'} • ${dn.nights} คืน • ตั้งวันแล้วกด ↻ เพื่ออัปเดตราคาจริง`)
      }
    }else if(/ตั๋ว.*กิจกรรม|กิจกรรม.*ตั๋ว/i.test(name)){
      if(tickets.complete&&tickets.count){value=Math.round(tickets.total);liveParts++;setAmount(item,value,'LIVE');setDesc(item,`LIVE • 2 คน • ${tickets.names.join(' + ')} • เช็ก ${stamp(when)}`)}
      else{setAmount(item,value,'ESTIMATE');const extra=tickets.count?` • ตรวจสดได้ ${tickets.count}/${data?.tickets?.length||tickets.count} รายการ`:' ';setDesc(item,`ESTIMATE • ใช้งบวางแผนเดิมจนกว่าจะตรวจตั๋วที่จำเป็นได้ครบ${extra}`)}
    }else if(/อาหาร/i.test(name)&&trip==='hongkong'&&hkMode()==='5d4n'){
      value=Math.round(base*5/6);setAmount(item,value,'ESTIMATE');setDesc(item,`ESTIMATE • ${dn.days} วัน • 2 คน • ปรับตามโหมด ${hkMode().toUpperCase()}`)
    }else{
      setAmount(item,value,'ESTIMATE');
      const original=item.dataset.liveBudgetDesc||'';
      if(original&&!/LIVE|ESTIMATE/.test(original))setDesc(item,`ESTIMATE • ${original}`)
    }
    item.dataset.liveBudgetValue=String(value);total+=value;
  }
  const totalEl=$('.px-bg-total b',sec);if(totalEl)totalEl.textContent=`${fmt(total)} ฿`;
  let status=$('.tlbs-budget-status',sec);if(!status){status=document.createElement('div');status.className='px-bg-note tlbs-budget-status';const wrap=$('.px-wrap',sec)||sec;wrap.appendChild(status)}
  status.innerHTML=when?`↻ อัปเดตงบจากผลเช็กล่าสุด <b>${stamp(when)}</b> • ใช้ราคา LIVE ${liveParts} หมวด และคงหมวดที่ไม่มีแหล่งสดเป็น ESTIMATE`:`↻ ยังไม่มีผลราคาสดของทริปนี้ • ตัวเลขเป็น ESTIMATE และจะอัปเดตอัตโนมัติหลังเช็กราคา`;
}
function compactTickets(){
  const box=$('#lpr2TicketSummary');if(!box)return;
  const head=$('h3',box),grid=$('.lpr2-hotel-grid',box);if(!head||!grid)return;
  if(!box.dataset.ticketOpen)box.dataset.ticketOpen='0';
  grid.hidden=box.dataset.ticketOpen!=='1';
  head.classList.add('tlbs-ticket-head');head.setAttribute('role','button');head.setAttribute('tabindex','0');head.setAttribute('aria-expanded',box.dataset.ticketOpen==='1'?'true':'false');
  const label=box.dataset.ticketOpen==='1'?'⌃':'⌄';head.innerHTML=`🎟️ ราคา / ลิงก์ตั๋ว <span class="tlbs-chevron">${label}</span>`;
  const toggle=()=>{box.dataset.ticketOpen=box.dataset.ticketOpen==='1'?'0':'1';compactTickets()};
  head.onclick=toggle;head.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}};
}
function style(){if($('#tlbs-style'))return;const s=document.createElement('style');s.id='tlbs-style';s.textContent=`
#lpr2TicketSummary{padding:10px 13px!important}.tlbs-ticket-head{margin:0!important;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;min-height:38px;user-select:none}.tlbs-chevron{display:grid;place-items:center;width:28px;height:28px;border-radius:999px;background:#f3efe6;font-size:16px}.px-bg-money[data-price-kind="LIVE"]{color:#176a3b!important}.px-bg-money[data-price-kind="ESTIMATE"]{color:#b21f2d!important}.tlbs-budget-status{background:#eef4f0!important;color:#355e48!important}
`;document.head.appendChild(s)}
function apply(){style();compactTickets();updateBudget()}
function refreshWatch(){let n=0;const t=setInterval(()=>{apply();if(++n>18)clearInterval(t)},500)}
document.addEventListener('click',e=>{if(e.target.closest?.('#tripPriceRefreshBtn,#appRefreshBtn,.lpr2-refresh'))refreshWatch()},true);
window.addEventListener('storage',e=>{if([TRIP_KEY,LIVE_KEY,'hk-trip-mode'].includes(e.key||''))apply()});
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,120)}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,250),{once:true});else setTimeout(apply,120);
})();