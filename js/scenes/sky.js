/* Небо, звёзды, облака, фонари */
/* ---- небо, звёзды, облака, фонари ---- */
const SKYTOP={day:0x86B8E6,sunset:0x5F78B8,night:0x04070F};
const skyU={top:{value:new T.Color(0x86B8E6)},hor:{value:new T.Color(0xCFE3EE)},sunDir:{value:new T.Vector3(.5,.8,.3).normalize()},sunCol:{value:new T.Color(0xfff2dd)},sunK:{value:1}};
const followCam=function(r,s,c){this.position.copy(c.position);this.updateMatrixWorld()};
const sky=new T.Mesh(new T.SphereGeometry(400,32,18),new T.ShaderMaterial({uniforms:skyU,side:T.BackSide,depthWrite:false,fog:false,
vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform vec3 top;uniform vec3 hor;uniform vec3 sunCol;uniform vec3 sunDir;uniform float sunK;varying vec3 vP;void main(){vec3 d=normalize(vP);float h=clamp(d.y,0.,1.);vec3 c=mix(hor,top,pow(h,.55));float s=max(dot(d,sunDir),0.);c+=sunCol*(pow(s,900.)*1.6+pow(s,14.)*.22)*sunK;gl_FragColor=vec4(c,1.);}'}));
sky.renderOrder=-10;sky.frustumCulled=false;sky.onBeforeRender=followCam;S.add(sky);
const starPts=[];{let q=12345;const rr=()=>(q=(q*16807)%2147483647)/2147483647;for(let i=0;i<420;i++){const a=rr()*6.2832,e=.08+rr()*1.3,r=380;starPts.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r)}}
const starG=new T.BufferGeometry();starG.setAttribute('position',new T.Float32BufferAttribute(starPts,3));
const stars=new T.Points(starG,new T.PointsMaterial({color:0xffffff,size:1.8,sizeAttenuation:false,fog:false,transparent:true,opacity:.9,depthWrite:false}));
stars.visible=false;stars.frustumCulled=false;stars.renderOrder=-9;stars.onBeforeRender=followCam;S.add(stars);
const cloudMat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,fog:false,depthWrite:false});
const lampMat=new T.MeshBasicMaterial({color:0xC9CCCF});
function skyTod(k){const t=TOD[k];skyU.hor.value.setHex(t.bg);skyU.top.value.setHex(SKYTOP[k]||SKYTOP.day);skyU.sunCol.value.setHex(k==='night'?0xCFDDFF:k==='sunset'?0xFFB070:0xFFF2DD);skyU.sunDir.value.set(t.sp[0],t.sp[1],t.sp[2]).normalize();skyU.sunK.value=k==='night'?.6:1;stars.visible=k==='night';cloudMat.color.setHex(k==='night'?0x56658A:k==='sunset'?0xFFD3B8:0xFFFFFF);lampMat.color.setHex(k==='night'?0xFFE2A0:0xC9CCCF);fill.intensity=k==='night'?.18:k==='sunset'?.2:.28}
