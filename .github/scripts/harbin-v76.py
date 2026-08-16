from pathlib import Path
import json


def replace(path, old, new, count=1):
    p = Path(path)
    s = p.read_text(encoding='utf-8')
    if new in s:
        return
    if old not in s:
        raise SystemExit(f'missing pattern in {path}: {old[:120]}')
    p.write_text(s.replace(old, new, count), encoding='utf-8')


def insert_before(path, marker, block):
    p = Path(path)
    s = p.read_text(encoding='utf-8')
    if block.strip() in s:
        return
    if marker not in s:
        raise SystemExit(f'missing marker in {path}: {marker[:100]}')
    p.write_text(s.replace(marker, block + marker, 1), encoding='utf-8')


# Plan-first registry/dashboard
replace('plan-first-v1.js',
    "const isTokyo=path.startsWith(BASE+'tokyo/'),isHK=path.startsWith(BASE+'hongkong/'),isDaNang=path.startsWith(BASE+'danang/'),isYunnan=path.startsWith(BASE+'yunnan/'),isChongqing=path.startsWith(BASE+'chongqing/'),isPlan=isTokyo||isHK||isDaNang||isYunnan||isChongqing,isRoot=path===BASE||path===BASE+'index.html';",
    "const isTokyo=path.startsWith(BASE+'tokyo/'),isHK=path.startsWith(BASE+'hongkong/'),isDaNang=path.startsWith(BASE+'danang/'),isYunnan=path.startsWith(BASE+'yunnan/'),isChongqing=path.startsWith(BASE+'chongqing/'),isHarbin=path.startsWith(BASE+'harbin/'),isPlan=isTokyo||isHK||isDaNang||isYunnan||isChongqing||isHarbin,isRoot=path===BASE||path===BASE+'index.html';")
replace('plan-first-v1.js',
    "const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':isYunnan?'yunnan':isChongqing?'chongqing':'';",
    "const tripKey=isTokyo?'tokyo':isHK?'hongkong':isDaNang?'danang':isYunnan?'yunnan':isChongqing?'chongqing':isHarbin?'harbin':'';")
replace('plan-first-v1.js',
    "chongqing:{key:'chongqing',country:'china',name:'Chongqing + Wulong 6D5N',flag:'🇨🇳',href:'./chongqing/',planHref:'../chongqing/',fallbackStart:'',days:6,accent:'Chongqing'}};",
    "chongqing:{key:'chongqing',country:'china',name:'Chongqing + Wulong 6D5N',flag:'🇨🇳',href:'./chongqing/',planHref:'../chongqing/',fallbackStart:'',days:6,accent:'Chongqing'},harbin:{key:'harbin',country:'china',name:'Harbin + Yabuli + Snow Town 6D5N',flag:'🇨🇳',href:'./harbin/',planHref:'../harbin/',fallbackStart:'',days:6,accent:'Harbin'}};")
replace('plan-first-v1.js',
    "const who=a.trip==='tokyo'?'Tokyo':a.trip==='hongkong'?'Hong Kong':a.trip==='danang'?'Da Nang':a.trip==='yunnan'?'Yunnan':a.trip==='chongqing'?'Chongqing':'Trip';",
    "const who=a.trip==='tokyo'?'Tokyo':a.trip==='hongkong'?'Hong Kong':a.trip==='danang'?'Da Nang':a.trip==='yunnan'?'Yunnan':a.trip==='chongqing'?'Chongqing':a.trip==='harbin'?'Harbin':'Trip';")
replace('plan-first-v1.js',
    "x.trip==='yunnan'?'🇨🇳 Yunnan':'🇨🇳 Chongqing'",
    "x.trip==='yunnan'?'🇨🇳 Yunnan':x.trip==='chongqing'?'🇨🇳 Chongqing':'🇨🇳 Harbin'")
