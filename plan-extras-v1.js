(()=>{
  if(window.__travelPlanExtrasLoaded)return;
  window.__travelPlanExtrasLoaded=true;

  const path=location.pathname;
  const trip=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':null;
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
  checklist.innerHTML=`<div class="px-wrap"><div class="px-ey">PRE-TRIP CHECKLIST</div><h2 class="px-title">ของที่ต้องเตรียมก่อนทริป ${d.emoji}</h2><div class="px-progress-card"><div class="px-progress-head"><b>ความพร้อมของทริป</b><span id="px-count">0 / ${allItems.length}</span></div><div class="px-progress-track"><div class="px-progress-bar" id="px-bar"></div></div></div><div class="px-check-grid">${d.groups.map(g=>`<div class="px-group"><h3>${g.icon} ${esc(g.title)}</h3>${g.items.map(([id,label])=>`<label class="px-item"><input type="checkbox" data-px-id="${trip}-${id}"><span>${esc(label)}</span></label>`).join('')}</div>`).join('')}</div><div class="px-tools"><button class="px-reset" type="button" id="px-reset">ล้าง Checklist</button></div></div>`;

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
})();
