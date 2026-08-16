from pathlib import Path


def rw(path, fn):
    p = Path(path)
    s = p.read_text(encoding='utf-8')
    n = fn(s)
    if n != s:
        p.write_text(n, encoding='utf-8')
        print('UPDATED', path)
    else:
        print('UNCHANGED', path)


# Plan-first dashboard: Tokyo / Hong Kong / Da Nang / Yunnan use the same system.
def planfirst(s):
    s = s.replace(
        "const isTokyo=path.startsWith(BASE+'tokyo/'),isHK=path.startsWith(BASE+'hongkong/'),isDaNang=path.startsWith(BASE+'danang/'),isPlan=isTokyo||isHK||isDaNang,isRoot=path===BASE||path===BASE+'index.html';",
        "const isTokyo=path.startsWith(BASE+'tokyo/'),isHK=path.startsWith(BASE+'hongkong/'),isDaNang=path.startsWith(BASE+'danang/'),isYunnan=path.startsWith(BASE+'yunnan/'),isPlan=isTokyo||isHK||isDaNang||isYunnan,isRoot=path===BASE||path===BASE+'index.html';"
    )
    s = s.replace(
        "const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':'';",
        "const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':isYunnan?'yunnan':'';"
    )
    s = s.replace(
        "danang:{key:'danang',name:'Da Nang + Hoi An 6D5N',flag:'🇻🇳',href:'./danang/',planHref:'../danang/',fallbackStart:'',days:6,accent:'Da Nang'}};",
        "danang:{key:'danang',name:'Da Nang + Hoi An 6D5N',flag:'🇻🇳',href:'./danang/',planHref:'../danang/',fallbackStart:'',days:6,accent:'Da Nang'},yunnan:{key:'yunnan',name:'Yunnan • Kunming + Dali 6D5N',flag:'🇨🇳',href:'./yunnan/',planHref:'../yunnan/',fallbackStart:'',days:6,accent:'Yunnan'}};"
    )
    s = s.replace(
        "const who=a.trip==='tokyo'?'Tokyo':a.trip==='hongkong'?'Hong Kong':a.trip==='danang'?'Da Nang':'Trip';",
        "const who=a.trip==='tokyo'?'Tokyo':a.trip==='hongkong'?'Hong Kong':a.trip==='danang'?'Da Nang':a.trip==='yunnan'?'Yunnan':'Trip';"
    )
    s = s.replace(
        "x.trip==='tokyo'?'🇯🇵 Tokyo':x.trip==='hongkong'?'🇭🇰 Hong Kong':'🇻🇳 Da Nang'",
        "x.trip==='tokyo'?'🇯🇵 Tokyo':x.trip==='hongkong'?'🇭🇰 Hong Kong':x.trip==='danang'?'🇻🇳 Da Nang':'🇨🇳 Yunnan'"
    )
    return s


rw('plan-first-v1.js', planfirst)


def planfirstcss(s):
    if 'data-pfx-focus="yunnan"' not in s:
        needle = "body.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus=\"danang\"].on) .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=82')}"
        if needle in s:
            s = s.replace(needle, needle + "\nbody.pfx-root.pfx-v2:has(.pfx-focus[data-pfx-focus=\"yunnan\"].on) .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://images.unsplash.com/photo-1537531383496-f4749b8032cf?auto=format&fit=crop&w=1400&q=82')}", 1)
    return s


rw('plan-first-v2.css', planfirstcss)


