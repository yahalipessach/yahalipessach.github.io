// At most a quarter of stablecoin interest can reach a holder

const B=.0385, UT=184.2, UC=73.4, TF=303.2, OT=TF-UT-UC          // float $bn, 12 Jul 2026
const iT=UT*B, iC=UC*B, iO=OT*B, TOT=iT+iC+iO                    // interest at the 3-month bill (FRED DGS3MO, 10 Jul 2026)
const D=iC*407/653, CH=19*.035+D*(1-305/407), CK=iC-CH           // Circle leg: ceiling, then kept
const HOLD=CH+iO, KEPT=iT+CK                                     // Tether contributes nothing
const ROWS=[['Tether (USDT)','no rewards, in any country',UT,iT,0,iT],
            ['Circle (USDC)','only if a platform passes it on',UC,iC,CH,CK],
            ['Every other issuer','USDS, USDe, DAI, USD1, PYUSD, +370',OT,iO,iO,0]]

const INK='#1A1A18', GY='#6e6e6a', FT='#a3a3a0', RL='#e4e4e0'
const DK='#3d3d3a', MD='#8a8a86', LT='#c9c9c5'
const W=592, H=700, M=14, S=20, G=24, NW=11, X0=236, X1=372, TP=100
const CX=[M,0,318,404,498,578]
const hT=TP, kT=TP+HOLD*S+G, lT=TP+(HOLD*S+G+KEPT*S-TOT*S)/2

function setup(){
  const c=createCanvas(W,H)
  pixelDensity(2)
  noLoop()
  const holder=document.getElementById('sketch-container')
  if(holder){c.parent(holder)}
  textFont('Helvetica')
}

const T=(s,x,y,z,c,a=LEFT,b=NORMAL)=>{textAlign(a,BASELINE);textSize(z);textStyle(b);fill(c);text(s,x,y)}
const rule=(y,c)=>{stroke(c);strokeWeight(1);line(M,y,W-M,y);noStroke()}

function flow(a0,a1,b0,b1,c,al){
  const xa=X0+NW, xm=(xa+X1)/2, k=color(c)
  k.setAlpha(al)
  noStroke()
  fill(k)
  beginShape()
  vertex(xa,a0)
  bezierVertex(xm,a0,xm,b0,X1,b0)
  vertex(X1,b1)
  bezierVertex(xm,b1,xm,a1,xa,a1)
  endShape(CLOSE)
}

function draw(){
  background(255)
  T('At most a quarter of stablecoin interest',M,34,18,INK,LEFT,BOLD)
  T('can reach a holder',M,56,18,INK,LEFT,BOLD)

  const sp=lT+HOLD*S
  flow(lT,sp,hT,hT+HOLD*S,DK,70)
  flow(sp,lT+TOT*S,kT,kT+KEPT*S,LT,110)
  noStroke()
  fill(MD)
  rect(X0,lT,NW,TOT*S)
  fill(DK)
  rect(X1,hT,NW,HOLD*S)
  fill(LT)
  rect(X1,kT,NW,KEPT*S)

  const lc=lT+TOT*S/2, hc=hT+HOLD*S/2, kc=kT+KEPT*S/2, lx=X1+NW+18
  T('$11.7bn',X0-18,lc-6,25,INK,RIGHT,BOLD)
  T('Interest earned each year on',X0-18,lc+13,10.5,GY,RIGHT)
  T('$303bn of stablecoin reserves',X0-18,lc+28,10.5,GY,RIGHT)
  T('$2.9bn',lx,hc-2,22,INK,LEFT,BOLD)
  T('25%',lx+textWidth('$2.9bn')+12,hc-2,13,GY)
  T('The most that can reach a holder',lx,hc+16,10.5,GY)
  T('$8.8bn',lx,kc-6,22,INK,LEFT,BOLD)
  T('75%',lx+textWidth('$8.8bn')+12,kc-6,13,GY)
  T('Kept by the issuers and the',lx,kc+12,10.5,GY)
  T('platforms that distribute them',lx,kc+27,10.5,GY)

  let y=444
  T('ISSUER',CX[0],y,9,FT)
  const HEADS=['FLOAT $BN','INTEREST $BN','MAX TO HOLDERS','KEPT $BN']
  HEADS.forEach((h,i)=>T(h,CX[i+2],y,9,FT,RIGHT))
  rule(y+10,INK)
  y+=36

  for(const [n,note,f,i,h,k] of ROWS){
    T(n,CX[0],y,12.5,INK)
    T(note,CX[0],y+17,10.5,GY)
    T(f.toFixed(1),CX[2],y,12.5,INK,RIGHT)
    T(i.toFixed(2),CX[3],y,12.5,INK,RIGHT)
    T(h.toFixed(2),CX[4],y,12.5,INK,RIGHT,BOLD)
    T(k.toFixed(2),CX[5],y,12.5,GY,RIGHT)
    rule(y+28,RL)
    y+=48
  }

  rule(y-20,INK)
  y+=4
  T('Total',CX[0],y,12.5,INK,LEFT,BOLD)
  const TOTS=[[TF.toFixed(1),CX[2]],[TOT.toFixed(2),CX[3]],[HOLD.toFixed(2),CX[4]],[KEPT.toFixed(2),CX[5]]]
  TOTS.forEach(([v,x])=>T(v,x,y,12.5,INK,RIGHT,BOLD))

  T('Float × 3.85%, the 3-month bill on 10 July 2026.',M,y+38,9.5,FT)
  T('Sources: DefiLlama; FRED (DGS3MO); Circle and Coinbase Q1 2026.',M,y+53,9.5,FT)
}