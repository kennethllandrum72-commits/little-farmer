// Extra progression: visible resource timers and more repeatable town jobs.
(function(){
  if (typeof jobs !== 'undefined') {
    jobs.push(
      {title:'Stone for the Road',kind:'stone',goal:6,reward:105},
      {title:'Big Harvest',kind:'harvest',goal:10,reward:150},
      {title:'River Catch',kind:'fish',goal:6,reward:165},
      {title:'Winter Woodpile',kind:'wood',goal:14,reward:185},
      {title:'Deep Mine Order',kind:'ore',goal:6,reward:210},
      {title:'Bakery Eggs',kind:'eggs',goal:6,reward:170},
      {title:'Dairy Delivery',kind:'milk',goal:4,reward:190},
      {title:'Town Stonework',kind:'stone',goal:12,reward:220}
    );
  }

  function timerLabel(x,y,label,ms){
    const s=Math.max(0,Math.ceil(ms/1000));
    X.save();
    X.font='bold 12px monospace';
    X.textAlign='center';
    const text=label+' '+s+'s';
    const w=Math.max(60,X.measureText(text).width+12);
    X.fillStyle='#1d2b1dcc';
    X.fillRect(Math.round(x-w/2),Math.round(y-14),Math.round(w),20);
    X.fillStyle='#fff6a8';
    X.fillText(text,x,y+1);
    X.restore();
  }

  const oldTree=tree;
  tree=function(t){
    if(t.h<=0){
      const left=t.resp-Date.now();
      if(left>0){
        sh(t.x,t.y+42,18,5);
        px(t.x-13,t.y+20,26,7,'#76502e');
        px(t.x-7,t.y+12,14,10,'#8d6238');
        timerLabel(t.x,t.y-4,'TREE',left);
      }
      return;
    }
    oldTree(t);
  };

  const oldRock=rock;
  rock=function(r){
    if(r.h<=0){
      const left=r.resp-Date.now();
      if(left>0){
        sh(r.x,r.y+17,20,5);
        px(r.x-18,r.y+4,36,9,'#5e6368');
        px(r.x-10,r.y-1,20,7,'#787e83');
        timerLabel(r.x,r.y-20,'ROCK',left);
      }
      return;
    }
    oldRock(r);
  };

  const oldPlot=plot;
  plot=function(p){
    oldPlot(p);
    if(p.s===1 && p.ready>Date.now()){
      const left=p.ready-Date.now();
      if(near(p,90)) timerLabel(p.x,p.y-32,'CROP',left);
    }
  };

  const oldPens=pens;
  pens=function(o,w,h,label,n,emoji){
    oldPens(o,w,h,label,n,emoji);
    if(!n || !near(o,180)) return;
    let left=0,tag='';
    if(o===chicken){
      const wait=Math.max(3500,8000-S.barnLevel*1200);
      left=Math.max(0,wait-(Date.now()-S.lastEgg));
      tag=left>0?'EGGS':'EGGS READY';
    }else if(o===cow){
      const wait=Math.max(4500,10000-S.barnLevel*1500);
      left=Math.max(0,wait-(Date.now()-S.lastMilk));
      tag=left>0?'MILK':'MILK READY';
    }
    if(tag){
      if(left>0) timerLabel(o.x,o.y-h/2-30,tag,left);
      else {
        X.save();X.font='bold 12px monospace';X.textAlign='center';X.fillStyle='#173a20dd';X.fillRect(o.x-48,o.y-h/2-45,96,20);X.fillStyle='#b9ffb9';X.fillText(tag,o.x,o.y-h/2-30);X.restore();
      }
    }
  };
})();