# Trip Tools: add Yunnan data and make Amap the map provider for mainland China.
def triptools(s):
    if 'DATA.yunnan=' not in s:
        marker = "function defaults(){return{selected:location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':'tokyo'"
        block = """DATA.yunnan={name:'Yunnan • Kunming + Dali 6D5N',emoji:'🇨🇳',city:'Kunming / Dali',country:'China',tz:'Asia/Shanghai',currency:'CNY',budget:48000,start:'',center:[25.04,102.71],zoom:7,
 days:[
  {title:'Arrival • Kunming Old Street',items:[['หลังถึง KMG','Kunming Changshui International Airport','昆明长水国际机场'],['15:00','Kunming Old Street','昆明老街'],['16:30','Shuncheng Mosque','顺城清真寺'],['18:30','Nanping Street','南屏步行街']]},
  {title:'Stone Forest Day Trip',items:[['07:30','ออกจาก Kunming','昆明市'],['09:30','Stone Forest Scenic Area','石林风景区'],['16:30','กลับ Kunming','昆明市'],['18:30','Muslim dinner','顺城街清真美食']]},
  {title:'High-speed rail → Dali',items:[['08:00','Kunming South Railway Station','昆明南站'],['10:30','Dali Railway Station','大理站'],['13:00','Dali Ancient City','大理古城'],['17:00','Old Town evening','大理古城']]},
  {title:'Erhai • Xizhou • Three Pagodas',items:[['08:30','Erhai Lake','洱海'],['10:30','Xizhou Ancient Town','喜洲古镇'],['14:30','Three Pagodas','崇圣寺三塔文化旅游区'],['18:00','Dali Ancient City','大理古城']]},
  {title:'Dali → Kunming • Dianchi',items:[['09:00','Dali Railway Station','大理站'],['12:00','Kunming South','昆明南站'],['14:30','Dianchi / Haigeng Park','滇池海埂公园'],['17:30','Dounan Flower Market','斗南花市']]},
  {title:'Kunming • Airport',items:[['09:00','Kunming Old Street / souvenir','昆明老街'],['11:00','Muslim lunch','顺城清真寺'],['ก่อนบิน 3 ชม.','Kunming Changshui Airport','昆明长水国际机场']]}
 ],
 places:[['🏙️','Kunming Old Street',25.038,102.704,'sight'],['🕌','Shuncheng Mosque',25.0385,102.706,'muslim'],['🪨','Stone Forest',24.817,103.324,'sight'],['🚄','Kunming South Railway Station',24.873,102.861,'station'],['🏮','Dali Ancient City',25.695,100.165,'sight'],['🌊','Erhai Lake',25.75,100.20,'sight'],['🏘️','Xizhou Ancient Town',25.851,100.13,'sight'],['🛕','Three Pagodas',25.706,100.147,'sight'],['🌅','Dianchi Haigeng Park',24.956,102.664,'sight'],['🌷','Dounan Flower Market',24.891,102.788,'shop'],['✈️','Kunming Changshui Airport',25.102,102.929,'station']],
 muslim:[['🕌 Shuncheng Mosque','顺城清真寺','Prayer • Kunming'],['🍜 Shuncheng Muslim food','顺城街清真美食','Kunming halal area'],['🍽️ Dali halal search','大理清真餐厅','ใช้ Amap หา 清真 / halal ใกล้ Location']]
};
"""
        if marker in s:
            s = s.replace(marker, block + marker, 1)
        else:
            print('MISS triptools DATA marker')
    s = s.replace(
        "function defaults(){return{selected:location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':'tokyo',dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:''},budgets:{tokyo:65000,hongkong:55000,danang:45000},done:{tokyo:{},hongkong:{},danang:{}},expenses:[],wallet:[],notes:[],api:{},lastTab:'today'};}",
        "function defaults(){return{selected:location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':'tokyo',dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:''},budgets:{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000},done:{tokyo:{},hongkong:{},danang:{},yunnan:{}},expenses:[],wallet:[],notes:[],api:{},lastTab:'today'};}"
    )
    s = s.replace(
        "state.dates=Object.assign({tokyo:DATA.tokyo.start,hongkong:'',danang:''},state.dates||{});state.budgets=Object.assign({tokyo:65000,hongkong:55000,danang:45000},state.budgets||{});state.done=state.done||{tokyo:{},hongkong:{}};",
        "state.dates=Object.assign({tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:''},state.dates||{});state.budgets=Object.assign({tokyo:65000,hongkong:55000,danang:45000,yunnan:48000},state.budgets||{});state.done=Object.assign({tokyo:{},hongkong:{},danang:{},yunnan:{}},state.done||{});"
    )
    s = s.replace(
        "function maps(q){return'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}",
        "function maps(q){if(state.selected==='yunnan')return'https://uri.amap.com/search?keyword='+encodeURIComponent(q)+'&view=map&src=ourjourney&callnative=1';return'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}"
    )
    return s


rw('trip-tools-v1.js', triptools)


