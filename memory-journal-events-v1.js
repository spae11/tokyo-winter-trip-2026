(()=>{
'use strict';
if(window.__memoryJournalEventsV1)return;window.__memoryJournalEventsV1=true;
const KEY='travelHubMemoryPrefsV3',MEM_KEY='travelHubMemoriesV1';
function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');return{...p,tripCovers:p.tripCovers||{},favoritePhotos:p.favoritePhotos||{}}}catch{return{tripCovers:{},favoritePhotos:{}}}}
document.addEventListener('click',e=>{const el=e.target.closest?.('.mj-photo-fav[data-mj-favphoto]');if(!el)return;e.preventDefault();e.stopImmediatePropagation();const id=el.dataset.mjFavphoto,p=load();p.favoritePhotos[id]=!p.favoritePhotos[id];if(!p.favoritePhotos[id])delete p.favoritePhotos[id];localStorage.setItem(KEY,JSON.stringify(p));el.textContent=p.favoritePhotos[id]?'♥':'♡';window.dispatchEvent(new Event('travelhub:memory-updated'))},true);

/* EXIF GPS auto-link -------------------------------------------------------
   Reads GPS directly in the browser (JPEG/TIFF/PNG/WebP and many HEIC files
   whose EXIF TIFF block is embedded near the file header). Nothing is uploaded
   for EXIF parsing. If coordinates exist, the exact pin is used and a single
   reverse lookup fills country/region. */
let exifGps=null,exifSeq=0,lastSignature='';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const countryKey=cc=>({JP:'japan',HK:'hongkong',TH:'thailand'}[String(cc||'').toUpperCase()]||String(cc||'').toLowerCase());
const countryCode=k=>({japan:'JP',hongkong:'HK',thailand:'TH'}[k]||(String(k||'').length===2?String(k).toUpperCase():''));
const flag=cc=>String(cc||'').toUpperCase().replace(/[A-Z]/g,x=>String.fromCodePoint(127397+x.charCodeAt()));
const displayName=(cc,lang='th')=>{try{return new Intl.DisplayNames([lang,'en'],{type:'region'}).of(cc)||cc}catch{return cc}};
function statusEl(){const p=$('#mlPhotoPreview')?.parentElement||$('#memPhotos')?.closest('.field');if(!p)return null;let el=$('#mlExifGpsStatus');if(!el){el=document.createElement('div');el.id='mlExifGpsStatus';el.className='ml-helper';el.style.cssText='margin-top:8px;padding:8px 10px;border-radius:11px;background:#f7f5f0;line-height:1.45';p.appendChild(el)}return el}
function status(msg,type=''){const el=statusEl();if(!el)return;el.innerHTML=msg;el.style.color=type==='ok'?'#1F7A46':type==='bad'?'#9A2631':'#6f7478';el.style.background=type==='ok'?'#edf8f1':type==='bad'?'#fff0f1':'#f7f5f0'}
function bounds(dv,off,n=1){return off>=0&&n>=0&&off+n<=dv.byteLength}
function parseTiff(dv,base){
  try{
    if(!bounds(dv,base,8))return null;
    const sig=dv.getUint16(base,false),le=sig===0x4949?true:sig===0x4d4d?false:null;if(le===null||dv.getUint16(base+2,le)!==42)return null;
    const rel16=r=>{const a=base+r;if(!bounds(dv,a,2))throw 0;return dv.getUint16(a,le)},rel32=r=>{const a=base+r;if(!bounds(dv,a,4))throw 0;return dv.getUint32(a,le)};
    const sizes={1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8};
    function entries(rel){const abs=base+rel;if(!bounds(dv,abs,2))return new Map();const n=dv.getUint16(abs,le),m=new Map();for(let i=0;i<n;i++){const e=abs+2+i*12;if(!bounds(dv,e,12))break;const tag=dv.getUint16(e,le),type=dv.getUint16(e+2,le),count=dv.getUint32(e+4,le),size=(sizes[type]||1)*count;let valueAbs=size<=4?e+8:base+dv.getUint32(e+8,le);if(!bounds(dv,valueAbs,Math.min(size,1)))continue;m.set(tag,{tag,type,count,size,valueAbs,entryAbs:e})}return m}
    function num(e,idx=0){if(!e)return null;const o=e.valueAbs;switch(e.type){case 1:return bounds(dv,o+idx,1)?dv.getUint8(o+idx):null;case 3:return bounds(dv,o+idx*2,2)?dv.getUint16(o+idx*2,le):null;case 4:return bounds(dv,o+idx*4,4)?dv.getUint32(o+idx*4,le):null;case 5:{const a=o+idx*8;if(!bounds(dv,a,8))return null;const n=dv.getUint32(a,le),d=dv.getUint32(a+4,le);return d?n/d:null}case 9:return bounds(dv,o+idx*4,4)?dv.getInt32(o+idx*4,le):null;case 10:{const a=o+idx*8;if(!bounds(dv,a,8))return null;const n=dv.getInt32(a,le),d=dv.getInt32(a+4,le);return d?n/d:null}default:return null}}
    function ascii(e){if(!e||!bounds(dv,e.valueAbs,e.count))return'';const u=new Uint8Array(dv.buffer,dv.byteOffset+e.valueAbs,e.count),a=[];for(const b of u){if(!b)break;a.push(String.fromCharCode(b))}return a.join('').trim()}
    function dms(e){if(!e||e.count<3)return null;const a=num(e,0),b=num(e,1),c=num(e,2);return [a,b,c].every(Number.isFinite)?a+b/60+c/3600:null}
    const ifd0=entries(rel32(4));const gpsPtr=num(ifd0.get(0x8825));if(!Number.isFinite(gpsPtr))return null;const gps=entries(gpsPtr),lat=dms(gps.get(2)),lng=dms(gps.get(4));if(!Number.isFinite(lat)||!Number.isFinite(lng))return null;const latRef=ascii(gps.get(1)).toUpperCase(),lngRef=ascii(gps.get(3)).toUpperCase(),alt=num(gps.get(6));let date='';const exifPtr=num(ifd0.get(0x8769));if(Number.isFinite(exifPtr)){const ex=entries(exifPtr),raw=ascii(ex.get(0x9003))||ascii(ex.get(0x9004));const m=raw.match(/^(\d{4}):(\d{2}):(\d{2})/);if(m)date=`${m[1]}-${m[2]}-${m[3]}`}if(!date){const raw=ascii(ifd0.get(0x0132)),m=raw.match(/^(\d{4}):(\d{2}):(\d{2})/);if(m)date=`${m[1]}-${m[2]}-${m[3]}`}
    return{lat:latRef==='S'?-lat:lat,lng:lngRef==='W'?-lng:lng,alt:Number.isFinite(alt)?alt:null,date};
  }catch{return null}
}
function parseExifBuffer(buf){
  const dv=new DataView(buf),u=new Uint8Array(buf),len=u.length;
  if(len<8)return null;
  if(u[0]===0xff&&u[1]===0xd8){let p=2;while(p+4<len){if(u[p]!==0xff){p++;continue}const marker=u[p+1];if(marker===0xda||marker===0xd9)break;if(marker===0x00||marker===0x01||marker>=0xd0&&marker<=0xd7){p+=2;continue}const sl=(u[p+2]<<8)|u[p+3];if(sl<2||p+2+sl>len)break;if(marker===0xe1&&p+10<len&&u[p+4]===0x45&&u[p+5]===0x78&&u[p+6]===0x69&&u[p+7]===0x66&&u[p+8]===0&&u[p+9]===0){const x=parseTiff(dv,p+10);if(x)return x}p+=2+sl}}
  const max=Math.min(len,4*1024*1024);for(let i=0;i<max-10;i++){
    if(u[i]===0x45&&u[i+1]===0x78&&u[i+2]===0x69&&u[i+3]===0x66&&u[i+4]===0&&u[i+5]===0){const x=parseTiff(dv,i+6);if(x)return x;i+=5;continue}
    if((u[i]===0x49&&u[i+1]===0x49&&u[i+2]===0x2a&&u[i+3]===0)||(u[i]===0x4d&&u[i+1]===0x4d&&u[i+2]===0&&u[i+3]===0x2a)){const x=parseTiff(dv,i);if(x)return x;i+=3}
  }
  return null
}
async function gpsFromFile(file){try{const max=Math.min(file.size,6*1024*1024),buf=await file.slice(0,max).arrayBuffer();const x=parseExifBuffer(buf);return x?{...x,fileName:file.name||'photo'}:null}catch{return null}}
function setPending(lat,lng){try{pendingCoord={lat:Number(lat),lng:Number(lng)};if(typeof updateCoordText==='function')updateCoordText()}catch{}try{if(typeof map!=='undefined'&&map&&typeof map.flyTo==='function')map.flyTo([Number(lat),Number(lng)],15,{duration:.55})}catch{}}
function ensureCountryOption(sel,key,cc){if(!sel||[...sel.options].some(o=>o.value===key))return;const o=document.createElement('option');o.value=key;o.textContent=`${flag(cc)} ${displayName(cc,'en')}`;sel.appendChild(o)}
function regionFrom(x){const a=x?.address||{};return a.state||a.province||a.region||a.state_district||a.county||a.city||a.municipality||a.city_district||''}
function placeFrom(x){const a=x?.address||{};return x?.namedetails?.name||x?.name||a.attraction||a.tourism||a.amenity||a.building||a.shop||a.road||a.suburb||a.city||''}
async function reverseGps(lat,lng){
  const ck='travelHubExifReverseV1',id=`${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;let cache={};try{cache=JSON.parse(localStorage.getItem(ck)||'{}')}catch{}if(cache[id]&&Date.now()-cache[id].ts<2592000000)return cache[id].data;
  const q=new URLSearchParams({format:'jsonv2',addressdetails:'1',namedetails:'1',zoom:'18','accept-language':'th,en',lat:String(lat),lon:String(lng)}),r=await fetch('https://nominatim.openstreetmap.org/reverse?'+q.toString(),{headers:{Accept:'application/json'},cache:'no-store'});if(!r.ok)throw new Error('reverse');const data=await r.json();cache[id]={ts:Date.now(),data};const keys=Object.keys(cache).sort((a,b)=>cache[b].ts-cache[a].ts);for(const k of keys.slice(60))delete cache[k];try{localStorage.setItem(ck,JSON.stringify(cache))}catch{}return data
}
async function applyExifGps(gps,count,total,seq){
  if(seq!==exifSeq)return;exifGps=gps;setPending(gps.lat,gps.lng);const date=$('#memDate');if(date&&!date.value&&gps.date)date.value=gps.date;status(`🛰️ <b>พบ GPS ในรูป ${count}/${total}</b> • กำลังเชื่อมประเทศ/จังหวัดกับ Pin จริง…`,'ok');
  try{
    const x=await reverseGps(gps.lat,gps.lng);if(seq!==exifSeq)return;const cc=String(x?.address?.country_code||'').toUpperCase(),key=countryKey(cc),country=$('#memCountry'),region=$('#memRegion'),name=$('#memName'),savedName=name?.value||'',rn=regionFrom(x),place=placeFrom(x);
    if(country&&cc){ensureCountryOption(country,key,cc);if(country.value!==key){country.value=key;country.dispatchEvent(new Event('change',{bubbles:true}))}}
    if(region&&rn)region.value=rn;const rInput=$('#mglRegion');if(rInput&&rn)rInput.value=rn;const rs=$('#memRegionPlan');if(rs&&rn){const hit=[...rs.options].some(o=>o.value===rn);rs.value=hit?rn:'__custom__'}
    if(name){if(savedName)name.value=savedName;else if(place)name.value=place}
    const cInput=$('#mglCountry');if(cInput&&cc)cInput.value=`${flag(cc)} ${displayName(cc,'th')}`;
    const h=$('#memPlanHint');if(h)h.dataset.exifGps=`${gps.lat},${gps.lng}`;
    status(`✅ <b>GPS จากรูปพร้อมแล้ว</b><br>📍 ${esc(place||name?.value||'Location')} • ${esc(rn||'')} ${cc?`• ${flag(cc)} ${esc(displayName(cc,'th'))}`:''}<br><span style="font-size:.72rem">Pin ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}${count>1?` • พบ GPS ${count}/${total} รูป (ใช้พิกัดรูปแรก)`:''}</span>`,'ok');
  }catch{status(`✅ <b>อ่าน GPS จากรูปได้แล้ว</b> • Pin ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}<br><span style="font-size:.72rem">ค้นหาชื่อจังหวัดไม่สำเร็จ แต่พิกัดจริงถูกใช้แล้ว</span>`,'ok')}
}
async function scanPhotos(){
  const input=$('#memPhotos');if(!input)return;const files=[...(input.files||[])].slice(0,20),sig=files.map(f=>`${f.name}:${f.size}:${f.lastModified}`).join('|');if(!files.length){lastSignature='';exifGps=null;const el=$('#mlExifGpsStatus');if(el)el.remove();return}if(sig===lastSignature)return;lastSignature=sig;const seq=++exifSeq;status('🛰️ กำลังอ่าน GPS/EXIF จากรูปในเครื่อง…');const found=[];for(const f of files){const x=await gpsFromFile(f);if(seq!==exifSeq)return;if(x)found.push(x)}if(seq!==exifSeq)return;if(!found.length){exifGps=null;status('📷 รูปชุดนี้ไม่มี GPS ใน EXIF หรือแอป/บริการต้นทางลบ Location metadata ออกแล้ว • ยังค้นหา Location หรือเลือก Pin บนแผนที่ได้ตามปกติ');return}await applyExifGps(found[0],found.length,files.length,seq)
}
function wireExif(){const p=$('#memPhotos');if(!p||p.dataset.exifGps==='1')return;p.dataset.exifGps='1';p.addEventListener('change',()=>setTimeout(scanPhotos,20));const save=$('#saveMemory');save?.addEventListener('click',()=>{if(!exifGps)return;let before=[];try{before=(JSON.parse(localStorage.getItem(MEM_KEY)||'[]')||[]).map(x=>String(x.id))}catch{}const snap={...exifGps};setTimeout(()=>{try{const a=JSON.parse(localStorage.getItem(MEM_KEY)||'[]');if(!Array.isArray(a))return;const m=[...a].reverse().find(x=>x?.id&&!before.includes(String(x.id)));if(!m)return;m.gpsSource='EXIF';m.geoSource='EXIF GPS + OpenStreetMap/Nominatim';m.exifGps={lat:snap.lat,lng:snap.lng,alt:snap.alt??null,fileName:snap.fileName||'',date:snap.date||''};localStorage.setItem(MEM_KEY,JSON.stringify(a));window.dispatchEvent(new Event('travelhub:memory-updated'))}catch{}},1300)},true)}
let wireTries=0;const wt=setInterval(()=>{wireTries++;wireExif();if($('#memPhotos')?.dataset.exifGps==='1'||wireTries>120)clearInterval(wt)},80);
})();
