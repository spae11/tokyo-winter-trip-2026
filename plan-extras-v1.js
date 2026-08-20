(()=>{
  if(window.__travelPlanExtrasLoaded)return;
  window.__travelPlanExtrasLoaded=true;

  const path=location.pathname;
  const trip=path.includes('/tokyo/')?'tokyo':path.includes('/kansai/')?'kansai':path.includes('/hongkong/')?'hongkong':path.includes('/danang/')?'danang':path.includes('/yunnan/')?'yunnan':path.includes('/chongqing/')?'chongqing':path.includes('/harbin/')?'harbin':null;
  if(!trip)return;

  const DATA={
    tokyo:{
      emoji:'🇯🇵',
      seasonTitle:'ช่วงที่เหมาะกับทริปนี้',
      seasonBadge:'แนะนำ • ปลาย พ.ย. – กลาง ธ.ค.',
      seasonLead:'เหมาะมากกับ Tokyo Winter + Mt. Fuji + Disneyland',
      seasonText:'ช่วงต้นฤดูหนาวอากาศเย็นและค่อนข้างแห้ง เดินเมืองสบาย มีไฟ Winter Illumination และโอกาสเห็นวิวภูเขาไฟฟูจิชัดกว่าช่วงชื้น แพลน 5–10 ธ.ค. อยู่ในช่วงที่ลงตัวมาก',
      seasonChips:['❄️ Winter mood','🗻 เหมาะกับ Fuji view','✨ Illumination','🧥 ต้องเตรียมเสื้อกันหนาว'],
      seasonNote:'ปลาย ธ.ค.–ต้น ม.ค. บรรยากาศสวย แต่คนเยอะขึ้นและช่วงปีใหม่บางร้าน/บริการอาจเปลี่ยนเวลา',
      groups:[
        {title:'เอกสาร & การเดินทาง',icon:'🪪',items:[
          ['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],
          ['flight','ตั๋วเครื่องบิน + Booking โรงแรม'],
          ['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],
          ['entry','เช็กเงื่อนไขเข้าเมืองญี่ปุ่นล่าสุดก่อนออกเดินทาง'],
          ['disney','Tokyo Disneyland Ticket / QR'],
          ['fuji','จองรถ/ทัวร์ Mt. Fuji หรือ Kawaguchiko ล่วงหน้า']
        ]},
        {title:'เสื้อผ้า Winter',icon:'🧥',items:[
          ['heattech','เสื้อ Heattech / Base layer'],
          ['coat','เสื้อโค้ตหรือแจ็กเก็ตกันลม'],
          ['gloves','ถุงมือ + ผ้าพันคอ + หมวก'],
          ['socks','ถุงเท้าหนา 2–3 คู่'],
          ['shoes','รองเท้าเดินสบาย กันลื่นได้ยิ่งดี'],
          ['skin','ลิปมัน + มอยส์เจอไรเซอร์']
        ]},
        {title:'เงิน เน็ต & อุปกรณ์',icon:'📱',items:[
          ['esim','eSIM / SIM ญี่ปุ่น'],
          ['ic','Suica / PASMO หรือเตรียมวิธีจ่ายค่าเดินทาง'],
          ['cash','เงินเยนสด + บัตรเครดิต/เดบิต'],
          ['power','Power bank + สายชาร์จ'],
          ['plug','หัวปลั๊ก Type A ถ้าอุปกรณ์จำเป็นต้องใช้'],
          ['offline','บันทึกโรงแรม/สถานี/Google Maps สำคัญไว้ Offline']
        ]},
        {title:'Muslim-friendly & ของใช้ส่วนตัว',icon:'🕌',items:[
          ['prayer','แอปเวลาละหมาด + Qibla'],
          ['mat','ผ้าปูละหมาดแบบพกพา'],
          ['halal','เซฟร้านอาหารฮาลาลแต่ละวันไว้ใน Maps'],
          ['meds','ยาประจำตัว + ยาสามัญ'],
          ['bottle','ขวดน้ำพกพา / กระติกเล็ก'],
          ['bag','กระเป๋าสะพายเล็กสำหรับวัน Disney/Fuji']
        ]}
      ]
    },
    hongkong:{
      emoji:'🇭🇰',
      seasonTitle:'ช่วงที่เหมาะกับทริปนี้',
      seasonBadge:'แนะนำ • ต.ค. – ธ.ค.',
      seasonLead:'เหมาะกับ City walk + Disneyland + The Peak + Ngong Ping',
      seasonText:'ช่วงปลายปีอากาศเย็นสบายและแห้งกว่าฤดูร้อน เหมาะกับการเดินทั้งวัน นั่งกระเช้า เที่ยว The Peak และ Disneyland โดยไม่เหนื่อยจากความร้อนชื้นมากเกินไป',
      seasonChips:['🌤️ เดินเมืองสบาย','🏰 Disney ทั้งวันง่ายขึ้น','🚡 เหมาะกับ Ngong Ping','🧥 พกเสื้อคลุมบาง–กลาง'],
      seasonNote:'ช่วง พ.ค.–พ.ย. ยังเป็นฤดูที่อาจมีพายุไต้ฝุ่น โดยเฉพาะหน้าร้อน ควรเช็กพยากรณ์ก่อนวันเดินทางจริง',
      groups:[
        {title:'เอกสาร & Booking',icon:'🪪',items:[
          ['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],
          ['flight','ตั๋วเครื่องบิน + Booking โรงแรม'],
          ['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],
          ['entry','เช็กเงื่อนไขเข้าเมืองฮ่องกงล่าสุดก่อนออกเดินทาง'],
          ['disney','Hong Kong Disneyland Ticket / QR'],
          ['ngong','Ngong Ping 360 / Peak Tram ถ้าจะจองล่วงหน้า']
        ]},
        {title:'เสื้อผ้า & เดินเที่ยว',icon:'👟',items:[
          ['jacket','เสื้อคลุม/แจ็กเก็ตตามฤดูกาล'],
          ['shoes','รองเท้าเดินสบาย เพราะทริปนี้เดินเยอะ'],
          ['umbrella','ร่มพับขนาดเล็ก'],
          ['sun','กันแดด + แว่นกันแดด'],
          ['bag','กระเป๋าสะพายเล็กสำหรับ Disney/เดินเมือง'],
          ['bottle','ขวดน้ำพกพา']
        ]},
        {title:'เงิน เน็ต & การเดินทาง',icon:'📱',items:[
          ['esim','eSIM / SIM Hong Kong'],
          ['octopus','Octopus Card / Mobile Octopus'],
          ['cash','เงิน HKD สด + บัตรเครดิต/เดบิต'],
          ['power','Power bank + สายชาร์จ'],
          ['plug','หัวแปลงปลั๊ก Type G'],
          ['offline','เซฟ MTR/โรงแรม/สถานที่สำคัญใน Maps']
        ]},
        {title:'Muslim-friendly & ของใช้ส่วนตัว',icon:'🕌',items:[
          ['prayer','แอปเวลาละหมาด + Qibla'],
          ['mat','ผ้าปูละหมาดแบบพกพา'],
          ['halal','เซฟร้านฮาลาลใกล้ TST / Wan Chai / Disney'],
          ['mosque','เซฟ Kowloon Mosque + Masjid Ammar'],
          ['meds','ยาประจำตัว + ยาสามัญ'],
          ['weather','เช็กฝน/ลม/ไต้ฝุ่นก่อนวัน Peak และ Ngong Ping']
        ]}
      ]
    }
  };



DATA.kansai={emoji:'🇯🇵',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค.–พ.ค. / ต.ค.–พ.ย.',seasonLead:'Osaka + Kyoto + Nara + Kobe เดินทางง่ายและ Mood ต่างจาก Tokyo',seasonText:'Kansai เที่ยวได้ทั้งปี แต่ฤดูใบไม้ผลิและใบไม้ร่วงเหมาะกับการเดิน Kyoto/Nara มากที่สุด ส่วนหน้าหนาวคนบางจุดน้อยลงแต่กลางคืนเย็น ควรเลือกตามสไตล์ที่อยากได้มากกว่าบีบราคาตั๋ว',seasonChips:['🏯 Osaka','⛩️ Kyoto','🦌 Nara','🌃 Kobe'],seasonNote:'ช่วงซากุระ ใบไม้แดง Golden Week และวันหยุดญี่ปุ่น ราคาโรงแรมสูงขึ้นชัดเจน ควรตั้ง Budget ตามวันจริง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + สำเนาในมือถือ'],['flight','ตั๋ว BKK ↔ KIX + โหลดกระเป๋า'],['insurance','ประกันเดินทาง'],['hotel','โรงแรม Osaka 5 คืน'],['kyoto','บันทึก Route Kyoto 2 วันแยกโซน'],['entry','เช็กเงื่อนไขเข้าญี่ปุ่นล่าสุดก่อนบิน']]},{title:'เงิน เน็ต & การเดินทาง',icon:'📱',items:[['esim','eSIM / SIM ญี่ปุ่น'],['ic','ICOCA / IC Card หรือวิธีจ่าย Transit'],['maps','Google Maps + NAVITIME'],['cash','เงินเยนสด + บัตร'],['power','Power bank + สายชาร์จ'],['airport','เช็กรอบรถ KIX ↔ Osaka วันจริง']]},{title:'เดินเที่ยว Kansai',icon:'👟',items:[['shoes','รองเท้าเดินสบาย'],['weather','เสื้อผ้าตามฤดูกาล'],['umbrella','ร่มพับ'],['bag','กระเป๋า Day bag'],['bottle','ขวดน้ำ'],['early','วัน Kyoto ออกเช้าเพื่อลดคน']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','แอปเวลาละหมาด + Qibla'],['mat','ผ้าปูละหมาดพกพา'],['osaka-halal','เซฟร้านฮาลาล Namba/Osaka'],['kyoto-halal','เซฟร้านฮาลาล Kyoto'],['nara-kobe','เช็กร้าน Nara/Kobe ก่อนออก Day Trip'],['snack','พก snack halal สำรอง']]}]};
DATA.danang={emoji:'🇻🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค. – ส.ค.',seasonLead:'เหมาะกับทะเล + Ba Na Hills + Hoi An',seasonText:'ช่วงมีนาคมถึงสิงหาคมโดยทั่วไปแดดเยอะ ฝนน้อยและทะเลค่อนข้างสงบ เหมาะกับกิจกรรมกลางแจ้ง ส่วนกุมภาพันธ์ถึงเมษายนมักอากาศสบายกว่าช่วงกลางฤดูร้อน',seasonChips:['🌊 My Khe','🌉 Golden Bridge','🏮 Hoi An','☀️ Outdoor friendly'],seasonNote:'กันยายนเป็นต้นไปมีโอกาสฝนมากขึ้น ควรเช็กพยากรณ์ก่อนวัน Ba Na Hills และ Hoi An',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนาเก็บในมือถือ'],['flight','ตั๋วเครื่องบิน Bangkok ↔ Da Nang'],['insurance','ประกันเดินทาง + เบอร์ติดต่อฉุกเฉิน'],['hotel','Booking Da Nang + Hoi An'],['bana','Ba Na Hills / Golden Bridge ticket'],['basket','Basket Boat / Coconut Village ถ้าจะจองล่วงหน้า']]},{title:'เงิน เน็ต & แอป',icon:'📱',items:[['esim','eSIM / SIM Vietnam'],['grab','ติดตั้ง Grab + ผูกบัตรหรือเตรียมเงินสด'],['maps','Google Maps + เซฟโรงแรม/ร้านฮาลาล'],['cash','เงิน VND สดสำหรับร้านเล็ก/ตลาด'],['power','Power bank + สายชาร์จ'],['translate','Google Translate / ดาวน์โหลด Vietnamese offline']]},{title:'ทะเล & เดินเที่ยว',icon:'🌊',items:[['sun','กันแดด + แว่นกันแดด'],['shoes','รองเท้าเดินสบายสำหรับ Marble Mountains / Hoi An'],['umbrella','ร่มพับ / เสื้อกันฝนบาง'],['jacket','เสื้อคลุมบางสำหรับ Ba Na Hills'],['bag','กระเป๋าสะพายเล็ก'],['bottle','ขวดน้ำพกพา']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','แอปเวลาละหมาด + Qibla'],['mat','ผ้าปูละหมาดพกพา'],['halal1','เซฟ Belanga Bay Da Nang'],['halal2','เซฟร้านฮาลาลใน Hoi An และเช็กเวลาเปิดก่อนวันจริง'],['snack','พก snack สำรองสำหรับ Ba Na Hills'],['ingredients','เช็กวัตถุดิบ/แอลกอฮอล์ในเมนูที่ไม่ระบุ Halal']] }]};
DATA.yunnan={emoji:'🇨🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค.–พ.ค. / ก.ย.–พ.ย.',seasonLead:'Kunming + Dali เดินเที่ยวสบายและวิวภูเขา/ทะเลสาบสวย',seasonText:'Yunnan อยู่ทางตะวันตกเฉียงใต้ของจีน และ Kunming–Dali เชื่อมด้วยรถไฟความเร็วสูง จึงทำทริป 6 วันได้โดยไม่ต้องใช้เที่ยวบินภายในประเทศ',seasonChips:['🌸 Kunming','🏮 Dali Old Town','🌊 Erhai','🚄 High-speed rail'],seasonNote:'Yunnan มีความสูงต่างกันมาก อากาศเช้า–ค่ำอาจเย็นกว่าที่คิด ควรเช็กพยากรณ์ใกล้วันจริง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนา'],['flight','ตั๋ว Bangkok ↔ Kunming'],['insurance','ประกันเดินทาง'],['hotel','Booking Kunming + Dali'],['train','จองรถไฟ Kunming ↔ Dali และกรอกชื่อ/Passport ให้ตรง'],['entry','เช็กเงื่อนไขเข้าเมืองจีนล่าสุดก่อนบิน']]},{title:'เงิน เน็ต & แอปจีน',icon:'📱',items:[['esim','eSIM/SIM ที่ระบุการใช้งานใน China'],['alipay','ติดตั้ง Alipay + ผูกบัตรต่างประเทศก่อนบิน'],['amap','ติดตั้ง Amap / Gaode Maps และเซฟ Location'],['didi','DiDi / Ride-hailing พร้อมใช้งาน'],['wechat','WeChat สำรองสำหรับติดต่อ/ชำระเงิน'],['cash','พก RMB สดเล็กน้อยเป็นแผนสำรอง']]},{title:'เสื้อผ้า & เดินทาง',icon:'🧥',items:[['layer','เสื้อคลุมแบบ Layer สำหรับเช้า/ค่ำ'],['shoes','รองเท้าเดินสบาย'],['sun','กันแดด + แว่นกันแดด'],['umbrella','ร่มพับ'],['power','Power bank ที่ค่า Wh ชัดเจน'],['adapter','Universal Adapter / หัวปลั๊กที่เหมาะกับอุปกรณ์']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','Prayer/Qibla app'],['mat','ผ้าปูละหมาดพกพา'],['mosque','เซฟ Shuncheng Mosque 顺城清真寺'],['halal','ใน Amap ค้นคำว่า 清真 / 清真餐厅'],['snack','พก snack halal สำรองวัน Stone Forest / รถไฟ'],['translate','เซฟชื่อร้าน/โรงแรมเป็นภาษาจีนไว้ในมือถือ']]}]};

DATA.chongqing={emoji:'🇨🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • มี.ค.–พ.ค. / ก.ย.–พ.ย.',seasonLead:'Chongqing city + Wulong เดินเที่ยวสบายกว่าช่วงร้อนจัด',seasonText:'ทริปนี้ผสมเมืองภูเขา วิวกลางคืน รถไฟทะลุตึก เมืองเก่า และ Wulong โดยใช้ Amap + Alipay + DiDi เป็นแกนหลัก',seasonChips:['🌃 Hongya Cave','🚝 Liziba','🏞️ Wulong','🗿 Dazu'],seasonNote:'Chongqing มีทางขึ้นลงและบันไดเยอะ • Wulong อากาศต่างจากตัวเมืองได้ ควรเช็กพยากรณ์ใกล้วันจริง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนา'],['flight','ตั๋ว Bangkok ↔ Chongqing'],['insurance','ประกันเดินทาง'],['hotel','Booking ใกล้ Jiefangbei / Xiaoshizi'],['wulong','จอง Wulong / Three Natural Bridges ตามรอบจริง'],['dazu','เช็กการเดินทาง Dazu Rock Carvings']]},{title:'เงิน เน็ต & แอป',icon:'📱',items:[['esim','eSIM / SIM ที่ใช้ในจีนได้'],['amap','Amap / Gaode Maps'],['alipay','Alipay + ผูกบัตร'],['didi','DiDi / Ride hailing'],['wechat','WeChat สำรอง'],['power','Power bank ค่า Wh ชัด + เช็ก CCC ถ้ามี Domestic Flight']]},{title:'เดินเมืองภูเขา',icon:'👟',items:[['shoes','รองเท้าเดินสบาย/พื้นเกาะดี'],['umbrella','ร่มพับ'],['layers','เสื้อคลุมตามฤดูกาล'],['bag','กระเป๋าสะพายเล็ก'],['bottle','ขวดน้ำ'],['offline','บันทึกชื่อจีนของโรงแรม/Location']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','เวลา Salah + Qibla'],['mat','ผ้าปูละหมาดพกพา'],['halal','ใช้ Amap ค้น 清真餐厅'],['mosque','เซฟ 重庆清真寺 / จุดละหมาด'],['snack','Snack สำรองสำหรับ Wulong/Dazu'],['ingredients','เช็กส่วนผสมซุป/น้ำมัน/แอลกอฮอล์']]}]};
DATA.harbin={emoji:'🇨🇳',seasonTitle:'ช่วงที่เหมาะกับทริปนี้',seasonBadge:'แนะนำ • ปลาย ธ.ค.–ปลาย ม.ค.',seasonLead:'Ice & Snow World + Yabuli + Xuexiang ได้ Winter mood เต็มที่สุด',seasonText:'Harbin–Yabuli–Xuexiang เป็นเส้น Winter หลักของ Heilongjiang โดยช่วงกลางฤดูหนาวมีโอกาสเจอหิมะและกิจกรรมน้ำแข็งเต็มรูปแบบมากกว่า แต่ต้องเตรียมรับอุณหภูมิติดลบมากและลมแรง',seasonChips:['🧊 Ice & Snow World','🎿 Yabuli','🏘️ Snow Town','❄️ Deep winter'],seasonNote:'วันเปิด/ปิด Ice & Snow World และสภาพหิมะเปลี่ยนทุกฤดูกาล • หลังเลือกวันเดินทางให้เช็กประกาศจริงก่อนล็อกตั๋วและรถรับส่ง',groups:[{title:'เอกสาร & Booking',icon:'🪪',items:[['passport','พาสปอร์ต + รูป/สำเนา'],['flight','ตั๋ว Bangkok ↔ Harbin'],['insurance','ประกันเดินทางที่ครอบคลุมกิจกรรมฤดูหนาว/สกีตามที่ต้องการ'],['hotel','Booking Harbin + Yabuli + Snow Town'],['iceworld','เช็กวันเปิดและ Ticket Ice & Snow World'],['shuttle','จอง Yabuli → Snow Town → Harbin และยืนยันจุดรับ/เวลา']]},{title:'เงิน เน็ต & แอปจีน',icon:'📱',items:[['esim','eSIM / SIM ที่ใช้งานใน China ได้'],['alipay','Alipay + ผูกบัตรต่างประเทศ'],['amap','Amap / Gaode Maps + เซฟชื่อจีน'],['didi','DiDi / Ride hailing'],['wechat','WeChat สำรอง'],['rail','China Railway 12306 สำหรับรถไฟ Harbin ↔ Yabuli']]},{title:'Extreme Winter',icon:'🧥',items:[['base','Thermal Base layer อย่างน้อย 2 ชุด'],['down','Down jacket หนา + ชั้นกันลม'],['boots','รองเท้ากันน้ำ/หิมะ พื้นเกาะดี'],['gloves','ถุงมือกันลม + หมวก + ผ้าปิดหน้า/คอ'],['heatpack','Heat pack / ถุงอุ่นมือ'],['skin','ลิปมัน + Moisturizer + กันแดดสำหรับหิมะ']]},{title:'หนาวจัด & อุปกรณ์',icon:'🔋',items:[['power','Power bank ค่า Wh ชัด • เก็บในกระเป๋าด้านใน'],['battery','เก็บมือถือ/แบตสำรองให้อุ่น เพราะความเย็นทำให้แบตลดเร็ว'],['thermos','กระติกน้ำอุ่นเล็ก'],['goggles','แว่นกันแดด/แว่น Ski ถ้าเล่นสกี'],['medicine','ยาประจำตัว + ยาสามัญ'],['snack','Snack halal สำรองสำหรับ Yabuli / Snow Town']]},{title:'Muslim-friendly',icon:'🕌',items:[['prayer','Prayer/Qibla app'],['mat','ผ้าปูละหมาดพกพา'],['halal','ใน Amap ค้น 清真 / 清真餐厅'],['harbinhalal','เซฟร้านฮาลาลใน Harbin ก่อนออกทริป'],['yabulifood','เช็กอาหารที่ Yabuli ล่วงหน้า'],['xuexiangfood','Snow Town มีตัวเลือกจำกัด • เตรียมอาหารสำรองที่เก็บในอากาศหนาวได้']]}]};
  const d=DATA[trip];
  const style=document.createElement('style');
  style.id='plan-extras-style';
  style.textContent=`
    .px-sec{padding:46px 0}.px-wrap{width:min(1100px,calc(100% - 24px));margin:auto}.px-ey{font-size:.8rem;color:#B21F2D;font-weight:900;letter-spacing:.08em}.px-title{font-size:clamp(1.8rem,5vw,2.6rem);margin:4px 0 18px}.px-season{background:linear-gradient(135deg,#fff,#F5EFE4);border:1px solid #00000012;border-radius:24px;padding:20px;box-shadow:0 12px 32px #372a2510}.px-season-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}.px-season h3{font-size:1.45rem;margin:4px 0 6px}.px-season p{margin:0;color:#6f7478}.px-badge{display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;background:#B21F2D;color:white;font-weight:900;font-size:.84rem}.px-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:15px}.px-chip{background:white;border:1px solid #00000012;border-radius:999px;padding:7px 10px;font-size:.82rem;font-weight:800}.px-note{margin-top:13px;padding:12px 14px;background:#fff4d7;border-radius:15px;font-size:.88rem}.px-progress-card{background:#fff;border:1px solid #00000012;border-radius:22px;padding:18px;margin-bottom:14px;box-shadow:0 10px 28px #372a2510}.px-progress-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}.px-progress-track{height:9px;background:#ece8e1;border-radius:999px;overflow:hidden}.px-progress-bar{height:100%;width:0;background:#21443A;border-radius:999px;transition:width .35s ease}.px-check-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.px-group{background:#fff;border:1px solid #00000012;border-radius:20px;padding:16px;box-shadow:0 10px 28px #372a2510}.px-group h3{margin:0 0 10px;font-size:1.05rem}.px-item{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px dashed #00000010;cursor:pointer}.px-item:first-of-type{border-top:0}.px-item input{width:20px;height:20px;min-width:20px;margin-top:2px;accent-color:#B21F2D}.px-item span{font-size:.91rem}.px-item input:checked+span{text-decoration:line-through;color:#8c9093}.px-tools{display:flex;justify-content:flex-end;margin-top:12px}.px-reset{border:0;background:#F5EFE4;color:#B21F2D;font-weight:800;border-radius:999px;padding:8px 11px;cursor:pointer}.px-fade{animation:pxIn .5s cubic-bezier(.22,1,.36,1) both}@keyframes pxIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @media(max-width:700px){.px-check-grid{grid-template-columns:1fr}.px-sec{padding:38px 0}.px-wrap{width:calc(100% - 18px)}}
  `;
  document.head.appendChild(style);

  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const season=document.createElement('section');
  season.className='px-sec px-fade';
  season.id='best-season';
  season.innerHTML=`<div class="px-wrap"><div class="px-ey">BEST TIME TO GO</div><h2 class="px-title">${esc(d.seasonTitle)} ${d.emoji}</h2><div class="px-season"><div class="px-season-top"><div><span class="px-badge">${esc(d.seasonBadge)}</span><h3>${esc(d.seasonLead)}</h3><p>${esc(d.seasonText)}</p></div></div><div class="px-chips">${d.seasonChips.map(x=>`<span class="px-chip">${esc(x)}</span>`).join('')}</div><div class="px-note">💡 ${esc(d.seasonNote)}</div></div></div>`;

  const main=document.querySelector('main');
  if(main && !document.getElementById('best-season')) main.insertBefore(season,main.firstElementChild);

  const old=document.getElementById('checks');
  if(old){const oldSec=old.closest('section');if(oldSec)oldSec.style.display='none'}

  const checklist=document.createElement('section');
  checklist.className='px-sec px-fade';
  checklist.id='trip-checklist';
  const allItems=d.groups.flatMap(g=>g.items);
  checklist.innerHTML=`<div class="px-wrap"><div class="px-ey">TRIP READINESS</div><h2 class="px-title">ของที่ต้องเตรียมก่อนทริป ${d.emoji}</h2><div class="px-progress-card"><div class="px-progress-head"><b>ความพร้อมของทริป</b><span id="px-count">0 / ${allItems.length}</span></div><div class="px-progress-track"><div class="px-progress-bar" id="px-bar"></div></div></div><div class="px-check-grid">${d.groups.map(g=>`<div class="px-group"><h3>${g.icon} ${esc(g.title)}</h3>${g.items.map(([id,label])=>`<label class="px-item"><input type="checkbox" data-px-id="${trip}-${id}"><span>${esc(label)}</span></label>`).join('')}</div>`).join('')}</div><div class="px-tools"><button class="px-reset" type="button" id="px-reset">ล้าง Checklist</button></div></div>`;

  const footer=document.querySelector('footer');
  if(footer)footer.before(checklist);else if(main)main.appendChild(checklist);else document.body.appendChild(checklist);

  const key='tripChecklistV2:'+trip;
  let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
  const boxes=[...checklist.querySelectorAll('input[data-px-id]')];
  boxes.forEach(b=>{b.checked=!!saved[b.dataset.pxId]});
  const update=()=>{
    const done=boxes.filter(b=>b.checked).length;
    const count=checklist.querySelector('#px-count');const bar=checklist.querySelector('#px-bar');
    if(count)count.textContent=`${done} / ${boxes.length}`;
    if(bar)bar.style.width=(boxes.length?done/boxes.length*100:0)+'%';
  };
  boxes.forEach(b=>b.addEventListener('change',()=>{saved[b.dataset.pxId]=b.checked;try{localStorage.setItem(key,JSON.stringify(saved))}catch(e){}update()}));
  const reset=checklist.querySelector('#px-reset');
  if(reset)reset.addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);saved={};try{localStorage.removeItem(key)}catch(e){}update()});
  update();


  /* TRAVEL_APPS_V64 */
  const APP_DATA={
    danang:[
      {icon:'🚕',name:'Grab',badge:'ต้องมี • เดินทาง',platform:'iPhone + Android',desc:'ใช้เรียกรถจากสนามบิน ไป Ba Na Hills ระหว่าง Da Nang–Hoi An และกลับโรงแรม พร้อมเห็นค่าโดยสารก่อนจอง',url:'https://www.grab.com/global/airport-rides/da-nang-international-airport/'},
      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'เซฟโรงแรม ร้านฮาลาล จุดรับ Grab และสถานที่เที่ยวทั้งหมดไว้ก่อนเดินทาง',url:'https://www.google.com/maps'},
      {icon:'🗣️',name:'Google Translate',badge:'แนะนำ',platform:'iPhone + Android',desc:'ดาวน์โหลดภาษา Vietnamese แบบ Offline ไว้ช่วยอ่านเมนู ป้าย และสื่อสารกับคนขับหรือร้านเล็ก',url:'https://translate.google.com/'}
    ],
    yunnan:[
      {icon:'🗺️',name:'Amap / Gaode Maps 高德地图',badge:'ต้องมี • Maps หลัก',platform:'iPhone + Android',desc:'ใช้เป็นแผนที่หลักในจีนแผ่นดินใหญ่สำหรับค้น POI เดินทาง รถสาธารณะ และเรียกรถ • ระบบ Location ของทริปจีนจะเปิด Amap ก่อน',url:'https://www.amap.com/'},
      {icon:'💙',name:'Alipay',badge:'ต้องมี • Payment',platform:'iPhone + Android',desc:'ผูกบัตรต่างประเทศก่อนเดินทาง ใช้ QR จ่ายร้านค้าและเปิด Transport/Taxi ได้ในแอปเดียว',url:'https://www.alipay.com/'},
      {icon:'🚕',name:'DiDi Greater China',badge:'แนะนำ • Ride hailing',platform:'iPhone + Android',desc:'เรียกรถใน Kunming/Dali และใช้ชื่อ Location ภาษาจีนจาก Amap ช่วยลดการสื่อสารผิดจุด',url:'https://www.didiglobal.com/'},
      {icon:'💬',name:'WeChat / Weixin Pay',badge:'แนะนำ',platform:'iPhone + Android',desc:'ใช้ติดต่อร้าน/โรงแรม และเป็นช่องทางชำระเงินสำรองเมื่อผูกบัตรที่รองรับแล้ว',url:'https://www.wechat.com/'},
      {icon:'🚄',name:'China Railway 12306',badge:'แนะนำ • รถไฟ',platform:'Web + App',desc:'เช็กรอบและตั๋วรถไฟ Kunming ↔ Dali • เว็บทางการมีภาษาอังกฤษ',url:'https://www.12306.cn/en/index.html'}
    ],
    tokyo:[
      {icon:'💳',name:'Welcome Suica Mobile',badge:'ต้องมี • iPhone',platform:'iOS / Apple Wallet',desc:'ใช้รถไฟ รถบัส และจ่ายร้านค้าที่มี IC ได้สะดวกมาก • Android ให้ใช้ Suica/PASMO แบบบัตรแทน',url:'https://www.jreast.co.jp/en/multi/welcomesuicamobile/?lng=en'},
      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'ดูรถไฟ ทางออกสถานี เวลาเดิน และเส้นทางแบบ Transit • เซฟโรงแรมกับจุดเที่ยวไว้ก่อนเดินทาง',url:'https://www.google.com/maps'},
      {icon:'🚕',name:'GO Taxi',badge:'แนะนำ • Taxi',platform:'iPhone + Android',desc:'เรียกแท็กซี่ในญี่ปุ่น ใช้ได้ทั่ว 47 จังหวัด และรองรับบัตรต่างประเทศ/Apple Pay ตามเงื่อนไขของบริการ',url:'https://go.goinc.jp/en/'},
      {icon:'🚆',name:'Japan Travel by NAVITIME',badge:'แนะนำ • รถไฟ',platform:'iPhone + Android',desc:'เช็กเส้นทางรถไฟ ตารางเวลา ค่าโดยสาร ทางออก และการต่อรถ เหมาะใช้คู่กับ Google Maps',url:'https://japantravel.navitime.com/en/'}
    ],
    hongkong:[
      {icon:'🐙',name:'Octopus App for Tourists',badge:'ต้องมี • iPhone',platform:'iOS / Apple Wallet',desc:'ใช้ MTR รถบัส ร้านสะดวกซื้อ และร้านค้าจำนวนมาก • Android แนะนำใช้บัตร Octopus จริง',url:'https://www.octopus.com.hk/en/consumer/tourist/apple-pay/index.html'},
      {icon:'🚇',name:'MTR Mobile',badge:'ต้องมี',platform:'iPhone + Android',desc:'ดูเส้นทาง MTR ค่าโดยสาร เวลารถไฟ ทางออกสถานี และสถานะการเดินรถแบบละเอียด',url:'https://www.mtr.com.hk/mtrmobile/en/'},
      {icon:'🚌',name:'HKeMobility',badge:'แนะนำ • ขนส่ง',platform:'iPhone + Android',desc:'แอปทางการของ Transport Department สำหรับ MTR/Bus/Ferry/เดินเท้า พร้อมเวลาถึงและข่าวจราจร',url:'https://www.td.gov.hk/en/public_services/hong_kong_emobility/'},
      {icon:'🚕',name:'Uber',badge:'แนะนำ • Taxi',platform:'iPhone + Android',desc:'เรียกรถหรือ Hong Kong Taxi จากแอป เหมาะตอนกลับดึก มีสัมภาระ หรือเดินทางจากจุดที่ต่อรถไม่สะดวก',url:'https://www.uber.com/hk/en/ride/'},
      {icon:'🗺️',name:'Google Maps',badge:'ต้องมี',platform:'iPhone + Android',desc:'ใช้เดินเมือง หาอาหารฮาลาล และดูเส้นทางระหว่างสถานที่ ใช้คู่กับ MTR Mobile จะสะดวกที่สุด',url:'https://www.google.com/maps'},
      {icon:'💙',name:'Alipay / Alipay+',badge:'เสริม • Payment',platform:'ถ้ามีอยู่แล้วใช้ต่อได้',desc:'ใช้ได้กับร้านที่รองรับ Alipay+ ในฮ่องกง แต่ทริปนี้ให้ Octopus + บัตรเครดิตเป็นช่องทางหลัก ไม่จำเป็นต้องสมัครใหม่',url:'https://www.alipayplus.com/consumer/'}
    ]
  };
  APP_DATA.kansai=APP_DATA.tokyo;
  APP_DATA.chongqing=APP_DATA.yunnan;
  APP_DATA.harbin=APP_DATA.yunnan;
  function injectTravelApps(){
    if(document.getElementById('travel-apps'))return;
    const apps=APP_DATA[trip]||[];
    if(!apps.length)return;
    style.textContent+=`.px-app-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.px-app-card{background:#fff;border:1px solid #00000012;border-radius:20px;padding:15px;box-shadow:0 10px 28px #372a2510;display:flex;flex-direction:column;min-height:180px}.px-app-head{display:flex;align-items:flex-start;gap:10px}.px-app-icon{width:44px;height:44px;border-radius:14px;background:#f5efe4;display:grid;place-items:center;font-size:1.35rem;flex:none}.px-app-name{font-weight:900;font-size:1rem;line-height:1.25}.px-app-badge{display:inline-flex;margin-top:5px;padding:4px 8px;border-radius:999px;background:#eef4f0;color:#176b3d;font-size:.67rem;font-weight:900}.px-app-platform{margin-top:8px;color:#777;font-size:.72rem;font-weight:800}.px-app-desc{margin:6px 0 12px;color:#676d70;font-size:.82rem;line-height:1.55;flex:1}.px-app-link{align-self:flex-start;text-decoration:none;border-radius:999px;background:#1e2428;color:#fff;padding:8px 11px;font-size:.72rem;font-weight:900}.px-app-note{margin:0 0 13px;padding:11px 13px;border-radius:15px;background:#fff4d7;color:#6d571d;font-size:.8rem}.px-app-link:active{transform:scale(.98)}@media(max-width:700px){.px-app-grid{grid-template-columns:1fr}.px-app-card{min-height:0}}`;
    const sec=document.createElement('section');
    sec.className='px-sec px-fade';sec.id='travel-apps';
    const note=['yunnan','chongqing'].includes(trip)?'จีนแผ่นดินใหญ่ใช้ Amap / Gaode Maps เป็น Maps หลัก • Alipay เป็น Payment หลัก • DiDi สำหรับเรียกรถ • Location ในแพลนจีนเปิด Amap ก่อน Google Maps':trip==='hongkong'?'ฮ่องกงไม่จำเป็นต้องใช้ DiDi/Alipay เป็นหลักเหมือนจีนแผ่นดินใหญ่ — Octopus + MTR Mobile + Uber เหมาะกับทริปนี้มากกว่า':trip==='danang'?'เวียดนามใช้ Grab + Google Maps เป็นหลัก • เตรียมเงิน VND สดไว้สำหรับร้านเล็กและตลาด':'ญี่ปุ่นใช้ IC Card + Maps เป็นหลัก ส่วนแท็กซี่ติด GO ไว้เป็นตัวสำรอง';
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">TRAVEL APPS</div><h2 class="px-title">แอปที่ควรติดตั้งก่อนเดินทาง ${d.emoji}</h2><div class="px-app-note">📱 ${esc(note)}</div><div class="px-app-grid">${apps.map(a=>`<article class="px-app-card"><div class="px-app-head"><div class="px-app-icon">${a.icon}</div><div><div class="px-app-name">${esc(a.name)}</div><span class="px-app-badge">${esc(a.badge)}</span></div></div><div class="px-app-platform">${esc(a.platform)}</div><div class="px-app-desc">${esc(a.desc)}</div><a class="px-app-link" href="${a.url}" target="_blank" rel="noopener">เปิดเว็บทางการ ↗</a></article>`).join('')}</div></div>`;
    const checklist=document.getElementById('trip-checklist');
    if(checklist?.parentNode)checklist.parentNode.insertBefore(sec,checklist);else document.querySelector('main')?.appendChild(sec);
  }
  injectTravelApps();






  /* TRIP_BUDGET_BREAKDOWN_V81 — restore per-category planning budget on every trip. */
  const TRIP_BUDGET_BREAKDOWN_V81={
    tokyo:{total:85000,note:'Tokyo Winter + Disneyland + Mt. Fuji • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','34,000','BKK ↔ Tokyo • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','17,000','5 คืน • Asakusa / ระดับกลาง'],
      ['🚆','เดินทาง','7,000','สนามบิน + รถไฟ/Metro + Fuji transport'],
      ['🎟️','ตั๋ว & กิจกรรม','12,000','Disneyland + Fuji/Ropeway + ค่าเข้า'],
      ['🍽️','อาหาร','10,000','6 วัน • 2 คน • เผื่อร้าน Halal'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + ค่าใช้จ่ายจุกจิก']
    ]},
    kansai:{total:90000,note:'Osaka + Kyoto + Nara + Kobe • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','35,000','BKK ↔ KIX • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','20,000','5 คืน • Osaka/Namba ระดับกลาง'],
      ['🚆','เดินทาง','10,000','KIX + Osaka/Kyoto/Nara/Kobe'],
      ['🎟️','ตั๋ว & กิจกรรม','5,000','วัด / จุดชมวิว / ค่าเข้า'],
      ['🍽️','อาหาร','14,000','6 วัน • 2 คน'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','6,000','เน็ต + ประกัน + Buffer']
    ]},
    hongkong:{total:70000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','17,000','5 คืน • Tsim Sha Tsui / Kowloon'],
      ['🚇','เดินทาง','5,000','Airport + MTR + Ferry + Octopus'],
      ['🎟️','ตั๋ว & กิจกรรม','10,000','Disneyland + Ngong Ping + Peak Tram'],
      ['🍽️','อาหาร','11,000','6 วัน • 2 คน • Halal/Muslim-friendly'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]},
    danang:{total:50000,note:'Da Nang + Hoi An + Ba Na Hills • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','15,000','Bangkok ↔ Da Nang • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','11,000','5 คืน • Da Nang + Hoi An'],
      ['🚕','เดินทาง','5,000','Airport + Grab + Da Nang ↔ Hoi An'],
      ['🎟️','ตั๋ว & กิจกรรม','7,000','Ba Na Hills + Basket Boat + ค่าเข้า'],
      ['🍽️','อาหาร','7,000','6 วัน • 2 คน'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]},
    yunnan:{total:52000,note:'Kunming + Dali 6D5N • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','16,000','Bangkok ↔ Kunming • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','10,000','5 คืน • Kunming + Dali'],
      ['🚄','เดินทาง','7,000','Airport + HSR Kunming↔Dali + DiDi'],
      ['🎟️','ตั๋ว & กิจกรรม','6,000','Stone Forest + Erhai/Three Pagodas + ค่าเข้า'],
      ['🍽️','อาหาร','8,000','6 วัน • 2 คน • 清真/Halal'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]},
    chongqing:{total:60000,note:'Chongqing + Wulong 6D5N • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','Bangkok ↔ Chongqing • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','10,000','5 คืน • Jiefangbei/Xiaoshizi'],
      ['🚄','เดินทาง','8,000','Airport + Metro/DiDi + Wulong/Dazu'],
      ['🎟️','ตั๋ว & กิจกรรม','6,000','Cableway + Wulong + Dazu/ค่าเข้า'],
      ['🍽️','อาหาร','8,000','6 วัน • 2 คน • 清真/Halal'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','6,000','เน็ต + ประกัน + Buffer']
    ]},
    harbin:{total:75000,note:'Harbin + Yabuli + Snow Town 6D5N • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','Bangkok ↔ Harbin • 2 คน + กระเป๋า'],
      ['🏨','โรงแรม','13,000','Harbin + Yabuli + Snow Town • 5 คืน'],
      ['🚄','เดินทาง','10,000','Airport + รถไฟ/Transfer Yabuli–Xuexiang'],
      ['🎿','ตั๋ว & กิจกรรม','14,000','Ice & Snow World + Ski + Snow Town'],
      ['🍽️','อาหาร','9,000','6 วัน • 2 คน'],
      ['🧥','Winter gear / eSIM / ประกัน / เผื่อ','7,000','อุปกรณ์หนาว + เน็ต + ประกัน + Buffer']
    ]}
  };
  function injectTripBudgetBreakdown(){
    if(document.getElementById('trip-budget-breakdown'))return;
    const d=TRIP_BUDGET_BREAKDOWN_V81[trip];if(!d)return;
    const st=document.createElement('style');st.dataset.tripBudgetBreakdown='81';st.textContent=`
      .px-bg-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}.px-bg-total{padding:9px 13px;border-radius:15px;background:#1e2428;color:#fff;font-weight:900;white-space:nowrap}.px-bg-total b{font-size:1.18rem}.px-bg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.px-bg-item{background:#fff;border:1px solid #00000012;border-radius:18px;padding:13px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:start;box-shadow:0 8px 24px #372a2510}.px-bg-icon{width:40px;height:40px;border-radius:13px;background:#f5efe4;display:grid;place-items:center;font-size:1.2rem}.px-bg-name{font-size:.78rem;color:#666d70;font-weight:800}.px-bg-money{font-size:1.05rem;font-weight:900;color:#b21f2d;line-height:1.3}.px-bg-desc{margin-top:3px;color:#777;font-size:.69rem;line-height:1.45}.px-bg-note{margin-top:11px;padding:10px 12px;border-radius:14px;background:#eef4f0;color:#355e48;font-size:.74rem;line-height:1.5}@media(max-width:760px){.px-bg-grid{grid-template-columns:1fr 1fr}}@media(max-width:460px){.px-bg-grid{grid-template-columns:1fr}.px-bg-item{grid-template-columns:40px minmax(0,1fr)}}`;
    document.head.appendChild(st);
    const sec=document.createElement('section');sec.id='trip-budget-breakdown';sec.className='px-sec px-fade';
    sec.innerHTML=`<div class="px-wrap"><div class="px-bg-head"><div><div class="px-ey">TRIP BUDGET • 2 PEOPLE</div><h2>💰 งบประมาณแยกรายหมวด</h2><p class="px-muted">${d.note} • เป็นงบวางแผนตามราคาทั่วไป ไม่ใช่ราคาต่ำสุด</p></div><div class="px-bg-total">รวมประมาณ <b>${Number(d.total).toLocaleString('th-TH')} ฿</b></div></div><div class="px-bg-grid">${d.items.map(x=>`<div class="px-bg-item"><div class="px-bg-icon">${x[0]}</div><div><div class="px-bg-name">${x[1]}</div><div class="px-bg-money">~${x[2]} ฿</div><div class="px-bg-desc">${x[3]}</div></div></div>`).join('')}</div><div class="px-bg-note">🧾 ไม่รวมช้อปปิ้ง/ของฝากหนัก ๆ • ค่าใช้จริงสามารถบันทึกแยกใน <b>Trip Tools → ค่าใช้จ่าย</b> ได้ และตัวเลขนี้ควรปรับอีกครั้งหลังเลือกวันบินกับโรงแรมจริง</div></div>`;
    const souvenir=document.getElementById('trip-souvenirs');
    if(souvenir?.parentNode)souvenir.parentNode.insertBefore(sec,souvenir);else{const apps=document.getElementById('travel-apps');if(apps?.parentNode)apps.insertAdjacentElement('afterend',sec);else document.querySelector('main')?.appendChild(sec)}
  }
  injectTripBudgetBreakdown();

  /* SOUVENIR_GUIDE_V80 — one shared souvenir section for every trip. */
  const WIKI_IMG=f=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(f)+'?width=640';
  const WIKI_FILE=f=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(String(f).replaceAll(' ','_'));
  const SOUVENIR_DATA={
    tokyo:[
      {name:'Tokyo Banana',level:'must',badge:'ต้องซื้อ',price:'ประมาณ ¥1,000–2,000',where:'Tokyo Station / Haneda / Narita / ร้านของฝากใหญ่',desc:'ของฝาก Tokyo ที่คนจำได้ทันที แบ่งฝากง่ายและแพ็กกลับสะดวก',file:'Tokyo Banana - 4.jpg'},
      {name:'Gachapon / Capsule Toy',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ ¥300–500 / ครั้ง',where:'Akihabara / Shinjuku / สถานีใหญ่',desc:'เลือกธีมที่ชอบได้เอง เหมาะเป็นของฝากชิ้นเล็กหรือเก็บเป็น Memory',file:'Wall of Gachapon, Akihabara.jpg'},
      {name:'Matcha / ขนมชาเขียวญี่ปุ่น',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ ¥700–2,500',where:'ห้าง / Tokyo Station / สนามบิน',desc:'เหมาะซื้อฝากหลายคน เลือกแบบซองแยกจะพกและแบ่งง่ายกว่า',file:'Matcha stone mill grinding tencha into powder.jpg'}
    ],
    kansai:[
      {name:'Nama Yatsuhashi',level:'must',badge:'ต้องซื้อ',price:'ประมาณ ¥700–1,500',where:'Kyoto Station / Gion / ร้านขนม Kyoto',desc:'ขนมประจำ Kyoto เนื้อนุ่ม กลิ่นอบเชยหรือชาเขียว เหมาะซื้อกลับที่สุดของทริปนี้',file:'Yatsuhashi 002.jpg'},
      {name:'Uji Matcha',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ ¥1,000–3,000',where:'Uji / Kyoto Station / ร้านชา',desc:'ซื้อเป็นผงชา ชาใบ หรือขนม Matcha ได้ ถ้าชอบชาให้เลือกร้านเฉพาะทาง',file:'Tencha on traditional stone mill in Uji Japan.jpg'},
      {name:'Kobe Pudding / ขนมพุดดิ้ง',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ ¥1,200–2,500',where:'Sannomiya / Kobe Station / ร้านของฝาก',desc:'เหมาะฝากคนสนิทหรือซื้อกินเอง เลือกกล่องที่เก็บอุณหภูมิห้องได้ถ้าต้องเดินทางต่อ',file:'Pudding Dessert.jpg'}
    ],
    hongkong:[
      {name:'Jenny Bakery Cookies',level:'must',badge:'ต้องซื้อ',price:'ประมาณ HK$100–250',where:'สาขาทางการ Central / Tsim Sha Tsui',desc:'คุกกี้กระป๋องยอดนิยมของ Hong Kong ควรซื้อจากสาขาทางการและเผื่อเวลาคิว',file:'HK 中環 Central 永和街 Wing Wo Street shop 珍妮曲奇 Jenny Bakery n visitors long queue March 2026 N13P 04.jpg'},
      {name:'Egg Rolls / 蛋卷',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ HK$80–180',where:'Maxim’s / ร้านขนม / สนามบิน',desc:'เบา กรอบ และแบ่งฝากง่าย เลือกกระป๋องแข็งเพื่อลดแตกในกระเป๋า',file:"HK food 美心餅店 Maxim's Cake Shop 蛋卷 egg cookie rolls June 2020 SS2 01.jpg"},
      {name:'Chinese Tea / ชาจีน',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ HK$100–400',where:'ร้านชา / ห้าง / Central',desc:'เหมาะกับคนดื่มชา เลือกแพ็กขนาดเล็กก่อนถ้ายังไม่รู้รสที่ชอบ',file:'Linong Tea House.JPG'}
    ],
    danang:[
      {name:'Vietnamese Coffee',level:'must',badge:'ต้องซื้อ',price:'ประมาณ 120K–350K VND',where:'Han Market / ร้านกาแฟ / Hoi An',desc:'เลือกเมล็ดหรือกาแฟบดพร้อม Phin เป็นชุด จะได้ของฝากที่เป็นเวียดนามชัดที่สุด',file:'MR.VIET Hoi An Store.jpg'},
      {name:'Hoi An Lantern',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ 150K–500K VND',where:'Hoi An Ancient Town',desc:'ของฝากเด่นของ Hoi An เลือกแบบพับได้เพื่อใส่กระเป๋าง่ายและไม่กินพื้นที่',file:'Hoi An Lantern Shop.jpg'},
      {name:'Coconut Candy',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ 50K–150K VND',where:'ตลาด / ร้านของฝาก Da Nang–Hoi An',desc:'เหมาะซื้อฝากหลายคน ราคาไม่สูง แต่ควรเช็กวันหมดอายุและส่วนผสมก่อนซื้อ',file:'Vietnamese coconut candy.jpg'}
    ],
    yunnan:[
      {name:'Pu-erh Tea / ชาผู่เอ๋อร์',level:'must',badge:'ต้องซื้อ',price:'ประมาณ ¥80–300 CNY',where:'Kunming / Dali / ร้านชา',desc:'ของเด่น Yunnan มากที่สุด ซื้อขนาดทดลองหรือก้อนเล็กก่อนถ้ายังไม่คุ้นรสชา',file:'Yunnan Sourcing "Golden Pig" Raw Pu-erh Tea Cake - outer packaging - WikiTea.jpg'},
      {name:'Yunnan Flower Cake / 鲜花饼',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ ¥30–100 CNY',where:'Kunming Old Street / Dali / ร้านเบเกอรี่',desc:'ขนมไส้กุหลาบหอมและพกง่าย เหมาะฝากหลายคน เลือกกล่องที่มีวันผลิตใหม่',file:'云南玫瑰鲜花饼-2164122.jpg'},
      {name:'Bai Tie-dye / ผ้ามัดย้อมต้าหลี่',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ ¥50–200 CNY',where:'Xizhou / Dali Ancient City',desc:'เหมาะซื้อเป็นผ้าพันคอ ถุงผ้า หรือของแต่งบ้าน ได้ของฝากที่ใช้ได้นานกว่าขนม',file:'扎染工艺品-大理祥云 2.jpg'}
    ],
    chongqing:[
      {name:'Chongqing Hotpot Base / 火锅底料',level:'must',badge:'ต้องซื้อ',price:'ประมาณ ¥20–60 CNY',where:'Supermarket / Jiefangbei / Ciqikou',desc:'ของฝากที่เป็น Chongqing ชัดที่สุด เลือกแพ็กซีลแน่นและเช็กส่วนผสมก่อนซื้อ',file:'Chongqing.Original Sichuan hotpot base.jpg'},
      {name:'Sichuan Pepper / 花椒',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ ¥20–80 CNY',where:'ตลาดเครื่องเทศ / Supermarket',desc:'กลิ่นหอมชาแบบหมาล่า ใช้ทำอาหารที่บ้านได้ง่ายและน้ำหนักกระเป๋าน้อย',file:'Sichuan pepper.jpg'},
      {name:'Chongqing Noodles / 小面 แบบแพ็ก',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ ¥10–40 CNY',where:'Supermarket / ร้านของฝาก',desc:'เหมาะสำหรับคนชอบรสเผ็ด ซื้อแบบแพ็กสำเร็จกลับมาทำง่ายกว่าเครื่องปรุงหลายถุง',file:'Noodle di Chongqing.jpg'}
    ],
    harbin:[
      {name:'Harbin Red Sausage / 红肠',level:'must',badge:'ต้องซื้อ',price:'ประมาณ ¥30–100 CNY',where:'Qiulin / Central Street / Supermarket',desc:'ของกินขึ้นชื่อ Harbin มากที่สุด เลือกแบบซีลสุญญากาศและเช็กเงื่อนไขนำอาหารกลับประเทศก่อนซื้อ',file:'China Harbin Hongchang Sausages.jpg'},
      {name:'Dalieba / 大列巴',level:'recommend',badge:'น่าซื้อ',price:'ประมาณ ¥20–60 CNY',where:'Central Street / Department Store',desc:'ขนมปังสไตล์รัสเซียชิ้นใหญ่ เป็นเอกลักษณ์ Harbin เหมาะซื้อกินระหว่างทริปหรือฝากคนใกล้ชิด',file:'Dalieba sold in Harbin.jpg'},
      {name:'Candied Hawthorn / 山楂 ของ Harbin',level:'optional',badge:'ซื้อก็ได้',price:'ประมาณ ¥15–50 CNY',where:'Central Street / ร้านของฝาก',desc:'รสเปรี้ยวหวาน ซื้อแบบแพ็กปิดสนิทจะพกกลับง่ายกว่าผลไม้เสียบไม้สด',file:'Harbin Haws.jpg'}
    ]
  };
  function injectSouvenirs(){
    if(document.getElementById('trip-souvenirs'))return;
    const items=SOUVENIR_DATA[trip]||[];if(!items.length)return;
    const st=document.createElement('style');st.dataset.souvenirGuide='80';st.textContent=`
      .px-sv-legend{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0 14px}.px-sv-legend span,.px-sv-badge{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:.68rem;font-weight:900}
      .px-sv-legend .must,.px-sv-badge.must{background:#b21f2d;color:#fff}.px-sv-legend .recommend,.px-sv-badge.recommend{background:#fff0cf;color:#805700}.px-sv-legend .optional,.px-sv-badge.optional{background:#edf0ee;color:#57615b}
      .px-sv-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.px-sv-card{background:#fff;border:1px solid #00000012;border-radius:20px;overflow:hidden;box-shadow:0 10px 28px #372a2510;display:flex;flex-direction:column;min-width:0}
      .px-sv-photo{position:relative;background:#f2eee6;aspect-ratio:4/3;overflow:hidden}.px-sv-photo img{width:100%;height:100%;display:block;object-fit:cover}.px-sv-photo-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:42px;background:linear-gradient(135deg,#f5efe4,#eef3ef);z-index:0}.px-sv-photo img{position:relative;z-index:1}
      .px-sv-body{padding:13px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}.px-sv-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.px-sv-name{font-weight:900;line-height:1.3}.px-sv-price{font-weight:900;color:#b21f2d;font-size:.82rem}.px-sv-desc,.px-sv-where{color:#666d70;font-size:.76rem;line-height:1.5}.px-sv-where b{color:#333}.px-sv-credit{margin-top:auto;color:#777;font-size:.64rem;text-decoration:none;padding-top:3px}.px-sv-note{margin-top:12px;padding:10px 12px;border-radius:14px;background:#fff4d7;color:#70591d;font-size:.75rem;line-height:1.5}
      @media(max-width:760px){.px-sv-grid{grid-template-columns:1fr}.px-sv-card{display:grid;grid-template-columns:120px minmax(0,1fr)}.px-sv-photo{height:100%;min-height:150px;aspect-ratio:auto}.px-sv-body{padding:12px}.px-sv-top{display:block}.px-sv-badge{margin-top:6px}}
      @media(max-width:390px){.px-sv-card{grid-template-columns:104px minmax(0,1fr)}.px-sv-photo{min-height:158px}.px-sv-desc{font-size:.73rem}}
    `;document.head.appendChild(st);
    const sec=document.createElement('section');sec.id='trip-souvenirs';sec.className='px-sec px-fade';
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">SOUVENIR GUIDE</div><h2>🎁 ของฝากแนะนำ</h2><p class="px-muted">เลือกของที่ควรซื้อก่อน แล้วค่อยดูของเสริมตามงบและพื้นที่กระเป๋า</p><div class="px-sv-legend"><span class="must">ต้องซื้อ</span><span class="recommend">น่าซื้อ</span><span class="optional">ซื้อก็ได้</span></div><div class="px-sv-grid">${items.map(x=>`<article class="px-sv-card"><div class="px-sv-photo"><div class="px-sv-photo-fallback">🎁</div><img loading="lazy" decoding="async" src="${WIKI_IMG(x.file)}" alt="${x.name}" onerror="this.style.display='none'"></div><div class="px-sv-body"><div class="px-sv-top"><div class="px-sv-name">${x.name}</div><span class="px-sv-badge ${x.level}">${x.badge}</span></div><div class="px-sv-price">${x.price}</div><div class="px-sv-desc">${x.desc}</div><div class="px-sv-where"><b>ซื้อที่:</b> ${x.where}</div><a class="px-sv-credit" href="${WIKI_FILE(x.file)}" target="_blank" rel="noopener">ภาพตัวอย่าง • Wikimedia Commons ↗</a></div></article>`).join('')}</div><div class="px-sv-note">ราคาเป็นช่วงประมาณสำหรับวางแผน ไม่ใช่ราคาต่ำสุด • ขนาดสินค้า ร้านค้า โปรโมชัน และฤดูกาลทำให้ราคาเปลี่ยนได้ • ของกิน/เนื้อสัตว์/ของสดให้เช็กกฎศุลกากรของเที่ยวบินจริงก่อนซื้อกลับ</div></div>`;
    const apps=document.getElementById('travel-apps');
    if(apps?.parentNode)apps.insertAdjacentElement('afterend',sec);else document.querySelector('main')?.appendChild(sec);
  }
  injectSouvenirs();

  /* TRAVEL_BUY_RULES_V66 — extends Plan Extras; no separate module. */
  const BUY_COMMON=[
    {icon:'📶',name:'Vacay eSIM',tag:'ซื้อเน็ตก่อนบิน',desc:'ซื้อ eSIM ออนไลน์ รับ QR ทันที • เช็กรุ่นมือถือและวันเริ่มนับแพ็กเกจก่อนซื้อ',action:'ซื้อ / ดูแพ็กเกจ',url:'https://esim.vacay.asia/th/th/home'},
    {icon:'🧳',name:'กระเป๋า Cabin 20 นิ้ว',tag:'ขนาดอ้างอิง',desc:'ถ้ายังไม่รู้สายการบิน ให้เล็งประมาณ 55 × 40 × 20 ซม. ก่อน แต่ขนาด/น้ำหนักจริงต้องยึดสายการบินที่จอง เพราะแต่ละสายไม่เท่ากัน',action:'ดูตัวอย่าง 55 cm',url:'https://www.samsonite.co.th/en/samsonite-black-label/sbl-cubelite/spinner-55/20-cabin/ss-56575-1374.html'},
    {icon:'🔌',name:'Universal Travel Adapter',tag:'อุปกรณ์แนะนำ',desc:'เหมาะกับทริปหลายประเทศ ใช้หัวปลั๊ก A/C/G/I ได้ในชิ้นเดียว • Adapter เปลี่ยนรูปหัวปลั๊ก ไม่ได้แปลงแรงดัน',action:'ดู Travel Adapter',url:'https://www.anker.com/collections/travel-adapter'}
  ];
  const RULE_DATA={
    tokyo:{buyNote:'ญี่ปุ่น: เตรียม eSIM + กระเป๋า Cabin + Power bank ที่มีค่า Wh ชัดเจน และเก็บ Power bank ในกระเป๋าถือเท่านั้น',rules:[
      {icon:'🔋',title:'Power bank / Lithium Battery',level:'สำคัญ',text:'Power bank ต้องอยู่ในกระเป๋าถือ ไม่โหลดใต้เครื่อง • โดยทั่วไป ≤100Wh ใช้ได้, 100–160Wh ต้องขออนุมัติสายการบิน และควรเช็กกฎสายการบินก่อนบิน',url:'https://www.iata.org/en/youandiata/travelers/batteries',link:'กฎ IATA'},
      {icon:'🇯🇵',title:'เที่ยวบินเกี่ยวกับญี่ปุ่น',level:'เช็กก่อนบิน',text:'CAAT แจ้งมาตรการญี่ปุ่นให้เก็บ Power bank ในตำแหน่งที่มองเห็นได้ ไม่ใส่ช่องเหนือศีรษะและไม่โหลดใต้เครื่อง • เช็กสายการบินจริงอีกครั้งก่อนออกเดินทาง',url:'https://www.caat.or.th/caat-media/166660/',link:'CAAT ประเทศไทย'},
      {icon:'🛃',title:'ของห้าม/ของจำกัดเข้าญี่ปุ่น',level:'ศุลกากร',text:'ยาและเครื่องสำอางบางประเภทมีข้อจำกัดปริมาณ รวมถึงพืช สัตว์ อาวุธ ยาเสพติด และสินค้าละเมิดลิขสิทธิ์ • ถ้าไม่แน่ใจให้เปิดรายการทางการก่อนแพ็ก',url:'https://www.customs.go.jp/english/summary/passenger.htm',link:'Japan Customs'}]},
    hongkong:{buyNote:'ฮ่องกง: Universal Adapter มีประโยชน์มาก โดยเฉพาะหัว Type G • กระเป๋า Cabin และน้ำหนักให้ยึดสายการบินที่จองจริง',rules:[
      {icon:'🔋',title:'Power bank / ของใช้แบตเตอรี่',level:'สำคัญ',text:'Power bank และแบตสำรองควรอยู่ในกระเป๋าถือ • สายการบินอาจเข้มกว่ากฎกลาง จึงควรเช็กเที่ยวบินจริงก่อนออกเดินทาง',url:'https://www.cad.gov.hk/english/packing_tips.html',link:'Hong Kong CAD'},
      {icon:'🚭',title:'ห้ามนำ Vape / บุหรี่ไฟฟ้าเข้า',level:'ห้ามนำเข้า',text:'ฮ่องกงห้ามนำเข้า Alternative Smoking Products รวมถึง e-cigarette / heated tobacco แม้เป็นของใช้ส่วนตัวหรือจำนวนน้อย',url:'https://www.customs.gov.hk/en/service-enforcement-information/trade-facilitation/ASP/index.html',link:'Hong Kong Customs'},
      {icon:'🛃',title:'ของควบคุม/ของต้องขออนุญาต',level:'ศุลกากร',text:'ยาอันตราย อาวุธ กระสุน ดอกไม้ไฟ สัตว์ พืช เนื้อสัตว์ และของควบคุมบางชนิดต้องมีใบอนุญาตหรือเอกสาร • เปิดรายการทางการก่อนแพ็กของพิเศษ',url:'https://www.customs.gov.hk/en/service-enforcement-information/passenger-clearance/prohibited-controlled-items/index.html',link:'รายการทางการ'}]},
    yunnan:{buyNote:'จีนแผ่นดินใหญ่: เตรียม Amap + Alipay ก่อนบิน • Power bank ควรมีค่า Wh ชัด และถ้ามีเที่ยวบินภายในจีนต้องตรวจเครื่องหมาย CCC/3C โดยเฉพาะ',rules:[
      {icon:'🔋',title:'Power bank บนเที่ยวบินภายในจีน',level:'สำคัญมาก',text:'ตั้งแต่ 28 มิ.ย. 2025 เที่ยวบินภายในประเทศจีนห้าม Power bank ที่ไม่มีเครื่องหมาย CCC/3C ชัดเจน เครื่องหมายไม่ชัด หรือเป็นรุ่นที่ถูกเรียกคืน • เส้น Kunming–Dali ในแพลนนี้ใช้รถไฟ จึงไม่ต้องขึ้น Domestic Flight ระหว่างเมือง',url:'https://www.caac.gov.cn/English/News/202507/t20250709_227894.html',link:'CAAC'},
      {icon:'🛃',title:'ของห้าม/ของต้องสำแดงเข้าจีน',level:'ศุลกากร',text:'อาวุธ วัตถุระเบิด ยาเสพติด สารพิษ และสินค้า/พืช/สัตว์บางประเภทถูกห้ามหรือควบคุม • ของใช้ส่วนตัวต้องอยู่ในปริมาณสมเหตุสมผล และของที่ไม่แน่ใจให้เลือกช่อง Declare',url:'https://english.customs.gov.cn/statics/88707c1e-aa4e-40ca-a968-bdbdbb565e4f.html',link:'China Customs'},
      {icon:'🗺️',title:'Maps ในจีน',level:'แนะนำ',text:'ใช้ Amap / Gaode เป็น Maps หลักสำหรับ Location ในจีน • Our Journey จะแสดงปุ่ม Amap ก่อน และ Google Maps เป็นตัวสำรองในหน้า Yunnan',url:'https://uri.amap.com/search?keyword=%E6%98%86%E6%98%8E&view=map&src=ourjourney&callnative=1',link:'เปิด Amap'}]},
    danang:{buyNote:'เวียดนาม: ใช้ Vacay eSIM + Grab ได้สะดวก • พก VND สดเล็กน้อย และเลือก Universal Adapter ถ้ามีอุปกรณ์หลายแบบ',rules:[
      {icon:'🔋',title:'Power bank / Lithium Battery',level:'สำคัญ',text:'Power bank ให้ใส่กระเป๋าถือ ไม่โหลดใต้เครื่อง • ≤100Wh โดยทั่วไปใช้ได้, 100–160Wh ให้ถามสายการบินก่อน และต้องมีข้อมูลความจุอ่านได้ชัด',url:'https://www.iata.org/en/youandiata/travelers/batteries',link:'กฎ IATA'},
      {icon:'✈️',title:'ของอันตรายบนเครื่อง',level:'การบินเวียดนาม',text:'อาวุธ วัตถุระเบิด สารไวไฟ และอุปกรณ์อันตรายมีข้อห้าม/ข้อจำกัดเฉพาะ • ใช้รายการของ Cục Hàng không Việt Nam เป็นข้อมูลอ้างอิงก่อนบิน',url:'https://caa.gov.vn/an-ninh-an-toan/danh-muc-vat-pham-nguy-hiem-cam-han-che-mang-vao-khu-vuc-han-che-mang-len-tau-bay-20220720081707005.htm',link:'Vietnam CAA'},
      {icon:'🛃',title:'สัมภาระและของนำเข้า',level:'ศุลกากร',text:'ของใช้ส่วนตัวตามสมควรเข้าประเทศได้ แต่ของที่เป็นสินค้าควบคุม/มีเงื่อนไขหรือเกินสิทธิ์ควรตรวจศุลกากรก่อน • ถ้ามียา อาหาร หรือของจำนวนมากให้เช็กเพิ่ม',url:'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nganh-doc.html?ma_thu_tuc=1.007659',link:'Vietnam Public Service'}]}
  };
  RULE_DATA.kansai=RULE_DATA.tokyo;
  RULE_DATA.chongqing=RULE_DATA.yunnan;
  RULE_DATA.harbin={...RULE_DATA.yunnan,buyNote:'จีนฤดูหนาว: นอกจาก eSIM/Adapter ให้เตรียม Base layer, Down jacket, รองเท้ากันหิมะ, ถุงมือกันลม และ Heat pack ก่อนออกจากไทย • Power bank ต้องมีค่า Wh ชัดเจนและพกขึ้น Cabin'};
  function injectTravelBuyRules(){
    if(document.getElementById('travel-buy-rules'))return;
    const rd=RULE_DATA[trip];if(!rd)return;
    style.textContent+=`.px-buygrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.px-buycard,.px-rulecard{background:#fff;border:1px solid #00000012;border-radius:19px;padding:14px;box-shadow:0 10px 28px #372a2510}.px-buycard{display:flex;flex-direction:column}.px-buyicon{font-size:1.45rem}.px-buyname{font-weight:900;margin-top:4px}.px-buytag,.px-rulelevel{display:inline-flex;align-self:flex-start;margin:6px 0;padding:4px 8px;border-radius:999px;background:#eef4f0;color:#176b3d;font-size:.66rem;font-weight:900}.px-buydesc,.px-ruletext{color:#686d70;font-size:.8rem;line-height:1.55}.px-buylink,.px-rulelink{display:inline-flex;align-self:flex-start;margin-top:auto;padding:8px 10px;border-radius:999px;background:#1e2428;color:#fff;text-decoration:none;font-size:.72rem;font-weight:900}.px-rulenote{margin:0 0 13px;padding:11px 13px;border-radius:15px;background:#edf5ff;color:#264d70;font-size:.8rem}.px-rulegrid{display:grid;gap:9px;margin-top:12px}.px-rulecard{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start}.px-ruleicon{font-size:1.25rem}.px-rulecard h3{font-size:.92rem;margin:0}.px-rulelevel{margin:4px 0 5px;background:#fff3d9;color:#8a5b00}.px-rulelink{margin-top:0;white-space:nowrap}.px-china-note{margin-top:12px;padding:12px 13px;border-radius:16px;background:#fff0f0;border:1px solid #b21f2d22;font-size:.78rem;line-height:1.55}.px-source-note{margin-top:10px;color:#777;font-size:.7rem}@media(max-width:760px){.px-buygrid{grid-template-columns:1fr}.px-rulecard{grid-template-columns:auto 1fr}.px-rulelink{grid-column:2;margin-top:2px}.px-buycard{min-height:0}}`;
    const sec=document.createElement('section');sec.id='travel-buy-rules';sec.className='px-sec px-fade';
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">BUY & TRAVEL RULES</div><h2 class="px-title">ซื้ออะไร + อะไรห้ามพก ${d.emoji}</h2><div class="px-rulenote">💡 ${esc(rd.buyNote)}</div><div class="px-buygrid">${BUY_COMMON.map(x=>`<article class="px-buycard"><div class="px-buyicon">${x.icon}</div><div class="px-buyname">${esc(x.name)}</div><span class="px-buytag">${esc(x.tag)}</span><p class="px-buydesc">${esc(x.desc)}</p><a class="px-buylink" href="${x.url}" target="_blank" rel="noopener">${esc(x.action)} ↗</a></article>`).join('')}</div><div class="px-rulegrid">${rd.rules.map(x=>`<article class="px-rulecard"><div class="px-ruleicon">${x.icon}</div><div><h3>${esc(x.title)}</h3><span class="px-rulelevel">${esc(x.level)}</span><div class="px-ruletext">${esc(x.text)}</div></div><a class="px-rulelink" href="${x.url}" target="_blank" rel="noopener">${esc(x.link)} ↗</a></article>`).join('')}</div><div class="px-china-note"><b>🇨🇳 หมายเหตุเผื่อทริปจีนในอนาคต</b><br>กฎ CCC/3C ของ Power bank ที่จีนประกาศตั้งแต่ 28 มิ.ย. 2025 ระบุชัดว่าใช้กับ <b>เที่ยวบินภายในประเทศจีน</b>: Power bank ที่ไม่มีเครื่องหมาย CCC ชัดเจน หรือเป็นรุ่นที่ถูกเรียกคืน ห้ามนำขึ้นเที่ยวบินภายในจีน ดังนั้นไม่ได้แปลว่า Power bank ทุกลูกที่ไม่มี CCC ถูกห้ามเพียงเพราะเดินทางเข้าประเทศจีน แต่ถ้ามีไฟลต์ต่อภายในจีนต้องเช็กเรื่องนี้จริงจัง <a href="https://www.caac.gov.cn/English/News/202507/t20250709_227894.html" target="_blank" rel="noopener">CAAC ↗</a></div><div class="px-source-note">ขนาดกระเป๋าและกฎแบตเตอรี่เปลี่ยนตามสายการบิน/เส้นทางได้เสมอ • ก่อนบินให้ยึดเว็บสายการบินที่ออกตั๋วเป็นหลัก</div></div>`;
    const couple=document.getElementById('couple-planner'),check=document.getElementById('trip-checklist');
    if(couple?.parentNode)couple.parentNode.insertBefore(sec,couple);else if(check?.parentNode)check.parentNode.insertBefore(sec,check);else document.querySelector('main')?.appendChild(sec);
  }
  injectTravelBuyRules();



  /* COUPLE_PLANNER_V65 — shared wishlist + offline emergency card in the existing plan extras module. */
  const EMERGENCY={
    tokyo:{main:'ตำรวจ 110 • ดับเพลิง/รถพยาบาล 119',help:'JNTO Visitor Hotline +81-50-3816-2787',hotel:'APA Hotel Asakusa Tawaramachi-Ekimae'},
    kansai:{main:'ตำรวจ 110 • ดับเพลิง/รถพยาบาล 119',help:'JNTO Visitor Hotline +81-50-3816-2787',hotel:'Osaka Namba / Shinsaibashi • เลือกโรงแรมจริงภายหลัง'},
    hongkong:{main:'Police / Fire / Ambulance 999',help:'มือถือใน Hong Kong โทร 112 เพื่อเชื่อม 999 ได้',hotel:'Holiday Inn Golden Mile Hong Kong'},
    danang:{main:'ตำรวจ 113 • ดับเพลิง 114 • รถพยาบาล 115 • กู้ภัย 112',help:'Da Nang Visitor Center +84 236 355 0111',hotel:'HAIAN Beach Hotel & Spa / Little Riverside Hoi An'},yunnan:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location เป็นภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Kunming Old Street / Dali Ancient City • เลือกโรงแรมจริงภายหลัง'},chongqing:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อโรงแรมและ Location ภาษาจีนใน Amap เพื่อส่งให้คนขับ/เจ้าหน้าที่ได้ทันที',hotel:'Jiefangbei / Xiaoshizi • เลือกโรงแรมจริงภายหลัง'},harbin:{main:'ตำรวจ 110 • ดับเพลิง 119 • รถพยาบาล 120',help:'เก็บชื่อจีนของโรงแรม, Yabuli และ Snow Town ไว้ใน Amap • แจ้งที่พัก/คนขับก่อนเดินทางบนเส้นหิมะ',hotel:'Harbin Central Street / Yabuli / Snow Town • เลือกโรงแรมจริงภายหลัง'}
  };
  function injectCouplePlanner(){
    if(document.getElementById('couple-planner'))return;
    style.textContent+=`.px-couple-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px}.px-couple-card{background:#fff;border:1px solid #00000012;border-radius:20px;padding:16px;box-shadow:0 10px 28px #372a2510}.px-couple-card h3{margin:0 0 5px}.px-wish-form{display:grid;grid-template-columns:1fr 1fr auto;gap:7px;margin-top:11px}.px-wish-form input{min-width:0;border:1px solid #ddd5c8;border-radius:12px;padding:9px;font:inherit}.px-wish-add{border:0;border-radius:12px;background:#1e2428;color:#fff;padding:9px 12px;font-weight:900}.px-wish-list{display:grid;gap:7px;margin-top:10px}.px-wish{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;background:#faf8f3;border-radius:13px;padding:9px}.px-wish-toggle,.px-wish-del{border:0;background:transparent;font-size:1rem}.px-wish.done .px-wish-name{text-decoration:line-through;color:#888}.px-em-row{padding:9px 0;border-top:1px dashed #0001}.px-em-row:first-of-type{border-top:0}.px-em-note{width:100%;margin-top:8px;border:1px solid #ddd5c8;border-radius:12px;padding:10px;font:inherit;min-height:66px;resize:vertical}@media(max-width:700px){.px-couple-grid{grid-template-columns:1fr}.px-wish-form{grid-template-columns:1fr}.px-wish-add{width:100%}}`;
    const sec=document.createElement('section');sec.id='couple-planner';sec.className='px-sec px-fade';
    const em=EMERGENCY[trip];
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">COUPLE PLANNER</div><h2 class="px-title">วางแผนร่วมกัน ❤️</h2><div class="px-couple-grid"><article class="px-couple-card"><h3>💞 Shared Wishlist</h3><div class="muted" style="font-size:.8rem">เก็บสถานที่ “อยากไปถ้ามีเวลา” แยกจากแพลนจริง เพื่อลดการอัด Location ลง Day</div><div class="px-wish-form"><input id="pxWishName" placeholder="สถานที่อยากไป"><input id="pxWishNote" placeholder="เหตุผล / โน้ต"><button class="px-wish-add" id="pxWishAdd" type="button">＋ เพิ่ม</button></div><div class="px-wish-list" id="pxWishList"></div></article><article class="px-couple-card"><h3>🆘 Emergency Card</h3><div class="muted" style="font-size:.8rem">เก็บข้อมูลสำคัญไว้ในหน้า Trip เดียว เปิดได้แม้เน็ตมีปัญหา</div><div class="px-em-row"><b>เหตุฉุกเฉิน</b><div>${esc(em.main)}</div></div><div class="px-em-row"><b>ช่วยเหลือนักท่องเที่ยว</b><div>${esc(em.help)}</div></div><div class="px-em-row"><b>ที่พักในแพลน</b><div>${esc(em.hotel)}</div></div><textarea class="px-em-note" id="pxEmergencyNote" placeholder="เลขประกัน / เบอร์คนติดต่อ / ข้อมูลที่อยากเก็บเพิ่ม"></textarea></article></div></div>`;
    const target=document.getElementById('travel-apps')||document.getElementById('trip-checklist');if(target?.parentNode)target.insertAdjacentElement('afterend',sec);else document.querySelector('main')?.appendChild(sec);
    const WKEY='travelHubWishlistV1',EKEY='travelHubEmergencyV1';
    const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));window.dispatchEvent(new Event('online'))}catch{}};
    const list=sec.querySelector('#pxWishList');
    function renderWish(){const all=read(WKEY,{}),a=Array.isArray(all[trip])?all[trip]:[];list.innerHTML=a.length?a.map(x=>`<div class="px-wish ${x.done?'done':''}" data-id="${x.id}"><button class="px-wish-toggle" type="button">${x.done?'✅':'🤍'}</button><div><b class="px-wish-name">${esc(x.name)}</b>${x.note?`<div class="muted" style="font-size:.72rem">${esc(x.note)}</div>`:''}</div><button class="px-wish-del" type="button" aria-label="ลบ">×</button></div>`).join(''):'<div class="muted" style="font-size:.78rem;padding:8px 0">ยังไม่มี Wishlist</div>';list.querySelectorAll('.px-wish').forEach(row=>{row.querySelector('.px-wish-toggle').onclick=()=>{const o=read(WKEY,{}),a=o[trip]||[],x=a.find(v=>v.id===row.dataset.id);if(x)x.done=!x.done;o[trip]=a;write(WKEY,o);renderWish()};row.querySelector('.px-wish-del').onclick=()=>{const o=read(WKEY,{});o[trip]=(o[trip]||[]).filter(v=>v.id!==row.dataset.id);write(WKEY,o);renderWish()}})}
    sec.querySelector('#pxWishAdd').onclick=()=>{const n=sec.querySelector('#pxWishName'),note=sec.querySelector('#pxWishNote');if(!n.value.trim())return;const o=read(WKEY,{}),a=Array.isArray(o[trip])?o[trip]:[];a.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:n.value.trim(),note:note.value.trim(),done:false});o[trip]=a.slice(-50);write(WKEY,o);n.value='';note.value='';renderWish()};renderWish();
    const en=sec.querySelector('#pxEmergencyNote'),eo=read(EKEY,{});en.value=eo[trip]||'';let timer;en.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{const o=read(EKEY,{});o[trip]=en.value;write(EKEY,o)},350)});
  }
  injectCouplePlanner();

})();