replace('plan-first-v2.js',
    "path.startsWith(BASE+'yunnan/')||path.startsWith(BASE+'chongqing/')",
    "path.startsWith(BASE+'yunnan/')||path.startsWith(BASE+'chongqing/')||path.startsWith(BASE+'harbin/')")
insert_before('plan-first-v2.css', '.pfx-v2-more{', "body.pfx-root.pfx-v2 #pfxTripDashboard[data-pfx-trip=\"harbin\"] .pfx-trip-main:before{background-image:linear-gradient(180deg,transparent 55%,#0000003d),url('https://commons.wikimedia.org/wiki/Special:Redirect/file/Harbin%20Ice%20%26%20Snow%20Festival%202026%20-%20Panoramic%20view.jpg?width=1400')}\n")

# Trip Tools: same data/state system, Amap primary for China
harbin_data = """DATA.harbin={name:'Harbin + Yabuli + Snow Town 6D5N',emoji:'🇨🇳',city:'Harbin / Yabuli / Xuexiang',country:'China',tz:'Asia/Shanghai',currency:'CNY',budget:58000,start:'',center:[45.76,126.64],zoom:6,
 days:[
  {title:'Arrival • Saint Sophia • Central Street',items:[['หลังถึง HRB','Harbin Taiping International Airport','哈尔滨太平国际机场'],['15:00','Saint Sophia Cathedral','圣索菲亚教堂'],['16:30','Central Street','中央大街'],['19:00','Songhua River / Stalin Park','斯大林公园 松花江']]},
  {title:'Sun Island • Ice & Snow World',items:[['09:30','Sun Island Scenic Area','太阳岛风景区'],['13:30','พัก / Lunch','哈尔滨市'],['15:00','Harbin Ice & Snow World','哈尔滨冰雪大世界'],['20:30','กลับ Central Street','中央大街']]},
  {title:'Harbin → Yabuli • Ski Day',items:[['07:30','Harbin Railway Station','哈尔滨站'],['09:30','Yabuli West / Yabuli','亚布力西站'],['10:30','Yabuli Ski Resort','亚布力滑雪旅游度假区'],['17:00','Yabuli Hotel / Resort','亚布力滑雪旅游度假区']]},
  {title:'Yabuli → Snow Town • Xuexiang Night',items:[['08:30','ออกจาก Yabuli','亚布力'],['11:30','China Snow Town / Xuexiang','中国雪乡国家森林公园'],['14:00','Snow Town walk','雪乡国家森林公园'],['18:00','Xuexiang Night View','雪韵大街']]},
  {title:'Snow Town → Harbin',items:[['07:30','Snow Town Morning','雪乡国家森林公园'],['10:00','ออกจาก Snow Town','中国雪乡'],['15:30','Harbin Hotel / Rest','中央大街'],['18:30','Central Street / Music Park','中央大街 哈尔滨音乐公园']]},
  {title:'Songhua • Souvenir • Airport',items:[['09:00','Songhua River / Stalin Park','斯大林公园'],['10:30','Central Street Souvenir','中央大街'],['12:00','Saint Sophia area','圣索菲亚教堂'],['ก่อนบิน 3–4 ชม.','Harbin Taiping International Airport','哈尔滨太平国际机场']]}
 ],
 places:[['⛪','Saint Sophia Cathedral',45.7748,126.5569,'sight'],['🏙️','Central Street',45.773,126.617,'sight'],['🌊','Songhua River / Stalin Park',45.781,126.613,'sight'],['🏝️','Sun Island',45.804,126.596,'sight'],['🧊','Harbin Ice & Snow World',45.773,126.566,'sight'],['🎿','Yabuli Ski Resort',44.77,128.45,'sight'],['🏘️','China Snow Town / Xuexiang',44.33,128.20,'sight'],['✈️','Harbin Taiping International Airport',45.623,126.250,'station']],
 muslim:[['🕌 Harbin mosque search','哈尔滨 清真寺','ใช้ Amap ค้นมัสยิดใกล้ Route'],['🍜 Halal Harbin','哈尔滨 清真餐厅','ค้น 清真餐厅 ใกล้ Central Street'],['🍽️ Yabuli halal search','亚布力 清真餐厅','เช็กตัวเลือกก่อนออกจาก Harbin'],['🥪 Snow Town backup','雪乡 清真餐厅','พก snack halal สำรองเพราะตัวเลือกอาจน้อย']]
};
"""
insert_before('trip-tools-v1.js', 'const TT_COUNTRY_META=', harbin_data)
replace('trip-tools-v1.js',
    "const TT_TRIP_COUNTRY={tokyo:'japan',hongkong:'hongkong',danang:'vietnam',yunnan:'china',chongqing:'china'};",
    "const TT_TRIP_COUNTRY={tokyo:'japan',hongkong:'hongkong',danang:'vietnam',yunnan:'china',chongqing:'china',harbin:'china'};")
