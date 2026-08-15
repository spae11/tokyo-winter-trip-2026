(()=>{
  if(window.__simpleMapV1)return;window.__simpleMapV1=true;
  let tries=0;
  const wait=setInterval(()=>{
    tries++;
    if(typeof map!=='undefined'&&map){
      clearInterval(wait);
      try{
        ['dragging','touchZoom','doubleClickZoom','boxZoom','keyboard'].forEach(k=>map[k]?.enable?.());
        map.scrollWheelZoom?.enable?.();
        map.tap?.enable?.();
        map.invalidateSize?.();
      }catch(e){}
      const stage=document.getElementById('mapStage');
      if(stage){
        stage.setAttribute('aria-label','แผนที่แบบโต้ตอบ ลากเพื่อเลื่อน แตะประเทศเพื่อซูมเข้า และใช้สองนิ้วเพื่อซูม');
      }
    }else if(tries>120){clearInterval(wait)}
  },80);
})();
