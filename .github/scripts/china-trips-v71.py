from pathlib import Path


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8')
    print('UPDATED', path)


def must(text, old, new, label, count=-1):
    if old not in text:
        raise SystemExit(f'MISSING {label}: {old[:120]}')
    return text.replace(old, new, count)


def soft(text, old, new, count=-1):
    return text.replace(old, new, count) if old in text else text


# 1) Yunnan: balance navigation/actions and add one image per itinerary day.
p='yunnan/index.html'; s=read(p)
s=must(s,
".navin{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:900}.brand{display:flex;align-items:center;gap:8px}.back{border:1px solid #0001;background:#fff;border-radius:999px;padding:9px 13px;text-decoration:none;color:inherit}.btn{border:0;border-radius:999px;background:var(--red);color:#fff;padding:10px 14px;text-decoration:none;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:6px}",
".navin{min-height:68px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;font-weight:900}.brand{min-width:0;display:grid;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:9px}.brand>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.back{width:44px;height:44px;border:1px solid #00000012;background:#fff;border-radius:50%;display:grid;place-items:center;text-decoration:none;color:inherit;font-size:20px;box-shadow:0 4px 14px #0000000a}.btn{border:0;border-radius:999px;background:var(--red);color:#fff;min-height:44px;padding:0 16px;text-decoration:none;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:6px}.nav .btn{min-width:94px;white-space:nowrap;box-shadow:0 5px 16px #b21f2d22}", 'yunnan nav')
s=must(s,
".maps{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.map{display:inline-flex;padding:7px 10px;border-radius:999px;background:var(--dark);color:#fff;font-weight:900;text-decoration:none;font-size:.8rem}.map.soft{background:var(--cream);color:var(--red)}",
".maps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:11px;max-width:390px}.map{min-width:0;min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border-radius:13px;background:var(--dark);color:#fff;font-weight:900;text-decoration:none;font-size:.79rem;border:1px solid var(--dark);text-align:center}.map.soft{background:#fff;color:var(--dark);border-color:#00000018}.map:active{transform:scale(.98)}", 'yunnan maps')
s=must(s, ".day{margin-bottom:14px}.daybtn", ".day{margin-bottom:14px}.dayhero{width:100%;height:190px;display:block;object-fit:cover;background:#e9e6df}.daybtn", 'yunnan day hero css')
s=must(s,
"@media(max-width:760px){.grid{grid-template-columns:1fr}.budgetgrid{grid-template-columns:1fr 1fr}.hero{min-height:50vh}}@media(max-width:480px){.budgetgrid{grid-template-columns:1fr}}",
"@media(max-width:760px){.grid{grid-template-columns:1fr}.budgetgrid{grid-template-columns:1fr 1fr}.hero{min-height:50vh}.navin{gap:8px}.brand>span{font-size:.88rem}.nav .btn{min-width:88px;padding:0 13px}.maps{max-width:none}.dayhero{height:168px}}@media(max-width:480px){.budgetgrid{grid-template-columns:1fr}.brand>span{font-size:.82rem}.map{font-size:.75rem;min-height:40px}}", 'yunnan responsive')
s=must(s, '<a class="back" href="../">← 🌎</a>', '<a class="back" href="../" aria-label="กลับหน้า Trips">←</a>', 'yunnan back')
s=s.replace('>Google สำรอง</a>', '>Google Maps</a>')
if 'const dayImages=' not in s:
    imgs='["https://www.jigsky.com/wp-content/uploads/2025/01/Kunming-Old-Street-.png","https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=1400&q=82","https://dulichviet.com.vn/images/bandidau/pho-co-dai-ly-trung-quoc.jpg","https://gd-hbimg.huaban.com/a6c40b56294dac8ad6fde14cfbe54bb7135cf61deace4-EYaFm7_fw658","https://www.kunming.cn/en/upload/resources/image/2026/02/27/2055777_2048x2048.png","https://www.kunming.cn/en/upload/resources/image/2026/01/15/2033543_600x400.jpg"]'
    s=must(s, "const box=document.getElementById('daysbox');", 'const dayImages='+imgs+";\nconst box=document.getElementById('daysbox');", 'yunnan images array')
