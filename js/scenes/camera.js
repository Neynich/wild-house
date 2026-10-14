/* Камера конструктора */
const MINR=7,MAXR=170;
function camApply(){cam.position.set(ctx+crad*Math.sin(cph)*Math.sin(cth),crad*Math.cos(cph),ctz+crad*Math.sin(cph)*Math.cos(cth));cam.lookAt(ctx,0,ctz)}
function snapCam(){cth=th;cph=ph;crad=rad;ctx=tgt.x;ctz=tgt.z;camApply();camDirty=false}
function upd(){camDirty=true;try{if(ISO||R.noGL)snapCam()}catch(e){}}
function clampTgt(){const mx=PW*.9+10,mz=PD*.9+10;tgt.x=clamp(tgt.x,-mx,mx);tgt.z=clamp(tgt.z,-mz,mz)}
function camStep(dt){
if(inertia){th+=inertia.x*dt;ph=clamp(ph+inertia.y*dt,.05,1.45);const f=Math.pow(.05,dt);inertia.x*=f;inertia.y*=f;if(Math.abs(inertia.x)+Math.abs(inertia.y)<.02)inertia=null;camDirty=true}
if(kv.l||kv.r||kv.u||kv.d){const sp=crad*.9*dt,c=Math.cos(cth),s=Math.sin(cth),ax=(kv.r?1:0)-(kv.l?1:0),az=(kv.u?1:0)-(kv.d?1:0);tgt.x+=c*ax*sp-s*az*sp;tgt.z+=-s*ax*sp-c*az*sp;clampTgt();camDirty=true}
if(kv.q||kv.e){th+=((kv.e?1:0)-(kv.q?1:0))*1.3*dt;camDirty=true}
if(kv.zi||kv.zo){rad=clamp(rad*Math.exp(((kv.zo?1:0)-(kv.zi?1:0))*1.1*dt),MINR,MAXR);camDirty=true}
if(!camDirty)return;
const k=1-Math.exp(-dt*(P.size>0||inertia?24:13));
cth+=(th-cth)*k;cph+=(ph-cph)*k;crad+=(rad-crad)*k;ctx+=(tgt.x-ctx)*k;ctz+=(tgt.z-ctz)*k;
if(Math.abs(th-cth)+Math.abs(ph-cph)+Math.abs(rad-crad)*.02+Math.abs(tgt.x-ctx)*.02+Math.abs(tgt.z-ctz)*.02<.0004){cth=th;cph=ph;crad=rad;ctx=tgt.x;ctz=tgt.z;camDirty=false}
camApply()}
function worldTick(n,dt){
if(cloudG)cloudG.children.forEach(c=>{c.position.x+=dt*1.6;if(c.position.x>290)c.position.x=-290});
if(sel&&sel.mesh&&sel.mesh.userData.sp&&sel.mesh.userData.sp.visible)sel.mesh.userData.sp.material.opacity=.38+.16*Math.sin(n*.005);
if(dt>.034)slow++;else slow=Math.max(0,slow-1);
if(slow>45&&curPR>1.01){curPR=Math.max(1,curPR-.5);R.setPixelRatio(curPR);size();slow=0}}
function frame(){const n=performance.now(),dt=Math.min(.05,(n-lastT)/1000);lastT=n;camStep(dt);worldTick(n,dt)}
function fitRad(){rad=clamp(PW*1.3*(mw.clientWidth/mw.clientHeight<1?1.5:1),15,150)}
function homeView(){th=.6;ph=1;tgt.x=tgt.z=0;tvw=false;$('tv').textContent='Вид сверху';fitRad();upd()}
$('tv').onclick=()=>{tvw=!tvw;ph=tvw?.05:1;$('tv').textContent=tvw?'Вид под углом':'Вид сверху';upd()};
$('zi').onclick=()=>{rad=clamp(rad*.8,MINR,MAXR);upd()};$('zo').onclick=()=>{rad=clamp(rad*1.25,MINR,MAXR);upd()};
function size(){const w=mw.clientWidth,h=mw.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(first){fitRad();first=false;snapCam()}upd();
const hw=hv.clientWidth,hh2=hv.clientHeight;HR.setSize(hw,hh2,false);hcam.aspect=hw/hh2;hcam.updateProjectionMatrix();hupd()}
addEventListener('resize',size);