replace('trip-tools-v1.js',
    "const ttTripLabel=k=>k==='tokyo'?'Tokyo':k==='hongkong'?'Hong Kong':k==='danang'?'Da Nang':k==='yunnan'?'Yunnan':'Chongqing';",
    "const ttTripLabel=k=>k==='tokyo'?'Tokyo':k==='hongkong'?'Hong Kong':k==='danang'?'Da Nang':k==='yunnan'?'Yunnan':k==='chongqing'?'Chongqing':'Harbin';")
replace('trip-tools-v1.js',
    "location.pathname.includes('/yunnan/')?'yunnan':location.pathname.includes('/chongqing/')?'chongqing':'tokyo'",
    "location.pathname.includes('/yunnan/')?'yunnan':location.pathname.includes('/chongqing/')?'chongqing':location.pathname.includes('/harbin/')?'harbin':'tokyo'")
for old, new in [
    ("dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:'',chongqing:''}", "dates:{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:'',chongqing:'',harbin:''}"),
    ("budgets:{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000,chongqing:50000}", "budgets:{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000,chongqing:50000,harbin:58000}"),
    ("done:{tokyo:{},hongkong:{},danang:{},yunnan:{},chongqing:{}}", "done:{tokyo:{},hongkong:{},danang:{},yunnan:{},chongqing:{},harbin:{}}"),
    ("{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:'',chongqing:''},state.dates", "{tokyo:DATA.tokyo.start,hongkong:'',danang:'',yunnan:'',chongqing:'',harbin:''},state.dates"),
    ("{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000,chongqing:50000},state.budgets", "{tokyo:65000,hongkong:55000,danang:45000,yunnan:48000,chongqing:50000,harbin:58000},state.budgets"),
    ("{tokyo:{},hongkong:{},danang:{},yunnan:{},chongqing:{}},state.done", "{tokyo:{},hongkong:{},danang:{},yunnan:{},chongqing:{},harbin:{}},state.done"),
    ("['yunnan','chongqing'].includes(state.selected)", "['yunnan','chongqing','harbin'].includes(state.selected)")]:
    replace('trip-tools-v1.js', old, new)