# Plan Extras: readiness, China apps, power-bank/customs rules and emergency card.
def extras(s):
    s = s.replace(
        "const trip=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':path.includes('/danang/')?'danang':null;",
        "const trip=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':path.includes('/danang/')?'danang':path.includes('/yunnan/')?'yunnan':null;"
    )
    if 'DATA.yunnan=' not in s:
        marker = "  const d=DATA[trip];"
        block = """DATA.yunnan={emoji:'🇨🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค.–พ.ค. / ก.ย.–พ.ย.',seasonLead:'Kunming + Dali เดินเที่ยวสบายและวิวภูเขา/ทะเลสาบสวย',seasonText:'Yunnan อยู่ทางตะวันตกเฉียงใต้ของจีน และ Kunming–Dali เชื่อมด้วยรถไฟความเร็วสูง จึงทำทริป 6 วันได้โดยไม่ต้องใช้เที่ยวบินภายในประเทศ',seasonChips:['🌸 Kunming','🏮 Dali Old Town','🌊 Erhai','🚄 High-speed rail'],seasonNote:'Yunnan มีความสูงต่างกันมาก อากาศเช้า–ค่ำอาจเย็นกว่าที่คิด ควรเช็กพยากรณ์ใกล้วันจริง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนา'],['flight','ตั๋ว Bangkok ↔ Kunming'],['insurance','ประกันเดินทาง'],['hotel','Booking Kunming + Dali'],['train','จองรถไฟ Kunming ↔ Dali และกรอกชื่อ/Passport ให้ตรง'],['entry','เช็กเงื่อนไขเข้าเมืองจีนล่าสุดก่อนบิน']]},{title:'เงิน เน็ต & แอปจีน',icon:'📱',items:[['esim','eSIM/SIM ที่ระบุการใช้งานใน China'],['alipay','ติดตั้ง Alipay + ผูกบัตรต่างประเทศก่อนบิน'],['amap','ติดตั้ง Amap / Gaode Maps และเซฟ Location'],['didi','DiDi / Ride-hailing พร้อมใช้งาน'],['wechat','WeChat สำรองสำหรับติดต่อ/ชำระเงิน'],['cash','พก RMB สดเล็กน้อยเป็นแผนสำรอง']]},{title:'เสื้อผ้า & เดินทาง',icon:'🧥',items:[['layer','เสื้อคลุมแบบ Layer สำหรับเช้า/ค่ำ'],['shoes','รองเท้าเดินสบาย'],['sun','กันแดด + แว่นกันแดด'],['umbrella','ร่มพับ'],['power','Power bank ที่ค่า Wh ชัดเจน'],['adapter','Universal Adapter / หัวปลั๊กที่เหมาะกับอุปกรณ์']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','Prayer/Qibla app'],['mat','ผ้าปูละหมาดพกพา'],['mosque','เซฟ Shuncheng Mosque 顺城清真寺'],['halal','ใน Amap ค้นคำว่า 清真 / 清真餐厅'],['snack','พก snack halal สำรองวัน Stone Forest / รถไฟ'],['translate','เซฟชื่อร้าน/โรงแรมเป็นภาษาจีนไว้ในมือถือ']]}]};
"""
        if marker in s:
            s = s.replace(marker, block + marker, 1)
        else:
            print('MISS extras DATA marker')
    app_start = s.find('const APP_DATA=')
    app_end = s.find('function injectTravelApps')
    if app_start >= 0 and app_end > app_start and 'yunnan:[' not in s[app_start:app_end]:
        marker = "    tokyo:["
        block = """    yunnan:[
      {icon:'🗺️',name:'Amap / Gaode Maps 高德地图',badge:'ต้องมี • Maps หลัก',platform:'iPhone + Android',desc:'ใช้เป็นแผนที่หลักในจีนแผ่นดินใหญ่สำหรับค้น POI เดินทาง รถสาธารณะ และเรียกรถ • ระบบ Location ของทริปจีนจะเปิด Amap ก่อน',url:'https://www.amap.com/'},
      {icon:'💙',name:'Alipay',badge:'ต้องมี • Payment',platform:'iPhone + Android',desc:'ผูกบัตรต่างประเทศก่อนเดินทาง ใช้ QR จ่ายร้านค้าและเปิด Transport/Taxi ได้ในแอปเดียว',url:'https://www.alipay.com/'},
      {icon:'🚕',name:'DiDi Greater China',badge:'แนะนำ • Ride hailing',platform:'iPhone + Android',desc:'เรียกรถใน Kunming/Dali และใช้ชื่อ Location ภาษาจีนจาก Amap ช่วยลดการสื่อสารผิดจุด',url:'https://www.didiglobal.com/'},
      {icon:'💬',name:'WeChat / Weixin Pay',badge:'แนะนำ',platform:'iPhone + Android',desc:'ใช้ติดต่อร้าน/โรงแรม และเป็นช่องทางชำระเงินสำรองเมื่อผูกบัตรที่รองรับแล้ว',url:'https://www.wechat.com/'},
      {icon:'🚄',name:'China Railway 12306',badge:'แนะนำ • รถไฟ',platform:'Web + App',desc:'เช็กรอบและตั๋วรถไฟ Kunming ↔ Dali • เว็บทางการมีภาษาอังกฤษ',url:'https://www.12306.cn/en/index.html'}
    ],
"""
        s = s.replace(marker, block + marker, 1)
    old_note = "const note=trip==='hongkong'?'ฮ่องกงไม่จำเป็นต้องใช้ DiDi/Alipay เป็นหลักเหมือนจีนแผ่นดินใหญ่ — Octopus + MTR Mobile + Uber เหมาะกับทริปนี้มากกว่า':trip==='danang'?'เวียดนามใช้ Grab + Google Maps เป็นหลัก • เตรียมเงิน VND สดไว้สำหรับร้านเล็กและตลาด':'ญี่ปุ่นใช้ IC Card + Maps เป็นหลัก ส่วนแท็กซี่ติด GO ไว้เป็นตัวสำรอง';"
    new_note = "const note=trip==='yunnan'?'จีนแผ่นดินใหญ่ใช้ Amap / Gaode Maps เป็น Maps หลัก • Alipay เป็น Payment หลัก • DiDi สำหรับเรียกรถ • Location ในแพลนจีนเปิด Amap ก่อน Google Maps':trip==='hongkong'?'ฮ่องกงไม่จำเป็นต้องใช้ DiDi/Alipay เป็นหลักเหมือนจีนแผ่นดินใหญ่ — Octopus + MTR Mobile + Uber เหมาะกับทริปนี้มากกว่า':trip==='danang'?'เวียดนามใช้ Grab + Google Maps เป็นหลัก • เตรียมเงิน VND สดไว้สำหรับร้านเล็กและตลาด':'ญี่ปุ่นใช้ IC Card + Maps เป็นหลัก ส่วนแท็กซี่ติด GO ไว้เป็นตัวสำรอง';"
    s = s.replace(old_note, new_note)
    rule_start = s.find('const RULE_DATA=')
    if rule_start >= 0 and "yunnan:{buyNote:" not in s[rule_start:]:
        marker = "    danang:{buyNote:"
        block = """    yunnan:{buyNote:'จีนแผ่นดินใหญ่: เตรียม Amap + Alipay ก่อนบิน • Power bank ควรมีค่า Wh ชัด และถ้ามีเที่ยวบินภายในจีนต้องตรวจเครื่องหมาย CCC/3C โดยเฉพาะ',rules:[
      {icon:'🔋',title:'Power bank บนเที่ยวบินภายในจีน',level:'สำคัญมาก',text:'ตั้งแต่ 28 มิ.ย. 2025 เที่ยวบินภายในประเทศจีนห้าม Power bank ที่ไม่มีเครื่องหมาย CCC/3C ชัดเจน เครื่องหมายไม่ชัด หรือเป็นรุ่นที่ถูกเรียกคืน • เส้น Kunming–Dali ในแพลนนี้ใช้รถไฟ จึงไม่ต้องขึ้น Domestic Flight ระหว่างเมือง',url:'https://www.caac.gov.cn/English/News/202507/t20250709_227894.html',link:'CAAC'},
      {icon:'🛃',title:'ของห้าม/ของต้องสำแดงเข้าจีน',level:'ศุลกากร',text:'อาวุธ วัตถุระเบิด ยาเสพติด สารพิษ และสินค้า/พืช/สัตว์บางประเภทถูกห้ามหรือควบคุม • ของใช้ส่วนตัวต้องอยู่ในปริมาณสมเหตุสมผล และของที่ไม่แน่ใจให้เลือกช่อง Declare',url:'https://english.customs.gov.cn/statics/88707c1e-aa4e-40ca-a968-bdbdbb565e4f.html',link:'China Customs'},
      {icon:'🗺️',title:'Maps ในจีน',level:'แนะนำ',text:'ใช้ Amap / Gaode เป็น Maps หลักสำหรับ Location ในจีน • Our Journey จะแสดงปุ่ม Amap ก่อน และ Google Maps เป็นตัวสำรองในหน้า Yunnan',url:'https://uri.amap.com/search?keyword=%E6%98%86%E6%98%8E&view=map&src=ourjourney&callnative=1',link:'เปิด Amap'}]},
"""
        s = s.replace(marker, block + marker, 1)
    s = s.replace(
        "danang:{main:'ตำรวจ 113 • ดับเพลิง 114 • รถพยาบาล 115 • กู้ภัย 112',help:'Da Nang Visitor Center +84 236 355 0111',hotel:'HAIAN Beach Hotel & Spa / Little Riverside Hoi An'}",
        "danang:{main:'ตำรวจ 113 • ดับเพลิง 114 • รถพยาบาล 115 • กู้ภัย 112',help:'Da Nang Visitor Center +84 236 355 0111',hotel:'HAIAN Beach Hotel & Spa / Little Riverside Hoi An'},yunnan:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location เป็นภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Kunming Old Street / Dali Ancient City • เลือกโรงแรมจริงภายหลัง'}"
    )
    return s


