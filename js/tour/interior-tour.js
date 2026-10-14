/* 3D-прогулка внутри дома */
;(function(){
const TH=window.THREE;if(!TH)return;
const $t=id=>document.getElementById(id),PI=Math.PI;
const IST={scandi:{n:'Скандинавский',w:'#f1ede6',b:'#dfe8ea',f:'wood',sf:'#8fa3ad',ac:'#e0b25a',wd:'#d8b98a'},loft:{n:'Лофт',w:'#9a9a9a',b:'#6e7378',f:'concrete',sf:'#4a3a2e',ac:'#c4602b',wd:'#5a4030'},classic:{n:'Классика',w:'#efe3c8',b:'#c9b79a',f:'dark',sf:'#7a2e3a',ac:'#b8963e',wd:'#4a3220'}};
const FLR={wood:['Светлое дерево','#d8b98a'],dark:['Тёмный паркет','#7b5a3a'],concrete:['Бетон','#8d8d8b'],tile:['Плитка','#cfd2d4']};
const COLS=['#f1ede6','#ffffff','#dfe8ea','#c9d8c5','#e8c9c1','#f0d9a0','#9db4c0','#6e7378','#3f5a4c','#2b3a55','#8c4a3c','#222222'];
const STI={modern:'scandi',minimal:'scandi',classic:'classic',forest:'classic',luxury:'classic'};
const FIN={wood:{tc:'#b98a5a',rc:'#3a2a1c'},metal:{tc:'#c9a577',rc:'#1c1c1c'},glass:{tc:'#bfe3f2',rc:'#9aa3a8'},concrete:{tc:'#9d9c97',rc:'#202020'}},TCOLS=['#b98a5a','#8a5a36','#e0cfae','#4a3a2e','#9d9c97','#2b2b2b','#bfe3f2','#ffffff'],RCOLS=['#1c1c1c','#ffffff','#9aa3a8','#3a2a1c','#b8963e','#2b3a55'];
const TS={style:'scandi',floor:'wood',wl:IST.scandi.w,wb:IST.scandi.b,furn:false,tod:'day',rs:'all',init:0,lb:true,sh:'straight',sf:'wood',tc:FIN.wood.tc,rc:FIN.wood.rc};
const DX={modern:6.6,minimal:5.8,classic:0,forest:0,luxury:5.4},WLK=['garden','veg','playground','court','lounge','parking','pergola','gazebo'];
const TODI={day:{bg:'#cfe3ee',sun:0xfff2dd,si:1.1,hi:.7,li:.3,p:[13,17,9]},sunset:{bg:'#f2b28c',sun:0xff9a55,si:.9,hi:.45,li:.6,p:[19,6,5]},night:{bg:'#0e1630',sun:0x6f86c8,si:.2,hi:.22,li:1.1,p:[-10,14,-8]}};
let CD=0,RE=0,ST=null,CL=null,PG='',TG=null,RUN=false,DR=false,vx=0,vz=0,MM=null,R,cam,IS,FG,hemi,sunL,mode='plot',run=false,last=0,yaw=0,pitch=0,px=0,pz=0,lvl=1,bob=0,LY=null,cols=[],PL=[],txc={},ms={},prevStage=3,fr=0,ld=null;
const keys={},J={f:0,s:0},H=2.9,SL=.25;
const M=(c,r)=>new TH.MeshStandardMaterial({color:c,roughness:r==null?.85:r});
function tex(type,col){const k=type+col;if(txc[k])return txc[k];const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=col;x.fillRect(0,0,256,256);
 if(type==='tile'){x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=3;for(let i=0;i<=256;i+=64){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.moveTo(0,i);x.lineTo(256,i);x.stroke()}}
 else if(type==='concrete'){for(let i=0;i<900;i++){x.fillStyle='rgba(0,0,0,'+Math.random()*.07+')';x.fillRect(Math.random()*256,Math.random()*256,4,4)}}
 else{for(let i=0;i<256;i+=32){const o=(i*7)%96;x.fillStyle='rgba(0,0,0,'+(.02+(i/32%3)*.03)+')';x.fillRect(0,i,256,32);x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=2;x.beginPath();x.moveTo(0,i);x.lineTo(256,i);x.moveTo(o+96,i);x.lineTo(o+96,i+32);x.moveTo(o+224,i);x.lineTo(o+224,i+32);x.stroke()}}
 const t=new TH.CanvasTexture(c);t.wrapS=t.wrapT=TH.RepeatWrapping;return txc[k]=t}
function bx(g,w,h,d,c,x,y,z,o){o=o||{};const m=new TH.Mesh(new TH.BoxGeometry(w,h,d),o.m||M(c,o.r));m.position.set(x,y+h/2,z);m.castShadow=!o.ns;m.receiveShadow=true;g.add(m);return m}
const cy=(g,r,h,c,x,y,z)=>{const m=new TH.Mesh(new TH.CylinderGeometry(r,r,h,14),M(c));m.position.set(x,y+h/2,z);m.castShadow=true;g.add(m);return m};
const sp=(g,r,c,x,y,z,em)=>{const m=new TH.Mesh(new TH.SphereGeometry(r,12,10),em?new TH.MeshBasicMaterial({color:c}):M(c));m.position.set(x,y,z);m.castShadow=!em;g.add(m);return m};
/* ---------- планировка по выбранной модели ---------- */
function layout(){const h=house(),m=MODELS[curModel],s=h?h.s:mScale(m),F=h&&h.fl===2?2:1,W=16*s-.7,D=10*s-.7,x0=-W/2,x1=W/2,z0=-D/2,z1=D/2,fl=[[],[]],op=[[],[]];
 const add=(f,n,k,a,b,c,d,o)=>{const r=Object.assign({n,k,f,x0:a,x1:b,z0:c,z1:d},o||{});fl[f].push(r);return r};
 const priv=(f,list,xa,xb,za,zb)=>{const zc=(za+zb)/2,c0=zc-.6,c1=zc+.6,rows=[[[],c1,zb,1],[[],za,c0,-1]];list.forEach((q,i)=>rows[i%2][0].push(q));
  rows.forEach(([row,ra,rb,fd])=>{const tw=row.reduce((a,q)=>a+q.w,0);let u=xa;row.forEach(q=>{const w=(xb-xa)*q.w/tw,r=add(f,q.n,q.k,u,u+w,ra,rb,{fd,fz:fd>0?rb:ra});op[f].push({ax:'h',c:fd>0?c1:c0,p:u+w/2,w:.95,t:'door',dir:fd});u+=w})});
  add(f,'Коридор','hall',xa,xb,c0,c1);return zc};
 const B=n=>({n:n?'Спальня '+(n+1):'Мастер-спальня',k:'bed',w:1}),T=n=>({n:n?'Санузел':'Ванная',k:'bath',w:.62});let nb=0,nt=0;const mB=c=>Array.from({length:c},()=>B(nb++)),mT=c=>Array.from({length:c},()=>T(nt++));
 let gl,ul=[];if(F===1)gl=mB(m.br).concat(mT(m.ba));else{const g=m.br>=5?2:1;gl=mB(g).concat(mT(1));ul=mB(m.br-g).concat(mT(Math.max(0,m.ba-1)));if(ul.length<2)ul.push({n:'Кабинет',k:'off',w:1});if(m.a>=220)ul.push({n:'Гардеробная',k:'off',w:.7})}
 const xm=x0+W*.46,zk=z0+D*.56,hw=Math.min(3.6,(x1-xm)*.4),xh=xm+hw,zc=priv(0,gl,x0,xm,z0,z1);
 add(0,'Гостиная','liv',xm,x1,z0,zk);add(0,'Прихожая','ent',xm,xh,zk,z1);add(0,'Кухня-столовая','kit',xh,x1,zk,z1);
 op[0].push({ax:'v',c:xm,p:zc,w:1.2,t:'arch'},{ax:'h',c:zk,p:(xm+xh)/2,w:1.5,t:'arch'},{ax:'h',c:zk,p:(xh+x1)/2,w:2.4,t:'arch'},{ax:'h',c:z1,p:(xm+xh)/2,w:1.1,t:'front'});
 if(F===2){const xl=xm,xr=xm+3.9,hasE=x1-xr>=3.3&&ul.length>2,west=hasE?ul.slice(0,Math.ceil(ul.length*.6)):ul,east=hasE?ul.slice(west.length):[];priv(1,west,x0,xl,z0,z1);op[1].push({ax:'v',c:xl,p:0,w:1.2,t:'arch'});
  if(east.length){priv(1,east,xr,x1,z0,z1);add(1,'Лестничный холл','lob',xl,xr,z0,z1);op[1].push({ax:'v',c:xr,p:0,w:1.2,t:'arch'})}else add(1,'Лестничный холл','lob',xl,x1,z0,z1)}
 for(let f=0;f<F;f++)fl[f].forEach(r=>{if(r.k==='hall')return;[['h',z1,r.z1,r.x0,r.x1],['h',z0,r.z0,r.x0,r.x1],['v',x0,r.x0,r.z0,r.z1],['v',x1,r.x1,r.z0,r.z1]].forEach(([ax,c,v,a,b])=>{if(Math.abs(c-v)>.01||r.k==='ent'&&ax==='h')return;const len=b-a,n=len>5.5?2:1,sz={liv:[2.4,2.1,.1],kit:[1.6,1.2,.95],bed:[1.5,1.4,.85],bath:[.8,.6,1.5],off:[1.4,1.3,.9],ent:[.9,1.2,.9],lob:[1.4,1.5,.8]}[r.k];for(let i=0;i<n;i++)op[f].push({ax,c,p:a+len*(i+.5)/n,w:Math.min(sz[0],len*.7),hh:sz[1],sill:sz[2],t:'win'})})});
 return{xm,W,D,F,s,fl,op,m,nr:fl.slice(0,F).flat().filter(r=>r.k!=='hall'&&r.k!=='ent'&&r.k!=='lob').length,hx:(xm+xh)/2,z1}}
/* ---------- построение дома внутри ---------- */
function wallBox(g,f,w,a,b,y0,y1,t,off,mt){const mid=(a+b)/2,len=b-a,hz=w.ax==='h',cc=w.c+off,m=hz?bx(g,len,y1-y0,t,0,mid,y0,cc,{m:mt}):bx(g,t,y1-y0,len,0,cc,y0,mid,{m:mt});
 if(y0===0)cols.push(hz?{f,x0:a,x1:b,z0:cc-t/2,z1:cc+t/2}:{f,x0:cc-t/2,x1:cc+t/2,z0:a,z1:b})}
function opening(g,o,off){const hz=o.ax==='h',u=o.p,P=(l,h,d,y,c,uu,dd)=>hz?bx(g,l,h,d,c,uu,y,o.c+(dd||0)):bx(g,d,h,l,c,o.c+(dd||0),y,uu);
 if(o.t==='win'){const hh=o.hh,m=new TH.Mesh(new TH.BoxGeometry(hz?o.w:.03,hh,hz?.03:o.w),new TH.MeshBasicMaterial({color:'#bfe0f5',transparent:true,opacity:.28}));m.position.set(hz?u:o.c+off,o.sill+hh/2,hz?o.c+off:u);g.add(m);
  P(o.w+.1,.06,.12,o.sill-.03,'#f7f5ef',u,off);P(o.w+.1,.06,.12,o.sill+hh-.03,'#f7f5ef',u,off);[-1,1].forEach(s=>P(.06,hh,.12,o.sill,'#f7f5ef',u+s*o.w/2,off));if(o.w>1.2)P(.04,hh,.1,o.sill,'#f7f5ef',u,off);P(o.w+.3,.04,.28,o.sill-.07,'#ffffff',u,off+(o.c>0?-.04:.04)*0+Math.sign(o.c)*.04);return}
 [-1,1].forEach(s=>P(.07,2.15,.2,0,'#f7f5ef',u+s*(o.w/2),0));P(o.w+.14,.07,.2,2.15,'#f7f5ef',u,0);
 if(o.t==='door'||o.t==='front'){const piv=new TH.Group(),lw=o.w-.04,d=o.t==='front'?-1:o.dir;piv.position.set(hz?u-o.w/2+.02:o.c,0,hz?o.c:u-o.w/2+.02);piv.rotation.y=(hz?-1:1)*1.3*d;
  const lf=new TH.Mesh(new TH.BoxGeometry(hz?lw:.04,2.1,hz?.04:lw),M(o.t==='front'?'#5a3a22':'#e8e4da',.6));lf.position.set(hz?lw/2:0,1.05,hz?0:lw/2);lf.castShadow=true;piv.add(lf);g.add(piv)}}
function build(){if(!IS){IS=new TH.Scene();hemi=new TH.HemisphereLight(0xffffff,0x998877,.7);sunL=new TH.DirectionalLight(0xfff2dd,1);sunL.castShadow=true;sunL.shadow.mapSize.set(2048,2048);const c=sunL.shadow.camera;Object.assign(c,{left:-18,right:18,top:18,bottom:-18,near:1,far:90});c.updateProjectionMatrix();sunL.shadow.bias=-.0006;sunL.shadow.normalBias=.03;IS.add(hemi,sunL,sunL.target);
  for(let i=0;i<4;i++){const l=new TH.PointLight(0xffe2b8,.3,11);IS.add(l);PL.push(l)}
  const gr=new TH.Mesh(new TH.PlaneGeometry(400,400),M('#8db36e',1));gr.rotation.x=-PI/2;gr.position.y=-.02;gr.receiveShadow=true;IS.add(gr);
  for(let i=0;i<24;i++){const a=i*2.4,r=15+(i*7%10),x=Math.cos(a)*r,z=Math.sin(a)*r,k=.8+(i%4)*.2;cy(IS,.2*k,2*k,'#6b4a2f',x,0,z);sp(IS,1.5*k,i%2?'#3e8a3e':'#4fa04a',x,2.8*k,z)}}
 if(FG)IS.remove(FG);FG=new TH.Group();IS.add(FG);cols=[];ms.l=M(TS.wl,.95);ms.b=M(TS.wb,.95);LY=layout();const L=LY;ST=L.F===2?stairGeo(L):null;if(ST){const q=ST.hole;cols.push({f:0,x0:q[0]-.05,x1:q[1]+.05,z0:q[2]-.05,z1:q[3]+.05},{f:1,x0:q[0],x1:q[1],z0:q[2],z1:q[3]})}
 for(let f=0;f<L.F;f++){const g=new TH.Group();g.position.y=f*(H+SL);FG.add(g);
  L.fl[f].forEach(r=>{const w=r.x1-r.x0,d=r.z1-r.z0,wet=r.k==='bath'||r.k==='kit',mf=(a,b,c,e)=>{const w=b-a,d=e-c;if(w<.03||d<.03)return;const ge=new TH.PlaneGeometry(w,d),u=ge.attributes.uv;for(let i=0;i<u.count;i++)u.setXY(i,u.getX(i)*w/2,u.getY(i)*d/2);
   const m=new TH.Mesh(ge,new TH.MeshStandardMaterial({map:tex(wet?'tile':TS.floor,wet?'#cfd2d4':FLR[TS.floor][1]),roughness:wet?.35:.7}));m.rotation.x=-PI/2;m.position.set(a+w/2,.01,c+d/2);m.receiveShadow=true;g.add(m)};if(r.k==='lob'&&f===1&&ST){const q=ST.hole;mf(r.x0,r.x1,r.z0,q[2]);mf(r.x0,r.x1,q[3],r.z1);mf(r.x0,q[0],q[2],q[3]);mf(q[1],r.x1,q[2],q[3])}else mf(r.x0,r.x1,r.z0,r.z1);
   if(r.k!=='hall')sp(g,.13,'#fffbe8',r.x0+w/2,H-.04,r.z0+d/2,1)});
  const mp={};L.fl[f].forEach(r=>{const kb=r.k==='bed'||r.k==='bath'||r.k==='off';[['h',r.z0,r.x0,r.x1],['h',r.z1,r.x0,r.x1],['v',r.x0,r.z0,r.z1],['v',r.x1,r.z0,r.z1]].forEach(([ax,c,a,b])=>{c=+c.toFixed(2);(mp[ax+c]=mp[ax+c]||{ax,c,iv:[]}).iv.push([a,b,kb])})});
  Object.values(mp).forEach(w=>{w.iv.sort((p,q)=>p[0]-q[0]);const mg=[];w.iv.forEach(v=>{const l=mg[mg.length-1];if(l&&v[0]<=l[1]+.01){l[1]=Math.max(l[1],v[1]);l[2]=l[2]||v[2]}else mg.push(v.slice())});
   const ext=Math.abs(w.c)>=(w.ax==='h'?L.D:L.W)/2-.02,t=ext?.3:.14,off=ext?Math.sign(w.c)*.15:0;
   mg.forEach(sg=>{const ops=L.op[f].filter(o=>o.ax===w.ax&&Math.abs(o.c-w.c)<.02&&o.p>sg[0]&&o.p<sg[1]).sort((a,b)=>a.p-b.p),mt=sg[2]?ms.b:ms.l;let u=sg[0];
    const pc=(a,b,y0,y1)=>{if(b-a>.02&&y1-y0>.02)wallBox(g,f,w,a,b,y0,y1,t,off,mt)};
    ops.forEach(o=>{const a=o.p-o.w/2,b=o.p+o.w/2,win=o.t==='win';pc(u,a,0,H);pc(a,b,win?o.sill+o.hh:2.15,H);if(win&&o.sill>0)pc(a,b,0,o.sill);opening(g,Object.assign({},o,{c:w.c}),off);u=b});pc(u,sg[1],0,H)})});
  slab(g,L,f===0&&ST?ST.hole:null);if(TS.furn)furn(g,f)}
 if(ST){ST.ga=clr(ST.ga,0);ST.ua=clr(ST.ua,1);const sg=new TH.Group();FG.add(sg);mkStairs(sg)}tod();if(mode==='in'&&blk(px,pz))free()}
/* ---------- мебель (только после выбора) ---------- */
function furn(g,f){const P=IST[TS.style],cb=(x,z,w,d)=>cols.push({f,x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});
 const plant=(x,z,k)=>{k=k||1;cy(g,.2*k,.35*k,'#8b5a3c',x,0,z);[[0,.75,0,.32],[.15,.55,.1,.24],[-.15,.95,-.05,.22]].forEach(q=>sp(g,q[3]*k,'#3f8f45',x+q[0]*k,q[1]*k,z+q[2]*k));cb(x,z,.5*k,.5*k)};
 LY.fl[f].forEach(r=>{if(LY.F===2&&r.k==='liv')r=Object.assign({},r,{x0:r.x0+4.3});const cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,w=r.x1-r.x0,d=r.z1-r.z0,fd=r.fd,fz=r.fz;
  if(r.k==='liv'){const sx=Math.max(r.x0+1.2,r.x1-3.5);bx(g,r.x1-sx-.2,.02,2.8,P.ac,(sx+r.x1)/2-.1,.01,cz,{ns:1});
   bx(g,.95,.42,2.3,P.sf,sx,0,cz);bx(g,.22,.55,2.3,P.sf,sx-.4,.42,cz);[-1,1].forEach(s=>bx(g,.95,.25,.2,P.sf,sx,.42,cz+s*1.05));cb(sx,cz,1,2.3);
   bx(g,.7,.34,1.1,'#3a3a3a',sx+1.2,0,cz);bx(g,.85,.04,1.25,P.wd,sx+1.2,.34,cz);cb(sx+1.2,cz,.9,1.3);
   bx(g,.45,.5,1.8,P.wd,r.x1-.3,0,cz);bx(g,.05,.65,1.1,'#111',r.x1-.3,.75,cz);cb(r.x1-.3,cz,.5,1.8);
   bx(g,2,2,.35,P.wd,r.x0+1.4,0,r.z0+.3);[.35,.8,1.25,1.7].forEach((y,i)=>bx(g,1.8,.28,.25,['#b5532f','#4a6b8a','#c9a15a','#5a7a4a'][i],r.x0+1.4,y,r.z0+.32));cb(r.x0+1.4,r.z0+.3,2,.4);
   plant(r.x1-.5,r.z0+.5);plant(r.x0+.5,r.z1-.5,1.2);cy(g,.02,1.6,'#555',sx-.2,0,cz+1.6);sp(g,.2,'#ffe2a8',sx-.2,1.7,cz+1.6,1);sp(g,.18,'#fff3d0',sx+.6,H-1,cz,1);cy(g,.01,1,'#333',sx+.6,H-1,cz)}
  else if(r.k==='kit'){const L=Math.min(d-1.4,3.8);bx(g,.62,.88,L,'#e8e4da',r.x1-.35,0,cz);bx(g,.66,.05,L,'#2a2a2a',r.x1-.35,.88,cz);bx(g,.35,.7,L,'#e8e4da',r.x1-.2,1.5,cz);bx(g,.5,.02,.6,'#111',r.x1-.35,.93,cz-.4);bx(g,.45,.02,.55,'#9aa3a8',r.x1-.35,.93,cz+.7);cb(r.x1-.35,cz,.7,L);
   bx(g,.7,1.9,.7,'#cfd2d4',r.x1-.4,0,r.z0+.5);cb(r.x1-.4,r.z0+.5,.7,.7);bx(g,.9,.9,1.9,'#d8d2c4',cx-.6,0,cz);bx(g,1,.05,2,'#2a2a2a',cx-.6,.9,cz);cb(cx-.6,cz,1,2);[-.6,0,.6].forEach(z=>cy(g,.17,.62,P.ac,cx-1.3,0,cz+z));sp(g,.16,'#fff3d0',cx-.6,H-.9,cz,1)}
  else if(r.k==='ent'){bx(g,.4,.9,1.2,P.wd,r.x1-.25,0,r.z0+1.5);bx(g,.03,1.1,.7,'#bfd8e6',r.x1-.05,1.2,r.z0+1.5);cb(r.x1-.25,r.z0+1.5,.4,1.2);plant(r.x0+.4,r.z1-.45)}
  else if(r.k==='bed'){const bz=fz-fd*1.1;bx(g,Math.min(3,w-.5),.02,2.4,P.ac,cx,.01,bz-fd*.2,{ns:1});bx(g,1.7,.35,2.1,P.wd,cx,0,bz);bx(g,1.6,.25,2,'#f4f1ea',cx,.35,bz);bx(g,1.6,.1,1,P.ac,cx,.6,bz-fd*.5);bx(g,1.7,1.1,.1,P.wd,cx,0,fz-fd*.05);[-.4,.4].forEach(s=>bx(g,.6,.15,.4,'#fff',cx+s,.6,fz-fd*.35));cb(cx,bz,1.8,2.2);
   [-1,1].forEach(s=>{bx(g,.45,.5,.4,P.wd,cx+s*1.2,0,fz-fd*.3);sp(g,.1,'#ffe2a8',cx+s*1.2,.65,fz-fd*.3,1)});
   if(w>3.9){bx(g,.6,2.1,1.8,P.wd,r.x0+.35,0,fz-fd*1.2);cb(r.x0+.35,fz-fd*1.2,.6,1.8)}}
  else if(r.k==='bath'){const tw=Math.min(1.7,w-.3);bx(g,tw,.55,.8,'#ffffff',cx,0,fz-fd*.45);bx(g,tw-.2,.05,.6,'#bfe3f2',cx,.5,fz-fd*.45);cb(cx,fz-fd*.45,tw,.8);
   bx(g,.4,.4,.55,'#fff',r.x0+.35,0,fz-fd*1.6);bx(g,.5,.85,.8,P.wd,r.x1-.3,0,fz-fd*1.6);bx(g,.03,.8,.6,'#bfd8e6',r.x1-.04,1.25,fz-fd*1.6);cb(r.x1-.3,fz-fd*1.6,.5,.8)}
  else if(r.k==='off'){bx(g,1.4,.04,.7,P.wd,cx,.74,fz-fd*.5);[-.6,.6].forEach(s=>bx(g,.05,.74,.6,'#333',cx+s,0,fz-fd*.5));cb(cx,fz-fd*.5,1.4,.7);cy(g,.22,.45,P.sf,cx,0,fz-fd*1.2);bx(g,1.8,2,.35,P.wd,r.x0+1,0,fz-fd*.2);cb(r.x0+1,fz-fd*.2,1.8,.4)}
  else if(r.k==='hall')plant(r.x0+.4,cz)})}
/* ---------- свет, время суток ---------- */
function tod(){if(!IS)return;const t=TODI[TS.tod];IS.background=new TH.Color(t.bg);sunL.color.setHex(t.sun);sunL.intensity=t.si;hemi.intensity=t.hi;sunL.position.set(...t.p)}
function lights(){const lv=CL&&CL.t/CL.dur>.5?CL.to:lvl,y=(lv-1)*(H+SL)+H-.5,rr=LY.fl[lv-1].filter(r=>r.k!=='hall').map(r=>({r,d:Math.hypot((r.x0+r.x1)/2-px,(r.z0+r.z1)/2-pz)})).sort((a,b)=>a.d-b.d);
 PL.forEach((l,i)=>{const q=rr[i];if(q){l.position.set((q.r.x0+q.r.x1)/2,y,(q.r.z0+q.r.z1)/2);l.intensity=TODI[TS.tod].li}else l.intensity=0})}
/* ---------- участок ---------- */
function doorP(){const h=house(),c=Math.cos(h.a),n=Math.sin(h.a),dx=DX[h.st]||0,P=(lx,lz)=>[h.x+h.s*(lx*c+lz*n),h.z+h.s*(-lx*n+lz*c)];return{P,dx,s:h.s,a:h.a}}
function plotBlk(x,z){const r=.35;for(const it of items){if(WLK.includes(it.type))continue;const c=Math.cos(it.a),n=Math.sin(it.a),dx=x-it.x,dz=z-it.z,lx=(dx*c-dz*n)/it.s,lz=(dx*n+dz*c)/it.s,T=TYPES[it.type],hs=it.type==='house',w=hs?16.3:T.w,d=hs?10.3:T.d,cz=hs?-1.5:0;if(Math.abs(lx)<w/2+r/it.s&&Math.abs(lz-cz)<d/2+r/it.s)return true}
 const a=PW/2,b=PD/2,road=z>b+1.4&&z<b+6.4&&Math.abs(x)<a+9;if(fenceSt==='none')return!(Math.abs(x)<a+9&&z>-b-9&&z<b+6.4);return!((Math.abs(x)<a-.4&&Math.abs(z)<b-.4)||(Math.abs(x)<1.5&&z>=b-.6&&z<b+6.4)||road)}
function inBlk(x,z){const r=.27;for(const c of cols)if(c.f===lvl-1&&x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r)return true;return false}
const blk=(x,z)=>mode==='in'?inBlk(x,z):plotBlk(x,z);
function free(){const rr=LY.fl[lvl-1];let best=null,bd=1e9;rr.forEach(r=>{const x=(r.x0+r.x1)/2,z=(r.z0+r.z1)/2,d=Math.hypot(x-px,z-pz);for(let i=0;i<16;i++){const qx=x+Math.cos(i)*i*.12,qz=z+Math.sin(i)*i*.12;if(!inBlk(qx,qz)&&d<bd){bd=d;best=[qx,qz]}}});if(best){px=best[0];pz=best[1]}}
/* ---------- лестница ---------- */
function stairGeo(L){const sh=TS.sh,xs=L.xm+1.95,z0=-L.D/2,zk=z0+L.D*.56,RH=(H+SL)/18,path=[];let o;
 if(sh==='spiral'){const R=L.D>8?1.15:1,cz=z0+1.1+R,Dl=3*PI/17,cx=xs;
  for(let k=1;k<=17;k++){const a=(k-.5)*Dl;path.push([cx+R*.62*Math.sin(a),cz+R*.62*Math.cos(a),k*RH])}
  const h=[cx-R-.08,cx+R+.08,cz-R-.08,cz+R+.08];
  o={k:'sp',cx,cz,R,Dl,hole:h,ga:[cx,cz+R+.65],ua:[cx,cz-R-.65],c:[cx,cz],edges:[[h[1],h[2],h[1],h[3]],[h[0],h[2],h[0],h[3]],[h[0],h[3],h[1],h[3]],[h[0],h[2],cx-.55,h[2]],[cx+.55,h[2],h[1],h[2]]]}}
 else if(sh==='u'){const td=L.D<8.5?.2:.24,zLn=z0+.5,zLs=zLn+.95,zB=zLs+8*td;
  for(let k=1;k<=8;k++)path.push([xs+.47,zB-(k-.5)*td,k*RH]);path.push([xs,zLn+.475,9*RH]);for(let k=10;k<=17;k++)path.push([xs-.47,zLs+(k-9.5)*td,k*RH]);
  const h=[xs-.95,xs+.95,zLn,zB+.03];
  o={k:'u',xs,td,zLn,zLs,zB,hole:h,ga:[xs+.47,zB+.65],ua:[xs-.47,zB+.65],c:[xs,(zLn+zB)/2],edges:[[h[0],h[2],h[1],h[2]],[h[1],h[2],h[1],h[3]],[h[0],h[2],h[0],h[3]],[xs,h[3],h[1],h[3]]]}}
 else{const run=Math.max(2.4,Math.min(3.8,zk-z0-2.1)),td=run/17,zTop=z0+1,zBot=zTop+run,sw=.95;
  for(let k=1;k<=17;k++)path.push([xs,zBot-(k-.5)*td,k*RH]);
  const h=[xs-.62,xs+.62,zTop,zBot+.03];
  o={k:'st',xs,zTop,zBot,td,sw,hole:h,ga:[xs,zBot+.65],ua:[xs,zTop-.55],c:[xs,(zTop+zBot)/2],edges:[[h[1],h[2],h[1],h[3]],[h[0],h[2],h[0],h[3]],[h[0],h[3],h[1],h[3]]]}}
 o.ga[1]=Math.min(o.ga[1],zk-.35);o.RH=RH;o.path=path;return o}
function glassM(c,op){return new TH.MeshStandardMaterial({color:c,transparent:true,opacity:op||.4,roughness:.08,metalness:.15,depthWrite:false})}
function seg(g,a,b,w,h,mat){const len=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),m=new TH.Mesh(new TH.BoxGeometry(w,h,len),mat);m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);g.add(m);m.lookAt(b[0],b[1],b[2]);m.castShadow=true;return m}
function guard(g,x1,z1,x2,z2,y0,P){const len=Math.hypot(x2-x1,z2-z1);if(len<.05)return;const ang=Math.atan2(x2-x1,z2-z1),cx=(x1+x2)/2,cz=(z1+z2)/2;
 if(P.fin==='glass'||P.fin==='concrete'){const m=new TH.Mesh(new TH.BoxGeometry(.02,.88,len),P.gl);m.position.set(cx,y0+.5,cz);m.rotation.y=ang;g.add(m)}
 else{const n=Math.max(2,Math.round(len/.14));for(let i=0;i<=n;i++){const u=i/n;bx(g,.022,.9,.022,0,x1+(x2-x1)*u-.011,y0,z1+(z2-z1)*u,{m:P.rm,ns:1})}}
 seg(g,[x1,y0+.95,z1],[x2,y0+.95,z2],.05,.045,P.rm)}