s=must(s, 'el.innerHTML=`<button class="daybtn">', 'el.innerHTML=`<img class="dayhero" src="${dayImages[i]}" alt="${d[0]}" loading="lazy"><button class="daybtn">', 'yunnan image markup')
write(p,s)

# 2) Trip Tools: scalable combo + Chongqing data + Amap routing for mainland China.
p='trip-tools-v1.js'; s=read(p)
if 'DATA.chongqing=' not in s:
    block="""
DATA.chongqing={name:'Chongqing + Wulong 6D5N',emoji:'🇨🇳',city:'Chongqing / Wulong',country:'China',tz:'Asia/Shanghai',currency:'CNY',budget:50000,start:'',center:[29.563,106.551],zoom:9,
 days:[
  {title:'Arrival • Jiefangbei • Hongya Cave',items:[['หลังถึง CKG','Chongqing Jiangbei International Airport','重庆江北国际机场'],['15:30','Jiefangbei','解放碑步行街'],['18:30','Hongya Cave','洪崖洞'],['20:30','Muslim dinner','重庆清真餐厅']]},
  {title:'Liziba • Eling • Raffles City',items:[['09:00','Liziba Station','李子坝站'],['11:00','Eling / Testbed 2','鹅岭二厂'],['15:00','Chaotianmen / Raffles City','重庆来福士'],['19:00','Jiefangbei','解放碑步行街']]},
  {title:'Ciqikou • Cableway • Longmenhao',items:[['09:30','Ciqikou Ancient Town','磁器口古镇'],['14:30','Yangtze River Cableway','长江索道'],['16:00','Longmenhao Old Street','龙门浩老街'],['19:00','Nanbin Road','南滨路']]},
  {title:'Wulong • Three Natural Bridges',items:[['06:30','ออกจาก Chongqing','重庆市'],['10:00','Three Natural Bridges','武隆天生三桥'],['15:00','Fairy Mountain','仙女山国家森林公园'],['19:30','กลับ Chongqing','重庆市']]},
  {title:'Dazu Rock Carvings',items:[['07:30','ออกจาก Chongqing','重庆市'],['10:00','Dazu Rock Carvings','大足石刻宝顶山景区'],['15:30','กลับ Chongqing','重庆市'],['19:30','Hongya / Jiefangbei','洪崖洞']]},
  {title:'Souvenir • Airport',items:[['09:00','Jiefangbei / Souvenir','解放碑步行街'],['11:00','Muslim lunch','重庆清真餐厅'],['ก่อนบิน 3 ชม.','Chongqing Jiangbei Airport','重庆江北国际机场']]}
 ],
 places:[['🌃','Hongya Cave',29.5637,106.579,'sight'],['🏙️','Jiefangbei',29.557,106.577,'sight'],['🚝','Liziba Station',29.5528,106.548,'sight'],['🏮','Ciqikou Ancient Town',29.579,106.449,'sight'],['🚡','Yangtze River Cableway',29.556,106.583,'sight'],['🏞️','Three Natural Bridges',29.425,107.79,'sight'],['🌲','Fairy Mountain',29.49,107.72,'sight'],['🗿','Dazu Rock Carvings',29.75,105.80,'sight'],['✈️','Chongqing Jiangbei Airport',29.719,106.641,'station']],
 muslim:[['🕌 Chongqing Muslim search','重庆清真寺','ใช้ Amap ค้นมัสยิด'],['🍜 Halal near Jiefangbei','解放碑 清真餐厅','ค้น 清真 ใกล้ที่พัก'],['🍽️ Wulong halal search','武隆 清真餐厅','เช็กก่อนออก Day Trip']]
};
"""
    s=must(s, 'function defaults(){', block+'function defaults(){', 'trip tools data')
