(()=>{
'use strict';
if(window.__priceBookingClickFixV1)return;window.__priceBookingClickFixV1=true;
const KEY='travelHubLivePricesV1',STATE_KEY='travelHubStateV2';
const ROUTES=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9ก-๙一-龥]+/g,' ').trim();
function read(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}
function tripId(){return ROUTES.find(x=>location.pathname.includes('/'+x+'/'))||''}
function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(String(s||''))}
function result(name){const id=tripId(),data=read(KEY,{}),k=norm(name);return(data?.hotels||[]).find(x=>x.tripId===id&&(norm(x.name)===k||norm(x.name).includes(k)||k.includes(norm(x.name))))||null}
function bookingUrl(name){const id=tripId(),r=result(name),st=read(STATE_KEY,{})?.[id]||{},start=r?.start||st.start||'',end=r?.end||st.end||'',q=new URLSearchParams({ss:name,group_adults:'2',group_children:'0',no_rooms:'1'});if(validDate(start))q.set('checkin',start);if(validDate(end))q.set('checkout',end);return'https://www.booking.com/searchresults.html?'+q.toString()}
function cardName(card){return(card?.getAttribute('data-hotel-name')||card?.querySelector('h3,h2')?.textContent||'').trim()}
function apply(){for(const card of document.querySelectorAll('.hotelcard,.hotel-card,[data-hotel-name]')){const name=cardName(card);if(!name)continue;const u=bookingUrl(name);for(const a of card.querySelectorAll('.lpr-book-link,.lpr-book-cta')){a.href=u;a.target='_blank';a.rel='noopener noreferrer';if(a.classList.contains('lpr-book-cta'))a.textContent='ดูราคา / จอง ↗'}}}
document.addEventListener('click',e=>{const a=e.target.closest?.('.hotelcard .lpr-book-link,.hotelcard .lpr-book-cta,.hotel-card .lpr-book-link,.hotel-card .lpr-book-cta,[data-hotel-name] .lpr-book-link,[data-hotel-name] .lpr-book-cta');if(!a)return;const card=a.closest('.hotelcard,.hotel-card,[data-hotel-name]'),name=cardName(card);if(!name)return;e.preventDefault();e.stopImmediatePropagation();window.open(bookingUrl(name),'_blank','noopener,noreferrer')},true);
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(apply,100)}).observe(document.body,{childList:true,subtree:true});window.addEventListener('travelHubPricesUpdated',apply);window.addEventListener('storage',e=>{if(e.key===KEY||e.key===STATE_KEY)apply()});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();