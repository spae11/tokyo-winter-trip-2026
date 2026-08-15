(()=>{
'use strict';
if(window.__tripCloudSyncV1)return;window.__tripCloudSyncV1=true;

const STATE_KEY='travelToolsV1';
const CFG_KEY='travelToolsCloudV1';
const API='https://travel-hub-api.mlrkdee44.workers.dev';
const CLOUD_ID='our-travel-hub';
let busy=false,pendingRemote=null,pollTimer=null;
const $=(s,r=document)=>r.querySelector(s);

function loadCfg(){try{return Object.assign({key:'',auto:false,version:0,lastHash:'',lastSync:0,lastError:''},JSON.parse(localStorage.getItem(CFG_KEY)||'{}'))}catch{return{key:'',auto:false,version:0,lastHash:'',lastSync:0,lastError:''}}}
let cfg=loadCfg();
function saveCfg(){localStorage.setItem(CFG_KEY,JSON.stringify(cfg))}
function readLocal(){try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch{return{}}}
function clone(v){return JSON.parse(JSON.stringify(v||{}))}
function cleanState(input){const s=clone(input);delete s.api;delete s.selected;delete s.lastTab;s.wallet=(s.wallet||[]).map(x=>{const y={...x};delete y.image;return y});s.notes=(s.notes||[]).map(x=>{const y={...x};delete y.image;return y});return s}
function textHash(value){const s=JSON.stringify(value);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)}
function localHash(){return textHash(cleanState(readLocal()))}
function headers(){return{'Content-Type':'application/json','X-Travel-Key':cfg.key}}
async function request(method='GET',body){const r=await fetch(`${API}/api/state/${CLOUD_ID}`,{method,headers:headers(),body:body?JSON.stringify(body):undefined,cache:'no-store'});let data={};try{data=await r.json()}catch{}if(!r.ok){const e=new Error(data.error||`HTTP ${r.status}`);e.status=r.status;e.data=data;throw e}return data}
async function getRemote(){return request('GET')}
async function putRemote(state,baseVersion){return request('PUT',{payload:{state:cleanState(state)},baseVersion})}
function preserveImages(remoteItems,localItems){const map=new Map((localItems||[]).map(x=>[x.id,x]));return(remoteItems||[]).map(x=>{const l=map.get(x.id);return l?.image?{...x,image:l.image}:x})}
function applyRemoteState(remoteState,{merge=false}={}){const local=readLocal(),remote=clone(remoteState||{});let next;
  if(merge){
    const byId=(a,b)=>{const m=new Map();(a||[]).forEach(x=>m.set(x.id,x));(b||[]).forEach(x=>m.set(x.id,{...(m.get(x.id)||{}),...x}));return[...m.values()]};
    const deep=(a,b)=>{if(!a||typeof a!=='object'||Array.isArray(a))return clone(b);const out=clone(a);Object.entries(b||{}).forEach(([k,v])=>{out[k]=(v&&typeof v==='object'&&!Array.isArray(v))?deep(out[k]||{},v):v});return out};
    next={...remote,...local};
    next.dates={...(remote.dates||{}),...(local.dates||{})};
    next.budgets={...(remote.budgets||{}),...(local.budgets||{})};
    next.done=deep(remote.done||{},local.done||{});
    next.expenses=byId(remote.expenses,local.expenses);
    next.wallet=byId(remote.wallet,local.wallet);
    next.notes=byId(remote.notes,local.notes);
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
function notify(msg){let t=$('#tcs-toast');if(!t){t=document.createElement('div');t.id='tcs-toast';t.style.cssText='position:fixed;left:50%;bottom:160px;z-index:10020;transform:translate(-50%,15px);background:#1E2428;color:#fff;padding:9px 13px;border-radius:999px;font:800 12px system-ui,sans-serif;opacity:0;transition:.2s;pointer-events:none;box-shadow:0 10px 30px #0003';document.body.appendChild(t)}t.textContent=msg;t.style.opacity='1';t.style.transform='translate(-50%,0)';clearTimeout(t._x);t._x=setTimeout(()=>{t.style.opacity='0';t.style.transform='translate(-50%,15px)'},2300)}
function safeReload(){const ov=$('#tt-overlay');if(ov?.classList.contains('open')){renderCard();notify('มีข้อมูลใหม่จากอีกเครื่อง • กดรับข้อมูลใน Sync');return false}location.reload();return true}
async function connectKey(key){cfg.key=key.trim();if(!cfg.key)throw new Error('empty_key');saveCfg();const r=await getRemote();cfg.version=Number(r.version)||0;cfg.lastError='';cfg.lastSync=Date.now();saveCfg();return r}
async function uploadCurrent({force=false}={}){if(!cfg.key||busy)return;busy=true;try{const remote=await getRemote();const local=readLocal();let base=Number(remote.version)||0;let result;try{result=await putRemote(local,base)}catch(e){if(e.status===409&&e.data){base=Number(e.data.version)||0;result=await putRemote(local,base)}else throw e}cfg.version=Number(result.version)||base+1;cfg.lastHash=localHash();cfg.lastSync=Date.now();cfg.lastError='';cfg.auto=true;saveCfg();notify(force?'อัปโหลดข้อมูลเครื่องนี้แล้ว':'Cloud Sync สำเร็จ');renderCard()}catch(e){cfg.lastError=e.message||'sync_error';saveCfg();notify(e.status===401?'Sync Key ไม่ถูกต้อง':'Cloud Sync ไม่สำเร็จ');renderCard()}finally{busy=false}}
async function pullCurrent({merge=false,reload=true}={}){if(!cfg.key||busy)return;busy=true;try{const r=await getRemote();if(!r.payload?.state){notify('Cloud ยังไม่มีข้อมูล');return}const next=applyRemoteState(r.payload.state,{merge});cfg.version=Number(r.version)||0;cfg.lastHash=textHash(cleanState(next));cfg.lastSync=Date.now();cfg.lastError='';cfg.auto=true;pendingRemote=null;saveCfg();notify(merge?'รวมข้อมูลจาก Cloud แล้ว':'รับข้อมูลจาก Cloud แล้ว');if(reload)setTimeout(safeReload,350);else renderCard()}catch(e){cfg.lastError=e.message||'sync_error';saveCfg();notify(e.status===401?'Sync Key ไม่ถูกต้อง':'ดึงข้อมูลไม่สำเร็จ');renderCard()}finally{busy=false}}
async function syncCycle(){if(busy||!cfg.auto||!cfg.key||!navigator.onLine)return;busy=true;try{const local=readLocal(),lh=textHash(cleanState(local)),remote=await getRemote(),rv=Number(remote.version)||0;
  if(rv===0){const out=await putRemote(local,0);cfg.version=Number(out.version)||1;cfg.lastHash=lh;cfg.lastSync=Date.now();cfg.lastError='';saveCfg();return}
  if(!cfg.lastHash){cfg.version=rv;cfg.lastHash=lh;cfg.lastSync=Date.now();saveCfg();return}
  const localChanged=lh!==cfg.lastHash,remoteChanged=rv>Number(cfg.version||0);
  if(localChanged&&!remoteChanged){const out=await putRemote(local,rv);cfg.version=Number(out.version)||rv+1;cfg.lastHash=lh;cfg.lastSync=Date.now();cfg.lastError='';saveCfg();return}
  if(remoteChanged&&!localChanged&&remote.payload?.state){pendingRemote=remote;cfg.version=rv;cfg.lastSync=Date.now();saveCfg();const next=applyRemoteState(remote.payload.state);cfg.lastHash=textHash(cleanState(next));saveCfg();setTimeout(safeReload,250);return}
  if(remoteChanged&&localChanged&&remote.payload?.state){const merged=applyRemoteState(remote.payload.state,{merge:true});const out=await putRemote(merged,rv);cfg.version=Number(out.version)||rv+1;cfg.lastHash=textHash(cleanState(merged));cfg.lastSync=Date.now();cfg.lastError='';saveCfg();notify('รวมการแก้ไขจาก 2 เครื่องแล้ว');setTimeout(safeReload,300);return}
  cfg.version=rv;cfg.lastSync=Date.now();cfg.lastError='';saveCfg();
 }catch(e){cfg.lastError=e.message||'sync_error';if(e.status===401)cfg.auto=false;saveCfg();renderCard()}finally{busy=false}}
function fmtTime(t){if(!t)return'ยังไม่เคย Sync';try{return new Intl.DateTimeFormat('th-TH',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'}).format(new Date(t))}catch{return''}}
function renderCard(){const p=$('[data-panel="sync"]');if(!p)return;let card=$('#tcs-cloud-card',p);if(!card){card=document.createElement('div');card.id='tcs-cloud-card';card.className='tt-card';card.style.marginBottom='10px';p.prepend(card)}
  const connected=!!cfg.key;const status=!connected?'ยังไม่เชื่อม':cfg.lastError?(cfg.lastError==='unauthorized'?'Key ไม่ถูกต้อง':'มีปัญหา Sync'):(cfg.auto?'Auto Sync เปิดอยู่':'เชื่อมแล้ว');
  card.innerHTML=`<div class="tt-row"><div><div class="tt-ey">CLOUDFLARE SYNC</div><h3 style="margin:2px 0 4px">☁️ Sync อัตโนมัติ 2 เครื่อง</h3></div><span class="tt-chip ${connected&&!cfg.lastError?'green':'gold'}">${status}</span></div>${!connected?`<p class="tt-muted">ใส่ TRAVEL_SYNC_KEY ที่คุณสร้างไว้ครั้งแรก รหัสจะเก็บเฉพาะในมือถือเครื่องนี้และไม่อยู่ใน GitHub Pages</p><div class="tt-field"><label>Sync Key</label><input id="tcs-key" type="password" class="tt-input" autocomplete="off" placeholder="วาง TRAVEL_SYNC_KEY"></div><button id="tcs-connect" class="tt-btn full" style="margin-top:8px">🔐 เชื่อม Cloudflare</button>`:`<div class="tt-status ${cfg.lastError?'warn':''}">Worker: travel-hub-api • Cloud v${Number(cfg.version)||0}<br><span style="font-weight:700">ล่าสุด ${fmtTime(cfg.lastSync)}</span></div><label class="tt-item" style="margin-top:9px;cursor:pointer"><div><b>Auto Sync</b><div class="tt-muted">ตรวจการเปลี่ยนแปลงทุก ~8 วินาทีเมื่อออนไลน์</div></div><input id="tcs-auto" type="checkbox" ${cfg.auto?'checked':''} style="width:22px;height:22px"></label><div class="tt-wrap" style="margin-top:9px"><button id="tcs-upload" class="tt-btn">☁️ อัปโหลดเครื่องนี้</button><button id="tcs-pull" class="tt-btn soft">⬇️ ดึง/รวมจาก Cloud</button>${pendingRemote?'<button id="tcs-pending" class="tt-btn green">✨ รับข้อมูลใหม่</button>':''}<button id="tcs-forget" class="tt-btn soft">🔒 ลืม Key</button></div><div class="tt-photo-note">รูปใน Wallet/Notes ยังไม่ส่งขึ้น D1 • Sync เฉพาะข้อมูลแอปเพื่อให้เบาและปลอดภัยกว่า</div>`}`;
  $('#tcs-connect',card)?.addEventListener('click',async()=>{const key=$('#tcs-key',card).value.trim();if(!key)return notify('ใส่ Sync Key ก่อน');try{const r=await connectKey(key);if(Number(r.version)===0){cfg.auto=true;saveCfg();await uploadCurrent({force:true})}else{notify('เชื่อมแล้ว • Cloud มีข้อมูลอยู่ กดดึง/รวมหรืออัปโหลดเครื่องนี้');renderCard()}}catch(e){cfg.key='';cfg.auto=false;cfg.lastError=e.status===401?'unauthorized':e.message;saveCfg();notify(e.status===401?'Sync Key ไม่ถูกต้อง':'เชื่อม Cloudflare ไม่สำเร็จ');renderCard()}});
  $('#tcs-auto',card)?.addEventListener('change',e=>{cfg.auto=e.target.checked;cfg.lastHash=localHash();saveCfg();notify(cfg.auto?'เปิด Auto Sync แล้ว':'ปิด Auto Sync แล้ว');if(cfg.auto)syncCycle()});
  $('#tcs-upload',card)?.addEventListener('click',()=>uploadCurrent({force:true}));
  $('#tcs-pull',card)?.addEventListener('click',()=>pullCurrent({merge:true}));
  $('#tcs-pending',card)?.addEventListener('click',()=>pullCurrent({merge:true}));
  $('#tcs-forget',card)?.addEventListener('click',()=>{if(confirm('ลืม Sync Key ในมือถือเครื่องนี้? ข้อมูลใน Cloud จะไม่ถูกลบ')){cfg={key:'',auto:false,version:0,lastHash:'',lastSync:0,lastError:''};saveCfg();renderCard()}});
}
function watchSyncPanel(){const mo=new MutationObserver(()=>{if($('[data-panel="sync"]'))renderCard()});mo.observe(document.body,{childList:true,subtree:true});renderCard()}
function boot(){watchSyncPanel();clearInterval(pollTimer);pollTimer=setInterval(syncCycle,8000);window.addEventListener('online',()=>setTimeout(syncCycle,600));document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncCycle()});if(cfg.auto&&cfg.key)setTimeout(syncCycle,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
