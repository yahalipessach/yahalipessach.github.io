// At most a quarter of stablecoin interest can reach a holder

const B=.0385, UT=184.2, UC=73.4, TF=303.2, OT=TF-UT-UC;          // float $bn, 12 Jul 2026
const iT=UT*B, iC=UC*B, iO=OT*B, TOT=iT+iC+iO;                    // interest at the 3-month bill (FRED DGS3MO, 10 Jul 2026)
const D=iC*407/653, CH=19*.035+D*(1-305/407), CK=iC-CH;           // Circle leg: ceiling, then kept
const HOLD=CH+iO, KEPT=iT+CK;                                     // Tether contributes nothing
const ROWS=[['Tether (USDT)','no rewards, in any country',UT,iT,0,iT],
            ['Circle (USDC)','only if a platform passes it on',UC,iC,CH,CK],
            ['Every other issuer, credited in full','USDS, USDe, DAI, USD1, PYUSD, +370',OT,iO,iO,0]];

const INK='#111',GY='#767676',FT='#a0a0a0',RL='#e4e4e4',GN='#1B7F3B',BR='#5a5a5a';
const W=1100,H=690,M=40,S=22,G=28,NW=13,X0=400,X1=660,TP=100,CX=[M,300,660,800,960,1060];
const hT=TP, kT=TP+HOLD*S+G, lT=TP+(HOLD*S+G+KEPT*S-TOT*S)/2;

function setup(){
  createCanvas(W,H); pixelDensity(2); noLoop();
  textFont('Helvetica Neue, Helvetica, Arial, sans-serif');
}

const T=(s,x,y,z,c,a=LEFT,b=NORMAL)=>{textAlign(a,BASELINE);textSize(z);textStyle(b);fill(c);text(s,x,y)};
const rule=(y,c)=>{stroke(c);strokeWeight(1);line(M,y,W-M,y);noStroke()};

function flow(a0,a1,b0,b1,c,al){
  const xa=X0+NW, xm=(xa+X1)/2, k=color(c); k.setAlpha(al);
  noStroke(); fill(k); beginShape();
  vertex(xa,a0); bezierVertex(xm,a0,xm,b0,X1,b0);
  vertex(X1,b1); bezierVertex(xm,b1,xm,a1,xa,a1);
  endShape(CLOSE);
}

function draw(){
  background(255);
  T('At most a quarter of stablecoin interest can reach a holder',M,48,26,INK,LEFT,BOLD);

  const sp=lT+HOLD*S;
  flow(lT,sp,hT,hT+HOLD*S,GN,80);
  flow(sp,lT+TOT*S,kT,kT+KEPT*S,'#a8a8a8',130);
  noStroke();
  fill(BR);rect(X0,lT,NW,TOT*S); fill(GN);rect(X1,hT,NW,HOLD*S); fill(BR);rect(X1,kT,NW,KEPT*S);

  const lc=lT+TOT*S/2, hc=hT+HOLD*S/2, kc=kT+KEPT*S/2, lx=X1+NW+28;
  T('$11.7bn',X0-28,lc-4,40,INK,RIGHT,BOLD);
  T('Interest earned each year on',X0-28,lc+22,14,GY,RIGHT);
  T('$303bn of stablecoin reserves',X0-28,lc+41,14,GY,RIGHT);
  T('$2.9bn',lx,hc-2,34,GN,LEFT,BOLD);   T('25%',lx+textWidth('$2.9bn')+18,hc-2,18,GN);
  T('The most that can reach a holder',lx,hc+22,14,GN);
  T('$8.8bn',lx,kc-6,34,INK,LEFT,BOLD);  T('75%',lx+textWidth('$8.8bn')+18,kc-6,18,GY);
  T('Kept by the issuers and the',lx,kc+18,14,GY);
  T('platforms that distribute them',lx,kc+37,14,GY);

  let y=450;
  T('ISSUER',CX[0],y,11,FT);
  ['FLOAT $BN','INTEREST $BN','MAX TO HOLDERS','KEPT $BN'].forEach((h,i)=>T(h,CX[i+2],y,11,FT,RIGHT));
  rule(y+10,INK); y+=42;

  for(const [n,note,f,i,h,k] of ROWS){
    T(n,CX[0],y,14,INK);  T(note,CX[0]+textWidth(n)+16,y,12.5,GY);
    T(f.toFixed(1),CX[2],y,14,INK,RIGHT);       T(i.toFixed(2),CX[3],y,14,INK,RIGHT);
    T(h.toFixed(2),CX[4],y,14,GN,RIGHT,BOLD);   T(k.toFixed(2),CX[5],y,14,INK,RIGHT);
    rule(y+14,RL); y+=38;
  }

  rule(y-24,INK);
  T('Total',CX[0],y,14,INK,LEFT,BOLD);
  [[TF.toFixed(1),CX[2],INK],[TOT.toFixed(2),CX[3],INK],[HOLD.toFixed(2),CX[4],GN],[KEPT.toFixed(2),CX[5],INK]]
    .forEach(([v,x,c])=>T(v,x,y,14,c,RIGHT,BOLD));

  T('Float × 3.85%, the 3-month bill on 10 July 2026. Sources: DefiLlama; FRED (DGS3MO); Circle and Coinbase Q1 2026.',M,y+44,12,FT);
}