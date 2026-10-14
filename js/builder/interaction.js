/* Мышь, касания, выбор и перетаскивание объектов */
const RC=new T.Raycaster(),PL=new T.Plane(new T.Vector3(0,1,0),0),P=new Map();let drag=null,pd=0;
function ray(e){const r=cv.getBoundingClientRect();RC.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),cam)}
function gp(){const v=new T.Vector3();return RC.ray.intersectPlane(PL,v)?v:null}
const d2=()=>{const a=[...P.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
function pickItem(e){if(ISO)return isoPick(e);ray(e);const h=RC.intersectObjects(items.filter(i=>i.mesh.visible).map(i=>i.mesh),true);if(!h.length)return null;let o=h[0].object;while(o&&!o.userData.id)o=o.parent;return o?(items.find(i=>i.id===o.userData.id)||null):null}
function groundPt(e){if(ISO)return isoGround(e);ray(e);return gp()}
let gmode=null,g2=null,lastTap=null,ov0=null,hovIt=null,hovT=0;
function panBy(dx,dy){if(ISO||R.noGL)return;const k=2*Math.tan(.3927)*crad/Math.max(240,mw.clientHeight),fy=k/Math.max(.28,Math.cos(cph)),c=Math.cos(cth),s=Math.sin(cth);tgt.x+=-c*dx*k-s*dy*fy;tgt.z+=s*dx*k-c*dy*fy;clampTgt();upd()}
function focusOn(x,z,r){if(ISO||R.noGL)return;tgt.x=x;tgt.z=z;clampTgt();if(r)rad=clamp(r,MINR,MAXR);upd()}
const fitFor=it=>{const t=TYPES[it.type];return clamp(Math.max(t.w,t.d)*it.s*2.6+12,14,110)};
function glow(it,on){try{it.mesh.traverse(o=>{if(o.material&&o.material.emissive)o.material.emissive.setHex(on?0x2B2208:0)})}catch(x){}}
function clearHover(){if(hovIt&&hovIt!==sel)glow(hovIt,0);hovIt=null;mw.classList.remove('hov')}
function hoverCheck(e){const n=performance.now();if(n-hovT<45)return;hovT=n;let it=null;try{it=pickItem(e)}catch(x){}if(it===hovIt)return;if(hovIt&&hovIt!==sel)glow(hovIt,0);hovIt=it;if(it&&it!==sel&&!R.noGL&&!ISO)glow(it,1);mw.classList.toggle('hov',!!it)}
function dbl(e){if(ISO||R.noGL)return;const it=pickItem(e);if(it){select(it);focusOn(it.x,it.z,fitFor(it))}else{const pt=groundPt(e);if(pt)focusOn(pt.x,pt.z,Math.max(18,rad*.7))}}
function end(e){const p=P.get(e.pointerId);P.delete(e.pointerId);if(P.size<2){g2=null;pd=0}
if(drag&&drag.x!==undefined){const it=drag.it;if(drag.bad){const why=check(it,drag.x,drag.z,it.a),pp=near(it,drag.x,drag.z,it.a,it.s);
if(pp){commit(it,pp[0],pp[1]);toast('Здесь нельзя разместить: '+nm(it)+' ('+WHY[why]+'). WILD AI перенёс объект на ближайшее подходящее место.',1)}else{commit(it,it.x,it.z)}}
else commit(it,drag.x,drag.z)}
gridShow(false);
if(p&&e.type==='pointerup'&&P.size===0&&gmode!=='pinch'&&p.m<8){
 if(!p.hit&&gmode==='orbit')select(null);
 const n=performance.now();if(lastTap&&n-lastTap.t<330&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<28){lastTap=null;try{dbl(e)}catch(x){}}else lastTap={t:n,x:e.clientX,y:e.clientY}}
if(gmode==='orbit'&&p&&ov0&&p.m>10&&P.size===0&&performance.now()-ov0.t<90&&Math.hypot(ov0.x,ov0.y)>.4){inertia={x:clamp(ov0.x,-5,5),y:clamp(ov0.y,-5,5)}}
if(P.size===0){drag=null;gmode=null;ov0=null;mw.classList.remove('obj','drag','pan')}}
function bind(el){
el.addEventListener('contextmenu',e=>e.preventDefault());
el.addEventListener('mousedown',e=>{if(e.button===1)e.preventDefault()});
el.addEventListener('pointerdown',e=>{try{mw.focus({preventScroll:true})}catch(x){}
el.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY,m:0,hit:false,t:performance.now()});inertia=null;ov0=null;
if(P.size===1){clearHover();const wantPan=e.button===1||e.button===2||(e.button===0&&(e.shiftKey||e.ctrlKey)&&!ISO),it=wantPan?null:pickItem(e);
 if(it){P.get(e.pointerId).hit=true;const pt=groundPt(e);select(it);drag=pt?{it,ox:it.x-pt.x,oz:it.z-pt.z}:null;gmode='item';if(drag)mw.classList.add('obj')}
 else{drag=null;gmode=wantPan?'pan':'orbit';mw.classList.add(wantPan?'pan':'drag')}}
else{if(drag){place(drag.it,drag.it.x,drag.it.z,drag.it.a);tint(drag.it,false);gridShow(false)}drag=null;gmode='pinch';mw.classList.remove('obj','drag','pan');g2=null}});
el.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);
if(!p){if(e.pointerType==='mouse')hoverCheck(e);return}
const dx=e.clientX-p.x,dy=e.clientY-p.y;p.m+=Math.hypot(dx,dy);
if(P.size>=2){p.x=e.clientX;p.y=e.clientY;const a=[...P.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,mx=(a[0].x+a[1].x)/2,my=(a[0].y+a[1].y)/2,ang=Math.atan2(a[1].y-a[0].y,a[1].x-a[0].x);
 if(g2){rad=clamp(rad*g2.d/d,MINR,MAXR);let da=ang-g2.a;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;th+=da;panBy(mx-g2.mx,my-g2.my)}
 g2={d,mx,my,a:ang};upd();return}
if(drag){if(p.m>4)gridShow(true);const pt=groundPt(e);if(pt){const x=snap(pt.x+drag.ox),z=snap(pt.z+drag.oz);place(drag.it,x,z,drag.it.a);drag.bad=check(drag.it,x,z,drag.it.a);drag.x=x;drag.z=z;tint(drag.it,!!drag.bad)}}
else if(gmode==='pan')panBy(dx,dy);
else{th-=dx*.006;ph=clamp(ph-dy*.006,.05,1.45);const n=performance.now(),dt=Math.max(8,n-p.t)/1000;p.t=n;const vx=-dx*.006/dt,vy=-dy*.006/dt;ov0=ov0?{x:ov0.x*.6+vx*.4,y:ov0.y*.6+vy*.4,t:n}:{x:vx,y:vy,t:n};upd()}
p.x=e.clientX;p.y=e.clientY});
el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
el.addEventListener('wheel',e=>{e.preventDefault();const dy=e.deltaY*(e.deltaMode===1?33:e.deltaMode===2?400:1),q=Math.exp(clamp(dy,-300,300)*(e.ctrlKey?.01:.0016)),nr=clamp(rad*q,MINR,MAXR),f=1-nr/rad;
if(!ISO&&!R.noGL&&Math.abs(f)>1e-4){let pt=null;try{pt=groundPt(e)}catch(x){}if(pt&&Math.hypot(pt.x-tgt.x,pt.z-tgt.z)<rad*2.2){tgt.x+=(pt.x-tgt.x)*f;tgt.z+=(pt.z-tgt.z)*f;clampTgt()}}
rad=nr;inertia=null;upd()},{passive:false})}
const cv2e=document.getElementById('c2');bind(cv);bind(cv2e);