old="function tripPicker(){return`<div class=\"tt-trip-pick\"><button data-pick=\"tokyo\" class=\"${state.selected==='tokyo'?'on':''}\">🇯🇵 Tokyo</button><button data-pick=\"hongkong\" class=\"${state.selected==='hongkong'?'on':''}\">🇭🇰 Hong Kong</button><button data-pick=\"danang\" class=\"${state.selected==='danang'?'on':''}\">🇻🇳 Da Nang</button><button data-pick=\"yunnan\" class=\"${state.selected==='yunnan'?'on':''}\">🇨🇳 Yunnan</button></div>`}\nfunction wireTripPicker(root,rerender){$$('[data-pick]',root).forEach(b=>b.onclick=()=>{state.selected=b.dataset.pick;save();rerender();updateHeader()})}"
new="function tripPicker(){const opts=[['tokyo','🇯🇵 Tokyo'],['hongkong','🇭🇰 Hong Kong'],['danang','🇻🇳 Da Nang'],['yunnan','🇨🇳 Yunnan'],['chongqing','🇨🇳 Chongqing']];return`<label class=\"tt-trip-combo\"><span>ทริป</span><select class=\"tt-trip-select\" data-pick-select>${opts.map(([k,n])=>`<option value=\"${k}\" ${state.selected===k?'selected':''}>${n}</option>`).join('')}</select></label>`}\nfunction wireTripPicker(root,rerender){const sel=$('[data-pick-select]',root);if(sel)sel.onchange=()=>{state.selected=sel.value;save();rerender();updateHeader()}}"
s=must(s,old,new,'trip tools picker')
s=s.replace("selected:location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':'tokyo'", "selected:location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':location.pathname.includes('/chongqing/')?'chongqing':'tokyo'")
s=s.replace("dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:''}","dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:'',chongqing:''}")
s=s.replace("budgets:{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000}","budgets:{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000,chongqing:50000}")
s=s.replace("done:{tokyo:{},hongkong:{},danang:{},yunnan:{}}","done:{tokyo:{},hongkong:{},danang:{},yunnan:{},chongqing:{}}")
s=s.replace("Object.assign({tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:''}","Object.assign({tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:'',chongqing:''}")
s=s.replace("Object.assign({tokyo:65000,hongkong:55000,danang:45000,yunnan:48000}","Object.assign({tokyo:65000,hongkong:55000,danang:45000,yunnan:48000,chongqing:50000}")
s=s.replace("Object.assign({tokyo:{},hongkong:{},danang:{},yunnan:{}}","Object.assign({tokyo:{},hongkong:{},danang:{},yunnan:{},chongqing:{}}")
s=s.replace("if(state.selected==='yunnan')return'https://uri.amap.com/search?keyword='", "if(['yunnan','chongqing'].includes(state.selected))return'https://uri.amap.com/search?keyword='")
s=s.replace("return state.selected==='yunnan'?'Amap':'Google Maps'", "return ['yunnan','chongqing'].includes(state.selected)?'Amap':'Google Maps'")
s=s.replace("<p class=\"tt-muted\">Hong Kong ยังไม่ได้กำหนดเดือน/ปี จึงให้เลือกวันที่เริ่มเองได้</p>", "<p class=\"tt-muted\">${d.name} ยังไม่ได้กำหนดวันเริ่ม จึงเลือกวันที่ได้ใน Trip Tools</p>")
write(p,s)

p='trip-tools-v1.css'; s=read(p)
if 'scalable trip combo v71' not in s:
    s += "\n/* scalable trip combo v71 */\n.tt-trip-pick{display:none!important}.tt-trip-combo{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:9px;margin-bottom:11px;padding:8px 10px;border:1px solid var(--tt-line);border-radius:16px;background:#fff}.tt-trip-combo>span{font-size:.72rem;font-weight:900;color:var(--tt-muted)}.tt-trip-select{width:100%;min-width:0;border:0;background:var(--tt-cream);color:var(--tt-dark);border-radius:12px;padding:10px 36px 10px 11px;font:900 13px 'Noto Sans Thai',system-ui,sans-serif;outline:none}.tt-trip-select:focus{box-shadow:0 0 0 3px #b21f2d15}\n"
