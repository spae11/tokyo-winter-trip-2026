(()=>{
  if(window.__memoryPlanInboxLoaded)return;
  window.__memoryPlanInboxLoaded=true;
  let payload=null;
  try{payload=JSON.parse(sessionStorage.getItem('hubAddMemoryFromPlan')||'null')}catch(e){}
  if(!payload)return;
  sessionStorage.removeItem('hubAddMemoryFromPlan');
  const open=()=>{
    const country=document.getElementById('memCountry'),region=document.getElementById('memRegion'),name=document.getElementById('memName');
    if(!country||!region||!name||typeof openNewMemory!=='function')return;
    openNewMemory(payload.country||'thailand',payload.region||'');
    country.value=payload.country||country.value;
    region.value=payload.region||'';
    name.value=payload.name||'';
    country.dispatchEvent(new Event('change',{bubbles:true}));
    region.value=payload.region||'';
    const regionSelect=document.getElementById('memRegionPlan');
    if(regionSelect&&payload.region){regionSelect.value=payload.region;regionSelect.dispatchEvent(new Event('change',{bubbles:true}))}
    name.value=payload.name||'';
    const planSelect=document.getElementById('memPlanPlace');
    if(planSelect&&payload.name){
      const opt=[...planSelect.options].find(o=>o.textContent.startsWith(payload.name+' ·')||o.textContent===payload.name);
      if(opt)planSelect.value=opt.value;
    }
    const hint=document.getElementById('memPlanHint');
    if(hint)hint.textContent=`✓ มาจากแพลน ${payload.trip==='tokyo'?'Tokyo':'Hong Kong'} — เลือกรูป แล้วเลือกตำแหน่งบนแผนที่เพื่อบันทึก`;
    setTimeout(()=>document.getElementById('mlGallery')?.focus(),80);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(open,0),{once:true});else setTimeout(open,0);
})();
