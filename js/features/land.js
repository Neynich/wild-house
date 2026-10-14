/* Выбор района и участка */
/* ---- land ---- */
const LOCS=[
{n:'Барвиха',a:'Одинцовский г.о.',h:'Рублёво-Успенское шоссе',lo:37.30,la:55.73},
{n:'Истра',a:'Истринский г.о.',h:'Новорижское шоссе',lo:36.86,la:55.91},
{n:'Солнечногорск',a:'Солнечногорский г.о.',h:'Ленинградское шоссе',lo:36.98,la:56.18},
{n:'Дмитров',a:'Дмитровский г.о.',h:'Дмитровское шоссе',lo:37.53,la:56.34},
{n:'Сергиев Посад',a:'Сергиево-Посадский г.о.',h:'Ярославское шоссе',lo:38.12,la:56.31},
{n:'Пушкино',a:'Пушкинский г.о.',h:'Ярославское шоссе',lo:37.85,la:56.01},
{n:'Щёлково',a:'г.о. Щёлково',h:'Щёлковское шоссе',lo:38.00,la:55.92},
{n:'Раменское',a:'Раменский г.о.',h:'Новорязанское шоссе',lo:38.23,la:55.57},
{n:'Коломна',a:'г.о. Коломна',h:'Новорязанское шоссе',lo:38.85,la:55.08},
{n:'Домодедово',a:'г.о. Домодедово',h:'Каширское шоссе',lo:37.75,la:55.44},
{n:'Подольск',a:'г.о. Подольск',h:'Варшавское шоссе',lo:37.55,la:55.43},
{n:'Чехов',a:'г.о. Чехов',h:'Симферопольское шоссе',lo:37.47,la:55.14},
{n:'Наро-Фоминск',a:'Наро-Фоминский г.о.',h:'Киевское шоссе',lo:36.72,la:55.39},
{n:'Кубинка',a:'Одинцовский г.о.',h:'Минское шоссе',lo:36.70,la:55.58},
{n:'Волоколамск',a:'Волоколамский г.о.',h:'Волоколамское шоссе',lo:35.95,la:56.03}];
LOCS.forEach(L=>{L.km=Math.round(Math.hypot((L.lo-37.62)*62.5,(L.la-55.75)*111)/5)*5});
const DIRK={'Рублёво-Успенское шоссе':4.5,'Новорижское шоссе':1.9,'Ленинградское шоссе':1.3,'Дмитровское шоссе':1,'Ярославское шоссе':1.05,'Щёлковское шоссе':.95,'Новорязанское шоссе':.8,'Каширское шоссе':.8,'Варшавское шоссе':.95,'Симферопольское шоссе':.8,'Киевское шоссе':.85,'Минское шоссе':1.4,'Волоколамское шоссе':.7};
LOCS.forEach(L=>{L.dk=DIRK[L.h]||1;L.lp=Math.round(1e6*L.dk*Math.pow(.5,L.km/45)/1e4)*1e4;L.rk=L.dk>=3?1.15:L.dk>=1.5?1.06:L.km>95?.98:1});
const OB=[[35.15,56.1],[35.6,56.4],[36.5,56.55],[37.0,56.75],[37.4,56.95],[37.9,56.85],[38.4,56.6],[38.7,56.45],[38.9,56.2],[39.1,55.9],[39.65,55.65],[39.9,55.45],[39.5,55.1],[39.2,54.8],[38.8,54.45],[38.2,54.3],[37.7,54.35],[37.3,54.6],[36.9,54.9],[36.6,55.1],[36.0,55.15],[35.5,55.3],[35.2,55.6],[35.1,55.85]];
const MX=lo=>15+(lo-34.9)*125,MY=la=>15+(57.1-la)*222,CX=MX(37.62),CY=MY(55.75);
let loc=1,maxKm=130;
const trip=km=>{const m=Math.round(km*1.3/5)*5,h=Math.floor(m/60);return(h?h+' ч ':'')+(m%60?m%60+' мин':'')};
function drawLand(){let s='<svg viewBox="0 0 700 660" role="img" aria-label="Схема Московской области"><polygon points="'+OB.map(p=>MX(p[0])+','+MY(p[1])).join(' ')+'" fill="#E4E9D6" stroke="#9BA68A" stroke-width="2"/>';
s+='<circle cx="'+CX+'" cy="'+CY+'" r="'+maxKm*2+'" fill="#C26A1B" fill-opacity=".06" stroke="#C26A1B" stroke-dasharray="6 6" stroke-opacity=".5"/><circle cx="'+CX+'" cy="'+CY+'" r="36" fill="#CFD6BE" stroke="#7C8870"/>';
s+='<text x="'+CX+'" y="'+(CY+4)+'" text-anchor="middle" font-size="12" font-weight="700" fill="#17261D">Москва</text>';
const sl=LOCS[loc];if(sl.km<=maxKm)s+='<line x1="'+CX+'" y1="'+CY+'" x2="'+MX(sl.lo)+'" y2="'+MY(sl.la)+'" stroke="#C26A1B" stroke-width="2" stroke-dasharray="5 5"/>';
LOCS.forEach((L,i)=>{const x=MX(L.lo),y=MY(L.la),on=i===loc,ok=L.km<=maxKm;
s+='<g class="pt" data-i="'+i+'" opacity="'+(ok?1:.25)+'"><title>'+L.n+' · ≈'+L.km+' км</title>'+(on&&ok?'<circle class="pulse" cx="'+x+'" cy="'+y+'" r="10" fill="#C26A1B"/>':'')+'<circle cx="'+x+'" cy="'+y+'" r="20" fill="transparent"/><circle class="dot" cx="'+x+'" cy="'+y+'" r="'+(on?10:6)+'" fill="#C26A1B" stroke="#fff" stroke-width="'+(on?3:2)+'"/><text x="'+(x+13)+'" y="'+(y+4)+'" font-size="'+(on?14:12)+'" font-weight="'+(on?700:500)+'" fill="#17261D" stroke="#F8F5EC" stroke-width="3" paint-order="stroke">'+L.n+'</text></g>'});
$('lm').innerHTML=s+'</svg>'}
function info(){const L=LOCS[loc];$('mapinfo').textContent='Участок: '+L.n+', '+L.a+' · '+Math.round(PW*PD/100)+' соток ('+PW+'×'+PD+' м)'}
function pick(i){loc=i;if(ready)pg('land');const L=LOCS[i];drawLand();$('ln').textContent=L.n;$('ld').innerHTML=L.a+'<br>'+L.h+'<br>≈ '+L.km+' км от центра Москвы по прямой · в пути ≈ '+trip(L.km);
$('lc').innerHTML='';LOCS.forEach((q,j)=>{const b=document.createElement('button');b.textContent=q.n;b.className=j===i?'on':'';b.disabled=q.km>maxKm;b.onclick=()=>pick(j);$('lc').appendChild(b)});
$('lcnt').textContent='Подходящих районов: '+LOCS.filter(q=>q.km<=maxKm).length+' из '+LOCS.length;info();try{total();refreshPrices()}catch(e){}}
function landInfo(){const L=LOCS[loc];$('lpr').innerHTML='<b>Земля:</b> ≈ '+fmt(L.lp)+' за сотку · '+Math.round(sotN())+' соток ≈ <b>'+mln(landCost())+'</b><br><b>Строительство:</b> коэффициент района ×'+String(L.rk).replace('.',',')+'<br><span class="m" style="font-size:12px">Цены ориентировочные: точные назовёт менеджер.</span>'}
function refreshPrices(){const L=LOCS[loc],h=house(),mk=h&&h.mt&&MATS[h.mt]?MATS[h.mt].n:null;
Q('#models .pr2').forEach(e=>{e.textContent='от '+mln(mprice(MODELS[+e.dataset.p]))});
$('pcap').textContent='Цены посчитаны для района «'+L.n+'» (коэффициент ×'+String(L.rk).replace('.',',')+')'+(mk?' и материала «'+mk.toLowerCase()+'»':' и газобетона по умолчанию')+'. Они изменятся, если выбрать другой район или материал.';
Q('#mats .mp').forEach(e=>{const m=MATS[e.dataset.k],M=MODELS[curModel];e.textContent=M.n+' в районе «'+L.n+'»: '+mln(Math.round(RATE*L.rk*M.a*m.k/1e4)*1e4)+' (×'+m.k.toFixed(2).replace('.',',')+')'});
try{qUpd()}catch(e){}}
function setPlotDims(w,d){PW=snap(clamp(w,15,90));PD=snap(clamp(d,15,90));mkPlot();
items.slice().forEach(it=>{if(check(it,it.x,it.z,it.a,it.s)){const p=near(it,it.x,it.z,it.a,it.s);if(p)commit(it,p[0],p[1]);else{S.remove(it.mesh);items=items.filter(i=>i!==it);toast('Объект «'+nm(it)+'» не поместился и убран.',1)}}});
if(sel&&!items.includes(sel))select(null);total();fitRad();upd();info();$('mw1').value=PW;$('md1').value=PD;mkFinish();if(typeof fenceUI==='function'&&$('fnc').children.length)fenceUI()}
function setPlot(n){const w=Math.sqrt(n*100*4/3);setPlotDims(w,w*.75);Q('#ps button').forEach(b=>b.className=+b.dataset.n===n?'on':'')}
[6,8,10,12,15,20].forEach(v=>{const b=document.createElement('button');b.textContent=v+' соток';b.dataset.n=v;b.onclick=()=>setPlot(v);$('ps').appendChild(b)});
$('mine').onclick=()=>{const e=$('myp');e.style.display=e.style.display==='block'?'none':'block'};
$('mok').onclick=()=>{setPlotDims(+$('mw1').value||40,+$('md1').value||30);Q('#ps button').forEach(b=>b.className='');note('Размеры вашего участка применены: '+PW+'×'+PD+' м')};
$('kmr').oninput=e=>{maxKm=+e.target.value;$('kmv').textContent=maxKm>=130?'любое расстояние':'≈ '+maxKm+' км';pick(loc)};
$('lm').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(g&&LOCS[+g.dataset.i].km<=maxKm)pick(+g.dataset.i)});
