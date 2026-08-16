(()=>{
'use strict';
if(window.__memoryAttachmentsV5)return;window.__memoryAttachmentsV5=true;
const $=(s,r=document)=>r.querySelector(s);
let repaired=false,reloading=false;
function polish(){const f=$('#memorySheet .mm-field');if(!f||!$('#mmPickDoc',f)||!$('#mmPickVideo',f))return false;f.classList.add('mm-attachments-v5');const l=$('label',f);if(l)l.textContent='📎 Attachments';const vb=$('#mmPickVideo',f),db=$('#mmPickDoc',f);if(vb)vb.textContent='🎬 เพิ่มวิดีโอ';if(db)db.textContent='📄 เพิ่มเอกสาร';const h=$('.mm-help',f);if(h)h.textContent='วิดีโอสูงสุด 5 ไฟล์ (50 MB/ไฟล์) • เอกสารสูงสุด 10 ไฟล์ (30 MB/ไฟล์) • รองรับ PDF, Word, Excel, PowerPoint, TXT, CSV';return true}
function repair(){if(polish()||reloading)return;const sheet=$('#memorySheet'),photo=$('#memPhotos'),grid=$('.form-grid',sheet);if(!sheet||!photo||!grid)return;reloading=true;sheet.querySelectorAll('.mm-field').forEach(x=>x.remove());sheet.removeAttribute('data-media-v4');window.__memoryMediaV4=false;const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/memory-media-v4.js?v=47';s.async=false;s.onload=()=>{repaired=true;reloading=false;setTimeout(polish,120)};s.onerror=()=>{reloading=false};document.body.appendChild(s)}
function check(){if(polish())return;repair()}
document.addEventListener('click',e=>{if(e.target.closest('[data-open-memory],#addMemory,.add-memory,.btn'))setTimeout(check,80)},true);
new MutationObserver(()=>{if($('#memorySheet')?.classList.contains('open')||$('#memPhotos'))setTimeout(check,40)}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
let tries=0;const boot=setInterval(()=>{tries++;check();if(polish()||tries>160)clearInterval(boot)},80);
window.addEventListener('pageshow',()=>setTimeout(check,120));
})();