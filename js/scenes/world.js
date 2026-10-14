/* Мир: земля, дорога, лес, холмы, соседи, забор */
/* ---- мир: земля, дорога, лес, холмы, соседи ---- */
const worldG=new T.Group();S.add(worldG);let cloudG=null,gridObj=null;
const rngS=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function texCv(base,flecks,n,seed,stripe){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),r=rngS(seed);g.fillStyle=base;g.fillRect(0,0,256,256);
if(stripe){g.fillStyle=stripe;for(let y=64;y<256;y+=128)g.fillRect(0,y,256,64)}
for(let i=0;i<n;i++){g.fillStyle=flecks[i%flecks.length];g.globalAlpha=.22+r()*.5;g.fillRect(r()*256,r()*256,1+r()*2,2+r()*5)}g.globalAlpha=1;return c}
const maxAn=(R.capabilities&&R.capabilities.getMaxAnisotropy)?R.capabilities.getMaxAnisotropy():1;
function mkTex(c,rx,ry){const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=Math.min(8,maxAn);return t}
function disposeWorld(){worldG.traverse(o=>{try{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>{if(m.map)m.map.dispose();if(m!==cloudMat&&m!==lampMat)m.dispose()})}catch(e){}});while(worldG.children.length)worldG.remove(worldG.children[0])}
function mkWorld(){try{disposeWorld();cloudG=null;gridObj=null;
if(R.noGL||T.__stub){worldG.add(bx(500,.1,500,0xBFD2B0,0,-.1,0));worldG.add(bx(PW,.06,PD,0x8DBB6E,0,0,0));return}
const rnd=rngS(PW*131+PD*17+7),hw=PW/2,hd=PD/2;
const ex=clamp(Math.hypot(PW,PD)/2+10,40,85);Object.assign(sun.shadow.camera,{left:-ex,right:ex,top:ex,bottom:-ex});sun.shadow.camera.updateProjectionMatrix();
/* земля вокруг */
const gm=new T.Mesh(new T.CircleGeometry(430,72),new T.MeshStandardMaterial({map:mkTex(texCv('#9DBB86',['#7FA06A','#B4CC9C','#8DAE76'],5200,11),70,70),roughness:1}));
gm.rotation.x=-Math.PI/2;gm.position.y=-.02;gm.receiveShadow=true;worldG.add(gm);
/* газон участка */
const lw=new T.Mesh(new T.PlaneGeometry(PW,PD),new T.MeshStandardMaterial({map:mkTex(texCv('#86B866',['#6FA352','#9CCB7A','#7DB05C'],3800,5,'rgba(255,255,255,.07)'),PW/8,PD/8),roughness:.95}));
lw.rotation.x=-Math.PI/2;lw.position.y=.055;lw.receiveShadow=true;worldG.add(lw);
const ed=0xCFC9BA;worldG.add(bx(PW+.4,.1,.3,ed,0,0,-hd),bx(PW+.4,.1,.3,ed,0,0,hd),bx(.3,.1,PD,ed,-hw,0,0),bx(.3,.1,PD,ed,hw,0,0));
worldG.add(bx(3.6,.03,7,0xBDB6A6,0,.05,hd-3.5));
/* сетка для расстановки (видна при перетаскивании) */
{const pts=[];for(let x=-hw;x<=hw+.01;x+=2.5)pts.push(x,.08,-hd,x,.08,hd);for(let z=-hd;z<=hd+.01;z+=2.5)pts.push(-hw,.08,z,hw,.08,z);
const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(pts,3));gridObj=new T.LineSegments(gg,new T.LineBasicMaterial({color:0xFFFFFF,transparent:true,opacity:.4}));gridObj.visible=false;worldG.add(gridObj)}
/* дорога, тротуары, разметка, фонари */
const RW=PW+260,rz=hd+4.2;
worldG.add(bx(RW,.07,5.4,0x565B61,0,0,rz),bx(RW,.1,1.5,0xB8B3A6,0,0,hd+.75),bx(RW,.1,1.5,0xB8B3A6,0,0,hd+7.65));
{const nD=Math.floor(RW/4.4),im=new T.InstancedMesh(new T.BoxGeometry(2.2,.02,.16),new T.MeshBasicMaterial({color:0xF1EFE6}),nD),dm=new T.Object3D();for(let i=0;i<nD;i++){dm.position.set(-RW/2+2.2+i*4.4,.08,rz);dm.updateMatrix();im.setMatrixAt(i,dm.matrix)}im.frustumCulled=false;worldG.add(im)}
for(let x=-Math.floor((PW+20)/14)*7;x<=Math.floor((PW+20)/14)*7;x+=14){const z=hd+1.1,pg=new T.Mesh(new T.CylinderGeometry(.06,.08,4.4,8),mat(0x3A3F44));pg.position.set(x,2.2,z);pg.castShadow=true;worldG.add(pg);
const ar=bx(.9,.08,.08,0x3A3F44,0,0,0);ar.position.set(x,4.35,z+.4);worldG.add(ar);const hdm=new T.Mesh(new T.SphereGeometry(.2,12,8),lampMat);hdm.position.set(x,4.25,z+.8);worldG.add(hdm)}
/* соседние дома */
const NW=[0xE8DFCB,0xC9B79C,0xD8D2C4,0xB7C2B0,0xE2C9A8],NR=[0x8A4636,0x5E5A55,0x6B4A2F,0x3F4A52],nb=[];
const nbHouse=(x,z,w,d,h,wc,rc,rot)=>{const g=new T.Group();g.add(bx(w,h,d,wc,0,0,0));const cg=new T.ConeGeometry(Math.max(w,d)*.78,h*.7,4);cg.rotateY(Math.PI/4);cg.scale(w/Math.max(w,d),1,d/Math.max(w,d));const r=new T.Mesh(cg,mat(rc));r.position.y=h+h*.35;r.castShadow=true;g.add(r);g.position.set(x,0,z);g.rotation.y=rot;nb.push([x,z]);worldG.add(g)};
for(let i=-4;i<=4;i++){const x=i*30+(rnd()-.5)*8;nbHouse(x,hd+22+rnd()*5,9+rnd()*5,8+rnd()*4,3.2+rnd()*1.8,NW[(rnd()*5)|0],NR[(rnd()*4)|0],(rnd()*2|0)*Math.PI/2)}
[-1,1].forEach(s=>{[-.2,.55].forEach(k=>nbHouse(s*(hw+24+rnd()*6),hd*k*1.2,9+rnd()*4,8+rnd()*4,3.2+rnd()*1.6,NW[(rnd()*5)|0],NR[(rnd()*4)|0],(rnd()*2|0)*Math.PI/2))});
/* лес по кругу (instanced) */
const R0=Math.hypot(PW,PD)/2+16,tr=[];
for(let i=0;i<900&&tr.length<300;i++){const a=rnd()*6.2832,r=R0+Math.pow(rnd(),1.35)*190,x=Math.cos(a)*r,z=Math.sin(a)*r,q=rnd();
if(z>hd-2&&z<hd+30)continue;let bad=false;for(const n of nb)if(Math.hypot(n[0]-x,n[1]-z)<10){bad=true;break}if(!bad)tr.push([x,z,q])}
const nR=tr.filter(t=>t[2]<.5).length,nC=tr.length-nR;
const trunkIM=new T.InstancedMesh(new T.CylinderGeometry(.22,.34,1,6),mat(0x6B4A2F),tr.length),
 crR=new T.InstancedMesh(new T.IcosahedronGeometry(2.3,1),new T.MeshStandardMaterial({color:0xffffff,roughness:.9,flatShading:true}),Math.max(1,nR)),
 crC=new T.InstancedMesh(new T.ConeGeometry(2,6.5,7),new T.MeshStandardMaterial({color:0xffffff,roughness:.9,flatShading:true}),Math.max(1,nC));
const dm=new T.Object3D(),col=new T.Color(),GR=[0x3E8A3E,0x2F7A38,0x4C9A47,0x5BA34F,0x6BAA4B,0x8CA84A],GC=[0x2A6B3A,0x24593A,0x2F7A44,0x1F5A36];let ri=0,ci=0;
tr.forEach((t,i)=>{const s=.8+rnd()*.9,round=t[2]<.5;dm.rotation.set(0,rnd()*6,0);
dm.position.set(t[0],round?1.3*s:.9*s,t[1]);dm.scale.set(s,round?2.6*s:1.8*s,s);dm.updateMatrix();trunkIM.setMatrixAt(i,dm.matrix);
if(round){dm.position.set(t[0],3.7*s,t[1]);dm.scale.set(s*(.9+rnd()*.3),s*(.85+rnd()*.3),s*(.9+rnd()*.3));dm.updateMatrix();crR.setMatrixAt(ri,dm.matrix);if(crR.setColorAt)crR.setColorAt(ri,col.setHex(GR[(rnd()*GR.length)|0]));ri++}
else{dm.position.set(t[0],1.8*s+3.1*s,t[1]);dm.scale.set(s,s*(.9+rnd()*.4),s);dm.updateMatrix();crC.setMatrixAt(ci,dm.matrix);if(crC.setColorAt)crC.setColorAt(ci,col.setHex(GC[(rnd()*GC.length)|0]));ci++}});
[trunkIM,crR,crC].forEach(m=>{m.frustumCulled=false;worldG.add(m)});
/* дальние холмы */
const hm=new T.MeshStandardMaterial({color:0x6F9A6A,roughness:1,flatShading:false});
for(let i=0;i<16;i++){const a=i/16*6.2832+rnd()*.3,r=250+rnd()*70,s=40+rnd()*50,m=new T.Mesh(new T.SphereGeometry(1,18,10),hm);m.scale.set(s*1.7,s*(.3+rnd()*.25),s*1.2);m.position.set(Math.cos(a)*r,-s*.05,Math.sin(a)*r);m.rotation.y=rnd()*3;worldG.add(m)}
/* облака */
cloudG=new T.Group();const sg=new T.SphereGeometry(1,10,8);
for(let i=0;i<10;i++){const cg=new T.Group(),n=3+(rnd()*3|0);for(let j=0;j<n;j++){const s=new T.Mesh(sg,cloudMat);s.scale.set(10+rnd()*8,4+rnd()*3,7+rnd()*4);s.position.set((j-n/2)*9+rnd()*4,rnd()*2,rnd()*5);cg.add(s)}cg.position.set((rnd()-.5)*560,75+rnd()*30,(rnd()-.5)*560);cloudG.add(cg)}
worldG.add(cloudG);
}catch(e){disposeWorld();cloudG=null;gridObj=null;worldG.add(bx(500,.1,500,0xBFD2B0,0,-.1,0));worldG.add(bx(PW,.06,PD,0x8DBB6E,0,0,0));worldG.add(bx(PW+20,.06,5,0x6E7378,0,0,PD/2+4))}}
const gridShow=v=>{if(gridObj)gridObj.visible=!!v};

const plotG=new T.Group();S.add(plotG);
const FENCES={basic:{n:'Простой деревянный',r:0,d:'В базе, без доплаты'},picket:{n:'Штакетник',r:1200,d:'Лёгкий светлый забор'},solid:{n:'Глухой деревянный',r:2500,d:'Высота 1,8 м, закрытый двор'},metal:{n:'Профнастил',r:1800,d:'Высота 1,8 м, практичный'},brick:{n:'Кирпич и ковка',r:9000,d:'Кирпичные столбы и металлические прутья'},chain:{n:'Сетка-рабица',r:0,d:'Самый бюджетный вариант'},hedge:{n:'Живая изгородь',r:1800,d:'Туи вдоль границы участка'},none:{n:'Без забора',r:0,d:'Открытый участок'}};
let fenceSt='basic',fpKey='',fpIso=null;
const fenceLen=()=>Math.max(0,2*(PW+PD)-4);
const fenceCost=()=>Math.round(FENCES[fenceSt].r*fenceLen()/1e4)*1e4;
