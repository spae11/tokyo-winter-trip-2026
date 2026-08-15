(()=>{
  if(window.__mapTripRoutesV2)return;window.__mapTripRoutesV2=true;
  const clearVisualRoute=()=>{try{if(typeof map==='undefined'||!map)return;const remove=[];map.eachLayer(l=>{if(l instanceof L.Polyline&&l.options?.color==='#B21F2D')remove.push(l);else if(l instanceof L.Marker&&l.options?.icon?.options?.className==='route-map-marker')remove.push(l)});remove.forEach(l=>map.removeLayer(l))}catch(e){}};
  let n=0;const wait=setInterval(()=>{n++;if(window.__mapTripRoutesPatched&&typeof showCountry==='function'&&typeof showRegion==='function'){
    clearInterval(wait);
    const countryFn=showCountry,regionFn=showRegion;
    showCountry=function(key){clearVisualRoute();return countryFn.apply(this,arguments)};
    showRegion=function(key,region){clearVisualRoute();return regionFn.apply(this,arguments)};
  }else if(n>100)clearInterval(wait)},80);

  const loadJourneyMap=()=>{
    if(!document.querySelector('link[data-journey-map]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/tokyo-winter-trip-2026/journey-map-v1.css?v=1';l.dataset.journeyMap='1';document.head.appendChild(l)}
    if(!window.__journeyMapV1&&!document.querySelector('script[data-journey-map]')){const s=document.createElement('script');s.src='/tokyo-winter-trip-2026/journey-map-v1.js?v=1';s.dataset.journeyMap='1';document.body.appendChild(s)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadJourneyMap,{once:true});else loadJourneyMap();
})();