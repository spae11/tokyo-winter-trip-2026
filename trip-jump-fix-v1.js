(()=>{
'use strict';
if(window.__tripJumpFixV1)return;window.__tripJumpFixV1=true;
const ROUTES=['tokyo','kansai','hongkong','danang','yunnan','chongqing','harbin'];
const id=ROUTES.find(x=>location.pathname.includes('/'+x+'/'))||'';if(!id)return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9ก-๙一-龥]+/g,' ').trim();
function title(sec){return($(':scope h2,:scope h3',sec)?.textContent||'').replace(/\s+/g,' ').trim()}
function cleanLabel(t){return String(t||'').replace(/^[\s\p{Extended_Pictographic}\uFE0F\u200D]+/u,'').replace(/\s*[⌃⌄]\s*$/,'').trim()}
function icon(t){const s=t.toLowerCase();if(/hotel|โรงแรม|stay/.test(s))return'🏨';if(/itinerary|แพลน|วัน|day/.test(s))return'🗓️';if(/งบ|budget/.test(s))return'💰';if(/ticket|ตั๋ว|attraction/.test(s))return'🎟️';if(/season|ช่วงที่เหมาะ/.test(s))return'🌤️';if(/check|เตรียม/.test(s))return'✅';if(/souvenir|ของฝาก/.test(s))return'🎁';if(/app/.test(s))return'📱';if(/muslim|halal/.test(s))return'🕌';if(/media|ข้อมูล/.test(s))return'☁️';return'•'}
function isUsable(sec){if(!sec||!sec.isConnected)return false;if(sec.closest('#tpuxJumpSheet,#lpr2-sheet,.tt-sheet,.sheet'))return false;const r=sec.getBoundingClientRect();return r.width>0||r.height>0||sec.offsetParent!==null}
function sections(){
  const main=$('main'),raw=[];
  if(main)raw.push(...$$(':scope > section',main));
  for(const sel of ['#lpr2TicketSummary','#trip-budget-breakdown','#trip-souvenirs','#travel-apps']){const x=$(sel);if(x&&!raw.includes(x))raw.push(x)}
  const out=[],seen=new Set();let i=0;
  for(const sec of raw){
    if(!isUsable(sec))continue;
    let t=cleanLabel(title(sec));if(!t||t.length>80)continue;
    const k=norm(t);if(!k||seen.has(k))continue;seen.add(k);
    if(!sec.id)sec.id=`trip-main-section-${++i}`;
    out.push({sec,t});
  }
  return out;
}
function openAncestors(sec){
  let x=sec;
  while(x&&x!==document.body){
    if(x.classList?.contains('tpux2-collapsed')){x.classList.remove('tpux2-collapsed');x.querySelector('.tpux2-fold-head')?.setAttribute('aria-expanded','true')}
    if(x.id==='lpr2TicketSummary'){x.classList.add('tpux2-ticket-open');x.querySelector('h3')?.setAttribute('aria-expanded','true')}
    if(x.tagName==='DETAILS')x.open=true;
    x=x.parentElement;
  }
}
function go(sec){if(!sec)return;openAncestors(sec);requestAnimationFrame(()=>requestAnimationFrame(()=>{const top=Math.max(0,sec.getBoundingClientRect().top+window.scrollY-92);window.scrollTo({top,behavior:'smooth'})}))}
function buildSheet(){
  let sh=$('#tpuxJumpSheet');if(sh)sh.remove();
  sh=document.createElement('div');sh.id='tpuxJumpSheet';sh.innerHTML='<div class="tjf-panel"><div class="tjf-head"><div><small>JUMP TO SECTION</small><h3>ไปที่หัวข้อ</h3></div><button type="button" class="tjf-close">×</button></div><div class="tjf-actions"><button type="button" data-tjf-fold="0">ย่อหัวข้อรอง</button><button type="button" data-tjf-fold="1">เปิดทั้งหมด</button></div><div id="tjfList"></div></div>';
  document.body.appendChild(sh);
  sh.addEventListener('click',e=>{if(e.target===sh||e.target.closest('.tjf-close'))sh.classList.remove('open');const f=e.target.closest('[data-tjf-fold]');if(f){const open=f.dataset.tjfFold==='1';$$('[data-tpux2-fold="1"]').forEach(s=>{s.classList.toggle('tpux2-collapsed',!open);s.querySelector('.tpux2-fold-head')?.setAttribute('aria-expanded',String(open))});const t=$('#lpr2TicketSummary');if(t){t.classList.toggle('tpux2-ticket-open',open);t.querySelector('h3')?.setAttribute('aria-expanded',String(open))}}});return sh
}
function openMenu(){
  const sh=buildSheet(),list=$('#tjfList',sh),items=sections();
  list.innerHTML='<button class="tjf-row" data-top="1"><span>⇧</span><b>บนสุด</b></button>'+items.map(({sec,t})=>`<button class="tjf-row" data-target="${esc(sec.id)}"><span>${icon(t)}</span><b>${esc(t)}</b></button>`).join('');
  $$('.tjf-row',list).forEach(b=>b.onclick=()=>{sh.classList.remove('open');if(b.dataset.top){window.scrollTo({top:0,behavior:'smooth'});return}go(document.getElementById(b.dataset.target))});
  sh.classList.add('open')
}
function bind(){const b=$('#tpuxJumpBtn');if(!b)return false;b.onclick=e=>{e.preventDefault();e.stopPropagation();openMenu()};return true}
function style(){if($('#tjf-style'))return;const s=document.createElement('style');s.id='tjf-style';s.textContent=`
#tpuxJumpSheet{position:fixed;inset:0;z-index:15100;background:#1119;backdrop-filter:blur(8px);display:none;align-items:flex-end;padding:10px}#tpuxJumpSheet.open{display:flex}.tjf-panel{width:min(620px,100%);margin:auto;background:#faf8f3;border-radius:24px 24px 18px 18px;padding:14px;max-height:78dvh;overflow:auto;box-shadow:0 26px 70px #0005}.tjf-head{display:flex;justify-content:space-between;align-items:center;gap:12px;position:sticky;top:-14px;background:#faf8f3f4;padding:9px 2px 10px;z-index:2}.tjf-head small{font-size:.62rem;color:#8a8f91;font-weight:900;letter-spacing:.08em}.tjf-head h3{margin:1px 0 0;font-size:1.08rem}.tjf-close{border:0;width:38px;height:38px;border-radius:50%;background:#fff;font-size:20px}.tjf-actions{display:flex;gap:7px;margin:2px 0 7px}.tjf-actions button{border:1px solid #0001;background:#fff;border-radius:999px;padding:7px 10px;font:850 10px 'Noto Sans Thai',system-ui}.tjf-row{width:100%;display:grid;grid-template-columns:29px minmax(0,1fr);gap:8px;align-items:center;text-align:left;border:0;border-top:1px solid #0000000d;background:transparent;padding:10px 7px;font-family:'Noto Sans Thai',system-ui;color:#1e2428}.tjf-row:first-child{border-top:0}.tjf-row span{font-size:1rem}.tjf-row b{font-size:.86rem;line-height:1.35;overflow-wrap:anywhere}@media(max-width:560px){.tjf-panel{padding:12px;max-height:76dvh}.tjf-row{padding:9px 6px}.tjf-row b{font-size:.83rem}}
`;document.head.appendChild(s)}
style();let n=0,t=setInterval(()=>{if(bind()||++n>80)clearInterval(t)},80);new MutationObserver(()=>{clearTimeout(window.__tjfBindTimer);window.__tjfBindTimer=setTimeout(bind,100)}).observe(document.body,{childList:true,subtree:true});
})();