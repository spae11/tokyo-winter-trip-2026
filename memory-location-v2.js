(()=>{
  if(window.__memoryLocationV2Loaded)return;
  window.__memoryLocationV2Loaded=true;

  const PLAN={
    japan:{trip:'Tokyo Winter Trip 2026',regions:{
      Tokyo:[
        'APA Hotel Asakusa Tawaramachi-Ekimae','Asakusa Station','Senso-ji • Nakamise','Shinjuku Expressway Bus Terminal','Tokyo Camii','Harajuku / Meiji Jingu','Shibuya Scramble Crossing','Shinjuku Station','Ueno Station','Ameyoko Shopping District','Akihabara Station','Tokyo Station / Ginza'
      ],
      Chiba:['Maihama Station','Tokyo Disneyland','Cinderella Castle Tokyo Disneyland'],
      Yamanashi:['Kawaguchiko Station','Mt. Fuji Panoramic Ropeway','Oishi Park']
    }},
    hongkong:{trip:'Hong Kong 6D5N',regions:{
      Kowloon:['Holiday Inn Golden Mile Hong Kong','Tsim Sha Tsui','Kowloon Mosque','Avenue of Stars','Star Ferry Pier Tsim Sha Tsui','Mong Kok • Ladies Market'],
      'Hong Kong Island':['Central Market','PMQ + Mid-Levels','Wan Chai','Islamic Centre Canteen / Masjid Ammar','Causeway Bay','Peak Tram Lower Terminus','Victoria Peak'],
      Lantau:['Hong Kong Disneyland','Disneyland Resort Station','Ngong Ping 360','Tian Tan Buddha','Citygate Outlets','Tung Chung Station','Hong Kong International Airport']
    }}
  };

  const sheet=document.getElementById('memorySheet');
  const country=document.getElementById('memCountry');
  const region=document.getElementById('memRegion');
  const name=document.getElementById('memName');
  const photos=document.getElementById('memPhotos');
  const pickBtn=document.getElementById('pickLocationBtn');
  if(!sheet||!country||!region||!name||!photos)return;

  const regionField=region.closest('.field');
  const nameField=name.closest('.field');
  const photoField=photos.closest('.field');
  if(!regionField||!nameField||!photoField)return;

  const regionSelect=document.createElement('select');
  regionSelect.id='memRegionPlan';
  regionSelect.className='ml-select';
  regionSelect.hidden=true;
  regionField.insertBefore(regionSelect,region);

  const planField=document.createElement('div');
  planField.className='field full ml-plan-field';
  planField.hidden=true;
  planField.innerHTML='<label>สถานที่จากแพลน</label><select id="memPlanPlace" class="ml-select"></select><div class="ml-helper" id="memPlanHint"></div>';
  nameField.parentNode.insertBefore(planField,nameField);
  const planPlace=planField.querySelector('#memPlanPlace');
  const planHint=planField.querySelector('#memPlanHint');

  let currentRegion='';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function regionsFor(key){return PLAN[key]?Object.keys(PLAN[key].regions):[]}
  function placesFor(key,reg=''){
    const p=PLAN[key];if(!p)return[];
    const regs=reg&&p.regions[reg]?[reg]:Object.keys(p.regions);
    return regs.flatMap(r=>p.regions[r].map(place=>({region:r,name:place})));
  }
  function setManualRegion(on){
    region.style.display=on?'':'none';
    regionSelect.hidden=on;
    if(on)region.placeholder='พิมพ์จังหวัด / เขต';
  }
  function fillPlanPlaces(reg=''){
    const data=placesFor(country.value,reg);
    planPlace.innerHTML='<option value="">เลือกสถานที่จากแพลน…</option>'+data.map((p,i)=>`<option value="${i}" data-region="${esc(p.region)}">${esc(p.name)} · ${esc(p.region)}</option>`).join('')+'<option value="__custom__">＋ สถานที่อื่น (พิมพ์เอง)</option>';
    planPlace._items=data;
  }
  function syncCountryUI(){
    const key=country.value,regs=regionsFor(key),hasPlan=!!PLAN[key];
    planField.hidden=!hasPlan;
    if(!hasPlan){
      setManualRegion(true);currentRegion='';
      planHint.textContent='';
      return;
    }
    const saved=region.value.trim();
    regionSelect.innerHTML='<option value="">เลือกจังหวัด / เขตจากแพลน…</option>'+regs.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('')+'<option value="__custom__">＋ จังหวัด / เขตอื่น</option>';
    if(saved&&regs.includes(saved)){regionSelect.value=saved;currentRegion=saved;setManualRegion(false)}
    else if(saved){regionSelect.value='__custom__';currentRegion='';setManualRegion(true)}
    else{regionSelect.value='';currentRegion='';setManualRegion(false);region.value=''}
    fillPlanPlaces(currentRegion);
    planHint.textContent=`ดึงรายการจาก ${PLAN[key].trip} • เลือกแล้วชื่อ Location และโซนจะเติมให้อัตโนมัติ`;
  }

  country.addEventListener('change',()=>{region.value='';name.value='';syncCountryUI()});
  regionSelect.addEventListener('change',()=>{
    if(regionSelect.value==='__custom__'){
      currentRegion='';region.value='';setManualRegion(true);fillPlanPlaces('');region.focus();return;
    }
    currentRegion=regionSelect.value;region.value=currentRegion;setManualRegion(false);fillPlanPlaces(currentRegion);
  });
  planPlace.addEventListener('change',()=>{
    if(planPlace.value==='__custom__'){name.value='';name.focus();return}
    const item=planPlace._items?.[Number(planPlace.value)];if(!item)return;
    name.value=item.name;region.value=item.region;currentRegion=item.region;
    regionSelect.value=item.region;setManualRegion(false);
    planHint.textContent=`✓ เลือก ${item.name} • ${item.region} แล้ว — ขั้นต่อไปเลือกตำแหน่งบนแผนที่`;
  });

  photos.classList.add('ml-native-file');
  const photoUI=document.createElement('div');
  photoUI.className='ml-photo-ui';
  photoUI.innerHTML=`<div class="ml-photo-actions"><button type="button" class="ml-photo-btn" id="mlGallery">🖼️ เลือกรูป</button><button type="button" class="ml-photo-btn soft" id="mlCamera">📷 ถ่ายรูป</button><span class="ml-photo-count" id="mlPhotoCount">0 / 5</span></div><div class="ml-photo-preview" id="mlPhotoPreview"><div class="ml-photo-empty">เพิ่มรูปได้สูงสุด 5 รูป • รูปจะถูกย่อให้อัตโนมัติ</div></div>`;
  photoField.appendChild(photoUI);
  const galleryBtn=photoUI.querySelector('#mlGallery');
  const cameraBtn=photoUI.querySelector('#mlCamera');
  const count=photoUI.querySelector('#mlPhotoCount');
  const preview=photoUI.querySelector('#mlPhotoPreview');
  const camera=document.createElement('input');
  camera.type='file';camera.accept='image/*';camera.capture='environment';camera.hidden=true;
  photoField.appendChild(camera);

  let previewUrls=[];let normalizing=false;
  function revoke(){previewUrls.forEach(u=>URL.revokeObjectURL(u));previewUrls=[]}
  function writeFiles(files){
    if(typeof DataTransfer==='undefined')return false;
    const dt=new DataTransfer();files.slice(0,5).forEach(f=>dt.items.add(f));photos.files=dt.files;return true;
  }
  function renderPhotos(){
    revoke();const files=[...photos.files].slice(0,5);count.textContent=`${files.length} / 5`;
    if(!files.length){preview.innerHTML='<div class="ml-photo-empty">แตะ “เลือกรูป” หรือ “ถ่ายรูป” • สูงสุด 5 รูป</div>';return}
    preview.innerHTML=files.map((f,i)=>{const u=URL.createObjectURL(f);previewUrls.push(u);return `<div class="ml-thumb"><img src="${u}" alt="รูปที่ ${i+1}"><button type="button" data-remove="${i}" aria-label="ลบรูป">×</button><span>${i+1}</span></div>`}).join('');
    preview.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{
      const idx=Number(btn.dataset.remove),next=[...photos.files];next.splice(idx,1);if(writeFiles(next)){photos.dispatchEvent(new Event('change',{bubbles:true}))}
    }));
  }
  photos.addEventListener('change',()=>{
    if(normalizing)return;
    const files=[...photos.files];
    if(files.length>5&&writeFiles(files.slice(0,5))){normalizing=true;photos.dispatchEvent(new Event('change',{bubbles:true}));normalizing=false}
    renderPhotos();
  });
  galleryBtn.addEventListener('click',()=>photos.click());
  cameraBtn.addEventListener('click',()=>camera.click());
  camera.addEventListener('change',()=>{
    const merged=[...photos.files,...camera.files].slice(0,5);
    if(writeFiles(merged)){photos.dispatchEvent(new Event('change',{bubbles:true}))}
    camera.value='';
  });

  pickBtn?.addEventListener('click',()=>{planHint.dataset.manualMap='1'});

  const observer=new MutationObserver(()=>{
    if(!sheet.classList.contains('open'))return;
    syncCountryUI();renderPhotos();
  });
  observer.observe(sheet,{attributes:true,attributeFilter:['class']});
  syncCountryUI();renderPhotos();
})();
