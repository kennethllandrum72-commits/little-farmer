(()=>{
if(typeof X==='undefined')return;
const load=n=>{const i=new Image();i.src='assets/'+n+'?v=4';return i};
const maple=load('tree-maple.png'), rockImg=load('rock.png'), soil=load('soil.png');
const cropImgs={wheat:load('crop-wheat.png'),carrot:load('crop-carrot.png'),corn:load('crop-corn.png')};
const flowers=load('tiny-farm-flowers.png');
const ready=i=>i&&i.complete&&i.naturalWidth>0;
function label(name,x,y,w){
  X.fillStyle='rgba(37,27,22,.88)'; X.fillRect(x,y,w,18);
  X.fillStyle='#f7e8c4'; X.font='bold 10px monospace'; X.textAlign='center';
  X.fillText(name,x+w/2,y+13); X.textAlign='left';
}
function pixelBuilding(name,x,y,w,h,c){
  sh(x+w/2,y+h+6,w*.40,9);
  X.save(); X.imageSmoothingEnabled=false;
  X.fillStyle='#3e2619'; X.fillRect(x-4,y+20,w+8,h-20);
  X.fillStyle=c||'#9b6842'; X.fillRect(x+4,y+33,w-8,h-37);
  for(let yy=0;yy<3;yy++)for(let xx=0;xx<Math.ceil(w/16)+1;xx++){
    X.fillStyle=((xx+yy)&1)?'#733624':'#8e472a';
    X.fillRect(x-7+xx*16,y+4+yy*8,18,9);
  }
  X.fillStyle='#5e2b20';X.fillRect(x-8,y+26,w+16,8);
  X.fillStyle='#e0c59d';X.fillRect(x+w/2-20,y+h-45,40,45);
  X.fillStyle='#49332a';X.fillRect(x+w/2-15,y+h-40,30,40);
  X.fillStyle='#c99a4a';X.fillRect(x+w/2+8,y+h-20,4,4);
  X.fillStyle='#c7e7ef';X.fillRect(x+14,y+49,28,24);X.fillRect(x+w-42,y+49,28,24);
  X.fillStyle='#3a2a22';X.fillRect(x+26,y+49,3,24);X.fillRect(x+14,y+59,28,3);
  X.fillRect(x+w-30,y+49,3,24);X.fillRect(x+w-42,y+59,28,3);
  label(name,x+8,y+8,Math.max(74,w-16));
  X.restore();
}
building=pixelBuilding;
barn=function(){pixelBuilding('BARN L'+S.barnLevel,430,690,205,145,'#a84f3c')};
tree=function(t){
  if(t.h<=0)return;
  if(near(t,86))glow(t.x,t.y,39);
  sh(t.x,t.y+42,27,8);
  if(ready(maple)){
    X.save();X.imageSmoothingEnabled=false;
    X.drawImage(maple,t.x-33,t.y-68,66,109);X.restore();
  }else{
    X.fillStyle='#2a7437';X.fillRect(t.x-24,t.y-35,48,48);
    X.fillStyle='#6a3b22';X.fillRect(t.x-5,t.y,10,40);
  }
};
rock=function(r){
  if(r.h<=0)return;
  if(near(r,86))glow(r.x,r.y,33);
  sh(r.x,r.y+18,23,6);
  if(ready(rockImg)){X.save();X.imageSmoothingEnabled=false;X.drawImage(rockImg,r.x-27,r.y-27,54,54);X.restore();}
  else{X.fillStyle='#68727a';X.fillRect(r.x-22,r.y-14,44,28)}
};
plot=function(p){
  if(p.s===1&&Date.now()>=p.ready)p.s=2;
  if((p.s===0||p.s===2)&&near(p,68))glow(p.x,p.y,31);
  X.save();X.imageSmoothingEnabled=false;
  if(ready(soil)){
    for(let yy=-16;yy<=16;yy+=16)for(let xx=-24;xx<=24;xx+=16)
      X.drawImage(soil,p.x+xx-8,p.y+yy-8,18,18);
  }else{X.fillStyle='#6a4228';X.fillRect(p.x-29,p.y-22,58,44)}
  if(p.s===1){
    X.fillStyle='#397b3c';X.fillRect(p.x-2,p.y-10,4,18);
    X.fillRect(p.x-10,p.y-5,8,4);X.fillRect(p.x+2,p.y-8,9,4);
  }
  if(p.s===2&&cropImgs[p.t]&&ready(cropImgs[p.t])){
    const sz=p.t==='corn'?42:36;
    X.drawImage(cropImgs[p.t],p.x-sz/2,p.y-sz+12,sz,sz);
  }
  X.restore();
};
player=function(){
  const x=S.player.x,y=S.player.y,moving=Math.abs(joy.x)+Math.abs(joy.y)>.12;
  const step=moving?(Math.floor(Date.now()/140)%2)*2:0;
  sh(x,y+28,16,5);
  X.save();X.imageSmoothingEnabled=false;
  X.fillStyle='#c88949';X.fillRect(x-13,y-28+step,26,5);
  X.fillStyle='#d8a556';X.fillRect(x-9,y-34+step,18,8);
  X.fillStyle='#e6b47f';X.fillRect(x-8,y-24+step,16,13);
  X.fillStyle='#4a2d22';X.fillRect(x-8,y-24+step,16,3);
  X.fillStyle='#275d91';X.fillRect(x-10,y-10+step,20,20);
  X.fillStyle='#b24a39';X.fillRect(x-14,y-8+step,4,17);X.fillRect(x+10,y-8+step,4,17);
  X.fillStyle='#263b55';
  X.fillRect(x-9,y+10+(step?0:1),7,14);X.fillRect(x+2,y+10+(step?1:0),7,14);
  X.restore();
};
pens=function(o,w,h,labelText,n,emoji){
  if(near(o,145)&&n)glow(o.x,o.y,Math.min(w,h)*.43);
  X.strokeStyle='#7b4b27';X.lineWidth=6;X.strokeRect(o.x-w/2,o.y-h/2,w,h);
  X.strokeStyle='#c39152';X.lineWidth=2;X.strokeRect(o.x-w/2+4,o.y-h/2+4,w-8,h-8);
  label(labelText,o.x-54,o.y-h/2-20,108);
  X.font='26px sans-serif';
  for(let i=0;i<Math.min(n,4);i++)X.fillText(emoji,o.x-w/2+24+(i%2)*52,o.y-5+Math.floor(i/2)*34);
};
const raf=window.requestAnimationFrame.bind(window);
function assetDecor(){
  if(typeof cam!=='undefined'&&ready(flowers)){
    X.save();X.imageSmoothingEnabled=false;X.translate(-cam.x,-cam.y);
    for(let i=0;i<28;i++){
      const x=(i*223)%3500+80,y=(i*307)%1480+70,frame=i%7;
      X.drawImage(flowers,frame*16,0,16,32,x,y,16,32);
    }
    X.restore();
  }
  raf(assetDecor);
}
raf(assetDecor);
})();