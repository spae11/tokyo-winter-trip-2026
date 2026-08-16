from pathlib import Path
import re


def read(p):
    return Path(p).read_text(encoding='utf-8')


def write(p, s):
    Path(p).write_text(s, encoding='utf-8')


def must_replace(s, old, new, label, count=-1):
    if old not in s:
        raise SystemExit(f'MISSING {label}: {old[:160]}')
    return s.replace(old, new, count)


# 1) Root dashboard: Country -> Trip. Only show the second picker for countries with >1 trip.
p = 'plan-first-v1.js'
s = read(p)
for old, new in [
    ("tokyo:{key:'tokyo',name:", "tokyo:{key:'tokyo',country:'japan',name:"),
    ("hongkong:{key:'hongkong',name:", "hongkong:{key:'hongkong',country:'hongkong',name:"),
    ("danang:{key:'danang',name:", "danang:{key:'danang',country:'vietnam',name:"),
    ("yunnan:{key:'yunnan',name:", "yunnan:{key:'yunnan',country:'china',name:"),
    ("chongqing:{key:'chongqing',name:", "chongqing:{key:'chongqing',country:'china',name:"),
]:
    if new not in s:
        s = must_replace(s, old, new, 'trip country meta', 1)

if 'const COUNTRY_ORDER=' not in s:
    marker = "function fmtTime(ts)"
    helper = "const COUNTRY_ORDER=['japan','hongkong','vietnam','china'];\nconst COUNTRY_META={japan:{name:'Japan',label:'🇯🇵 ญี่ปุ่น'},hongkong:{name:'Hong Kong',label:'🇭🇰 ฮ่องกง'},vietnam:{name:'Vietnam',label:'🇻🇳 เวียดนาม'},china:{name:'China',label:'🇨🇳 จีน'}};\nconst tripsByCountry=c=>Object.values(TRIPS).filter(x=>x.country===c);\n"
    s = must_replace(s, marker, helper + marker, 'dashboard country helpers', 1)

old_picker = '<label class="pfx-trip-combo"><span>เลือกทริป</span><select data-pfx-trip-select>${Object.values(TRIPS).map(x=>`<option value="${x.key}" ${x.key===key?\'selected\':\'\'}>${x.flag} ${esc(x.accent)}</option>`).join(\'\')}</select></label>'
new_picker = '<div class="pfx-country-trip-picker"><label class="pfx-trip-combo"><span>ประเทศ</span><select data-pfx-country-select>${COUNTRY_ORDER.map(c=>`<option value="${c}" ${t.country===c?\'selected\':\'\'}>${COUNTRY_META[c].label}</option>`).join(\'\')}</select></label><label class="pfx-trip-combo ${tripsByCountry(t.country).length>1?\'\':\'pfx-trip-combo-one\'}"><span>เมือง / ทริป</span><select data-pfx-trip-select>${tripsByCountry(t.country).map(x=>`<option value="${x.key}" ${x.key===key?\'selected\':\'\'}>${x.flag} ${esc(x.accent)}</option>`).join(\'\')}</select></label></div>'
if new_picker not in s:
    s = must_replace(s, old_picker, new_picker, 'dashboard picker', 1)

old_wire = "const tripSelect=$('[data-pfx-trip-select]',d);if(tripSelect)tripSelect.onchange=()=>paint(tripSelect.value);"
new_wire = "const countrySelect=$('[data-pfx-country-select]',d),tripSelect=$('[data-pfx-trip-select]',d);if(countrySelect)countrySelect.onchange=()=>{const next=tripsByCountry(countrySelect.value)[0];if(next)paint(next.key)};if(tripSelect)tripSelect.onchange=()=>paint(tripSelect.value);"
if new_wire not in s:
    s = must_replace(s, old_wire, new_wire, 'dashboard picker wiring', 1)
write(p, s)

