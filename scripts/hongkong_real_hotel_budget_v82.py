from pathlib import Path

# Trip Tools: move Hong Kong planning budget from old 70k to a realistic 96k
p=Path('trip-tools-v1.js')
s=p.read_text()
s=s.replace("hongkong:{name:'Hong Kong 6D5N',emoji:'🇭🇰',city:'Hong Kong',country:'Hong Kong',tz:'Asia/Hong_Kong',currency:'HKD',budget:70000,",
            "hongkong:{name:'Hong Kong 6D5N',emoji:'🇭🇰',city:'Hong Kong',country:'Hong Kong',tz:'Asia/Hong_Kong',currency:'HKD',budget:96000,")
s=s.replace("hongkong:70000", "hongkong:96000")
s=s.replace("hongkong:55000", "hongkong:96000")
# Existing users who are still on the previous app-default budget should migrate; custom values stay untouched.
needle="for(const [k,v] of Object.entries(REAL_BUDGETS_V79)){const cur=Number(state.budgets?.[k]);if(!cur||LEGACY_BUDGETS_V79[k]===cur)state.budgets[k]=v}"
if needle in s and "HK_REAL_HOTEL_V82" not in s:
    s=s.replace(needle, needle+"\n/* HK_REAL_HOTEL_V82 */ if(Number(state.budgets?.hongkong)===70000)state.budgets.hongkong=96000;")
p.write_text(s)

# Plan page budget breakdown: keep the selected Holiday Inn Golden Mile and budget it at the observed market-rate level.
p=Path('plan-extras-v1.js')
s=p.read_text()
old="""hongkong:{total:70000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','17,000','5 คืน • Tsim Sha Tsui / Kowloon'],
      ['🚇','เดินทาง','5,000','Airport + MTR + Ferry + Octopus'],
      ['🎟️','ตั๋ว & กิจกรรม','10,000','Disneyland + Ngong Ping + Peak Tram'],
      ['🍽️','อาหาร','11,000','6 วัน • 2 คน • Halal/Muslim-friendly'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]}"""
new="""hongkong:{total:96000,note:'Hong Kong + Disneyland + Ngong Ping • 2 คน • ใช้ Holiday Inn Golden Mile',items:[
      ['✈️','ตั๋วเครื่องบิน','22,000','BKK ↔ HKG • 2 คน + โหลดกระเป๋า'],
      ['🏨','โรงแรม','43,000','5 คืน • Holiday Inn Golden Mile • เผื่อภาษี/ค่าธรรมเนียมตามเรทตลาดจริง'],
      ['🚇','เดินทาง','5,000','Airport + MTR + Ferry + Octopus'],
      ['🎟️','ตั๋ว & กิจกรรม','10,000','Disneyland + Ngong Ping + Peak Tram'],
      ['🍽️','อาหาร','11,000','6 วัน • 2 คน • Halal/Muslim-friendly'],
      ['📱','eSIM / ประกัน / เงินเผื่อ','5,000','เน็ต + ประกัน + Buffer']
    ]}"""
if old not in s:
    raise SystemExit('Hong Kong budget block not found')
s=s.replace(old,new,1)
p.write_text(s)

# Bump PWA so installed phones receive the corrected budget.
p=Path('sw.js'); s=p.read_text().replace("our-journey-v81","our-journey-v82").replace('?v=81','?v=82'); p.write_text(s)
p=Path('index.html'); s=p.read_text().replace('?v=81','?v=82').replace('ourJourneySWReloadV81','ourJourneySWReloadV82').replace('sw.js?v=81','sw.js?v=82'); p.write_text(s)
p=Path('manifest.webmanifest'); s=p.read_text().replace('app=81','app=82').replace('pwa=28','pwa=29'); p.write_text(s)
