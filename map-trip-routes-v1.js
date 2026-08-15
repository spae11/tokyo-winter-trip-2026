(()=>{
  if(window.__mapTripRoutesV1)return;
  window.__mapTripRoutesV1=true;

  const css=document.createElement('style');
  css.id='map-trip-routes-style';
  css.textContent=`
    .region-text-icon{background:transparent!important;border:0!important}
    .region-map-label{position:relative;display:inline-block;white-space:nowrap;color:#1E2428;font:900 15px/1.1 'Noto Sans Thai',system-ui,sans-serif;letter-spacing:.01em;text-shadow:-2px -2px 0 #fff,2px -2px 0 #fff,-2px 2px 0 #fff,2px 2px 0 #fff,0 3px 8px #0004;transform:translate(-50%,-50%);cursor:pointer}
    .region-map-label.done{color:#176a3a}.region-map-label.done:after{content:' ✓';font-size:12px}
    .trip-map-box{margin-top:14px;padding-top:14px;border-top:1px solid #0001}
    .trip-map-title{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:9px}.trip-map-title b{font-size:.92rem}
    .trip-picker{display:grid;gap:8px}.trip-pick{width:100%;border:1px solid #0001;background:#fff;border-radius:15px;padding:10px 11px;text-align:left;color:#1E2428;font:inherit;cursor:pointer;display:flex;align-items:center;gap:9px}.trip-pick strong{display:block}.trip-pick small{display:block;color:#72777b}.trip-pick.on{border-color:#B21F2D;background:#fff7f6}
    .trip-daybox{margin-top:10px;background:#F5EFE4;border-radius:16px;padding:11px}.trip-daybox label{font-size:.72rem;font-weight:900;color:#72777b;display:block;margin-bottom:5px}.trip-daybox select{width:100%;border:1px solid #d8d2c9;border-radius:12px;background:#fff;padding:9px;font:800 13px 'Noto Sans Thai',system-ui,sans-serif;color:#1E2428}
    .route-summary{margin-top:10px;display:grid;gap:7px}.route-stop{display:grid;grid-template-columns:25px 1fr auto;gap:7px;align-items:start;background:#fff;border-radius:12px;padding:8px}.route-n{width:23px;height:23px;border-radius:50%;background:#B21F2D;color:#fff;display:grid;place-items:center;font:900 11px system-ui}.route-stop b{font-size:.79rem;line-height:1.2}.route-stop small{display:block;color:#72777b;font-size:.67rem;margin-top:2px}.route-mode{font-size:.66rem;font-weight:900;color:#21443A;white-space:nowrap}.route-note{font-size:.7rem;color:#72777b;margin-top:8px}
    .route-map-marker{background:transparent!important;border:0!important}.route-map-dot{width:27px;height:27px;border-radius:50%;background:#B21F2D;color:#fff;border:3px solid #fff;box-shadow:0 4px 12px #0004;display:grid;place-items:center;font:900 11px system-ui}.route-map-label{background:#fff;border:1px solid #0001;border-radius:999px;padding:4px 7px;font:800 10px 'Noto Sans Thai',system-ui,sans-serif;color:#1E2428;box-shadow:0 4px 12px #0002;white-space:nowrap}
    .route-legend{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.route-chip{background:#fff;border:1px solid #0001;border-radius:999px;padding:5px 7px;font-size:.67rem;font-weight:800}
    @media(max-width:620px){.region-map-label{font-size:14px}.trip-daybox{padding:10px}.route-stop{grid-template-columns:24px 1fr}.route-mode{grid-column:2;margin-top:-3px}}
  `;
  document.head.appendChild(css);

  const TRIPS={
    tokyo:{country:'japan',name:'Tokyo Winter Trip 2026',flag:'🇯🇵',href:'./tokyo/',defaultStart:'2026-12-05',days:[
      {title:'Welcome to Tokyo',note:'วันแรกเน้นเข้าเมืองและ Asakusa; สนามบินจริงให้ยึดตามตั๋วบิน',stops:[
        {name:'APA Hotel Asakusa Tawaramachi',lat:35.7102,lng:139.7909,time:'หลังถึง Tokyo',mode:'🏨'},
        {name:'Senso-ji',lat:35.7148,lng:139.7967,time:'ช่วงบ่าย',mode:'🚶'},
        {name:'Nakamise Street',lat:35.7126,lng:139.7964,time:'บ่าย',mode:'🚶'},
        {name:'Asakusa / Dinner',lat:35.7116,lng:139.7983,time:'เย็น',mode:'🍽️'}]},
      {title:'Tokyo Disneyland',stops:[
        {name:'Tawaramachi',lat:35.7099,lng:139.7908,time:'เช้า',mode:'🚇 Ginza'},
        {name:'Ueno',lat:35.7138,lng:139.7773,time:'เปลี่ยนสาย',mode:'🚇 Hibiya'},
        {name:'Hatchobori',lat:35.6746,lng:139.7776,time:'เปลี่ยน JR',mode:'🚆 Keiyo'},
        {name:'Maihama',lat:35.6362,lng:139.8837,time:'ก่อนเข้าสวน',mode:'🚆 JR'},
        {name:'Tokyo Disneyland',lat:35.6329,lng:139.8804,time:'ทั้งวัน',mode:'🎢'}]},
      {title:'Mt. Fuji Day',stops:[
        {name:'Tawaramachi',lat:35.7099,lng:139.7908,time:'เช้ามืด',mode:'🚇'},
        {name:'Busta Shinjuku',lat:35.6888,lng:139.7006,time:'ก่อนรถบัส',mode:'🚌'},
        {name:'Kawaguchiko Station',lat:35.4982,lng:138.7686,time:'สาย',mode:'🚌'},
        {name:'Lake Kawaguchi',lat:35.5171,lng:138.7518,time:'กลางวัน',mode:'🗻'},
        {name:'Oishi Park',lat:35.5232,lng:138.7460,time:'บ่าย',mode:'🗻'}]},
      {title:'Tokyo City Lights',stops:[
        {name:'Tawaramachi',lat:35.7099,lng:139.7908,time:'เช้า',mode:'🚇'},
        {name:'Tokyo Camii',lat:35.6699,lng:139.6761,time:'สาย',mode:'🕌'},
        {name:'Harajuku / Meiji Jingu',lat:35.6764,lng:139.6993,time:'เที่ยง',mode:'🚇'},
        {name:'Shibuya',lat:35.6595,lng:139.7005,time:'บ่าย',mode:'🚆'},
        {name:'Shinjuku',lat:35.6938,lng:139.7034,time:'ค่ำ',mode:'🚆'}]},
      {title:'Tokyo & Shopping',stops:[
        {name:'Tawaramachi',lat:35.7099,lng:139.7908,time:'เช้า',mode:'🚇'},
        {name:'Ueno / Ameyoko',lat:35.7101,lng:139.7745,time:'สาย',mode:'🛍️'},
        {name:'Akihabara',lat:35.6984,lng:139.7731,time:'บ่าย',mode:'🚆'},
        {name:'Tokyo Station',lat:35.6812,lng:139.7671,time:'เย็น',mode:'🚆'},
        {name:'Asakusa',lat:35.7116,lng:139.7983,time:'ค่ำ',mode:'🚇'}]},
      {title:'See You Tokyo',note:'สนามบินปลายทางจะขึ้นกับตั๋วจริง จึงแสดงเส้นทางจากโรงแรมไปโซนขึ้นรถสนามบินไว้ก่อน',stops:[
        {name:'APA Hotel / Tawaramachi',lat:35.7102,lng:139.7909,time:'เช้า',mode:'🧳'},
        {name:'Asakusa Station',lat:35.7108,lng:139.7975,time:'ออกเมือง',mode:'🚆'},
        {name:'Airport connection',lat:35.7125,lng:139.7980,time:'ตามไฟลต์',mode:'✈️'}]}
    ]},
    hongkong:{country:'hongkong',name:'Hong Kong 6D5N',flag:'🇭🇰',href:'./hongkong/',fallbackDay:5,days:[
      {title:'HKIA → Tsim Sha Tsui → Harbour',stops:[
        {name:'Hong Kong International Airport',lat:22.3080,lng:113.9185,time:'10:00',mode:'✈️'},
        {name:'Holiday Inn Golden Mile',lat:22.2968,lng:114.1727,time:'11:30',mode:'🚆/🚌'},
        {name:'Kowloon Mosque',lat:22.2994,lng:114.1728,time:'16:00',mode:'🕌'},
        {name:'Avenue of Stars',lat:22.2931,lng:114.1741,time:'18:00',mode:'🚶'}]},
      {title:'Hong Kong Disneyland',stops:[
        {name:'Tsim Sha Tsui',lat:22.2975,lng:114.1722,time:'08:15',mode:'🚇'},
        {name:'Lai King',lat:22.3485,lng:114.1260,time:'เปลี่ยนสาย',mode:'🚇'},
        {name:'Sunny Bay',lat:22.3310,lng:114.0292,time:'เปลี่ยนสาย',mode:'🚇'},
        {name:'Disneyland Resort',lat:22.3155,lng:114.0452,time:'09:30',mode:'🎢'}]},
      {title:'Central → PMQ → Mong Kok',stops:[
        {name:'Star Ferry Tsim Sha Tsui',lat:22.2939,lng:114.1693,time:'09:30',mode:'⛴️'},
        {name:'Central Pier',lat:22.2878,lng:114.1582,time:'10:00',mode:'⛴️'},
        {name:'Central Market',lat:22.2845,lng:114.1556,time:'10:15',mode:'🚶'},
        {name:'PMQ',lat:22.2830,lng:114.1519,time:'11:30',mode:'🚶'},
        {name:'Mong Kok',lat:22.3193,lng:114.1694,time:'17:00',mode:'🚇'}]},
      {title:'Wan Chai → The Peak',stops:[
        {name:'Tsim Sha Tsui',lat:22.2975,lng:114.1722,time:'09:15',mode:'🚇'},
        {name:'Islamic Centre Canteen',lat:22.2778,lng:114.1810,time:'10:00',mode:'🕌'},
        {name:'Causeway Bay',lat:22.2802,lng:114.1840,time:'12:30',mode:'🚇'},
        {name:'Peak Tram Lower Terminus',lat:22.2777,lng:114.1592,time:'15:30',mode:'🚋'},
        {name:'Victoria Peak',lat:22.2759,lng:114.1455,time:'16:30',mode:'⛰️'}]},
      {title:'Ngong Ping 360 → Citygate',stops:[
        {name:'Tsim Sha Tsui',lat:22.2975,lng:114.1722,time:'08:30',mode:'🚇'},
        {name:'Tung Chung',lat:22.2894,lng:113.9412,time:'09:40',mode:'🚇'},
        {name:'Ngong Ping 360',lat:22.2560,lng:113.9010,time:'10:00',mode:'🚡'},
        {name:'Tian Tan Buddha',lat:22.2539,lng:113.9049,time:'11:00',mode:'🙏'},
        {name:'Citygate Outlets',lat:22.2890,lng:113.9414,time:'14:30',mode:'🛍️'}]},
      {title:'Brunch → Souvenirs → HKIA',stops:[
        {name:'Holiday Inn Golden Mile',lat:22.2968,lng:114.1727,time:'08:00',mode:'🧳'},
        {name:'Kowloon / Halal brunch',lat:22.3262,lng:114.1895,time:'09:30',mode:'🍽️'},
        {name:'Tsim Sha Tsui',lat:22.2975,lng:114.1722,time:'11:30',mode:'🛍️'},
        {name:'Hong Kong International Airport',lat:22.3080,lng:113.9185,time:'16:00',mode:'✈️'}]}
    ]}
  };

  let tripRouteLayer=null,activeTrip=null,activeDay=0;
  const esc2=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const routeIcon=n=>L.divIcon({className:'route-map-marker',html:`<div class="route-map-dot">${n}</div>`,iconSize:[27,27],iconAnchor:[13,13]});

  function dateLabel(trip,index){
    const s=(typeof state!=='undefined'&&state[trip===TRIPS.tokyo?'tokyo':'hongkong']?.start)||trip.defaultStart;
    if(s){const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+index);return new Intl.DateTimeFormat('th-TH',{day:'numeric',month:'short'}).format(d)}
    return `วันที่ ${(trip.fallbackDay||1)+index}`;
  }
  function clearTripRoute(){if(tripRouteLayer)tripRouteLayer.clearLayers()}
  function ensureRouteLayer(){if(typeof map==='undefined'||!map)return false;if(!tripRouteLayer)tripRouteLayer=L.layerGroup().addTo(map);return true}

  function drawTripDay(tripId,dayIndex,fly=true){
    const t=TRIPS[tripId],day=t?.days?.[dayIndex];if(!t||!day||!ensureRouteLayer())return;
    activeTrip=tripId;activeDay=dayIndex;clearTripRoute();
    const latlngs=day.stops.map(s=>[s.lat,s.lng]);
    if(latlngs.length>1)L.polyline(latlngs,{color:'#B21F2D',weight:5,opacity:.82,lineCap:'round',lineJoin:'round'}).addTo(tripRouteLayer);
    day.stops.forEach((s,i)=>{const m=L.marker([s.lat,s.lng],{icon:routeIcon(i+1),zIndexOffset:700}).addTo(tripRouteLayer);m.bindTooltip(esc2(s.name),{permanent:true,direction:i%2?'left':'right',className:'route-map-label',offset:i%2?[-9,0]:[9,0]})});
    if(fly&&latlngs.length){const b=L.latLngBounds(latlngs);map.flyToBounds(b,{padding:[42,42],maxZoom:13,duration:.7})}
    refreshTripBox();
  }

  function tripForCountry(key){return Object.entries(TRIPS).filter(([,t])=>t.country===key)}
  function appendTrips(key){
    const root=document.getElementById('countryDetail');if(!root)return;root.querySelector('.trip-map-box')?.remove();
    const items=tripForCountry(key);if(!items.length)return;
    const box=document.createElement('div');box.className='trip-map-box';
    box.innerHTML=`<div class="trip-map-title"><b>🧳 ทริปในประเทศนี้</b><span class="tiny muted">เลือกทริป → เลือกวันที่</span></div><div class="trip-picker">${items.map(([id,t])=>`<button class="trip-pick ${activeTrip===id?'on':''}" data-trip="${id}"><span style="font-size:22px">${t.flag}</span><span><strong>${esc2(t.name)}</strong><small>${t.days.length} วัน • แตะเพื่อดูเส้นทางบนแผนที่</small></span></button>`).join('')}</div><div class="trip-active-slot"></div>`;
    root.appendChild(box);
    box.querySelectorAll('.trip-pick').forEach(b=>b.addEventListener('click',()=>{activeTrip=b.dataset.trip;activeDay=0;appendTrips(key);drawTripDay(activeTrip,0,true)}));
    if(activeTrip&&TRIPS[activeTrip]?.country===key)renderTripActive(box.querySelector('.trip-active-slot'));
  }

  function renderTripActive(slot){
    const t=TRIPS[activeTrip],day=t.days[activeDay];if(!slot||!t||!day)return;
    slot.innerHTML=`<div class="trip-daybox"><label>เลือกวันที่ที่ต้องการดูเส้นทาง</label><select class="trip-day-select">${t.days.map((d,i)=>`<option value="${i}" ${i===activeDay?'selected':''}>Day ${i+1} • ${dateLabel(t,i)} • ${esc2(d.title)}</option>`).join('')}</select><div class="route-legend"><span class="route-chip">เส้นสีแดง = ลำดับการเดินทาง</span><span class="route-chip">ตัวเลข = จุดแวะ</span></div><div class="route-summary">${day.stops.map((s,i)=>`<div class="route-stop"><span class="route-n">${i+1}</span><div><b>${esc2(s.name)}</b><small>${esc2(s.time||'')}</small></div><span class="route-mode">${esc2(s.mode||'')}</span></div>`).join('')}</div>${day.note?`<div class="route-note">ℹ️ ${esc2(day.note)}</div>`:''}<a class="btn trip-link" href="${t.href}" style="margin-top:10px;width:100%">เปิดแพลนเต็ม →</a></div>`;
    slot.querySelector('.trip-day-select').addEventListener('change',e=>drawTripDay(activeTrip,Number(e.target.value),true));
  }
  function refreshTripBox(){if(typeof currentCountry==='undefined'||!currentCountry)return;const slot=document.querySelector('#countryDetail .trip-active-slot');if(slot)renderTripActive(slot)}

  function patch(){
    if(typeof L==='undefined'||typeof regionIcon!=='function'||typeof renderCountryDetail!=='function'||typeof renderWorld!=='function'||typeof showCountry!=='function')return false;
    if(window.__mapTripRoutesPatched)return true;window.__mapTripRoutesPatched=true;

    regionIcon=function(name,done){return L.divIcon({className:'region-text-icon',html:`<div class="region-map-label ${done?'done':''}">${esc2(name)}</div>`,iconSize:[1,1],iconAnchor:[0,0]})};

    const baseRenderCountryDetail=renderCountryDetail;
    renderCountryDetail=function(key){baseRenderCountryDetail(key);appendTrips(key)};
    const baseRenderRegionDetail=renderRegionDetail;
    renderRegionDetail=function(key,region){baseRenderRegionDetail(key,region)};
    const baseWorld=renderWorld;
    renderWorld=function(...args){activeTrip=null;clearTripRoute();return baseWorld.apply(this,args)};

    const rerender=()=>{try{if(typeof currentCountry!=='undefined'&&currentCountry)showCountry(currentCountry);else renderWorld(false)}catch(e){}};
    setTimeout(rerender,120);
    return true;
  }

  let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>80)clearInterval(timer)},80);
})();