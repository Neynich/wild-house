/* Поделиться, импорт, автосохранение */
/* ---- share, import, autosave ---- */
const SITE='https://claude.ai/artifact/1GExGq9EXTTR7NkJVHX5ZM';
const b64u=u=>{let s='';u.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const unb64u=str=>{str=str.replace(/-/g,'+').replace(/_/g,'/');while(str.length%4)str+='=';const s=atob(str),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
async function packProj(){const o={v:1,l:loc,w:PW,d:PD,m:curModel,f:fenceSt,i:items.map(i=>[i.type,+i.x.toFixed(1),+i.z.toFixed(1),+i.a.toFixed(3),+i.s.toFixed(3),i.fl,i.st,i.mt||'',i.c1==null?-1:i.c1,i.c2==null?-1:i.c2,i.tr||0])};
const raw=new TextEncoder().encode(JSON.stringify(o));
try{if(window.CompressionStream){const cs=new CompressionStream('deflate-raw'),w=cs.writable.getWriter();w.write(raw);w.close();return'W2.'+b64u(new Uint8Array(await new Response(cs.readable).arrayBuffer()))}}catch(e){}
return'W1.'+b64u(raw)}
async function unpackProj(code){const m=String(code).replace(/\s+/g,'').match(/W([12])\.([A-Za-z0-9_-]+)/);if(!m)throw new Error('format');let u=unb64u(m[2]);
if(m[1]==='2'){const ds=new DecompressionStream('deflate-raw'),w=ds.writable.getWriter();w.write(u);w.close();u=new Uint8Array(await new Response(ds.readable).arrayBuffer())}
const o=JSON.parse(new TextDecoder().decode(u));if(!o||o.v!==1||!Array.isArray(o.i))throw new Error('version');return o}
function applyProject(p){items.forEach(i=>S.remove(i.mesh));items=[];select(null);fenceSt=(p.fence&&FENCES[p.fence])?p.fence:'basic';fpKey='';
PW=snap(clamp(+p.PW||40,15,90));PD=snap(clamp(+p.PD||30,15,90));mkPlot();mkFinish();curModel=(p.model>=0&&p.model<MODELS.length)?(p.model|0):2;
const col=v=>(Number.isInteger(v)&&v>=0&&v<=0xFFFFFF)?v:null;
(p.items||[]).slice(0,60).forEach(o=>{if(!o||!TYPES[o.type])return;const it={id:++uid,type:o.type,x:clamp(+o.x||0,-100,100),z:clamp(+o.z||0,-100,100),a:+o.a||0,s:clamp(+o.s||1,.5,2),fl:o.fl===2?2:1,st:STY[o.st]?o.st:'modern',mt:MATS[o.mt]?o.mt:null,c1:col(o.c1),c2:col(o.c2),tr:(o.tr===1||o.tr===2)?o.tr:0};
it.mesh=build(it.type,it.fl,it.st,it.mt,it.c1,it.c2,it.tr);it.mesh.userData.id=it.id;items.push(it);S.add(it.mesh);commit(it,it.x,it.z)});
if(!house())add('house',0,-4,{s:mScale(MODELS[curModel])});
pick(LOCS[p.loc]?p.loc:1);fitRad();upd();total();chipsState();applyStage();fenceUI();$('mw1').value=PW;$('md1').value=PD;Q('#ps button').forEach(b=>b.className='');Q('#models .mc').forEach(c=>c.classList.toggle('sel',+c.dataset.i===curModel))}
function applyShared(o){applyProject({loc:o.l,PW:o.w,PD:o.d,model:o.m,fence:o.f,items:o.i.map(a=>({type:a[0],x:a[1],z:a[2],a:a[3],s:a[4],fl:a[5],st:a[6],mt:a[7]||null,c1:a[8],c2:a[9],tr:a[10]}))});$('map').scrollIntoView({behavior:'smooth'});note('Проект открыт: расстановка, цвета и размеры участка как у отправителя')}
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);note(msg||'Скопировано')}catch(e){const x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();try{document.execCommand('copy');note(msg||'Скопировано')}catch(z){note('Выделите текст и скопируйте вручную')}x.remove()}}
let asT;function autosave(){clearTimeout(asT);asT=setTimeout(()=>{try{LS.s('wh_auto',snapshot())}catch(e){}},700)}
$('shb').onclick=async()=>{$('shm').classList.add('on');$('sh_t').value='Собираю код проекта…';
try{const c=await packProj();$('sh_t').value='Мой проект WILD HOUSE\n'+$('mapinfo').textContent+'\nИтого: '+$('tot').textContent+'\n\nСайт: '+SITE+'\nКод проекта (вставьте его на сайте: конструктор → «Поделиться / открыть по коду»):\n'+c}catch(e){$('sh_t').value='Не удалось собрать код: '+e.message}};
$('sh_c').onclick=()=>copyText($('sh_t').value,'Сообщение скопировано. Отправьте его в любой мессенджер');
$('sh_s').onclick=async()=>{const t=$('sh_t').value;if(navigator.share){try{await navigator.share({title:'Мой проект WILD HOUSE',text:t});return}catch(e){}}copyText(t,'Сообщение скопировано. Отправьте его в любой мессенджер')};
$('sh_l').onclick=async()=>{try{const o=await unpackProj($('sh_i').value);applyShared(o);$('shm').classList.remove('on');$('sh_i').value=''}catch(e){note('Не получилось прочитать код. Скопируйте его целиком, вместе с буквами W1 или W2.')}};
$('sh_x').onclick=()=>$('shm').classList.remove('on');
$('shm').addEventListener('click',e=>{if(e.target.id==='shm')$('shm').classList.remove('on')});
