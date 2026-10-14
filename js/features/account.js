/* Аккаунт, кабинет, формы */
/* ---- account, cabinet, forms ---- */
let amode='reg',acb=null;
const user=()=>LS.g('wh_u',null),logged=()=>!!LS.g('wh_in',false)&&!!user();
function prefill(){const u=logged()?user():null;if(!u)return;[['bk_n','bk_p'],['sp_n','sp_p']].forEach(p=>{if(!$(p[0]).value)$(p[0]).value=u.name;if(!$(p[1]).value)$(p[1]).value=u.phone})}
function accUpd(){$('acc').textContent=logged()?(user().name.split(' ')[0]||'Кабинет'):'Войти';prefill()}
function setMode(m){amode=m;$('t_reg').className=m==='reg'?'on':'';$('t_in').className=m==='in'?'on':'';$('au_r').style.display=m==='reg'?'block':'none';$('au_h').textContent=m==='reg'?'Создайте кабинет':'Вход в кабинет';$('au_go').textContent=m==='reg'?'Создать кабинет':'Войти'}
function openAuth(msg,cb){acb=cb||null;setMode('reg');$('au_s').textContent=msg||'Сохраняйте проекты, записывайтесь на консультации и оформляйте заявки.';$('au').classList.add('on')}
$('t_reg').onclick=()=>setMode('reg');$('t_in').onclick=()=>setMode('in');$('au_x').onclick=()=>$('au').classList.remove('on');
$('au_go').onclick=()=>{const p=$('au_p').value.trim();if(!okPhone(p)){note('Введите телефон полностью');return}
if(!$('au_ok').checked){note('Нужно согласие на обработку данных');return}
if(amode==='reg'){const n=$('au_n').value.trim();if(!n){note('Введите имя');return}const mail=$('au_e').value.trim();LS.s('wh_u',{name:n,phone:p,mail});LS.s('wh_in',true);rec('users',{name:n,phone:p,mail});confetti();note('Добро пожаловать, '+n+'!')}
else{const u=user();if(!u||u.phone.replace(/\D/g,'')!==p.replace(/\D/g,'')){note('Кабинет с таким телефоном не найден на этом устройстве. Зарегистрируйтесь.');return}LS.s('wh_in',true);note('С возвращением, '+u.name+'!')}
$('au').classList.remove('on');accUpd();const cb=acb;acb=null;if(cb)cb()};
function snapshot(){const L=LOCS[loc];return{id:Date.now(),at:new Date().toLocaleString('ru-RU'),title:L.n+' · '+Math.round(PW*PD/100)+' соток · '+$('tot').textContent,loc,PW,PD,model:curModel,fence:fenceSt,items:items.map(i=>({type:i.type,x:i.x,z:i.z,a:i.a,s:i.s,fl:i.fl,st:i.st,mt:i.mt,c1:i.c1,c2:i.c2,tr:i.tr}))}}
function saveProj(){const p=snapshot(),a=LS.g('wh_projects',[]);a.unshift(p);LS.s('wh_projects',a.slice(0,20));remote('project',{title:p.title});note('Проект сохранён в кабинет');if($('dr').classList.contains('on'))renderDr()}
function loadProj(id){const p=LS.g('wh_projects',[]).find(x=>x.id===id);if(!p)return;applyProject({loc:p.loc,PW:p.PW,PD:p.PD,model:p.model,fence:p.fence,items:p.items});$('dr').classList.remove('on');$('map').scrollIntoView({behavior:'smooth'});note('Проект загружен')}
function renderDr(){const u=user(),L=k=>LS.g('wh_'+k,[]),lst=(a,f)=>a.length?a.map(f).join(''):'<div class="m" style="font-size:14px;margin-bottom:8px">Пока пусто</div>',hd=t=>'<h3 class="h" style="font-size:15px;margin:20px 0 10px">'+t+'</h3>';
$('dr_b').innerHTML='<div class="card" style="margin:18px 0"><b>'+u.name+'</b><div class="m" style="font-size:14px;margin-top:4px">'+u.phone+(u.mail?'<br>'+u.mail:'')+'</div></div><button class="p" id="dr_sv" style="width:100%">Сохранить текущий проект</button>'
+hd('Мои проекты')+lst(L('projects'),p=>'<div class="it"><b>'+p.title+'</b><div class="m" style="font-size:13px">'+p.at+'</div><div style="display:flex;gap:8px;margin-top:8px"><button data-ld="'+p.id+'">Загрузить</button><button data-rm="'+p.id+'">Удалить</button></div></div>')
+hd('Консультации')+lst(L('bookings'),b=>'<div class="it"><b>'+b.kind+'</b><div class="m" style="font-size:13px">'+b.date+' в '+b.time+'</div></div>')
+hd('Заявки на строительство')+lst(L('orders'),o=>'<div class="it"><b>'+o.title+'</b><div class="m" style="font-size:13px">'+o.at+'</div></div>')
+hd('Обращения в поддержку')+lst(L('tickets'),t=>'<div class="it"><b>'+t.topic+'</b><div class="m" style="font-size:13px">'+t.at+'</div></div>')
+'<button id="dr_out" style="width:100%;margin-top:18px">Выйти</button>'}
function openDr(){renderDr();$('dr').classList.add('on')}
$('dr_x').onclick=()=>$('dr').classList.remove('on');
$('dr_b').onclick=e=>{const t=e.target;if(t.id==='dr_sv')saveProj();else if(t.id==='dr_out'){LS.s('wh_in',false);$('dr').classList.remove('on');accUpd();note('Вы вышли из кабинета')}
else if(t.dataset.ld)loadProj(+t.dataset.ld);else if(t.dataset.rm){LS.s('wh_projects',LS.g('wh_projects',[]).filter(x=>x.id!==+t.dataset.rm));renderDr()}};
$('acc').onclick=()=>logged()?openDr():openAuth();
$('sv_proj').onclick=()=>logged()?saveProj():openAuth('Войдите, чтобы сохранить проект.',saveProj);
function openOrder(){const c=lines();$('od_l').innerHTML='<div class="m" style="font-size:14px;margin-bottom:8px">'+$('mapinfo').textContent+'</div>'+Object.keys(c).map(k=>'<div class="r"><span>'+k+(c[k].q>1?' × '+c[k].q:'')+'</span><b>'+fmt(c[k].p)+'</b></div>').join('')+'<div class="r" style="font-size:16px"><span>Итого</span><b>'+$('tot').textContent+'</b></div>';$('od_p').value=user()?user().phone:'';$('od').classList.add('on')}
$('ord').onclick=()=>logged()?openOrder():openAuth('Чтобы оформить заявку, создайте кабинет.',openOrder);
$('od_x').onclick=()=>$('od').classList.remove('on');
$('od_go').onclick=()=>{const p=$('od_p').value.trim();if(!okPhone(p)){note('Введите телефон полностью');return}const pj=snapshot();rec('orders',{title:pj.title,phone:p,comment:$('od_c').value.trim(),project:pj});$('od').classList.remove('on');pg('consult');confetti();note('Заявка сохранена. Для быстрого ответа позвоните: 8 (999) 977-74-39')};
['au','od'].forEach(id=>$(id).addEventListener('click',e=>{if(e.target.id===id)$(id).classList.remove('on')}));
