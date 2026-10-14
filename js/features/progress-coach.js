/* Прогресс, подсказки, калькулятор */
/* ---- progress, coach, extras ---- */
const PGS=[['catalog','Модель'],['materials','Материал'],['land','Земля'],['map','Конструктор'],['aid','AI-дизайн'],['consult','Заявка']],pgDone={};
function pg(k){if(k)pgDone[k]=1;const cur=PGS.findIndex(x=>!pgDone[x[0]]);$('pg').innerHTML=PGS.map((x,i)=>'<a href="#'+x[0]+'" class="'+(pgDone[x[0]]?'d':i===cur?'c':'')+'">'+(pgDone[x[0]]?'✓ ':(i+1)+'. ')+x[1]+'</a>').join('')}
$('rnd').onclick=()=>{const h=house();if(!h)return;const r=a=>a[Math.floor(Math.random()*a.length)];h.st=r(Object.keys(STY));h.mt=r(Object.keys(MATS));h.c1=null;h.c2=null;rebuild();setTod(r(['day','sunset','night']));setStage(3);note('Случайный дом: стиль '+STY[h.st].n+', материал — '+MATS[h.mt].n.toLowerCase())};
$('coach').style.display=LS.g('wh_coach',false)?'none':'flex';
function coachOff(){$('coach').style.display='none';LS.s('wh_coach',true)}
$('coachx').onclick=coachOff;$('coachc').onclick=coachOff;[$('c'),$('c2')].forEach(el=>el.addEventListener('pointerdown',()=>{if($('coach').style.display!=='none')coachOff()}));
const rws=['СВОЙ ДОМ','СВОЙ УЮТ','СВОЙ САД','СВОЮ БАНЮ','СВОЙ БАССЕЙН'];let rwi=0;
setInterval(()=>{const e=$('rw');e.classList.add('o');setTimeout(()=>{rwi=(rwi+1)%rws.length;e.textContent=rws[rwi];e.classList.remove('o')},350)},2600);
addEventListener('scroll',()=>{const d=document.documentElement,p=d.scrollTop/((d.scrollHeight-d.clientHeight)||1);$('sp').style.width=Math.min(100,p*100)+'%'},{passive:true});
let landAuto=true;
function calc(){if(landAuto)$('cc_land').value=landCost();const cost=buildCost(),land=+$('cc_land').value||0,tot=cost+land,dv=+$('cc_d').value,yv=+$('cc_y').value,rt=+$('cc_r').value||0;
$('cc_cost').textContent=fmt(cost);$('cc_dv').textContent=dv+'% ('+fmt(Math.round(tot*dv/100))+')';$('cc_yv').textContent=yv+' лет';
const loan=tot*(1-dv/100),r=rt/1200,n=yv*12,pay=r?loan*r/(1-Math.pow(1+r,-n)):loan/n;
$('pay').textContent=fmt(Math.round(pay/100)*100)+' / мес';$('paysub').textContent='Сумма кредита '+fmt(Math.round(loan/1e3)*1e3)+' · всего выплат '+fmt(Math.round(pay*n/1e4)*1e4)}
['cc_land','cc_d','cc_y','cc_r'].forEach(id=>$(id).oninput=calc);$('cc_land').addEventListener('input',()=>{landAuto=false});
