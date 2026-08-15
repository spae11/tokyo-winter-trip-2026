(()=>{
  if(window.__journeyMapV1)return;window.__journeyMapV1=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  let mode='all',year='all',tripPick='tokyo',patched=false,noteTimer=null;

  function safeYears(){
    const ys=new Set();
    try{(memories||[]).forEach(m=>{if(m.date&&/^\d{4}/.test(m.date))ys.add(m.date.slice(0,4))})}catch(e){}
    ['tokyo','hongkong'].forEach(id=>{const c=$(`.trip-card[data-id="${id}"] .check`),s=$(`.trip-card[data-id="${id}"] .start`);if(c?.checked&&s?.value)ys.add(s.value.slice(0,4))});
    return [...ys].sort((a,b)=>b.localeCompare(a));
  }
  function filteredMemories(){
    try{return (memories||[]).filter(m=>year==='all'||String(m.date||'').startsWith(year))}catch(e){return []}
  }
  function completedTrips(){
    return ['tokyo','hongkong'].filter(id=>$(`.trip-card[data-id="${id}"] .check`)?.checked).map(id=>({id,start:$(`.trip-card[data-id="${id}"] .start`)?.value||'',country:id==='tokyo'?'japan':'hongkong'})).filter(t=>year==='all'||String(t.start||'').startsWith(year));
  }
  function note(text){
    const n=$('.journey-map-note');if(!n)return;n.textContent=text;n.classList.add('show');clearTimeout(noteTimer);noteTimer=setTimeout(()=>n.classList.remove('show'),1800);
  }
  function transition(fn){
    const s=$('#mapStage');if(!s){fn();return}s.classList.add('journey-fading');setTimeout(()=>{try{fn()}finally{requestAnimationFrame(()=>{s.classList.remove('journey-fading');s.classList.add('journey-enter');setTimeout(()=>s.classList.remove('journey-enter'),520)})}},135);
  }
  function clearRouteVisual(){
    try{if(typeof map==='undefined'||!map)return;const x=[];map.eachLayer(l=>{if(l instanceof L.Polyline&&l.options?.color==='#B21F2D')x.push(l);else if(l instanceof L.Marker&&l.options?.icon?.options?.className==='route-map-marker')x.push(l)});x.forEach(l=>map.removeLayer(l))}catch(e){}
  }
  function setMapInteraction(full){
    try{
      const methods=['dragging','touchZoom','doubleClickZoom','scrollWheelZoom','boxZoom','keyboard'];
      methods.forEach(k=>{const h=map?.[k];if(h&&typeof h[full?'enable':'disable']==='function')h[full?'enable':'disable']()});
      if(map?.tap&&typeof map.tap[full?'enable':'disable']==='function')map.tap[full?'enable':'disable']();
    }catch(e){}
  }
  function miniSummary(){
    const m=filteredMemories().length,ct=new Set(filteredMemories().map(x=>x.country)).size,done=$$('.trip-card .check:checked').length;
    const sub=$('.journey-mini-copy span');if(sub)sub.textContent=`${ct} ประเทศ • ${done} ทริปจบ • ${m} Locations`;
  }
  function refreshYears(){
    const bar=$('.journey-yearbar');if(!bar)return;const ys=safeYears();bar.innerHTML=`<button class="journey-year ${year==='all'?'on':''}" data-year="all">All</button>${ys.map(y=>`<button class="journey-year ${year===y?'on':''}" data-year="${y}">${y}</button>`).join('')}`;
    $$('.journey-year',bar).forEach(b=>b.onclick=()=>{year=b.dataset.year;refreshYears();if(mode==='history')showHistoryWorld(true)});
  }
  function setToolbar(){
    $$('.journey-mode').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));
    $('.journey-trip-picks')?.classList.toggle('show',mode==='trip');
    $('.journey-yearbar')?.classList.toggle('show',mode==='history');
    $$('.journey-trip-pick').forEach(b=>b.classList.toggle('on',b.dataset.trip===tripPick));
  }
  function openJourney(){
    const sec=$('#map');if(!sec)return;sec.classList.remove('journey-mini');sec.classList.add('journey-open');document.body.classList.add('journey-lock');setMapInteraction(true);setToolbar();refreshYears();setTimeout(()=>{try{map.invalidateSize();if(mode==='history')showHistoryWorld(false);else if(mode==='trip')showTrip(tripPick,false);else renderWorld(false)}catch(e){}},120);
  }
  function closeJourney(){
    const sec=$('#map');if(!sec)return;sec.classList.remove('journey-open');sec.classList.add('journey-mini');document.body.classList.remove('journey-lock');clearRouteVisual();try{renderWorld(false)}catch(e){}setMapInteraction(false);setTimeout(()=>{try{map.invalidateSize()}catch(e){}},80);miniSummary();
  }
  function showTrip(id,animate=true){
    tripPick=id;setToolbar();clearRouteVisual();const key=id==='tokyo'?'japan':'hongkong';const run=()=>{try{showCountry(key);note(id==='tokyo'?'Tokyo Winter Trip • เลือก Day ด้านขวา':'Hong Kong 6D5N • เลือก Day ด้านขวา')}catch(e){}};animate?transition(run):run();
  }
  function historyCountryHas(key){
    return filteredMemories().some(m=>m.country===key)||completedTrips().some(t=>t.country===key);
  }
  function historyRegionHas(key,name){
    const low=String(name).toLowerCase();return filteredMemories().some(m=>m.country===key&&String(m.region||'').toLowerCase()===low);
  }
  function renderHistoryDetailWorld(){
    const detail=$('#countryDetail');if(!detail)return;const fm=filteredMemories(),tr=completedTrips();
    detail.innerHTML=`<div class="ey">TRAVEL HISTORY</div><h2 style="margin:5px 0">ประวัติการเดินทาง ${year==='all'?'ทั้งหมด':year}</h2><p class="small muted">แตะประเทศเพื่อซูมเข้า ดูเมืองและ Location ที่เคยบันทึกไว้</p><div class="journey-history-summary"><b>${new Set([...fm.map(x=>x.country),...tr.map(x=>x.country)]).size} ประเทศ • ${fm.length} Locations</b><div>${tr.length} ทริปที่ทำเครื่องหมายว่า “ไปแล้ว”</div></div><div class="zone-list">${Object.entries(countryData).map(([k,c])=>`<button class="zone-item journey-history-country" data-country="${k}"><span style="font-size:25px">${c.flag}</span><div><b>${c.name}</b><div class="tiny muted">${historyCountryHas(k)?'มีประวัติในช่วงที่เลือก':'ยังไม่มีประวัติ'}</div></div><span class="zone-state ${historyCountryHas(k)?'':'hold'}">${historyCountryHas(k)?'ดูประวัติ':'—'}</span></button>`).join('')}</div>`;
    $$('.journey-history-country',detail).forEach(b=>b.onclick=()=>showHistoryCountry(b.dataset.country,true));
  }
  function showHistoryWorld(animate=true){
    mode='history';setToolbar();refreshYears();const run=()=>{
      clearRouteVisual();clearLayers();currentCountry=null;currentRegion=null;
      try{map.flyTo([23,25],2,{duration:animate?.75:0.01})}catch(e){}
      Object.entries(countryData).forEach(([key,c])=>{L.marker(c.center,{icon:pinIcon(c.flag,historyCountryHas(key))}).addTo(countryLayer).bindTooltip(c.name,{direction:'top',offset:[0,-30]}).on('click',()=>showHistoryCountry(key,true))});
      try{setCrumb()}catch(e){}renderHistoryDetailWorld();note(year==='all'?'History • ทุกปี':`History • ${year}`);
    };animate?transition(run):run();
  }
  function showHistoryCountry(key,animate=true){
    const run=()=>{
      clearRouteVisual();clearLayers();currentCountry=key;currentRegion=null;const c=countryData[key];
      map.flyTo(c.center,c.zoom,{duration:.75});
      allRegions(key).forEach(r=>L.marker(r.center,{icon:regionIcon(r.name,historyRegionHas(key,r.name))}).addTo(regionLayer).on('click',()=>showHistoryRegion(key,r.name,true)));
      filteredMemories().filter(m=>m.country===key).forEach(addMemoryMarker);
      try{setCrumb()}catch(e){}
      const ms=filteredMemories().filter(m=>m.country===key),detail=$('#countryDetail');if(detail){detail.innerHTML=`<div class="country-hero"><div class="flagbox">${c.flag}</div><div><div class="tiny muted">TRAVEL HISTORY</div><h2>${c.name}</h2></div></div><div class="journey-history-summary"><b>${ms.length} Locations</b><div>${year==='all'?'ทุกปี':year} • แตะเขตบนแผนที่เพื่อซูมเข้า</div></div><div class="journey-history-list">${ms.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,8).map(m=>`<div class="journey-history-item"><div class="dot">✓</div><div><b>${esc(m.name)}</b><small>${esc(m.region||'')} ${m.date?'• '+esc(m.date):''}</small></div></div>`).join('')||'<div class="small muted" style="padding:10px 2px">ยังไม่มี Location ที่บันทึกไว้ในช่วงนี้</div>'}</div>`}
      note(`${c.flag} ${c.name} • ${ms.length} Locations`);
    };animate?transition(run):run();
  }
  function showHistoryRegion(key,name,animate=true){
    const run=()=>{
      clearRouteVisual();clearLayers();currentCountry=key;currentRegion=name;const regs=allRegions(key),r=regs.find(x=>x.name.toLowerCase()===name.toLowerCase()),ms=filteredMemories().filter(m=>m.country===key&&String(m.region||'').toLowerCase()===name.toLowerCase());
      const center=r?.center||[ms[0]?.lat||countryData[key].center[0],ms[0]?.lng||countryData[key].center[1]];map.flyTo(center,r?.zoom||12,{duration:.72});ms.forEach(addMemoryMarker);try{setCrumb()}catch(e){}
      const d=$('#countryDetail');if(d)d.innerHTML=`<div class="ey">HISTORY • ${countryData[key].name}</div><h2 style="margin:5px 0">${esc(name)}</h2><div class="journey-history-summary"><b>${ms.length} Locations</b><div>${year==='all'?'ทุกปี':year}</div></div><div class="journey-history-list">${ms.map(m=>`<div class="journey-history-item"><div class="dot">📍</div><div><b>${esc(m.name)}</b><small>${m.date?esc(m.date):'ไม่ระบุวันที่'}${m.note?' • '+esc(m.note):''}</small></div></div>`).join('')||'<div class="small muted" style="padding:10px 2px">ยังไม่มี Location ในเขตนี้</div>'}</div>`;
      note(`${name} • ${ms.length} Locations`);
    };animate?transition(run):run();
  }
  function setMode(next){
    mode=next;setToolbar();
    if(next==='all')transition(()=>{clearRouteVisual();renderWorld();note('🌎 ทั้งหมด • World → Country → Region')});
    else if(next==='trip')showTrip(tripPick,true);
    else showHistoryWorld(true);
  }
  function patchMapTransitions(){
    if(patched)return;if(typeof showCountry!=='function'||typeof showRegion!=='function'||typeof renderWorld!=='function')return;patched=true;
    const bc=showCountry,br=showRegion,bw=renderWorld;
    showCountry=function(){if(mode==='history')return showHistoryCountry(arguments[0],true);return bc.apply(this,arguments)};
    showRegion=function(){if(mode==='history')return showHistoryRegion(arguments[0],arguments[1],true);return br.apply(this,arguments)};
    renderWorld=function(){if(mode==='history')return showHistoryWorld(true);return bw.apply(this,arguments)};
  }
  function installUI(){
    const sec=$('#map'),card=$('.world-card',sec),stage=$('#mapStage',sec),actions=$('.map-actions',sec);if(!sec||!card||!stage||!actions)return false;
    if($('.journey-open-btn'))return true;
    sec.classList.add('journey-mini');
    const open=document.createElement('button');open.className='btn soft journey-open-btn';open.type='button';open.innerHTML='🧭 เปิด Journey Map';open.onclick=openJourney;actions.appendChild(open);
    const top=document.createElement('div');top.className='journey-top';top.innerHTML=`<div class="journey-title"><div class="orb">🌎</div><div><b>Journey Map</b><small>ทริปนี้ • ประวัติ • ทั้งหมด</small></div></div><button class="journey-close" type="button" aria-label="ปิด">×</button>`;card.insertBefore(top,card.firstChild);$('.journey-close',top).onclick=closeJourney;
    const toolbar=document.createElement('div');toolbar.className='journey-toolbar';toolbar.innerHTML=`<button class="journey-mode on" data-mode="all">🌎 ทั้งหมด</button><button class="journey-mode" data-mode="trip">🧭 ทริปนี้</button><button class="journey-mode" data-mode="history">✓ เคยไป</button><div class="journey-trip-picks"><button class="journey-trip-pick on" data-trip="tokyo">🇯🇵 Tokyo</button><button class="journey-trip-pick" data-trip="hongkong">🇭🇰 Hong Kong</button></div><div class="journey-yearbar"></div>`;card.insertBefore(toolbar,$('.crumb',card));
    $$('.journey-mode',toolbar).forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$$('.journey-trip-pick',toolbar).forEach(b=>b.onclick=()=>showTrip(b.dataset.trip,true));
    const hud=document.createElement('div');hud.className='journey-mini-hud';hud.innerHTML=`<div class="journey-mini-copy"><b>Journey Map</b><span>กำลังสรุปประวัติ…</span></div><button class="journey-mini-go" type="button" aria-label="เปิด Journey Map">↗</button>`;stage.appendChild(hud);$('.journey-mini-go',hud).onclick=openJourney;stage.addEventListener('click',e=>{if(sec.classList.contains('journey-mini')&&!e.target.closest('button'))openJourney});
    const mn=document.createElement('div');mn.className='journey-map-note';stage.appendChild(mn);
    setMapInteraction(false);miniSummary();refreshYears();
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&sec.classList.contains('journey-open'))closeJourney()});
    $$('.trip-card .check,.trip-card .start,.trip-card .end').forEach(el=>el.addEventListener('change',()=>{miniSummary();refreshYears()}));
    return true;
  }
  let tries=0;const wait=setInterval(()=>{tries++;if(typeof L!=='undefined'&&typeof map!=='undefined'&&map&&typeof renderWorld==='function'&&installUI()){clearInterval(wait);setTimeout(patchMapTransitions,250);setTimeout(()=>{try{map.invalidateSize();renderWorld(false)}catch(e){}},320)}else if(tries>160)clearInterval(wait)},80);
})();