function mkStairs(g){const o=ST,RH=o.RH,fin=TS.sf,th=fin==='concrete'?.16:fin==='glass'?.04:.06,
 P={fin,tm:fin==='glass'?glassM(TS.tc,.5):M(TS.tc,fin==='concrete'?.95:.5),rm:M(TS.rc,fin==='glass'?.25:.45),gl:glassM('#d4eaf3',.3)};
 const tread=(w,d,x,y,z)=>bx(g,w,th,d,0,x,y-th,z,{m:P.tm}),riser=(w,x,y,z)=>{if(fin==='wood')bx(g,w,RH,.018,0,x,y,z,{m:P.tm})},
 stringer=(x,za,ya,zb,yb)=>{if(fin!=='concrete')seg(g,[x,ya-.14,za],[x,yb-.14,zb],.05,.2,P.rm)},
 frail=(x,za,ya,zb,yb)=>{seg(g,[x,ya+.92,za],[x,yb+.92,zb],.05,.045,P.rm);const n=Math.max(2,Math.round(Math.hypot(zb-za,yb-ya)/.17));
  if(fin==='glass'||fin==='concrete')seg(g,[x,ya+.5,za],[x,yb+.5,zb],.02,.86,P.gl);
  else for(let i=0;i<=n;i++){const u=i/n;bx(g,.022,.9,.022,0,x-.011,ya+(yb-ya)*u+.03,za+(zb-za)*u,{m:P.rm,ns:1})}};
 if(o.k==='st'){const{xs,zTop,zBot,td,sw}=o;
  for(let k=1;k<=17;k++){const z=zBot-(k-.5)*td;tread(sw,td+.03,xs,k*RH,z);riser(sw,xs,(k-1)*RH,z+td/2)}
  [-1,1].forEach(s=>{const x=xs+s*(sw/2+.03);stringer(x,zBot+td*.5,0,zTop+td*.5,17*RH);frail(x,zBot+td*.5,0,zTop-.1,18*RH)})}
 else if(o.k==='u'){const{xs,td,zLn,zLs,zB}=o;
  for(let k=1;k<=8;k++){const z=zB-(k-.5)*td;tread(.86,td+.03,xs+.47,k*RH,z);riser(.86,xs+.47,(k-1)*RH,z+td/2)}
  tread(1.8,.95,xs,9*RH,zLn+.475);[[-.85,.1],[.85,.1],[-.85,.85],[.85,.85]].forEach(q=>bx(g,.07,9*RH-th,.07,0,xs+q[0],0,zLn+q[1],{m:P.rm}));
  for(let k=10;k<=17;k++){const z=zLs+(k-9.5)*td;tread(.86,td+.03,xs-.47,k*RH,z);riser(.86,xs-.47,(k-1)*RH,z-td/2)}
  stringer(xs+.93,zB+.5*td,0,zLs,8*RH);stringer(xs-.93,zLs,9*RH,zB-.5*td,17*RH);
  frail(xs+.93,zB+.5*td,0,zLs-.05,9*RH);frail(xs-.93,zLs+.05,9*RH,zB+.1,18*RH);
  guard(g,xs+.93,zLs,xs+.93,zLn,9*RH,P);guard(g,xs-.93,zLs,xs-.93,zLn,9*RH,P);guard(g,xs-.93,zLn,xs+.93,zLn,9*RH,P)}
 else{const{cx,cz,R,Dl}=o;
  for(let k=1;k<=17;k++){const m=new TH.Mesh(new TH.CylinderGeometry(R,R,th+.01,10,1,false,(k-1)*Dl-.006,Dl+.012),P.tm);m.position.set(cx,k*RH-th/2,cz);m.castShadow=m.receiveShadow=true;g.add(m)}
  const col=new TH.Mesh(new TH.CylinderGeometry(.11,.11,H+SL+.05,18),P.rm);col.position.set(cx,(H+SL)/2,cz);col.castShadow=true;g.add(col);
  const pts=[];for(let k=0;k<=17;k++){const a=k*Dl,r=R-.03;pts.push([cx+r*Math.sin(a),k*RH+.92,cz+r*Math.cos(a)])}
  for(let k=1;k<=17;k++)seg(g,pts[k-1],pts[k],.05,.045,P.rm);
  for(let k=1;k<=17;k++){const a=(k-.5)*Dl,r=R-.03,x=cx+r*Math.sin(a),z=cz+r*Math.cos(a);
   if(fin==='glass'||fin==='concrete'){const m=new TH.Mesh(new TH.BoxGeometry(2*R*Math.sin(Dl/2),.86,.02),P.gl);m.position.set(x,k*RH+.46,z);m.rotation.y=a;g.add(m)}
   else bx(g,.022,.9,.022,0,x,k*RH,z,{m:P.rm,ns:1})}}
 o.edges.forEach(e=>guard(g,e[0],e[1],e[2],e[3],H+SL,P))}
