from pathlib import Path
import re

def load(path): return Path(path).read_text(encoding='utf-8')
def save(path,text): Path(path).write_text(text,encoding='utf-8')
def repl(text,old,new,label):
    if old not in text:
        raise SystemExit(f'missing marker: {label}')
    return text.replace(old,new,1)

# Root: add the third trip, Vietnam map data and fresh SW URL.
p='index.html'; s=load(p)
if 'data-id="danang"' not in s:
    m=re.search(r'(<article class="trip-card" data-id="hongkong">.*?</article>)(</div><section class="install-card")',s,re.S)
    if not m: raise SystemExit('hongkong trip card boundary not found')
    card='''<article class="trip-card" data-id="danang"><img class="trip-cover" src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=82" alt="Da Nang"><div class="trip-pad"><div class="ey">🇻🇳 DA NANG • HOI AN</div><h3>Da Nang + Hoi An 6D5N</h3><div class="muted small">My Khe • Ba Na Hills • Golden Bridge • Hoi An • Halal • Couple Trip</div><div class="dates"><div class="field"><label>วันเริ่ม</label><input class="start" type="date"></div><div class="field"><label>วันกลับ</label><input class="end" type="date"></div></div><div class="trip-actions"><a class="btn trip-link" href="./danang/">เปิด Da Nang →</a><label class="visited"><input class="check" type="checkbox"> ไปแล้ว</label><span class="status">กำลังวางแผน</span></div></div></article>'''
    s=s[:m.start()]+m.group(1)+card+m.group(2)+s[m.end():]
if "vietnam:{name:'Vietnam'" not in s:
    marker=" thailand:{name:'Thailand',flag:'🇹🇭'"
    vietnam=" vietnam:{name:'Vietnam',flag:'🇻🇳',sub:'เวียดนาม',center:[16.05,108.2],zoom:6,note:'Da Nang • Hoi An • Beach • Old Town',href:'./danang/',regions:[{name:'Da Nang',center:[16.0544,108.2022],zoom:11,trip:'danang'},{name:'Hoi An',center:[15.8801,108.338],zoom:12,trip:'danang'}]},\n"
    s=repl(s,marker,vietnam+marker,'vietnam countryData')
s=s.replace("const tripRegionMap={tokyo:[['japan','Tokyo'],['japan','Chiba'],['japan','Yamanashi']],hongkong:[['hongkong','Kowloon'],['hongkong','Hong Kong Island'],['hongkong','Lantau']]};","const tripRegionMap={tokyo:[['japan','Tokyo'],['japan','Chiba'],['japan','Yamanashi']],hongkong:[['hongkong','Kowloon'],['hongkong','Hong Kong Island'],['hongkong','Lantau']],danang:[['vietnam','Da Nang'],['vietnam','Hoi An']]};")
s=s.replace("function countryVisited(key){return memories.some(m=>m.country===key)||(key==='japan'&&state.tokyo?.visited)||(key==='hongkong'&&state.hongkong?.visited)}","function countryVisited(key){return memories.some(m=>m.country===key)||(key==='japan'&&state.tokyo?.visited)||(key==='hongkong'&&state.hongkong?.visited)||(key==='vietnam'&&state.danang?.visited)}")
s=s.replace('<option value="hongkong">🇭🇰 Hong Kong</option><option value="thailand">','<option value="hongkong">🇭🇰 Hong Kong</option><option value="vietnam">🇻🇳 Vietnam</option><option value="thailand">')
s=re.sub(r'manifest\.webmanifest\?v=\d+','manifest.webmanifest?v=65',s)
s=re.sub(r'sw\.js\?v=\d+','sw.js?v=65',s)
save(p,s)

