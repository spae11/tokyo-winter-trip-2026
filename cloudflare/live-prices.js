const UA='Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131 Safari/537.36';
const MAX_HOTELS=20;
const HOTEL_MIN_NIGHTLY_THB={tokyo:900,kansai:900,hongkong:1000,danang:350,yunnan:400,chongqing:450,harbin:500};
const TICKET_CATALOG={
  tokyo:[{id:'tokyo-disney',name:'Tokyo Disneyland 1-Day Passport',url:'https://www.tokyodisneyresort.jp/en/ticket/index.html',currency:'JPY',min:3000,max:15000,source:'Official website'}],
  kansai:[
    {id:'osaka-castle',name:'Osaka Castle Museum',url:'https://www.osakacastle.net/guide/?lang=en',currency:'JPY',min:300,max:5000,source:'Official website'},
    {id:'umeda-sky',name:'Umeda Sky Building Kuchu Teien Observatory',url:'https://www.skybldg.co.jp/en/',currency:'JPY',min:300,max:10000,source:'Official website'},
    {id:'kinkakuji',name:'Kinkaku-ji',url:'https://www.shokoku-ji.jp/en/kinkakuji/access/',currency:'JPY',min:100,max:3000,source:'Official website'}
  ],
  hongkong:[
    {id:'hk-disney',name:'Hong Kong Disneyland 1-Day Ticket',url:'https://www.hongkongdisneyland.com/book/tickets/',currency:'HKD',min:200,max:1500,source:'Official website'},
    {id:'ngong-ping',name:'Ngong Ping 360',url:'https://www.np360.com.hk/en/ticketing/ticketing-information',currency:'HKD',min:50,max:1000,source:'Official website'},
    {id:'peak-tram',name:'Peak Tram / Sky Terrace',url:'https://www.thepeak.com.hk/en/ticket-and-booking',currency:'HKD',min:20,max:800,source:'Official website'}
  ],
  danang:[{id:'bana-hills',name:'Sun World Ba Na Hills',url:'https://banahills.sunworld.vn/en/ticket-price',currency:'VND',min:100000,max:3000000,source:'Official website'}],
  yunnan:[
    {id:'stone-forest',name:'Stone Forest Scenic Area',url:'https://www.trip.com/travel-guide/attraction/shilin/stone-forest-scenic-area-82204?curr=CNY&locale=en-US',currency:'CNY',min:20,max:1000,source:'Trip.com current booking'},
    {id:'three-pagodas',name:'Chongsheng Temple & Three Pagodas',url:'https://www.trip.com/travel-guide/attraction/dali-city/the-chongsheng-temple-and-the-three-pagoda-culture-tourist-area-75915?curr=CNY&locale=en-US&poiType=3',currency:'CNY',min:20,max:1000,source:'Trip.com current booking'}
  ],
  chongqing:[
    {id:'yangtze-cableway',name:'Yangtze River Cableway',url:'https://www.trip.com/travel-guide/attraction/chongqing/yangtze-river-cableway-91483?curr=CNY&locale=en-US',currency:'CNY',min:10,max:500,source:'Trip.com current booking'},
    {id:'three-natural-bridges',name:'Wulong Three Natural Bridges',url:'https://www.trip.com/travel-guide/attraction/chongqing/three-natural-bridges-82315?curr=CNY&locale=en-US',currency:'CNY',min:20,max:1000,source:'Trip.com current booking'},
    {id:'dazu',name:'Dazu Rock Carvings',url:'https://www.trip.com/travel-guide/attraction/chongqing/dazu-rock-carvings-78129?curr=CNY&locale=en-US',currency:'CNY',min:20,max:1000,source:'Trip.com current booking'}
  ],
  harbin:[
    {id:'ice-snow-world',name:'Harbin Ice and Snow World',url:'https://www.trip.com/travel-guide/attraction/harbin/china-harbin-ice-and-snow-world-80633?curr=CNY&locale=en-US',currency:'CNY',min:100,max:1500,source:'Trip.com current booking'},
    {id:'yabuli',name:'Club Med Yabuli / Ski Resort',url:'https://www.clubmed.co.th/r/yabuli/w?locale=th-TH',currency:'THB',min:500,max:500000,source:'Club Med official'},
    {id:'snow-town',name:'China Snow Town (Xuexiang)',url:'https://www.trip.com/travel-guide/attraction/hailin/china-s-snow-town-10558869?curr=CNY&locale=en-US',currency:'CNY',min:20,max:1000,source:'Trip.com current booking'}
  ]
};
function cleanText(s){return String(s||'').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/\s+/g,' ')}
function safeDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(String(v||''))?String(v):''}
function stayNights(start,end){if(!start||!end)return 0;const a=new Date(start+'T00:00:00Z'),b=new Date(end+'T00:00:00Z'),n=Math.round((b-a)/86400000);return Number.isFinite(n)&&n>0&&n<61?n:0}
async function freshText(url){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);try{const r=await fetch(url,{headers:{'User-Agent':UA,'Accept-Language':'en-US,en;q=0.9','Accept':'text/html,application/xhtml+xml'},cf:{cacheTtl:0,cacheEverything:false},signal:ctrl.signal});if(!r.ok)throw new Error('HTTP_'+r.status);return await r.text()}finally{clearTimeout(timer)}}
async function currentFx(){try{const r=await fetch('https://open.er-api.com/v6/latest/THB',{headers:{Accept:'application/json'},cf:{cacheTtl:0,cacheEverything:false}});if(!r.ok)throw new Error('fx_http_'+r.status);const d=await r.json(),rates={THB:1};for(const c of ['HKD','JPY','CNY','VND','USD','EUR','GBP','KRW','SGD','MYR']){const v=Number(d?.rates?.[c]);if(v>0)rates[c]=1/v}return{status:'live',source:'ExchangeRate-API',ratesToTHB:rates,updatedAt:d?.time_last_update_utc||null}}catch(e){return{status:'unavailable',source:'ExchangeRate-API',ratesToTHB:{THB:1},error:String(e?.message||e)}}}
function thbEntries(html){const text=cleanText(html).replace(/\\u0e3f/gi,'฿'),out=[];for(const re of [/(?:THB\s*|฿\s*)([0-9][0-9,.]*)/gi,/([0-9][0-9,.]*)\s*(?:THB)/gi]){let m;while((m=re.exec(text))){const n=Number(m[1].replace(/,/g,''));if(Number.isFinite(n)&&n>=250&&n<=2000000)out.push({value:n,pos:m.index})}}out.sort((a,b)=>a.pos-b.pos);return out}
function originalAmounts(html,currency,min,max){const t=cleanText(html),esc=currency.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const patterns=currency==='HKD'?[/(?:HK\$|HKD\s*)\s*([0-9][0-9,.]*)/gi]:currency==='JPY'?[/[¥￥]\s*([0-9][0-9,.]*)/g,/JPY\s*([0-9][0-9,.]*)/gi]:currency==='VND'?[/([0-9][0-9,.]*)\s*(?:VND|₫)/gi,/(?:VND|₫)\s*([0-9][0-9,.]*)/gi]:currency==='CNY'?[/CNY\s*([0-9][0-9,.]*)/gi,/([0-9][0-9,.]*)\s*CNY/gi]:currency==='THB'?[/THB\s*([0-9][0-9,.]*)/gi,/฿\s*([0-9][0-9,.]*)/g]:[new RegExp(esc+'\\s*([0-9][0-9,.]*)','gi')];const vals=[];for(const re of patterns){let m;while((m=re.exec(t))){const n=Number(m[1].replace(/,/g,''));if(Number.isFinite(n)&&n>=min&&n<=max)vals.push(n)}}return[...new Set(vals)].sort((a,b)=>a-b)}
function pickHotelAmounts(entries,nights,tripId){
  if(!entries.length||!nights)return null;
  const floor=HOTEL_MIN_NIGHTLY_THB[tripId]||300,candidates=[];
  for(let i=0;i<entries.length;i++){
    const a=entries[i];if(a.value<floor||a.value>50000)continue;
    for(let j=i+1;j<Math.min(entries.length,i+20);j++){
      const b=entries[j],distance=b.pos-a.pos;if(distance>1800)break;
      if(b.value<=a.value)continue;
      const implied=b.value/nights,ratio=b.value/(a.value*nights),delta=Math.abs(implied-a.value)/Math.max(implied,a.value);
      if(implied<floor||implied>50000)continue;
      if(ratio<0.92||ratio>1.35||delta>0.28)continue;
      const score=Math.abs(ratio-1.08)+(distance/1800)*0.12;
      candidates.push({baseNightly:a.value,total:b.value,impliedNightly:implied,score});
    }
  }
  if(!candidates.length)return null;
  candidates.sort((a,b)=>a.score-b.score||a.total-b.total);
  const best=candidates[0],nightly=Math.round(best.total/nights);
  return{nightly,total:Math.round(best.total),estimated:false,baseNightly:best.baseNightly,confidence:'paired_total'};
}
async function hotelLivePrice(h){const start=safeDate(h.start),end=safeDate(h.end),nights=stayNights(start,end),base={tripId:String(h.tripId||''),name:String(h.name||'').slice(0,140),start,end,nights};if(!base.name)return{...base,status:'invalid'};if(!nights)return{...base,status:'needs_dates',message:'Set travel dates first'};const q=new URLSearchParams({q:base.name,checkin:start,checkout:end,adults:'2',currency:'THB',hl:'en',gl:'th'}),sourceUrl='https://www.google.com/travel/hotels?'+q.toString();try{const html=await freshText(sourceUrl),entries=thbEntries(html),picked=pickHotelAmounts(entries,nights,base.tripId);if(!picked)return{...base,status:'unavailable',source:'Google Hotels',sourceUrl,message:'Price values were not consistent enough to verify safely'};return{...base,status:'live',source:'Google Hotels',sourceUrl,currency:'THB',nightlyTHB:picked.nightly,totalTHB:picked.total,estimatedTotal:false,priceType:'verified_pair',taxesIncluded:null,verification:picked.confidence,baseNightlyTHB:picked.baseNightly}}catch(e){return{...base,status:'unavailable',source:'Google Hotels',sourceUrl,error:String(e?.message||e)}}}
async function ticketLivePrice(item,fx,tripId){const source=item.source||'Official/current source';try{const html=await freshText(item.url),vals=originalAmounts(html,item.currency,item.min,item.max);if(!vals.length)return{tripId,id:item.id,name:item.name,status:'unavailable',source,sourceUrl:item.url};const rate=item.currency==='THB'?1:(Number(fx?.ratesToTHB?.[item.currency])||null);return{tripId,id:item.id,name:item.name,status:'live',source,sourceUrl:item.url,currency:item.currency,listedPrices:vals.slice(0,12),minPrice:vals[0],maxPrice:vals[vals.length-1],minTHB:rate?Math.round(vals[0]*rate):null,maxTHB:rate?Math.round(vals[vals.length-1]*rate):null,priceType:'current_listed_range'}}catch(e){return{tripId,id:item.id,name:item.name,status:'unavailable',source,sourceUrl:item.url,error:String(e?.message||e)}}}
async function mapLimit(items,limit,fn){const out=new Array(items.length);let i=0;async function worker(){while(true){const x=i++;if(x>=items.length)return;out[x]=await fn(items[x],x)}}await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return out}
export async function handleLivePrices(req,url,origin,json,allowed){
  if(url.pathname!=='/api/prices/refresh')return null;
  if(req.method!=='POST')return json({ok:false,error:'method_not_allowed'},405,origin);
  if(!allowed(origin))return json({ok:false,error:'forbidden_origin'},403,origin);
  let body={};try{body=await req.json()}catch{return json({ok:false,error:'invalid_json'},400,origin)}
  const checkedAt=new Date().toISOString(),fx=await currentFx(),rawHotels=Array.isArray(body.hotels)?body.hotels:[],seen=new Set(),hotels=[];
  for(const h of rawHotels){const key=[String(h.tripId||''),String(h.name||''),String(h.start||''),String(h.end||'')].join('|').toLowerCase();if(!h?.name||seen.has(key))continue;seen.add(key);hotels.push(h);if(hotels.length>=MAX_HOTELS)break}
  const hotelResults=await mapLimit(hotels,4,hotelLivePrice),tripIds=[...new Set((Array.isArray(body.tripIds)?body.tripIds:[]).map(String))].slice(0,10),ticketJobs=[];
  for(const id of tripIds)for(const item of TICKET_CATALOG[id]||[])ticketJobs.push({tripId:id,item});
  const tickets=await mapLimit(ticketJobs,4,x=>ticketLivePrice(x.item,fx,x.tripId));
  return json({ok:true,checkedAt,fx,hotels:hotelResults,tickets,meta:{hotelSource:'Google Hotels current listing with consistency validation',ticketSource:'Official/current booking sources',note:'Hotel prices are marked LIVE only when a nightly/total pair is internally consistent for the requested stay. Otherwise price is unavailable rather than guessed.'}},200,origin);
}