function smp(C,e){const d=e*C.len;let i=0;while(i<C.cum.length-2&&C.cum[i+1]<d)i++;const a=C.pts[i],b=C.pts[i+1],u=Math.max(0,Math.min(1,(d-C.cum[i])/((C.cum[i+1]-C.cum[i])||1)));return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}
function climb(dir){if(CL||mode!=='in'||!ST)return;const RH=ST.RH,base=[[ST.ga[0],ST.ga[1],0]].concat(ST.path,[[ST.ua[0],ST.ua[1],RH*18]]),pts=dir>0?base:base.slice().reverse().map(p=>[p[0],p[1],p[2]-RH*18]),cum=[0];
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];cum.push(cum[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]))}
 const len=cum[cum.length-1];TG=null;CL={pts,cum,len,t:0,dur:Math.max(2,len/1.5),to:lvl+dir}}
function clr(p,f){const ok=(x,z)=>!cols.some(c=>c.f===f&&x>c.x0-.27&&x<c.x1+.27&&z>c.z0-.27&&z<c.z1+.27);if(ok(p[0],p[1]))return p;for(let r=.1;r<1.5;r+=.1)for(let i=0;i<16;i++){const a=i*PI/8,x=p[0]+Math.cos(a)*r,z=p[1]+Math.sin(a)*r;if(ok(x,z))return[x,z]}return p}
function viewStair(){if(!ST)return;lvl=1;px=ST.ga[0];pz=ST.ga[1];yaw=Math.atan2(-(ST.c[0]-px),-(ST.c[1]-pz));pitch=-.1}
function slab(g,L,hole){const X0=-L.W/2-.3,X1=L.W/2+.3,Z0=-L.D/2-.3,Z1=L.D/2+.3,c='#f7f5ef';
 if(!hole){bx(g,X1-X0,SL,Z1-Z0,c,0,H,0);return}
 const h=hole;bx(g,X1-X0,SL,h[2]-Z0,c,0,H,(Z0+h[2])/2);bx(g,X1-X0,SL,Z1-h[3],c,0,H,(h[3]+Z1)/2);
 bx(g,h[0]-X0,SL,h[3]-h[2],c,(X0+h[0])/2,H,(h[2]+h[3])/2);bx(g,X1-h[1],SL,h[3]-h[2],c,(h[1]+X1)/2,H,(h[2]+h[3])/2)}