# 2) Trip Tools: Country -> Trip everywhere the current trip picker appears.
p = 'trip-tools-v1.js'
s = read(p)
if 'const TT_COUNTRY_META=' not in s:
    marker = 'function defaults()'
    helper = "const TT_COUNTRY_META={japan:{label:'🇯🇵 ญี่ปุ่น'},hongkong:{label:'🇭🇰 ฮ่องกง'},vietnam:{label:'🇻🇳 เวียดนาม'},china:{label:'🇨🇳 จีน'}};\nconst TT_COUNTRY_ORDER=['japan','hongkong','vietnam','china'];\nconst TT_TRIP_COUNTRY={tokyo:'japan',hongkong:'hongkong',danang:'vietnam',yunnan:'china',chongqing:'china'};\nconst ttTripsByCountry=c=>Object.keys(DATA).filter(k=>TT_TRIP_COUNTRY[k]===c);\nconst ttCountryForTrip=k=>TT_TRIP_COUNTRY[k]||'japan';\nconst ttTripLabel=k=>k==='tokyo'?'Tokyo':k==='hongkong'?'Hong Kong':k==='danang'?'Da Nang':k==='yunnan'?'Yunnan':'Chongqing';\n"
    s = must_replace(s, marker, helper + marker, 'trip tools country helpers', 1)
old_picker_fn = "function tripPicker(){const opts=[['tokyo','🇯🇵 Tokyo'],['hongkong','🇭🇰 Hong Kong'],['danang','🇻🇳 Da Nang'],['yunnan','🇨🇳 Yunnan'],['chongqing','🇨🇳 Chongqing']];return`<label class=\"tt-trip-combo\"><span>ทริป</span><select class=\"tt-trip-select\" data-pick-select>${opts.map(([k,n])=>`<option value=\"${k}\" ${state.selected===k?'selected':''}>${n}</option>`).join('')}</select></label>`}\nfunction wireTripPicker(root,rerender){const sel=$('[data-pick-select]',root);if(sel)sel.onchange=()=>{state.selected=sel.value;save();rerender();updateHeader()}}"
new_picker_fn = "function tripPicker(){const country=ttCountryForTrip(state.selected),trips=ttTripsByCountry(country);return`<div class=\"tt-country-trip-picker\"><label class=\"tt-trip-combo\"><span>ประเทศ</span><select class=\"tt-trip-select\" data-pick-country>${TT_COUNTRY_ORDER.map(c=>`<option value=\"${c}\" ${country===c?'selected':''}>${TT_COUNTRY_META[c].label}</option>`).join('')}</select></label><label class=\"tt-trip-combo ${trips.length>1?'':'tt-trip-combo-one'}\"><span>เมือง / ทริป</span><select class=\"tt-trip-select\" data-pick-select>${trips.map(k=>`<option value=\"${k}\" ${state.selected===k?'selected':''}>${DATA[k].emoji} ${ttTripLabel(k)}</option>`).join('')}</select></label></div>`}\nfunction wireTripPicker(root,rerender){const countrySel=$('[data-pick-country]',root),sel=$('[data-pick-select]',root);if(countrySel)countrySel.onchange=()=>{const next=ttTripsByCountry(countrySel.value)[0];if(!next)return;state.selected=next;save();rerender();updateHeader()};if(sel)sel.onchange=()=>{state.selected=sel.value;save();rerender();updateHeader()}}"
if new_picker_fn not in s:
    s = must_replace(s, old_picker_fn, new_picker_fn, 'trip tools picker', 1)
write(p, s)

# 3) Memories: Country first. For China, second picker contains "all China", Yunnan and Chongqing.
p = 'memory-journal-v3.js'
s = read(p)
old_selected = "function cloudInfo(){const c=parseJSON(CLOUD_KEY,{});return{paired:!!c.token,lastSync:Number(c.lastSync)||0}}function memoryCount(a){return a.length}function photoCount(a){return a.reduce((n,m)=>n+(m.photoIds?.length||0),0)}function selectedMemories(a,trip){return trip==='all'?a:a.filter(m=>m.trip===trip)}"
new_selected = "const MJ_COUNTRY_META={japan:{label:'🇯🇵 ญี่ปุ่น',title:'Japan'},hongkong:{label:'🇭🇰 ฮ่องกง',title:'Hong Kong'},vietnam:{label:'🇻🇳 เวียดนาม',title:'Vietnam'},china:{label:'🇨🇳 จีน',title:'China'}};const MJ_COUNTRY_ORDER=['japan','hongkong','vietnam','china'];const mjTripsByCountry=c=>Object.keys(PLAN).filter(k=>PLAN[k]?.country===c);const mjCountryForTrip=t=>t==='all'?'all':t.startsWith('country:')?t.slice(8):(PLAN[t]?.country||'all');\nfunction cloudInfo(){const c=parseJSON(CLOUD_KEY,{});return{paired:!!c.token,lastSync:Number(c.lastSync)||0}}function memoryCount(a){return a.length}function photoCount(a){return a.reduce((n,m)=>n+(m.photoIds?.length||0),0)}function selectedMemories(a,trip){if(trip==='all')return a;if(trip.startsWith('country:')){const c=trip.slice(8);return a.filter(m=>PLAN[m.trip]?.country===c)}return a.filter(m=>m.trip===trip)}"
if new_selected not in s:
    s = must_replace(s, old_selected, new_selected, 'memory country helpers', 1)

