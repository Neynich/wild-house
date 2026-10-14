/* Участок: ограждение и газон */
function fencePrims(){const f=fenceSt,o=[];if(f==='none')return o;
const B=(x,z,w,d,y,h,c,a)=>o.push({t:'B',x,z,w,d,y,h,c,a}),C=(x,z,r,y,h,c)=>o.push({t:'C',x,z,r,y,h,c}),O=(x,y,z,r,c)=>o.push({t:'O',x,y,z,r,c});
const hw=PW/2,hd=PD/2,GAP=2,segs=[[-hw,-hd,hw,-hd],[hw,-hd,hw,hd],[-hw,hd,-GAP,hd],[GAP,hd,hw,hd],[-hw,-hd,-hw,hd]];let hi=0;
segs.forEach(sg=>{const dx=sg[2]-sg[0],dz=sg[3]-sg[1],len=Math.hypot(dx,dz);if(len<.5)return;const n=Math.max(1,Math.round(len/(f==='hedge'?.9:3))),ux=dx/len,uz=dz/len,hz=Math.abs(dz)<Math.abs(dx);
for(let i=0;i<=n;i++){const px=sg[0]+ux*len*i/n,pz=sg[1]+uz*len*i/n;
if(f==='brick')B(px,pz,.5,.5,0,1.9,0x9C4F3A);else if(f==='solid')B(px,pz,.16,.16,0,1.95,0x4A3220);else if(f==='metal')B(px,pz,.12,.12,0,1.95,0x6E7378);else if(f==='picket')B(px,pz,.1,.1,0,1.3,0xE9E2D2);else if(f==='chain')C(px,pz,.05,0,1.6,0x8E959B);else if(f==='basic')B(px,pz,.16,.16,0,1,0x6B4A2F);
else if(f==='hedge'&&i<n){const q=hi++;O(px,.55,pz,.55+((q*37)%5)/20,q%2?0x2F7A38:0x3E8A3E);O(px,1.05,pz,.38,0x4FA04A)}}
if(f==='hedge')return;
for(let i=0;i<n;i++){const cx=sg[0]+ux*len*(i+.5)/n,cz=sg[1]+uz*len*(i+.5)/n,L=len/n,pw=th=>hz?L:th,pd=th=>hz?th:L;
if(f==='basic')B(cx,cz,pw(.2),pd(.2),0,.9,0x8B6B3E);
else if(f==='picket'){B(cx,cz,pw(.04),pd(.04),.1,1.05,0xF3ECDD);B(cx,cz,pw(.07),pd(.07),.3,.07,0xD9D2C0);B(cx,cz,pw(.07),pd(.07),.8,.07,0xD9D2C0)}
else if(f==='solid'){B(cx,cz,pw(.08),pd(.08),.05,1.8,0x6B4A2F);B(cx,cz,pw(.16),pd(.16),1.85,.1,0x4A3220)}
else if(f==='metal'){B(cx,cz,pw(.05),pd(.05),.1,1.8,0x4F6B4A);B(cx,cz,pw(.1),pd(.1),1.9,.07,0x6E7378)}
else if(f==='brick'){B(cx,cz,pw(.3),pd(.3),0,.45,0x8A4636);[.7,1.2,1.7].forEach(y=>B(cx,cz,pw(.05),pd(.05),y,.06,0x222222));[-1,1].forEach(k=>B(hz?cx+k*L/6:cx,hz?cz:cz+k*L/6,.04,.04,.5,1.25,0x222222))}
else if(f==='chain')B(cx,cz,pw(.02),pd(.02),.1,1.5,0xBFC5CA,.4)}});
if(f==='brick'||f==='solid'||f==='metal'||f==='picket')[-GAP,GAP].forEach(x=>B(x,hd,.5,.5,0,2,f==='brick'?0x9C4F3A:0x5A3A22));
return o}
function mkPlot(){while(plotG.children.length)plotG.remove(plotG.children[0]);
plotG.add(mk3(fencePrims()));mkWorld()}
mkPlot();
let items=[],sel=null,uid=0;
const house=()=>items.find(i=>i.type==='house');
const rkf=()=>LOCS[loc].rk,matK=it=>it&&it.mt&&MATS[it.mt]?MATS[it.mt].k:1;
const base=it=>it.type==='house'?RATE*rkf()*180*it.s*it.s*matK(it):TYPES[it.type].p*it.s*it.s*rkf();
const pr=it=>Math.round(base(it)/1e4)*1e4+(it.type==='house'?(it.fl===2?FLOOR2:0)+TERR[it.tr||0]:0);
const sotN=()=>PW*PD/100,landCost=()=>Math.round(sotN()*LOCS[loc].lp/1e4)*1e4,buildCost=()=>items.reduce((s,i)=>s+pr(i),0)+fenceCost();
const nm=it=>it.type==='house'?'Дом · '+Math.round(180*it.s*it.s)+' м²'+(it.fl===2?' · 2 этажа':'')+(it.mt&&MATS[it.mt]?' · '+MATS[it.mt].n.toLowerCase():'')+(it.tr===1?' · терраса':it.tr===2?' · крытая терраса':''):TYPES[it.type].n+(Math.abs(it.s-1)>.02?' ×'+it.s.toFixed(2):'');
