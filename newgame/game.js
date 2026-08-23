const C=document.getElementById('game'),X=C.getContext('2d');X.imageSmoothingEnabled=false;
let W,H,dpr,cam={x:0,y:0},p={x:900,y:620},joy={x:0,y:0},walk=0,last=performance.now();
const WORLD={w:2300,h:1350},A={};
function load(n){let i=new Image;i.src='../assets/'+n;A[n]=i}
['tree-maple.png','rock.png','soil.png','crop-wheat.png','crop-carrot.png','crop-corn.png','tiny-farm-flowers.png','house-farm.png','barn.png','player-walk.png'].forEach(load);
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;C.width=W*dpr;C.height=H*dpr;X.setTransform(dpr,0,0,dpr,0,0);X.imageSmoothingEnabled=false}addEventListener('resize',resize);resize();
const trees=Array.from({length:70},(_,i)=>({x:70+(i*211)%2150,y:70+(i*137)%1220})).filter(t=>!(t.x>650&&t.x<1350&&t.y>220&&t.y<920));
const rocks=Array.from({length:36},(_,i)=>({x:100+(i*293)%2100,y:100+(i*181)%1180})).filter(r=>!(r.x>650&&r.x<1350&&r.y>220&&r.y<920));
const plots=Array.from({length:24},(_,i)=>({x:720+(i%6)*54,y:760+Math.floor(i/6)*48,c:i%3}));
const house={x:760,y:300,w:160,h:192},barn={x:1080,y:310,w:192,h:192};
function ready(n){let a=A[n];return a&&a.complete&&a.naturalWidth}
function img(n,x,y,w,h){let a=A[n];if(ready(n))X.drawImage(a,x,y,w,h)}
function label(t,x,y){X.save();X.font='bold 16px monospace';X.textAlign='center';X.fillStyle='#3a2418';X.fillRect(x-70,y-18,140,24);X.fillStyle='#f5e3b4';X.fillText(t,x,y);X.restore()}
function world(){
 X.fillStyle='#6aa654';X.fillRect(0,0,WORLD.w,WORLD.h);
 // farm roads
 X.fillStyle='#d8b86c';X.fillRect(0,565,WORLD.w,92);X.fillRect(960,0,104,WORLD.h);
 X.fillStyle='#caa45b';for(let x=0;x<WORLD.w;x+=64){X.fillRect(x,600,34,4)}for(let y=0;y<WORLD.h;y+=64){X.fillRect(1008,y,4,34)}
 // fenced farm yard
 X.strokeStyle='#825225';X.lineWidth=7;X.strokeRect(620,235,760,730);X.strokeStyle='#c28a42';X.lineWidth=3;X.strokeRect(624,239,752,722);
 // buildings from Farm Pack
 if(ready('house-farm.png')){X.drawImage(A['house-farm.png'],house.x,house.y,house.w,house.h);label('FARMHOUSE',house.x+house.w/2,house.y+house.h+28)}
 if(ready('barn.png')){X.drawImage(A['barn.png'],barn.x,barn.y,barn.w,barn.h);label('BARN',barn.x+barn.w/2,barn.y+barn.h+28)}
 // resources
 for(let t of trees)img('tree-maple.png',t.x-28,t.y-62,56,84);
 for(let r of rocks)img('rock.png',r.x-20,r.y-20,40,40);
 // farm plots and crops
 for(let q of plots){for(let yy=0;yy<3;yy++)for(let xx=0;xx<3;xx++)img('soil.png',q.x+xx*16,q.y+yy*14,18,16);let n=['crop-wheat.png','crop-carrot.png','crop-corn.png'][q.c];img(n,q.x+10,q.y-8,30,q.c===2?44:38)}
 // pack flowers
 let f=A['tiny-farm-flowers.png'];if(f&&f.complete&&f.naturalWidth)for(let i=0;i<46;i++){let x=(i*167)%2200+30,y=(i*251)%1280+20;if(x>640&&x<1390&&y>230&&y<970)continue;X.drawImage(f,(i%7)*16,0,16,32,x,y,16,32)}
}
function nearRect(o,d=70){let cx=Math.max(o.x,Math.min(p.x,o.x+o.w)),cy=Math.max(o.y,Math.min(p.y,o.y+o.h));return Math.hypot(p.x-cx,p.y-cy)<d}
function player(dt){
 const moving=Math.abs(joy.x)+Math.abs(joy.y)>.12;if(moving)walk+=dt*0.012;
 X.fillStyle='#0004';X.beginPath();X.ellipse(p.x,p.y+19,14,5,0,0,Math.PI*2);X.fill();
 if(ready('player-walk.png')){let frame=moving?Math.floor(walk)%4:0;X.drawImage(A['player-walk.png'],frame*32,0,32,32,p.x-24,p.y-34,48,48)}
 else{X.fillStyle='#315f9e';X.fillRect(p.x-10,p.y-8,20,28);X.fillStyle='#dca36f';X.fillRect(p.x-7,p.y-23,14,15)}
 if(nearRect(house)){label('HOME',p.x,p.y-52)}else if(nearRect(barn)){label('BARN',p.x,p.y-52)}
}
function frame(now){let dt=Math.min(40,now-last);last=now;p.x=Math.max(22,Math.min(WORLD.w-22,p.x+joy.x*3.3));p.y=Math.max(22,Math.min(WORLD.h-22,p.y+joy.y*3.3));cam.x=Math.max(0,Math.min(Math.max(0,WORLD.w-W),p.x-W*.5));cam.y=Math.max(0,Math.min(Math.max(0,WORLD.h-H),p.y-H*.5));X.setTransform(dpr,0,0,dpr,0,0);X.clearRect(0,0,W,H);X.save();X.translate(-cam.x,-cam.y);world();player(dt);X.restore();requestAnimationFrame(frame)}requestAnimationFrame(frame);
let j=document.getElementById('joy'),s=document.getElementById('stick');function move(e){let r=j.getBoundingClientRect(),t=e.touches?e.touches[0]:e,dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2),m=Math.hypot(dx,dy)||1,k=Math.min(1,48/m);joy.x=dx/48*k;joy.y=dy/48*k;s.style.transform=`translate(${joy.x*28}px,${joy.y*28}px)`}j.addEventListener('touchstart',move,{passive:false});j.addEventListener('touchmove',e=>{e.preventDefault();move(e)},{passive:false});j.addEventListener('touchend',()=>{joy.x=joy.y=0;s.style.transform=''})