rw('plan-extras-v1.js', extras)


# Memory Journal: Da Nang + Yunnan selectors, Day grouping, cover and plan navigation.
def journal(s):
    if 'PLAN.yunnan=' not in s:
        marker = "function state(){"
        block = """PLAN.yunnan={country:'china',name:'Yunnan • Kunming + Dali 6D5N',flag:'🇨🇳',fallbackStart:'',days:[{day:1,title:'Arrival • Kunming Old Street',places:['Kunming Changshui International Airport','Kunming Old Street','Shuncheng Mosque','Nanping Street']},{day:2,title:'Stone Forest Day Trip',places:['Stone Forest Scenic Area','Stone Forest','Kunming']},{day:3,title:'High-speed rail → Dali',places:['Kunming South Railway Station','Dali Railway Station','Dali Ancient City']},{day:4,title:'Erhai • Xizhou • Three Pagodas',places:['Erhai Lake','Xizhou Ancient Town','Three Pagodas','Dali Ancient City']},{day:5,title:'Dali → Kunming • Dianchi',places:['Dali Railway Station','Kunming South Railway Station','Dianchi Haigeng Park','Dounan Flower Market']},{day:6,title:'Kunming • Airport',places:['Kunming Old Street','Shuncheng Mosque','Kunming Changshui International Airport']}]};
"""
        s = s.replace(marker, block + marker, 1)
    s = s.replace("if(m.country==='vietnam'||m.country==='vn')return'danang';return m.trip||'other'", "if(m.country==='vietnam'||m.country==='vn')return'danang';if(m.country==='china'||m.country==='cn')return'yunnan';return m.trip||'other'")
    s = s.replace('<button class="mj-pill" data-mj-trip="danang">🇻🇳 Da Nang</button></div>', '<button class="mj-pill" data-mj-trip="danang">🇻🇳 Da Nang</button><button class="mj-pill" data-mj-trip="yunnan">🇨🇳 Yunnan</button></div>')
    s = s.replace("for(const k of ['tokyo','hongkong','danang'])", "for(const k of ['tokyo','hongkong','danang','yunnan'])")
    s = s.replace("location.assign(`./${trip==='tokyo'?'tokyo':'hongkong'}/#memory-day-${Number(day)||1}`)", "location.assign(`./${trip==='tokyo'?'tokyo':trip==='hongkong'?'hongkong':trip==='danang'?'danang':'yunnan'}/#memory-day-${Number(day)||1}`)")
    return s


