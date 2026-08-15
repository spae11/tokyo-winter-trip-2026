(()=>{
'use strict';
if(window.__tripCloudSyncV2)return;window.__tripCloudSyncV2=true;

const STATE_KEY='travelToolsV1';
const CFG_KEY='travelToolsCloudV2';
const API='https://travel-hub-api.mlrkdee44.workers.dev';
const $=(s,r=document)=>r.querySelector(s);
let busy=false,reloadTimer=null,pollTimer=null;

function defaults(){return{roomId:'',token:'',auto:true,version:0,lastHash:'',lastSync:0,lastError:'',pairCode:'',pairUntil:0}}
function loadCfg(){try{return Object.assign(defaults(),JSON.parse(localStorage.getItem(CFG_KEY)||'{}'))}catch{return defaults()}}
let cfg=loadCfg();
function saveCfg(){try{localStorage.setItem(CFG_KEY,JSON.stringify(cfg))}catch{}}
function readLocal(){try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch{return{}}}
function clone(v){return JSON.parse(JSON.stringify(v||{}))}
function cleanState(input){
  const s=clone(input);
  delete s.api;delete s.selected;delete s.lastTab;
  s.wallet=(s.wallet||[]).map(x=>{const y={...x};delete y.image;return y});
  s.notes=(s.notes||[]).map(x=>{const y={...x};delete y.image;return y});
  return s;
}
function textHash(value){const s=JSON.stringify(value);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function localHash(){return textHash(cleanState(readLocal()))}
function authHeaders(){return cfg.token?{'Authorization':'Bearer '+cfg.token}: {}}
async function request(path,{method='GET',body,auth=true}={}){
  const headers={'Content-Type':'application/json',...(auth?authHeaders():{})};
  const r=await fetch(API+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
  let data={};try{data=await r.json()}catch{}
  if(!r.ok){const e=new Error(data.error||`HTTP ${r.status}`);e.status=r.status;e.data=data;throw e}
  return data;
}
async function createPair(){return request('/api/pair/create',{method:'POST',body:{},auth:false})}
async function joinPair(code){return request('/api/pair/join',{method:'POST',body:{code},auth:false})}
async function newPairCode(){return request('/api/pair/code',{method:'POST',body:{}})}
async function getRemote(){return request('/api/state')}
async function putRemote(state,baseVersion){return request('/api/state',{method:'PUT',body:{payload:{state:cleanState(state)},baseVersion}})}

function preserveImages(remoteItems,localItems){const map=new Map((localItems||[]).map(x=>[x.id,x]));return(remoteItems||[]).map(x=>{const l=map.get(x.id);return l?.image?{...x,image:l.image}:x})}
function mergeById(remote,local){const m=new Map();(remote||[]).forEach(x=>m.set(x.id,x));(local||[]).forEach(x=>m.set(x.id,{...(m.get(x.id)||{}),...x}));return[...m.values()]}
function deepMerge(a,b){if(!a||typeof a!=='object'||Array.isArray(a))return clone(b);const out=clone(a);Object.entries(b||{}).forEach(([k,v])=>{out[k]=(v&&typeof v==='object'&&!Array.isArray(v))?deepMerge(out[k]||{},v):v});return out}
function applyRemoteState(remoteState,{merge=false}={}){
  const local=readLocal(),remote=clone(remoteState||{});let next;
  if(merge){
    next={...remote,...local};
    next.dates={...(remote.dates||{}),...(local.dates||{})};
    next.budgets={...(remote.budgets||{}),...(local.budgets||{})};
    next.done=deepMerge(remote.done||{},local.done||{});
    next.expenses=mergeById(remote.expenses,local.expenses);
    next.wallet=mergeById(remote.wallet,local.wallet);
    next.notes=mergeById(remote.notes,local.notes);
  }else{
    next={...remote};
    next.wallet=preserveImages(remote.wallet,local.wallet);
    next.notes=preserveImages(remote.notes,local.notes);
  }
  next.selected=local.selected||next.selected||'tokyo';
  next.lastTab=local.lastTab||next.lastTab||'today';
  next.api=local.api||{};
  localStorage.setItem(STATE_KEY,JSON.stringify(next));
  return next;
}

function notify(msg){
  let t=$('#tcs2-toast');
  if(!t){t=document.createElement('div');t.id='tcs2-toast';t.style.cssText='position:fixed;left:50%;bottom:160px;z-index:10020;transform:translate(-50%,15px);background:#1E2428;color:#fff;padding:9px 13px;border-radius:999px;font:800 12px system-ui,sans-serif;opacity:0;transition:.2s;pointer-events:none;box-shadow:0 10px 30px #0003';document.body.appendChild(t)}
  t.textContent=msg;t.style.opacity='1';t.style.transform='translate(-50%,0)';clearTimeout(t._x);t._x=setTimeout(()=>{t.style.opacity='0';t.style.transform='translate(-50%,15px)'},2300)
}
function reloadSoon(){if(reloadTimer)return;reloadTimer=setTimeout(()=>location.reload(),550)}
function fmtTime(t){if(!t)return'ยังไม่เคย Sync';try{return new Intl.DateTimeFormat('th-TH',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}).format(new Date(t))}catch{return''}}
function maskedRoom(){return cfg.roomId?cfg.roomId.slice(0,5)+'…'+cfg.roomId.slice(-4):''}
function pairValid(){return cfg.pairCode&&cfg.pairUntil>Date.now()}

async function uploadCurrent({notice=true}={}){
  if(!cfg.token||busy||!navigator.onLine)return;
  busy=true;
  try{
    let remote=await getRemote();
    let local=readLocal();
    let base=Number(remote.version)||0;
    let out;
    try{out=await putRemote(local,base)}catch(e){
      if(e.status===409){remote=await getRemote();const merged=applyRemoteState(remote.payload?.state||{},{merge:true});out=await putRemote(merged,Number(remote.version)||0);local=merged}else throw e;
    }
    cfg.version=Number(out.version)||base+1;cfg.lastHash=textHash(cleanState(local));cfg.lastSync=Date.now();cfg.lastError='';cfg.auto=true;saveCfg();if(notice)notify('☁️ Sync ขึ้น Cloud แล้ว');renderCard();
  }catch(e){handleError(e,'อัปโหลดไม่สำเร็จ')}finally{busy=false}
}

async function pullMerge({notice=true}={}){
  if(!cfg.token||busy||!navigator.onLine)return;
  busy=true;
  try{
    const remote=await getRemote();
    const rstate=remote.payload?.state||{};
    if(!Object.keys(rstate).length){cfg.version=Number(remote.version)||0;cfg.lastSync=Date.now();saveCfg();if(notice)notify('Cloud ยังไม่มีข้อมูล');return}
    const merged=applyRemoteState(rstate,{merge:true});
    let out;
    try{out=await putRemote(merged,Number(remote.version)||0)}catch(e){
      if(e.status===409){const latest=await getRemote();const merged2=applyRemoteState(latest.payload?.state||{},{merge:true});out=await putRemote(merged2,Number(latest.version)||0)}else throw e;
    }
    cfg.version=Number(out.version)||Number(remote.version)+1;cfg.lastHash=localHash();cfg.lastSync=Date.now();cfg.lastError='';cfg.auto=true;saveCfg();if(notice)notify('รวมข้อมูล 2 เครื่องแล้ว');reloadSoon();
  }catch(e){handleError(e,'ดึงข้อมูลไม่สำเร็จ')}finally{busy=false}
}

function handleError(e,fallback){
  cfg.lastError=e?.message||'sync_error';
  if(e?.status===401){cfg.auto=false;notify('อุปกรณ์นี้ไม่ได้รับอนุญาต • จับคู่ใหม่อีกครั้ง')}else notify(fallback);
  saveCfg();renderCard();
}

async function syncCycle(){
  if(busy||!cfg.token||!cfg.auto||!navigator.onLine||document.hidden)return;
  busy=true;
  try{
    const local=readLocal(),lh=textHash(cleanState(local)),remote=await getRemote(),rv=Number(remote.version)||0;
    if(!cfg.lastHash){cfg.lastHash=lh;cfg.version=rv;cfg.lastSync=Date.now();saveCfg();return}
    const localChanged=lh!==cfg.lastHash,remoteChanged=rv>Number(cfg.version||0);
    if(localChanged&&!remoteChanged){
      const out=await putRemote(local,rv);cfg.version=Number(out.version)||rv+1;cfg.lastHash=lh;cfg.lastSync=Date.now();cfg.lastError='';saveCfg();return;
    }
    if(remoteChanged&&!localChanged&&remote.payload?.state){
      const next=applyRemoteState(remote.payload.state);cfg.version=rv;cfg.lastHash=textHash(cleanState(next));cfg.lastSync=Date.now();cfg.lastError='';saveCfg();notify('มีข้อมูลใหม่จากอีกเครื่อง');reloadSoon();return;
    }
    if(remoteChanged&&localChanged&&remote.payload?.state){
      const merged=applyRemoteState(remote.payload.state,{merge:true});const out=await putRemote(merged,rv);cfg.version=Number(out.version)||rv+1;cfg.lastHash=textHash(cleanState(merged));cfg.lastSync=Date.now();cfg.lastError='';saveCfg();notify('รวมการแก้ไขจาก 2 เครื่องแล้ว');reloadSoon();return;
    }
    cfg.version=rv;cfg.lastSync=Date.now();cfg.lastError='';saveCfg();
  }catch(e){cfg.lastError=e?.message||'sync_error';if(e?.status===401)cfg.auto=false;saveCfg();}finally{busy=false}
}

async function setupFirstDevice(){
  if(busy)return;busy=true;
  try{
    const r=await createPair();
    cfg=Object.assign(defaults(),{roomId:r.roomId,token:r.token,auto:true,version:0,lastHash:'',lastSync:Date.now(),pairCode:r.pairCode||'',pairUntil:Date.now()+Number(r.expiresMinutes||15)*60000});saveCfg();
    notify('สร้าง Cloud Sync แล้ว');
  }catch(e){notify('สร้าง Sync ไม่สำเร็จ');cfg.lastError=e.message||'create_failed';saveCfg();busy=false;renderCard();return}
  busy=false;await uploadCurrent({notice:false});renderCard();
}

async function setupJoinedDevice(code){
  code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(code.length!==6){notify('รหัสจับคู่ต้องมี 6 ตัว');return}
  if(busy)return;busy=true;
  try{
    const r=await joinPair(code);
    cfg=Object.assign(defaults(),{roomId:r.roomId,token:r.token,auto:true,version:0,lastHash:'',lastSync:Date.now()});saveCfg();notify('จับคู่สำเร็จ');
  }catch(e){notify(e.status===404?'รหัสหมดอายุหรือไม่ถูกต้อง':'จับคู่ไม่สำเร็จ');busy=false;renderCard();return}
  busy=false;await pullMerge({notice:false});renderCard();
}

async function generatePairCode(){
  if(!cfg.token||busy)return;busy=true;
  try{const r=await newPairCode();cfg.pairCode=r.pairCode||'';cfg.pairUntil=Date.now()+Number(r.expiresMinutes||15)*60000;cfg.lastError='';saveCfg();notify('สร้างรหัสจับคู่แล้ว')}catch(e){handleError(e,'สร้างรหัสไม่ได้')}finally{busy=false;renderCard()}
}

async function copyCode(){if(!cfg.pairCode)return;try{await navigator.clipboard.writeText(cfg.pairCode);notify('คัดลอกรหัสแล้ว')}catch{notify('กดค้างที่รหัสเพื่อคัดลอก')}}
async function shareCode(){if(!cfg.pairCode)return;const text=`Our Travel Hub • รหัสจับคู่ ${cfg.pairCode} (ใช้ได้ 15 นาที)`;if(navigator.share){try{await navigator.share({title:'Travel Hub Sync',text});return}catch(e){if(e.name==='AbortError')return}}copyCode()}

function renderCard(){
  const p=$('[data-panel="sync"]');if(!p)return;
  let card=$('#tcs2-cloud-card',p);
  if(!card){card=document.createElement('div');card.id='tcs2-cloud-card';card.className='tt-card';card.style.marginBottom='10px';p.prepend(card)}
  const paired=!!cfg.token;
  if(!paired){
    card.innerHTML=`<div class="tt-row"><div><div class="tt-ey">CLOUDFLARE SYNC</div><h3 style="margin:2px 0 4px">☁️ Sync 2 เครื่อง</h3></div><span class="tt-chip gold">ยังไม่จับคู่</span></div><p class="tt-muted">ไม่ต้องใช้ TRAVEL_SYNC_KEY บนมือถือ • เครื่องแรกสร้าง Sync แล้วส่งรหัส 6 ตัวให้อีกเครื่องครั้งเดียว</p><button id="tcs2-create" class="tt-btn full">✨ สร้าง Sync จากเครื่องนี้</button><div class="tt-divider"></div><div class="tt-ey">มีรหัสจากอีกเครื่อง</div><div class="tt-wrap" style="margin-top:7px"><input id="tcs2-code-input" class="tt-input" maxlength="6" autocomplete="one-time-code" autocapitalize="characters" placeholder="ABC234" style="flex:1;min-width:140px;text-transform:uppercase;letter-spacing:.18em;font-weight:900"><button id="tcs2-join" class="tt-btn">🔗 จับคู่</button></div><div class="tt-photo-note">Login หน้า Travel Hub ยังเป็นระบบเดิมและแยกจาก Cloud Sync โดยสิ้นเชิง</div>`;
    $('#tcs2-create',card).onclick=setupFirstDevice;
    $('#tcs2-join',card).onclick=()=>setupJoinedDevice($('#tcs2-code-input',card).value);
    $('#tcs2-code-input',card).addEventListener('input',e=>e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6));
    return;
  }
  const status=cfg.lastError?'มีปัญหา':cfg.auto?'Auto Sync เปิด':'หยุด Sync';
  const codeBlock=pairValid()?`<div style="margin-top:10px;padding:12px;border-radius:16px;background:#f5efe4;text-align:center"><div class="tt-muted">รหัสจับคู่เครื่องเพิ่ม • หมดอายุใน 15 นาที</div><div style="font-size:1.8rem;letter-spacing:.2em;font-weight:900;margin:4px 0">${cfg.pairCode}</div><div class="tt-wrap" style="justify-content:center"><button id="tcs2-copy" class="tt-btn soft">📋 Copy</button><button id="tcs2-share" class="tt-btn soft">📤 ส่งให้แฟน</button></div></div>`:'';
  card.innerHTML=`<div class="tt-row"><div><div class="tt-ey">CLOUDFLARE SYNC</div><h3 style="margin:2px 0 4px">☁️ เชื่อมแล้ว</h3></div><span class="tt-chip ${cfg.lastError?'gold':'green'}">${status}</span></div><div class="tt-status ${cfg.lastError?'warn':''}">Room ${maskedRoom()} • Cloud v${Number(cfg.version)||0}<br><span style="font-weight:700">ล่าสุด ${fmtTime(cfg.lastSync)}</span></div><label class="tt-item" style="margin-top:9px;cursor:pointer"><div><b>Auto Sync</b><div class="tt-muted">ตรวจข้อมูลทุก ~15 วินาทีเมื่อออนไลน์</div></div><input id="tcs2-auto" type="checkbox" ${cfg.auto?'checked':''} style="width:22px;height:22px"></label><div class="tt-wrap" style="margin-top:9px"><button id="tcs2-upload" class="tt-btn">☁️ ส่งข้อมูลขึ้น Cloud</button><button id="tcs2-pull" class="tt-btn soft">⬇️ รวมข้อมูลจาก Cloud</button><button id="tcs2-new-code" class="tt-btn soft">📱 จับคู่เครื่องเพิ่ม</button></div>${codeBlock}<div class="tt-divider"></div><button id="tcs2-forget" class="tt-del">ยกเลิกการจับคู่เครื่องนี้</button><div class="tt-photo-note">Sync: ค่าใช้จ่าย • Checklist • Booking metadata • Notes • วันที่/งบ • ไม่ส่งรูปเข้า D1</div>`;
  $('#tcs2-auto',card).onchange=e=>{cfg.auto=e.target.checked;cfg.lastHash=localHash();saveCfg();notify(cfg.auto?'เปิด Auto Sync แล้ว':'หยุด Auto Sync แล้ว');if(cfg.auto)syncCycle()};
  $('#tcs2-upload',card).onclick=()=>uploadCurrent();
  $('#tcs2-pull',card).onclick=()=>pullMerge();
  $('#tcs2-new-code',card).onclick=generatePairCode;
  $('#tcs2-copy',card)?.addEventListener('click',copyCode);
  $('#tcs2-share',card)?.addEventListener('click',shareCode);
  $('#tcs2-forget',card).onclick=()=>{if(confirm('ยกเลิกการจับคู่เฉพาะมือถือเครื่องนี้? ข้อมูลบน Cloud และอีกเครื่องจะไม่ถูกลบ')){cfg=defaults();saveCfg();renderCard();notify('ยกเลิกการจับคู่แล้ว')}};
}

function boot(){
  renderCard();
  document.addEventListener('click',e=>{if(e.target.closest('[data-tab="sync"]'))setTimeout(renderCard,80)});
  clearInterval(pollTimer);pollTimer=setInterval(syncCycle,15000);
  window.addEventListener('online',()=>setTimeout(syncCycle,700));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(syncCycle,500)});
  if(cfg.token&&cfg.auto)setTimeout(syncCycle,1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
