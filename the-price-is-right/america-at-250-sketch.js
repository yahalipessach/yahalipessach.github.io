var INK="#1A1A18",MUTE="#8E8C85",FAINT="#E2E0D8",BG="#FAFAF8",RED="#d62728",BLUE="#1f77b4";
var P=[[[-5,-4],[3,-2]],[[-2,2],[0,0]]];
var DEFAULT=JSON.parse(JSON.stringify(P));
var OBS={retreat:21/27,punish:8/27};
var W,H=402,M={},drag=null;

function setup(){
  var holder=document.getElementById("sketch");
  W=Math.min(950,(holder?holder.clientWidth:windowWidth)||950);
  var c=createCanvas(W,H);
  if(holder){c.parent(holder);}
  M={x:96,y:88,cw:Math.min(185,W*0.23),ch:120};
  textFont("Helvetica");
}

function bestResponses(){
  var brWH=[],brM=[],i;
  for(i=0;i<2;i++){
    brWH[i]=P[0][i][0]>P[1][i][0]?0:P[0][i][0]<P[1][i][0]?1:-1;
  }
  for(i=0;i<2;i++){
    brM[i]=P[i][0][1]>P[i][1][1]?0:P[i][0][1]<P[i][1][1]?1:-1;
  }
  return{brWH:brWH,brM:brM};
}

function pureNE(b){
  var out=[],r,c;
  for(r=0;r<2;r++){
    for(c=0;c<2;c++){
      if((b.brWH[c]===r||b.brWH[c]===-1)&&(b.brM[r]===c||b.brM[r]===-1)){
        out.push([r,c]);
      }
    }
  }
  return out;
}

function mixedNE(){
  var dW=P[0][0][0]-P[1][0][0]-P[0][1][0]+P[1][1][0];
  var dM=P[0][0][1]-P[0][1][1]-P[1][0][1]+P[1][1][1];
  if(!dW||!dM){return null;}
  var q=(P[1][1][0]-P[0][1][0])/dW;
  var p=(P[1][1][1]-P[1][0][1])/dM;
  if(p>0&&p<1&&q>0&&q<1){return{p:p,q:q};}
  return null;
}

function isOffDiag(ne){
  var i;
  for(i=0;i<ne.length;i++){
    if(ne[i][0]===ne[i][1]){return false;}
  }
  return true;
}

function isDiag(ne){
  var i;
  for(i=0;i<ne.length;i++){
    if(ne[i][0]!==ne[i][1]){return false;}
  }
  return true;
}

function classify(ne){
  var dW=P[0][0][0]>P[1][0][0]&&P[0][1][0]>P[1][1][0]?0:P[0][0][0]<P[1][0][0]&&P[0][1][0]<P[1][1][0]?1:-1;
  var dM=P[0][0][1]>P[0][1][1]&&P[1][0][1]>P[1][1][1]?0:P[0][0][1]<P[0][1][1]&&P[1][0][1]<P[1][1][1]?1:-1;
  if(dW>=0&&dM>=0){
    if(P[1-dW][1-dM][0]>P[dW][dM][0]&&P[1-dW][1-dM][1]>P[dW][dM][1]){return"Prisoner's Dilemma";}
    return"Dominance solvable";
  }
  if((dW>=0||dM>=0)&&ne.length===1){return"Dominance solvable";}
  if(ne.length===2&&isOffDiag(ne)){
    var crashWorst=P[0][0][0]<Math.min(P[0][1][0],P[1][0][0],P[1][1][0])&&
                   P[0][0][1]<Math.min(P[0][1][1],P[1][0][1],P[1][1][1]);
    var ordering=P[1][1][0]>P[1][0][0]&&P[1][1][1]>P[0][1][1]&&
                 P[0][1][0]>P[1][1][0]&&P[1][0][1]>P[1][1][1];
    if(crashWorst&&ordering){return"Chicken";}
    return"Anti-coordination";
  }
  if(ne.length===2){
    if(isDiag(ne)){return"Coordination";}
    return"Unclassified";
  }
  if(ne.length===0){return"Cycling (no pure NE)";}
  return"Unclassified";
}

function cellRect(r,c){
  return{x:M.x+c*(M.cw+8),y:M.y+r*(M.ch+8),w:M.cw,h:M.ch};
}

function payoffPos(r,c,who){
  var cr=cellRect(r,c);
  if(who===0){return{x:cr.x+cr.w*0.32,y:cr.y+cr.h*0.62};}
  return{x:cr.x+cr.w*0.68,y:cr.y+cr.h*0.38};
}

function vlabel(tx,ty,s){
  push();
  translate(tx,ty);
  rotate(-HALF_PI);
  textAlign(CENTER,BOTTOM);
  text(s,0,0);
  pop();
}

