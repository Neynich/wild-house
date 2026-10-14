/* 3D-примитивы и кровли */
const mkR=o=>{try{if(T.__stub)throw 0;return new T.WebGLRenderer(o)}catch(e){return{noGL:true,setPixelRatio(){},setSize(){},render(){},shadowMap:{},localClippingEnabled:false}}};
const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.85});
function bx(w,h,d,c,x,y,z){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));m.position.set(x||0,(y||0)+h/2,z||0);m.castShadow=m.receiveShadow=true;return m}
const cyl=(r,h,c,x,y,z)=>{const m=new T.Mesh(new T.CylinderGeometry(r,r,h,16),mat(c));m.position.set(x,y+h/2,z);m.castShadow=true;return m};
const ball=(r,c,x,y,z)=>{const m=new T.Mesh(new T.SphereGeometry(r,18,12),mat(c));m.position.set(x,y,z);m.castShadow=true;return m};
function gable(len,span,rise,ov,y,z,capC,roofC){const sh=new T.Shape();sh.moveTo(-(span/2+ov),0);sh.lineTo(span/2+ov,0);sh.lineTo(0,rise);sh.closePath();
const eg=new T.ExtrudeGeometry(sh,{depth:len+2*ov,bevelEnabled:false});eg.translate(0,0,-(len/2+ov));eg.rotateY(Math.PI/2);
const m=new T.Mesh(eg,[new T.MeshStandardMaterial({color:capC,roughness:.8}),new T.MeshStandardMaterial({color:roofC,roughness:.65,flatShading:true})]);m.position.set(0,y,z);m.castShadow=m.receiveShadow=true;return m}
const sh=(c,k)=>((Math.min(255,(c>>16&255)*k|0))<<16)|((Math.min(255,(c>>8&255)*k|0))<<8)|Math.min(255,(c&255)*k|0);
const hipF=(cx,cz,len,span,y0,rise,c)=>{const r=Math.max(0,(len-span)/2),x0=cx-len/2,x1=cx+len/2,z0=cz-span/2,z1=cz+span/2,yr=y0+rise,A=[x0,y0,z0],B2=[x1,y0,z0],C2=[x1,y0,z1],D=[x0,y0,z1],E=[cx-r,yr,cz],F=[cx+r,yr,cz];return[{v:[D,C2,F,E],c},{v:[B2,A,E,F],c},{v:[C2,B2,F],c},{v:[A,D,E],c}]};
const shedF=(cx,cz,len,span,y0,rise,c,cw)=>{const x0=cx-len/2,x1=cx+len/2,z0=cz-span/2,z1=cz+span/2,yt=y0+rise,A=[x0,y0,z0],B2=[x1,y0,z0],C2=[x1,y0,z1],D=[x0,y0,z1],E=[x0,yt,z0],F=[x1,yt,z0];return[{v:[D,C2,F,E],c},{v:[A,B2,F,E],c:cw},{v:[A,D,E],c:cw},{v:[B2,C2,F],c:cw}]};
const LBL={house:['Стены','Крыша'],pool:['Вода','Бортик'],sauna:['Дерево','Крыша'],garage:['Стены','Ворота'],bbq:['Мангал','Зонтик'],garden:['Цветы','Листва'],solar:['Панели','Рамы'],spa:['Стены','Крыша'],gazebo:['Дерево','Крыша'],pond:['Вода','Камни'],carport:['Крыша','Опоры'],shed:['Стены','Крыша'],greenhouse:['Стекло','Каркас'],playground:['Каркас','Горка и качели'],court:['Покрытие','Разметка'],battery:['Корпус','Панель'],veg:['Грядки','Растения'],pergola:['Дерево','Зелень'],well:['Камень','Крыша'],woodshed:['Дерево','Крыша'],coop:['Домик','Крыша'],fountain:['Камень','Вода'],guest:['Стены','Крыша'],lounge:['Настил','Зонт'],parking:['Машина 1','Машина 2']};