rw('memory-journal-v3.js', journal)


# Add destination plan options in New Memory form.
def memloc(s):
    if 'PLAN.china=' not in s:
        marker = "\n\n  const sheet="
        block = """
  PLAN.china={trip:'Yunnan • Kunming + Dali 6D5N',regions:{
    'Kunming':['Kunming Changshui International Airport','Kunming Old Street','Shuncheng Mosque','Nanping Pedestrian Street','Stone Forest Scenic Area','Kunming South Railway Station','Dianchi Haigeng Park','Dounan Flower Market'],
    'Dali':['Dali Railway Station','Dali Ancient City','Erhai Lake','Xizhou Ancient Town','Three Pagodas']
  }};
"""
        s = s.replace(marker, block + marker, 1)
    return s


rw('memory-location-v2.js', memloc)

rw('memory-global-location-v1.js', lambda s: s.replace("const special={JP:'japan',HK:'hongkong',TH:'thailand',VN:'vietnam'},specialCode={japan:'JP',hongkong:'HK',thailand:'TH',vietnam:'VN'};", "const special={JP:'japan',HK:'hongkong',TH:'thailand',VN:'vietnam',CN:'china'},specialCode={japan:'JP',hongkong:'HK',thailand:'TH',vietnam:'VN',china:'CN'};"))