function draw(){
  background(BG);
  noStroke();fill(INK);textSize(18);textAlign(LEFT,TOP);
  text("A (not so accurate) game of chicken",30,14);
  fill(MUTE);textSize(11);
  text("Drag the payoffs.",30,38);
  var br=bestResponses();
  var ne=pureNE(br);
  var mx=mixedNE();
  var name=classify(ne);
  var pred=null;
  if(mx){
    pred={retreat:1-mx.p,punish:mx.q};
  }else if(ne.length===1){
    pred={retreat:ne[0][0],punish:1-ne[0][1]};
  }
  noStroke();fill(MUTE);textSize(10.5);textAlign(CENTER,BOTTOM);
  text("PUNISH",M.x+M.cw/2,M.y-10);
  text("HOLD",M.x+M.cw*1.5+8,M.y-10);
  text("MARKET",M.x+M.cw+4,M.y-28);
  vlabel(M.x-66,M.y+M.ch+4,"WHITE  HOUSE");
  vlabel(M.x-46,M.y+M.ch/2,"ESCALATE");
  vlabel(M.x-46,M.y+M.ch*1.5+8,"RETREAT");
  var r,c,i,who;
  for(r=0;r<2;r++){
    for(c=0;c<2;c++){
      var cr=cellRect(r,c);
      stroke(FAINT);strokeWeight(1);fill(255);
      rect(cr.x,cr.y,cr.w,cr.h,6);
      noStroke();
      var isNE=false;
      for(i=0;i<ne.length;i++){
        if(ne[i][0]===r&&ne[i][1]===c){isNE=true;}
      }
      if(isNE){
        fill(INK);textSize(13);textAlign(RIGHT,TOP);
        text("\u2605",cr.x+cr.w-9,cr.y+6);
      }
      var p0=payoffPos(r,c,0);
      var p1=payoffPos(r,c,1);
      fill(MUTE);textSize(11);textAlign(CENTER,CENTER);
      text(",",(p0.x+p1.x)/2,(p0.y+p1.y)/2);
      for(who=0;who<2;who++){
        var pp=who===0?p0:p1;
        var v=P[r][c][who];
        var isBR=who===0?br.brWH[c]===r:br.brM[r]===c;
        var isDrag=drag&&drag.r===r&&drag.c===c&&drag.who===who;
        noStroke();fill(who===0?BLUE:RED);
        textSize(isDrag?25:22);textAlign(CENTER,CENTER);
        var lab=nf(v,0,1).replace(".0","");
        text(lab,pp.x,pp.y);
        if(isBR){
          var tw=textWidth(lab);
          stroke(who===0?BLUE:RED);strokeWeight(1.8);
          line(pp.x-tw/2-2,pp.y+14,pp.x+tw/2+2,pp.y+14);
        }
      }
    }
  }
  var ly=M.y+2*M.ch+22;
  noStroke();fill(MUTE);textSize(9.5);textAlign(LEFT,TOP);
  text("underline = best response   \u2605 = Nash",M.x,ly);
  text("reset",M.x+2*M.cw-20,ly);
  var px=M.x+2*M.cw+52;
  var py=M.y+4;
  fill(INK);textSize(20);text(name,px,py);
  fill(MUTE);textSize(10);
  text("model",px+126,py+32);
  text("2025-26",px+196,py+32);
  pair(px,py+46,"White House retreats",pred?pred.retreat:null,OBS.retreat);
  pair(px,py+76,"Market punishes",pred?pred.punish:null,OBS.punish);
  if(!pred){
    fill(MUTE);textSize(11);
    text("multiple equilibria: no single prediction",px,py+118,W-px-14,40);
  }
  textSize(8.5);textAlign(LEFT,TOP);
  text("Generated using p5.js, with the help of Claude AI. Data: CRS R48549.",M.x,ly+34);
}

function pair(x,y,label,model,obs){
  noStroke();fill(MUTE);textSize(10);textAlign(LEFT,CENTER);
  text(label,x,y+5);
  textAlign(CENTER,CENTER);textSize(13);
  fill(model==null?MUTE:INK);
  text(model==null?"-":(model*100).toFixed(0)+"%",x+142,y+5);
  fill(INK);
  text((obs*100).toFixed(0)+"%",x+212,y+5);
}

function hitPayoff(a,b){
  var r,c,who;
  for(r=0;r<2;r++){
    for(c=0;c<2;c++){
      for(who=0;who<2;who++){
        var p=payoffPos(r,c,who);
        if(abs(a-p.x)<26&&abs(b-p.y)<24){return{r:r,c:c,who:who};}
      }
    }
  }
  return null;
}

function mousePressed(){
  var ly=M.y+2*M.ch+22;
  if(abs(mouseY-(ly+5))<12&&mouseX>M.x+2*M.cw-26&&mouseX<M.x+2*M.cw+24){
    P=JSON.parse(JSON.stringify(DEFAULT));
    return;
  }
  var h=hitPayoff(mouseX,mouseY);
  if(h){
    drag={r:h.r,c:h.c,who:h.who,startY:mouseY,startV:P[h.r][h.c][h.who]};
  }
}

function mouseDragged(){
  if(!drag){return;}
  P[drag.r][drag.c][drag.who]=constrain(Math.round((drag.startV+(drag.startY-mouseY)/14)*2)/2,-8,8);
  return false;
}

function mouseReleased(){drag=null;}
function touchEnded(){drag=null;}
function touchStarted(){
  mousePressed();
  if(hitPayoff(mouseX,mouseY)){return false;}
}
function touchMoved(){
  if(drag){
    mouseDragged();
    return false;
  }
}