# Plan-first v1.
p='plan-first-v1.js'; s=load(p)
s=repl(s,"const isTokyo=path.startsWith(BASE+'tokyo/'),isHK=path.startsWith(BASE+'hongkong/'),isPlan=isTokyo||isHK,isRoot=path===BASE||path===BASE+'index.html';","const isTokyo=path.startsWith(BASE+'tokyo/'),isHK=path.startsWith(BASE+'hongkong/'),isDaNang=path.startsWith(BASE+'danang/'),isPlan=isTokyo||isHK||isDaNang,isRoot=path===BASE||path===BASE+'index.html';",'plan v1 route')
s=repl(s,"const tripKey=isTokyo?'tokyo':isHK?'hongkong':'';","const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':'';",'trip key')
old="const TRIPS={tokyo:{key:'tokyo',name:'Tokyo Winter Trip 2026',flag:'🇯🇵',href:'./tokyo/',planHref:'../tokyo/',fallbackStart:'2026-12-05',days:6,accent:'Tokyo'},hongkong:{key:'hongkong',name:'Hong Kong Couple Trip',flag:'🇭🇰',href:'./hongkong/',planHref:'../hongkong/',fallbackStart:'',days:6,accent:'Hong Kong'}};"
new="const TRIPS={tokyo:{key:'tokyo',name:'Tokyo Winter Trip 2026',flag:'🇯🇵',href:'./tokyo/',planHref:'../tokyo/',fallbackStart:'2026-12-05',days:6,accent:'Tokyo'},hongkong:{key:'hongkong',name:'Hong Kong Couple Trip',flag:'🇭🇰',href:'./hongkong/',planHref:'../hongkong/',fallbackStart:'',days:6,accent:'Hong Kong'},danang:{key:'danang',name:'Da Nang + Hoi An 6D5N',flag:'🇻🇳',href:'./danang/',planHref:'../danang/',fallbackStart:'',days:6,accent:'Da Nang'}};"
s=repl(s,old,new,'TRIPS')
s=s.replace("const who=a.trip==='tokyo'?'Tokyo':a.trip==='hongkong'?'Hong Kong':'Trip';","const who=a.trip==='tokyo'?'Tokyo':a.trip==='hongkong'?'Hong Kong':a.trip==='danang'?'Da Nang':'Trip';")
s=s.replace("x.trip==='tokyo'?'🇯🇵 Tokyo':'🇭🇰 Hong Kong'","x.trip==='tokyo'?'🇯🇵 Tokyo':x.trip==='hongkong'?'🇭🇰 Hong Kong':'🇻🇳 Da Nang'")
save(p,s)

# Plan-first v2.
p='plan-first-v2.js'; s=load(p)
s=s.replace("isPlan=path.startsWith(BASE+'tokyo/')||path.startsWith(BASE+'hongkong/')","isPlan=path.startsWith(BASE+'tokyo/')||path.startsWith(BASE+'hongkong/')||path.startsWith(BASE+'danang/')")
save(p,s)

# Preview cover.
p='plan-first-v2.css'; s=load(p)
if 'data-pfx-focus="danang"' not in s:
    anchor="body.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus=\"hongkong\"].on) .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=82')}"
    extra="\nbody.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus=\"danang\"].on) .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=82')}"
    s=repl(s,anchor,anchor+extra,'danang preview')
save(p,s)