write(p,s)

# 3) Plan-first: fifth trip and root selector becomes combo box.
p='plan-first-v1.js'; s=read(p)
s=must(s,"isYunnan=path.startsWith(BASE+'yunnan/'),isPlan=isTokyo||isHK||isDaNang||isYunnan", "isYunnan=path.startsWith(BASE+'yunnan/'),isChongqing=path.startsWith(BASE+'chongqing/'),isPlan=isTokyo||isHK||isDaNang||isYunnan||isChongqing", 'plan-first isPlan')
s=must(s,"const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':isYunnan?'yunnan':'';", "const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':isYunnan?'yunnan':isChongqing?'chongqing':'';", 'plan-first tripKey')
s=must(s,"yunnan:{key:'yunnan',name:'Yunnan • Kunming + Dali 6D5N',flag:'🇨🇳',href:'./yunnan/',planHref:'../yunnan/',fallbackStart:'',days:6,accent:'Yunnan'}};", "yunnan:{key:'yunnan',name:'Yunnan • Kunming + Dali 6D5N',flag:'🇨🇳',href:'./yunnan/',planHref:'../yunnan/',fallbackStart:'',days:6,accent:'Yunnan'},chongqing:{key:'chongqing',name:'Chongqing + Wulong 6D5N',flag:'🇨🇳',href:'./chongqing/',planHref:'../chongqing/',fallbackStart:'',days:6,accent:'Chongqing'}};", 'plan-first trips')
s=s.replace("a.trip==='yunnan'?'Yunnan':'Trip'", "a.trip==='yunnan'?'Yunnan':a.trip==='chongqing'?'Chongqing':'Trip'")
s=s.replace("x.trip==='danang'?'🇻🇳 Da Nang':'🇨🇳 Yunnan'", "x.trip==='danang'?'🇻🇳 Da Nang':x.trip==='yunnan'?'🇨🇳 Yunnan':'🇨🇳 Chongqing'")
old='<div class="pfx-focus-tabs">${Object.values(TRIPS).map(x=>`<button type="button" class="pfx-focus ${x.key===key?\'on\':\'\'}" data-pfx-focus="${x.key}">${x.flag} ${esc(x.accent)}</button>`).join(\'\')}</div>'
# Literal in file uses nested backticks; easier targeted substring.
needle='<div class="pfx-focus-tabs">${Object.values(TRIPS).map(x=>`<button type="button" class="pfx-focus ${x.key===key?\'on\':\'\'}" data-pfx-focus="${x.key}">${x.flag} ${esc(x.accent)}</button>`).join(\'\')}</div>'
if needle not in s:
    needle='<div class="pfx-focus-tabs">${Object.values(TRIPS).map(x=>`<button type="button" class="pfx-focus ${x.key===key?\'on\':\'\'}" data-pfx-focus="${x.key}">${x.flag} ${esc(x.accent)}</button>`).join(\'\')}</div>'
# fallback exact raw string as observed
raw='''<div class="pfx-focus-tabs">${Object.values(TRIPS).map(x=>`<button type="button" class="pfx-focus ${x.key===key?'on':''}" data-pfx-focus="${x.key}">${x.flag} ${esc(x.accent)}</button>`).join('')}</div>'''
combo='''<label class="pfx-trip-combo"><span>เลือกทริป</span><select data-pfx-trip-select>${Object.values(TRIPS).map(x=>`<option value="${x.key}" ${x.key===key?'selected':''}>${x.flag} ${esc(x.accent)}</option>`).join('')}</select></label>'''
s=must(s,raw,combo,'plan-first root combo')
s=must(s,"$$('[data-pfx-focus]',d).forEach(b=>b.onclick=()=>paint(b.dataset.pfxFocus));", "const tripSelect=$('[data-pfx-trip-select]',d);if(tripSelect)tripSelect.onchange=()=>paint(tripSelect.value);", 'plan-first combo handler')
write(p,s)

