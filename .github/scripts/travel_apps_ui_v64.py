from pathlib import Path
import re

# Add one Travel Apps section to the existing plan extras module.
p = Path('plan-extras-v1.js')
s = p.read_text(encoding='utf-8')
marker = '/* TRAVEL_APPS_V64 */'
if marker not in s:
    block = r'''

  /* TRAVEL_APPS_V64 */
  const APP_DATA={
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
  function injectTravelApps(){
    if(document.getElementById('travel-apps'))return;
    const apps=APP_DATA[trip]||[];
    if(!apps.length)return;
    style.textContent+=`.px-app-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.px-app-card{background:#fff;border:1px solid #00000012;border-radius:20px;padding:15px;box-shadow:0 10px 28px #372a2510;display:flex;flex-direction:column;min-height:180px}.px-app-head{display:flex;align-items:flex-start;gap:10px}.px-app-icon{width:44px;height:44px;border-radius:14px;background:#f5efe4;display:grid;place-items:center;font-size:1.35rem;flex:none}.px-app-name{font-weight:900;font-size:1rem;line-height:1.25}.px-app-badge{display:inline-flex;margin-top:5px;padding:4px 8px;border-radius:999px;background:#eef4f0;color:#176b3d;font-size:.67rem;font-weight:900}.px-app-platform{margin-top:8px;color:#777;font-size:.72rem;font-weight:800}.px-app-desc{margin:6px 0 12px;color:#676d70;font-size:.82rem;line-height:1.55;flex:1}.px-app-link{align-self:flex-start;text-decoration:none;border-radius:999px;background:#1e2428;color:#fff;padding:8px 11px;font-size:.72rem;font-weight:900}.px-app-note{margin:0 0 13px;padding:11px 13px;border-radius:15px;background:#fff4d7;color:#6d571d;font-size:.8rem}.px-app-link:active{transform:scale(.98)}@media(max-width:700px){.px-app-grid{grid-template-columns:1fr}.px-app-card{min-height:0}}`;
    const sec=document.createElement('section');
    sec.className='px-sec px-fade';sec.id='travel-apps';
    const note=trip==='hongkong'?'ฮ่องกงไม่จำเป็นต้องใช้ DiDi/Alipay เป็นหลักเหมือนจีนแผ่นดินใหญ่ — Octopus + MTR Mobile + Uber เหมาะกับทริปนี้มากกว่า':'ญี่ปุ่นใช้ IC Card + Maps เป็นหลัก ส่วนแท็กซี่ติด GO ไว้เป็นตัวสำรอง';
    sec.innerHTML=`<div class="px-wrap"><div class="px-ey">TRAVEL APPS</div><h2 class="px-title">แอปที่ควรติดตั้งก่อนเดินทาง ${d.emoji}</h2><div class="px-app-note">📱 ${esc(note)}</div><div class="px-app-grid">${apps.map(a=>`<article class="px-app-card"><div class="px-app-head"><div class="px-app-icon">${a.icon}</div><div><div class="px-app-name">${esc(a.name)}</div><span class="px-app-badge">${esc(a.badge)}</span></div></div><div class="px-app-platform">${esc(a.platform)}</div><div class="px-app-desc">${esc(a.desc)}</div><a class="px-app-link" href="${a.url}" target="_blank" rel="noopener">เปิดเว็บทางการ ↗</a></article>`).join('')}</div></div>`;
    const checklist=document.getElementById('trip-checklist');
    if(checklist?.parentNode)checklist.parentNode.insertBefore(sec,checklist);else document.querySelector('main')?.appendChild(sec);
  }
  injectTravelApps();
'''
    pos = s.rfind('})();')
    if pos < 0:
        raise SystemExit('plan-extras closure not found')
    s = s[:pos] + block + '\n' + s[pos:]
    p.write_text(s, encoding='utf-8')

# Fix legacy mobile nav overlapping the new nav on iPhone.
p = Path('plan-first-v2.css')
s = p.read_text(encoding='utf-8')
s = s.replace('body.pfx-v2 .hub-back-btn,body.pfx-v2 .floatback,body.pfx-v2>.bottomnav{display:none!important}',
              'body.pfx-v2 .hub-back-btn,body.pfx-v2 .floatback,body.pfx-v2 .bottomnav{display:none!important}')
s = s.replace('body.pfx-root.pfx-v2{padding-bottom:104px!important}',
              'body.pfx-root.pfx-v2{padding-bottom:calc(132px + env(safe-area-inset-bottom))!important}')
if 'IPHONE_NAV_FIX_V64' not in s:
    s += '\n/* IPHONE_NAV_FIX_V64 */\nbody.pfx-root.pfx-v2 .bottomnav{display:none!important}\nbody.pfx-root.pfx-v2 #pfxBottomNav{bottom:max(10px,env(safe-area-inset-bottom))!important;background:#171b1ef8!important;backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important}\n@supports(padding:max(0px)){body.pfx-root.pfx-v2{padding-bottom:calc(132px + env(safe-area-inset-bottom))!important}}\n'
p.write_text(s, encoding='utf-8')

# Add refresh next to ดูทริป for both mobile OSes.
p = Path('index.html')
s = p.read_text(encoding='utf-8')
if 'id="appRefreshBtn"' not in s:
    old = '<a class="btn" href="#trips">ดูทริป</a>'
    new = old + '<button class="btn soft app-refresh" id="appRefreshBtn" type="button" aria-label="รีเฟรชแอป" title="รีเฟรช" onclick="location.reload()">↻</button>'
    if old not in s:
        raise SystemExit('topbar trip button not found')
    s = s.replace(old, new, 1)
    s = s.replace('.btn:active{transform:scale(.98)}', '.btn:active{transform:scale(.98)}.app-refresh{width:40px;height:40px;padding:0;flex:0 0 40px;font-size:1.25rem;line-height:1;background:#fff;color:var(--dark);border:1px solid var(--line)}', 1)
s = re.sub(r'manifest\.webmanifest\?v=\d+', 'manifest.webmanifest?v=64', s)
s = re.sub(r'sw\.js\?v=\d+', 'sw.js?v=64', s)
p.write_text(s, encoding='utf-8')

# Force fresh assets on iPhone/Android.
p = Path('sw.js')
s = p.read_text(encoding='utf-8')
s = re.sub(r"const CACHE='our-journey-v\d+'", "const CACHE='our-journey-v64'", s, count=1)
s = re.sub(r'\?v=61', '?v=64', s)
p.write_text(s, encoding='utf-8')
