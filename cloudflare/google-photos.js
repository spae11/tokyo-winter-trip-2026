const ALLOWED_ORIGIN='https://spae11.github.io';
const REDIRECT_URI='https://travel-hub-api.mlrkdee44.workers.dev/api/google/callback';
const APP_RETURN='https://spae11.github.io/tokyo-winter-trip-2026/?googlePhotos=connected';
const DRIVE_SCOPE='https://www.googleapis.com/auth/drive.file';
const SCOPES=[
  'https://www.googleapis.com/auth/photoslibrary.appendonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
  'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
  DRIVE_SCOPE
];
const enc=new TextEncoder(),dec=new TextDecoder();

function headers(origin,contentType='application/json; charset=utf-8'){
  const h={'Content-Type':contentType,'Cache-Control':'no-store','Vary':'Origin'};
  if(origin===ALLOWED_ORIGIN){
    h['Access-Control-Allow-Origin']=origin;
    h['Access-Control-Allow-Headers']='Authorization, Content-Type, X-Sync-Token';
    h['Access-Control-Allow-Methods']='GET, PUT, POST, DELETE, OPTIONS';
  }
  return h;
}
function json(data,status=200,origin=''){return new Response(JSON.stringify(data),{status,headers:headers(origin)})}
function b64url(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'')}
function b64decode(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out}
function randomToken(n=32){const a=new Uint8Array(n);crypto.getRandomValues(a);return b64url(a)}
async function digest(text){const b=await crypto.subtle.digest('SHA-256',enc.encode(text));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function aesKey(env){const raw=await crypto.subtle.digest('SHA-256',enc.encode('google-media:'+env.TRAVEL_SYNC_KEY));return crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt'])}
async function seal(text,env){const iv=new Uint8Array(12);crypto.getRandomValues(iv);const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await aesKey(env),enc.encode(text));return b64url(iv)+'.'+b64url(new Uint8Array(ct))}
async function unseal(text,env){const [a,b]=String(text||'').split('.');if(!a||!b)throw new Error('invalid_secret');const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64decode(a)},await aesKey(env),b64decode(b));return dec.decode(pt)}
function configured(env){return Boolean(env.GOOGLE_CLIENT_ID&&env.GOOGLE_CLIENT_SECRET&&env.TRAVEL_SYNC_KEY)}
function safeName(s,fallback='travel-file'){return String(s||fallback).replace(/[\r\n\\/]+/g,'_').slice(0,180)||fallback}
function safeLocalId(s){return String(s||'').replace(/[^A-Za-z0-9._:-]/g,'_').slice(0,180)}