for f in ['memory-recap-v1.js', 'memory-moments-v1.js']:
    rw(f, lambda s: s.replace("{japan:'JP',hongkong:'HK',thailand:'TH',vietnam:'VN',vn:'VN'}", "{japan:'JP',hongkong:'HK',thailand:'TH',vietnam:'VN',vn:'VN',china:'CN',cn:'CN'}"))


def umap(s):
    s = s.replace("(m.country==='vietnam'||m.country==='vn')?'🇻🇳':'🌍'", "(m.country==='vietnam'||m.country==='vn')?'🇻🇳':(m.country==='china'||m.country==='cn')?'🇨🇳':'🌍'")
    s = s.replace("(m.country==='vietnam'||m.country==='vn')?'Vietnam':m.country||''", "(m.country==='vietnam'||m.country==='vn')?'Vietnam':(m.country==='china'||m.country==='cn')?'China':m.country||''")
    s = s.replace("(m.trip==='tokyo'||m.trip==='hongkong'||m.trip==='danang')?m.trip:'all'", "(m.trip==='tokyo'||m.trip==='hongkong'||m.trip==='danang'||m.trip==='yunnan')?m.trip:'all'")
    return s


rw('unified-memory-map-v1.js', umap)

rw('memory-plan-inbox-v2.js', lambda s: s.replace("({tokyo:'Tokyo Winter Trip',hongkong:'Hong Kong Trip',danang:'Da Nang + Hoi An Trip'}[payload.trip]||'Trip')", "({tokyo:'Tokyo Winter Trip',hongkong:'Hong Kong Trip',danang:'Da Nang + Hoi An Trip',yunnan:'Yunnan Kunming + Dali Trip'}[payload.trip]||'Trip')"))


def pmlink(s):
    s = s.replace(
        "const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':null;",
        "const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':null;"
    )
    s = s.replace("const country=trip==='tokyo'?'japan':trip==='hongkong'?'hongkong':'vietnam'", "const country=trip==='tokyo'?'japan':trip==='hongkong'?'hongkong':trip==='danang'?'vietnam':'china'")
    s = s.replace(
        "if(trip==='danang'){if(/hoi an|cam thanh|coconut|maxim|baba|ancient|thu bon/.test(s))return'Hoi An';return'Da Nang'}if(/disney|ngong|tung chung|tian tan|citygate|airport|hkia/.test(s))return'Lantau';",
        "if(trip==='danang'){if(/hoi an|cam thanh|coconut|maxim|baba|ancient|thu bon/.test(s))return'Hoi An';return'Da Nang'}if(trip==='yunnan'){if(/dali|erhai|xizhou|three pagoda|大理|洱海|喜洲|三塔/.test(s))return'Dali';return'Kunming'}if(/disney|ngong|tung chung|tian tan|citygate|airport|hkia/.test(s))return'Lantau';"
    )
    return s


rw('plan-memory-link-v2.js', pmlink)