function stairChg(){build();viewStair();ui()}
function goDoor(){if(mode==='plot')fade(toIn);else fade(toPlot)}
function nearFree(x,z){if(!plotBlk(x,z))return[x,z];for(let r=.5;r<40;r+=.5){const n=Math.ceil(r*8);for(let i=0;i<n;i++){const t=i/n*PI*2,a=x+r*Math.cos(t),b=z+r*Math.sin(t);if(!plotBlk(a,b))return[a,b]}}return[x,z]}
let LB=[];
function clearLabels(){LB.forEach(m=>{S.remove(m);if(m.material.map)m.material.map.dispose();m.material.dispose()});LB=[]}
function mkLabels(){try{mkLabels0()}catch(e){console.error(e);try{clearLabels()}catch(_){}}}
function mkLabels0(){clearLabels();if(!TS.lb)return;items.forEach(it=>{const T=TYPES[it.type],txt=it.type==='house'?'Дом':T.n,c=document.createElement('canvas');c.width=320;c.height=80;const g=c.getContext('2d');
 g.fillStyle='rgba(23,38,29,.82)';g.beginPath();g.moveTo(14,4);g.arcTo(316,4,316,76,22);g.arcTo(316,76,4,76,22);g.arcTo(4,76,4,4,22);g.arcTo(4,4,316,4,22);g.fill();g.fillStyle='#fff';g.font='bold 34px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,160,42);
 const sp=new TH.Sprite(new TH.SpriteMaterial({map:new TH.CanvasTexture(c),transparent:true,depthTest:false}));sp.scale.set(5.2,1.3,1);sp.renderOrder=9;sp.position.set(it.x,it.type==='house'?8:it.type==='pool'?2.6:4,it.z);S.add(sp);LB.push(sp)})}
