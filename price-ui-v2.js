(()=>{
'use strict';
if(window.__priceUiV2)return;window.__priceUiV2=true;

const API='https://travel-hub-api.mlrkdee44.workers.dev';
const KEY='travelHubLivePricesV1';
const STATE_KEY='travelHubStateV2';
const ROUTES=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];
const LABELS={tokyo:'🇯🇵 Tokyo',kansai:'🇯🇵 Kansai',hongkong:'🇭🇰 Hong Kong',danang:'🇻🇳 Da Nang + Hoi An',yunnan:'🇨🇳 Yunnan',chongqing:'🇨🇳 Chongqing',harbin:'🇨🇳 Harbin'};
const HOTELS={
  tokyo:[
    {name:'APA Hotel Asakusa Tawaramachi-Ekimae',area:'Asakusa / Tawaramachi',full:true}
  ],
  kansai:[
    {name:'Sotetsu Fresa Inn Osaka Namba',area:'Namba • ใกล้ Osaka-Namba',full:true},
    {name:'Hotel Royal Classic Osaka',area:'Namba Station',full:true}
  ],
  hongkong:[
    {name:'Silka Far East Hotel',area:'Tsuen Wan',full:true},
    {name:'Ramada Grand Tsim Sha Tsui',area:'Jordan / Tsim Sha Tsui',full:true},
    {name:'Silka Tsuen Wan, Hong Kong',area:'Kwai Chung / Tsuen Wan',full:true},
    {name:'Dorsett Mongkok, Hong Kong',area:'Olympic / Mong Kok',full:true}
  ],
  danang:[
    {name:'HAIAN Beach Hotel & Spa',area:'Da Nang • My Khe Beach',segments:[[0,3,'Da Nang • 3 คืน']]},
    {name:'Little Riverside Hoi An',area:'Hoi An',segments:[[3,5,'Hoi An • 2 คืน']]}
  ],
  yunnan:[
    {name:'Atour X Hotel Kunming Old Street Wuyi Road',area:'Kunming Old Street',segments:[[0,2,'Kunming • 2 คืนแรก'],[4,5,'Kunming • คืนสุดท้าย']]},
    {name:'Z.Garden',area:'Dali Ancient City South Gate',segments:[[2,4,'Dali • 2 คืน']]}
  ],
  chongqing:[
    {name:'Atour Hotel Chongqing Jiefangbei',area:'Jiefangbei',full:true},
    {name:'Chongqing Jiefangbei Jiayu Hotel',area:'Jiefangbei / Hongya Cave',full:true}
  ],
  harbin:[
    {name:'Four Points by Sheraton Harbin City Center',area:'Harbin Central Street',segments:[[0,2,'Harbin • 2 คืนแรก'],[4,5,'Harbin • คืนสุดท้าย']]},
    {name:'Club Med Yabuli',area:'Yabuli Ski Resort',segments:[[2,3,'Yabuli • 1 คืน']]},
    {name:'Xuexiang Zhanglicheng Homestay',area:'China Snow Town / Xuexiang',segments:[[3,4,'Snow Town • 1 คืน']]}
  ]
};

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9ก-๙一-龥]+/g,' ').trim();
const fmt=n=>Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0});
function read(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
function tripId(){const p=location.pathname;return ROUTES.find(x=>p.includes('/'+x+'/'))||''}
function isDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(String(s||''))}
function plusDays(s,n){if(!isDate(s))return'';const d=new Date(s+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function checkedText(iso){if(!iso)return'ยังไม่เคยเช็ก';const d=new Date(iso);if(Number.isNaN(d.getTime()))return'ยังไม่เคยเช็ก';return d.toLocaleString('th-TH',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
function bookingUrl(name,start='',end=''){
  const q=new URLSearchParams({ss:name,group_adults:'2',group_children:'0',no_rooms:'1'});
  if(isDate(start))q.set('checkin',start);if(isDate(end))q.set('checkout',end);
  return'https://www.booking.com/searchresults.html?'+q.toString();
}
function safeUrl(u){try{const x=new URL(String(u||''),location.href);return /^https?:$/.test(x.protocol)?x.href:''}catch{return''}}

function ensureStyle(){
  if(document.getElementById('pui-v2-style'))return;
  const s=document.createElement('style');s.id='pui-v2-style';s.textContent=`
.pui-refreshbar{width:min(1100px,calc(100% - 22px));margin:10px auto 2px;padding:8px 10px;border:1px solid #00000010;background:#fff;border-radius:16px;display:flex;align-items:center;gap:10px;justify-content:space-between;box-shadow:0 7px 22px #0000000c;position:relative;z-index:39;font-family:'Noto Sans Thai',system-ui,sans-serif}.pui-refresh-btn{border:0;border-radius:999px;background:#b21f2d;color:#fff;padding:9px 13px;font:900 12px 'Noto Sans Thai',system-ui;white-space:nowrap;cursor:pointer;display:inline-flex!important;align-items:center;gap:6px}.pui-refresh-btn[disabled]{opacity:.72}.pui-refresh-btn.loading .pui-spin{display:inline-block;animation:puiSpin .75s linear infinite}.pui-refresh-note{min-width:0;color:#73787c;font-size:.72rem;line-height:1.35;text-align:right}.pui-refresh-note b{color:#1e2428}@keyframes puiSpin{to{transform:rotate(360deg)}}
#pui-price-sheet{position:fixed;inset:0;z-index:15000;background:#1119;backdrop-filter:blur(8px);display:none;align-items:flex-end;justify-content:center;padding:10px}#pui-price-sheet.open{display:flex}.pui-sheet-panel{width:min(720px,100%);max-height:89dvh;overflow:auto;background:#faf8f3;border-radius:26px 26px 18px 18px;padding:14px;box-shadow:0 30px 90px #0005;font-family:'Noto Sans Thai',system-ui}.pui-sheet-head{position:sticky;top:-14px;background:#faf8f3f5;backdrop-filter:blur(8px);z-index:2;padding:10px 2px 11px;display:flex;align-items:center;justify-content:space-between;gap:12px}.pui-sheet-head h2{margin:2px 0;font-size:1.2rem}.pui-close{border:0;width:38px;height:38px;border-radius:50%;background:#fff;font-size:20px}.pui-status{padding:10px 11px;border-radius:14px;background:#e8f5ed;color:#176a3b;font-size:.77rem;font-weight:900;margin-bottom:10px}.pui-status.warn{background:#fff1cf;color:#805600}.pui-group{background:#fff;border:1px solid #0001;border-radius:18px;padding:12px;margin:9px 0}.pui-group h3{font-size:.95rem;margin:0 0 6px}.pui-row{padding:9px 0;border-top:1px dashed #0002}.pui-row:first-of-type{border-top:0}.pui-row-name{font-weight:900;line-height:1.35}.pui-price{font-weight:900;color:#176a3b;font-size:.93rem}.pui-muted{color:#74797d;font-size:.72rem;line-height:1.4}.pui-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.pui-book,.pui-source{display:inline-flex;align-items:center;padding:6px 9px;border-radius:999px;text-decoration:none!important;font-size:.7rem;font-weight:900}.pui-book{background:#176a3b;color:#fff!important}.pui-source{background:#f3efe6;color:#5c4b2f!important}.pui-hotel-options{width:min(1100px,calc(100% - 22px));margin:14px auto 28px;background:#fff;border:1px solid #0001;border-radius:20px;padding:14px;font-family:'Noto Sans Thai',system-ui;box-shadow:0 10px 28px #0000000b}.pui-hotel-options h3{margin:2px 0 4px}.pui-hotel-options-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:10px}.pui-hotel-option{border:1px solid #0001;border-radius:15px;padding:11px;background:#faf9f6}.pui-hotel-option b{display:block;line-height:1.3;font-size:.91rem}.pui-hotel-option .pui-actions{margin-top:7px}
[data-pui-trip="hongkong"] .hotelcard{border-radius:20px!important}[data-pui-trip="hongkong"] .hotelcard img{height:180px!important}[data-pui-trip="hongkong"] .hotelcard .pad{padding:14px 15px!important}[data-pui-trip="hongkong"] .hotelcard .ey{font-size:.68rem!important;letter-spacing:.09em!important}[data-pui-trip="hongkong"] .hotelcard h3{font-size:clamp(1.24rem,5.4vw,1.58rem)!important;line-height:1.22!important;margin:5px 0 7px!important;letter-spacing:-.02em!important;overflow-wrap:anywhere}[data-pui-trip="hongkong"] .hotelcard p{font-size:.92rem!important;line-height:1.42!important;margin:0 0 8px!important}[data-pui-trip="hongkong"] .hotelcard .hotelmeta{gap:6px!important;margin:7px 0 9px!important;align-items:center}[data-pui-trip="hongkong"] .hotelcard .badge{font-size:.66rem!important;padding:5px 8px!important}[data-pui-trip="hongkong"] .hotelcard .sidebox{padding:11px 12px!important;border-radius:15px!important;margin:8px 0!important}[data-pui-trip="hongkong"] .hotelcard .sidebox>b{font-size:.92rem!important;line-height:1.35!important;display:block}[data-pui-trip="hongkong"] .hotelcard .small{font-size:.75rem!important;line-height:1.45!important}[data-pui-trip="hongkong"] .hotelcard .map{font-size:.75rem!important;padding:6px 9px!important}[data-pui-trip="hongkong"] .hotelcard .lpr-book-cta{margin:0!important;padding:6px 9px!important;font-size:.7rem!important}.pui-card-source{display:inline-flex;margin-top:6px;font-size:.69rem;font-weight:800;color:#6b655a;text-decoration:none;border-bottom:1px dashed #aaa}
@media(max-width:560px){.pui-refreshbar{width:calc(100% - 18px);padding:8px}.pui-refresh-note{font-size:.67rem}.pui-hotel-options{width:calc(100% - 18px);padding:12px}.pui-hotel-options-grid{grid-template-columns:1fr}[data-pui-trip="hongkong"] .staygrid{gap:10px!important}[data-pui-trip="hongkong"] .hotelcard img{height:158px!important}[data-pui-trip="hongkong"] .hotelcard .pad{padding:13px 14px!important}[data-pui-trip="hongkong"] .hotelcard h3{font-size:1.28rem!important}[data-pui-trip="hongkong"] .hotelcard p{font-size:.86rem!important}[data-pui-trip="hongkong"] .hotelcard .sidebox>b{font-size:.88rem!important}}
  `;document.head.appendChild(s)
}

function sheet(){
  let x=document.getElementById('pui-price-sheet');if(x)return x;
  x=document.createElement('div');x.id='pui-price-sheet';x.innerHTML='<div class="pui-sheet-panel"><div class="pui-sheet-head"><div><div class="pui-muted">LIVE PRICE REFRESH</div><h2>ราคาปัจจุบัน</h2></div><button class="pui-close" type="button">×</button></div><div id="pui-sheet-body"></div></div>';
  document.body.appendChild(x);x.querySelector('.pui-close').onclick=()=>x.classList.remove('open');x.onclick=e=>{if(e.target===x)x.classList.remove('open')};return x
}
function showLoading(){const x=sheet(),b=x.querySelector('#pui-sheet-body');b.innerHTML='<div class="pui-status warn">⏳ กำลังเช็กโรงแรม • ตั๋ว • ค่าเงินจากแหล่งปัจจุบัน…</div><div class="pui-muted">หากทริปยังไม่ได้ตั้งวัน โรงแรมจะแสดงว่าต้องกำหนดวันก่อน โดยจะไม่เดาราคาเอง</div>';x.classList.add('open')}
function setBusy(on){document.querySelectorAll('.pui-refresh-btn,#appRefreshBtn').forEach(b=>{b.disabled=on;b.classList.toggle('loading',on);if(b.classList.contains('pui-refresh-btn'))b.innerHTML=on?'<span class="pui-spin">↻</span> กำลังเช็ก…':'<span>↻</span> เช็กราคาล่าสุด'})}

function stateDates(id){const st=read(STATE_KEY,{})||{},x=st[id]||{};return{start:String(x.start||''),end:String(x.end||'')}}
function hotelRequests(){
  const reqs=[];
  for(const id of ROUTES){const d=stateDates(id);for(const h of HOTELS[id]||[]){
    if(h.full){reqs.push({tripId:id,name:h.name,start:d.start,end:d.end,_area:h.area,_label:'ตลอดทริป'});continue}
    if(!isDate(d.start)||!isDate(d.end)){reqs.push({tripId:id,name:h.name,start:'',end:'',_area:h.area,_label:'ต้องตั้งวันเดินทางก่อน'});continue}
    for(const [a,b,label] of h.segments||[])reqs.push({tripId:id,name:h.name,start:plusDays(d.start,a),end:plusDays(d.start,b),_area:h.area,_label:label})
  }}
  return reqs.slice(0,20)
}
function resultMeta(requests,r){return requests.find(x=>x.tripId===r.tripId&&x.name===r.name&&x.start===r.start&&x.end===r.end)||requests.find(x=>x.tripId===r.tripId&&x.name===r.name)||null}

function render(data,requests){
  const current=tripId(),ids=current?[current]:ROUTES,b=sheet().querySelector('#pui-sheet-body');let html=`<div class="pui-status">✅ เช็กล่าสุด ${esc(checkedText(data.checkedAt))} • เฉพาะราคาที่ตรวจได้รอบนี้เท่านั้นที่ถือว่า Live</div>`;
  if(data.fx?.status==='live')html+=`<div class="pui-group"><h3>💱 ค่าเงิน</h3><div class="pui-row">HKD → THB <b>${Number(data.fx.ratesToTHB?.HKD||0).toFixed(3)}</b> • JPY → THB <b>${Number(data.fx.ratesToTHB?.JPY||0).toFixed(3)}</b> • CNY → THB <b>${Number(data.fx.ratesToTHB?.CNY||0).toFixed(3)}</b></div></div>`;
  for(const id of ids){const hs=(data.hotels||[]).filter(x=>x.tripId===id),ts=(data.tickets||[]).filter(x=>x.tripId===id);if(!hs.length&&!ts.length)continue;html+=`<div class="pui-group"><h3>${esc(LABELS[id]||id)}</h3>`;
    for(const h of hs){const m=resultMeta(requests,h),book=bookingUrl(h.name,h.start,h.end),source=safeUrl(h.sourceUrl);html+=`<div class="pui-row"><div class="pui-row-name">🏨 ${esc(h.name)}</div><div class="pui-muted">${esc(m?._area||'')} ${m?._label?'• '+esc(m._label):''}${h.start&&h.end?' • '+esc(h.start)+' → '+esc(h.end):''}</div>`;
      if(h.status==='live')html+=`<div class="pui-price">฿${fmt(h.nightlyTHB)}/คืน • ${h.nights} คืน ≈ ฿${fmt(h.totalTHB)}</div><div class="pui-muted">${h.estimatedTotal?'ยอดรวมประมาณจากเรทราคาที่พบ':'ยอดรวมจากหน้าราคา'} • ${esc(h.source||'')}</div>`;
      else if(h.status==='needs_dates')html+='<div class="pui-muted">⚠️ ต้องตั้งวันเริ่ม–วันกลับก่อน จึงจะตรวจราคาโรงแรมตามวันจริงได้</div>';
      else html+='<div class="pui-muted">ตรวจราคาสดไม่ได้ในรอบนี้ • ไม่ใช้ราคาเก่าแทน Live</div>';
      html+=`<div class="pui-actions"><a class="pui-book" target="_blank" rel="noopener noreferrer" href="${esc(book)}">ดูราคา / จอง ↗</a>${source?`<a class="pui-source" target="_blank" rel="noopener noreferrer" href="${esc(source)}">แหล่งราคาที่ตรวจ ↗</a>`:''}</div></div>`
    }
    for(const t of ts){const src=safeUrl(t.sourceUrl);html+=`<div class="pui-row"><div class="pui-row-name">🎟️ ${esc(t.name)}</div>`;if(t.status==='live')html+=`<div class="pui-price">${esc(t.currency)} ${fmt(t.minPrice)}${t.maxPrice!==t.minPrice?' – '+fmt(t.maxPrice):''}${t.minTHB?' • ≈ ฿'+fmt(t.minTHB)+(t.maxTHB!==t.minTHB?' – ฿'+fmt(t.maxTHB):''):''}</div>`;else html+='<div class="pui-muted">ยังยืนยันราคาปัจจุบันจากแหล่งนี้ไม่ได้</div>';if(src)html+=`<div class="pui-actions"><a class="pui-book" target="_blank" rel="noopener noreferrer" href="${esc(src)}">ดูราคา / จอง Official ↗</a></div>`;html+='</div>'}
    html+='</div>'
  }
  b.innerHTML=html;sheet().classList.add('open')
}

async function refresh(){
  if(!navigator.onLine){const b=sheet().querySelector('#pui-sheet-body');b.innerHTML='<div class="pui-status warn">Offline • ยังเช็กราคาปัจจุบันไม่ได้</div>';sheet().classList.add('open');return}
  const requests=hotelRequests();showLoading();setBusy(true);
  try{
    const r=await fetch(API+'/api/prices/refresh',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tripIds:ROUTES,hotels:requests.map(({_area,_label,...x})=>x)}),cache:'no-store'});
    let data={};try{data=await r.json()}catch{}
    if(!r.ok||!data.ok)throw new Error(data.error||('HTTP '+r.status));
    data.hotels=(data.hotels||[]).map(h=>({...h,checkedAt:data.checkedAt}));data.tickets=(data.tickets||[]).map(t=>({...t,checkedAt:data.checkedAt}));
    localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent('travelHubPricesUpdated',{detail:data}));render(data,requests);applyCards(data,requests);updateRefreshNote(data.checkedAt)
  }catch(e){console.error('[price ui v2]',e);const b=sheet().querySelector('#pui-sheet-body');b.innerHTML=`<div class="pui-status warn">เช็กราคาไม่สำเร็จในรอบนี้</div><div class="pui-muted">${esc(e?.message||'กรุณาลองใหม่อีกครั้ง')} • ราคาเดิมจะไม่ถูกเปลี่ยนเป็น Live</div>`;sheet().classList.add('open')}
  finally{setBusy(false)}
}

