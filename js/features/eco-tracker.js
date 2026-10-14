/* ECO SMART и трекер стройки */
/* ---- eco & tracker ---- */
const ECO={day:{t:22,sun:4.8,bat:74,use:1.2,w:140,air:'Отличное'},eve:{t:23,sun:.9,bat:81,use:2.4,w:210,air:'Хорошее'},night:{t:20,sun:0,bat:63,use:.6,w:30,air:'Отличное'}};
let tod='day';const SW=['Свет','Климат','Безопасность','Вода','Энергия'],swOn=[1,1,1,1,1],cm=v=>String(v).replace('.',',');
function ecoR(){const e=ECO[tod],use=Math.max(.2,e.use-(swOn[0]?0:.3)-(swOn[1]?0:.5));
$('e1').textContent=swOn[1]?e.t+' °C':'—';$('e2').textContent=swOn[4]?cm(e.sun)+' кВт':'0 кВт';$('e3').textContent=e.bat+' %';$('eb').style.width=e.bat+'%';$('e4').textContent=cm(use.toFixed(1))+' кВт';$('e5').textContent=swOn[3]?e.w+' л':'0 л';$('e6').textContent=e.air;
Q('#sws button').forEach((b,i)=>b.className='sw'+(swOn[i]?' on':''))}
SW.forEach((n,i)=>{const b=document.createElement('button');b.innerHTML='<span>'+n+'</span><i></i>';b.onclick=()=>{swOn[i]=swOn[i]?0:1;ecoR()};$('sws').appendChild(b)});
Q('#tod button').forEach(b=>b.onclick=()=>{tod=b.dataset.t;Q('#tod button').forEach(x=>x.className=x===b?'on':'');ecoR()});
const TR=['Проектирование','Фундамент','Стены','Кровля','Инженерия','Отделка','Благоустройство'];let trp=2;
function trR(){$('trk').innerHTML=TR.map((n,i)=>'<div class="r" data-i="'+i+'" style="cursor:pointer;align-items:center"><span>'+n+'</span><b style="color:'+(i<trp?'#2C7A4B':i===trp?'#C26A1B':'#8A948D')+'">'+(i<trp?'готово':i===trp?'в работе':'ожидает')+'</b></div>').join('')}
$('trk').onclick=e=>{const r=e.target.closest('[data-i]');if(r){trp=+r.dataset.i;trR()}};