# Trip Tools.
p='trip-tools-v1.js'; s=load(p)
if 'DATA.danang=' not in s:
    block="""
DATA.danang={name:'Da Nang + Hoi An 6D5N',emoji:'🇻🇳',city:'Da Nang',country:'Vietnam',tz:'Asia/Ho_Chi_Minh',currency:'VND',budget:45000,start:'',center:[16.0544,108.2022],zoom:10,
 days:[
  {title:'Arrival • My Khe • Dragon Bridge',items:[['หลังถึง DAD','Da Nang International Airport','Da Nang International Airport'],['14:00','HAIAN Beach Hotel & Spa','HAIAN Beach Hotel & Spa Da Nang'],['16:30','My Khe Beach','My Khe Beach Da Nang'],['18:30','Belanga Bay Halal Restaurant','Belanga Bay Restaurant Da Nang'],['20:00','Dragon Bridge','Dragon Bridge Da Nang']]},
  {title:'Ba Na Hills • Golden Bridge',items:[['07:00','ออกจากโรงแรม','HAIAN Beach Hotel & Spa Da Nang'],['08:30','Sun World Ba Na Hills','Sun World Ba Na Hills'],['09:15','Golden Bridge','Golden Bridge Ba Na Hills'],['11:00','French Village','French Village Ba Na Hills'],['17:30','กลับ Da Nang','HAIAN Beach Hotel & Spa Da Nang']]},
  {title:'Marble Mountains • Hoi An',items:[['09:00','Check-out Da Nang','HAIAN Beach Hotel & Spa Da Nang'],['10:00','Marble Mountains','The Marble Mountains Da Nang'],['15:00','Little Riverside Hoi An','Little Riverside Hoi An'],['17:00','Hoi An Ancient Town','Hoi An Ancient Town'],['19:00','Halal Dinner Hoi An','Maxim Halal Restaurant Hoi An']]},
  {title:'Basket Boat • Hoi An Slow Day',items:[['10:00','Cam Thanh Coconut Village','Bay Mau Coconut Forest Hoi An'],['12:30','Hoi An Lunch / Cafe','Hoi An Ancient Town'],['15:00','Shopping / Cafe','Hoi An Ancient Town'],['17:30','Thu Bon River','Hoi An Ancient Town'],['19:00','Halal Dinner','Babas Kitchen Hoi An']]},
  {title:'Return Da Nang • Son Tra',items:[['09:30','Check-out Hoi An','Little Riverside Hoi An'],['11:00','กลับ Da Nang','HAIAN Beach Hotel & Spa Da Nang'],['13:00','Son Tra Peninsula','Son Tra Peninsula Da Nang'],['14:00','Linh Ung Pagoda','Linh Ung Pagoda Son Tra'],['17:00','My Khe Sunset','My Khe Beach Da Nang']]},
  {title:'Brunch • Souvenir • Airport',items:[['08:00','My Khe Last Walk','My Khe Beach Da Nang'],['09:30','Han Market','Han Market Da Nang'],['11:30','รับกระเป๋า','HAIAN Beach Hotel & Spa Da Nang'],['ก่อนบิน 3 ชม.','Da Nang International Airport','Da Nang International Airport']]}
 ],
 places:[['🏨','HAIAN Beach Hotel & Spa',16.0538,108.2457,'hotel'],['🌊','My Khe Beach',16.0611,108.246,'sight'],['🌉','Dragon Bridge',16.0612,108.2279,'sight'],['🌉','Golden Bridge / Ba Na Hills',15.995,107.996,'sight'],['⛰️','Marble Mountains',16.0036,108.264,'sight'],['🏮','Hoi An Ancient Town',15.8801,108.338,'sight'],['🛶','Bay Mau Coconut Forest',15.881,108.38,'sight'],['🌿','Son Tra Peninsula',16.119,108.277,'sight'],['✈️','Da Nang International Airport',16.0439,108.1993,'station']],
 muslim:[['🍽️ Belanga Bay','Belanga Bay Restaurant Da Nang','Halal • Da Nang'],['🍽️ Maxim Halal Hoi An','Maxim Halal Restaurant Hoi An','เช็กเวลาเปิดวันจริง'],['🍛 Baba’s Kitchen Hoi An','Babas Kitchen Hoi An','เช็กสถานะฮาลาล/เมนูก่อนสั่ง']]
};
"""
    s=repl(s,'function defaults(){',block+'function defaults(){','trip tools data')
s=s.replace("selected:location.pathname.includes('/hongkong/')?'hongkong':'tokyo'","selected:location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':'tokyo'")
s=s.replace("dates:{tokyo:DATA.tokyo.start,hongkong:''},budgets:{tokyo:65000,hongkong:55000},done:{tokyo:{},hongkong:{}}","dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:''},budgets:{tokyo:65000,hongkong:55000,danang:45000},done:{tokyo:{},hongkong:{},danang:{}}")
s=s.replace("state.dates=Object.assign({tokyo:DATA.tokyo.start,hongkong:''},state.dates||{});state.budgets=Object.assign({tokyo:65000,hongkong:55000},state.budgets||{});","state.dates=Object.assign({tokyo:DATA.tokyo.start,hongkong:'',danang:''},state.dates||{});state.budgets=Object.assign({tokyo:65000,hongkong:55000,danang:45000},state.budgets||{});")
save(p,s)

