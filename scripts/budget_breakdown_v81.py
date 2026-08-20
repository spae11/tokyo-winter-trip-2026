from pathlib import Path

p=Path('plan-extras-v1.js')
s=p.read_text()
marker='  /* SOUVENIR_GUIDE_V80 — one shared souvenir section for every trip. */'
if 'TRIP_BUDGET_BREAKDOWN_V81' not in s:
    block=r'''

  /* TRIP_BUDGET_BREAKDOWN_V81 — restore per-category planning budget on every trip. */
  const TRIP_BUDGET_BREAKDOWN_V81={
    tokyo:{total:85000,note:'Tokyo Winter + Disneyland + Mt. Fuji • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','34,000','BKK ↔ Tokyo • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','17,000','5 คืน • Asakusa / ระดับกลาง'],
      ['🚆','เดินทาง','7,000','สนามบิน + รถไฟ/Metro + Fuji transport'],
      ['🎟️','ตั๋ว & กิจกรรม','12,000','Disneyland + Fuji/Ropeway + ค่าเข้า'],
      ['🍽️','อาหาร','10,000','6 วัน • 2 คน • เผื่อร้าน Halal'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + ค่าใช้จ่ายจุกจิก']
    ]},
    kansai:{total:90000,note:'Osaka + Kyoto + Nara + Kobe • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','35,000','BKK ↔ KIX • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','20,000','5 คืน • Osaka/Namba ระดับกลาง'],
      ['🚆','เดินทาง','10,000','KIX + Osaka/Kyoto/Nara/Kobe'],
      ['🎟️','ตั๋ว & กิจกรรม','5,000','วัด / จุดชมวิว / ค่าเข้า'],
      ['🍽️','อาหาร','14,000','6 วัน • 2 คน'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','6,000','เน็ต + ประกัน + Buffer']
    ]},
    hongkong:{total:70000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','17,000','5 คืน • Tsim Sha Tsui / Kowloon'],
      ['🚇','เดินทาง','5,000','Airport + MTR + Ferry + Octopus'],
      ['🎟️','ตั๋ว & กิจกรรม','10,000','Disneyland + Ngong Ping + Peak Tram'],
      ['🍽️','อาหาร','11,000','6 วัน • 2 คน • Halal/Muslim-friendly'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]},
    danang:{total:50000,note:'Da Nang + Hoi An + Ba Na Hills • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','15,000','Bangkok ↔ Da Nang • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','11,000','5 คืน • Da Nang + Hoi An'],
      ['🚕','เดินทาง','5,000','Airport + Grab + Da Nang ↔ Hoi An'],
      ['🎟️','ตั๋ว & กิจกรรม','7,000','Ba Na Hills + Basket Boat + ค่าเข้า'],
      ['🍽️','อาหาร','7,000','6 วัน • 2 คน'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]},
    yunnan:{total:52000,note:'Kunming + Dali 6D5N • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','16,000','Bangkok ↔ Kunming • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','10,000','5 คืน • Kunming + Dali'],
      ['🚄','เดินทาง','7,000','Airport + HSR Kunming↔Dali + DiDi'],
      ['🎟️','ตั๋ว & กิจกรรม','6,000','Stone Forest + Erhai/Three Pagodas + ค่าเข้า'],
      ['🍽️','อาหาร','8,000','6 วัน • 2 คน • 清真/Halal'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]},
    chongqing:{total:60000,note:'Chongqing + Wulong 6D5N • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','Bangkok ↔ Chongqing • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','10,000','5 คืน • Jiefangbei/Xiaoshizi'],
      ['🚄','เดินทาง','8,000','Airport + Metro/DiDi + Wulong/Dazu'],
      ['🎟️','ตั๋ว & กิจกรรม','6,000','Cableway + Wulong + Dazu/ค่าเข้า'],
      ['🍽️','อาหาร','8,000','6 วัน • 2 คน • 清真/Halal'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','6,000','เน็ต + ประกัน + Buffer']
    ]},
    harbin:{total:75000,note:'Harbin + Yabuli + Snow Town 6D5N • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','Bangkok ↔ Harbin • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','13,000','Harbin + Yabuli + Snow Town • 5 คืน'],
      ['🚄','เดินทาง','10,000','Airport + รถไฟ/Transfer Yabuli–Xuexiang'],
      ['🎿','ตั๋ว & กิจกรรม','14,000','Ice & Snow World + Ski + Snow Town'],
      ['🍽️','อาหาร','9,000','6 วัน • 2 คน'],
      ['🧥','Winter gear / eSIM / ประกัน / เผื่อ','7,000','อุปกรณ์หนาว + เน็ต + ประกัน + Buffer']
    ]}
  };
  function injectTripBudgetBreakdown(){
    if(document.getElementById('trip-budget-breakdown'))return;
    const d=TRIP_BUDGET_BREAKDOWN_V81[trip];if(!d)return;
    const st=document.createElement('style');st.dataset.tripBudgetBreakdown='81';st.textContent=`
      .px-bg-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}.px-bg-total{padding:9px 13px;border-radius:15px;background:#1e2428;color:#fff;font-weight:900;white-space:nowrap}.px-bg-total b{font-size:1.18rem}.px-bg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.px-bg-item{background:#fff;border:1px solid #00000012;border-radius:18px;padding:13px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:start;box-shadow:0 8px 24px #372a2510}.px-bg-icon{width:40px;height:40px;border-radius:13px;background:#f5efe4;display:grid;place-items:center;font-size:1.2rem}.px-bg-name{font-size:.78rem;color:#666d70;font-weight:800}.px-bg-money{font-size:1.05rem;font-weight:900;color:#b21f2d;line-height:1.3}.px-bg-desc{margin-top:3px;color:#777;font-size:.69rem;line-height:1.45}.px-bg-note{margin-top:11px;padding:10px 12px;border-radius:14px;background:#eef4f0;color:#355e48;font-size:.74rem;line-height:1.5}@media(max-width:760px){.px-bg-grid{grid-template-columns:1fr 1fr}}@media(max-width:460px){.px-bg-grid{grid-template-columns:1fr}.px-bg-item{grid-template-columns:40px minmax(0,1fr)}}`;
    document.head.appendChild(st);
    const sec=document.createElement('section');sec.id='trip-budget-breakdown';sec.className='px-sec px-fade';
    sec.innerHTML=`<div class="px-wrap"><div class="px-bg-head"><div><div class="px-ey">TRIP BUDGET • 2 PEOPLE</div><h2>💰 งบประมาณแยกรายหมวด</h2><p class="px-muted">${d.note} • เป็นงบวางแผนตามราคาทั่วไป ไม่ใช่ราคาต่ำสุด</p></div><div class="px-bg-total">รวมประมาณ <b>${Number(d.total).toLocaleString('th-TH')} ฿</b></div></div><div class="px-bg-grid">${d.items.map(x=>`<div class="px-bg-item"><div class="px-bg-icon">${x[0]}</div><div><div class="px-bg-name">${x[1]}</div><div class="px-bg-money">~${x[2]} ฿</div><div class="px-bg-desc">${x[3]}</div></div></div>`).join('')}</div><div class="px-bg-note">🧾 ไม่รวมช้อปปิ้ง/ของฝากหนัก ๆ • ค่าใช้จริงสามารถบันทึกแยกใน <b>Trip Tools → ค่าใช้จ่าย</b> ได้ และตัวเลขนี้ควรปรับอีกครั้งหลังเลือกวันบินกับโรงแรมจริง</div></div>`;
    const souvenir=document.getElementById('trip-souvenirs');
    if(souvenir?.parentNode)souvenir.parentNode.insertBefore(sec,souvenir);else{const apps=document.getElementById('travel-apps');if(apps?.parentNode)apps.insertAdjacentElement('afterend',sec);else document.querySelector('main')?.appendChild(sec)}
  }
  injectTripBudgetBreakdown();

'''
    if marker not in s:
        raise SystemExit('souvenir marker not found')
    s=s.replace(marker,block+marker,1)
    p.write_text(s)

# bump cache/version so installed PWA gets the restored budget UI
p=Path('sw.js'); s=p.read_text(); s=s.replace("our-journey-v80","our-journey-v81").replace('?v=80','?v=81'); p.write_text(s)
p=Path('index.html'); s=p.read_text(); s=s.replace('?v=80','?v=81').replace('ourJourneySWReloadV80','ourJourneySWReloadV81').replace('sw.js?v=80','sw.js?v=81'); p.write_text(s)
p=Path('manifest.webmanifest'); s=p.read_text(); s=s.replace('app=80','app=81').replace('pwa=27','pwa=28'); p.write_text(s)
