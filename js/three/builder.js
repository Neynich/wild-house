/* Сборка 3D-мешей из описаний */
function polyMesh(p){const cols=[],grp=[];p.faces.forEach(f=>{let ci=cols.indexOf(f.c);if(ci<0){ci=cols.length;cols.push(f.c);grp.push([])}const v=f.v,tr=v.length===4?[[v[0],v[1],v[2]],[v[0],v[2],v[3]]]:[v];tr.forEach(a=>a.forEach(q=>grp[ci].push(q[0],q[1],q[2])))});
const g=new T.BufferGeometry();let all=[],start=0;grp.forEach((a,i)=>{g.addGroup(start/3,a.length/3,i);all=all.concat(a);start+=a.length});g.setAttribute('position',new T.Float32BufferAttribute(all,3));g.computeVertexNormals();
const m=new T.Mesh(g,cols.map(c=>new T.MeshStandardMaterial({color:c,roughness:.7,flatShading:true,side:T.DoubleSide})));m.castShadow=m.receiveShadow=true;return m}
function mk3(list){const g=new T.Group();list.forEach(p=>{
if(p.t==='B'){const m=bx(p.w,p.h,p.d,p.c,p.x,p.y,p.z);if(p.a){m.material.transparent=true;m.material.opacity=p.a;m.material.roughness=.15}g.add(m)}
else if(p.t==='C')g.add(cyl(p.r,p.h,p.c,p.x,p.y,p.z));
else if(p.t==='O')g.add(ball(p.r,p.c,p.x,p.y,p.z));
else if(p.t==='G'){const m=gable(p.len,p.span,p.rise,p.ov,p.y,p.z,p.cap,p.roof);m.position.x=p.x;g.add(m)}
else if(p.t==='P')g.add(polyMesh(p));
else if(p.t==='U'){const m=new T.Mesh(new T.ConeGeometry(p.r,.5,8),mat(p.c));m.position.set(p.x,p.y+.25,p.z);m.castShadow=true;g.add(m)}
else if(p.t==='SP'){const pg=new T.Group();pg.position.y=.95;pg.rotation.x=-.5;const pw=p.w/2-.06;
[-1,1].forEach(s=>{const x=s*p.w/4;pg.add(bx(pw,.08,p.d,p.f,x,0,0));pg.add(bx(pw-.12,.1,p.d-.12,p.c,x,0,0));[-1,0,1].forEach(i=>pg.add(bx(.03,.11,p.d-.12,sh(p.c,1.7),x+i*pw/4,0,0)));pg.add(bx(pw-.12,.11,.03,sh(p.c,1.7),x,0,0))});
g.add(pg);[-1,1].forEach(s=>{g.add(cyl(.05,.6,0x777777,s*p.w*.25,0,-p.d*.35));g.add(cyl(.05,1.25,0x777777,s*p.w*.25,0,p.d*.35))})}});return g}
function build(k,fl,st,mt,c1,c2,tr){const t=TYPES[k],g=mk3(spec({type:k,fl,st,mt,c1,c2,tr},3));
const sp=new T.Mesh(new T.PlaneGeometry(t.w+.8,t.d+.8),new T.MeshBasicMaterial({color:0xFFC83D,transparent:true,opacity:.5}));
sp.rotation.x=-Math.PI/2;sp.position.y=.1;sp.visible=false;sp.raycast=()=>{};g.add(sp);g.userData.sp=sp;return g}