p='plan-first-v1.css'; s=read(p)
if 'scalable dashboard trip combo v71' not in s:
    s += "\n/* scalable dashboard trip combo v71 */\n.pfx-focus-tabs{display:none!important}.pfx-trip-combo{align-self:start;display:grid;gap:4px;min-width:210px}.pfx-trip-combo>span{font-size:.62rem;font-weight:900;color:#ffffffa8;letter-spacing:.08em}.pfx-trip-combo select{width:100%;border:1px solid #ffffff2a;border-radius:13px;background:#ffffff16;color:#fff;padding:9px 34px 9px 10px;font:850 .72rem 'Noto Sans Thai',system-ui,sans-serif;outline:none}.pfx-trip-combo select option{color:#1e2428;background:#fff}@media(max-width:760px){.pfx-trip-combo{width:100%;min-width:0}.pfx-trip-combo select{font-size:.76rem}}\n"
write(p,s)

p='plan-first-v2.js'; s=read(p)
s=must(s,"path.startsWith(BASE+'danang/')||path.startsWith(BASE+'yunnan/')", "path.startsWith(BASE+'danang/')||path.startsWith(BASE+'yunnan/')||path.startsWith(BASE+'chongqing/')", 'plan-first-v2 route')
write(p,s)

# 4) Plan-memory links understand Chongqing regions.
p='plan-memory-link-v2.js'; s=read(p)
s=must(s,"location.pathname.includes('/yunnan/')?'yunnan':null", "location.pathname.includes('/yunnan/')?'yunnan':location.pathname.includes('/chongqing/')?'chongqing':null", 'plan-memory trip')
s=must(s,"if(trip==='yunnan'){if(/dali|erhai|xizhou|three pagoda|大理|洱海|喜洲|三塔/.test(s))return'Dali';return'Kunming'}", "if(trip==='yunnan'){if(/dali|erhai|xizhou|three pagoda|大理|洱海|喜洲|三塔/.test(s))return'Dali';return'Kunming'}if(trip==='chongqing'){if(/wulong|three natural|fairy mountain|武隆|天生三桥|仙女山/.test(s))return'Wulong';if(/dazu|大足/.test(s))return'Dazu';return'Chongqing'}", 'plan-memory region')
write(p,s)

# 5) Plan Extras parity for Chongqing.
p='plan-extras-v1.js'; s=read(p)
s=must(s,"path.includes('/yunnan/')?'yunnan':null", "path.includes('/yunnan/')?'yunnan':path.includes('/chongqing/')?'chongqing':null", 'extras trip route')
if 'DATA.chongqing=' not in s:
    block="""
DATA.chongqing={emoji:'🇨🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค.–พ.ค. / ก.ย.–พ.ย.',seasonLead:'Chongqing city + Wulong เดินเที่ยวสบายกว่าช่วงร้อนจัด',seasonText:'ทริปนี้ผสมเมืองภูเขา วิวกลางคืน รถไฟทะลุตึก เมืองเก่า และ Wulong โดยใช้ Amap + Alipay + DiDi เป็นแกนหลัก',seasonChips:['🌃 Hongya Cave','🚝 Liziba','🏞️ Wulong','🗿 Dazu'],seasonNote:'Chongqing มีทางขึ้นลงและบันไดเยอะ • Wulong อากาศต่างจากตัวเมืองได้ ควรเช็กพยากรณ์ใกล้วันจริง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนา'],['flight','ตั๋ว Bangkok ↔ Chongqing'],['insurance','ประกันเดินทาง'],['hotel','Booking ใกล้ Jiefangbei / Xiaoshizi'],['wulong','จอง Wulong / Three Natural Bridges ตามรอบจริง'],['dazu','เช็กการเดินทาง Dazu Rock Carvings']]},{title:'เงิน เน็ต & แอป',icon:'📱',items:[['esim','eSIM / SIM ที่ใช้ในจีนได้'],['amap','Amap / Gaode Maps'],['alipay','Alipay + ผูกบัตร'],['didi','DiDi / Ride hailing'],['wechat','WeChat สำรอง'],['power','Power bank ค่า Wh ชัด + เช็ก CCC ถ้ามี Domestic Flight']]},{title:'เดินเมืองภูเขา',icon:'👟',items:[['shoes','รองเท้าเดินสบาย/พื้นเกาะดี'],['umbrella','ร่มพับ'],['layers','เสื้อคลุมตามฤดูกาล'],['bag','กระเป๋าสะพายเล็ก'],['bottle','ขวดน้ำ'],['offline','บันทึกชื่อจีนของโรงแรม/Location']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','เวลา Salah + Qibla'],['mat','ผ้าปูละหมาดพกพา'],['halal','ใช้ Amap ค้น 清真餐厅'],['mosque','เซฟ 重庆清真寺 / จุดละหมาด'],['snack','Snack สำรองสำหรับ Wulong/Dazu'],['ingredients','เช็กส่วนผสมซุป/น้ำมัน/แอลกอฮอล์']]}]};
"""
    s=must(s,"  const d=DATA[trip];",block+"  const d=DATA[trip];",'extras chongqing data')
