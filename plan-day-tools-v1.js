(()=>{
  if(window.__planDayToolsLoaded)return;
  window.__planDayToolsLoaded=true;

  const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':null;
  if(!trip)return;

  const ROUTES={
    tokyo:[
      {
        1:{mode:'🚆',title:'Airport → Asakusa / Tawaramachi',lines:['NRT: Keisei Access Express / Toei Asakusa Line → Asakusa แล้วต่อเดินหรือรถไฟสั้น ๆ','NRT ทางเลือก: Skyliner → Keisei Ueno → Tokyo Metro Ginza Line → Tawaramachi','HND: Keikyu Airport Line → Toei Asakusa Line → Asakusa (บางรอบเปลี่ยนที่ Sengakuji)'],note:'เลือกตามสนามบินและเวลาบินจริง เพราะขบวนตรงมีเฉพาะบางเที่ยว'}
      },
      {
        0:{mode:'🚆',title:'โรงแรม → Tokyo Disneyland',lines:['Tawaramachi → Ueno • Ginza Line','Ueno → Hatchobori • Hibiya Line','Hatchobori → Maihama • JR Keiyo / Musashino Line','Maihama → เดินประมาณ 5–7 นาทีเข้าสวน'],note:'เผื่อเวลาเปลี่ยน Metro → JR ที่ Hatchobori'},
        5:{mode:'↩️',title:'Disneyland → Asakusa',lines:['Maihama → Hatchobori • JR Keiyo / Musashino Line','Hatchobori → Ueno • Hibiya Line','Ueno → Tawaramachi • Ginza Line'],note:'หลัง Night Show คนกลับพร้อมกันเยอะ ควรเผื่อเวลา'}
      },
      {
        0:{mode:'🚇',title:'Tawaramachi → Shinjuku / Busta',lines:['Tawaramachi → Akasaka-mitsuke • Ginza Line','Akasaka-mitsuke → Shinjuku • Marunouchi Line','เดินต่อไป Shinjuku Expressway Bus Terminal (Busta Shinjuku)'],note:'ไปถึง Busta ก่อนรอบรถอย่างน้อย 20–30 นาที'},
        2:{mode:'🚌',title:'Shinjuku → Kawaguchiko',lines:['ขึ้น Highway Bus จาก Busta Shinjuku','ลง Kawaguchiko Station','เที่ยวรอบทะเลสาบใช้ local bus / เดินตามจุดที่เลือก'],note:'รอบไป-กลับควรจองล่วงหน้า'},
        6:{mode:'↩️',title:'Kawaguchiko → Tokyo',lines:['Kawaguchiko Station → Busta Shinjuku • Highway Bus รอบที่จอง','Shinjuku → Akasaka-mitsuke → Tawaramachi • Marunouchi + Ginza Line'],note:'วันฟูจิให้ยึดเวลารถบัสเป็นหลัก'}
      },
      {
        0:{mode:'🚇',title:'Tawaramachi → Tokyo Camii',lines:['Tawaramachi → Omote-sando • Ginza Line','Omote-sando → Yoyogi-uehara • Chiyoda Line','เดินประมาณ 5–8 นาทีไป Tokyo Camii'],note:'ดูป้าย Chiyoda Line ฝั่ง Yoyogi-uehara'},
        1:{mode:'🚇',title:'Tokyo Camii → Harajuku / Meiji Jingu',lines:['Yoyogi-uehara → Meiji-jingumae〈Harajuku〉 • Chiyoda Line','เดินต่อ Takeshita Street / Meiji Jingu'],note:'ช่วงนี้ใช้ Metro สั้นและเดินต่อสะดวก'},
        2:{mode:'🚆',title:'Harajuku → Shibuya',lines:['Harajuku → Shibuya • JR Yamanote Line 1 สถานี','หรือเดินประมาณ 20–25 นาทีถ้าอากาศดี'],note:'ถ้าช้อปเยอะ แนะนำ JR'},
        3:{mode:'🚆',title:'Shibuya → Shinjuku',lines:['Shibuya → Shinjuku • JR Yamanote Line ตรง'],note:'ใช้เวลาสั้นและไม่ต้องเปลี่ยนสาย'}
      },
      {
        0:{mode:'🚇',title:'Asakusa / Tawaramachi → Ueno',lines:['Tawaramachi → Ueno • Tokyo Metro Ginza Line'],note:'Ameyoko เดินจาก Ueno / Okachimachi ได้'},
        2:{mode:'🚆',title:'Ueno → Akihabara',lines:['Ueno → Akihabara • JR Yamanote หรือ Keihin-Tohoku Line'],note:'ระยะสั้น ไม่ต้องเปลี่ยนสาย'},
        3:{mode:'🚆',title:'Akihabara → Tokyo Station',lines:['Akihabara → Tokyo • JR Yamanote / Keihin-Tohoku Line'],note:'ลง Tokyo Station แล้วเดินไป Character Street / Marunouchi ตามแพลน'},
        5:{mode:'↩️',title:'Tokyo Station → Asakusa',lines:['Tokyo → Ueno • JR','Ueno → Tawaramachi • Ginza Line'],note:'เป็นเส้นกลับโรงแรมที่จำง่าย'}
      },
      {
        2:{mode:'✈️',title:'Asakusa → สนามบิน',lines:['HND: Asakusa → Haneda Airport • Toei Asakusa / Keikyu ผ่านขบวนที่เหมาะสม','NRT: Asakusa → Narita Airport • Toei Asakusa / Keisei Access Express หรือไป Ueno ต่อ Skyliner'],note:'วันกลับให้เช็ก Google Maps/แอปรถไฟตามเวลาไฟลต์จริง และออกก่อนบิน 4–5 ชม.'}
      }
    ],
    hongkong:[
      {
        1:{mode:'🚆',title:'HKIA → Tsim Sha Tsui',lines:['Airport → Kowloon Station • Airport Express','Kowloon Station → Holiday Inn Golden Mile • Taxi สะดวกสุดเมื่อมีกระเป๋า','ทางประหยัด: Airport Bus A21 → Nathan Road / Tsim Sha Tsui'],note:'Airport Express เร็วกว่า ส่วน A21 ประหยัดกว่า'}
      },
      {
        1:{mode:'🚇',title:'Tsim Sha Tsui → Disneyland Resort',lines:['Tsim Sha Tsui → Lai King • Tsuen Wan Line','Lai King → Sunny Bay • Tung Chung Line','Sunny Bay → Disneyland Resort • Disneyland Resort Line'],note:'ใช้ Octopus แตะผ่านประตูได้ทุกช่วง'},
        5:{mode:'↩️',title:'Disneyland → Tsim Sha Tsui',lines:['Disneyland Resort → Sunny Bay','Sunny Bay → Lai King • Tung Chung Line','Lai King → Tsim Sha Tsui • Tsuen Wan Line'],note:'หลัง Momentous คนขึ้นรถไฟพร้อมกันค่อนข้างเยอะ'}
      },
      {
        0:{mode:'⛴️',title:'Tsim Sha Tsui → Central',lines:['เดินไป Star Ferry Pier Tsim Sha Tsui','Star Ferry → Central Pier','จาก Central เดินต่อ Central Market / PMQ / Mid-Levels'],note:'ช่วงเช้าใช้เรือได้วิวอ่าวและเข้ากับเส้นทางวันนี้'},
        4:{mode:'🚇',title:'Mong Kok → Tsim Sha Tsui',lines:['Mong Kok → Tsim Sha Tsui • Tsuen Wan Line ตรง'],note:'ไม่ต้องเปลี่ยนสาย'}
      },
      {
        0:{mode:'🚇',title:'Tsim Sha Tsui → Wan Chai',lines:['Tsim Sha Tsui → Admiralty • Tsuen Wan Line','Admiralty → Wan Chai • Island Line 1 สถานี'],note:'Islamic Centre อยู่โซน Wan Chai'},
        2:{mode:'🚇',title:'Wan Chai / Causeway Bay → Peak Tram',lines:['ไป Central / Admiralty ด้วย Island Line','เดินต่อ Peak Tram Lower Terminus','Peak Tram → The Peak'],note:'เผื่อคิวช่วงก่อนพระอาทิตย์ตก'},
        4:{mode:'↩️',title:'The Peak → Tsim Sha Tsui',lines:['Peak Tram ลง Central','Central → Tsim Sha Tsui • Tsuen Wan Line ตรง','หรือ Star Ferry ถ้ายังมีเวลาและอยากชมวิวกลางคืน'],note:'เลือกตามเวลาจริงช่วงเย็น'}
      },
      {
        0:{mode:'🚇',title:'Tsim Sha Tsui → Tung Chung',lines:['Tsim Sha Tsui → Lai King • Tsuen Wan Line','Lai King → Tung Chung • Tung Chung Line','ออกสถานีแล้วเดินไป Ngong Ping 360 Terminal'],note:'เช็กสถานะกระเช้าก่อนออกจากโรงแรม'},
        1:{mode:'🚡',title:'Tung Chung → Ngong Ping',lines:['Ngong Ping 360 Cable Car → Ngong Ping Village','เดินต่อ Tian Tan Buddha / จุดเที่ยวรอบหมู่บ้าน'],note:'ลมหรือสภาพอากาศอาจกระทบการให้บริการ'},
        4:{mode:'↩️',title:'Tung Chung → Tsim Sha Tsui',lines:['Tung Chung → Lai King • Tung Chung Line','Lai King → Tsim Sha Tsui • Tsuen Wan Line'],note:'Citygate อยู่ติด Tung Chung Station'}
      },
      {
        3:{mode:'✈️',title:'Tsim Sha Tsui → HKIA',lines:['โรงแรม → Kowloon Station • Taxi สะดวกเมื่อมีกระเป๋า','Kowloon Station → Airport • Airport Express','ทางเลือก: A21 จาก Nathan Road → Airport'],note:'ตั้งเป้าถึงสนามบินก่อนเที่ยวบินอย่างน้อยประมาณ 3 ชั่วโมง'}
      }
    ]
  };
  ROUTES.danang=[{0:{mode:'🚕',title:'Da Nang Airport → My Khe',lines:['เปิด Grab ที่สนามบิน DAD','เลือกจุดรับรถตามป้ายสนามบิน','ไป HAIAN / My Khe แล้วเช็กอิน'],note:'เก็บชื่อโรงแรมในแอปไว้ก่อน'}},{0:{mode:'🚕',title:'My Khe → Ba Na Hills',lines:['Grab/รถจองล่วงหน้าไป Sun World Ba Na Hills','นัดเวลารับกลับหรือจองไป-กลับ'],note:'ออกเช้าเพื่อลดคิว'}},{0:{mode:'🚕',title:'Da Nang → Marble Mountains → Hoi An',lines:['เช็กเอาต์ Da Nang','แวะ Marble Mountains','ต่อรถไป Hoi An'],note:'เหมารถ/Grab แบบหลายจุดสะดวกกว่าสำหรับ 2 คนพร้อมกระเป๋า'}},{0:{mode:'🚕',title:'Hoi An → Cam Thanh',lines:['เรียก Grab/Taxi ไป Coconut Village','กลับ Ancient Town ช่วงบ่าย'],note:'เช็กจุดรับ-ส่งกับผู้ให้บริการ Basket Boat'}},{0:{mode:'🚕',title:'Hoi An → Da Nang / Son Tra',lines:['รถกลับ Da Nang','ต่อ Grab ไป Son Tra / Linh Ung','กลับ My Khe ช่วงเย็น'],note:'เผื่อเวลาและสภาพอากาศ'}},{3:{mode:'✈️',title:'Hotel → DAD Airport',lines:['รับกระเป๋า','Grab ไป Da Nang International Airport','ถึงสนามบินก่อนบินประมาณ 3 ชั่วโมง'],note:'เช็ก terminal/flight ในวันจริง'}}];
  ROUTES.yunnan=[{0:{mode:'🚕',title:'Kunming Airport → City',lines:['ใช้ DiDi/Alipay Taxi หรือ Metro ตามเวลาจริง','ส่งชื่อโรงแรมภาษาจีนให้คนขับ'],note:'Amap เป็น Maps หลักในจีน'}},{0:{mode:'🚐',title:'Kunming → Stone Forest',lines:['เลือกทัวร์/รถรับส่งหรือรถสาธารณะตามรอบจริง','เปิด 石林风景区 ใน Amap'],note:'วันนี้ออกเช้าและพก snack halal'}},{0:{mode:'🚄',title:'Kunming → Dali',lines:['Kunming South 昆明南站','รถไฟความเร็วสูงไป Dali 大理站','DiDi/Taxi ต่อเข้า Dali Ancient City'],note:'ชื่อบนตั๋วต้องตรง Passport'}},{0:{mode:'🚕',title:'Dali • Erhai • Xizhou',lines:['ใช้ DiDi/รถพร้อมคนขับสำหรับหลายจุด','Erhai → Xizhou → Three Pagodas → Old Town'],note:'เส้นรอบ Erhai ระยะไกลกว่าที่เห็นในแผนที่'}},{0:{mode:'🚄',title:'Dali → Kunming',lines:['Dali Station → Kunming South','ต่อ Metro/DiDi ไป Dianchi / Dounan'],note:'เผื่อเวลาจากสถานีเข้าเมือง'}},{2:{mode:'✈️',title:'Kunming City → Airport',lines:['DiDi/Metro ไป Kunming Changshui Airport','ถึงก่อนบินประมาณ 3 ชั่วโมง'],note:'ทริปนี้ไม่มีเที่ยวบินภายในจีน'}}];


  const DISNEY={
    tokyo:[
      {id:'beauty-beast',name:'Enchanted Tale of Beauty and the Beast',zone:'Fantasyland',priority:'ห้ามพลาด'},
      {id:'pooh-tokyo',name:"Pooh’s Hunny Hunt",zone:'Fantasyland',priority:'แนะนำ'},
      {id:'big-thunder-tokyo',name:'Big Thunder Mountain',zone:'Westernland',priority:'สายหวาดเสียว'},
      {id:'splash-tokyo',name:'Splash Mountain',zone:'Critter Country',priority:'สายหวาดเสียว'},
      {id:'haunted-tokyo',name:'Haunted Mansion',zone:'Fantasyland',priority:'คลาสสิก'},
      {id:'baymax-tokyo',name:'The Happy Ride with Baymax',zone:'Tomorrowland',priority:'แนะนำ'},
      {id:'monsters-tokyo',name:'Monsters, Inc. Ride & Go Seek!',zone:'Tomorrowland',priority:'แนะนำ'},
      {id:'small-world',name:'“it’s a small world”',zone:'Fantasyland',priority:'ข้ามสวน',shared:'small-world'},
      {id:'jungle-cruise',name:'Jungle Cruise: Wildlife Expeditions',zone:'Adventureland',priority:'ข้ามสวน',shared:'jungle-cruise'},
      {id:'dumbo',name:'Dumbo The Flying Elephant',zone:'Fantasyland',priority:'ข้ามสวน',shared:'dumbo'}
    ],
    hongkong:[
      {id:'frozen-ever-after',name:'Frozen Ever After',zone:'World of Frozen',priority:'ห้ามพลาด'},
      {id:'oaken-sleighs',name:'Wandering Oaken’s Sliding Sleighs',zone:'World of Frozen',priority:'ห้ามพลาด'},
      {id:'big-grizzly-hk',name:'Big Grizzly Mountain Runaway Mine Cars',zone:'Grizzly Gulch',priority:'สายหวาดเสียว'},
      {id:'mystic-manor',name:'Mystic Manor',zone:'Mystic Point',priority:'ห้ามพลาด'},
      {id:'hyperspace-hk',name:'Hyperspace Mountain',zone:'Tomorrowland',priority:'สายหวาดเสียว'},
      {id:'iron-man-hk',name:'Iron Man Experience',zone:'Tomorrowland',priority:'แนะนำ'},
      {id:'antman-hk',name:'Ant-Man and The Wasp: Nano Battle!',zone:'Tomorrowland',priority:'แนะนำ'},
      {id:'pooh-hk',name:'The Many Adventures of Winnie the Pooh',zone:'Fantasyland',priority:'คลาสสิก'},
      {id:'small-world',name:'“it’s a small world”',zone:'Fantasyland',priority:'ข้ามสวน',shared:'small-world'},
      {id:'jungle-cruise',name:'Jungle River Cruise',zone:'Adventureland',priority:'ข้ามสวน',shared:'jungle-cruise'},
      {id:'dumbo',name:'Dumbo the Flying Elephant',zone:'Fantasyland',priority:'ข้ามสวน',shared:'dumbo'},
      {id:'toy-parachute-hk',name:'Toy Soldier Parachute Drop',zone:'Toy Story Land',priority:'แนะนำ'},
      {id:'rc-racer-hk',name:'RC Racer',zone:'Toy Story Land',priority:'สายหวาดเสียว'}
    ]
  };

  const style=document.createElement('style');
  style.id='plan-day-tools-style';
  style.textContent=`
    .ptx-route{margin:10px 0 2px;border-radius:15px;background:#F5EFE4;border:1px solid #00000010;overflow:hidden}
    .ptx-btn{width:100%;border:0;background:transparent;color:#1E2428;display:grid;grid-template-columns:34px 1fr auto;gap:9px;align-items:center;padding:10px 11px;text-align:left;font:inherit;cursor:pointer}
    .ptx-mode{width:34px;height:34px;border-radius:10px;background:#21443A;color:#fff;display:grid;place-items:center;font-size:16px}.ptx-copy b{display:block;font-size:.84rem}.ptx-copy span{display:block;font-size:.73rem;color:#6f7478;margin-top:1px}.ptx-arr{transition:transform .32s cubic-bezier(.22,1,.36,1)}.ptx-route.open .ptx-arr{transform:rotate(180deg)}
    .ptx-panel{height:0;opacity:0;overflow:hidden;transform:translateY(-5px);transition:height .42s cubic-bezier(.22,1,.36,1),opacity .28s ease,transform .36s ease}.ptx-route.open .ptx-panel{opacity:1;transform:none}.ptx-inner{padding:0 11px 11px}.ptx-line{display:flex;gap:8px;padding:7px 0;border-top:1px dashed #00000012;font-size:.79rem;line-height:1.45}.ptx-line:first-child{border-top:0}.ptx-dot{color:#B21F2D;font-weight:900}.ptx-note{margin-top:7px;padding:8px 9px;border-radius:11px;background:#fff4d7;font-size:.73rem;color:#5f5748}
    .dc-card{margin:18px 0 2px;border:1px solid #00000012;border-radius:20px;background:#fff;overflow:hidden;box-shadow:0 10px 28px #372a2510}.dc-head{padding:15px 15px 12px;background:linear-gradient(135deg,#21443A,#162e28);color:#fff}.dc-head-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.dc-head h3{margin:2px 0;font-size:1.05rem}.dc-head p{margin:2px 0 0;font-size:.78rem;opacity:.82}.dc-progress{font-weight:900;font-size:.8rem;background:#ffffff18;border:1px solid #ffffff25;border-radius:999px;padding:6px 9px;white-space:nowrap}.dc-list{padding:6px 12px 12px}.dc-row{padding:10px 0;border-top:1px solid #00000010}.dc-row:first-child{border-top:0}.dc-info{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.dc-name{font-weight:900;font-size:.88rem}.dc-meta{font-size:.72rem;color:#74797d;margin-top:2px}.dc-priority{font-size:.68rem;font-weight:900;background:#F5EFE4;color:#B21F2D;border-radius:999px;padding:5px 7px;white-space:nowrap}.dc-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.dc-check{display:inline-flex;align-items:center;gap:5px;border:1px solid #00000012;border-radius:999px;padding:6px 8px;font-size:.74rem;font-weight:800;background:#fff;cursor:pointer}.dc-check input{accent-color:#B21F2D}.dc-other{display:inline-flex;align-items:center;gap:5px;border-radius:999px;background:#e3f1e9;color:#21443A;padding:6px 8px;font-size:.72rem;font-weight:900;text-decoration:none}.dc-other.none{background:#f0ede7;color:#777}.dc-foot{padding:0 12px 12px;color:#73777b;font-size:.72rem;line-height:1.45}
    @media(max-width:480px){.ptx-btn{padding:9px}.dc-head{padding:13px}.dc-list{padding:5px 10px 10px}.dc-name{font-size:.84rem}}
    @media(prefers-reduced-motion:reduce){.ptx-panel,.ptx-arr{transition:none!important;transform:none!important}}
  `;
  document.head.appendChild(style);

  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const smoothToggle=(box,panel,open)=>{
    if(open){box.classList.add('open');panel.style.height='0px';panel.offsetHeight;panel.style.height=panel.scrollHeight+'px';setTimeout(()=>{if(box.classList.contains('open'))panel.style.height='auto'},440)}
    else{panel.style.height=panel.scrollHeight+'px';panel.offsetHeight;box.classList.remove('open');requestAnimationFrame(()=>panel.style.height='0px')}
  };

  function routeHTML(r){
    const box=document.createElement('div');box.className='ptx-route';
    box.innerHTML=`<button class="ptx-btn" type="button"><span class="ptx-mode">${r.mode}</span><span class="ptx-copy"><b>${esc(r.title)}</b><span>แตะดูสถานี / จุดเปลี่ยนสาย</span></span><span class="ptx-arr">⌄</span></button><div class="ptx-panel"><div class="ptx-inner">${r.lines.map((x,i)=>`<div class="ptx-line"><span class="ptx-dot">${i+1}</span><span>${esc(x)}</span></div>`).join('')}<div class="ptx-note">💡 ${esc(r.note)}</div></div></div>`;
    const btn=box.querySelector('.ptx-btn'),panel=box.querySelector('.ptx-panel');
    btn.addEventListener('click',()=>smoothToggle(box,panel,!box.classList.contains('open')));
    return box;
  }

  function addPerStopRoutes(){
    document.querySelectorAll('.pt-route').forEach(el=>el.remove());
    const days=[...document.querySelectorAll('.day')];
    const routeDays=ROUTES[trip]||[];
    days.forEach((day,dayIndex)=>{
      const steps=[...day.querySelectorAll('.timeline .step')];
      const configs=routeDays[dayIndex]||{};
      Object.keys(configs).forEach(k=>{
        const idx=Number(k);const step=steps[idx];if(!step||step.querySelector('.ptx-route'))return;
        step.appendChild(routeHTML(configs[k]));
      });
    });
  }

  const disneyKey='travelHubDisneyChecklistV1';
  let disneyState={};try{disneyState=JSON.parse(localStorage.getItem(disneyKey)||'{}')}catch(e){}
  const saveDisney=()=>{try{localStorage.setItem(disneyKey,JSON.stringify(disneyState))}catch(e){}};
  const parkLabel=p=>p==='tokyo'?'Tokyo':'Hong Kong';
  const otherPark=trip==='tokyo'?'hongkong':'tokyo';

  function addDisneyChecklist(){
    if(!DISNEY[trip])return;
    const day=document.querySelectorAll('.day')[1];if(!day||day.querySelector('.dc-card'))return;
    const body=day.querySelector('.body');if(!body)return;
    const rides=DISNEY[trip];
    const card=document.createElement('section');card.className='dc-card';card.id='disney-checklist';
    card.innerHTML=`<div class="dc-head"><div class="dc-head-top"><div><div style="font-size:.72rem;font-weight:900;letter-spacing:.06em">DISNEY CHECKLIST</div><h3>🎢 เครื่องเล่นที่อยากเก็บ</h3></div><span class="dc-progress" id="dc-progress">0 / ${rides.length}</span></div><p>ติ๊ก “อยากเล่น” ไว้ก่อน แล้วติ๊ก “เล่นแล้ว” ตอนออกจากเครื่องเล่นได้เลย</p></div><div class="dc-list"></div><div class="dc-foot">สถานะเก็บไว้ในเครื่องเดียวกัน • รายการที่มี “ข้ามสวน” จะบอกด้วยว่าเคยเล่นที่ Tokyo/Hong Kong แล้วหรือยัง</div>`;
    const list=card.querySelector('.dc-list');

    const render=()=>{
      list.innerHTML=rides.map(r=>{
        const state=disneyState[trip]?.[r.id]||{};
        const sharedId=r.shared;
        const otherRide=sharedId ? (DISNEY[otherPark].find(x=>x.shared===sharedId)||null) : null;
        const otherDone=otherRide && !!(disneyState[otherPark]?.[otherRide.id]?.done);
        const cross=otherRide ? `<a class="dc-other ${otherDone?'':'none'}" href="/tokyo-winter-trip-2026/${otherPark}/#disney-checklist">${otherDone?'✅':'↗'} ${otherDone?'เล่นแล้วที่ ':''}${parkLabel(otherPark)}</a>` : '';
        return `<div class="dc-row" data-ride="${esc(r.id)}"><div class="dc-info"><div><div class="dc-name">${esc(r.name)}</div><div class="dc-meta">${esc(r.zone)}</div></div><span class="dc-priority">${esc(r.priority)}</span></div><div class="dc-actions"><label class="dc-check"><input type="checkbox" data-kind="want" ${state.want?'checked':''}> ⭐ อยากเล่น</label><label class="dc-check"><input type="checkbox" data-kind="done" ${state.done?'checked':''}> ✅ เล่นแล้ว</label>${cross}</div></div>`;
      }).join('');
      list.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',e=>{
        const row=e.target.closest('.dc-row');const id=row.dataset.ride;const kind=e.target.dataset.kind;
        disneyState[trip]??={};disneyState[trip][id]??={};disneyState[trip][id][kind]=e.target.checked;
        if(kind==='done'&&e.target.checked)disneyState[trip][id].want=true;
        saveDisney();render();updateProgress();
      }));
      updateProgress();
    };
    const updateProgress=()=>{
      const done=rides.filter(r=>disneyState[trip]?.[r.id]?.done).length;
      const el=card.querySelector('#dc-progress');if(el)el.textContent=`${done} / ${rides.length} เล่นแล้ว`;
    };
    body.appendChild(card);render();

    if(location.hash==='#disney-checklist'){
      day.classList.add('open');
      setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'start'}),520);
    }
  }

  const boot=()=>{addPerStopRoutes();addDisneyChecklist()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();