# Plan extras.
p='plan-extras-v1.js'; s=load(p)
s=s.replace("const trip=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':null;","const trip=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':path.includes('/danang/')?'danang':null;")
if 'DATA.danang=' not in s:
    obj="""
DATA.danang={emoji:'🇻🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค. – ส.ค.',seasonLead:'เหมาะกับทะเล + Ba Na Hills + Hoi An',seasonText:'ช่วงมีนาคมถึงสิงหาคมโดยทั่วไปแดดเยอะ ฝนน้อยและทะเลค่อนข้างสงบ เหมาะกับกิจกรรมกลางแจ้ง ส่วนกุมภาพันธ์ถึงเมษายนมักอากาศสบายกว่าช่วงกลางฤดูร้อน',seasonChips:['🌊 My Khe','🌉 Golden Bridge','🏮 Hoi An','☀️ Outdoor friendly'],seasonNote:'กันยายนเป็นต้นไปมีโอกาสฝนมากขึ้น ควรเช็กพยากรณ์ก่อนวัน Ba Na Hills และ Hoi An',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],['flight','ตั๋วเครื่องบิน Bangkok ↔ Da Nang'],['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],['hotel','Booking Da Nang + Hoi An'],['bana','Ba Na Hills / Golden Bridge ticket'],['basket','Basket Boat / Coconut Village ถ้าจะจองล่วงหน้า']]},{title:'เงิน เน็ต & แอป',icon:'📱',items:[['esim','eSIM / SIM Vietnam'],['grab','ติดตั้ง Grab + ผูกบัตรหรือเตรียมเงินสด'],['maps','Google Maps + เซฟโรงแรม/ร้านฮาลาล'],['cash','เงิน VND สดสำหรับร้านเล็ก/ตลาด'],['power','Power bank + สายชาร์จ'],['translate','Google Translate / ดาวน์โหลด Vietnamese offline']]},{title:'ทะเล & เดินเที่ยว',icon:'🌊',items:[['sun','กันแดด + แว่นกันแดด'],['shoes','รองเท้าเดินสบายสำหรับ Marble Mountains / Hoi An'],['umbrella','ร่มพับ / เสื้อกันฝนบาง'],['jacket','เสื้อคลุมบางสำหรับ Ba Na Hills'],['bag','กระเป๋าสะพายเล็ก'],['bottle','ขวดน้ำพกพา']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','แอปเวลาละหมาด + Qibla'],['mat','ผ้าปูละหมาดพกพา'],['halal1','เซฟ Belanga Bay Da Nang'],['halal2','เซฟร้านฮาลาลใน Hoi An และเช็กเวลาเปิดก่อนวันจริง'],['snack','พก snack สำรองสำหรับ Ba Na Hills'],['ingredients','เช็กวัตถุดิบ/แอลกอฮอล์ในเมนูที่ไม่ระบุ Halal']] }]};
"""
    s=repl(s,'  const d=DATA[trip];',obj+'  const d=DATA[trip];','plan extras danang')
if "danang:[" not in s[s.find('const APP_DATA='):]:
    s=repl(s,"  const APP_DATA={\n    tokyo:[","  const APP_DATA={\n    danang:[\n      {icon:'🚕',name:'Grab',badge:'ต้องมี • เดินทาง',platform:'iPhone + Android',desc:'ใช้เรียกรถจากสนามบิน ไป Ba Na Hills ระหว่าง Da Nang–Hoi An และกลับโรงแรม พร้อมเห็นค่าโดยสารก่อนจอง',url:'https://www.grab.com/global/airport-rides/da-nang-international-airport/'},\n      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'เซฟโรงแรม ร้านฮาลาล จุดรับ Grab และสถานที่เที่ยวทั้งหมดไว้ก่อนเดินทาง',url:'https://www.google.com/maps'},\n      {icon:'🗣️',name:'Google Translate',badge:'แนะนำ',platform:'iPhone + Android',desc:'ดาวน์โหลดภาษา Vietnamese แบบ Offline ไว้ช่วยอ่านเมนู ป้าย และสื่อสารกับคนขับหรือร้านเล็ก',url:'https://translate.google.com/'}\n    ],\n    tokyo:[",'app data danang')
s=s.replace('<div class="px-ey">PRE-TRIP CHECKLIST</div>','<div class="px-ey">TRIP READINESS</div>')