function updateRefreshNote(iso){document.querySelectorAll('.pui-refresh-note').forEach(x=>x.innerHTML=`โรงแรม • ตั๋ว • ค่าเงิน<br><b>${esc(iso?'ล่าสุด '+checkedText(iso):'กดเพื่อเช็กตอนนี้')}</b>`)}
function ensureRefreshBar(){const id=tripId();if(!id||document.querySelector('.pui-refreshbar'))return;const bar=document.createElement('div');bar.className='pui-refreshbar';bar.innerHTML='<button class="pui-refresh-btn" type="button"><span>↻</span> เช็กราคาล่าสุด</button><div class="pui-refresh-note">โรงแรม • ตั๋ว • ค่าเงิน<br><b>กดเพื่อเช็กตอนนี้</b></div>';const nav=document.querySelector('.nav');(nav||document.body.firstElementChild)?.insertAdjacentElement(nav?'afterend':'beforebegin',bar);bar.querySelector('button').addEventListener('click',refresh);const old=read(KEY);if(old?.checkedAt)updateRefreshNote(old.checkedAt)}
function wireRoot(){const b=document.getElementById('appRefreshBtn');if(!b||b.dataset.puiV2==='1')return;b.dataset.puiV2='1';b.removeAttribute('onclick');b.setAttribute('aria-label','เช็กราคาล่าสุดทั้งหมด');b.title='เช็กราคาโรงแรม ตั๋ว และค่าเงินล่าสุด';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();refresh()},true)}