# Memory Journal registry and China trip inference
harbin_plan = """PLAN.harbin={country:'china',name:'Harbin + Yabuli + Snow Town 6D5N',flag:'🇨🇳',fallbackStart:'',days:[{day:1,title:'Arrival • Saint Sophia • Central Street',places:['Harbin Taiping International Airport','Saint Sophia Cathedral','Central Street','Songhua River','Stalin Park']},{day:2,title:'Sun Island • Ice & Snow World',places:['Sun Island Scenic Area','Harbin Ice & Snow World']},{day:3,title:'Harbin → Yabuli • Ski Day',places:['Harbin Railway Station','Yabuli West','Yabuli Ski Resort']},{day:4,title:'Yabuli → Snow Town • Xuexiang Night',places:['Yabuli','China Snow Town','Xuexiang','Snow Town']},{day:5,title:'Snow Town → Harbin',places:['Snow Town Morning','China Snow Town','Central Street','Harbin Music Park']},{day:6,title:'Songhua • Souvenir • Airport',places:['Songhua River','Stalin Park','Central Street','Saint Sophia Cathedral','Harbin Taiping International Airport']}]};
"""
insert_before('memory-journal-v3.js', 'function state()', harbin_plan)
old_tripmem = "function tripForMemory(m){if(m.trip&&PLAN[m.trip])return m.trip;if(m.country==='japan')return'tokyo';if(m.country==='hongkong')return'hongkong';if(m.country==='vietnam'||m.country==='vn')return'danang';if(m.country==='china'||m.country==='cn'){const q=norm((m.region||'')+' '+(m.name||''));if(/chongqing|wulong|dazu|重庆|武隆|大足/.test(q))return'chongqing';return'yunnan';}return m.trip||'other'}"
new_tripmem = "function tripForMemory(m){if(m.trip&&PLAN[m.trip])return m.trip;if(m.country==='japan')return'tokyo';if(m.country==='hongkong')return'hongkong';if(m.country==='vietnam'||m.country==='vn')return'danang';if(m.country==='china'||m.country==='cn'){const q=norm((m.region||'')+' '+(m.name||''));if(/harbin|yabuli|xuexiang|snow town|heilongjiang|mudanjiang|哈尔滨|亚布力|雪乡|黑龙江|牡丹江/.test(q))return'harbin';if(/chongqing|wulong|dazu|重庆|武隆|大足/.test(q))return'chongqing';return'yunnan';}return m.trip||'other'}"
replace('memory-journal-v3.js', old_tripmem, new_tripmem)
replace('memory-journal-v3.js', "['tokyo','hongkong','danang','yunnan','chongqing']", "['tokyo','hongkong','danang','yunnan','chongqing','harbin']")

# Plan extras: winter readiness + existing China apps/rules/emergency
replace('plan-extras-v1.js',
    "path.includes('/yunnan/')?'yunnan':path.includes('/chongqing/')?'chongqing':null;",
    "path.includes('/yunnan/')?'yunnan':path.includes('/chongqing/')?'chongqing':path.includes('/harbin/')?'harbin':null;")
