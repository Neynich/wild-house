/* Выбор модели дома */
function setModel(i,go){curModel=i;if(ready)pg('catalog');Q('#models .mc').forEach(c=>c.classList.toggle('sel',+c.dataset.i===i));const h=house();if(h)setTf(h,h.a,mScale(MODELS[i]));chipsState();refreshPrices();if(go){note('Выбрана модель '+MODELS[i].n+'. Теперь выберите землю.');$('land').scrollIntoView({behavior:'smooth'})}}
MODELS.forEach((m,i)=>{const b=document.createElement('button');b.textContent=m.n;b.dataset.i=i;b.onclick=()=>setModel(i);$('mchips').appendChild(b)});
[['Отдых и вода',['pool','spa','sauna','gazebo','pergola','lounge','bbq','pond','fountain']],['Хозяйство',['garage','carport','parking','shed','woodshed','greenhouse','veg','garden','coop','well']],['Гостям',['guest']],['Дети и спорт',['playground','court']],['Энергия',['solar','battery']]].forEach(g=>{const h=document.createElement('div');h.className='gl';h.textContent=g[0];$('pal').appendChild(h);const w=document.createElement('div');w.className='chips';g[1].forEach(k=>{const b=document.createElement('button');b.innerHTML=TYPES[k].n+'<small>'+fmt(TYPES[k].p)+'</small>';b.onclick=()=>add(k,0,6);w.appendChild(b)});$('pal').appendChild(w)});
$('rot').onclick=()=>{if(sel)setTf(sel,sel.a+Math.PI/12,sel.s)};
$('ang').oninput=e=>{if(sel)setTf(sel,e.target.value*Math.PI/180,sel.s)};
$('scl').oninput=e=>{if(sel)setTf(sel,sel.a,+e.target.value)};
$('del').onclick=()=>{if(!sel)return;if(sel.type==='house'){toast('Дом удалить нельзя — его можно переместить, повернуть и изменить размер.');return}
S.remove(sel.mesh);items=items.filter(i=>i!==sel);select(null);total()};
let th=.6,ph=1,rad=52,tvw=false,first=true;
const tgt={x:0,z:0},kv={};let cth=.6,cph=1,crad=52,ctx=0,ctz=0,camDirty=true,inertia=null,lastT=performance.now(),slow=0;