function ensureHotelOptions(){const id=tripId();if(!['kansai','yunnan','chongqing','harbin'].includes(id)||document.getElementById('pui-hotel-options'))return;const arr=HOTELS[id]||[];if(!arr.length)return;const box=document.createElement('section');box.className='pui-hotel-options';box.id='pui-hotel-options';box.innerHTML=`<div class="pui-muted">LIVE HOTEL OPTIONS</div><h3>🏨 โรงแรมตัวเลือกที่เช็กราคาได้</h3><div class="pui-muted">เลือกไว้เป็นตัวจริงสำหรับเปรียบเทียบราคา • กด ↻ ด้านบนเพื่อเช็กราคาตามวันเดินทาง</div><div class="pui-hotel-options-grid">${arr.map(h=>{const d=stateDates(id),seg=h.full?[d.start,d.end]:['',''];const u=bookingUrl(h.name,seg[0],seg[1]);return`<article class="pui-hotel-option" data-pui-hotel="${esc(h.name)}"><b>${esc(h.name)}</b><div class="pui-muted">${esc(h.area||'')}</div><div class="pui-actions"><a class="pui-book" target="_blank" rel="noopener noreferrer" href="${esc(u)}">ดูราคา / จอง ↗</a></div></article>`}).join('')}</div>`;const main=document.querySelector('main');if(!main)return;const stay=[...main.querySelectorAll('section')].find(s=>/STAY BASE|พัก|โรงแรม/i.test(s.textContent||''));if(stay)stay.insertAdjacentElement('afterend',box);else main.insertAdjacentElement('afterbegin',box)}

