/* Запись на консультацию и обращения в поддержку */
/* booking & support */
$('bk_t').innerHTML=['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].map(s=>'<option>'+s+'</option>').join('');
$('bk_d').min=new Date().toISOString().slice(0,10);
Q('#bkk button').forEach(b=>b.onclick=()=>{Q('#bkk button').forEach(x=>x.className='');b.className='on'});
$('bk_go').onclick=()=>{const n=$('bk_n').value.trim(),p=$('bk_p').value.trim(),d=$('bk_d').value;
if(!n){note('Введите имя');return}if(!okPhone(p)){note('Введите телефон полностью');return}if(!d){note('Выберите дату');return}
const kind=document.querySelector('#bkk .on').dataset.v,dd=d.split('-').reverse().join('.');
rec('bookings',{kind,name:n,phone:p,date:dd,time:$('bk_t').value,note:$('bk_c').value.trim(),project:snapshot().title});pg('consult');confetti();note('Вы записаны на '+dd+' в '+$('bk_t').value+' ('+kind+'). Для быстрого ответа звоните: 8 (999) 977-74-39');$('bk_c').value=''};
$('sp_go').onclick=()=>{const p=$('sp_p').value.trim(),m=$('sp_m').value.trim();if(!okPhone(p)){note('Введите телефон полностью');return}if(!m){note('Опишите вопрос');return}
rec('tickets',{topic:$('sp_t').value,name:$('sp_n').value.trim(),phone:p,msg:m});$('sp_m').value='';note('Обращение сохранено. Для срочных вопросов звоните: 8 (999) 977-74-39')};
