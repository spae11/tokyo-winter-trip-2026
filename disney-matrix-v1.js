(()=>{
 if(window.__disneyMatrixV1)return;window.__disneyMatrixV1=true;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const key='disneyMatrixZoomV1';
 let scale=Number(localStorage.getItem(key)||0)||(innerWidth<=620?.68:.85);
 let startDist=0,startScale=scale;
 function distance(t){const a=t[0],b=t[1];return Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)}
 function applyScale(box){
   const rides=box.querySelector('.rides');if(!rides)return;
   scale=clamp(scale,.55,1.35);
   rides.style.zoom=String(scale);
   rides.style.width=(100/scale)+'%';
   box.querySelector('.mx-zoom-label')?.replaceChildren(document.createTextNode(Math.round(scale*100)+'%'));
   localStorage.setItem(key,String(scale));
 }
 function install(box){
   if(box.classList.contains('matrix-ready'))return true;
   const rides=box.querySelector('.rides');if(!rides||!rides.querySelector('.ride'))return false;
   box.classList.add('matrix-ready');document.body.classList.add('disney-matrix-active');
   const toolbar=document.createElement('div');toolbar.className='matrix-toolbar';
   toolbar.innerHTML='<div class="mx-left"><b>🎢 ตารางเครื่องเล่น</b><span>แตะ ⭐ / ✅ ได้เลย</span></div><div class="mx-controls"><button type="button" class="mx-out" aria-label="ย่อตาราง">−</button><button type="button" class="mx-fit" aria-label="พอดีจอ"><span class="mx-zoom-label"></span></button><button type="button" class="mx-in" aria-label="ขยายตาราง">+</button></div>';
   rides.before(toolbar);
   const legend=document.createElement('div');legend.className='matrix-legend';legend.innerHTML='<span>⭐ อยากเล่น</span><span>✅ เล่นแล้ว</span><span>สีทอง = แนะนำ</span>';rides.after(legend);
   toolbar.querySelector('.mx-out').onclick=()=>{scale-=.1;applyScale(box)};
   toolbar.querySelector('.mx-in').onclick=()=>{scale+=.1;applyScale(box)};
   toolbar.querySelector('.mx-fit').onclick=()=>{scale=innerWidth<=620?.68:.85;applyScale(box)};
   rides.addEventListener('touchstart',e=>{if(e.touches.length===2){startDist=distance(e.touches);startScale=scale}},{passive:true});
   rides.addEventListener('touchmove',e=>{if(e.touches.length===2&&startDist){e.preventDefault();scale=clamp(startScale*(distance(e.touches)/startDist),.55,1.35);applyScale(box)}},{passive:false});
   rides.addEventListener('touchend',e=>{if(e.touches.length<2)startDist=0},{passive:true});
   applyScale(box);
   return true;
 }
 let tries=0;const timer=setInterval(()=>{tries++;const boxes=[...document.querySelectorAll('.disneybox')];let ok=false;boxes.forEach(b=>{if(install(b))ok=true});if(ok&&tries>12)clearInterval(timer);if(tries>160)clearInterval(timer)},100);
 const mo=new MutationObserver(()=>document.querySelectorAll('.disneybox').forEach(install));
 const boot=()=>mo.observe(document.body,{childList:true,subtree:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
