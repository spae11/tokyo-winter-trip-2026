(()=>{
'use strict';
if(window.__travelGooglePhotosV1)return;window.__travelGooglePhotosV1=true;
const API='https://travel-hub-api.mlrkdee44.workers.dev';
const CLOUD_KEY='travelToolsCloudV3';
const TT_KEY='travelToolsV1';
let busy=false,lastStatusAt=0,statusCache=null,autoTimer=null;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function cloud(){try{return JSON.parse(localStorage.getItem(CLOUD_KEY)||'{}')}catch{return{}}}
function token(){return cloud().token||''}
function toast(msg){let t=$('#gp-toast');if(!t){t=document.createElement('div');t.id='gp-toast';t.style.cssText='position:fixed;left:50%;bottom:160px;z-index:10040;transform:translate(-50%,12px);background:#1E2428;color:#fff;padding:9px 13px;border-radius:999px;font:800 12px system-ui;opacity:0;transition:.2s;pointer-events:none;box-shadow:0 10px 30px #0003';document.body.appendChild(t)}t.textContent=msg;t.style.opacity='1';t.style.transform='translate(-50%,0)';clearTimeout(t._x);t._x=setTimeout(()=>{t.style.opacity='0';t.style.transform='translate(-50%,12px)'},2600)}
async function req(path,{method='GET',body,raw=false,contentType}={}){const tk=token();if(!tk)throw Object.assign(new Error('cloud_not_paired'),{status:401});const h={Authorization:'Bearer '+tk};if(body!==undefined&&!raw)h['Content-Type']='application/json';if(contentType)h['Content-Type']=contentType;const r=await fetch(API+path,{method,headers:h,body:body===undefined?undefined:(raw?body:JSON.stringify(body)),cache:'no-store'});let data={};try{data=await r.json()}catch{}if(!r.ok)throw Object.assign(new Error(data.error||'request_failed'),{status:r.status,data});return data}
async function status(force=false){if(!token())return{configured:false,connected:false,backupCount:0,cloudMissing:true};if(!force&&statusCache&&Date.now()-lastStatusAt<30000)return statusCache;try{statusCache=await req('/api/google/status');lastStatusAt=Date.now();return statusCache}catch(e){return{configured:false,connected:false,backupCount:0,error:e.message}}}
function panel(){return document.querySelector('[data-panel="sync"]')}
function card(){return $('#gp-card')}
function setCard(html){const p=panel();if(!p)return;let c=card();if(!c){c=document.createElement('div');c.id='gp-card';c.className='tt-card';c.style.marginTop='10px';p.appendChild(c)}c.innerHTML=html}
function loading(){setCard('<div class="tt-ey">GOOGLE PHOTOS</div><h3>📸 Google Photos Backup</h3><div class="tt-muted">กำลังตรวจสอบการเชื่อมต่อ…</div>')}
async function render(force=false){const p=panel();if(!p)return;const s=await status(force);if(!p.isConnected)return;
  if(s.cloudMissing){setCard(`<div class="tt-ey">GOOGLE PHOTOS</div><h3>📸 Google Photos Backup</h3><div class="tt-status warn">ต้องสร้าง/จับคู่ Cloud Sync ก่อน</div><p class="tt-muted">Google Photos ใช้ Device Token เดียวกับ Full Sync จึงไม่ต้องมีรหัสเพิ่ม</p>`);return}
  if(!s.configured){setCard(`<div class="tt-ey">GOOGLE PHOTOS</div><h3>📸 Google Photos Backup</h3><div class="tt-status warn">รอ Google OAuth Client</div><p class="tt-muted">ฝั่งแอปและ Cloudflare พร้อมแล้ว เหลือเพิ่ม <b>GOOGLE_CLIENT_ID</b> และ <b>GOOGLE_CLIENT_SECRET</b> ใน GitHub Secrets ครั้งเดียว</p><div class="tt-photo-note">Redirect URI: <b>travel-hub-api.mlrkdee44.workers.dev/api/google/callback</b></div>`);return}
  if(!s.connected){setCard(`<div class="tt-ey">GOOGLE PHOTOS</div><h3>📸 Google Photos Backup</h3><p class="tt-muted">เชื่อมบัญชี Google Photos ครั้งเดียว แล้วรูป Memories/Notes ใหม่จะสำรองให้อัตโนมัติ</p><button id="gp-connect" class="tt-btn full">🔗 เชื่อม Google Photos</button><div class="tt-photo-note">Travel Hub Login ไม่เปลี่ยน • Google ใช้เฉพาะการสำรองรูป</div>`);$('#gp-connect')?.addEventListener('click',connect);return}
  setCard(`<div class="tt-row"><div><div class="tt-ey">GOOGLE PHOTOS</div><h3>✅ เชื่อม Google Photos แล้ว</h3></div><span class="tt-chip green">${Number(s.backupCount)||0} รูป</span></div><p class="tt-muted">รูป Memories และรูปใน Notes จะสำรองเข้า Google Photos • QR/Booking ยังเก็บใน R2 เพื่อเปิดในแอปได้เร็ว</p><div class="tt-wrap"><button id="gp-backup" class="tt-btn">☁️ สำรองรูปตอนนี้</button><button id="gp-disconnect" class="tt-btn soft">ยกเลิกการเชื่อม</button></div><div id="gp-progress" class="tt-photo-note">Auto Backup เปิดอยู่เมื่อออนไลน์</div>`);
  $('#gp-backup')?.addEventListener('click',()=>backupNow(true));$('#gp-disconnect')?.addEventListener('click',disconnect)
}
async function connect(){if(busy)return;busy=true;try{const r=await req('/api/google/connect',{method:'POST',body:{}});if(r.authUrl)location.assign(r.authUrl)}catch(e){toast(e.message==='google_not_configured'?'ยังไม่ได้ใส่ Google OAuth Secret':'เชื่อม Google Photos ไม่สำเร็จ')}finally{busy=false}}
async function disconnect(){if(!confirm('ยกเลิกการเชื่อม Google Photos กับ Travel Hub?'))return;try{await req('/api/google/disconnect',{method:'DELETE'});statusCache=null;toast('ยกเลิก Google Photos แล้ว');render(true)}catch{toast('ยกเลิกไม่สำเร็จ')}}
function dataUrlToBlob(s){const [head,data]=String(s).split(',');const m=(head||'').match(/data:([^;]+)/),bin=atob(data||''),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:m?.[1]||'image/jpeg'})}
function ext(type){if(type==='image/png')return'png';if(type==='image/webp')return'webp';if(type==='image/heic')return'heic';if(type?.startsWith('video/'))return type.split('/')[1]||'mp4';return'jpg'}
function openMemoryDB(){return new Promise((res,rej)=>{const q=indexedDB.open('travelHubMemoryDB',1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('photos'))q.result.createObjectStore('photos')};q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function getPhoto(id){try{const db=await openMemoryDB();return await new Promise((res,rej)=>{const q=db.transaction('photos').objectStore('photos').get(id);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error)})}catch{return null}}
async function gather(){const out=[];let notes=[];try{notes=JSON.parse(localStorage.getItem(TT_KEY)||'{}').notes||[]}catch{}for(const n of notes){if(!n?.image)continue;try{const blob=dataUrlToBlob(n.image);out.push({localId:'note:'+n.id,blob,filename:`travel-note-${n.date||'photo'}-${n.id}.${ext(blob.type)}`,description:String(n.title||n.text||'').slice(0,500)})}catch{}}
  let memories=[];try{memories=JSON.parse(localStorage.getItem('travelHubMemoriesV1')||'[]')}catch{}for(const m of memories||[]){for(const pid of m.photoIds||[]){const blob=await getPhoto(pid);if(blob)out.push({localId:'memory:'+pid,blob,filename:`travel-memory-${pid}.${ext(blob.type)}`,description:''})}}
  return out
}
async function uploadOne(x){const q=new URLSearchParams({localId:x.localId,filename:x.filename});if(x.description)q.set('description',x.description);return req('/api/google/upload?'+q.toString(),{method:'POST',body:x.blob,raw:true,contentType:x.blob.type||'image/jpeg'})}
async function backupNow(notice=false){if(busy||!navigator.onLine||!token())return;const s=await status();if(!s.connected)return;busy=true;const progress=$('#gp-progress');try{const items=await gather(),remote=await req('/api/google/items'),done=new Set((remote.items||[]).map(x=>x.local_id));const todo=items.filter(x=>!done.has(x.localId));if(!todo.length){if(notice)toast('Google Photos สำรองครบแล้ว');return}let ok=0;for(const x of todo){if(progress)progress.textContent=`กำลังสำรอง ${ok+1}/${todo.length}…`;try{await uploadOne(x);ok++}catch(e){if(e.message==='google_not_connected')break}}statusCache=null;if(notice)toast(`สำรอง Google Photos ${ok} รูปแล้ว`);await render(true)}catch(e){if(notice)toast('สำรอง Google Photos ไม่สำเร็จ')}finally{busy=false}}
function ensure(){const p=panel();if(!p)return;if(!card()){loading();render()}else if(p.classList.contains('on'))render()}
document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="sync"]'))setTimeout(()=>{loading();render(true)},80)});
window.addEventListener('online',()=>setTimeout(()=>backupNow(false),2500));
const params=new URLSearchParams(location.search);if(params.get('googlePhotos')==='connected'){setTimeout(()=>toast('✅ เชื่อม Google Photos สำเร็จ'),1200);params.delete('googlePhotos');const q=params.toString();history.replaceState(null,'',location.pathname+(q?'?'+q:'')+location.hash)}
setTimeout(ensure,900);setInterval(ensure,3000);autoTimer=setInterval(()=>backupNow(false),120000);
})();