if 'COUPLE_PLANNER_V65' not in s:
    add=r'''

  /* COUPLE_PLANNER_V65 — shared wishlist + offline emergency card in the existing plan extras module. */
  const EMERGENCY={
    tokyo:{main:'ตำรวจ 110 • ดับเพลิง/รถพยาบาล 119',help:'JNTO Visitor Hotline +81-50-3816-2787',hotel:'APA Hotel Asakusa Tawaramachi-Ekimae'},
    hongkong:{main:'Police / Fire / Ambulance 999',help:'มือถือใน Hong Kong โทร 112 เพื่อเชื่อม 999 ได้',hotel:'Holiday Inn Golden Mile Hong Kong'},
    danang:{main:'ตำรวจ 113 • ดับเพลิง 114 • รถพยาบาล 115 • กู้ภัย 112',help:'Da Nang Visitor Center +84 236 355 0111',hotel:'HAIAN Beach Hotel & Spa / Little Riverside Hoi An'}
  };
  function injectCouplePlanner(){
    if(document.getElementById('couple-planner'))return;
    style.textContent+=`.px-couple-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px}.px-couple-card{background:#fff;border:1px solid #00000012;border-radius:20px;padding:16px;box-shadow:0 10px 28px #372a2510}.px-couple-card h3{margin:0 0 5px}.px-wish-form{display:grid;grid-template-columns:1fr 1fr auto;gap:7px;margin-top:11px}.px-wish-form input{min-width:0;border:1px solid #ddd5c8;border-radius:12px;padding:9px;font:inherit}.px-wish-add{border:0;border-radius:12px;background:#1e2428;color:#fff;padding:9px 12px;font-weight:900}.px-wish-list{display:grid;gap:7px;margin-top:10px}.px-wish{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;background:#faf8f3;border-radius:13px;padding:9px}.px-wish-toggle,.px-wish-del{border:0;background:transparent;font-size:1rem}.px-wish.done .px-wish-name{text-decoration:line-through;color:#888}.px-em-row{padding:9px 0;border-top:1px dashed #0001}.px-em-row:first-of-type{border-top:0}.px-em-note{width:100%;margin-top:8px;border:1px solid #ddd5c8;border-radius:12px;padding:10px;font:inherit;min-height:66px;resize:vertical}@media(max-width:700px){.px-couple-grid{grid-template-columns:1fr}.px-wish-form{grid-template-columns:1fr}.px-wish-add{width:100%}}`;
    const sec=document.createElement('section');sec.id='couple-planner';sec.className='px-sec px-fade';
    const em=EMERGENCY[trip];
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">COUPLE PLANNER</div><h2 class="px-title">วางแผนร่วมกัน ❤️</h2><div class="px-couple-grid"><article class="px-couple-card"><h3>💞 Shared Wishlist</h3><div class="muted" style="font-size:.8rem">เก็บสถานที่ “อยากไปถ้ามีเวลา” แยกจากแพลนจริง เพื่อลดการอัด Location ลง Day</div><div class="px-wish-form"><input id="pxWishName" placeholder="สถานที่อยากไป"><input id="pxWishNote" placeholder="เหตุผล / โน้ต"><button class="px-wish-add" id="pxWishAdd" type="button">＋ เพิ่ม</button></div><div class="px-wish-list" id="pxWishList"></div></article><article class="px-couple-card"><h3>🆘 Emergency Card</h3><div class="muted" style="font-size:.8rem">เก็บข้อมูลสำคัญไว้ในหน้า Trip เดียว เปิดได้แม้เน็ตมีปัญหา</div><div class="px-em-row"><b>เหตุฉุกเฉิน</b><div>${esc(em.main)}</div></div><div class="px-em-row"><b>ช่วยเหลือนักท่องเที่ยว</b><div>${esc(em.help)}</div></div><div class="px-em-row"><b>ที่พักในแพลน</b><div>${esc(em.hotel)}</div></div><textarea class="px-em-note" id="pxEmergencyNote" placeholder="เลขประกัน / เบอร์คนติดต่อ / ข้อมูลที่อยากเก็บเพิ่ม"></textarea></article></div></div>`;
    const target=document.getElementById('travel-apps')||document.getElementById('trip-checklist');if(target?.parentNode)target.insertAdjacentElement('afterend',sec);else document.querySelector('main')?.appendChild(sec);
    const WKEY='travelHubWishlistV1',EKEY='travelHubEmergencyV1';
    const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));window.dispatchEvent(new Event('online'))}catch{}};
    const list=sec.querySelector('#pxWishList');
    function renderWish(){const all=read(WKEY,{}),a=Array.isArray(all[trip])?all[trip]:[];list.innerHTML=a.length?a.map(x=>`<div class="px-wish ${x.done?'done':''}" data-id="${x.id}"><button class="px-wish-toggle" type="button">${x.done?'✅':'🤍'}</button><div><b class="px-wish-name">${esc(x.name)}</b>${x.note?`<div class="muted" style="font-size:.72rem">${esc(x.note)}</div>`:''}</div><button class="px-wish-del" type="button" aria-label="ลบ">×</button></div>`).join(''):'<div class="muted" style="font-size:.78rem;padding:8px 0">ยังไม่มี Wishlist</div>';list.querySelectorAll('.px-wish').forEach(row=>{row.querySelector('.px-wish-toggle').onclick=()=>{const o=read(WKEY,{}),a=o[trip]||[],x=a.find(v=>v.id===row.dataset.id);if(x)x.done=!x.done;o[trip]=a;write(WKEY,o);renderWish()};row.querySelector('.px-wish-del').onclick=()=>{const o=read(WKEY,{});o[trip]=(o[trip]||[]).filter(v=>v.id!==row.dataset.id);write(WKEY,o);renderWish()}})}
    sec.querySelector('#pxWishAdd').onclick=()=>{const n=sec.querySelector('#pxWishName'),note=sec.querySelector('#pxWishNote');if(!n.value.trim())return;const o=read(WKEY,{}),a=Array.isArray(o[trip])?o[trip]:[];a.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:n.value.trim(),note:note.value.trim(),done:false});o[trip]=a.slice(-50);write(WKEY,o);n.value='';note.value='';renderWish()};renderWish();
    const en=sec.querySelector('#pxEmergencyNote'),eo=read(EKEY,{});en.value=eo[trip]||'';let timer;en.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{const o=read(EKEY,{});o[trip]=en.value;write(EKEY,o)},350)});
  }
  injectCouplePlanner();
'''
    pos=s.rfind('})();')
    if pos<0: raise SystemExit('plan extras closure not found')
    s=s[:pos]+add+'\n'+s[pos:]