function toGate(){const q=nearFree(0,PD/2+3.5);px=q[0];pz=q[1];yaw=0;pitch=0;DR=false;vx=vz=0;TG=null;ui()}
function goItem(it){if(!it||CL)return;DR=false;pitch=-.04;if(it.type==='house'){toPlot();ui();return}
 const T=TYPES[it.type],r=Math.max(T.w,T.d)*it.s/2+4.5;let b=null;for(const a of[PI/2,0,PI,-PI/2,PI/4,3*PI/4,-PI/4,-3*PI/4]){const x=it.x+Math.cos(a)*r,z=it.z+Math.sin(a)*r;if(!plotBlk(x,z)){b=[x,z];break}}
 if(!b)b=nearFree(it.x,it.z+r);px=b[0];pz=b[1];yaw=Math.atan2(-(it.x-px),-(it.z-pz));vx=vz=0;TG=null;ui()}
function plotExtra(){return'<h4>Перейти к объекту</h4><div class="r">'+bt('gate','0','Калитка / дорога')+items.map((it,i)=>bt('to',i,it.type==='house'?'Дом':TYPES[it.type].n)).join('')+'</div><h4>Подписи над объектами</h4><div class="r">'+bt('lb','1','Показать',TS.lb)+bt('lb','0','Скрыть',!TS.lb)+'</div>'}
/* ---------- вход / выход ---------- */
function fade(fn){const e=$t('tfade');e.style.opacity=1;setTimeout(()=>{try{fn();ui()}catch(x){console.error(x);note('Не удалось сменить место: '+(x&&x.message||x))}e.style.opacity=0},320)}
function toPlot(){mode='plot';items.forEach(i=>{if(i.mesh)i.mesh.visible=true});const d=doorP(),q0=d.P(d.dx,3.5+5),q=nearFree(q0[0],q0[1]);px=q[0];pz=q[1];lvl=1;vx=vz=0;TG=null;pitch=-.03;DR=false;
 let cx=0,cz=0,n=0;items.forEach(it=>{if(it.type!=='house'){cx+=it.x;cz+=it.z;n++}});const ox=Math.sin(d.a),oz=Math.cos(d.a);yaw=d.a+PI;
 if(n){cx/=n;cz/=n;const dx=cx-px,dz=cz-pz,l=Math.hypot(dx,dz)||1;if((dx*ox+dz*oz)/l>.2)yaw=Math.atan2(-dx,-dz)}
 try{mkLabels()}catch(e){console.error(e)}}
