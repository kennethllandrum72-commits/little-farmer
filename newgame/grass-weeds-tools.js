// Grass, weeds, tool-use animations, and harvestable weed gameplay for Little Farmer.
(() => {
  if (typeof world !== 'function' || typeof player !== 'function') return;
  const baseWorld = world, basePlayer = player;
  let action = null;
  const grass = Array.from({length:520},(_,i)=>({x:20+(i*157)%2260,y:25+(i*263)%1995,h:9+(i%5)*2,w:2+(i%2)}));
  const weeds = Array.from({length:58},(_,i)=>({id:i,x:45+(i*431)%2200,y:50+(i*277)%1900,s:9+(i%4)*2}));
  S.bag=S.bag||{}; if(!Number.isFinite(S.bag.fiber))S.bag.fiber=0; S.weeds=S.weeds||{};
  function nearCoreFarm(x,y){return x>690&&x<1320&&y>285&&y<930}
  function onRoad(x,y){return (y>555&&y<670)||(x>945&&x<1080&&y<1390)}
  function drawGrassPatch(g){
    X.save();X.lineCap='round';X.lineWidth=g.w;
    X.strokeStyle=(g.x+g.y)%3===0?'#2f7d38':'#4f9b43';
    X.beginPath();
    X.moveTo(g.x,g.y);X.lineTo(g.x-3,g.y-g.h);
    X.moveTo(g.x,g.y);X.lineTo(g.x+3,g.y-g.h+1);
    X.moveTo(g.x+1,g.y);X.lineTo(g.x+1,g.y-g.h-3);
    X.stroke();
    X.restore();
  }
  function drawPlants(){
    for(const g of grass){
      if(onRoad(g.x,g.y))continue;
      if(nearCoreFarm(g.x,g.y) && ((g.x+g.y)%4!==0))continue;
      drawGrassPatch(g);
    }
    X.save();X.lineWidth=3;X.lineCap='round';
    for(const w of weeds){if(nearCoreFarm(w.x,w.y)||S.weeds[w.id])continue;X.strokeStyle='#246632';X.beginPath();X.moveTo(w.x,w.y);X.lineTo(w.x,w.y-w.s);X.moveTo(w.x,w.y-4);X.lineTo(w.x-6,w.y-10);X.moveTo(w.x,w.y-7);X.lineTo(w.x+6,w.y-12);X.stroke();X.fillStyle='#67a84b';X.fillRect(w.x-8,w.y-12,6,4);X.fillRect(w.x+2,w.y-14,6,4)}
    X.restore();
  }
  world = function(){baseWorld();drawPlants()};
  function start(kind){action={kind,start:performance.now(),dur:kind==='plant'?430:520}}
  function nearestWeed(){let best=null,bd=54;for(const w of weeds){if(S.weeds[w.id]||nearCoreFarm(w.x,w.y))continue;const d=Math.hypot(w.x-p.x,w.y-p.y);if(d<bd){bd=d;best=w}}return best}
  function cutWeed(){const w=nearestWeed();if(!w)return false;if(!spend(1))return true;S.weeds[w.id]=1;S.bag.fiber=(S.bag.fiber||0)+1;let extra='Fiber +1';const r=Math.random();if(r<0.18){const crops=['wheat','carrot','corn'];const c=crops[Math.floor(Math.random()*crops.length)];S.seeds[c]=(S.seeds[c]||0)+1;extra+=' • '+c+' seed +1'}else if(r>0.97){S.bag.lucky_clover=(S.bag.lucky_clover||0)+1;extra+=' • Lucky Clover!'}save();hud();msg(extra);return true}
  const oldUse=use.onclick, oldPlant=plant.onclick;
  use.onclick=()=>{if(cutWeed()){start('scythe');return}start(S.tool==='pickaxe'?'pickaxe':S.tool==='axe'?'axe':'use');oldUse&&oldUse()};
  plant.onclick=()=>{start('plant');oldPlant&&oldPlant()};
  function drawAction(){if(!action)return;let t=(performance.now()-action.start)/action.dur;if(t>=1){action=null;return}X.save();X.translate(p.x,p.y-12);X.lineWidth=4;X.lineCap='round';
    if(action.kind==='axe'||action.kind==='pickaxe'||action.kind==='scythe'){let ang=-1.25+t*2.2;X.rotate(ang);X.strokeStyle='#7a4b27';X.beginPath();X.moveTo(3,-8);X.lineTo(3,-38);X.stroke();if(action.kind==='scythe'){X.strokeStyle='#aab4b9';X.lineWidth=5;X.beginPath();X.arc(8,-40,14,-2.5,-0.25);X.stroke()}else{X.fillStyle=action.kind==='axe'?'#b7c0c5':'#8d969b';if(action.kind==='axe')X.fillRect(-5,-43,18,8);else{X.beginPath();X.moveTo(-10,-41);X.lineTo(15,-41);X.lineTo(10,-35);X.lineTo(-6,-35);X.fill()}}}
    else if(action.kind==='plant'){X.fillStyle='#7a4b27';X.fillRect(-11,15,22,5);X.fillStyle='#65a844';X.fillRect(-2,5,4,12);X.fillRect(-7,7,6,4);X.fillRect(1,4,6,4)}
    X.restore()}
  player=function(dt){basePlayer(dt);drawAction();const w=nearestWeed();if(w)label('CUT WEED',p.x,p.y-84)};
})();
