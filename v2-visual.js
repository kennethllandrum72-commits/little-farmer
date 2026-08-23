(()=>{
if(typeof X==='undefined')return;
const AS={};
function img(n){const i=new Image();i.src='assets/'+n;AS[n]=i;return i}
const maple=img('tree-maple.png'), rockImg=img('rock.png'), soil=img('soil.png');
const cropImgs={wheat:img('crop-wheat.png'),carrot:img('crop-carrot.png'),corn:img('crop-corn.png')};
function ready(i){return i&&i.complete&&i.naturalWidth}
function woodFrame(x,y,w,h){X.fillStyle='#5c351c';X.fillRect(x-4,y-4,w+8,h+8);X.fillStyle='#8a5627';X.fillRect(x,y,w,h)}
function pxBuilding(name,x,y,w,h,c){
  sh(x+w/2,y+h+7,w*.46,11); X.save(); X.imageSmoothingEnabled=false;
  X.fillStyle='#4a2617';X.fillRect(x,y+24,w,h-24);
  X.fillStyle=c;X.fillRect(x+6,y+31,w-12,h-37);
  X.fillStyle='#6f321f';X.fillRect(x-8,y+22,w+16,12);
  for(let xx=x-2;xx<x+w;xx+=18){X.fillStyle='#8b4527';X.fillRect(xx,y+4,20,20);X.fillStyle='#6b2b1f';X.fillRect(xx,y+4,20,5)}
  X.fillStyle='#291b18';X.fillRect(x+w/2-17,y+h-39,34,39); X.fillStyle='#d9aa57';X.fillRect(x+w/2+10,y+h-20,4,4);
  X.fillStyle='#9cd1df';X.fillRect(x+18,y+48,25,22);X.fillRect(x+w-43,y+48,25,22);
  X.fillStyle='#3a241b';X.fillRect(x+28,y+48,3,22);X.fillRect(x+18,y+58,25,3);X.fillRect(x+w-33,y+48,3,22);X.fillRect(x+w-43,y+58,25,3);
  X.fillStyle='#2d1d19';X.fillRect(x+10,y+12,w-20,15);X.fillStyle='#f4d9a3';X.font='bold 11px monospace';X.textAlign='center';X.fillText(name,x+w/2,y+24);X.textAlign='left';X.restore();
}
building=pxBuilding;
tree=function(t){if(t.h<=0)return;if(near(t,86))glow(t.x,t.y,39);sh(t.x,t.y+38,25,7);if(ready(maple)){X.save();X.imageSmoothingEnabled=false;X.drawImage(maple,t.x-32,t.y-58,64,96);X.restore();}else{X.fillStyle='#2f7f3d';X.beginPath();X.arc(t.x,t.y-18,28,0,7);X.fill();X.fillStyle='#5b351e';X.fillRect(t.x-6,t.y,12,38)}};
rock=function(r){if(r.h<=0)return;if(near(r,86))glow(r.x,r.y,33);sh(r.x,r.y+17,22,6);if(ready(rockImg)){X.save();X.imageSmoothingEnabled=false;X.drawImage(rockImg,r.x-28,r.y-28,56,56);X.restore();}else{X.fillStyle='#6e767d';X.fillRect(r.x-20,r.y-14,40,28)}};
plot=function(p){
 if(p.s===1&&Date.now()>=p.ready)p.s=2;if((p.s===0||p.s===2)&&near(p,68))glow(p.x,p.y,31);
 X.save();X.imageSmoothingEnabled=false;
 if(ready(soil)){for(let yy=-16;yy<=16;yy+=16)for(let xx=-24;xx<=24;xx+=16)X.drawImage(soil,p.x+xx-8,p.y+yy-8,18,18)}else{woodFrame(p.x-29,p.y-22,58,44);X.fillStyle='#6b3f24';X.fillRect(p.x-25,p.y-18,50,36)}
 if(p.s===1){X.fillStyle='#32783b';X.fillRect(p.x-2,p.y-9,4,17);X.fillRect(p.x-9,p.y-5,8,4);X.fillRect(p.x+2,p.y-7,8,4)}
 if(p.s===2&&cropImgs[p.t]&&ready(cropImgs[p.t])){let ci=cropImgs[p.t],hh=p.t==='corn'?48:36;X.drawImage(ci,p.x-18,p.y-hh+10,36,hh)}
 X.restore();
};
player=function(){let x=S.player.x,y=S.player.y,b=(Math.abs(joy.x)+Math.abs(joy.y)>.12)?Math.sin(walkT)*2:0;sh(x,y+31,18,6);X.fillStyle='#315f9e';X.fillRect(x-11,y+4+b,22,26);X.fillStyle='#b94933';X.fillRect(x-12,y+6+b,5,20);X.fillRect(x+7,y+6+b,5,20);X.fillStyle='#e4af79';X.fillRect(x-9,y-15+b,18,18);X.fillStyle='#8b5a2f';X.fillRect(x-16,y-23+b,32,7);X.fillStyle='#c98b3b';X.fillRect(x-11,y-29+b,22,8);let st=Math.sin(walkT)>0?3:-3;X.fillStyle='#263d55';X.fillRect(x-10+st,y+29+b,8,15);X.fillRect(x+2-st,y+29+b,8,15)};
pens=function(o,w,h,label,n,emoji){if(near(o,145)&&n)glow(o.x,o.y,Math.min(w,h)*.43);X.strokeStyle='#6b421f';X.lineWidth=7;X.strokeRect(o.x-w/2,o.y-h/2,w,h);X.strokeStyle='#a56a2e';X.lineWidth=3;X.strokeRect(o.x-w/2+4,o.y-h/2+4,w-8,h-8);X.fillStyle='#5f391f';X.fillRect(o.x-54,o.y-h/2-19,108,22);X.fillStyle='#f2e0bc';X.font='bold 12px monospace';X.textAlign='center';X.fillText(label,o.x,o.y-h/2-4);X.textAlign='left';X.font='28px sans-serif';for(let i=0;i<Math.min(n,4);i++)X.fillText(emoji,o.x-w/2+24+(i%2)*52,o.y-5+Math.floor(i/2)*34)};
barn=function(){pxBuilding('BARN L'+S.barnLevel,430,690,205,145,'#9e4935')};
let deco=[...Array(90)].map((_,i)=>({x:(i*137)%3650+20,y:(i*211)%1560+20,c:i%3}));function decor(){X.save();X.translate(-cam.x,-cam.y);for(let d of deco){X.fillStyle=d.c===0?'#f5d85d':d.c===1?'#dca0d2':'#b8ddf2';X.fillRect(d.x,d.y,3,3);X.fillRect(d.x-2,d.y+2,7,2)}X.restore();requestAnimationFrame(decor)}requestAnimationFrame(decor);
})();