if 'APP_DATA.chongqing=APP_DATA.yunnan' not in s:
    s=must(s,'  function injectTravelApps(){','  APP_DATA.chongqing=APP_DATA.yunnan;\n  function injectTravelApps(){','extras apps alias')
s=s.replace("const note=trip==='yunnan'?", "const note=['yunnan','chongqing'].includes(trip)?")
if 'RULE_DATA.chongqing=RULE_DATA.yunnan' not in s:
    s=must(s,'  function injectTravelBuyRules(){','  RULE_DATA.chongqing=RULE_DATA.yunnan;\n  function injectTravelBuyRules(){','extras rules alias')
s=must(s,"yunnan:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location เป็นภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Kunming Old Street / Dali Ancient City • เลือกโรงแรมจริงภายหลัง'}", "yunnan:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location เป็นภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Kunming Old Street / Dali Ancient City • เลือกโรงแรมจริงภายหลัง'},chongqing:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location ภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Jiefangbei / Xiaoshizi • เลือกโรงแรมจริงภายหลัง'}", 'extras emergency')
write(p,s)

# 6) Memory Journal: scalable trip combo + Chongqing.
p='memory-journal-v3.js'; s=read(p)
if 'PLAN.chongqing=' not in s:
    block="""
PLAN.chongqing={country:'china',name:'Chongqing + Wulong 6D5N',flag:'🇨🇳',fallbackStart:'',days:[{day:1,title:'Arrival • Jiefangbei • Hongya Cave',places:['Chongqing Jiangbei International Airport','Jiefangbei','Hongya Cave']},{day:2,title:'Liziba • Eling • Raffles City',places:['Liziba Station','Eling','Raffles City Chongqing']},{day:3,title:'Ciqikou • Cableway • Longmenhao',places:['Ciqikou Ancient Town','Yangtze River Cableway','Longmenhao Old Street']},{day:4,title:'Wulong • Three Natural Bridges',places:['Three Natural Bridges','Fairy Mountain','Wulong']},{day:5,title:'Dazu Rock Carvings',places:['Dazu Rock Carvings','Baodingshan']},{day:6,title:'Souvenir • Airport',places:['Jiefangbei','Chongqing Jiangbei Airport']}]};
"""
    s=must(s,'function state(){',block+'function state(){','journal chongqing plan')
