(()=>{
  if(window.__planTransportLoaded)return;
  window.__planTransportLoaded=true;

  const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':null;
  if(!trip)return;

  const ROUTES={
    tokyo:[
      {
        short:'สนามบิน → Asakusa / Tawaramachi',
        badge:'Airport transfer',
        steps:[
          ['✈️ NRT','ทางง่าย: Keisei Access Express / ขบวนที่วิ่งต่อ Toei Asakusa Line → Asakusa แล้วต่อเดิน/รถไฟสั้น ๆ ไปโรงแรม'],
          ['✈️ NRT Plan B','Skyliner → Keisei Ueno → เดินไป Ueno Metro → Ginza Line 1 สถานี → Tawaramachi'],
          ['✈️ HND','Keikyu Airport Line → ขบวนที่วิ่งต่อ Toei Asakusa Line → Asakusa; บางรอบอาจต้องเปลี่ยนที่ Sengakuji'],
          ['🚶 หลังเช็กอิน','Senso-ji / Kaminarimon / Nakamise เดินเที่ยวจากโซน Asakusa ได้ ไม่จำเป็นต้องขึ้นรถไฟ']
        ],
        note:'เลือกเส้นทางสนามบินตามสนามบินและเวลาบินจริง ขบวนตรงมีเฉพาะบางเที่ยว'
      },
      {
        short:'Tawaramachi → Ueno → Hatchobori → Maihama',
        badge:'Disneyland',
        steps:[
          ['1','Tawaramachi (G18) → Ueno (G16) • Tokyo Metro Ginza Line'],
          ['2','Ueno → Hatchobori • เปลี่ยนเป็น Tokyo Metro Hibiya Line'],
          ['3','Hatchobori → Maihama • เปลี่ยนเป็น JR Keiyo / Musashino Line'],
          ['4','ออก JR Maihama Station แล้วเดินประมาณ 5–7 นาทีถึง Tokyo Disneyland'],
          ['↩️ กลับ','Maihama → Hatchobori → Ueno → Tawaramachi ย้อนเส้นทางเดิม']
        ],
        note:'ช่วงเช้าเผื่อเวลาเปลี่ยนจาก Metro ไป JR ที่ Hatchobori และช่วงหลังโชว์กลางคืนคนจะเยอะ'
      },
      {
        short:'Tawaramachi → Shinjuku → Highway Bus → Kawaguchiko',
        badge:'Mt. Fuji',
        steps:[
          ['1','Tawaramachi → Akasaka-mitsuke • Ginza Line'],
          ['2','Akasaka-mitsuke → Shinjuku • เปลี่ยน Marunouchi Line'],
          ['3','เดินจาก Shinjuku Station ไป Shinjuku Expressway Bus Terminal (Busta Shinjuku)'],
          ['4','Highway Bus → Kawaguchiko Station • ควรจองรอบล่วงหน้า'],
          ['5','เที่ยวรอบ Lake Kawaguchi ใช้ local bus / เดินตามจุดที่เลือก'],
          ['↩️ กลับ','Kawaguchiko → Shinjuku ด้วยรอบรถบัสที่จอง → Metro กลับ Tawaramachi']
        ],
        note:'วันฟูจิให้ยึดเวลารถ Highway Bus เป็นหลักและไปถึง Busta ก่อนเวลาอย่างน้อย 20–30 นาที'
      },
      {
        short:'Tokyo Camii → Harajuku → Shibuya → Shinjuku',
        badge:'City lights',
        steps:[
          ['1','Tawaramachi → Omote-sando • Ginza Line'],
          ['2','Omote-sando → Yoyogi-uehara • เปลี่ยน Chiyoda Line → เดินไป Tokyo Camii'],
          ['3','Yoyogi-uehara → Meiji-jingumae (Harajuku) • Chiyoda Line'],
          ['4','Harajuku → Shibuya • JR Yamanote 1 สถานี หรือเดิน/ใช้ Fukutoshin Line'],
          ['5','Shibuya → Shinjuku • JR Yamanote Line'],
          ['↩️ กลับ','Shinjuku → Akasaka-mitsuke • Marunouchi → เปลี่ยน Ginza Line → Tawaramachi']
        ],
        note:'วันนี้เปลี่ยนสายหลายครั้ง ใช้ IC Card แตะเข้า-ออกจะสะดวกที่สุด'
      },
      {
        short:'Tawaramachi → Ueno → Akihabara → Tokyo/Ginza',
        badge:'Shopping',
        steps:[
          ['1','Tawaramachi → Ueno • Ginza Line'],
          ['2','Ueno → Akihabara • JR Yamanote / Keihin-Tohoku Line'],
          ['3','Akihabara → Tokyo • JR Yamanote / Keihin-Tohoku Line'],
          ['4','Tokyo → Ginza • เดินหรือ Marunouchi Line 1 สถานี'],
          ['↩️ กลับ','Ginza → Tawaramachi • Ginza Line ตรง ไม่ต้องเปลี่ยนสาย']
        ],
        note:'ถ้าช้อปของเยอะ สามารถข้าม Akihabara แล้วเน้น Ueno + Tokyo Station + Ginza เพื่อลดการถือของขึ้นลงรถไฟ'
      },
      {
        short:'Asakusa → สนามบิน NRT / HND',
        badge:'Airport',
        steps:[
          ['✈️ ไป NRT','Asakusa → Keisei Access Express / Toei Asakusa through-service ไป Narita ตามขบวนที่ให้บริการ'],
          ['✈️ NRT Plan B','Tawaramachi → Ueno • Ginza Line → เดินไป Keisei Ueno → Skyliner → Narita Airport'],
          ['✈️ ไป HND','Asakusa → Toei Asakusa Line / Keikyu through-service → Haneda Airport; บางรอบอาจต้องเปลี่ยนขบวน'],
          ['⏰ เผื่อเวลา','ออกจากโรงแรมให้ถึงสนามบินก่อนเวลาเที่ยวบินประมาณ 3 ชั่วโมง และเพิ่มเวลาเผื่อสำหรับ NRT']
        ],
        note:'เช็กปลายทางขบวนบนป้ายสถานีทุกครั้ง เพราะรถบางขบวนไม่ได้วิ่งตรงถึงสนามบิน'
      }
    ],
    hongkong:[
      {
        short:'HKIA → Kowloon → Tsim Sha Tsui',
        badge:'Airport Express',
        steps:[
          ['1','Hong Kong International Airport → Kowloon Station • Airport Express'],
          ['2','Kowloon Station → Holiday Inn Golden Mile • ต่อ Taxi จะง่ายสุดเมื่อมีกระเป๋า'],
          ['🚌 ทางเลือก','Airport Bus A21 ลงโซน Nathan Road / Tsim Sha Tsui ได้ เหมาะถ้าไม่รีบ'],
          ['🚶 หลังเช็กอิน','Kowloon Mosque / Avenue of Stars เดินหรือใช้ MTR ระยะสั้นจาก TST']
        ],
        note:'Airport Express เร็วและจัดการกระเป๋าง่าย ส่วน A21 ประหยัดกว่าแต่ใช้เวลามากกว่า'
      },
      {
        short:'Tsim Sha Tsui → Lai King → Sunny Bay → Disneyland',
        badge:'MTR • Disneyland',
        steps:[
          ['1','Tsim Sha Tsui → Lai King • Tsuen Wan Line'],
          ['2','Lai King → Sunny Bay • เปลี่ยน Tung Chung Line'],
          ['3','Sunny Bay → Disneyland Resort • เปลี่ยน Disneyland Resort Line'],
          ['4','ออก Disneyland Resort Station แล้วเดินเข้าประตูสวนได้เลย'],
          ['↩️ กลับ','Disneyland Resort → Sunny Bay → Lai King → Tsim Sha Tsui ย้อนเส้นทางเดิม']
        ],
        note:'ใช้ Octopus แตะผ่านประตูได้ทุกช่วง และหลัง Night Show คนขึ้นรถไฟพร้อมกันค่อนข้างเยอะ'
      },
      {
        short:'TST → Star Ferry → Central → Mong Kok',
        badge:'Ferry + MTR',
        steps:[
          ['1','เดินจากโรงแรม / TST ไป Star Ferry Pier'],
          ['2','Star Ferry: Tsim Sha Tsui → Central'],
          ['3','Central Market / PMQ / Mid-Levels ใช้การเดินเป็นหลัก'],
          ['4','Central → Mong Kok • MTR Tsuen Wan Line ตรง'],
          ['↩️ กลับ','Mong Kok → Tsim Sha Tsui • Tsuen Wan Line ตรง']
        ],
        note:'วันนี้เดินเยอะ ควรใช้ Star Ferry ช่วงเช้าแล้วค่อยใช้ MTR สำหรับระยะไกลช่วงบ่าย/เย็น'
      },
      {
        short:'TST → Admiralty → Wan Chai → Central / The Peak',
        badge:'MTR + Peak Tram',
        steps:[
          ['1','Tsim Sha Tsui → Admiralty • Tsuen Wan Line'],
          ['2','Admiralty → Wan Chai • เปลี่ยน Island Line 1 สถานี'],
          ['3','เที่ยว Islamic Centre / Wai Kee ในโซน Wan Chai–Causeway Bay'],
          ['4','กลับ Central / Admiralty แล้วเดินไป Peak Tram Lower Terminus'],
          ['5','Peak Tram → The Peak'],
          ['↩️ กลับ','Central → Tsim Sha Tsui • Tsuen Wan Line ตรง หรือเลือก Star Ferry ถ้ายังมีเวลา']
        ],
        note:'ช่วงเย็น Peak Tram อาจมีคิว ควรเผื่อเวลาขึ้นก่อนช่วงพระอาทิตย์ตก'
      },
      {
        short:'TST → Lai King → Tung Chung → Ngong Ping 360',
        badge:'MTR + Cable Car',
        steps:[
          ['1','Tsim Sha Tsui → Lai King • Tsuen Wan Line'],
          ['2','Lai King → Tung Chung • เปลี่ยน Tung Chung Line'],
          ['3','ออก Tung Chung Station แล้วเดินไป Ngong Ping 360 Tung Chung Terminal'],
          ['4','Cable Car → Ngong Ping Village / Tian Tan Buddha'],
          ['5','ขากลับ Cable Car → Tung Chung → เดิน Citygate Outlets'],
          ['↩️ กลับ','Tung Chung → Lai King → Tsim Sha Tsui']
        ],
        note:'เช็กสถานะกระเช้าก่อนออกจากโรงแรม เพราะลมแรงหรือสภาพอากาศอาจกระทบการให้บริการ'
      },
      {
        short:'Tsim Sha Tsui → Kowloon Station → HKIA',
        badge:'Airport Express',
        steps:[
          ['1','Check-out แล้วเก็บของ / ซื้อของฝากรอบสุดท้ายใน TST'],
          ['2','จากโรงแรมไป Kowloon Station • Taxi จะสะดวกที่สุดพร้อมกระเป๋า'],
          ['3','Kowloon Station → Hong Kong International Airport • Airport Express'],
          ['🚌 ทางเลือก','A21 จาก Nathan Road ไปสนามบินได้ถ้าเวลาพอและอยากลดค่าเดินทาง'],
          ['⏰ เผื่อเวลา','ตั้งเป้าถึง HKIA ก่อนเที่ยวบินอย่างน้อยประมาณ 3 ชั่วโมง']
        ],
        note:'วันกลับให้เลือกเส้นทางที่ชัวร์ที่สุดตามเวลาไฟลต์จริง ไม่ควรอัดกิจกรรมช่วงบ่ายแน่นเกินไป'
      }
    ]
  };

  const style=document.createElement('style');
  style.id='plan-transport-style';
  style.textContent=`
    .pt-route{margin:16px 0 2px;border:1px solid #00000012;border-radius:18px;background:linear-gradient(135deg,#fff,#F5EFE4);overflow:hidden;box-shadow:0 8px 24px #372a250d}
    .pt-route-toggle{width:100%;border:0;background:transparent;color:#1E2428;padding:13px 14px;display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;text-align:left;font:inherit;cursor:pointer}
    .pt-icon{width:34px;height:34px;border-radius:11px;background:#21443A;color:#fff;display:grid;place-items:center;font-size:17px}
    .pt-title{font-weight:900;font-size:.94rem;line-height:1.3}.pt-short{display:block;color:#6f7478;font-size:.78rem;font-weight:600;margin-top:2px}
    .pt-arrow{font-size:18px;transition:transform .34s cubic-bezier(.22,1,.36,1)}.pt-route.is-open .pt-arrow{transform:rotate(180deg)}
    .pt-panel{height:0;overflow:hidden;opacity:0;transform:translateY(-6px);transition:height .45s cubic-bezier(.22,1,.36,1),opacity .3s ease,transform .4s cubic-bezier(.22,1,.36,1)}
    .pt-route.is-open .pt-panel{opacity:1;transform:none}.pt-inner{padding:0 14px 14px}
    .pt-badge{display:inline-flex;padding:6px 9px;border-radius:999px;background:#B21F2D;color:#fff;font-weight:900;font-size:.72rem;margin-bottom:9px}
    .pt-step{display:grid;grid-template-columns:32px 1fr;gap:9px;padding:9px 0;border-top:1px dashed #00000012}.pt-step:first-of-type{border-top:0}.pt-num{font-weight:900;color:#B21F2D;font-size:.79rem}.pt-text{font-size:.86rem;line-height:1.5}
    .pt-note{margin-top:10px;padding:10px 11px;border-radius:13px;background:#fff4d7;color:#5e5546;font-size:.79rem;line-height:1.5}
    @media(max-width:480px){.pt-route-toggle{padding:11px 12px}.pt-inner{padding:0 12px 12px}.pt-title{font-size:.9rem}.pt-short{font-size:.75rem}}
    @media(prefers-reduced-motion:reduce){.pt-panel,.pt-arrow{transition:none!important;transform:none!important}}
  `;
  document.head.appendChild(style);

  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function addRoutes(){
    const days=[...document.querySelectorAll('.day')];
    const data=ROUTES[trip]||[];
    days.forEach((day,i)=>{
      if(day.querySelector('.pt-route')||!data[i])return;
      const body=day.querySelector('.body');if(!body)return;
      const r=data[i];
      const box=document.createElement('div');
      box.className='pt-route';
      box.innerHTML=`<button type="button" class="pt-route-toggle" aria-expanded="false"><span class="pt-icon">🚆</span><span><span class="pt-title">วิธีเดินทางวันนี้</span><span class="pt-short">${esc(r.short)} • แตะเพื่อดูรายละเอียด</span></span><span class="pt-arrow">⌄</span></button><div class="pt-panel"><div class="pt-inner"><span class="pt-badge">${esc(r.badge)}</span>${r.steps.map(([n,t])=>`<div class="pt-step"><div class="pt-num">${esc(n)}</div><div class="pt-text">${esc(t)}</div></div>`).join('')}<div class="pt-note">💡 ${esc(r.note)}<br>เส้นทางเป็น guideline — ก่อนออกเดินทางเช็ก Google Maps / แอปผู้ให้บริการอีกครั้งตามเวลาจริง</div></div></div>`;
      body.appendChild(box);
      const btn=box.querySelector('.pt-route-toggle');
      const panel=box.querySelector('.pt-panel');
      const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      btn.addEventListener('click',()=>{
        const open=!box.classList.contains('is-open');
        box.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));
        if(reduce){panel.style.height=open?'auto':'0px';return}
        if(open){panel.style.height='0px';panel.offsetHeight;panel.style.height=panel.scrollHeight+'px';const done=e=>{if(e.propertyName==='height'&&box.classList.contains('is-open')){panel.style.height='auto';panel.removeEventListener('transitionend',done)}};panel.addEventListener('transitionend',done)}
        else{panel.style.height=panel.scrollHeight+'px';panel.offsetHeight;requestAnimationFrame(()=>panel.style.height='0px')}
      });
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(addRoutes,0),{once:true});
  else setTimeout(addRoutes,0);
})();