(()=>{
  if(window.__planMemoryLinkLoaded)return;
  window.__planMemoryLinkLoaded=true;
  const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':null;
  if(!trip)return;
  const country=trip==='tokyo'?'japan':'hongkong';
  const regionFor=(text)=>{
    const s=String(text||'').toLowerCase();
    if(trip==='tokyo'){
      if(/disney|maihama|cinderella/.test(s))return'Chiba';
      if(/kawaguchiko|oishi|fuji|ropeway/.test(s))return'Yamanashi';
      return'Tokyo';
    }
    if(/disney|ngong|tung chung|tian tan|citygate|airport|hkia/.test(s))return'Lantau';
    if(/central|pmq|wan chai|causeway|peak|masjid ammar|islamic centre/.test(s))return'Hong Kong Island';
    return'Kowloon';
  };
  const style=document.createElement('style');
  style.textContent='.pmem-btn{margin:7px 0 0 6px;border:1px solid #0001;border-radius:11px;background:#fff1f2;color:#9a1826;padding:8px 10px;font:800 12px "Noto Sans Thai",system-ui,sans-serif;cursor:pointer}.pmem-btn:active{transform:scale(.97)}@media(max-width:520px){.pmem-btn{margin-left:4px;padding:8px 9px}}';
  document.head.appendChild(style);
  const addButtons=()=>{
    document.querySelectorAll('.step').forEach(step=>{
      if(step.querySelector('.pmem-btn'))return;
      const place=step.querySelector('.place')?.textContent?.trim();
      if(!place)return;
      const mapLink=step.querySelector('a.map');
      const btn=document.createElement('button');btn.type='button';btn.className='pmem-btn';btn.textContent='📸 เพิ่มรูป / Location';
      btn.addEventListener('click',()=>{
        const mapText=mapLink?.href||'';
        const payload={country,region:regionFor(place+' '+mapText),name:place,trip,fromPlan:true};
        sessionStorage.setItem('hubAddMemoryFromPlan',JSON.stringify(payload));
        document.documentElement.classList.add('hub-plan-leaving');
        setTimeout(()=>location.assign('/tokyo-winter-trip-2026/#add-memory'),180);
      });
      if(mapLink)mapLink.insertAdjacentElement('afterend',btn);else step.appendChild(btn);
    });
  };
  addButtons();
  new MutationObserver(addButtons).observe(document.body,{childList:true,subtree:true});
})();