def pphoto(s):
    s = s.replace("const countrySlug=cc=>cc==='jp'?'japan':cc==='hk'?'hongkong':cc==='th'?'thailand':String(cc||'unknown').toLowerCase();", "const countrySlug=cc=>cc==='jp'?'japan':cc==='hk'?'hongkong':cc==='th'?'thailand':cc==='vn'?'vietnam':cc==='cn'?'china':String(cc||'unknown').toLowerCase();")
    old = "if(!/google\\.[^/]+\\/maps|maps\\.google/i.test(u.href))continue;const q=u.searchParams.get('query')||u.searchParams.get('q');if(q)return q"
    new = "if(/uri\\.amap\\.com/i.test(u.href)){const q=u.searchParams.get('keyword');if(q)return q}if(!/google\\.[^/]+\\/maps|maps\\.google/i.test(u.href))continue;const q=u.searchParams.get('query')||u.searchParams.get('q');if(q)return q"
    s = s.replace(old, new)
    return s


rw('plan-photo-memory-v1.js', pphoto)


# Route panels should work in Da Nang and Yunnan; Disney stays only Tokyo/HK.
def daytools(s):
    s = s.replace(
        "const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':null;",
        "const trip=location.pathname.includes('/tokyo/')?'tokyo':location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':null;"
    )
    if 'ROUTES.danang=' not in s:
        marker = "\n\n  const DISNEY={"
        block = """
  ROUTES.danang=[{0:{mode:'🚕',title:'Da Nang Airport → My Khe',lines:['เปิด Grab ที่สนามบิน DAD','เลือกจุดรับรถตามป้ายสนามบิน','ไป HAIAN / My Khe แล้วเช็กอิน'],note:'เก็บชื่อโรงแรมในแอปไว้ก่อน'}},{0:{mode:'🚕',title:'My Khe → Ba Na Hills',lines:['Grab/รถจองล่วงหน้าไป Sun World Ba Na Hills','นัดเวลารับกลับหรือจองไป-กลับ'],note:'ออกเช้าเพื่อลดคิว'}},{0:{mode:'🚕',title:'Da Nang → Marble Mountains → Hoi An',lines:['เช็กเอาต์ Da Nang','แวะ Marble Mountains','ต่อรถไป Hoi An'],note:'เหมารถ/Grab แบบหลายจุดสะดวกกว่าสำหรับ 2 คนพร้อมกระเป๋า'}},{0:{mode:'🚕',title:'Hoi An → Cam Thanh',lines:['เรียก Grab/Taxi ไป Coconut Village','กลับ Ancient Town ช่วงบ่าย'],note:'เช็กจุดรับ-ส่งกับผู้ให้บริการ Basket Boat'}},{0:{mode:'🚕',title:'Hoi An → Da Nang / Son Tra',lines:['รถกลับ Da Nang','ต่อ Grab ไป Son Tra / Linh Ung','กลับ My Khe ช่วงเย็น'],note:'เผื่อเวลาและสภาพอากาศ'}},{3:{mode:'✈️',title:'Hotel → DAD Airport',lines:['รับกระเป๋า','Grab ไป Da Nang International Airport','ถึงสนามบินก่อนบินประมาณ 3 ชั่วโมง'],note:'เช็ก terminal/flight ในวันจริง'}}];
  ROUTES.yunnan=[{0:{mode:'🚕',title:'Kunming Airport → City',lines:['ใช้ DiDi/Alipay Taxi หรือ Metro ตามเวลาจริง','ส่งชื่อโรงแรมภาษาจีนให้คนขับ'],note:'Amap เป็น Maps หลักในจีน'}},{0:{mode:'🚐',title:'Kunming → Stone Forest',lines:['เลือกทัวร์/รถรับส่งหรือรถสาธารณะตามรอบจริง','เปิด 石林风景区 ใน Amap'],note:'วันนี้ออกเช้าและพก snack halal'}},{0:{mode:'🚄',title:'Kunming → Dali',lines:['Kunming South 昆明南站','รถไฟความเร็วสูงไป Dali 大理站','DiDi/Taxi ต่อเข้า Dali Ancient City'],note:'ชื่อบนตั๋วต้องตรง Passport'}},{0:{mode:'🚕',title:'Dali • Erhai • Xizhou',lines:['ใช้ DiDi/รถพร้อมคนขับสำหรับหลายจุด','Erhai → Xizhou → Three Pagodas → Old Town'],note:'เส้นรอบ Erhai ระยะไกลกว่าที่เห็นในแผนที่'}},{0:{mode:'🚄',title:'Dali → Kunming',lines:['Dali Station → Kunming South','ต่อ Metro/DiDi ไป Dianchi / Dounan'],note:'เผื่อเวลาจากสถานีเข้าเมือง'}},{2:{mode:'✈️',title:'Kunming City → Airport',lines:['DiDi/Metro ไป Kunming Changshui Airport','ถึงก่อนบินประมาณ 3 ชั่วโมง'],note:'ทริปนี้ไม่มีเที่ยวบินภายในจีน'}}];
"""
        s = s.replace(marker, block + marker, 1)
    s = s.replace("  function addDisneyChecklist(){\n    const day=document.querySelectorAll('.day')[1];", "  function addDisneyChecklist(){\n    if(!DISNEY[trip])return;\n    const day=document.querySelectorAll('.day')[1];")
    return s