old_html = '<div class="mj-toolbar"><label class="mj-trip-combo"><span>ทริป</span><select id="mjTripSelect"><option value="all">🌎 ทั้งหมด</option><option value="tokyo">🇯🇵 Tokyo</option><option value="hongkong">🇭🇰 Hong Kong</option><option value="danang">🇻🇳 Da Nang</option><option value="yunnan">🇨🇳 Yunnan</option><option value="chongqing">🇨🇳 Chongqing</option></select></label><button class="mj-cloud" id="mjCloud">☁️ Cloud</button></div>'
new_html = '<div class="mj-toolbar"><div class="mj-country-trip-picker"><label class="mj-trip-combo"><span>ประเทศ</span><select id="mjCountrySelect"><option value="all">🌎 ทุกประเทศ</option><option value="japan">🇯🇵 ญี่ปุ่น</option><option value="hongkong">🇭🇰 ฮ่องกง</option><option value="vietnam">🇻🇳 เวียดนาม</option><option value="china">🇨🇳 จีน</option></select></label><label class="mj-trip-combo" id="mjSubTripWrap"><span>เมือง / ทริป</span><select id="mjTripSelect"></select></label></div><button class="mj-cloud" id="mjCloud">☁️ Cloud</button></div>'
if new_html not in s:
    s = must_replace(s, old_html, new_html, 'memory picker html', 1)

old_listener = "$('#mjTripSelect',hub)?.addEventListener('change',e=>{activeTrip=e.target.value;const p=prefs();p.lastTrip=activeTrip;savePrefs(p);renderAll()});$('#mjCloud')?.addEventListener('click',openSyncPanel);ensureDetail();return hub}\nfunction paintTabs(){const sel=$('#mjTripSelect');if(sel)sel.value=activeTrip;$$('[data-mj-trip]').forEach(b=>b.classList.toggle('on',b.dataset.mjTrip===activeTrip));"
new_listener = "$('#mjCountrySelect',hub)?.addEventListener('change',e=>{const country=e.target.value;if(country==='all')activeTrip='all';else{const trips=mjTripsByCountry(country);activeTrip=trips.length>1?'country:'+country:(trips[0]||'all')}const p=prefs();p.lastTrip=activeTrip;savePrefs(p);renderAll()});$('#mjTripSelect',hub)?.addEventListener('change',e=>{activeTrip=e.target.value;const p=prefs();p.lastTrip=activeTrip;savePrefs(p);renderAll()});$('#mjCloud')?.addEventListener('click',openSyncPanel);ensureDetail();return hub}\nfunction paintMemoryPicker(){const csel=$('#mjCountrySelect'),tsel=$('#mjTripSelect'),wrap=$('#mjSubTripWrap');if(!csel||!tsel||!wrap)return;const country=mjCountryForTrip(activeTrip);csel.value=country;if(country==='all'){wrap.hidden=true;tsel.innerHTML='';return}const trips=mjTripsByCountry(country);if(trips.length<=1){wrap.hidden=true;tsel.innerHTML='';return}wrap.hidden=false;tsel.innerHTML=`<option value=\"country:${country}\">${MJ_COUNTRY_META[country].label} ทั้งหมด</option>`+trips.map(k=>`<option value=\"${k}\">${PLAN[k].flag} ${esc(k==='yunnan'?'Yunnan • Kunming + Dali':k==='chongqing'?'Chongqing + Wulong':PLAN[k].name)}</option>`).join('');tsel.value=activeTrip.startsWith('country:')?'country:'+country:activeTrip}\nfunction paintTabs(){paintMemoryPicker();$$('[data-mj-trip]').forEach(b=>b.classList.toggle('on',b.dataset.mjTrip===activeTrip));"
if new_listener not in s:
    s = must_replace(s, old_listener, new_listener, 'memory picker wiring', 1)

