(()=>{
 if(window.__disneyBrowserV1)return;window.__disneyBrowserV1=true;
 const trip=location.pathname.includes('/hongkong/')?'hongkong':'tokyo';
 const PARK_IMAGE=trip==='hongkong'
  ?'https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=900&q=78'
  :'https://images.unsplash.com/photo-1590144662036-33bf0ebd2c7f?auto=format&fit=crop&w=900&q=78';
 let filter='all',query='';
 const norm=s=>String(s||'').toLowerCase().normalize('NFKD');

 function stateFor(card){
   const want=card.querySelector('.toggle.want')?.classList.contains('on')||false;
   const done=card.querySelector('.toggle.done')?.classList.contains('on')||false;
   return {want,done};
 }
 function isRecommended(card){
   if(card.classList.contains('reco')||card.classList.contains('recommended'))return true;
   const rank=Number(card.dataset.rank||99);return rank<=10;
 }
 function isLong(card){const t=card.textContent||'';return /ยาวมาก|กลาง–ยาว|กลาง-ยาว|มักยาว|คิวยาว/.test(t)}
 function decorate(card,index){
   if(card.dataset.browserCard==='1')return;
   card.dataset.browserCard='1';
   const title=card.querySelector('h4');if(!title)return;
   const zone=(card.querySelector('.ridezone')?.textContent||'Disney').split('•')[0].trim();
   const oldRank=card.querySelector('.rank,.ride-rank');
   const rankText=oldRank?.textContent?.trim()||'';
   const photo=document.createElement('div');photo.className='db-photo';
   photo.innerHTML=`<img src="${PARK_IMAGE}" alt="${title.textContent.trim()}" loading="lazy" style="object-position:${30+(index%5)*10}% center"><span class="db-zone">${zone}</span>${rankText?`<span class="db-rank">${rankText.replace('⭐ ','')}</span>`:''}`;
   const body=document.createElement('div');body.className='db-body';
   [...card.childNodes].forEach(n=>body.appendChild(n));
   card.append(photo,body);
   const meta=body.querySelector('.ride-meta,.meta');
   if(!meta){
     const fallback=document.createElement('div');fallback.className='ride-meta';fallback.innerHTML='<span class="ride-pill">⏳ เช็กคิวในแอป</span><span class="ride-pill">🎢 ดูเวลาหน้างาน</span>';title.after(fallback);
   }
   if(!body.querySelector('.ride-tip')){
     const tip=document.createElement('div');tip.className='db-tip';tip.textContent='ดูเวลารอจริงใน Disney App ก่อนเดินไปเครื่องเล่น';
     const m=body.querySelector('.ride-meta,.meta');m?m.after(tip):title.after(tip);
   }
 }
 function refreshRankBadges(box){
   box.querySelectorAll('.rides .ride').forEach(card=>{
     const rank=card.querySelector('.ride-rank,.rank');
     const badge=card.querySelector('.db-rank');
     if(rank&&badge)badge.textContent=rank.textContent.replace('⭐ ','').trim();
     else if(rank&&!badge){
       const b=document.createElement('span');b.className='db-rank';b.textContent=rank.textContent.replace('⭐ ','').trim();card.querySelector('.db-photo')?.appendChild(b);
     }
   });
 }
 function applyFilter(box){
   const cards=[...box.querySelectorAll('.rides .ride')];let visible=0;
   cards.forEach(card=>{
     const text=norm(card.textContent),st=stateFor(card);
     const qok=!query||text.includes(norm(query));
     let fok=true;
     if(filter==='recommended')fok=isRecommended(card);
     else if(filter==='long')fok=isLong(card);
     else if(filter==='want')fok=st.want;
     else if(filter==='done')fok=st.done;
     card.hidden=!(qok&&fok);if(!card.hidden)visible++;
   });
   const result=box.querySelector('.db-result');if(result)result.textContent=`แสดง ${visible} / ${cards.length} เครื่องเล่น`;
   box.querySelector('.db-empty')?.classList.toggle('show',visible===0);
   const rides=box.querySelector('.rides');if(rides)rides.scrollLeft=0;
 }
 function updateMeter(box){
   const cards=[...box.querySelectorAll('.rides .ride')];const done=cards.filter(c=>stateFor(c).done).length;
   const count=box.querySelector('#rideCount'),bar=box.querySelector('#rideBar');
   if(count)count.textContent=trip==='hongkong'?`${done}/${cards.length}`:`${done} / ${cards.length}`;
   if(bar)bar.style.width=(cards.length?done/cards.length*100:0)+'%';
 }
 function toggleTokyo(btn,box){
   const card=btn.closest('[data-ride]');if(!card)return;
   const id=card.dataset.ride,kind=btn.dataset.k;if(!id||!kind)return;
   let s={};try{s=JSON.parse(localStorage.getItem('disneyRideStatusV2')||'{}')}catch(e){}
   s[id]=s[id]||{};s[id][kind]=!s[id][kind];localStorage.setItem('disneyRideStatusV2',JSON.stringify(s));
   box.querySelectorAll(`[data-ride="${CSS.escape(id)}"] [data-k="${CSS.escape(kind)}"]`).forEach(x=>x.classList.toggle('on',!!s[id][kind]));
 }
 function toggleHK(btn,box){
   const id=btn.dataset.k,kind=btn.dataset.type;if(!id||!kind)return;
   let s={};try{s=JSON.parse(localStorage.getItem('disney-attractions-v2')||'{}')}catch(e){}
   s[id]=s[id]||{};s[id][kind]=!s[id][kind];localStorage.setItem('disney-attractions-v2',JSON.stringify(s));
   box.querySelectorAll(`.toggle[data-k="${CSS.escape(id)}"][data-type="${CSS.escape(kind)}"]`).forEach(x=>x.classList.toggle('on',!!s[id][kind]));
 }
 function install(box){
   if(box.dataset.browserReady==='1')return true;
   const rides=box.querySelector('.rides');if(!rides||!rides.querySelector('.ride'))return false;
   box.dataset.browserReady='1';box.classList.remove('matrix-ready','matrix-collapsed');box.classList.add('browser-ready','browser-collapsed');document.body.classList.add('disney-browser-active');
   box.querySelectorAll('.matrix-toolbar,.matrix-legend,.mx-fold,.db-controls,.db-result,.db-empty,.db-fold').forEach(x=>x.remove());
   rides.style.cssText='';[...rides.querySelectorAll('.ride')].forEach((c,i)=>decorate(c,i));
   const top=box.querySelector('.disneytop');
   if(top){const fold=document.createElement('button');fold.type='button';fold.className='db-fold';fold.textContent='ดูเครื่องเล่น ▾';fold.onclick=()=>{const open=!box.classList.toggle('browser-collapsed');fold.textContent=open?'ย่อ ▴':'ดูเครื่องเล่น ▾';if(open)setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'nearest'}),50)};top.appendChild(fold)}
   const controls=document.createElement('div');controls.className='db-controls';controls.innerHTML=`<div class="db-search-wrap"><input class="db-search" type="search" placeholder="ค้นหาชื่อเครื่องเล่นหรือโซน..." autocomplete="off"><span class="db-search-icon">🔎</span></div><div class="db-filters"><button class="db-filter on" data-f="all">ทั้งหมด</button><button class="db-filter" data-f="recommended">⭐ แนะนำ</button><button class="db-filter" data-f="long">🔥 คิวยาว</button><button class="db-filter" data-f="want">⭐ อยากเล่น</button><button class="db-filter" data-f="done">✅ เล่นแล้ว</button></div>`;
   rides.before(controls);const result=document.createElement('div');result.className='db-result';controls.after(result);const empty=document.createElement('div');empty.className='db-empty';empty.textContent='ไม่พบเครื่องเล่นที่ตรงกับการค้นหา';rides.after(empty);
   controls.querySelector('.db-search').addEventListener('input',e=>{query=e.target.value;applyFilter(box)});
   controls.querySelectorAll('.db-filter').forEach(b=>b.onclick=()=>{filter=b.dataset.f;controls.querySelectorAll('.db-filter').forEach(x=>x.classList.toggle('on',x===b));applyFilter(box)});
   rides.addEventListener('click',e=>{const btn=e.target.closest('.toggle');if(!btn)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();trip==='hongkong'?toggleHK(btn,box):toggleTokyo(btn,box);updateMeter(box);applyFilter(box)},true);
   if(location.hash==='#disney-checklist'||location.hash==='#disney'){box.classList.remove('browser-collapsed');const f=box.querySelector('.db-fold');if(f)f.textContent='ย่อ ▴'}
   updateMeter(box);applyFilter(box);
   setTimeout(()=>{refreshRankBadges(box);applyFilter(box)},450);
   return true;
 }
 let tries=0;const timer=setInterval(()=>{tries++;let ok=false;document.querySelectorAll('.disneybox').forEach(b=>{if(install(b))ok=true});if(ok&&tries>15)clearInterval(timer);if(tries>180)clearInterval(timer)},100);
 const mo=new MutationObserver(()=>{document.querySelectorAll('.disneybox').forEach(b=>{if(b.dataset.browserReady!=='1')install(b);else refreshRankBadges(b)})});
 mo.observe(document.documentElement,{childList:true,subtree:true});
})();
