(()=>{
const path=location.pathname;
const park=path.includes('/tokyo/')?'tokyo':path.includes('/hongkong/')?'hongkong':null;
if(!park)return;
const META={
 tokyo:{
  'Enchanted Tale of Beauty and the Beast':{rank:1,wait:'มักยาวมาก',mins:'ประมาณ 8 นาที',tip:'แนะนำอันดับ 1 • ใช้ Premier Access ถ้าคิวยาว'},
  "Pooh’s Hunny Hunt":{rank:2,wait:'มักยาว',mins:'ประมาณ 4.5 นาที',tip:'แนะนำมาก • เช็กคิวตั้งแต่เช้า'},
  'The Happy Ride with Baymax':{rank:3,wait:'มักยาว',mins:'ประมาณ 1.5 นาที',tip:'แนะนำมาก • คิวขึ้นเร็ว'},
  'Monsters, Inc. Ride & Go Seek!':{rank:4,wait:'กลาง–ยาว',mins:'ประมาณ 4 นาที',tip:'แนะนำ • เหมาะช่วงเช้า'},
  'Big Thunder Mountain':{rank:5,wait:'กลาง–ยาว',mins:'ประมาณ 4 นาที',tip:'แนะนำสายสนุก'},
  'Splash Mountain':{rank:6,wait:'กลาง–ยาว',mins:'ประมาณ 10 นาที',tip:'แนะนำสายหวาดเสียว'},
  'Pirates of the Caribbean':{rank:7,wait:'สั้น–กลาง',mins:'ประมาณ 15 นาที',tip:'คุ้มเวลา • ถ้าคิวสั้นควรเก็บ'},
  'Haunted Mansion':{rank:8,wait:'กลาง',mins:'ประมาณ 15 นาที',tip:'ค่อนข้างคุ้มเวลา'},
  'Star Tours: The Adventures Continue':{rank:9,wait:'สั้น–กลาง',mins:'ประมาณ 4.5 นาที',tip:'เก็บช่วงคิวหลักแน่น'},
  'Jungle Cruise: Wildlife Expeditions':{rank:10,wait:'กลาง',mins:'ประมาณ 10 นาที',tip:'เหมาะช่วงบ่าย/เย็น'},
  "it’s a small world":{rank:20,wait:'มักสั้น',mins:'ประมาณ 10 นาที',tip:'พักขา • คิวมักไหลดี'},
  'Dumbo The Flying Elephant':{rank:30,wait:'กลาง',mins:'ประมาณ 1.5 นาที',tip:'เล่นถ้าคิวไม่เกิน ~25 นาที'},
  'Peter Pan’s Flight':{rank:12,wait:'กลาง–ยาว',mins:'ประมาณ 2.5 นาที',tip:'เวลาเล่นสั้น ควรดูคิวก่อน'},
  'Roger Rabbit’s Car Toon Spin':{rank:14,wait:'กลาง',mins:'ประมาณ 3.5 นาที',tip:'เหมาะเก็บตอน Toontown'},
  'Gadget’s Go Coaster':{rank:18,wait:'กลาง',mins:'ประมาณ 1 นาที',tip:'สั้นมาก • เล่นเมื่อคิวไม่ยาว'},
  'Western River Railroad':{rank:25,wait:'สั้น–กลาง',mins:'ประมาณ 15 นาที',tip:'พักขาและชมวิว'},
  'Mark Twain Riverboat':{rank:26,wait:'มักสั้น',mins:'ประมาณ 12 นาที',tip:'พักจากการเดิน'},
  'Alice’s Tea Party':{rank:28,wait:'มักสั้น',mins:'ประมาณ 1.5 นาที',tip:'เล่นแทรกเมื่อผ่านโซน'},
  'Castle Carrousel':{rank:29,wait:'มักสั้น',mins:'ประมาณ 2 นาที',tip:'เล่นแทรกเมื่อคิวสั้น'}
 },
 hongkong:{
  'Frozen Ever After':{rank:1,wait:'มักยาวมาก',mins:'ประมาณ 6 นาที',tip:'แนะนำอันดับ 1 • ไปเช้าหรือใช้ Premier Access'},
  'Wandering Oaken’s Sliding Sleighs':{rank:2,wait:'มักยาว',mins:'ประมาณ 1 นาที',tip:'เครื่องสั้นแต่คิวขึ้นไว • เล่นเช้า'},
  'Mystic Manor':{rank:3,wait:'กลาง–ยาว',mins:'ประมาณ 5.5 นาที',tip:'แนะนำมาก • Signature ของ Hong Kong'},
  'Big Grizzly Mountain Runaway Mine Cars':{rank:4,wait:'กลาง–ยาว',mins:'ประมาณ 3.5 นาที',tip:'แนะนำสาย thrill'},
  'Hyperspace Mountain':{rank:5,wait:'กลาง–ยาว',mins:'ประมาณ 3 นาที',tip:'แนะนำสาย thrill'},
  'Iron Man Experience':{rank:6,wait:'กลาง',mins:'ประมาณ 4.5 นาที',tip:'แนะนำ • เก็บพร้อม Tomorrowland'},
  'Ant-Man and The Wasp: Nano Battle!':{rank:7,wait:'สั้น–กลาง',mins:'ประมาณ 4 นาที',tip:'คุ้มถ้าคิวไม่ยาว'},
  'RC Racer':{rank:8,wait:'กลาง–ยาว',mins:'ประมาณ 1.5 นาที',tip:'เครื่องสั้น • ดูคิวก่อน'},
  'Toy Soldier Parachute Drop':{rank:9,wait:'กลาง',mins:'ประมาณ 2 นาที',tip:'เล่นพร้อม Toy Story Land'},
  'Slinky Dog Spin':{rank:14,wait:'สั้น–กลาง',mins:'ประมาณ 1.5 นาที',tip:'เล่นแทรกใน Toy Story Land'},
  'Jungle River Cruise':{rank:10,wait:'กลาง',mins:'ประมาณ 8 นาที',tip:'คุ้มถ้าคิวกลาง'},
  "it’s a small world":{rank:18,wait:'มักสั้น',mins:'ประมาณ 9 นาที',tip:'พักขา • คิวมักไหลดี'},
  'The Many Adventures of Winnie the Pooh':{rank:11,wait:'กลาง',mins:'ประมาณ 4 นาที',tip:'เหมาะเก็บช่วง Fantasyland'},
  'Dumbo the Flying Elephant':{rank:20,wait:'กลาง',mins:'ประมาณ 1.5 นาที',tip:'เล่นเมื่อคิวไม่เกิน ~25 นาที'},
  'Cinderella Carousel':{rank:22,wait:'มักสั้น',mins:'ประมาณ 2 นาที',tip:'เล่นแทรกได้'},
  'Hong Kong Disneyland Railroad':{rank:24,wait:'สั้น–กลาง',mins:'ประมาณ 20 นาทีรอบเต็ม',tip:'พักขา/ชมสวน'}
 }
};
const aliases={
 tokyo:{'Enchanted Tale of Beauty and the Beast':'Enchanted Tale of Beauty and the Beast','Pooh’s Hunny Hunt':'Pooh’s Hunny Hunt'},
 hongkong:{'Frozen Ever After – Presented by Blue Cross':'Frozen Ever After','Frozen Ever After':'Frozen Ever After'}
};
const css=document.createElement('style');css.textContent=`
.ride.reco{border-color:#d7aa42!important;box-shadow:0 8px 24px #d9a44122!important}.ride-meta{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 2px}.ride-pill{font:800 11px/1.2 'Noto Sans Thai',system-ui,sans-serif;padding:6px 8px;border-radius:999px;background:#f0f1ef;color:#4d5355}.ride-pill.queue-long{background:#fde5e7;color:#9d2530}.ride-pill.queue-mid{background:#fff0d8;color:#8a5a11}.ride-pill.queue-short{background:#e3f3ea;color:#176b3c}.ride-rank{display:inline-flex;align-items:center;gap:5px;background:#fff4d9;color:#8a5a11;border-radius:999px;padding:5px 8px;font:900 10px/1.2 'Noto Sans Thai',system-ui,sans-serif;margin-top:6px}.ride-tip{font-size:.74rem;color:#6f7478;margin-top:6px}.disney-live-note{background:#eef4f1;border-radius:14px;padding:10px 12px;margin:10px 0;font-size:.78rem;color:#52605a}.recommended-label{font:900 12px/1.2 'Noto Sans Thai',system-ui,sans-serif;color:#B21F2D;margin:10px 2px 0}.rides{scroll-padding-left:2px}
`;document.head.appendChild(css);
function qclass(wait){if(wait.includes('ยาว'))return 'queue-long';if(wait.includes('กลาง'))return 'queue-mid';return 'queue-short'}
function normalize(title){const a=aliases[park]||{};if(a[title])return a[title];for(const k of Object.keys(META[park]))if(title.includes(k)||k.includes(title))return k;return title}
function apply(){const container=document.getElementById('rides');if(!container)return;const cards=[...container.querySelectorAll('.ride')];if(!cards.length)return;cards.forEach(card=>{const h=card.querySelector('h4');if(!h)return;const key=normalize(h.textContent.trim()),m=META[park][key]||{rank:99,wait:'ไม่แน่นอน',mins:'เช็กหน้างาน',tip:'ดูเวลาคิวจริงใน Disney App'};card.dataset.rank=m.rank;if(card.querySelector('.ride-meta'))return;if(m.rank<=10){card.classList.add('reco');const rank=document.createElement('div');rank.className='ride-rank';rank.textContent=`⭐ แนะนำ #${m.rank}`;h.before(rank)}const meta=document.createElement('div');meta.className='ride-meta';meta.innerHTML=`<span class="ride-pill ${qclass(m.wait)}">⏳ ${m.wait}</span><span class="ride-pill">🎠 ${m.mins}</span>`;h.after(meta);const tip=document.createElement('div');tip.className='ride-tip';tip.textContent=m.tip;meta.after(tip)});
 const sorted=[...container.querySelectorAll('.ride')].sort((a,b)=>(+a.dataset.rank||99)-(+b.dataset.rank||99));sorted.forEach(c=>container.appendChild(c));
 const box=container.closest('.disneybox');if(box&&!box.querySelector('.disney-live-note')){const note=document.createElement('div');note.className='disney-live-note';note.innerHTML='⏱️ <b>คิวที่แสดงเป็นแนวโน้มสำหรับวางแผน ไม่ใช่เวลาสด</b> • ก่อนเล่นให้เช็ก Disney App อีกครั้ง เพราะคิวเปลี่ยนตลอดวัน';const zones=box.querySelector('.zones');zones?zones.after(note):box.prepend(note)}
}
let pending=false;const run=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})};
const mo=new MutationObserver(run);function boot(){const d=document.getElementById('disney')||document.body;mo.observe(d,{childList:true,subtree:true});run()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();