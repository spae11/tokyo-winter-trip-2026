const A=q=>'https://uri.amap.com/search?keyword='+encodeURIComponent(q)+'&view=map&src=ourjourney&callnative=1';
const IMG={
 d1:'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1500&q=82',
 d2:'https://images.unsplash.com/photo-1758949016469-7dc8c15f05a0?auto=format&fit=crop&w=1500&q=82',
 d3:'https://images.unsplash.com/photo-1773067443680-85ab51fab868?auto=format&fit=crop&w=1500&q=82',
 d4:'https://unsplash.com/photos/0bs1x4THb9A/download?force=true&w=1600',
 d5:'https://unsplash.com/photos/y4SnkuWkf8g/download?force=true&w=1600'
};
const DAYS=[
 {d:'Day 1',t:'Arrival • Nanjing Road • The Bund',i:'d1',cost:'≈ 1,500 ฿ • 2 คน',s:[
  ['หลังถึง PVG','Pudong Airport → Hotel','Shanghai Pudong International Airport','Metro / DiDi ตามเวลาถึงจริง','🚇 Airport → Hotel','ใช้ Amap เช็กเส้นทางตามโรงแรมจริงและเวลาลงเครื่อง'],
  ['15:00','Nanjing Road','Nanjing Road Shanghai','เดินเล่น ช้อป และปรับตัววันแรก'],
  ['18:00','The Bund','The Bund Shanghai','อยู่ถึงช่วงเปิดไฟวิว Pudong'],
  ['19:30','Halal dinner','清真餐厅 Shanghai Huangpu','ค้น 清真餐厅 ใกล้ Nanjing Road / Huangpu']
 ]},
 {d:'Day 2',t:'Shanghai Disneyland 🎢',i:'d2',cost:'≈ 6,500–8,500 ฿ • 2 คน',s:[
  ['07:00','ออกจากโรงแรม','Shanghai Disneyland','เผื่อเวลาเดินทาง + Security + เข้าประตู','🚇 Hotel → Disney','เช็ก Amap และ Shanghai Disney app ตามที่พักจริง'],
  ['08:00','Shanghai Disney Resort','Shanghai Disneyland','ไปถึงก่อนเปิดเพื่อเก็บเครื่องเล่นฮิตก่อน'],
  ['เปิด–ค่ำ','Disneyland เต็มวัน','Shanghai Disneyland','Zootopia • TRON • Pirates • Soaring • Castle / Night show'],
  ['ค่ำ','กลับโรงแรม','Shanghai Pudong','เช็กเวลาปิดจริงในวันเดินทาง']
 ]},
 {d:'Day 3',t:'Yu Garden • Mosque • Lujiazui',i:'d3',cost:'≈ 2,500 ฿ • 2 คน',s:[
  ['09:00','Yu Garden / Yuyuan Old City','Yu Garden Shanghai','เดินสวน + ย่านเก่า'],
  ['12:00','Xiaotaoyuan Mosque 小桃园清真寺','小桃园清真寺 Shanghai','ละหมาด + หาอาหารฮาลาลโซน Huangpu'],
  ['16:00','Lujiazui / Shanghai Tower','Lujiazui Shanghai','วิวเมืองฝั่ง Pudong','🚇 Huangpu → Lujiazui','ใช้ Metro / DiDi ตามจุดที่อยู่จริง'],
  ['18:30','Riverside / Night skyline','Lujiazui Riverside Shanghai','ชมวิวกลางคืนฝั่ง Pudong']
 ]},
 {d:'Day 4',t:'Zhujiajiao • Xintiandi • Shopping',i:'d4',cost:'≈ 2,500 ฿ • 2 คน',s:[
  ['08:00','ออกไป Zhujiajiao','Zhujiajiao Ancient Town','Metro / DiDi ตามจุดพักจริง'],
  ['10:00','Zhujiajiao Ancient Town','Zhujiajiao Ancient Town','สะพาน คลอง เมืองเก่า'],
  ['15:30','กลับ Shanghai','Shanghai','เผื่อเวลารถ / Metro กลับเข้าเมือง'],
  ['17:30','Xintiandi / Shopping','Xintiandi Shanghai','เดินเล่น + ช้อป + มื้อเย็น']
 ]},
 {d:'Day 5',t:'Souvenir • Airport',i:'d5',cost:'≈ 1,500 ฿ • 2 คน',s:[
  ['เช้า','ของฝาก / Nanjing Road ตามเวลา','Nanjing Road Shanghai','ไม่อัดโปรแกรม เผื่อแพ็กกระเป๋า'],
  ['ก่อนบิน 3–4 ชม.','ออกไป Pudong Airport','Shanghai Pudong International Airport','เผื่อเวลาเดินทาง + Bag drop + Security','🚇/🚕 City → PVG','เลือก Metro / Maglev / DiDi ตามเวลาและกระเป๋า'],
  ['ก่อน Check-in','คืน Tax / จัดกระเป๋า / เช็ก Gate','Shanghai Pudong International Airport','เช็ก Terminal และ Gate ก่อนผ่าน Security']
 ]}
];
const HOTELS=[
 {key:'holiday',ey:'VALUE PICK • PUDONG',name:'Holiday Inn Express Shanghai Kangqiao by IHG',loc:'Kangqiao / Pudong • ไป Shanghai Disney Resort สะดวก',score:'Booking 9.1/10',brand:'IHG',img:IMG.d1,map:'Holiday Inn Express Shanghai Kangqiao',desc:'ตัวเลือกประหยัดที่ยังเป็นโรงแรมเครือจริง เหมาะถ้าต้องการคุมงบและมีวัน Disneyland'},
 {key:'courtyard',ey:'DISNEY AREA PICK',name:'Courtyard by Marriott Shanghai International Tourism and Resorts Zone',loc:'Pudong • Shanghai International Tourism Resort',score:'Booking 8.6/10',brand:'Marriott',img:IMG.d2,map:'Courtyard by Marriott Shanghai International Tourism and Resorts Zone',desc:'เหมาะกับวัน Disney และต้องการมาตรฐานโรงแรมที่ชัดเจนกว่า โดยให้เช็กราคารวม 4 คืนก่อนจอง'}
];
const DISNEY_RIDES=[
 {id:'zootopia',n:'Zootopia: Hot Pursuit',z:'Zootopia',cat:['must','hot']},
 {id:'tron',n:'TRON Lightcycle Power Run',z:'Tomorrowland',cat:['must','thrill']},
 {id:'pirates',n:'Pirates of the Caribbean',z:'Treasure Cove',cat:['must','family']},
 {id:'soaring',n:'Soaring Over the Horizon',z:'Adventure Isle',cat:['hot','family']},
 {id:'seven-dwarfs',n:'Seven Dwarfs Mine Train',z:'Fantasyland',cat:['hot','thrill']},
 {id:'castle',n:'Enchanted Storybook Castle / Night Show',z:'Gardens of Imagination',cat:['family']}
];
const PREP=['🛂 Passport','✈️ Flight / booking','🏨 Hotel booking','🎢 Disney ticket','📱 Alipay','💬 WeChat Pay','🗺️ Amap','📶 eSIM / roaming','🕌 Prayer items','🔋 Power bank','👟 Walking shoes','📲 Shanghai Disney app'];