save(p,s)

# Plan ↔ Memory integration.
p='plan-memory-link-v2.js'; s=load(p)
s=s.replace("const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':null;if(!trip)return;","const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':null;if(!trip)return;")
s=s.replace("const country=trip==='tokyo'?'japan':'hongkong'","const country=trip==='tokyo'?'japan':trip==='hongkong'?'hongkong':'vietnam'")
old="const regionFor=text=>{const s=norm(text);if(trip==='tokyo'){if(/disney|maihama|cinderella/.test(s))return'Chiba';if(/kawaguchiko|oishi|fuji|ropeway/.test(s))return'Yamanashi';return'Tokyo'}if(/disney|ngong|tung chung|tian tan|citygate|airport|hkia/.test(s))return'Lantau';if(/central|pmq|wan chai|causeway|peak|masjid ammar|islamic centre/.test(s))return'Hong Kong Island';return'Kowloon'};"
new="const regionFor=text=>{const s=norm(text);if(trip==='tokyo'){if(/disney|maihama|cinderella/.test(s))return'Chiba';if(/kawaguchiko|oishi|fuji|ropeway/.test(s))return'Yamanashi';return'Tokyo'}if(trip==='danang'){if(/hoi an|cam thanh|coconut|maxim|baba|ancient|thu bon/.test(s))return'Hoi An';return'Da Nang'}if(/disney|ngong|tung chung|tian tan|citygate|airport|hkia/.test(s))return'Lantau';if(/central|pmq|wan chai|causeway|peak|masjid ammar|islamic centre/.test(s))return'Hong Kong Island';return'Kowloon'};"
s=s.replace(old,new)
save(p,s)

# Service worker.
p='sw.js'; s=load(p)
s=re.sub(r"const CACHE='our-journey-v\d+'","const CACHE='our-journey-v65'",s,count=1)
if "BASE+'danang/index.html'" not in s:
    s=s.replace("const CORE=[BASE,BASE+'index.html'","const CORE=[BASE,BASE+'index.html',BASE+'danang/index.html'")
s=s.replace("url.pathname.startsWith(BASE+'tokyo/')||url.pathname.startsWith(BASE+'hongkong/')","url.pathname.startsWith(BASE+'tokyo/')||url.pathname.startsWith(BASE+'hongkong/')||url.pathname.startsWith(BASE+'danang/')")
s=re.sub(r'\?v=64','?v=65',s)
s=re.sub(r'\?v=61','?v=65',s)
save(p,s)
