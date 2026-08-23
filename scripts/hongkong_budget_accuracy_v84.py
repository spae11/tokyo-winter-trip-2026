from pathlib import Path

# 1) More realistic 70K category budget while keeping Travelodge as the value base.
p=Path('plan-extras-v1.js')
s=p.read_text()
old="""hongkong:{total:70000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน • พัก Travelodge Kowloon (Jordan)',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า • ตั้งงบเผื่อจากเรทปกติ ไม่ยึดโปรต่ำสุด'],
      ['🏨','โรงแรม','15,000','5 คืน • Travelodge Kowloon • เรทสาธารณะปัจจุบันมีตัวอย่างราว 2K/คืนรวม fee; เผื่อขึ้นตามวันจริง'],
      ['🚇','เดินทาง','4,000','A21 Airport Bus + MTR + Star Ferry + Octopus • 2 คน / 6 วัน'],
      ['🎟️','ตั๋ว & กิจกรรม','9,000','Disneyland + Ngong Ping 360 + Peak Tram/จุดชมวิว'],
      ['🍽️','อาหาร','12,000','6 วัน • 2 คน • เผื่อร้าน Halal/Muslim-friendly ที่ราคาสูงกว่าฟู้ดคอร์ท'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','8,000','eSIM + ประกัน + ค่าจุกจิก/ราคาแกว่ง • ไม่รวมช้อปหนัก']
    ]}"""
new="""hongkong:{total:70000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน • พัก Travelodge Kowloon (Jordan)',items:[
      ['✈️','ตั๋วเครื่องบิน','20,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า • งบเป้าหมายเรทปกติ ถ้าช่วงพีคให้เพิ่มตามราคาจริง'],
      ['🏨','โรงแรม','18,000','5 คืน • Travelodge Kowloon • เรท Online Exclusive ล่าสุดมีตัวอย่าง HK$893/คืนรวม fee; เผื่อวันจริงแพงขึ้น'],
      ['🚇','เดินทาง','3,000','Airport + MTR + Star Ferry + Octopus • ถ้าใช้ Airport Express Kowloon ไป-กลับ ปัจจุบัน HK$195/คน'],
      ['🎟️','ตั๋ว & กิจกรรม','12,000','Disneyland ผู้ใหญ่ HK$669–939/คน + Ngong Ping Standard RT HK$295/คน + Peak Tram/Sky Terrace Combo RT HK$182/คน'],
      ['🍽️','อาหาร','11,000','6 วัน • 2 คน • เฉลี่ยราว 900–1,000 บาท/คน/วัน รวมมื้อ Halal/Muslim-friendly'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','6,000','eSIM + ประกัน + ค่าจุกจิก/ราคาแกว่ง • ไม่รวมช้อปหนัก']
    ]}"""
if old not in s:
    raise SystemExit('current Hong Kong 70K budget block not found')
s=s.replace(old,new,1)
p.write_text(s)