harbin_extra = """DATA.harbin={emoji:'🇨🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • ปลาย ธ.ค.–ปลาย ม.ค.',seasonLead:'Ice & Snow World + Yabuli + Xuexiang ได้ Winter mood เต็มที่สุด',seasonText:'Harbin–Yabuli–Xuexiang เป็นเส้น Winter หลักของ Heilongjiang โดยช่วงกลางฤดูหนาวมีโอกาสเจอหิมะและกิจกรรมน้ำแข็งเต็มรูปแบบมากกว่า แต่ต้องเตรียมรับอุณหภูมิติดลบมากและลมแรง',seasonChips:['🧊 Ice & Snow World','🎿 Yabuli','🏘️ Snow Town','❄️ Deep winter'],seasonNote:'วันเปิด/ปิด Ice & Snow World และสภาพหิมะเปลี่ยนทุกฤดูกาล • หลังเลือกวันเดินทางให้เช็กประกาศจริงก่อนล็อกตั๋วและรถรับส่ง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนา'],['flight','ตั๋ว Bangkok ↔ Harbin'],['insurance','ประกันเดินทางที่ครอบคลุมกิจกรรมฤดูหนาว/สกีตามที่ต้องการ'],['hotel','Booking Harbin + Yabuli + Snow Town'],['iceworld','เช็กวันเปิดและ Ticket Ice & Snow World'],['shuttle','จอง Yabuli → Snow Town → Harbin และยืนยันจุดรับ/เวลา']]},{title:'เงิน เน็ต & แอปจีน',icon:'📱',items:[['esim','eSIM / SIM ที่ใช้งานใน China ได้'],['alipay','Alipay + ผูกบัตรต่างประเทศ'],['amap','Amap / Gaode Maps + เซฟชื่อจีน'],['didi','DiDi / Ride hailing'],['wechat','WeChat สำรอง'],['rail','China Railway 12306 สำหรับรถไฟ Harbin ↔ Yabuli']]},{title:'Extreme Winter',icon:'🧥',items:[['base','Thermal Base layer อย่างน้อย 2 ชุด'],['down','Down jacket หนา + ชั้นกันลม'],['boots','รองเท้ากันน้ำ/หิมะ พื้นเกาะดี'],['gloves','ถุงมือกันลม + หมวก + ผ้าปิดหน้า/คอ'],['heatpack','Heat pack / ถุงอุ่นมือ'],['skin','ลิปมัน + Moisturizer + กันแดดสำหรับหิมะ']]},{title:'หนาวจัด & อุปกรณ์',icon:'🔋',items:[['power','Power bank ค่า Wh ชัด • เก็บในกระเป๋าด้านใน'],['battery','เก็บมือถือ/แบตสำรองให้อุ่น เพราะความเย็นทำให้แบตลดเร็ว'],['thermos','กระติกน้ำอุ่นเล็ก'],['goggles','แว่นกันแดด/แว่น Ski ถ้าเล่นสกี'],['medicine','ยาประจำตัว + ยาสามัญ'],['snack','Snack halal สำรองสำหรับ Yabuli / Snow Town']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','Prayer/Qibla app'],['mat','ผ้าปูละหมาดพกพา'],['halal','ใน Amap ค้น 清真 / 清真餐厅'],['harbinhalal','เซฟร้านฮาลาลใน Harbin ก่อนออกทริป'],['yabulifood','เช็กอาหารที่ Yabuli ล่วงหน้า'],['xuexiangfood','Snow Town มีตัวเลือกจำกัด • เตรียมอาหารสำรองที่เก็บในอากาศหนาวได้']]}]};
"""
insert_before('plan-extras-v1.js', '  const d=DATA[trip];', harbin_extra)
replace('plan-extras-v1.js', '  APP_DATA.chongqing=APP_DATA.yunnan;', '  APP_DATA.chongqing=APP_DATA.yunnan;\n  APP_DATA.harbin=APP_DATA.yunnan;')
replace('plan-extras-v1.js', '  RULE_DATA.chongqing=RULE_DATA.yunnan;', "  RULE_DATA.chongqing=RULE_DATA.yunnan;\n  RULE_DATA.harbin={...RULE_DATA.yunnan,buyNote:'จีนฤดูหนาว: นอกจาก eSIM/Adapter ให้เตรียม Base layer, Down jacket, รองเท้ากันหิมะ, ถุงมือกันลม และ Heat pack ก่อนออกจากไทย • Power bank ต้องมีค่า Wh ชัดเจนและพกขึ้น Cabin'};")
replace('plan-extras-v1.js',
    "chongqing:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location ภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Jiefangbei / Xiaoshizi • เลือกโรงแรมจริงภายหลัง'}",
    "chongqing:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location ภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Jiefangbei / Xiaoshizi • เลือกโรงแรมจริงภายหลัง'},harbin:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อจีนของโรงแรม, Yabuli และ Snow Town ไว้ใน Amap • แจ้งที่พัก/คนขับก่อนเดินทางบนเส้นหิมะ',hotel:'Harbin Central Street / Yabuli / Snow Town • เลือกโรงแรมจริงภายหลัง'}")

# Plan ↔ Memory link uses existing system, only add route classification
replace('plan-memory-link-v2.js',
    "location.pathname.includes('/yunnan/')?'yunnan':location.pathname.includes('/chongqing/')?'chongqing':null;",
    "location.pathname.includes('/yunnan/')?'yunnan':location.pathname.includes('/chongqing/')?'chongqing':location.pathname.includes('/harbin/')?'harbin':null;")
