/* 3D-сцена конструктора */
/* ---- map scene ---- */
let PW=40,PD=30,curModel=2;
const mw=$('mw'),cv=$('c');
const R=mkR({canvas:cv,antialias:true,powerPreference:'high-performance'});R.localClippingEnabled=true;let curPR=Math.min(devicePixelRatio||1,2);R.setPixelRatio(curPR);R.shadowMap.enabled=true;try{R.shadowMap.type=T.PCFSoftShadowMap}catch(e){}
const S=new T.Scene();S.background=new T.Color(0xCFE3EE);S.fog=new T.Fog(0xCFE3EE,140,340);
const cam=new T.PerspectiveCamera(45,1,.5,520);
const hemi=new T.HemisphereLight(0xffffff,0x88aa77,.75);S.add(hemi);
const sun=new T.DirectionalLight(0xfff2dd,.9);sun.position.set(25,40,15);sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:160});const SMAP=(window.matchMedia&&matchMedia('(hover:none)').matches)?2048:4096;sun.shadow.mapSize.set(SMAP,SMAP);sun.shadow.bias=-.0003;sun.shadow.normalBias=.05;S.add(sun);
const fill=new T.DirectionalLight(0xBFD8FF,.28);fill.position.set(-30,22,-26);S.add(fill);