function toIn(){mode='in';DR=false;lvl=1;px=LY.hx;pz=LY.z1-1.4;yaw=0;pitch=0;if(TS.furn&&blk(px,pz))free()}
function act2(){if(CL||performance.now()<CD)return;if(PG==='up')climb(1);else if(PG==='down')climb(-1);else goDoor()}
function prompt(){const b=$t('tgo');let show=false,txt='';PG='';
 if(mode==='plot'){const d=doorP(),q=d.P(d.dx,3.5+1.3);show=Math.hypot(px-q[0],pz-q[1])<3*d.s;txt='Войти в дом';PG='door'}
 else if(!CL){if(ST&&lvl===1&&Math.hypot(px-ST.ga[0],pz-ST.ga[1])<1.8){show=true;txt='Подняться на 2 этаж';PG='up'}
  else if(ST&&lvl===2&&Math.hypot(px-ST.ua[0],pz-ST.ua[1])<1.8){show=true;txt='Спуститься на 1 этаж';PG='down'}
  }
 b.style.display=show?'block':'none';b.textContent=txt}
/* ---------- карта-схема ---------- */
function mini(){const c=$t('tmap'),g=c.getContext('2d'),W=c.width,Hh=c.height;g.clearRect(0,0,W,Hh);g.fillStyle='#fffe';g.fillRect(0,0,W,Hh);g.font='bold 9px sans-serif';g.textAlign='center';g.textBaseline='middle';const ox=W/2,oz=Hh/2;let sc,P=(x,z)=>[ox+x*sc,oz+z*sc];
 if(mode==='in'){const L=LY;sc=Math.min((W-14)/L.W,(Hh-14)/L.D);L.fl[lvl-1].forEach(r=>{g.fillStyle=r.k==='bed'||r.k==='bath'||r.k==='off'?'#dfe8ea':r.k==='hall'?'#eee8da':'#f3e6c8';const a=P(r.x0,r.z0);g.fillRect(a[0],a[1],(r.x1-r.x0)*sc,(r.z1-r.z0)*sc);g.strokeStyle='#17261D';g.strokeRect(a[0],a[1],(r.x1-r.x0)*sc,(r.z1-r.z0)*sc);if(r.k!=='hall'){g.fillStyle='#17261D';g.fillText(r.n.split(/[ -]/)[0],a[0]+(r.x1-r.x0)*sc/2,a[1]+(r.z1-r.z0)*sc/2)}});if(ST){const q=ST.hole,a=P(q[0],q[2]);g.fillStyle='#b98a5a';g.fillRect(a[0],a[1],(q[1]-q[0])*sc,(q[3]-q[2])*sc)}}
 else{sc=Math.min((W-14)/(PW+4),(Hh-14)/(PD+8));g.fillStyle='#bfd8a8';let a=P(-PW/2,-PD/2);g.fillRect(a[0],a[1],PW*sc,PD*sc);g.fillStyle='#bbb';a=P(-PW/2-2,PD/2+1.5);g.fillRect(a[0],a[1],(PW+4)*sc,4*sc);
  items.forEach(it=>{const T=TYPES[it.type],q=P(it.x,it.z);g.save();g.translate(q[0],q[1]);g.rotate(-it.a);g.fillStyle=it.type==='house'?'#C26A1B':'#7a8f9a';g.fillRect(-T.w*it.s*sc/2,-T.d*it.s*sc/2,T.w*it.s*sc,T.d*it.s*sc);g.restore()})}
 MM={sc,ox,oz};const q=P(px,pz);g.fillStyle='#d12';g.beginPath();g.arc(q[0],q[1],4,0,7);g.fill();g.strokeStyle='#d12';g.lineWidth=2;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q[0]-Math.sin(yaw)*11,q[1]-Math.cos(yaw)*11);g.stroke();g.lineWidth=1}
