(()=>{
'use strict';
if(window.__journeyStorageMigrationV1)return;
window.__journeyStorageMigrationV1=true;

const OLD=String.fromCharCode(104,117,98);
const OLD_CAP=String.fromCharCode(72,117,98);
const NEW='journey';
const NEW_CAP='Journey';

function rewriteKey(key){
  let s=String(key??'');
  s=s.replace(new RegExp('travel'+OLD_CAP,'g'),'travel'+NEW_CAP);
  s=s.replace(new RegExp('Travel'+OLD_CAP,'g'),'Travel'+NEW_CAP);
  s=s.replace(new RegExp('travel'+OLD,'g'),'travel'+NEW);
  s=s.replace(new RegExp('(^|[^A-Za-z0-9])'+OLD+'(?=[A-Z0-9_:\-.])','g'),'$1'+NEW);
  s=s.replace(new RegExp('(^|[^A-Za-z0-9])'+OLD_CAP+'(?=[A-Z0-9_:\-.])','g'),'$1'+NEW_CAP);
  s=s.replace(new RegExp('(^|[^A-Za-z0-9])'+OLD+'(?=$|[^A-Za-z0-9])','g'),'$1'+NEW);
  s=s.replace(new RegExp('(^|[^A-Za-z0-9])'+OLD_CAP+'(?=$|[^A-Za-z0-9])','g'),'$1'+NEW_CAP);
  return s;
}

function migrateStorage(store){
  const moves=[];
  try{
    for(let i=0;i<store.length;i++){
      const key=store.key(i);
      const next=rewriteKey(key);
      if(next!==key)moves.push([key,next,store.getItem(key)]);
    }
    for(const [oldKey,newKey,value] of moves){
      if(store.getItem(newKey)==null&&value!=null)store.setItem(newKey,value);
      store.removeItem(oldKey);
    }
  }catch(e){}
  return moves.length;
}

migrateStorage(localStorage);
migrateStorage(sessionStorage);

try{
  const nativeSet=Storage.prototype.setItem;
  const nativeGet=Storage.prototype.getItem;
  const nativeRemove=Storage.prototype.removeItem;
  if(!Storage.prototype.__journeyKeyCompatV1){
    Object.defineProperty(Storage.prototype,'__journeyKeyCompatV1',{value:true,configurable:false});
    Storage.prototype.setItem=function(key,value){return nativeSet.call(this,rewriteKey(key),value)};
    Storage.prototype.getItem=function(key){return nativeGet.call(this,rewriteKey(key))};
    Storage.prototype.removeItem=function(key){
      const next=rewriteKey(key);
      nativeRemove.call(this,key);
      if(next!==key)nativeRemove.call(this,next);
    };
  }
}catch(e){}

function openDb(name,version,onUpgrade){
  return new Promise((resolve,reject)=>{
    let req;
    try{req=version?indexedDB.open(name,version):indexedDB.open(name)}catch(e){reject(e);return}
    if(onUpgrade)req.onupgradeneeded=()=>onUpgrade(req.result,req.transaction);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('db open failed'));
    req.onblocked=()=>reject(new Error('db blocked'));
  });
}

async function copyPhotoStore(oldDb,newDb){
  if(!oldDb.objectStoreNames.contains('photos'))return 0;
  return new Promise((resolve,reject)=>{
    let count=0;
    const readTx=oldDb.transaction('photos','readonly');
    const readStore=readTx.objectStore('photos');
    const req=readStore.openCursor();
    const rows=[];
    req.onsuccess=()=>{
      const cur=req.result;
      if(!cur)return;
      rows.push([cur.key,cur.value]);
      cur.continue();
    };
    req.onerror=()=>reject(req.error);
    readTx.oncomplete=()=>{
      if(!rows.length){resolve(0);return}
      const writeTx=newDb.transaction('photos','readwrite');
      const writeStore=writeTx.objectStore('photos');
      for(const [key,value] of rows){writeStore.put(value,key);count++}
      writeTx.oncomplete=()=>resolve(count);
      writeTx.onerror=()=>reject(writeTx.error);
    };
    readTx.onerror=()=>reject(readTx.error);
  });
}

async function migrateMemoryDb(){
  if(!('indexedDB' in window))return 0;
  const oldName='travel'+OLD_CAP+'MemoryDB';
  const newName='travel'+NEW_CAP+'MemoryDB';
  const marker='ourJourneyStorageMigrationV1';
  if(localStorage.getItem(marker)==='1')return 0;
  let exists=true;
  try{
    if(indexedDB.databases){
      const dbs=await indexedDB.databases();
      exists=dbs.some(x=>x&&x.name===oldName);
    }
  }catch(e){}
  if(!exists){localStorage.setItem(marker,'1');return 0}
  let oldDb;
  try{oldDb=await openDb(oldName)}catch(e){return 0}
  if(!oldDb.objectStoreNames.contains('photos')){
    oldDb.close();
    try{indexedDB.deleteDatabase(oldName)}catch(e){}
    localStorage.setItem(marker,'1');
    return 0;
  }
  let newDb;
  try{
    newDb=await openDb(newName,1,(db)=>{if(!db.objectStoreNames.contains('photos'))db.createObjectStore('photos')});
    const count=await copyPhotoStore(oldDb,newDb);
    oldDb.close();newDb.close();
    await new Promise(resolve=>{
      const del=indexedDB.deleteDatabase(oldName);
      del.onsuccess=del.onerror=del.onblocked=()=>resolve();
    });
    localStorage.setItem(marker,'1');
    return count;
  }catch(e){
    try{oldDb?.close();newDb?.close()}catch(_){}
    return 0;
  }
}

window.__journeyStorageReady=migrateMemoryDb().then(count=>{
  if(count>0&&sessionStorage.getItem('journeyMigrationReloadedV1')!=='1'){
    sessionStorage.setItem('journeyMigrationReloadedV1','1');
    setTimeout(()=>location.reload(),120);
  }
  return count;
});

function refreshBrandMeta(){
  document.title='Our Journey';
  const meta=document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if(meta)meta.setAttribute('content','Our Journey');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshBrandMeta,{once:true});
else refreshBrandMeta();
})();
