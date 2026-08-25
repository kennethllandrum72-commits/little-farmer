// Grass, weeds, tool-use animations, and harvestable weed gameplay for Little Farmer.
(() => {
  if (typeof world !== 'function' || typeof player !== 'function') return;
  const baseWorld = world, basePlayer = player;
  let action = null;
  const grass = Array.from({length:180},(_,i)=>({x:30+(i*197)%2240,y:35+(i*313)%1980,h:5+(i%4)*2}));
  const weeds = Array.from({length:48},(_,i)=>({id:i,x:45+(i*431)%2200,y:50+(i*277)%1900,s:7+(i%3)*2}));
  S.bag=S.bag||{}; if(!Number.isFinite(S.bag.fiber))S.bag.fiber=0; S.weeds=S.weeds||{};
  function farmClear(x,y){return x>610&&x<1390&&y>225&&y<980}
  function drawPlants(){
    X.save();X.lineWidth=2;X.lineCap='round';
    for(const g of grass){if(farmClear(g.x,g.y))continue;X.strokeStyle='#3f7f3b';X.beginPath();X.moveTo(g.x,g.y);X.lineTo(g.x-2,g.y-g.h);X.moveTo(g.x,g.y);X.lineTo(g.x+2,g.y-g.h+1);X.stroke()}
    for(const w of weeds){if(farmClear(w.x,w.y)||S.weeds[w.id])continue;X.strokeStyle='#2f6d35';X.beginPath();X.moveTo(w.x,w.y);X.lineTo(w.x,w.y-w.s);X.moveTo(w.x,w.y-4);X.lineTo(w.x-5,w.y-9);X.moveTo(w.x,w.y-6);X.lineTo(w.x+5,w.y-11);X.stroke();X.fillStyle='#5e923e';X.fillRect(w.x-7,w.y-11,5,3);X.fillRect(w.x+2,w.y-13,5,3)}
    X.restore();
  }
  world = function(){baseWorld();drawPlants()};
  function start(kind){action={kind,start:performance.now(),dur:kind==='plant'?430:520}}
  function nearestWeed(){let best=null,bd=54;for(const w of weeds){if(S.weeds[w.id]||farmClear(w.x,w.y))continue;const d=Math.hypot(w.x-p.x,w.y-p.y);if(d<bd){bd=d;best=w}}return best}
  function cutWeed(){const w=nearestWeed();if(!w)return false;if(!spend(1))return true;S.weeds[w.id]=1;S.bag.fiber=(S.bag.fiber||0)+1;let extra='Fiber +1';const r=Math.random();if(r<0.18){const crops=['wheat','carrot','corn'];const c=crops[Math.floor(Math.random()*crops.length)];S.seeds[c]=(S.seeds[c]||0)+1;extra+=' • '+c+' seed +1'}else if(r>0.97){S.bag.lucky_clover=(S.bag.lucky_clover||0)+1;extra+=' • Lucky Clover!'}save();hud();msg(extra);return true}
  const oldUse=use.onclick, oldPlant=plant.onclick;
  use.onclick=()=>{if(cutWeed()){start('scythe');return}start(S.tool==='pickaxe'?'pickaxe':S.tool==='axe'?'axe':'use');oldUse&&oldUse()};
  plant.onclick=()=>{start('plant');oldPlant&&oldPlant()};
  function drawAction(){if(!action)return;let t=(performance.now()-action.start)/action.dur;if(t>=1){action=null;return}let a=Math.sin(t*Math.PI);X.save();X.translate(p.x,p.y-12);X.lineWidth=4;X.lineCap='round';
    if(action.kind==='axe'||action.kind==='pickaxe'||action.kind==='scythe'){let ang=-1.25+t*2.2;X.rotate(ang);X.strokeStyle='#7a4b27';X.beginPath();X.moveTo(3,-8);X.lineTo(3,-38);X.stroke();if(action.kind==='scythe'){X.strokeStyle='#aab4b9';X.lineWidth=5;X.beginPath();X.arc(8,-40,14,-2.5,-0.25);X.stroke()}else{X.fillStyle=action.kind==='axe'?'#b7c0c5':'#8d969b';if(action.kind==='axe')X.fillRect(-5,-43,18,8);else{X.beginPath();X.moveTo(-10,-41);X.lineTo(15,-41);X.lineTo(10,-35);X.lineTo(-6,-35);X.fill()}}}
    else if(action.kind==='plant'){X.fillStyle='#7a4b27';X.fillRect(-11,15,22,5);X.fillStyle='#65a844';X.fillRect(-2,5,4,12);X.fillRect(-7,7,6,4);X.fillRect(1,4,6,4);X.translate(0,a*4)}
    X.restore()}
  player=function(dt){basePlayer(dt);drawAction();const w=nearestWeed();if(w)label('CUT WEED',p.x,p.y-84)};
})();