function findResult(data,name,id){const k=norm(name),arr=(data?.hotels||[]).filter(x=>x.tripId===id);return arr.find(x=>{const n=norm(x.name);return n===k||n.includes(k)||k.includes(n)})||null}
function applyCards(data=read(KEY),requests=hotelRequests()){
  const id=tripId();if(!id||!data)return;
  for(const card of document.querySelectorAll('.hotelcard,.hotel-card,[data-hotel-name]')){const title=card.querySelector('h3,h2');if(!title)continue;const name=(card.getAttribute('data-hotel-name')||title.textContent||'').trim(),h=findResult(data,name,id),m=h?resultMeta(requests,h):null;const start=h?.start||'',end=h?.end||'',book=bookingUrl(name,start,end);card.dataset.puiBook=book;
    let cta=card.querySelector('.lpr-book-cta');if(cta){cta.textContent='ดูราคา / จอง ↗';cta.href=book;cta.dataset.puiBook=book}
    if(h?.sourceUrl){let a=card.querySelector('.pui-card-source');if(!a){a=document.createElement('a');a.className='pui-card-source';a.target='_blank';a.rel='noopener noreferrer';const host=card.querySelector('.lpr-live-price')||card.querySelector('.sidebox')||card.querySelector('.hotelmeta')||title;host.insertAdjacentElement('afterend',a)}a.href=safeUrl(h.sourceUrl);a.textContent='แหล่งราคาที่ตรวจ ↗'}
    if(h?.status==='live'){let box=card.querySelector('.lpr-live-price');if(!box){box=document.createElement('div');box.className='lpr-live-price';(card.querySelector('.hotelmeta')||title).insertAdjacentElement('afterend',box)}box.innerHTML=`<span class="lpr-live-badge">LIVE</span><b>฿${fmt(h.nightlyTHB)}/คืน</b><div class="lpr-muted">${m?esc(m._label)+' • ':''}${h.nights} คืน ≈ ฿${fmt(h.totalTHB)} • เช็ก ${esc(checkedText(data.checkedAt))}</div>`}
  }
}

function interceptBookingClicks(){document.addEventListener('click',e=>{const a=e.target.closest?.('.hotelcard .lpr-book-cta,.hotel-card .lpr-book-cta,[data-hotel-name] .lpr-book-cta');if(!a)return;const card=a.closest('.hotelcard,.hotel-card,[data-hotel-name]'),title=card?.querySelector('h3,h2'),name=(card?.getAttribute('data-hotel-name')||title?.textContent||'').trim();if(!name)return;const data=read(KEY),id=tripId(),h=findResult(data,name,id),u=bookingUrl(name,h?.start||'',h?.end||'');e.preventDefault();e.stopImmediatePropagation();window.open(u,'_blank','noopener,noreferrer')},true)}

function boot(){ensureStyle();document.documentElement.setAttribute('data-pui-trip',tripId()||'home');ensureRefreshBar();wireRoot();ensureHotelOptions();applyCards();interceptBookingClicks();let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{wireRoot();ensureRefreshBar();ensureHotelOptions();applyCards()},130)}).observe(document.body,{childList:true,subtree:true});window.addEventListener('travelHubPricesUpdated',e=>applyCards(e.detail||read(KEY)))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.travelHubRefreshPricesV2=refresh;
})();
