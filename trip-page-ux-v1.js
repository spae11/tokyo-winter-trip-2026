(()=>{
'use strict';
if(window.__tripPageUxV1)return;window.__tripPageUxV1=true;

const ROUTES=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];
const LABELS={tokyo:'Tokyo',kansai:'Kansai',hongkong:'Hong Kong',danang:'Da Nang',yunnan:'Yunnan',chongqing:'Chongqing',harbin:'Harbin'};
const TRIP_KEY='travelHubTripPricesV1',LIVE_KEY='travelHubLivePricesV2',STATE_KEY='travelHubStateV2',TT_KEY='travelToolsV1',OPEN_KEY='tripSectionOpenV1';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9ก-๙一-龥]+/g,' ').trim();
function load(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function tripId(){return ROUTES.find(x=>location.pathname.includes('/'+x+'/'))||''}
if(!tripId())return;
function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(String(v||''))?String(v):''}
function plusDays(date,n){if(!date)return'';const d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function hkNights(){return localStorage.getItem('hk-trip-mode')==='5d4n'?4:5}
function plannedNights(id){return id==='hongkong'?hkNights():5}
function tripDates(id){
  const st=load(STATE_KEY,{})||{},x=st?.[id]||st?.trips?.[id]||{};
  const tt=load(TT_KEY,{})||{};
  const start=validDate(x.start)||validDate(tt?.dates?.[id]);
  const end=validDate(x.end)||(start?plusDays(start,plannedNights(id)):'');
  return{start,end};
}
function syncTripToolDates(){
  const id=tripId();if(!id)return;
  const tt=load(TT_KEY,{})||{},start=validDate(tt?.dates?.[id]);if(!start)return;
  const end=plusDays(start,plannedNights(id)),st=load(STATE_KEY,{})||{};
  st[id]={...(st[id]||{}),start,end};
  st.trips={...(st.trips||{}),[id]:{...(st.trips?.[id]||{}),start,end}};
  save(STATE_KEY,st);
}
function bookingUrl(name,id){
  const d=tripDates(id),q=new URLSearchParams({ss:name,lang:'th',selected_currency:'THB',group_adults:'2',no_rooms:'1',group_children:'0'});
  if(d.start)q.set('checkin',d.start);if(d.end)q.set('checkout',d.end);
  return'https://www.booking.com/searchresults.html?'+q.toString();
}
function safeUrl(u){try{const x=new URL(String(u||''),location.href);return /^https?:$/.test(x.protocol)?x.href:''}catch{return''}}
function snapshot(id){
  const per=load(TRIP_KEY,{})||{};if(per[id])return per[id];
  const all=load(LIVE_KEY,null);if(!all)return null;
  const hotels=(all.hotels||[]).filter(x=>x.tripId===id),tickets=(all.tickets||[]).filter(x=>x.tripId===id);
  if(!hotels.length&&!tickets.length)return null;
  return{tripId:id,checkedAt:all.checkedAtByTrip?.[id]||all.checkedAt||'',hotels,tickets,fx:all.fx||null};
}
function resultFor(data,id,name){
  const k=norm(name);if(!k)return null;
  return(data?.hotels||[]).find(x=>x.tripId===id&&(()=>{const n=norm(x.name);return n===k||n.includes(k)||k.includes(n)})())||null;
}
function stamp(v){if(!v)return'';const d=new Date(v);if(Number.isNaN(d.getTime()))return'';return d.toLocaleString('th-TH',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
function hotelName(card){
  const raw=card.getAttribute('data-hotel-name')||$('h3,h2',card)?.textContent||'';
  return String(raw).replace(/\s*↗\s*$/,'').replace(/\s+/g,' ').trim();
}
function addSourceLink(container,source){
  let sourceLink=$('.tpux-source-link',container);
  if(source){
    if(!sourceLink){sourceLink=document.createElement('a');sourceLink.className='tpux-source-link';sourceLink.target='_blank';sourceLink.rel='noopener noreferrer';container.appendChild(sourceLink)}
    sourceLink.href=source;sourceLink.textContent='ดูแหล่งราคาที่เช็ก ↗';sourceLink.hidden=false;
  }else if(sourceLink)sourceLink.hidden=true;
}
function ensureHotelBooking(card,id,data){
  const name=hotelName(card);if(!name||/\bTBD\b/i.test(name))return;
  const book=bookingUrl(name,id),h=resultFor(data,id,name),source=safeUrl(h?.sourceUrl),title=$('h3,h2',card);
  if(title){
    let a=$('a',title);if(!a){const t=title.textContent.trim();title.textContent='';a=document.createElement('a');a.textContent=t;title.appendChild(a)}
    a.classList.add('tpux-booking-link');a.href=book;a.target='_blank';a.rel='noopener noreferrer';a.dataset.tpuxBooking='1';
  }
  let action=$('.lpr2-card-action',card);
  if(!action){action=document.createElement('div');action.className='lpr2-card-action tpux-booking-actions';const anchor=$('.hotelmeta',card)||title;anchor?.insertAdjacentElement('afterend',action)}
  let btn=$('.tpux-booking-btn',action)||$('.lpr2-cta',action);
  if(!btn){btn=document.createElement('a');action.appendChild(btn)}
  btn.className='lpr2-cta tpux-booking-btn';btn.href=book;btn.target='_blank';btn.rel='noopener noreferrer';btn.dataset.tpuxBooking='1';btn.textContent='จองโรงแรม ↗';
  addSourceLink(action,source);
  syncHotelPriceBox(card,h,data);
}
function syncHotelPriceBox(card,h,data){
  const box=$('.sidebox',card);if(!box)return;
  if(h?.status==='live'&&Number(h.nightlyTHB)>0){
    const when=stamp(h.checkedAt||data?.checkedAt),n=Number(h.nights)||plannedNights(tripId());
    const html=`<b>💰 ราคาปัจจุบันที่เช็กได้: ฿${Number(h.nightlyTHB).toLocaleString('th-TH')} / คืน</b><div class="small muted">${esc(h.source||'Current source')}${when?' • เช็ก '+esc(when):''}</div><div class="small"><b>${n} คืน ≈ ฿${Number(h.totalTHB||0).toLocaleString('th-TH')}</b>${h.estimatedTotal?' • ยอดรวมคำนวณจากเรทต่อคืน':''}</div>`;
    if(box.dataset.tpuxHtml!==html){box.innerHTML=html;box.dataset.tpuxHtml=html}
    box.dataset.tpuxPrice='live';
  }else if(!box.dataset.tpuxPrice){
    const b=$('b',box);if(b&&/ราคาที่พบล่าสุด/.test(b.textContent||''))b.textContent=(b.textContent||'').replace('ราคาที่พบล่าสุด','ตัวอย่างราคาที่เคยพบ');
    box.dataset.tpuxPrice='snapshot';
  }
}
function decorateHotelOptions(id,data){
  $$('#lpr2HotelOptions .lpr2-hotel-opt').forEach(card=>{
    const name=($('b',card)?.textContent||'').replace(/\s*↗\s*$/,'').trim();if(!name)return;
    const h=resultFor(data,id,name),source=safeUrl(h?.sourceUrl),u=bookingUrl(name,id);
    $$('a.lpr2-link,a.lpr2-cta',card).forEach(a=>{a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.dataset.tpuxBooking='1'});
    addSourceLink(card,source);
  });
}
function decorateResultSheet(id,data){
  const sheet=$('#lpr2-sheet');if(!sheet)return;
  const hotelGroup=$$('.lpr2-group',sheet).find(g=>/^🏨/.test(($('h3',g)?.textContent||'').trim()));if(!hotelGroup)return;
  $$('.lpr2-row',hotelGroup).forEach(row=>{
    const link=$('a.lpr2-link',row);if(!link)return;
    const name=(link.textContent||'').replace(/\s*↗\s*$/,'').trim();if(!name)return;
    const h=resultFor(data,id,name),source=safeUrl(h?.sourceUrl)||safeUrl(link.href),book=bookingUrl(name,id);
    link.href=book;link.target='_blank';link.rel='noopener noreferrer';link.dataset.tpuxBooking='1';link.classList.add('tpux-booking-link');
    const btn=$('a.lpr2-cta',row);if(btn){btn.href=book;btn.target='_blank';btn.rel='noopener noreferrer';btn.dataset.tpuxBooking='1';btn.textContent='จองโรงแรม ↗'}
    addSourceLink(row,source);
  });
}
function decorateHotels(){
  const id=tripId();if(!id)return;syncTripToolDates();const data=snapshot(id);
  $$('.hotelcard,.hotel-card,[data-hotel-name]').forEach(card=>ensureHotelBooking(card,id,data));
  decorateHotelOptions(id,data);decorateResultSheet(id,data);
}
function openExternalBooking(e){
  const a=e.target.closest?.('a[data-tpux-booking="1"]');if(!a)return;
  const u=safeUrl(a.href);if(!u)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const w=window.open(u,'_blank');if(!w)location.href=u;
}

const COLLAPSE_RE=/(งบประมาณ|trip budget|ช่วงที่เหมาะ|best season|checklist|ของที่ต้องเตรียม|เตรียมตัว|souvenir|ของฝาก|travel apps|แอป.*เดินทาง|ข้อมูลเสริม|before you go|tips|muslim|halal)/i;
function sectionTitle(sec){return($('h2,h3',sec)?.textContent||'').replace(/\s+/g,' ').trim()}
function topChild(root,node){let x=node;while(x&&x.parentElement&&x.parentElement!==root)x=x.parentElement;return x&&x.parentElement===root?x:null}
function stateMap(){return load(OPEN_KEY,{})||{}}
function stateKey(sec){return tripId()+':'+(sec.id||norm(sectionTitle(sec)).slice(0,60))}
function setFold(sec,open,persist=true){
  const body=$(':scope > .tpux-collapse-body',sec.querySelector(':scope > .wrap,:scope > .px-wrap')||sec),btn=$('.tpux-fold-btn',sec);if(!body||!btn)return;
  body.hidden=!open;sec.classList.toggle('tpux-collapsed',!open);btn.setAttribute('aria-expanded',String(open));btn.innerHTML=open?'ซ่อน <span>⌃</span>':'ดูรายละเอียด <span>⌄</span>';
  if(persist){const s=stateMap();s[stateKey(sec)]=open;save(OPEN_KEY,s)}
}
function makeFold(sec){
  if(!sec||sec.dataset.tpuxFold==='1'||sec.id==='lpr2TicketSummary')return;
  const title=sectionTitle(sec);if(!title||!COLLAPSE_RE.test(title))return;
  const root=sec.querySelector(':scope > .wrap,:scope > .px-wrap')||sec,titleEl=$('h2,h3',root);if(!titleEl)return;
  const head=topChild(root,titleEl)||titleEl,children=[...root.children],idx=children.indexOf(head);if(idx<0||idx===children.length-1)return;
  const body=document.createElement('div');body.className='tpux-collapse-body';head.insertAdjacentElement('afterend',body);
  children.slice(idx+1).forEach(x=>body.appendChild(x));
  const btn=document.createElement('button');btn.type='button';btn.className='tpux-fold-btn';btn.onclick=()=>setFold(sec,body.hidden,true);
  if(head===titleEl)titleEl.insertAdjacentElement('afterend',btn);else head.appendChild(btn);
  sec.dataset.tpuxFold='1';
  let hashTarget=false;if(location.hash){try{const target=document.querySelector(location.hash);hashTarget=!!target&&sec.contains(target)}catch{}}
  const stored=stateMap()[stateKey(sec)];setFold(sec,stored===true||hashTarget,false);
}
function foldSections(){
  const candidates=[...new Set([...$$('main section'),$('#trip-budget-breakdown'),$('#trip-souvenirs'),$('#travel-apps')].filter(Boolean))];
  candidates.forEach(makeFold);
}

function iconFor(t){const s=t.toLowerCase();if(/hotel|โรงแรม|stay/.test(s))return'🏨';if(/itinerary|แพลน|วัน|day/.test(s))return'🗓️';if(/งบ|budget/.test(s))return'💰';if(/ticket|ตั๋ว/.test(s))return'🎟️';if(/season|ช่วงที่เหมาะ/.test(s))return'🌤️';if(/check|เตรียม/.test(s))return'✅';if(/souvenir|ของฝาก/.test(s))return'🎁';if(/app/.test(s))return'📱';if(/muslim|halal/.test(s))return'🕌';return'•'}
function assignSectionId(sec,i){if(sec.id)return sec.id;sec.id='trip-section-'+i;return sec.id}
function navSections(){
  const all=[...new Set([...$$('main section'),$('#lpr2TicketSummary'),$('#trip-budget-breakdown'),$('#trip-souvenirs'),$('#travel-apps')].filter(Boolean))],out=[],seen=new Set();let i=1;
  for(const sec of all){const t=sectionTitle(sec);if(!t||t.length>90)continue;const key=norm(t);if(!key||seen.has(key))continue;seen.add(key);assignSectionId(sec,i++);out.push({sec,title:t})}
  return out;
}
function ensureJumpSheet(){
  let sh=$('#tpuxJumpSheet');if(sh)return sh;
  sh=document.createElement('div');sh.id='tpuxJumpSheet';sh.innerHTML='<div class="tpux-sheet-panel"><div class="tpux-sheet-head"><div><small>JUMP TO SECTION</small><h3>ไปที่หัวข้อ</h3></div><button type="button" class="tpux-sheet-close">×</button></div><div id="tpuxJumpList"></div></div>';
  document.body.appendChild(sh);sh.onclick=e=>{if(e.target===sh||e.target.closest('.tpux-sheet-close'))sh.classList.remove('open')};return sh;
}
function openJump(){
  foldSections();const sh=ensureJumpSheet(),list=$('#tpuxJumpList',sh),items=navSections();
  list.innerHTML=`<button class="tpux-jump-row" data-top="1"><span>⇧</span><b>บนสุด</b></button>`+items.map(({sec,title})=>`<button class="tpux-jump-row" data-target="${esc(sec.id)}"><span>${iconFor(title)}</span><b>${esc(title)}</b></button>`).join('');
  list.querySelectorAll('.tpux-jump-row').forEach(b=>b.onclick=()=>{sh.classList.remove('open');if(b.dataset.top){window.scrollTo({top:0,behavior:'smooth'});return}const sec=document.getElementById(b.dataset.target);if(!sec)return;if(sec.dataset.tpuxFold==='1')setFold(sec,true,true);setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),50)});
  sh.classList.add('open');
}
function positionJump(){const b=$('#tpuxJumpBtn');if(!b)return;const nav=$('#pfxBottomNav');if(!nav){b.style.bottom='110px';return}const r=nav.getBoundingClientRect(),gap=Math.max(96,Math.round(window.innerHeight-r.top+10));b.style.bottom=gap+'px'}
function ensureJumpButton(){
  let b=$('#tpuxJumpBtn');if(!b){b=document.createElement('button');b.id='tpuxJumpBtn';b.type='button';b.innerHTML='☰ <span>หัวข้อ</span>';b.setAttribute('aria-label','ไปที่หัวข้อในทริป');b.onclick=openJump;document.body.appendChild(b)}positionJump();
}
function style(){
  if($('#tpux-style'))return;const s=document.createElement('style');s.id='tpux-style';s.textContent=`
html{scroll-behavior:smooth}main section[id],#trip-budget-breakdown,#trip-souvenirs,#travel-apps,#lpr2TicketSummary{scroll-margin-top:96px}
#tpuxJumpBtn{position:fixed;right:14px;z-index:12050;border:0;border-radius:999px;background:#1f292d;color:#fff;min-height:42px;padding:0 14px;box-shadow:0 10px 28px #0004;font:900 12px 'Noto Sans Thai',system-ui;display:flex;align-items:center;gap:6px;transition:bottom .18s ease}
#tpuxJumpSheet{position:fixed;inset:0;z-index:15000;background:#1119;backdrop-filter:blur(8px);display:none;align-items:flex-end;padding:10px}#tpuxJumpSheet.open{display:flex}.tpux-sheet-panel{width:min(620px,100%);margin:auto;background:#faf8f3;border-radius:24px 24px 18px 18px;padding:14px;max-height:78dvh;overflow:auto}.tpux-sheet-head{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:-14px;background:#faf8f3f2;padding:10px 2px 12px;z-index:2}.tpux-sheet-head small{font-size:.64rem;color:#8a8f91;font-weight:900;letter-spacing:.08em}.tpux-sheet-head h3{margin:1px 0 0;font-size:1.15rem}.tpux-sheet-close{border:0;width:38px;height:38px;border-radius:50%;background:#fff;font-size:20px}.tpux-jump-row{width:100%;display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center;text-align:left;border:0;border-top:1px solid #0000000d;background:transparent;padding:12px 8px;font-family:'Noto Sans Thai',system-ui}.tpux-jump-row:first-child{border-top:0}.tpux-jump-row b{font-size:.9rem;line-height:1.3}.tpux-fold-btn{border:1px solid #00000012;background:#fff;color:#394043;border-radius:999px;min-height:34px;padding:5px 10px;font:850 11px 'Noto Sans Thai',system-ui;margin:8px 0 0;white-space:nowrap}.tpux-fold-btn span{font-size:12px;margin-left:4px}.tpux-collapse-body[hidden]{display:none!important}.tpux-collapsed{padding-bottom:18px!important}.tpux-source-link{display:inline-flex;align-items:center;min-height:34px;margin:0 0 0 7px;padding:5px 2px;color:#6b7376!important;text-decoration:none!important;border-bottom:1px dashed #999;font:800 10px 'Noto Sans Thai',system-ui}.tpux-booking-link{color:inherit!important;text-decoration:none!important;border:0!important;background:none!important}.hotelcard h3 .tpux-booking-link,.hotel-card h3 .tpux-booking-link{border-bottom:0!important;text-decoration:none!important}.tpux-booking-actions{align-items:center}.tpux-booking-btn{min-height:36px!important;padding:6px 12px!important;font-size:.75rem!important}
@media(max-width:560px){#tpuxJumpBtn{right:12px;min-height:40px;padding:0 12px;font-size:11px}.hotelcard h3,.hotel-card h3{font-size:1.28rem!important;line-height:1.15!important;letter-spacing:-.018em!important;margin:4px 0 9px!important;word-break:normal!important;overflow-wrap:anywhere!important}.hotelcard h3 .tpux-booking-link,.hotel-card h3 .tpux-booking-link{font-size:inherit!important;line-height:inherit!important}.tpux-booking-btn{min-height:34px!important;padding:5px 11px!important;font-size:.71rem!important}.tpux-source-link{font-size:.66rem!important}.hotelcard .lpr2-card-action{gap:5px!important;margin:7px 0 9px!important}.tpux-sheet-panel{padding:12px}.tpux-fold-btn{font-size:10px;min-height:32px}}
`;document.head.appendChild(s)
}
function apply(){style();syncTripToolDates();decorateHotels();foldSections();ensureJumpButton()}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,180)}).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('storage',e=>{if([TRIP_KEY,LIVE_KEY,STATE_KEY,TT_KEY,'hk-trip-mode'].includes(e.key||''))setTimeout(apply,80)});
window.addEventListener('pageshow',()=>setTimeout(apply,100));window.addEventListener('resize',()=>setTimeout(positionJump,80));
window.addEventListener('click',openExternalBooking,true);
document.addEventListener('click',e=>{if(e.target.closest?.('#tripPriceRefreshBtn,.lpr2-refresh')){syncTripToolDates();let n=0,t=setInterval(()=>{decorateHotels();if(++n>20)clearInterval(t)},400)}},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,220),{once:true});else setTimeout(apply,120);
})();