# 2) Hotel section: keep Travelodge primary and restore Dorsett Mongkok as a proper-hotel alternative.
p=Path('hongkong/index.html')
s=p.read_text()
old="""<main><section class=\"sec\"><div class=\"wrap\"><div class=\"head\"><div class=\"ey\">STAY BASE</div><h2>Jordan Base 🏨</h2></div><div class=\"card hotel\"><img src=\"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80\" alt=\"Hong Kong\"><div class=\"pad\"><div class=\"ey\">PRIMARY OPTION</div><h3>Travelodge Kowloon</h3><p>23 Saigon Street, Jordan, Kowloon</p><div class=\"muted\">ใกล้ Jordan MTR ประมาณ 2–4 นาที • ใกล้ Temple Street • ไป Tsim Sha Tsui เพียง 1 สถานี</div><a class=\"map\" target=\"_blank\" href=\"https://www.google.com/maps/search/?api=1&query=Travelodge+Kowloon\">📍 เปิด Location</a></div></div></div></section>"""
new="""<main><section class=\"sec\"><div class=\"wrap\"><div class=\"head\"><div class=\"ey\">STAY OPTIONS</div><h2>Jordan / Mong Kok 🏨</h2><div class=\"muted\">เลือกโรงแรมจริงที่เดินทางสะดวกและยังคุมงบรวมใกล้ 70K ได้ • เช็กราคาตามวันจริงก่อนจอง</div></div><div class=\"card hotel\"><img src=\"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80\" alt=\"Hong Kong\"><div class=\"pad\"><div class=\"ey\">PRIMARY • VALUE BASE</div><h3>Travelodge Kowloon</h3><p>23 Saigon Street, Jordan, Kowloon</p><div class=\"muted\">ใกล้ Jordan MTR • Temple Street • ไป Tsim Sha Tsui 1 สถานี • วางงบประมาณ 18K / 5 คืนรวม fee เพื่อไม่กดราคาต่ำเกินจริง</div><a class=\"map\" target=\"_blank\" href=\"https://www.google.com/maps/search/?api=1&query=Travelodge+Kowloon\">📍 เปิด Location</a></div></div><div class=\"card pad\" style=\"margin-top:12px\"><div class=\"ey\">ALTERNATIVE • PROPER 4-STAR HOTEL</div><h3>Dorsett Mongkok, Hong Kong</h3><p>88 Tai Kok Tsui Road • ใกล้ Olympic MTR</p><div class=\"muted\">ตัวเลือกโรงแรมเต็มรูปแบบ รีวิวโดยรวมดีกว่า • ราคาขึ้นลงตามวันค่อนข้างมาก จึงใช้เป็นตัวเทียบก่อนกดจอง ถ้ารวม 5 คืนไม่เกินงบโรงแรม 18K ถือว่าน่าสลับเป็นตัวหลัก</div><a class=\"map\" target=\"_blank\" href=\"https://www.google.com/maps/search/?api=1&query=Dorsett+Mongkok+Hong+Kong\">📍 เปิด Location</a></div></div></section>"""
if old not in s:
    raise SystemExit('Travelodge stay block not found')
s=s.replace(old,new,1)

# 3) Day-card costs = on-the-ground spend for two, excluding flight/hotel, so they no longer look inflated.
repls={
    "cost:'≈ 5,200 ฿'":"cost:'≈ 1,600 ฿ • หน้างาน 2 คน'",
    "cost:'≈ 7,900 ฿'":"cost:'≈ 9,500 ฿ • Disney 2 คน'",
    "cost:'≈ 4,950 ฿'":"cost:'≈ 1,700 ฿ • หน้างาน 2 คน'",
    "cost:'≈ 4,900 ฿'":"cost:'≈ 2,600 ฿ • Peak + วันเที่ยว'",
    "cost:'≈ 6,150 ฿'":"cost:'≈ 3,800 ฿ • Ngong Ping + วันเที่ยว'",
    "cost:'≈ 4,200 ฿'":"cost:'≈ 1,500 ฿ • หน้างาน 2 คน'",
}
for a,b in repls.items():
    if a in s:s=s.replace(a,b,1)
p.write_text(s)

# 4) Keep Trip Tools total at 70K and clean any old 96K migration behavior.
p=Path('trip-tools-v1.js')
s=p.read_text()
s=s.replace("/* HK_REAL_HOTEL_V82 */ if(Number(state.budgets?.hongkong)===70000)state.budgets.hongkong=96000;", "/* HK_VALUE_HOTEL_V84 */ if(Number(state.budgets?.hongkong)===96000)state.budgets.hongkong=70000;")
s=s.replace("hongkong:96000", "hongkong:70000")
p.write_text(s)

# 5) PWA cache bump.
p=Path('sw.js'); s=p.read_text().replace("our-journey-v83","our-journey-v84").replace('?v=83','?v=84'); p.write_text(s)
p=Path('index.html'); s=p.read_text().replace('?v=83','?v=84').replace('ourJourneySWReloadV83','ourJourneySWReloadV84').replace('sw.js?v=83','sw.js?v=84'); p.write_text(s)
p=Path('manifest.webmanifest'); s=p.read_text().replace('app=83','app=84').replace('pwa=30','pwa=31'); p.write_text(s)