replace('plan-memory-link-v2.js',
    "if(trip==='chongqing'){if(/wulong|three natural|fairy mountain|武隆|天生三桥|仙女山/.test(s))return'Wulong';if(/dazu|大足/.test(s))return'Dazu';return'Chongqing'}if(/disney|ngong",
    "if(trip==='chongqing'){if(/wulong|three natural|fairy mountain|武隆|天生三桥|仙女山/.test(s))return'Wulong';if(/dazu|大足/.test(s))return'Dazu';return'Chongqing'}if(trip==='harbin'){if(/yabuli|亚布力/.test(s))return'Yabuli';if(/xuexiang|snow town|雪乡/.test(s))return'Xuexiang';return'Harbin'}if(/disney|ngong")

# Root world map
old_china = "china:{name:'China',flag:'🇨🇳',sub:'จีน',center:[30.5,104.5],zoom:5,note:'Yunnan • Chongqing • Amap • Alipay',href:'',regions:[{name:'Kunming',center:[25.038,102.704],zoom:10,trip:'yunnan'},{name:'Dali',center:[25.695,100.165],zoom:10,trip:'yunnan'},{name:'Chongqing',center:[29.563,106.551],zoom:10,trip:'chongqing'},{name:'Wulong',center:[29.425,107.79],zoom:9,trip:'chongqing'},{name:'Dazu',center:[29.75,105.80],zoom:9,trip:'chongqing'}]},"
new_china = "china:{name:'China',flag:'🇨🇳',sub:'จีน',center:[32.5,108.0],zoom:4,note:'Yunnan • Chongqing • Harbin • Amap • Alipay',href:'',regions:[{name:'Kunming',center:[25.038,102.704],zoom:10,trip:'yunnan'},{name:'Dali',center:[25.695,100.165],zoom:10,trip:'yunnan'},{name:'Chongqing',center:[29.563,106.551],zoom:10,trip:'chongqing'},{name:'Wulong',center:[29.425,107.79],zoom:9,trip:'chongqing'},{name:'Dazu',center:[29.75,105.80],zoom:9,trip:'chongqing'},{name:'Harbin',center:[45.76,126.64],zoom:9,trip:'harbin'},{name:'Yabuli',center:[44.77,128.45],zoom:9,trip:'harbin'},{name:'Xuexiang / Snow Town',center:[44.33,128.20],zoom:10,trip:'harbin'}]},"
replace('index.html', old_china, new_china)

# Service worker / PWA
p = Path('sw.js')
s = p.read_text(encoding='utf-8')
if "const CACHE='our-journey-v76';" not in s:
    if "const CACHE='our-journey-v75';" not in s:
        raise SystemExit('unexpected SW version')
    s = s.replace("const CACHE='our-journey-v75';", "const CACHE='our-journey-v76';", 1)
s = s.replace("BASE+'chongqing/index.html',BASE+'manifest.webmanifest'", "BASE+'chongqing/index.html',BASE+'harbin/index.html',BASE+'manifest.webmanifest'")
s = s.replace("path.startsWith(BASE+'chongqing/')", "path.startsWith(BASE+'chongqing/')||path.startsWith(BASE+'harbin/')")
s = s.replace('a[href="./chongqing/"]', 'a[href="./chongqing/"],a[href="./harbin/"]')
s = s.replace('?v=75', '?v=76')
p.write_text(s, encoding='utf-8')

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = s.replace('manifest.webmanifest?v=75', 'manifest.webmanifest?v=76')
s = s.replace('ourJourneySWReloadV75', 'ourJourneySWReloadV76')
s = s.replace("./sw.js?v=75", "./sw.js?v=76")
p.write_text(s, encoding='utf-8')

p = Path('manifest.webmanifest')
data = json.loads(p.read_text(encoding='utf-8'))
data['start_url'] = '/tokyo-winter-trip-2026/?pwa=26&app=76'
p.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
