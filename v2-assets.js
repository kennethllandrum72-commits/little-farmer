(()=>{
  const flowerSheet=new Image();
  flowerSheet.src='assets/tiny-farm-flowers.png';
  flowerSheet.onload=()=>console.log('Tiny Farm asset pack loaded');
  const oldRAF=window.requestAnimationFrame;
  // Add real pixel-art flowers from the uploaded Tiny Farm RPG asset pack.
  function assetFlowers(){
    if(typeof X==='undefined'||typeof cam==='undefined'){oldRAF(assetFlowers);return;}
    if(flowerSheet.complete&&flowerSheet.naturalWidth){
      X.save();X.imageSmoothingEnabled=false;X.translate(-cam.x,-cam.y);
      for(let i=0;i<72;i++){
        const x=(i*197)%3500+70, y=(i*263)%1480+55;
        const frame=i%7;
        X.drawImage(flowerSheet,frame*16,0,16,32,x,y,24,48);
      }
      X.restore();
    }
    oldRAF(assetFlowers);
  }
  oldRAF(assetFlowers);
})();