/* ---------- панель ---------- */
const bt=(a,v,t,on)=>'<button data-a="'+a+'" data-v="'+v+'"'+(on?' class="on"':'')+'>'+t+'</button>';
function ui(){const inn=mode==='in',L=LY;$t('th').textContent=inn?'Внутри дома':'Ваш участок';
 $t('ti').textContent=inn?L.nr+' комнат: '+L.m.br+' спальн'+(L.m.br<5?'и':'ей')+', '+L.m.ba+' санузл'+(L.m.ba>1?'а':'')+' · '+L.m.a+' м² · '+L.F+' эт.':'Идите к двери дома — появится кнопка «Войти». Участок и объекты — ваши.';
 let h='<h4>Время суток</h4><div class="r">'+[['day','День'],['sunset','Закат'],['night','Ночь']].map(q=>bt('tod',q[0],q[1],TS.tod===q[0])).join('')+'</div>';
 if(!inn)h+='<h4>Дом</h4><div class="r">'+bt('go','in','Зайти в дом')+'</div><h4>Вид</h4><div class="r">'+bt('dr','0','Хожу по участку',!DR)+bt('dr','1','Облёт сверху',DR)+'</div>'+plotExtra();
 else{h+='<h4>Мебель</h4><div class="r">'+bt('furn','0','Пустые комнаты',!TS.furn)+bt('furn','1','Расставить мебель',TS.furn)+'</div><h4>Стиль интерьера</h4><div class="r">'+Object.keys(IST).map(k=>bt('style',k,IST[k].n,TS.style===k)).join('')+'</div>';
  if(L.F>1)h+='<h4>Этаж</h4><div class="r">'+[1,2].map(f=>bt('lvl',f,f+' этаж',lvl===f)).join('')+'</div>';if(L.F>1)h+='<h4>Лестница: форма</h4><div class="r">'+[['straight','Прямая'],['u','П-образная'],['spiral','Круговая']].map(q=>bt('sh',q[0],q[1],TS.sh===q[0])).join('')+'</div><h4>Отделка лестницы</h4><div class="r">'+[['wood','Дерево'],['metal','Металл'],['glass','Стекло'],['concrete','Бетон']].map(q=>bt('sf',q[0],q[1],TS.sf===q[0])).join('')+'</div><h4>Цвет ступеней</h4><div class="sws">'+TCOLS.map(c=>'<i style="background:'+c+'" class="'+(c===TS.tc?'on':'')+'" data-a="stc" data-v="'+c+'"></i>').join('')+'</div><h4>Цвет перил и каркаса</h4><div class="sws">'+RCOLS.map(c=>'<i style="background:'+c+'" class="'+(c===TS.rc?'on':'')+'" data-a="src" data-v="'+c+'"></i>').join('')+'</div><div class="r" style="margin-top:8px">'+bt('vs','1','Посмотреть лестницу')+'</div>';
  h+='<h4>Комнаты</h4><div class="r">'+L.fl.slice(0,L.F).map((a,f)=>a.filter(r=>r.k!=='hall').map(r=>'<button data-a="room" data-v="'+f+'|'+a.indexOf(r)+'">'+r.n+'</button>').join('')).join('')+'</div>'
  +'<h4>Цвет стен</h4><div class="r">'+[['all','Все'],['l','Общие'],['b','Спальни']].map(q=>bt('rs',q[0],q[1],TS.rs===q[0])).join('')+'</div><div id="tsw">'+COLS.map(c=>'<i style="background:'+c+'" data-a="wall" data-v="'+c+'"></i>').join('')+'<input type="color" id="tcc" value="'+TS.wl+'"></div>'
  +'<h4>Пол</h4><div class="r">'+Object.keys(FLR).map(k=>bt('floor',k,FLR[k][0],TS.floor===k)).join('')+'</div>'}
 $t('tbody').innerHTML=h}
const ACT={tod(v){TS.tod=v;try{setTod(v)}catch(e){}tod();ui()},go(v){goDoor()},to(v){goItem(items[+v])},gate(){toGate()},lb(v){TS.lb=v==='1';mkLabels();ui()},dr(v){DR=v==='1';pitch=DR?-.75:0;ui()},sh(v){TS.sh=v;stairChg()},sf(v){TS.sf=v;TS.tc=FIN[v].tc;TS.rc=FIN[v].rc;stairChg()},stc(c){TS.tc=c;stairChg()},src(c){TS.rc=c;stairChg()},vs(){viewStair();ui()},furn(v){TS.furn=v==='1';build();ui()},style(k){api.style(k)},floor(f){api.floor(f)},rs(v){TS.rs=v;ui()},wall(c){api.wall(TS.rs==='l'?'l':TS.rs==='b'?'b':'all',c)},
 lvl(v){lvl=+v;const r=LY.fl[lvl-1].find(q=>q.k==='hall');px=(r.x0+r.x1)/2;pz=(r.z0+r.z1)/2;ui()},room(v){const[f,i]=v.split('|'),r=LY.fl[+f][+i];lvl=+f+1;px=(r.x0+r.x1)/2;pz=(r.z0+r.z1)/2;if(inBlk(px,pz))free();ui()}};
/* ---------- запуск ---------- */
function resize(){if(!R)return;const c=$t('tcv');R.setSize(c.clientWidth,c.clientHeight,false);cam.aspect=c.clientWidth/c.clientHeight;cam.updateProjectionMatrix()}
function initGL(){if(R)return true;try{R=new TH.WebGLRenderer({canvas:$t('tcv'),antialias:true})}catch(e){R=null;note('3D-прогулка требует WebGL: откройте сайт в Chrome или Safari');return false}
 R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=TH.PCFSoftShadowMap;R.localClippingEnabled=true;cam=new TH.PerspectiveCamera(70,1,.05,500);
 const cv=$t('tcv');cv.addEventListener('pointerdown',e=>{if(!ld){ld={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now()};cv.setPointerCapture(e.pointerId)}});
 cv.addEventListener('pointermove',e=>{if(!ld||ld.id!==e.pointerId)return;yaw-=(e.clientX-ld.x)*.005;pitch=Math.max(-1.2,Math.min(1.2,pitch-(e.clientY-ld.y)*.005));ld.x=e.clientX;ld.y=e.clientY});
 cv.addEventListener('pointerup',e=>{const ok=ld&&ld.id===e.pointerId&&Math.hypot(e.clientX-ld.sx,e.clientY-ld.sy)<7&&performance.now()-ld.t<350;ld=null;if(ok)tapGo(e)});cv.addEventListener('pointercancel',()=>ld=null);cv.addEventListener('wheel',e=>{e.preventDefault();cam.fov=Math.max(45,Math.min(90,cam.fov+e.deltaY*.04));cam.updateProjectionMatrix()},{passive:false});
 addEventListener('keydown',e=>{if(!run||e.target.tagName==='INPUT')return;keys[e.code]=1;if(e.key==='Escape'){const tp=$t('tp');if(!tp.classList.contains('hid'))tp.classList.add('hid');else api.close()}if(e.code==='KeyH'){e.preventDefault();$t('tp').classList.toggle('hid')}if(e.code==='KeyE'&&$t('tgo').style.display==='block')act2()});addEventListener('keyup',e=>keys[e.code]=0);addEventListener('resize',resize);
 const jy=$t('joy'),jm=e=>{const r=jy.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2);const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}J.s=x;J.f=-y;jy.firstElementChild.style.transform='translate('+x*30+'px,'+y*30+'px)'};
 jy.onpointerdown=e=>{jy.setPointerCapture(e.pointerId);jy._d=1;jm(e)};jy.onpointermove=e=>{if(jy._d)jm(e)};jy.onpointerup=jy.onpointercancel=()=>{jy._d=0;J.f=J.s=0;jy.firstElementChild.style.transform=''};
 $t('tbody').onclick=e=>{const b=e.target.closest('[data-a]');if(b&&ACT[b.dataset.a])ACT[b.dataset.a](b.dataset.v)};
 $t('tbody').oninput=e=>{if(e.target.id==='tcc')api.wall(TS.rs==='l'?'l':TS.rs==='b'?'b':'all',e.target.value,1)};
 $t('tgo').onclick=act2;$t('tmap').addEventListener('click',e=>{if(!MM||CL)return;const c=e.currentTarget,r=c.getBoundingClientRect(),x=((e.clientX-r.left)*c.width/r.width-MM.ox)/MM.sc,z=((e.clientY-r.top)*c.height/r.height-MM.oz)/MM.sc;if(!blk(x,z)){px=x;pz=z;TG=null}});const tr=$t('trun');if(tr)tr.onclick=()=>{RUN=!RUN;tr.classList.toggle('on',RUN)};$t('tx').onclick=()=>api.close();$t('tmin').onclick=()=>$t('tp').classList.add('hid');$t('topen').onclick=()=>$t('tp').classList.remove('hid');return true}
