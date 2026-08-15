(()=>{
  if(window.__hubCollapsedSectionsV1)return;window.__hubCollapsedSectionsV1=true;
  const $=(s,r=document)=>r.querySelector(s);

  function addCountriesFold(){
    const sec=$('#countries');if(!sec||sec.classList.contains('hub-fold'))return false;
    const head=$('.section-head',sec),grid=$('.country-grid',sec);if(!head||!grid)return false;
    sec.classList.add('hub-fold','hub-collapsed');
    const copy=head.querySelector('div');
    if(copy&&!$('.hub-country-summary',copy)){
      const s=document.createElement('div');s.className='hub-country-summary';s.textContent='Japan • Hong Kong • Thailand';copy.appendChild(s);
    }
    const btn=document.createElement('button');
    btn.type='button';btn.className='hub-collapse-toggle hub-country-toggle';btn.setAttribute('aria-expanded','false');btn.innerHTML='ดู <span class="chev">⌄</span>';
    btn.onclick=()=>{
      const open=sec.classList.toggle('hub-collapsed')===false;
      btn.setAttribute('aria-expanded',String(open));btn.firstChild.textContent=open?'ซ่อน ':'ดู ';
    };
    head.appendChild(btn);
    return true;
  }

  function addDisneyFold(card){
    if(!card||card.classList.contains('hub-fold'))return false;
    const top=$('.dc-head-top',card);if(!top)return false;
    card.classList.add('hub-fold','hub-collapsed');
    const btn=document.createElement('button');btn.type='button';btn.className='hub-collapse-toggle hub-dc-toggle';btn.setAttribute('aria-expanded','false');btn.innerHTML='ดูรายการ <span class="chev">⌄</span>';
    btn.onclick=()=>{
      const open=card.classList.toggle('hub-collapsed')===false;
      btn.setAttribute('aria-expanded',String(open));btn.firstChild.textContent=open?'ย่อ ':'ดูรายการ ';
      if(open)setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
    };
    top.appendChild(btn);
    if(location.hash==='#disney-checklist'){
      card.classList.remove('hub-collapsed');btn.setAttribute('aria-expanded','true');btn.firstChild.textContent='ย่อ ';
    }
    return true;
  }

  function loadDisneyMatrix(){
    if(!location.pathname.includes('/tokyo/')&&!location.pathname.includes('/hongkong/'))return;
    document.querySelectorAll('link[data-disney-matrix],script[data-disney-matrix]').forEach(x=>x.remove());
    const l=document.createElement('link');l.rel='stylesheet';l.href='/tokyo-winter-trip-2026/disney-matrix-v2.css?v=33';l.dataset.disneyMatrix='2';document.head.appendChild(l);
    const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/disney-matrix-v2.js?v=33';s.defer=true;s.dataset.disneyMatrix='2';document.body.appendChild(s);
  }

  function boot(){
    addCountriesFold();
    loadDisneyMatrix();
    const existing=$('#disney-checklist');if(existing)addDisneyFold(existing);
    const mo=new MutationObserver(()=>{const card=$('#disney-checklist');if(card)addDisneyFold(card)});
    mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