s=must(s,"if(m.country==='china'||m.country==='cn')return'yunnan';", "if(m.country==='china'||m.country==='cn'){const q=norm((m.region||'')+' '+(m.name||''));if(/chongqing|wulong|dazu|重庆|武隆|大足/.test(q))return'chongqing';return'yunnan';}", 'journal china inference')
old='<div class="mj-toolbar"><div class="mj-trip-pills"><button class="mj-pill" data-mj-trip="all">🌎 ทั้งหมด</button><button class="mj-pill" data-mj-trip="tokyo">🇯🇵 Tokyo</button><button class="mj-pill" data-mj-trip="hongkong">🇭🇰 Hong Kong</button><button class="mj-pill" data-mj-trip="danang">🇻🇳 Da Nang</button><button class="mj-pill" data-mj-trip="yunnan">🇨🇳 Yunnan</button></div><button class="mj-cloud" id="mjCloud">☁️ Cloud</button></div>'
new='<div class="mj-toolbar"><label class="mj-trip-combo"><span>ทริป</span><select id="mjTripSelect"><option value="all">🌎 ทั้งหมด</option><option value="tokyo">🇯🇵 Tokyo</option><option value="hongkong">🇭🇰 Hong Kong</option><option value="danang">🇻🇳 Da Nang</option><option value="yunnan">🇨🇳 Yunnan</option><option value="chongqing">🇨🇳 Chongqing</option></select></label><button class="mj-cloud" id="mjCloud">☁️ Cloud</button></div>'
s=must(s,old,new,'journal combo markup')
s=must(s,"$('#mjCloud')?.addEventListener('click',openSyncPanel);ensureDetail();return hub}", "$('#mjTripSelect',hub)?.addEventListener('change',e=>{activeTrip=e.target.value;const p=prefs();p.lastTrip=activeTrip;savePrefs(p);renderAll()});$('#mjCloud')?.addEventListener('click',openSyncPanel);ensureDetail();return hub}", 'journal combo listener')
s=must(s,"function paintTabs(){$$('[data-mj-trip]').forEach(b=>b.classList.toggle('on',b.dataset.mjTrip===activeTrip));", "function paintTabs(){const sel=$('#mjTripSelect');if(sel)sel.value=activeTrip;$$('[data-mj-trip]').forEach(b=>b.classList.toggle('on',b.dataset.mjTrip===activeTrip));", 'journal paint combo')
s=s.replace("for(const k of ['tokyo','hongkong','danang','yunnan'])", "for(const k of ['tokyo','hongkong','danang','yunnan','chongqing'])")
write(p,s)

p='memory-journal-v3.css'; s=read(p)
if 'trip combo v71' not in s:
    s += "\n/* trip combo v71 */\n.mj-trip-pills{display:none!important}.mj-trip-combo{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:8px;min-width:min(330px,100%);padding:7px 9px;border:1px solid var(--line);border-radius:16px;background:#fff}.mj-trip-combo span{font-size:.7rem;font-weight:900;color:var(--muted)}#mjTripSelect{width:100%;min-width:0;border:0;border-radius:12px;background:var(--cream);color:var(--dark);padding:9px 34px 9px 10px;font:900 .8rem 'Noto Sans Thai',system-ui,sans-serif;outline:none}@media(max-width:420px){.mj-trip-combo{width:100%;min-width:0}}\n"
write(p,s)

# 7) Root World Map / Memory country list gets China + both China trips.
p='index.html'; s=read(p)
s=s.replace('<option value="vietnam">🇻🇳 Vietnam</option><option value="thailand">🇹🇭 Thailand</option>', '<option value="vietnam">🇻🇳 Vietnam</option><option value="china">🇨🇳 China</option><option value="thailand">🇹🇭 Thailand</option>')
if "china:{name:'China'" not in s:
    anchor=" vietnam:{name:'Vietnam',flag:'🇻🇳',sub:'เวียดนาม',center:[16.05,108.2],zoom:6,note:'Da Nang • Hoi An • Beach • Old Town',href:'./danang/',regions:[{name:'Da Nang',center:[16.0544,108.2022],zoom:11,trip:'danang'},{name:'Hoi An',center:[15.8801,108.338],zoom:12,trip:'danang'}]},\n"
    china=" china:{name:'China',flag:'🇨🇳',sub:'จีน',center:[30.5,104.5],zoom:5,note:'Yunnan • Chongqing • Amap • Alipay',href:'',regions:[{name:'Kunming',center:[25.038,102.704],zoom:10,trip:'yunnan'},{name:'Dali',center:[25.695,100.165],zoom:10,trip:'yunnan'},{name:'Chongqing',center:[29.563,106.551],zoom:10,trip:'chongqing'},{name:'Wulong',center:[29.425,107.79],zoom:9,trip:'chongqing'},{name:'Dazu',center:[29.75,105.80],zoom:9,trip:'chongqing'}]},\n"
    s=must(s,anchor,anchor+china,'root china country')
