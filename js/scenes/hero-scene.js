/* 3D-сцена первого экрана */
/* ---- hero scene ---- */
const hv=$('hv'),HR=mkR({canvas:$('hc'),antialias:true,alpha:true});HR.setPixelRatio(Math.min(devicePixelRatio,2));HR.shadowMap.enabled=true;
const HS=new T.Scene();HS.add(new T.HemisphereLight(0xffffff,0x88aa77,.85));
const hl=new T.DirectionalLight(0xfff2dd,1);hl.position.set(18,26,12);hl.castShadow=true;Object.assign(hl.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:90});hl.shadow.mapSize.set(1024,1024);HS.add(hl);
const hcam=new T.PerspectiveCamera(38,1,.5,300);
const disc=new T.Mesh(new T.CylinderGeometry(17,17,.6,56),mat(0x7DAF62));disc.position.y=-.3;disc.receiveShadow=true;HS.add(disc);
const hg=build('garden',1);hg.position.set(-12,0,5);hg.userData.sp.visible=false;HS.add(hg);
const hp=build('pool',1);hp.position.set(12,0,2);hp.rotation.y=Math.PI/2;hp.userData.sp.visible=false;HS.add(hp);
let hh=null,hf=1,hst='modern',hth=.7,hph=1.0,hdrag=null,hauto=true;
function hbuild(){if(hh)HS.remove(hh);hh=build('house',hf,hst);hh.userData.sp.visible=false;HS.add(hh);Q('#hb button').forEach(b=>{if(b.id!=='hbt')b.className=(b.dataset.k===hst||+b.dataset.f===hf)?'on':''})}
Object.keys(STY).forEach(k=>{const b=document.createElement('button');b.textContent=STY[k].n;b.dataset.k=k;b.onclick=()=>{hst=k;hbuild()};$('hb').appendChild(b)});
[1,2].forEach(f=>{const b=document.createElement('button');b.textContent=f+(f===1?' этаж':' этажа');b.dataset.f=f;b.onclick=()=>{hf=f;hbuild()};$('hb').appendChild(b)});
{const b=document.createElement('button');b.id='hbt';b.textContent='Взять в проект';b.style.cssText='background:var(--acc);color:#fff;border-color:var(--acc)';b.onclick=()=>{const h=house();if(h){h.st=hst;h.fl=hf;h.c1=null;h.c2=null;rebuild();note('Стиль и этажность перенесены в ваш проект')}};$('hb').appendChild(b)}
hbuild();
function hupd(){const r=40;hcam.position.set(r*Math.sin(hph)*Math.sin(hth),r*Math.cos(hph)+2,r*Math.sin(hph)*Math.cos(hth));hcam.lookAt(0,3,0)}
const hc=$('hc');
function hbind(el){el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);hdrag={x:e.clientX,y:e.clientY};hauto=false});
el.addEventListener('pointermove',e=>{if(!hdrag)return;hth-=(e.clientX-hdrag.x)*.008;hph=clamp(hph-(e.clientY-hdrag.y)*.004,.5,1.4);hdrag={x:e.clientX,y:e.clientY};hupd()});
const hend=()=>{hdrag=null;setTimeout(()=>{if(!hdrag)hauto=true},2500)};el.addEventListener('pointerup',hend);el.addEventListener('pointercancel',hend)}
hbind(hc);hbind($('hc2'));