rw('plan-day-tools-v1.js', daytools)

rw('plan-ui-fixes-v1.js', lambda s: s.replace("if(!path.startsWith(BASE+'tokyo/')&&!path.startsWith(BASE+'hongkong/'))return;", "if(!path.startsWith(BASE+'tokyo/')&&!path.startsWith(BASE+'hongkong/')&&!path.startsWith(BASE+'danang/')&&!path.startsWith(BASE+'yunnan/'))return;"))

rw('google-photos-v1.js', lambda s: s.replace("function selectedTrip(){try{return JSON.parse(localStorage.getItem(TT_KEY)||'{}').selected||(location.pathname.includes('/hongkong/')?'hongkong':'tokyo')}catch{return'tokyo'}}", "function selectedTrip(){try{return JSON.parse(localStorage.getItem(TT_KEY)||'{}').selected||(location.pathname.includes('/hongkong/')?'hongkong':location.pathname.includes('/danang/')?'danang':location.pathname.includes('/yunnan/')?'yunnan':'tokyo')}catch{return'tokyo'}}"))

rw('collapse-sections-v1.js', lambda s: s.replace("s.textContent='Japan • Hong Kong • Thailand';", "s.textContent='Japan • Hong Kong • Vietnam • China • Thailand';"))


# PWA v68: inject all plan tools into Yunnan and cache the fourth plan page.
def sw(s):
    s = s.replace("const CACHE='our-journey-v67'", "const CACHE='our-journey-v68'")
    s = s.replace("BASE+'danang/index.html',BASE+'manifest.webmanifest'", "BASE+'danang/index.html',BASE+'yunnan/index.html',BASE+'manifest.webmanifest'")
    s = s.replace('?v=67', '?v=68')
    s = s.replace("const isPlan=url.pathname.startsWith(BASE+'tokyo/')||url.pathname.startsWith(BASE+'hongkong/')||url.pathname.startsWith(BASE+'danang/');", "const isPlan=url.pathname.startsWith(BASE+'tokyo/')||url.pathname.startsWith(BASE+'hongkong/')||url.pathname.startsWith(BASE+'danang/')||url.pathname.startsWith(BASE+'yunnan/');")
    s = s.replace("document.querySelectorAll('a[href=\"./tokyo/\"],a[href=\"./hongkong/\"],a[href=\"./danang/\"]')", "document.querySelectorAll('a[href=\"./tokyo/\"],a[href=\"./hongkong/\"],a[href=\"./danang/\"],a[href=\"./yunnan/\"]')")
    return s


rw('sw.js', sw)
rw('index.html', lambda s: s.replace('ourJourneySWReloadV67', 'ourJourneySWReloadV68').replace('sw.js?v=67', 'sw.js?v=68'))

# Helpful audit in Action logs. Disney-only files are intentionally two-trip.
print('\n=== PARITY AUDIT ===')
for p in sorted(Path('.').glob('*.js')):
    t = p.read_text(encoding='utf-8', errors='ignore').lower()
    if 'tokyo' in t and 'hongkong' in t and ('trip' in t or 'plan' in t):
        if 'danang' not in t:
            print('NO_DANANG', p)
        if 'yunnan' not in t and p.name not in {'disney-browser-v1.js', 'disney-meta-v1.js'}:
            print('NO_YUNNAN', p)