s=must(s,"const tripRegionMap={tokyo:[['japan','Tokyo'],['japan','Chiba'],['japan','Yamanashi']],hongkong:[['hongkong','Kowloon'],['hongkong','Hong Kong Island'],['hongkong','Lantau']],danang:[['vietnam','Da Nang'],['vietnam','Hoi An']]};", "const tripRegionMap={tokyo:[['japan','Tokyo'],['japan','Chiba'],['japan','Yamanashi']],hongkong:[['hongkong','Kowloon'],['hongkong','Hong Kong Island'],['hongkong','Lantau']],danang:[['vietnam','Da Nang'],['vietnam','Hoi An']],yunnan:[['china','Kunming'],['china','Dali']],chongqing:[['china','Chongqing'],['china','Wulong'],['china','Dazu']]};", 'root trip region map')
s=must(s,"(key==='vietnam'&&state.danang?.visited)", "(key==='vietnam'&&state.danang?.visited)||(key==='china'&&(state.yunnan?.visited||state.chongqing?.visited))", 'root china visited')
s=must(s,"const done=['tokyo','hongkong'].filter(k=>state[k]?.visited).length", "const done=['tokyo','hongkong','danang','yunnan','chongqing'].filter(k=>state[k]?.visited).length", 'root stats')
s=s.replace("ourJourneySWReloadV70","ourJourneySWReloadV71").replace("sw.js?v=70","sw.js?v=71")
write(p,s)

# 8) Service worker v71 + Chongqing route and cache.
p='sw.js'; s=read(p)
s=must(s,"const CACHE='our-journey-v70'", "const CACHE='our-journey-v71'", 'sw cache')
s=must(s,"BASE+'yunnan/index.html'", "BASE+'yunnan/index.html',BASE+'chongqing/index.html'", 'sw core route')
s=must(s,"url.pathname.startsWith(BASE+'danang/')||url.pathname.startsWith(BASE+'yunnan/')", "url.pathname.startsWith(BASE+'danang/')||url.pathname.startsWith(BASE+'yunnan/')||url.pathname.startsWith(BASE+'chongqing/')", 'sw plan route')
s=s.replace("document.querySelectorAll('a[href=\"./tokyo/\"],a[href=\"./hongkong/\"],a[href=\"./danang/\"],a[href=\"./yunnan/\"]')", "document.querySelectorAll('a[href=\"./tokyo/\"],a[href=\"./hongkong/\"],a[href=\"./danang/\"],a[href=\"./yunnan/\"],a[href=\"./chongqing/\"]')")
s=s.replace('?v=70','?v=71')
write(p,s)

# Verification
checks={
'yunnan/index.html':['class="dayhero"','dayImages','Google Maps','aria-label="กลับหน้า Trips"'],
'chongqing/index.html':['Three Natural Bridges','Dazu Rock Carvings','dayImages','Amap'],
'trip-tools-v1.js':['data-pick-select','DATA.chongqing','chongqing:50000'],
'plan-first-v1.js':['data-pfx-trip-select','Chongqing + Wulong 6D5N'],
'memory-journal-v3.js':['mjTripSelect','PLAN.chongqing'],
'index.html':["china:{name:'China'",'ourJourneySWReloadV71'],
'sw.js':["our-journey-v71","chongqing/index.html"]
}
for f, needles in checks.items():
    t=read(f)
    for n in needles:
        if n not in t:
            raise SystemExit(f'VERIFY FAIL {f}: {n}')
print('ALL VERIFY OK')