function loop(t){if(!run)return;requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;let eo=0,l=0;const dr=DR&&mode==='plot',bk=(x,z)=>dr?false:blk(x,z);
 if(CL){CL.t+=dt;const u=Math.min(1,CL.t/CL.dur),e=u*u*(3-2*u),p=smp(CL,e),p2=smp(CL,Math.min(1,e+.06));px=p[0];pz=p[1];eo=p[2];vx=vz=0;
  const ddx=p2[0]-p[0],ddz=p2[1]-p[1];if(Math.hypot(ddx,ddz)>.01){let da=Math.atan2(-ddx,-ddz)-yaw;da=Math.atan2(Math.sin(da),Math.cos(da));yaw+=da*Math.min(1,dt*2.2)}
  pitch+=((CL.to>lvl?.2:-.28)-pitch)*Math.min(1,dt*2);
  if(u>=1){lvl=CL.to;CL=null;eo=0;pitch=0;CD=performance.now()+900;ui()}}
 else{let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+J.f,s=(keys.KeyD?1:0)-(keys.KeyA?1:0)+J.s;
  if(f||s)TG=null;else if(TG){const dx=TG[0]-px,dz=TG[1]-pz,d=Math.hypot(dx,dz);if(d<.2)TG=null;else{const wx=dx/d,wz=dz/d;f=-wx*Math.sin(yaw)-wz*Math.cos(yaw);s=wx*Math.cos(yaw)-wz*Math.sin(yaw)}}
  l=Math.hypot(f,s);if(l>1){f/=l;s/=l;l=1}
  if(keys.ArrowLeft)yaw+=dt*1.8;if(keys.ArrowRight)yaw-=dt*1.8;
  const spd=(keys.ShiftLeft||keys.ShiftRight||RUN?4.6:2.5)*(dr?2.4:1),k=Math.min(1,dt*10);
  vx+=((-Math.sin(yaw)*f+Math.cos(yaw)*s)*spd-vx)*k;vz+=((-Math.cos(yaw)*f-Math.sin(yaw)*s)*spd-vz)*k;
  const dx=vx*dt,dz=vz*dt;let mv=0;if(!bk(px+dx,pz)){px+=dx;mv=1}if(!bk(px,pz+dz)){pz+=dz;mv=1}
  if(TG){if(mv)TG[3]=0;else if((TG[3]=(TG[3]||0)+dt)>.35)TG=null}
  if(l>.05)bob+=dt*9*(spd>3?1.4:1)}
 const y=dr?13:(mode==='in'?(lvl-1)*(H+SL):0)+1.65+Math.sin(bob)*.03*Math.min(1,Math.hypot(vx,vz)/2.5)+eo;cam.position.set(px,y,pz);cam.rotation.set(pitch,yaw,0,'YXZ');
 if(mode==='in')lights();try{R.render(mode==='in'?IS:S,cam)}catch(e){if(!RE){RE=1;console.error(e);if(LB.length){TS.lb=false;clearLabels()}note('Ошибка отрисовки: '+(e&&e.message||e))}}
 try{if(++fr%4===0){prompt();mini()}}catch(e){}}
function tapGo(e){if(CL||DR)return;const c=$t('tcv'),r=c.getBoundingClientRect(),rc=new TH.Raycaster();rc.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-((e.clientY-r.top)/r.height)*2+1},cam);
 const o=rc.ray.origin,d=rc.ray.direction,fy=mode==='in'?(lvl-1)*(H+SL):0;if(d.y>-.02)return;const t=(fy-o.y)/d.y;if(t<0||t>30)return;const x=o.x+d.x*t,z=o.z+d.z*t;if(blk(x,z))return;
 TG=[x,z,0,0];const sc=mode==='in'?IS:S,m=new TH.Mesh(new TH.RingGeometry(.14,.22,24),new TH.MeshBasicMaterial({color:0xC26A1B,transparent:true,opacity:.85,side:TH.DoubleSide}));m.rotation.x=-PI/2;m.position.set(x,fy+.04,z);sc.add(m);setTimeout(()=>{sc.remove(m);m.geometry.dispose();m.material.dispose()},900)}
const api=window.WH_TOUR={
 open(m){if(!initGL())return;const h=house();if(!h)return;prevStage=stage;if(stage!==3)setStage(3);select(null);vM=false;vH=false;$t('tour').classList.add('on');$t('tp').classList.remove('hid');document.body.style.overflow='hidden';
  if(!TS.init){TS.init=1;const k=STI[h.st]||'scandi';Object.assign(TS,{style:k,floor:IST[k].f,wl:IST[k].w,wb:IST[k].b})}
  items.forEach(i=>{if(i.mesh)i.mesh.visible=true});RE=0;DR=false;CL=null;TG=null;vx=vz=0;build();toIn();ui();resize();run=true;last=performance.now();requestAnimationFrame(loop)},
 close(){clearLabels();run=false;$t('tour').classList.remove('on');document.body.style.overflow='';vM=true;vH=true;if(prevStage!==3)setStage(prevStage)},
 wall(r,c,keep){const k=(r==='living'||r==='l')?'l':(r==='bedroom'||r==='b')?'b':'all';if(k!=='b')TS.wl=c;if(k!=='l')TS.wb=c;if(ms.l){ms.l.color.set(TS.wl);ms.b.color.set(TS.wb)}if(!keep&&run)ui();return 'ok'},
 style(k){const s=IST[k];if(!s)throw Error('bad style');Object.assign(TS,{style:k,wl:s.w,wb:s.b,floor:s.f});if(IS){build()}if(run)ui();return 'ok'},
 floor(f){if(!FLR[f])throw Error('bad floor');TS.floor=f;if(IS)build();if(run)ui();return 'ok'},
 state(){return{style:IST[TS.style].n,walls:{l:TS.wl,b:TS.wb},floor:FLR[TS.floor][0],furniture:TS.furn,stairs:{shape:TS.sh,finish:TS.sf,steps:TS.tc,rails:TS.rc},model:MODELS[curModel].n}},stairs(o){if(o.shape)TS.sh=o.shape;if(o.finish&&FIN[o.finish]){TS.sf=o.finish;TS.tc=FIN[o.finish].tc;TS.rc=FIN[o.finish].rc}if(IS)build();if(run)ui();return 'ok'}};
[['tourb','in']].forEach(([id,m])=>{const b=$t(id);if(b)b.onclick=()=>api.open(m)});
})();
