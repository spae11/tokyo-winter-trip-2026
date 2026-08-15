(()=>{
  if(window.__disneyMatrixV2)return;window.__disneyMatrixV2=true;
  const trip=location.pathname.includes('/hongkong/')?'hongkong':'tokyo';
  const densityKey='disneyMatrixColumnsV2';
  let cols=Number(localStorage.getItem(densityKey)||4);
  cols=Math.max(3,Math.min(5,cols));
  let pinchStart=0;
  const distance=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);

  function applyDensity(box){
    box.style.setProperty('--mx-cols',String(cols));
    const label=box.querySelector('.mx-zoom-label');
    if(label)label.textContent=cols===4?'พอดี':cols===5?'เล็ก':'ใหญ่';
    localStorage.setItem(densityKey,String(cols));
  }

  function tokyoToggle(btn){
    const card=btn.closest('[data-ride]');
    if(!card)return;
    const id=card.dataset.ride;
    const kind=btn.dataset.k;
    if(!id||!kind)return;
    const key='disneyRideStatusV2';
    let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
    state[id]=state[id]||{};
    state[id][kind]=!state[id][kind];
    localStorage.setItem(key,JSON.stringify(state));
    document.querySelectorAll(`[data-ride="${CSS.escape(id)}"] [data-k="${CSS.escape(kind)}"]`).forEach(x=>{
      x.classList.toggle('on',!!state[id][kind]);
      x.setAttribute('aria-pressed',String(!!state[id][kind]));
    });
    const all=[...document.querySelectorAll('.disneybox.matrix-ready .rides [data-ride]')];
    const done=all.filter(x=>state[x.dataset.ride]?.done).length;
    const count=document.getElementById('rideCount'),bar=document.getElementById('rideBar');
    if(count)count.textContent=`${done} / ${all.length}`;
    if(bar)bar.style.width=(all.length?done/all.length*100:0)+'%';
  }

  function hkToggle(btn,box){
    const id=btn.dataset.k;
    const kind=btn.dataset.type;
    if(!id||!kind)return;
    const key='disney-attractions-v2';
    let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
    state[id]=state[id]||{};
    state[id][kind]=!state[id][kind];
    localStorage.setItem(key,JSON.stringify(state));
    box.querySelectorAll(`.toggle[data-k="${CSS.escape(id)}"][data-type="${CSS.escape(kind)}"]`).forEach(x=>{
      x.classList.toggle('on',!!state[id][kind]);
      x.setAttribute('aria-pressed',String(!!state[id][kind]));
    });
    const doneKeys=new Set([...box.querySelectorAll('.rides .toggle.done[data-k]')].map(x=>x.dataset.k));
    const done=[...doneKeys].filter(k=>state[k]?.done).length;
    const count=box.querySelector('#rideCount'),bar=box.querySelector('#rideBar');
    if(count)count.textContent=`${done}/${doneKeys.size}`;
    if(bar)bar.style.width=(doneKeys.size?done/doneKeys.size*100:0)+'%';
  }

  function install(box){
    if(box.dataset.matrixV2==='1')return true;
    const rides=box.querySelector('.rides');
    if(!rides||!rides.querySelector('.ride'))return false;
    box.dataset.matrixV2='1';
    box.classList.add('matrix-ready','matrix-collapsed');
    document.body.classList.add('disney-matrix-active');

    box.querySelectorAll('.matrix-toolbar,.matrix-legend,.mx-fold').forEach(x=>x.remove());
    rides.style.zoom='';rides.style.width='';rides.style.transform='';

    const top=box.querySelector('.disneytop');
    if(top){
      const fold=document.createElement('button');
      fold.type='button';fold.className='mx-fold';fold.setAttribute('aria-expanded','false');fold.textContent='ดูตาราง ▾';
      fold.addEventListener('click',()=>{
        const open=!box.classList.toggle('matrix-collapsed');
        fold.setAttribute('aria-expanded',String(open));
        fold.textContent=open?'ย่อ ▴':'ดูตาราง ▾';
        if(open)setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
      });
      top.appendChild(fold);
    }

    const toolbar=document.createElement('div');toolbar.className='matrix-toolbar';
    toolbar.innerHTML='<div class="mx-left"><b>🎢 32 เครื่องเล่น</b><span>แตะ ⭐ / ✅ ได้เลย</span></div><div class="mx-controls"><button type="button" class="mx-out">−</button><button type="button" class="mx-fit"><span class="mx-zoom-label"></span></button><button type="button" class="mx-in">+</button></div>';
    rides.before(toolbar);
    const legend=document.createElement('div');legend.className='matrix-legend';legend.innerHTML='<span>⭐ อยากเล่น</span><span>✅ เล่นแล้ว</span><span>ทอง = แนะนำ</span>';rides.after(legend);

    toolbar.querySelector('.mx-out').onclick=()=>{cols=Math.min(5,cols+1);applyDensity(box)};
    toolbar.querySelector('.mx-fit').onclick=()=>{cols=4;applyDensity(box)};
    toolbar.querySelector('.mx-in').onclick=()=>{cols=Math.max(3,cols-1);applyDensity(box)};

    // Capture taps before the older page handler. This avoids double-toggle and Android zoom hitbox issues.
    rides.addEventListener('click',e=>{
      const btn=e.target.closest('.toggle');
      if(!btn||!rides.contains(btn))return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(trip==='hongkong')hkToggle(btn,box);else tokyoToggle(btn);
    },true);

    rides.addEventListener('touchstart',e=>{if(e.touches.length===2)pinchStart=distance(e.touches)},{passive:true});
    rides.addEventListener('touchend',e=>{
      if(!pinchStart||e.touches.length>0)return;
      const changed=e.changedTouches;
      if(changed&&changed.length===2){
        const end=distance(changed),ratio=end/pinchStart;
        if(ratio>1.12)cols=Math.max(3,cols-1);
        else if(ratio<.88)cols=Math.min(5,cols+1);
        applyDensity(box);
      }
      pinchStart=0;
    },{passive:true});

    box.querySelectorAll('.toggle').forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('on')));b.style.touchAction='manipulation'});
    if(location.hash==='#disney-checklist'){
      box.classList.remove('matrix-collapsed');
      const f=box.querySelector('.mx-fold');if(f){f.setAttribute('aria-expanded','true');f.textContent='ย่อ ▴'}
    }
    applyDensity(box);
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    let ok=false;document.querySelectorAll('.disneybox').forEach(b=>{if(install(b))ok=true});
    if(ok&&tries>12)clearInterval(timer);if(tries>160)clearInterval(timer);
  },100);
  new MutationObserver(()=>document.querySelectorAll('.disneybox').forEach(install)).observe(document.documentElement,{childList:true,subtree:true});
})();