async function ensureTables(env){
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS google_oauth_states (state_hash TEXT PRIMARY KEY, room_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS google_photo_auth (room_id TEXT PRIMARY KEY, refresh_token_enc TEXT NOT NULL, scopes TEXT, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS google_photo_items (room_id TEXT NOT NULL, local_id TEXT NOT NULL, google_media_id TEXT NOT NULL, product_url TEXT, filename TEXT, mime_type TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(room_id,local_id))`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_google_photo_items_room ON google_photo_items(room_id)`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS google_drive_folders (room_id TEXT PRIMARY KEY, folder_id TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS google_drive_items (room_id TEXT NOT NULL, local_id TEXT NOT NULL, google_file_id TEXT NOT NULL, name TEXT NOT NULL, mime_type TEXT NOT NULL DEFAULT 'application/pdf', web_view_link TEXT, trip TEXT, category TEXT, size_bytes INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(room_id,local_id))`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_google_drive_items_room ON google_drive_items(room_id)`).run();
}

async function tokenForRoom(env,roomId){
  if(!configured(env))throw Object.assign(new Error('google_not_configured'),{status:503});
  await ensureTables(env);
  const row=await env.DB.prepare('SELECT refresh_token_enc FROM google_photo_auth WHERE room_id=?').bind(roomId).first();
  if(!row)throw Object.assign(new Error('google_not_connected'),{status:409});
  const refresh=await unseal(row.refresh_token_enc,env);
  const body=new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,refresh_token:refresh,grant_type:'refresh_token'});
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  const data=await r.json();
  if(!r.ok||!data.access_token)throw Object.assign(new Error(data.error||'google_token_failed'),{status:502,data});
  return data.access_token;
}
async function googleJson(url,access,{method='GET',body}={}){
  const r=await fetch(url,{method,headers:{Authorization:'Bearer '+access,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  let data={};try{data=await r.json()}catch{}
  if(!r.ok)throw Object.assign(new Error(data?.error?.message||data?.error||'google_api_failed'),{status:502,data});
  return data;
}

async function uploadPhotoRequest(req,env,roomId,origin,{localId,filename,description=''}){
  await ensureTables(env);
  localId=safeLocalId(localId);filename=safeName(filename,'travel-photo');description=String(description||'').slice(0,1000);
  if(!localId)return json({ok:false,error:'local_id_required'},400,origin);
  const existing=await env.DB.prepare('SELECT google_media_id,product_url,filename,mime_type FROM google_photo_items WHERE room_id=? AND local_id=?').bind(roomId,localId).first();
  if(existing)return json({ok:true,existing:true,mediaItemId:existing.google_media_id,productUrl:existing.product_url||null,filename:existing.filename,mimeType:existing.mime_type},200,origin);
  const mime=(req.headers.get('Content-Type')||'application/octet-stream').split(';')[0].trim();
  if(!/^image\//.test(mime)&&!/^video\//.test(mime))return json({ok:false,error:'unsupported_media_type'},415,origin);
  const len=Number(req.headers.get('Content-Length')||0);if(len>50000000)return json({ok:false,error:'media_too_large'},413,origin);
  const bytes=await req.arrayBuffer();if(bytes.byteLength>50000000)return json({ok:false,error:'media_too_large'},413,origin);
  const access=await tokenForRoom(env,roomId);
  const up=await fetch('https://photoslibrary.googleapis.com/v1/uploads',{method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':'application/octet-stream','X-Goog-Upload-Content-Type':mime,'X-Goog-Upload-Protocol':'raw'},body:bytes});
  const uploadToken=await up.text();if(!up.ok||!uploadToken)throw Object.assign(new Error('google_upload_failed'),{status:502,data:uploadToken.slice(0,500)});
  const item={simpleMediaItem:{uploadToken,fileName:filename}};if(description)item.description=description;
  const created=await googleJson('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',access,{method:'POST',body:{newMediaItems:[item]}});
  const result=created?.newMediaItemResults?.[0],media=result?.mediaItem;
  if(!media?.id)return json({ok:false,error:'google_create_media_failed',detail:result?.status||null},502,origin);
  await env.DB.prepare(`INSERT INTO google_photo_items(room_id,local_id,google_media_id,product_url,filename,mime_type) VALUES(?,?,?,?,?,?) ON CONFLICT(room_id,local_id) DO UPDATE SET google_media_id=excluded.google_media_id,product_url=excluded.product_url,filename=excluded.filename,mime_type=excluded.mime_type`).bind(roomId,localId,media.id,media.productUrl||'',filename,mime).run();
  return json({ok:true,mediaItemId:media.id,productUrl:media.productUrl||null,filename,mimeType:mime},201,origin);
}

async function photoBytesResponse(env,roomId,origin,localId){
  await ensureTables(env);localId=safeLocalId(localId);
  const row=await env.DB.prepare('SELECT google_media_id,filename,mime_type FROM google_photo_items WHERE room_id=? AND local_id=?').bind(roomId,localId).first();
  if(!row)return json({ok:false,error:'media_not_found'},404,origin);
  const access=await tokenForRoom(env,roomId);
  const media=await googleJson('https://photoslibrary.googleapis.com/v1/mediaItems/'+encodeURIComponent(row.google_media_id),access);
  if(!media?.baseUrl)return json({ok:false,error:'media_not_ready'},409,origin);
  const isVideo=String(media.mimeType||row.mime_type||'').startsWith('video/');
  const r=await fetch(media.baseUrl+(isVideo?'=dv':'=d'));
  if(!r.ok)return json({ok:false,error:'media_download_failed'},502,origin);
  const h=headers(origin,r.headers.get('Content-Type')||media.mimeType||row.mime_type||'application/octet-stream');
  h['Content-Disposition']=`inline; filename="${safeName(row.filename||media.filename||'travel-media')}"`;
  return new Response(r.body,{status:200,headers:h});
}

async function ensureDriveFolder(env,roomId,access){
  const row=await env.DB.prepare('SELECT folder_id FROM google_drive_folders WHERE room_id=?').bind(roomId).first();
  if(row?.folder_id)return row.folder_id;
  const data=await googleJson('https://www.googleapis.com/drive/v3/files?fields=id,name',access,{method:'POST',body:{name:'Our Travel Hub Documents',mimeType:'application/vnd.google-apps.folder'}});
  if(!data?.id)throw Object.assign(new Error('drive_folder_create_failed'),{status:502});
  await env.DB.prepare(`INSERT INTO google_drive_folders(room_id,folder_id,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(room_id) DO UPDATE SET folder_id=excluded.folder_id,updated_at=CURRENT_TIMESTAMP`).bind(roomId,data.id).run();
  return data.id;
}

async function uploadDrivePdf(req,env,roomId,origin,url){
  await ensureTables(env);
  const localId=safeLocalId(url.searchParams.get('localId'));const filename=safeName(url.searchParams.get('filename'),'booking.pdf');
  const trip=String(url.searchParams.get('trip')||'').slice(0,40),category=String(url.searchParams.get('category')||'booking').slice(0,40);
  if(!localId)return json({ok:false,error:'local_id_required'},400,origin);
  const existing=await env.DB.prepare('SELECT google_file_id,name,web_view_link,size_bytes FROM google_drive_items WHERE room_id=? AND local_id=?').bind(roomId,localId).first();
  if(existing)return json({ok:true,existing:true,fileId:existing.google_file_id,name:existing.name,webViewLink:existing.web_view_link||null,size:Number(existing.size_bytes)||0},200,origin);
  const mime=(req.headers.get('Content-Type')||'').split(';')[0].trim();if(mime!=='application/pdf')return json({ok:false,error:'pdf_only'},415,origin);
  const len=Number(req.headers.get('Content-Length')||0);if(len>30000000)return json({ok:false,error:'pdf_too_large'},413,origin);
  const bytes=await req.arrayBuffer();if(bytes.byteLength>30000000)return json({ok:false,error:'pdf_too_large'},413,origin);
  const access=await tokenForRoom(env,roomId),folderId=await ensureDriveFolder(env,roomId,access);
  const boundary='travelhub_'+randomToken(12);const meta=JSON.stringify({name:filename,parents:[folderId],description:`Our Travel Hub${trip?' • '+trip:''}`});
  const body=new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`,
    `--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`,
    bytes,
    `\r\n--${boundary}--\r\n`
  ],{type:`multipart/related; boundary=${boundary}`});
  const r=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,createdTime',{method:'POST',headers:{Authorization:'Bearer '+access,'Content-Type':`multipart/related; boundary=${boundary}`},body});
  let data={};try{data=await r.json()}catch{}
  if(!r.ok||!data.id)throw Object.assign(new Error(data?.error?.message||'drive_upload_failed'),{status:502,data});
  await env.DB.prepare(`INSERT INTO google_drive_items(room_id,local_id,google_file_id,name,mime_type,web_view_link,trip,category,size_bytes) VALUES(?,?,?,?,?,?,?,?,?)`).bind(roomId,localId,data.id,data.name||filename,data.mimeType||'application/pdf',data.webViewLink||'',trip,category,Number(data.size)||bytes.byteLength).run();
  return json({ok:true,fileId:data.id,name:data.name||filename,webViewLink:data.webViewLink||null,size:Number(data.size)||bytes.byteLength},201,origin);
}

async function driveFileResponse(env,roomId,origin,localId){
  await ensureTables(env);localId=safeLocalId(localId);
  const row=await env.DB.prepare('SELECT google_file_id,name,mime_type FROM google_drive_items WHERE room_id=? AND local_id=?').bind(roomId,localId).first();
  if(!row)return json({ok:false,error:'document_not_found'},404,origin);
  const access=await tokenForRoom(env,roomId);
  const r=await fetch('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(row.google_file_id)+'?alt=media',{headers:{Authorization:'Bearer '+access}});
  if(!r.ok)return json({ok:false,error:'drive_download_failed'},502,origin);
  const h=headers(origin,r.headers.get('Content-Type')||row.mime_type||'application/pdf');
  h['Content-Disposition']=`inline; filename="${safeName(row.name||'booking.pdf')}"`;
  return new Response(r.body,{status:200,headers:h});
}

export async function handleGooglePublic(req,env,url,origin){
  if(url.pathname!=='/api/google/callback')return null;
  if(req.method!=='GET')return json({ok:false,error:'method_not_allowed'},405,origin);
  if(!configured(env))return new Response('Google backup is not configured.',{status:503});
  await ensureTables(env);
  const code=url.searchParams.get('code')||'',state=url.searchParams.get('state')||'',err=url.searchParams.get('error')||'';
  if(err)return Response.redirect(APP_RETURN+'&error='+encodeURIComponent(err),302);
  if(!code||!state)return new Response('Missing OAuth code/state.',{status:400});
  const stateHash=await digest(state);
  const row=await env.DB.prepare("SELECT room_id FROM google_oauth_states WHERE state_hash=? AND expires_at>datetime('now')").bind(stateHash).first();
  if(!row)return new Response('OAuth state expired or invalid.',{status:400});
  await env.DB.prepare('DELETE FROM google_oauth_states WHERE state_hash=?').bind(stateHash).run();
  const body=new URLSearchParams({code,client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,redirect_uri:REDIRECT_URI,grant_type:'authorization_code'});
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  const data=await r.json();
  if(!r.ok||!data.refresh_token)return new Response('Google OAuth token exchange failed. Reconnect and allow offline access.',{status:502});
  const sealed=await seal(data.refresh_token,env);
  await env.DB.prepare(`INSERT INTO google_photo_auth(room_id,refresh_token_enc,scopes,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(room_id) DO UPDATE SET refresh_token_enc=excluded.refresh_token_enc,scopes=excluded.scopes,updated_at=CURRENT_TIMESTAMP`).bind(row.room_id,sealed,data.scope||SCOPES.join(' ')).run();
  return Response.redirect(APP_RETURN,302);
}

export async function handleGoogleMedia(req,env,url,origin,roomId){
  const m=url.pathname.match(/^\/api\/media\/([A-Za-z0-9._:-]{1,180})$/);if(!m)return null;
  const localId=m[1];
  if(req.method==='PUT'){
    const mime=(req.headers.get('Content-Type')||'image/jpeg').split(';')[0];const ext=mime==='image/png'?'.png':mime==='image/webp'?'.webp':mime.startsWith('video/')?'.mp4':'.jpg';
    return uploadPhotoRequest(req,env,roomId,origin,{localId,filename:localId+ext});
  }
  if(req.method==='GET')return photoBytesResponse(env,roomId,origin,localId);
  return json({ok:false,error:'method_not_allowed'},405,origin);
}

export async function handleGoogleAuthed(req,env,url,origin,roomId){
  if(!url.pathname.startsWith('/api/google/'))return null;
  if(origin!==ALLOWED_ORIGIN)return json({ok:false,error:'forbidden_origin'},403,origin);
  await ensureTables(env);

  if(url.pathname==='/api/google/status'&&req.method==='GET'){
    const auth=await env.DB.prepare('SELECT updated_at,scopes FROM google_photo_auth WHERE room_id=?').bind(roomId).first();
    const photos=await env.DB.prepare('SELECT COUNT(*) AS n FROM google_photo_items WHERE room_id=?').bind(roomId).first();
    const docs=await env.DB.prepare('SELECT COUNT(*) AS n FROM google_drive_items WHERE room_id=?').bind(roomId).first();
    const scopes=String(auth?.scopes||'');
    return json({ok:true,configured:configured(env),connected:Boolean(auth),backupCount:Number(photos?.n)||0,documentCount:Number(docs?.n)||0,driveScope:Boolean(auth&&scopes.includes(DRIVE_SCOPE)),updatedAt:auth?.updated_at||null},200,origin);
  }

  if(url.pathname==='/api/google/connect'&&req.method==='POST'){
    if(!configured(env))return json({ok:false,error:'google_not_configured'},503,origin);
    const state=randomToken(32),stateHash=await digest(state);
    await env.DB.prepare("DELETE FROM google_oauth_states WHERE expires_at<=datetime('now')").run();
    await env.DB.prepare("INSERT INTO google_oauth_states(state_hash,room_id,expires_at) VALUES(?,?,datetime('now','+10 minutes'))").bind(stateHash,roomId).run();
    const q=new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,redirect_uri:REDIRECT_URI,response_type:'code',scope:SCOPES.join(' '),access_type:'offline',include_granted_scopes:'true',prompt:'consent',state});
    return json({ok:true,authUrl:'https://accounts.google.com/o/oauth2/v2/auth?'+q.toString(),redirectUri:REDIRECT_URI},200,origin);
  }

  if(url.pathname==='/api/google/items'&&req.method==='GET'){
    const rows=await env.DB.prepare('SELECT local_id,google_media_id,product_url,filename,mime_type,created_at FROM google_photo_items WHERE room_id=? ORDER BY created_at DESC LIMIT 1000').bind(roomId).all();
    return json({ok:true,items:rows.results||[]},200,origin);
  }

  if(url.pathname==='/api/google/upload'&&req.method==='POST'){
    return uploadPhotoRequest(req,env,roomId,origin,{localId:url.searchParams.get('localId'),filename:url.searchParams.get('filename')||'travel-photo',description:url.searchParams.get('description')||''});
  }

  if(url.pathname==='/api/google/drive/items'&&req.method==='GET'){
    const rows=await env.DB.prepare('SELECT local_id,google_file_id,name,mime_type,web_view_link,trip,category,size_bytes,created_at FROM google_drive_items WHERE room_id=? ORDER BY created_at DESC LIMIT 500').bind(roomId).all();
    return json({ok:true,items:rows.results||[]},200,origin);
  }
  if(url.pathname==='/api/google/drive/upload'&&req.method==='POST')return uploadDrivePdf(req,env,roomId,origin,url);
  const df=url.pathname.match(/^\/api\/google\/drive\/file\/([A-Za-z0-9._:-]{1,180})$/);if(df&&req.method==='GET')return driveFileResponse(env,roomId,origin,df[1]);
  const dd=url.pathname.match(/^\/api\/google\/drive\/item\/([A-Za-z0-9._:-]{1,180})$/);if(dd&&req.method==='DELETE'){
    const row=await env.DB.prepare('SELECT google_file_id FROM google_drive_items WHERE room_id=? AND local_id=?').bind(roomId,dd[1]).first();
    if(row){const access=await tokenForRoom(env,roomId);await fetch('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(row.google_file_id),{method:'DELETE',headers:{Authorization:'Bearer '+access}}).catch(()=>{});await env.DB.prepare('DELETE FROM google_drive_items WHERE room_id=? AND local_id=?').bind(roomId,dd[1]).run()}
    return json({ok:true},200,origin);
  }

  if(url.pathname==='/api/google/picker/session'&&req.method==='POST'){
    const access=await tokenForRoom(env,roomId);const data=await googleJson('https://photospicker.googleapis.com/v1/sessions',access,{method:'POST',body:{}});return json({ok:true,...data},200,origin);
  }
  const sm=url.pathname.match(/^\/api\/google\/picker\/session\/([^/]+)$/);if(sm&&req.method==='GET'){
    const access=await tokenForRoom(env,roomId);const data=await googleJson('https://photospicker.googleapis.com/v1/sessions/'+encodeURIComponent(sm[1]),access);return json({ok:true,...data},200,origin);
  }
  if(url.pathname==='/api/google/picker/items'&&req.method==='GET'){
    const sessionId=url.searchParams.get('sessionId')||'';if(!sessionId)return json({ok:false,error:'session_id_required'},400,origin);const access=await tokenForRoom(env,roomId);const data=await googleJson('https://photospicker.googleapis.com/v1/mediaItems?sessionId='+encodeURIComponent(sessionId)+'&pageSize=100',access);return json({ok:true,...data},200,origin);
  }

  if(url.pathname==='/api/google/disconnect'&&req.method==='DELETE'){
    const row=await env.DB.prepare('SELECT refresh_token_enc FROM google_photo_auth WHERE room_id=?').bind(roomId).first();
    if(row){try{const token=await unseal(row.refresh_token_enc,env);await fetch('https://oauth2.googleapis.com/revoke?token='+encodeURIComponent(token),{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'}})}catch{}}
    await env.DB.prepare('DELETE FROM google_photo_auth WHERE room_id=?').bind(roomId).run();
    return json({ok:true},200,origin);
  }
  return json({ok:false,error:'not_found'},404,origin);
}
