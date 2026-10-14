/* Итоговый вид и AI-дизайн */
/* ---- final view & AI design ---- */
let stage=3,tod2='day',landOn=true,lampL=[];
const TOD={day:{bg:0xCFE3EE,h:.75,sc:0xfff2dd,si:.9,sp:[25,40,15],lamp:0},sunset:{bg:0xF2B28C,h:.55,sc:0xFF9A55,si:1,sp:[-45,14,22],lamp:.6},night:{bg:0x0E1A2B,h:.22,sc:0x7C97CF,si:.3,sp:[10,40,10],lamp:1.6}};
const clipP=new T.Plane(new T.Vector3(0,-1,0),9999),finG=new T.Group();S.add(finG);
function applyStage(){const h=house();if(!h)return;const F=h.fl===2?2:1,top=stage===0?.45:stage===1?.45+3.2*F:9999;clipP.constant=top*h.s;
h.mesh.traverse(o=>{if(o.material)[].concat(o.material).forEach(m=>{if(m.isMeshStandardMaterial){m.clippingPlanes=stage<2?[clipP]:null;m.clipShadows=true;m.needsUpdate=true}})});
items.forEach(i=>{if(i.type!=='house')i.mesh.visible=stage===3});if(sel&&!sel.mesh.visible)select(null)}
function finPts(){const pts=[];for(let x=-PW/2-1.5;x<=PW/2+1.5;x+=5)pts.push([x,-PD/2-2]);for(let z=-PD/2+2;z<=PD/2-2;z+=5){pts.push([-PW/2-2,z]);pts.push([PW/2+2,z])}return pts}
function mkFinish(){while(finG.children.length)finG.remove(finG.children[0]);if(stage<3||!landOn)return;
const pts=finPts();
pts.forEach((q,i)=>{const sc=.9+((i*37)%10)/25;finG.add(cyl(.18*sc,1.6*sc,0x6B4A2F,q[0],0,q[1]));finG.add(ball(1.2*sc,i%3?0x3E8A3E:0x2F7A38,q[0],2.5*sc,q[1]));finG.add(ball(.85*sc,0x4FA04A,q[0]+.5*sc,2*sc,q[1]+.3))});
finG.add(bx(4,.05,4,0xB9B5AA,0,.06,PD/2-.5))}
function setTod(k){tod2=k;const t=TOD[k];try{skyTod(k)}catch(e){}S.background.setHex(t.bg);S.fog.color.setHex(t.bg);hemi.intensity=t.h;sun.color.setHex(t.sc);sun.intensity=t.si;sun.position.set(t.sp[0],t.sp[1],t.sp[2]);lamps(t.lamp);finState()}
function lamps(i){lampL.forEach(l=>S.remove(l));lampL=[];if(!i)return;items.forEach(it=>{if(['house','sauna','garage','pool'].includes(it.type)){const hs=it.type==='house',l=new T.PointLight(it.type==='pool'?0x62D3FF:0xFFD9A0,i*(hs?1.4:.8),hs?26:14);l.position.set(it.x,hs?3:2,it.z);S.add(l);lampL.push(l)}})}
function setStage(i){stage=i;applyStage();mkFinish();finState()}
function finState(){Q('#stg button').forEach(b=>b.className=+b.dataset.i===stage?'on':'');Q('#tdc button').forEach(b=>b.className=b.dataset.k===tod2?'on':'');$('lsb').className=landOn?'on':'';$('lsb').textContent='Озеленение: '+(landOn?'вкл':'выкл')}
['Фундамент','Стены','Кровля','Готовый дом'].forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;b.dataset.i=i;b.onclick=()=>setStage(i);$('stg').appendChild(b)});
[['day','День'],['sunset','Закат'],['night','Ночь']].forEach(t=>{const b=document.createElement('button');b.textContent=t[1];b.dataset.k=t[0];b.onclick=()=>setTod(t[0]);$('tdc').appendChild(b)});
$('lsb').onclick=()=>{landOn=!landOn;mkFinish();finState()};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let aiLife='Семья с детьми',aiMood='Тёплое и уютное';
[['aiLife',v=>aiLife=v],['aiMood',v=>aiMood=v]].forEach(g=>Q('#'+g[0]+' button').forEach(b=>b.onclick=()=>{Q('#'+g[0]+' button').forEach(x=>x.className='');b.className='on';g[1](b.dataset.v)}));
const FBM={'Тёплое и уютное':{style:'classic',material:'brus',palette:['#F3E6C8','#9C4A32','#8B5A33','#5A3A22'],tod:'sunset',concept:'Тёплый дом из клеёного бруса с терракотовой крышей и широким крыльцом. Вечером окна светятся мягким светом.'},
'Строгое современное':{style:'modern',material:'aero',palette:['#F1EBDD','#3E4249','#A9794B','#2E3238'],tod:'day',concept:'Чистые линии, светлый фасад и графитовая крыша. Панорамные окна впускают много света.'},
'Природное':{style:'forest',material:'log',palette:['#93A383','#4A3B2E','#6F4E37','#2F3A2C'],tod:'day',concept:'Дом из бревна в мягких зелёных тонах, как будто вырос среди деревьев. Много дерева и живой зелени.'},
'Премиальное':{style:'luxury',material:'stone',palette:['#EDE6D8','#1E1F23','#C9A15A','#111214'],tod:'night',concept:'Каменный фасад, чёрная крыша и золотистые акценты. Вечерняя подсветка делает дом эффектным.'}};
const FBL={'Семья с детьми':{i:['Просторная кухня-гостиная, из которой виден двор','Детская рядом со спальней родителей','Игровая зона и кладовая для вещей'],l:['Безопасная лужайка и детская зона','Мягкие дорожки без острых углов']},
'Отдых и гости':{i:['Большая гостиная с выходом на террасу','Гостевая спальня с отдельной ванной','Кухня с островом для общения'],l:['Терраса, BBQ-зона и баня','Подсветка дорожек для вечеров']},
'Тишина и минимализм':{i:['Светлые открытые пространства без лишних деталей','Встроенные шкафы вместо лишней мебели','Кабинет с видом на сад'],l:['Сдержанный сад с декоративными травами','Один акцент: бассейн или зона у воды']},
'Эко и энергонезависимость':{i:['Тёплые натуральные материалы в отделке','Большие окна для естественного света','Техническая комната для ECO SMART'],l:['Солнечные панели в зоне без тени','Сад с неприхотливыми растениями']}};
function fallbackAI(wish){const m=FBM[aiMood]||FBM['Тёплое и уютное'],l=FBL[aiLife]||FBL['Семья с детьми'];return Object.assign({title:aiMood+' · '+aiLife,interior:l.i,landscape:l.l,lighting:'Тёплая подсветка фасада и дорожек.'},m,{concept:m.concept+(wish?' Учли ваше пожелание: '+wish+'.':'')})}
function showAI(r,fb){const h=house(),st=STY[r.style]?r.style:'modern',mt=MATS[r.material]?r.material:null;
pg('aid');if(h){h.st=st;h.mt=mt;h.c1=null;h.c2=null;rebuild()}stage=3;applyStage();mkFinish();setTod(TOD[r.tod]?r.tod:'sunset');
const pal=(Array.isArray(r.palette)?r.palette:[]).filter(c=>/^#[0-9a-fA-F]{6}$/.test(c)).slice(0,5),ls=a=>(Array.isArray(a)?a:[]).slice(0,4).map(x=>'<li>'+esc(x)+'</li>').join('');
$('aiRes').innerHTML='<div class="eyebrow">'+(fb?'Типовая концепция':'Концепция WILD AI')+'</div><div class="h" style="font-size:22px">'+esc(r.title||'Ваш дом')+'</div><p class="m" style="margin:10px 0 14px">'+esc(r.concept||'')+'</p>'
+'<div style="display:flex;gap:8px;margin-bottom:14px">'+pal.map(c=>'<span title="'+c+'" style="width:44px;height:44px;border-radius:12px;background:'+c+';border:1px solid #0002"></span>').join('')+'</div>'
+'<b>Фасад</b><p class="m" style="margin:4px 0 12px">Стиль '+STY[st].n+(mt?', материал: '+MATS[mt].n.toLowerCase():'')+'</p>'
+'<b>Интерьер</b><ul class="m" style="margin:4px 0 12px;padding-left:20px">'+ls(r.interior)+'</ul><b>Участок</b><ul class="m" style="margin:4px 0 12px;padding-left:20px">'+ls(r.landscape)+'</ul>'
+(r.lighting?'<b>Свет</b><p class="m" style="margin:4px 0 14px">'+esc(r.lighting)+'</p>':'')
+'<a href="#map" class="btn p" style="display:block">Смотреть готовый дом в 3D</a>'+(fb?'<p class="m" style="font-size:12px;margin-top:10px">Умный подбор через WILD AI недоступен в этом окне, показан типовой вариант.</p>':'')}
$('aiGo').onclick=async()=>{const b=$('aiGo'),h=house(),L=LOCS[loc],wish=$('aiWish').value.trim().slice(0,300);b.disabled=true;b.textContent='Дизайнер работает…';let r=null,fb=false;
const list=items.filter(i=>i.type!=='house').map(i=>TYPES[i.type].n).join(', ')||'нет';
const q='Ты дизайнер домов WILD HOUSE. Составь концепцию готового дома по проекту клиента. Проект: район '+L.n+', участок '+Math.round(PW*PD/100)+' соток, дом '+(h?Math.round(180*h.s*h.s):180)+' м², '+(h&&h.fl===2?2:1)+' этаж(а), объекты на участке: '+list+'. Образ жизни: '+aiLife+'. Настроение: '+aiMood+'. Пожелания клиента: '+(wish||'нет')+'. Верни ТОЛЬКО JSON без пояснений: {"title":"короткое название концепции","concept":"2-3 предложения о том, как дом выглядит после стройки","style":"одно из modern|forest|luxury|classic|minimal","material":"одно из brus|log|brick|aero|sip|stone","palette":["#hex","#hex","#hex","#hex"],"interior":["3 коротких пункта"],"landscape":["2-3 коротких пункта"],"lighting":"одно предложение","tod":"одно из day|sunset|night"}';
try{const C=window.claude,sm=C&&C.use?await C.use('sample'):null;if(!sm)throw 0;r=await sm.json(q,{modelTier:'quick',cache:false})}catch(e){r=null}
if(!r||typeof r!=='object'||Array.isArray(r)){r=fallbackAI(wish);fb=true}
showAI(r,fb);b.disabled=false;b.textContent='Создать AI-дизайн ещё раз';confetti();$('aiRes').scrollIntoView({behavior:'smooth',block:'nearest'})};
