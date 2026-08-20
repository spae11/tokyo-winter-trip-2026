from pathlib import Path

OLD='Holiday Inn Golden Mile Hong Kong'
NEW='Travelodge Kowloon'

# Trip Tools: change hotel and restore the intended ~70K total budget.
p=Path('trip-tools-v1.js')
s=p.read_text()
s=s.replace("hongkong:{name:'Hong Kong 6D5N',emoji:'🇭🇰',city:'Hong Kong',country:'Hong Kong',tz:'Asia/Hong_Kong',currency:'HKD',budget:96000,",
            "hongkong:{name:'Hong Kong 6D5N',emoji:'🇭🇰',city:'Hong Kong',country:'Hong Kong',tz:'Asia/Hong_Kong',currency:'HKD',budget:70000,")
s=s.replace(OLD,NEW)
s=s.replace("['🏨','Travelodge Kowloon',22.2952,114.1723,'hotel']","['🏨','Travelodge Kowloon',22.30694,114.172375,'hotel']")
s=s.replace("'TST → Disneyland'","'Jordan → Disneyland'")
s=s.replace("'TST → Wan Chai'","'Jordan → Wan Chai'")
s=s.replace("'TST → Tung Chung'","'Jordan → Tung Chung'")
s=s.replace("'กลับ TST'","'กลับ Jordan'")
s=s.replace("hongkong:96000","hongkong:70000")
s=s.replace("/* HK_REAL_HOTEL_V82 */ if(Number(state.budgets?.hongkong)===70000)state.budgets.hongkong=96000;","/* HK_VALUE_HOTEL_V83 */ if(Number(state.budgets?.hongkong)===96000)state.budgets.hongkong=70000;")
p.write_text(s)

# Visible Hong Kong plan page.
p=Path('hongkong/index.html')
s=p.read_text()
s=s.replace(OLD,NEW)
s=s.replace('Tsim Sha Tsui Base 🏨','Jordan Base 🏨')
s=s.replace('50 Nathan Road, Tsim Sha Tsui','23 Saigon Street, Jordan, Kowloon')
s=s.replace('ใกล้ MTR • Kowloon Mosque • Star Ferry • เดินเที่ยวกลางคืนง่าย','ใกล้ Jordan MTR ประมาณ 2–4 นาที • ใกล้ Temple Street • ไป Tsim Sha Tsui เพียง 1 สถานี')
s=s.replace('Holiday+Inn+Golden+Mile+Hong+Kong','Travelodge+Kowloon')
s=s.replace('TST → Disneyland','Jordan → Disneyland')
s=s.replace('TST → Wan Chai','Jordan → Wan Chai')
s=s.replace('TST → Tung Chung','Jordan → Tung Chung')
s=s.replace('กลับ TST','กลับ Jordan')
p.write_text(s)

# Detailed budget: realistic hotel target with margin while keeping the trip at 70K.
p=Path('plan-extras-v1.js')
s=p.read_text()
old="""hongkong:{total:96000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน • ใช้ Holiday Inn Golden Mile',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','43,000','5 คืน • Holiday Inn Golden Mile • เผื่อภาษี/ค่าธรรมเนียมตามเรทตลาดจริง'],
      ['🚇','เดินทาง','5,000','Airport + MTR + Ferry + Octopus'],
      ['🎟️','ตั๋ว & กิจกรรม','10,000','Disneyland + Ngong Ping + Peak Tram'],
      ['🍽️','อาหาร','11,000','6 วัน • 2 คน • Halal/Muslim-friendly'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]}"""
new="""hongkong:{total:70000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน • พัก Travelodge Kowloon (Jordan)',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า • ตั้งงบเผื่อจากเรทปกติ ไม่ยึดโปรต่ำสุด'],
      ['🏨','โรงแรม','15,000','5 คืน • Travelodge Kowloon • เรทสาธารณะปัจจุบันมีตัวอย่างราว 2K/คืนรวม fee; เผื่อขึ้นตามวันจริง'],
      ['🚇','เดินทาง','4,000','A21 Airport Bus + MTR + Star Ferry + Octopus • 2 คน / 6 วัน'],
      ['🎟️','ตั๋ว & กิจกรรม','9,000','Disneyland + Ngong Ping 360 + Peak Tram/จุดชมวิว'],
      ['🍽️','อาหาร','12,000','6 วัน • 2 คน • เผื่อร้าน Halal/Muslim-friendly ที่ราคาสูงกว่าฟู้ดคอร์ท'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','8,000','eSIM + ประกัน + ค่าจุกจิก/ราคาแกว่ง • ไม่รวมช้อปหนัก']
    ]}"""
if old not in s:
    raise SystemExit('current Hong Kong budget block not found')
s=s.replace(old,new,1)
p.write_text(s)

# Bump installed PWA cache so phones receive the hotel/budget correction.
p=Path('sw.js'); s=p.read_text().replace("our-journey-v82","our-journey-v83").replace('?v=82','?v=83'); p.write_text(s)
p=Path('index.html'); s=p.read_text().replace('?v=82','?v=83').replace('ourJourneySWReloadV82','ourJourneySWReloadV83').replace('sw.js?v=82','sw.js?v=83'); p.write_text(s)
p=Path('manifest.webmanifest'); s=p.read_text().replace('app=82','app=83').replace('pwa=29','pwa=30'); p.write_text(s)
