/* Расстановка объектов, коллизии, стоимость */
function cor(k,x,z,a,s){const t=TYPES[k],c=Math.cos(a),n=Math.sin(a),hw=t.w*s/2,hd=t.d*s/2;return[[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(p=>[x+p[0]*c+p[1]*n,z-p[0]*n+p[1]*c])}
function sat(A,B){for(const Qp of[A,B])for(let i=0;i<4;i++){const p=Qp[i],q=Qp[(i+1)%4],nx=-(q[1]-p[1]),nz=q[0]-p[0];let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;
for(const v of A){const d=v[0]*nx+v[1]*nz;a0=Math.min(a0,d);a1=Math.max(a1,d)}
for(const v of B){const d=v[0]*nx+v[1]*nz;b0=Math.min(b0,d);b1=Math.max(b1,d)}
if(a1<b0||b1<a0)return false}return true}
function sd(p,a,b){const ax=b[0]-a[0],az=b[1]-a[1],t=clamp(((p[0]-a[0])*ax+(p[1]-a[1])*az)/(ax*ax+az*az),0,1);return Math.hypot(p[0]-a[0]-t*ax,p[1]-a[1]-t*az)}
function pgap(A,B){if(sat(A,B))return-1;let m=1e9;for(const p of A)for(let i=0;i<4;i++)m=Math.min(m,sd(p,B[i],B[(i+1)%4]));for(const p of B)for(let i=0;i<4;i++)m=Math.min(m,sd(p,A[i],A[(i+1)%4]));return m}
function check(it,x,z,a,s){s=s==null?it.s:s;const c=cor(it.type,x,z,a,s);
for(const p of c)if(Math.abs(p[0])>PW/2-.3||Math.abs(p[1])>PD/2-.3)return'out';
for(const o of items){if(o===it)continue;const g=pgap(c,cor(o.type,o.x,o.z,o.a,o.s));if(g<.3)return'overlap';
if(((it.type==='pool'&&o.type==='house')||(it.type==='house'&&o.type==='pool'))&&g<3.5)return'dist'}return null}
function near(it,x,z,a,s){for(let r=0;r<=80;r+=.5){const n=r?Math.ceil(r*8):1;for(let i=0;i<n;i++){const t=i/n*Math.PI*2,px=snap(x+r*Math.cos(t)),pz=snap(z+r*Math.sin(t));if(!check(it,px,pz,a,s))return[px,pz]}}return null}
const place=(it,x,z,a)=>{it.mesh.position.set(x,0,z);it.mesh.rotation.y=a;it.mesh.scale.setScalar(it.s)};
const tint=(it,bad)=>it.mesh.traverse(o=>{if(o.material&&o.material.emissive)o.material.emissive.setHex(bad?0x990000:0)});
function commit(it,x,z){it.x=x;it.z=z;place(it,x,z,it.a);tint(it,false);if(lampL.length)lamps(TOD[tod2].lamp);if(ready)pg('map')}
function total(){const b=buildCost(),l=landCost();$('tot').textContent=fmt(b+l);$('tsub').textContent='дом и объекты '+mln(b)+' · земля '+mln(l);try{landInfo()}catch(e){}try{calc()}catch(e){}if(ready)autosave()}
function sync(){const on=!!sel;$('ang').disabled=$('scl').disabled=$('del').disabled=$('rot').disabled=!on;
if(on){const d=((Math.round(sel.a*180/Math.PI/5)*5%360)+360)%360;$('ang').value=d;$('av').textContent=d+'°';$('scl').value=sel.s;$('sv').textContent=sel.type==='house'?'≈ '+Math.round(180*sel.s*sel.s)+' м²':'×'+sel.s.toFixed(2);$('selname').textContent=nm(sel)}
else{$('selname').textContent='Выберите объект на карте';$('av').textContent='';$('sv').textContent=''}colUI();try{sbarUI()}catch(e){}}
function select(it){sel=it;items.forEach(i=>i.mesh.userData.sp.visible=i===it);sync()}
let tt;function toast(m,w){const e=$('toast');e.textContent=m;e.className=w?'w':'';e.style.display='block';clearTimeout(tt);tt=setTimeout(()=>e.style.display='none',5500)}
const WHY={out:'за границей участка',overlap:'это место занято',dist:'бассейн должен быть минимум в 3,5 м от дома'};
function add(k,x,z,o){const it=Object.assign({id:++uid,type:k,x:0,z:0,a:0,s:1,fl:1,st:'modern',mt:null,c1:null,c2:null,tr:0},o||{});it.mesh=build(k,it.fl,it.st,it.mt,it.c1,it.c2,it.tr);it.mesh.userData.id=it.id;
const p=near(it,x||0,z||0,it.a,it.s);if(!p){toast('На участке не осталось места для этого объекта.',1);return null}
items.push(it);S.add(it.mesh);commit(it,p[0],p[1]);select(it);total();applyStage();return it}
function setTf(it,a,s){let x=it.x,z=it.z;if(check(it,x,z,a,s)){const p=near(it,x,z,a,s);if(!p){toast('Нет места для такого размера или угла.',1);sync();return false}x=p[0];z=p[1];toast('Объект сдвинут, чтобы поместиться.')}
it.a=a;it.s=s;commit(it,x,z);sync();total();return true}
function chipsState(){const h=house();if(!h)return;Q('#trc button').forEach((b,i)=>b.className=i===(h.tr||0)?'on':'');$('f1').className=h.fl===1?'on':'';$('f2').className=h.fl===2?'on':'';Q('#schips button').forEach(b=>b.className=b.dataset.k===h.st?'on':'');$('sdesc').textContent=(STY[h.st]||{}).d||'';Q('#mchips button').forEach(b=>b.className=+b.dataset.i===curModel?'on':'');Q('#mtchips button').forEach(b=>b.className=(b.dataset.k||'')===(h.mt||'')?'on':'');Q('#mats .card').forEach(c=>c.classList.toggle('sel',(c.dataset.k||'')===(h.mt||'')))}
function rebuild(){const h=house();if(h)rebuildItem(h)}
$('f1').onclick=()=>{const h=house();if(h){h.fl=1;rebuild()}};$('f2').onclick=()=>{const h=house();if(h){h.fl=2;rebuild()}};
Object.keys(STY).forEach(k=>{const b=document.createElement('button');b.textContent=STY[k].n;b.dataset.k=k;b.onclick=()=>{const h=house();if(h){h.st=k;h.c1=null;h.c2=null;rebuild()}};$('schips').appendChild(b)});
