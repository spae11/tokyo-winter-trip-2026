(()=>{
'use strict';
if(window.__memoryJournalEventsV1)return;window.__memoryJournalEventsV1=true;
const KEY='travelHubMemoryPrefsV3';
function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');return{...p,tripCovers:p.tripCovers||{},favoritePhotos:p.favoritePhotos||{}}}catch{return{tripCovers:{},favoritePhotos:{}}}}
document.addEventListener('click',e=>{const el=e.target.closest?.('.mj-photo-fav[data-mj-favphoto]');if(!el)return;e.preventDefault();e.stopImmediatePropagation();const id=el.dataset.mjFavphoto,p=load();p.favoritePhotos[id]=!p.favoritePhotos[id];if(!p.favoritePhotos[id])delete p.favoritePhotos[id];localStorage.setItem(KEY,JSON.stringify(p));el.textContent=p.favoritePhotos[id]?'♥':'♡';window.dispatchEvent(new Event('travelhub:memory-updated'))},true);
})();