old_hero = "if(PLAN[trip]){title=PLAN[trip].name;flag=PLAN[trip].flag;cover=tripCoverRef(trip,a,p)}else{for(const k of ['tokyo','hongkong','danang','yunnan','chongqing']){cover=tripCoverRef(k,a,p);if(cover)break}}"
new_hero = "if(PLAN[trip]){title=PLAN[trip].name;flag=PLAN[trip].flag;cover=tripCoverRef(trip,a,p)}else if(trip.startsWith('country:')){const c=trip.slice(8),meta=MJ_COUNTRY_META[c];title=(meta?.title||'Country')+' Memories';flag=(meta?.label||'🌎').split(' ')[0];for(const k of mjTripsByCountry(c)){cover=tripCoverRef(k,a,p);if(cover)break}}else{for(const k of ['tokyo','hongkong','danang','yunnan','chongqing']){cover=tripCoverRef(k,a,p);if(cover)break}}"
if new_hero not in s:
    s = must_replace(s, old_hero, new_hero, 'memory country hero', 1)

old_open = "location.assign(`./${trip==='tokyo'?'tokyo':trip==='hongkong'?'hongkong':trip==='danang'?'danang':'yunnan'}/#memory-day-${Number(day)||1}`)"
new_open = "location.assign(`./${trip}/#memory-day-${Number(day)||1}`)"
if new_open not in s:
    s = must_replace(s, old_open, new_open, 'memory plan routing', 1)
write(p, s)

# 4) Picker layout CSS.
p = 'plan-first-v1.css'
s = read(p)
if 'country-first picker v73' not in s:
    s += "\n/* country-first picker v73 */\n.pfx-country-trip-picker{align-self:start;display:grid;grid-template-columns:minmax(190px,1fr) minmax(210px,1fr);gap:7px;min-width:min(440px,46vw)}.pfx-country-trip-picker .pfx-trip-combo{min-width:0}.pfx-trip-combo-one{display:none!important}@media(max-width:760px){.pfx-country-trip-picker{width:100%;min-width:0;grid-template-columns:1fr}.pfx-country-trip-picker .pfx-trip-combo{width:100%}}\n"
write(p, s)

p = 'trip-tools-v1.css'
s = read(p)
if 'country-first picker v73' not in s:
    s += "\n/* country-first picker v73 */\n.tt-country-trip-picker{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:11px}.tt-country-trip-picker .tt-trip-combo{margin-bottom:0}.tt-trip-combo-one{display:none!important}@media(max-width:520px){.tt-country-trip-picker{grid-template-columns:1fr}}\n"
write(p, s)

p = 'memory-journal-v3.css'
s = read(p)
if 'country-first picker v73' not in s:
    s += "\n/* country-first picker v73 */\n.mj-country-trip-picker{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;flex:1 1 560px;max-width:650px}.mj-country-trip-picker .mj-trip-combo{min-width:0;width:100%}.mj-country-trip-picker [hidden]{display:none!important}@media(max-width:560px){.mj-country-trip-picker{grid-template-columns:1fr;flex-basis:100%;max-width:none}}\n"
write(p, s)

# 5) PWA generation v73 so installed phones receive the hierarchy change.
p = 'sw.js'
s = read(p)
s = s.replace("const CACHE='our-journey-v72';", "const CACHE='our-journey-v73';")
s = s.replace('?v=72', '?v=73')
write(p, s)

p = 'index.html'
s = read(p)
s = s.replace('manifest.webmanifest?v=72', 'manifest.webmanifest?v=73')
s = s.replace('ourJourneySWReloadV72', 'ourJourneySWReloadV73').replace('./sw.js?v=72', './sw.js?v=73')
write(p, s)

p = 'manifest.webmanifest'
s = read(p)
s = s.replace('/?pwa=24&app=72', '/?pwa=25&app=73')
write(p, s)
