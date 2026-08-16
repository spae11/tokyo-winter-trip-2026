(()=>{
  if(window.__travelPlanExtrasLoaded)return;
  window.__travelPlanExtrasLoaded=true;

  const path=location.pathname;
  const trip=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':path.includes('/danang/')?'danang':null;
  if(!trip)return;

  const DATA={
    tokyo:{
      emoji:'🇯🇵',
      seasonTitle:'ช่วงที่เหมาะกับทริปนี้',
      seasonBadge:'แนะนำ • ปลาย พ.ย. – กลาง ธ.ค.',
      seasonLead:'เหมาะมากกับ Tokyo Winter + Mt. Fuji + Disneyland',
      seasonText:'ช่วงต้นฤดูหนาวอากาศเย็นและค่อนข้างแห้ง เดินเมืองสบาย มีไฟ Winter Illumination และโอกาสเห็นวิวภูเขาไฟฟูจิชัดกว่าช่วงชื้น แพลน 5–10 ธ.ค. อยู่ในช่วงที่ลงตัวมาก',
      seasonChips:['❄️ Winter mood','🗻 เหมาะกับ Fuji view','✨ Illumination','🧥 ต้องเตรียมเสื้อกันหนาว'],
      seasonNote:'ปลาย ธ.ค.–ต้น ม.ค. บรรยากาศสวย แต่คนเยอะขึ้นและช่วงปีใหม่บางร้าน/บริการอาจเปลี่ยนเวลา',
      groups:[
        {title:'เอกสาร & การเดินทาง',icon:'🪪',items:[
          ['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],
          ['flight','ตั๋วเครื่องบิน + Booking โรงแรม'],
          ['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],
          ['entry','เช็กเงื่อนไขเข้าเมืองญี่ปุ่นล่าสุดก่อนออกเดินทาง'],
          ['disney','Tokyo Disneyland Ticket / QR'],
          ['fuji','จองรถ/ทัวร์ Mt. Fuji หรือ Kawaguchiko ล่วงหน้า']
        ]},
        {title:'เสื้อผ้า Winter',icon:'🧥',items:[
          ['heattech','เสื้อ Heattech / Base layer'],
          ['coat','เสื้อโค้ตหรือแจ็กเก็ตกันลม'],
          ['gloves','ถุงมือ + ผ้าพันคอ + หมวก'],
          ['socks','ถุงเท้าหนา 2–3 คู่'],
          ['shoes','รองเท้าเดินสบาย กันลื่นได้ยิ่งดี'],
          ['skin','ลิปมัน + มอยส์เจอไรเซอร์']
        ]},
        {title:'เงิน เน็ต & อุปกรณ์',icon:'📱',items:[
          ['esim','eSIM / SIM ญี่ปุ่น'],
          ['ic','Suica / PASMO หรือเตรียมวิธีจ่ายค่าเดินทาง'],
          ['cash','เงินเยนสด + บัตรเครดิต/เดบิต'],
          ['power','Power bank + สายชาร์จ'],
          ['plug','หัวปลั๊ก Type A ถ้าอุปกรณ์จำเป็นต้องใช้'],
          ['offline','บันทึกโรงแรม/สถานี/Google Maps สำคัญไว้ Offline']
        ]},
        {title:'Muslim-friendly & ของใช้ส่วนตัว',icon:'🕌',items:[
          ['prayer','แอปเวลาละหมาด + Qibla'],
          ['mat','ผ้าปูละหมาดแบบพกพา'],
          ['halal','เซฟร้านอาหารฮาลาลแต่ละวันไว้ใน Maps'],
          ['meds','ยาประจำตัว + ยาสามัญ'],
          ['bottle','ขวดน้ำพกพา / กระติกเล็ก'],
          ['bag','กระเป๋าสะพายเล็กสำหรับวัน Disney/Fuji']
        ]}
      ]
    },
    hongkong:{
      emoji:'🇭🇰',
      seasonTitle:'ช่วงที่เหมาะกับทริปนี้',
      seasonBadge:'แนะนำ • ต.ค. – ธ.ค.',
      seasonLead:'เหมาะกับ City walk + Disneyland + The Peak + Ngong Ping',
      seasonText:'ช่วงปลายปีอากาศเย็นสบายและแห้งกว่าฤดูร้อน เหมาะกับการเดินทั้งวัน นั่งกระเช้า เที่ยว The Peak และ Disneyland โดยไม่เหนื่อยจากความร้อนชื้นมากเกินไป',
      seasonChips:['🌤️ เดินเมืองสบาย','🏰 Disney ทั้งวันง่ายขึ้น','🚡 เหมาะกับ Ngong Ping','🧥 พกเสื้อคลุมบาง–กลาง'],
      seasonNote:'ช่วง พ.ค.–พ.ย. ยังเป็นฤดูที่อาจมีพายุไต้ฝุ่น โดยเฉพาะหน้าร้อน ควรเช็กพยากรณ์ก่อนวันเดินทางจริง',
      groups:[
        {title:'เอกสาร & Booking',icon:'🪪',items:[
          ['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],
          ['flight','ตั๋วเครื่องบิน + Booking โรงแรม'],
          ['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],
          ['entry','เช็กเงื่อนไขเข้าเมืองฮ่องกงล่าสุดก่อนออกเดินทาง'],
          ['disney','Hong Kong Disneyland Ticket / QR'],
          ['ngong','Ngong Ping 360 / Peak Tram ถ้าจะจองล่วงหน้า']
        ]},
        {title:'เสื้อผ้า & เดินเที่ยว',icon:'👟',items:[
          ['jacket','เสื้อคลุม/แจ็กเก็ตตามฤดูกาล'],
          ['shoes','รองเท้าเดินสบาย เพราะทริปนี้เดินเยอะ'],
          ['umbrella','ร่มพับขนาดเล็ก'],
          ['sun','กันแดด + แว่นกันแดด'],
          ['bag','กระเป๋าสะพายเล็กสำหรับ Disney/เดินเมือง'],
          ['bottle','ขวดน้ำพกพา']
        ]},
        {title:'เงิน เน็ต & การเดินทาง',icon:'📱',items:[
          ['esim','eSIM / SIM Hong Kong'],
          ['octopus','Octopus Card / Mobile Octopus'],
          ['cash','เงิน HKD สด + บัตรเครดิต/เดบิต'],
          ['power','Power bank + สายชาร์จ'],
          ['plug','หัวแปลงปลั๊ก Type G'],
          ['offline','เซฟ MTR/โรงแรม/สถานที่สำคัญใน Maps']
        ]},
        {title:'Muslim-friendly & ของใช้ส่วนตัว',icon:'🕌',items:[
          ['prayer','แอปเวลาละหมาด + Qibla'],
          ['mat','ผ้าปูละหมาดแบบพกพา'],
          ['halal','เซฟร้านฮาลาลใกล้ TST / Wan Chai / Disney'],
          ['mosque','เซฟ Kowloon Mosque + Masjid Ammar'],
          ['meds','ยาประจำตัว + ยาสามัญ'],
          ['weather','เช็กฝน/ลม/ไต้ฝุ่นก่อนวัน Peak และ Ngong Ping']
        ]}
      ]
    }
  };


DATA.danang={emoji:'🇻🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค. – ส.ค.',seasonLead:'เหมาะกับทะเล + Ba Na Hills + Hoi An',seasonText:'ช่วงมีนาคมถึงสิงหาคมโดยทั่วไปแดดเยอะ ฝนน้อยและทะเลค่อนข้างสงบ เหมาะกับกิจกรรมกลางแจ้ง ส่วนกุมภาพันธ์ถึงเมษายนมักอากาศสบายกว่าช่วงกลางฤดูร้อน',seasonChips:['🌊 My Khe','🌉 Golden Bridge','🏮 Hoi An','☀️ Outdoor friendly'],seasonNote:'กันยายนเป็นต้นไปมีโอกาสฝนมากขึ้น ควรเช็กพยากรณ์ก่อนวัน Ba Na Hills และ Hoi An',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],['flight','ตั๋วเครื่องบิน Bangkok ↔ Da Nang'],['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],['hotel','Booking Da Nang + Hoi An'],['bana','Ba Na Hills / Golden Bridge ticket'],['basket','Basket Boat / Coconut Village ถ้าจะจองล่วงหน้า']]},{title:'เงิน เน็ต & แอป',icon:'📱',items:[['esim','eSIM / SIM Vietnam'],['grab','ติดตั้ง Grab + ผูกบัตรหรือเตรียมเงินสด'],['maps','Google Maps + เซฟโรงแรม/ร้านฮาลาล'],['cash','เงิน VND สดสำหรับร้านเล็ก/ตลาด'],['power','Power bank + สายชาร์จ'],['translate','Google Translate / ดาวน์โหลด Vietnamese offline']]},{title:'ทะเล & เดินเที่ยว',icon:'🌊',items:[['sun','กันแดด + แว่นกันแดด'],['shoes','รองเท้าเดินสบายสำหรับ Marble Mountains / Hoi An'],['umbrella','ร่มพับ / เสื้อกันฝนบาง'],['jacket','เสื้อคลุมบางสำหรับ Ba Na Hills'],['bag','กระเป๋าสะพายเล็ก'],['bottle','ขวดน้ำพกพา']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','แอปเวลาละหมาด + Qibla'],['mat','ผ้าปูละหมาดพกพา'],['halal1','เซฟ Belanga Bay Da Nang'],['halal2','เซฟร้านฮาลาลใน Hoi An และเช็กเวลาเปิดก่อนวันจริง'],['snack','พก snack สำรองสำหรับ Ba Na Hills'],['ingredients','เช็กวัตถุดิบ/แอลกอฮอล์ในเมนูที่ไม่ระบุ Halal']] }]};
  const d=DATA[trip];
  const style=document.createElement('style');
  style.id='plan-extras-style';
  style.textContent=`
    .px-sec{padding:46px 0}.px-wrap{width:min(1100px,calc(100% - 24px));margin:auto}.px-ey{font-size:.8rem;color:#B21F2D;font-weight:900;letter-spacing:.08em}.px-title{font-size:clamp(1.8rem,5vw,2.6rem);margin:4px 0 18px}.px-season{background:linear-gradient(135deg,#fff,#F5EFE4);border:1px solid #00000012;border-radius:24px;padding:20px;box-shadow:0 12px 32px #372a2510}.px-season-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}.px-season h3{font-size:1.45rem;margin:4px 0 6px}.px-season p{margin:0;color:#6f7478}.px-badge{display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;background:#B21F2D;color:white;font-weight:900;font-size:.84rem}.px-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:15px}.px-chip{background:white;border:1px solid #00000012;border-radius:999px;padding:7px 10px;font-size:.82rem;font-weight:800}.px-note{margin-top:13px;padding:12px 14px;background:#fff4d7;border-radius:15px;font-size:.88rem}.px-progress-card{background:#fff;border:1px solid #00000012;border-radius:22px;padding:18px;margin-bottom:14px;box-shadow:0 10px 28px #372a2510}.px-progress-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}.px-progress-track{height:9px;background:#ece8e1;border-radius:999px;overflow:hidden}.px-progress-bar{height:100%;width:0;background:#21443A;border-radius:999px;transition:width .35s ease}.px-check-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.px-group{background:#fff;border:1px solid #00000012;border-radius:20px;padding:16px;box-shadow:0 10px 28px #372a2510}.px-group h3{margin:0 0 10px;font-size:1.05rem}.px-item{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px dashed #00000010;cursor:pointer}.px-item:first-of-type{border-top:0}.px-item input{width:20px;height:20px;min-width:20px;margin-top:2px;accent-color:#B21F2D}.px-item span{font-size:.91rem}.px-item input:checked+span{text-decoration:line-through;color:#8c9093}.px-tools{display:flex;justify-content:flex-end;margin-top:12px}.px-reset{border:0;background:#F5EFE4;color:#B21F2D;font-weight:800;border-radius:999px;padding:8px 11px;cursor:pointer}.px-fade{animation:pxIn .5s cubic-bezier(.22,1,.36,1) both}@keyframes pxIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @media(max-width:700px){.px-check-grid{grid-template-columns:1fr}.px-sec{padding:38px 0}.px-wrap{width:calc(100% - 18px)}}
  `;
  document.head.appendChild(style);

  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const season=document.createElement('section');
  season.className='px-sec px-fade';
  season.id='best-season';
  season.innerHTML=`<div class="px-wrap"><div class="px-ey">BEST TIME TO GO</div><h2 class="px-title">${esc(d.seasonTitle)} ${d.emoji}</h2><div class="px-season"><div class="px-season-top"><div><span class="px-badge">${esc(d.seasonBadge)}</span><h3>${esc(d.seasonLead)}</h3><p>${esc(d.seasonText)}</p></div></div><div class="px-chips">${d.seasonChips.map(x=>`<span class="px-chip">${esc(x)}</span>`).join('')}</div><div class="px-note">💡 ${esc(d.seasonNote)}</div></div></div>`;

  const main=document.querySelector('main');
  if(main && !document.getElementById('best-season')) main.insertBefore(season,main.firstElementChild);

  const old=document.getElementById('checks');
  if(old){const oldSec=old.closest('section');if(oldSec)oldSec.style.display='none'}

  const checklist=document.createElement('section');
  checklist.className='px-sec px-fade';
  checklist.id='trip-checklist';
  const allItems=d.groups.flatMap(g=>g.items);
  checklist.innerHTML=`<div class="px-wrap"><div class="px-ey">TRIP READINESS</div><h2 class="px-title">ของที่ต้องเตรียมก่อนทริป ${d.emoji}</h2><div class="px-progress-card"><div class="px-progress-head"><b>ความพร้อมของทริป</b><span id="px-count">0 / ${allItems.length}</span></div><div class="px-progress-track"><div class="px-progress-bar" id="px-bar"></div></div></div><div class="px-check-grid">${d.groups.map(g=>`<div class="px-group"><h3>${g.icon} ${esc(g.title)}</h3>${g.items.map(([id,label])=>`<label class="px-item"><input type="checkbox" data-px-id="${trip}-${id}"><span>${esc(label)}</span></label>`).join('')}</div>`).join('')}</div><div class="px-tools"><button class="px-reset" type="button" id="px-reset">ล้าง Checklist</button></div></div>`;

  const footer=document.querySelector('footer');
  if(footer)footer.before(checklist);else if(main)main.appendChild(checklist);else document.body.appendChild(checklist);

  const key='tripChecklistV2:'+trip;
  let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
  const boxes=[...checklist.querySelectorAll('input[data-px-id]')];
  boxes.forEach(b=>{b.checked=!!saved[b.dataset.pxId]});
  const update=()=>{
    const done=boxes.filter(b=>b.checked).length;
    const count=checklist.querySelector('#px-count');const bar=checklist.querySelector('#px-bar');
    if(count)count.textContent=`${done} / ${boxes.length}`;
    if(bar)bar.style.width=(boxes.length?done/boxes.length*100:0)+'%';
  };
  boxes.forEach(b=>b.addEventListener('change',()=>{saved[b.dataset.pxId]=b.checked;try{localStorage.setItem(key,JSON.stringify(saved))}catch(e){}update()}));
  const reset=checklist.querySelector('#px-reset');
  if(reset)reset.addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);saved={};try{localStorage.removeItem(key)}catch(e){}update()});
  update();


  /* TRAVEL_APPS_V64 */
  const APP_DATA={
    danang:[
      {icon:'🚕',name:'Grab',badge:'ต้องมี • เดินทาง',platform:'iPhone + Android',desc:'ใช้เรียกรถจากสนามบิน ไป Ba Na Hills ระหว่าง Da Nang–Hoi An และกลับโรงแรม พร้อมเห็นค่าโดยสารก่อนจอง',url:'https://www.grab.com/global/airport-rides/da-nang-international-airport/'},
      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'เซฟโรงแรม ร้านฮาลาล จุดรับ Grab และสถานที่เที่ยวทั้งหมดไว้ก่อนเดินทาง',url:'https://www.google.com/maps'},
      {icon:'🗣️',name:'Google Translate',badge:'แนะนำ',platform:'iPhone + Android',desc:'ดาวน์โหลดภาษา Vietnamese แบบ Offline ไว้ช่วยอ่านเมนู ป้าย และสื่อสารกับคนขับหรือร้านเล็ก',url:'https://translate.google.com/'}
    ],
    tokyo:[
      {icon:'💳',name:'Welcome Suica Mobile',badge:'ต้องมี • iPhone',platform:'iOS / Apple Wallet',desc:'ใช้รถไฟ รถบัส และจ่ายร้านค้าที่มี IC ได้สะดวกมาก • Android ให้ใช้ Suica/PASMO แบบบัตรแทน',url:'https://www.jreast.co.jp/en/multi/welcomesuicamobile/?lng=en'},
      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'ดูรถไฟ ทางออกสถานี เวลาเดิน และเส้นทางแบบ Transit • เซฟโรงแรมกับจุดเที่ยวไว้ก่อนเดินทาง',url:'https://www.google.com/maps'},
      {icon:'🚕',name:'GO Taxi',badge:'แนะนำ • Taxi',platform:'iPhone + Android',desc:'เรียกแท็กซี่ในญี่ปุ่น ใช้ได้ทั่ว 47 จังหวัด และรองรับบัตรต่างประเทศ/Apple Pay ตามเงื่อนไขของบริการ',url:'https://go.goinc.jp/en/'},
      {icon:'🚆',name:'Japan Travel by NAVITIME',badge:'แนะนำ • รถไฟ',platform:'iPhone + Android',desc:'เช็กเส้นทางรถไฟ ตารางเวลา ค่าโดยสาร ทางออก และการต่อรถ เหมาะใช้คู่กับ Google Maps',url:'https://japantravel.navitime.com/en/'}
    ],
    hongkong:[
      {icon:'🐙',name:'Octopus App for Tourists',badge:'ต้องมี • iPhone',platform:'iOS / Apple Wallet',desc:'ใช้ MTR รถบัส ร้านสะดวกซื้อ และร้านค้าจำนวนมาก • Android แนะนำใช้บัตร Octopus จริง',url:'https://www.octopus.com.hk/en/consumer/tourist/apple-pay/index.html'},
      {icon:'🚇',name:'MTR Mobile',badge:'ต้องมี',platform:'iPhone + Android',desc:'ดูเส้นทาง MTR ค่าโดยสาร เวลารถไฟ ทางออกสถานี และสถานะการเดินรถแบบละเอียด',url:'https://www.mtr.com.hk/mtrmobile/en/'},
      {icon:'🚌',name:'HKeMobility',badge:'แนะนำ • ขนส่ง',platform:'iPhone + Android',desc:'แอปทางการของ Transport Department สำหรับ MTR/Bus/Ferry/เดินเท้า พร้อมเวลาถึงและข่าวจราจร',url:'https://www.td.gov.hk/en/public_services/hong_kong_emobility/'},
      {icon:'🚕',name:'Uber',badge:'แนะนำ • Taxi',platform:'iPhone + Android',desc:'เรียกรถหรือ Hong Kong Taxi จากแอป เหมาะตอนกลับดึก มีสัมภาระ หรือเดินทางจากจุดที่ต่อรถไม่สะดวก',url:'https://www.uber.com/hk/en/ride/'},
      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'ใช้เดินเมือง หาอาหารฮาลาล และดูเส้นทางระหว่างสถานที่ ใช้คู่กับ MTR Mobile จะสะดวกที่สุด',url:'https://www.google.com/maps'},
      {icon:'💙',name:'Alipay / Alipay+',badge:'เสริม • Payment',platform:'ถ้ามีอยู่แล้วใช้ต่อได้',desc:'ใช้ได้กับร้านที่รองรับ Alipay+ ในฮ่องกง แต่ทริปนี้ให้ Octopus + บัตรเครดิตเป็นช่องทางหลัก ไม่จำเป็นต้องสมัครใหม่',url:'https://www.alipayplus.com/consumer/'}
    ]
  };
  function injectTravelApps(){
    if(document.getElementById('travel-apps'))return;
    const apps=APP_DATA[trip]||[];
    if(!apps.length)return;
    style.textContent+=`.px-app-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.px-app-card{background:#fff;border:1px solid #00000012;border-radius:20px;padding:15px;box-shadow:0 10px 28px #372a2510;display:flex;flex-direction:column;min-height:180px}.px-app-head{display:flex;align-items:flex-start;gap:10px}.px-app-icon{width:44px;height:44px;border-radius:14px;background:#f5efe4;display:grid;place-items:center;font-size:1.35rem;flex:none}.px-app-name{font-weight:900;font-size:1rem;line-height:1.25}.px-app-badge{display:inline-flex;margin-top:5px;padding:4px 8px;border-radius:999px;background:#eef4f0;color:#176b3d;font-size:.67rem;font-weight:900}.px-app-platform{margin-top:8px;color:#777;font-size:.72rem;font-weight:800}.px-app-desc{margin:6px 0 12px;color:#676d70;font-size:.82rem;line-height:1.55;flex:1}.px-app-link{align-self:flex-start;text-decoration:none;border-radius:999px;background:#1e2428;color:#fff;padding:8px 11px;font-size:.72rem;font-weight:900}.px-app-note{margin:0 0 13px;padding:11px 13px;border-radius:15px;background:#fff4d7;color:#6d571d;font-size:.8rem}.px-app-link:active{transform:scale(.98)}@media(max-width:700px){.px-app-grid{grid-template-columns:1fr}.px-app-card{min-height:0}}`;
    const sec=document.createElement('section');
    sec.className='px-sec px-fade';sec.id='travel-apps';
    const note=trip==='hongkong'?'ฮ่องกงไม่จำเป็นต้องใช้ DiDi/Alipay เป็นหลักเหมือนจีนแผ่นดินใหญ่ — Octopus + MTR Mobile + Uber เหมาะกับทริปนี้มากกว่า':trip==='danang'?'เวียดนามใช้ Grab + Google Maps เป็นหลัก • เตรียมเงิน VND สดไว้สำหรับร้านเล็กและตลาด':'ญี่ปุ่นใช้ IC Card + Maps เป็นหลัก ส่วนแท็กซี่ติด GO ไว้เป็นตัวสำรอง';
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">TRAVEL APPS</div><h2 class="px-title">แอปที่ควรติดตั้งก่อนเดินทาง ${d.emoji}</h2><div class="px-app-note">📱 ${esc(note)}</div><div class="px-app-grid">${apps.map(a=>`<article class="px-app-card"><div class="px-app-head"><div class="px-app-icon">${a.icon}</div><div><div class="px-app-name">${esc(a.name)}</div><span class="px-app-badge">${esc(a.badge)}</span></div></div><div class="px-app-platform">${esc(a.platform)}</div><div class="px-app-desc">${esc(a.desc)}</div><a class="px-app-link" href="${a.url}" target="_blank" rel="noopener">เปิดเว็บทางการ ↗</a></article>`).join('')}</div></div>`;
    const checklist=document.getElementById('trip-checklist');
    if(checklist?.parentNode)checklist.parentNode.insertBefore(sec,checklist);else document.querySelector('main')?.appendChild(sec);
  }
  injectTravelApps();



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

})();
