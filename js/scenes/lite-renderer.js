/* Лёгкий 3D-режим (Canvas 2D, без WebGL) */
/* ---- lite 3D (Canvas 2D) renderer: works without WebGL ---- */
let ISO=false,liteOn=false,hits=[],iso={};
const cv2=$('c2'),SHADE={day:[1,1,1],sunset:[1.08,.86,.72],night:[.38,.45,.7]},SKY={day:['#BFDCEB','#E8F1EE'],sunset:['#F2A27A','#FBE3C8'],night:['#0B1626','#1F3050']},GLS=[0x86B9CF,0x9CC3C9,0x6E8FA3,0xA9D4E4,0xFFE2A8];
let curTod='day';
const rgb=(c,k)=>{const t=SHADE[curTod]||SHADE.day;return'rgb('+Math.min(255,(c>>16&255)*t[0]*k|0)+','+Math.min(255,(c>>8&255)*t[1]*k|0)+','+Math.min(255,(c&255)*t[2]*k|0)+')'};
const tw=(it,x,y,z)=>{const c=Math.cos(it.a),n=Math.sin(it.a),X=x*it.s,Z=z*it.s;return[it.x+X*c+Z*n,y*it.s,it.z-X*n+Z*c]};
const nw=(it,x,y,z)=>{const c=Math.cos(it.a),n=Math.sin(it.a);return[x*c+z*n,y,-x*n+z*c]};
function pBox(it,cx,cz,w,d,y0,h,col){const x0=cx-w/2,x1=cx+w/2,z0=cz-d/2,z1=cz+d/2,y1=y0+h,Pt=(x,y,z)=>tw(it,x,y,z);
return{c:Pt(cx,y0+h/2,cz),f:[{p:[Pt(x0,y1,z0),Pt(x1,y1,z0),Pt(x1,y1,z1),Pt(x0,y1,z1)],n:nw(it,0,1,0),k:col},{p:[Pt(x0,y0,z1),Pt(x1,y0,z1),Pt(x1,y1,z1),Pt(x0,y1,z1)],n:nw(it,0,0,1),k:col},{p:[Pt(x1,y0,z0),Pt(x0,y0,z0),Pt(x0,y1,z0),Pt(x1,y1,z0)],n:nw(it,0,0,-1),k:col},{p:[Pt(x1,y0,z1),Pt(x1,y0,z0),Pt(x1,y1,z0),Pt(x1,y1,z1)],n:nw(it,1,0,0),k:col},{p:[Pt(x0,y0,z0),Pt(x0,y0,z1),Pt(x0,y1,z1),Pt(x0,y1,z0)],n:nw(it,-1,0,0),k:col}]}}
function pGab(it,cx,cz,len,span,y0,rise,roof,cap){const x0=cx-len/2,x1=cx+len/2,z0=cz-span/2,z1=cz+span/2,yr=y0+rise,Pt=(x,y,z)=>tw(it,x,y,z),q=rise/(span/2);
return{c:Pt(cx,y0+rise/2,cz),f:[{p:[Pt(x0,y0,z1),Pt(x1,y0,z1),Pt(x1,yr,cz),Pt(x0,yr,cz)],n:nw(it,0,1,q),k:roof},{p:[Pt(x1,y0,z0),Pt(x0,y0,z0),Pt(x0,yr,cz),Pt(x1,yr,cz)],n:nw(it,0,1,-q),k:roof},{p:[Pt(x1,y0,z1),Pt(x1,y0,z0),Pt(x1,yr,cz)],n:nw(it,1,0,0),k:cap},{p:[Pt(x0,y0,z0),Pt(x0,y0,z1),Pt(x0,yr,cz)],n:nw(it,-1,0,0),k:cap}]}}
function pCyl(it,cx,cz,r,y0,h,col){const Pt=(x,y,z)=>tw(it,x,y,z),n=8,f=[],top=[];for(let i=0;i<n;i++){const a0=i/n*6.2832,a1=(i+1)/n*6.2832,xa=cx+r*Math.cos(a0),za=cz+r*Math.sin(a0),xb=cx+r*Math.cos(a1),zb=cz+r*Math.sin(a1),am=(a0+a1)/2;f.push({p:[Pt(xa,y0,za),Pt(xb,y0,zb),Pt(xb,y0+h,zb),Pt(xa,y0+h,za)],n:nw(it,Math.cos(am),0,Math.sin(am)),k:col});top.push(Pt(xa,y0+h,za))}
f.push({p:top,n:nw(it,0,1,0),k:col});return{c:Pt(cx,y0+h/2,cz),f}}
const pBall=(it,x,y,z,r,col)=>({c:tw(it,x,y,z),s:r*it.s,k:col});
const pQuad=(it,pts,nr,col)=>{const w=pts.map(q=>tw(it,q[0],q[1],q[2])),c=[0,1,2].map(i=>(w[0][i]+w[1][i]+w[2][i]+w[3][i])/4);return{c,f:[{p:w,n:nw(it,nr[0],nr[1],nr[2]),k:col}]}};
function pPoly(it,faces){const ps=[];faces.forEach(f=>f.v.forEach(q=>ps.push(q)));const cen=[0,1,2].map(i=>ps.reduce((a,q)=>a+q[i],0)/ps.length);
const bc=[0,1,2].map(i=>{let lo=1e9,hi=-1e9;ps.forEach(q=>{lo=Math.min(lo,q[i]);hi=Math.max(hi,q[i])});return(lo+hi)/2});
return{c:tw(it,bc[0],bc[1],bc[2]),f:faces.map(f=>{const v=f.v,a=[v[1][0]-v[0][0],v[1][1]-v[0][1],v[1][2]-v[0][2]],b=[v[2][0]-v[0][0],v[2][1]-v[0][1],v[2][2]-v[0][2]];let n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const fc=[0,1,2].map(i=>v.reduce((s,q)=>s+q[i],0)/v.length);const dd=n[0]*(fc[0]-cen[0])+n[1]*(fc[1]-cen[1])+n[2]*(fc[2]-cen[2]);if(dd<-1e-9||(Math.abs(dd)<=1e-9&&n[1]<0))n=[-n[0],-n[1],-n[2]];
return{p:v.map(q=>tw(it,q[0],q[1],q[2])),n:nw(it,n[0],n[1],n[2]),k:f.c}})}}
function isoPrims(it,p){const o=[];
if(p.t==='B')o.push(pBox(it,p.x,p.z,p.w,p.d,p.y,p.h,p.c));
else if(p.t==='C')o.push(pCyl(it,p.x,p.z,p.r,p.y,p.h,p.c));
else if(p.t==='O')o.push(pBall(it,p.x,p.y,p.z,p.r,p.c));
else if(p.t==='G')o.push(pGab(it,p.x,p.z,p.len+2*p.ov,p.span+2*p.ov,p.y,p.rise,p.roof,p.cap));
else if(p.t==='P')o.push(pPoly(it,p.faces));
else if(p.t==='U')o.push(pCyl(it,p.x,p.z,p.r,p.y,.12,p.c));
else if(p.t==='SP'){const hz=p.d/2,yy=z=>.95+.5*z;[-1,1].forEach(s=>{const x=s*p.w/4,pw=p.w/2-.06;
o.push(pQuad(it,[[x-pw/2,yy(-hz),-hz],[x+pw/2,yy(-hz),-hz],[x+pw/2,yy(hz),hz],[x-pw/2,yy(hz),hz]],[0,1,-.5],p.f));
o.push(pQuad(it,[[x-pw/2+.06,yy(-hz+.1),-hz+.1],[x+pw/2-.06,yy(-hz+.1),-hz+.1],[x+pw/2-.06,yy(hz-.1),hz-.1],[x-pw/2+.06,yy(hz-.1),hz-.1]],[0,1,-.5],p.c));
o.push(pCyl(it,x,-p.d*.35,.05,0,yy(-p.d*.35),0x777777));o.push(pCyl(it,x,p.d*.35,.05,0,yy(p.d*.35),0x777777))})}
return o}
function parts(it){const sg=it.stg==null?stage:it.stg,o=[];spec(it,sg).forEach(p=>isoPrims(it,p).forEach(q=>o.push(q)));o.forEach(p=>p.id=it.id);return o}
function fpPoly(it,pad){const t=TYPES[it.type],hw=t.w*it.s/2+pad,hd=t.d*it.s/2+pad,c=Math.cos(it.a),n=Math.sin(it.a);return[[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(p=>[it.x+p[0]*c+p[1]*n,.05,it.z-p[0]*n+p[1]*c])}
function prep(c,W,H){const d=Math.min(devicePixelRatio||1,2),w=Math.round(W*d),h=Math.round(H*d);if(c.width!==w||c.height!==h){c.width=w;c.height=h}const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);return g}
function inPoly(x,y,p){let r=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>y)!==(p[j][1]>y)&&x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0])r=!r}return r}
const W0={x:0,z:0,a:0,s:1};
function isoScene(g,W,H,o){curTod=o.tod||tod2;const E=o.e,TH=o.th,sc=o.sc,cx=o.cx,cy=o.cy,ce=Math.cos(E),se=Math.sin(E),c=Math.cos(TH),s=Math.sin(TH);
const Pj=p=>[cx+(p[0]*c-p[2]*s)*sc,cy+((p[0]*s+p[2]*c)*se-p[1]*ce)*sc],vd=[s*ce,se,c*ce],ln=Math.hypot(.4,.8,.45),Ld=[-.4/ln,.8/ln,.45/ln];
const sk=SKY[curTod]||SKY.day,gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,sk[0]);gr.addColorStop(1,sk[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);
const flat=(pts,fill,stroke)=>{g.beginPath();pts.forEach((p,i)=>{const q=Pj(p);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])});g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke()}};
flat([[-400,0,-400],[400,0,-400],[400,0,400],[-400,0,400]],rgb(0xBFD2B0,1));
const pr=[];
if(o.plot){const pw=o.plot[0],pd=o.plot[1];flat([[-pw/2-10,0,pd/2+1.5],[pw/2+10,0,pd/2+1.5],[pw/2+10,0,pd/2+6.5],[-pw/2-10,0,pd/2+6.5]],rgb(0x6E7378,1));
flat([[-pw/2,.01,-pd/2],[pw/2,.01,-pd/2],[pw/2,.01,pd/2],[-pw/2,.01,pd/2]],rgb(0x8DBB6E,1));
const fk=fenceSt+'|'+PW+'|'+PD;if(fpKey!==fk){fpKey=fk;fpIso=[];fencePrims().forEach(q=>isoPrims(W0,q).forEach(r=>fpIso.push(r)))}fpIso.forEach(q=>pr.push(q));
if(o.fin){flat([[-2,.02,pd/2-2.5],[2,.02,pd/2-2.5],[2,.02,pd/2+1.5],[-2,.02,pd/2+1.5]],rgb(0xB9B5AA,1));finPts().forEach((q,i)=>{const sc2=.9+((i*37)%10)/25;pr.push(pCyl(W0,q[0],q[1],.18*sc2,0,1.6*sc2,0x6B4A2F),pBall(W0,q[0],2.5*sc2,q[1],1.2*sc2,i%3?0x3E8A3E:0x2F7A38),pBall(W0,q[0]+.5*sc2,2*sc2,q[1]+.3,.85*sc2,0x4FA04A))})}}
else if(o.disc){const r=o.disc,pts=[];for(let i=0;i<40;i++)pts.push([r*Math.cos(i/40*6.2832),0,r*Math.sin(i/40*6.2832)]);flat(pts,rgb(0x7DAF62,1),'rgba(0,0,0,.15)')}
if(o.sel&&o.sel.mesh!==undefined||o.sel){const it=o.sel,src=o.items.find(q=>q.id===it.id)||it;flat(fpPoly(src,.4),o.bad?'rgba(220,40,40,.5)':'rgba(255,200,61,.5)')}
o.items.forEach(it=>parts(it).forEach(p=>pr.push(p)));
pr.forEach(p=>{p.d=p.c[0]*s+p.c[2]*c+p.c[1]*.03});pr.sort((a,b)=>a.d-b.d);
const out=[];
pr.forEach(p=>{if(p.s!==undefined){const q=Pj(p.c),r=p.s*sc;g.beginPath();g.arc(q[0],q[1],r,0,6.2832);g.fillStyle=rgb(p.k,.85);g.fill();g.beginPath();g.arc(q[0]-r*.25,q[1]-r*.25,r*.55,0,6.2832);g.fillStyle=rgb(p.k,1.12);g.fill();if(p.id!=null)out.push({poly:[[q[0]-r,q[1]-r],[q[0]+r,q[1]-r],[q[0]+r,q[1]+r],[q[0]-r,q[1]+r]],id:p.id});return}
p.f.forEach(f=>{const n=f.n,nl=Math.hypot(n[0],n[1],n[2])||1,nd=(n[0]*vd[0]+n[1]*vd[1]+n[2]*vd[2])/nl;if(nd<=0)return;
const k=.55+.45*Math.max(0,(n[0]*Ld[0]+n[1]*Ld[1]+n[2]*Ld[2])/nl),poly=f.p.map(Pj);
g.beginPath();poly.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();
g.fillStyle=curTod==='night'&&GLS.includes(f.k)?'rgb(255,217,138)':rgb(f.k,k);g.fill();g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=.7;g.stroke();
if(p.id!=null)out.push({poly,id:p.id})})});
return out}
function isoFrame(){const W=cv2.clientWidth,H=cv2.clientHeight;if(!W||!H)return;const g=prep(cv2,W,H),E=clamp(Math.PI/2-ph,.12,1.5),sc=Math.min(W,H*1.5)*.9/Math.hypot(PW,PD)*(PW*1.3/rad),cx=W/2,cy=H*.46;iso={W,H,E,sc,cx,cy,th};
const its=items.filter(it=>it.type==='house'||stage===3).map(it=>drag&&drag.it===it&&drag.x!==undefined?Object.assign({},it,{x:drag.x,z:drag.z}):it);
hits=isoScene(g,W,H,{items:its,plot:[PW,PD],th,e:E,sc,cx,cy,sel:sel&&sel.mesh.visible!==false?sel:null,bad:drag&&drag.bad,fin:stage===3&&landOn})}
function isoHero(){const c=$('hc2'),W=c.clientWidth,H=c.clientHeight;if(!W||!H)return;const g=prep(c,W,H);
isoScene(g,W,H,{tod:'day',items:[{id:null,type:'house',x:0,z:0,a:0,s:1,fl:hf,st:hst,mt:null,stg:3},{id:null,type:'garden',x:-12,z:5,a:0,s:1},{id:null,type:'pool',x:12,z:2,a:Math.PI/2,s:1}],disc:17,th:hth,e:clamp(Math.PI/2-hph+.1,.3,1.3),sc:Math.min(W,H*1.7)/42,cx:W/2,cy:H*.52})}
function isoPick(e){const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;for(let i=hits.length-1;i>=0;i--)if(inPoly(x,y,hits[i].poly))return items.find(q=>q.id===hits[i].id)||null;return null}
function isoGround(e){const r=e.currentTarget.getBoundingClientRect(),rx=(e.clientX-r.left-iso.cx)/iso.sc,rz=(e.clientY-r.top-iso.cy)/(iso.sc*Math.sin(iso.E)),c=Math.cos(iso.th),s=Math.sin(iso.th);return{x:rx*c+rz*s,z:-rx*s+rz*c}}
function setIso(){ISO=!!(R.noGL||liteOn);cv.style.display=ISO?'none':'block';cv2.style.display=ISO?'block':'none';$('lite').textContent=liteOn?'Режим 3D':'Лёгкий режим';$('lite').style.display=R.noGL?'none':''}
$('lite').onclick=()=>{liteOn=!liteOn;setIso();note(liteOn?'Включён лёгкий 3D-режим':'Включён полный 3D-режим')};
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();liteOn=true;setIso();toast('Графика устройства перегружена — включён лёгкий 3D-режим.')});
