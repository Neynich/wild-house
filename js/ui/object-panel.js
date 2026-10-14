/* Панель объекта, окна, клавиатура */
/* ---- панель выбранного объекта, окна, клавиатура ---- */
mw.tabIndex=0;
function sbarUI(){const b=$('sbar');if(!b)return;const on=!!sel&&sel.mesh.visible!==false;b.classList.toggle('on',on);if(on){$('sbnm').textContent=nm(sel);$('sb_d').style.display=sel.type==='house'?'none':''}}
const stepS=d=>{if(sel)setTf(sel,sel.a,clamp(Math.round((sel.s+d)*20)/20,.5,2))};
$('sb_l').onclick=()=>sel&&setTf(sel,sel.a-Math.PI/12,sel.s);$('sb_r').onclick=()=>sel&&setTf(sel,sel.a+Math.PI/12,sel.s);
$('sb_m').onclick=()=>stepS(-.05);$('sb_p').onclick=()=>stepS(.05);
$('sb_f').onclick=()=>sel&&focusOn(sel.x,sel.z,fitFor(sel));$('sb_d').onclick=()=>$('del').click();
$('home').onclick=homeView;
let fsPh=null;
function toggleFs(v){const on=v===undefined?!mw.classList.contains('fs'):v;if(on===mw.classList.contains('fs'))return;
if(on){fsPh=document.createElement('div');fsPh.style.height=mw.offsetHeight+'px';mw.parentNode.insertBefore(fsPh,mw)}else if(fsPh){fsPh.remove();fsPh=null}
mw.classList.toggle('fs',on);document.body.style.overflow=on?'hidden':'';$('fsb').textContent=on?'🗗':'⛶';$('fsb').title=on?'Свернуть (F, Esc)':'На весь экран (F)';try{mw.focus({preventScroll:true})}catch(x){}requestAnimationFrame(size)}
$('fsb').onclick=()=>toggleFs();
const closeOv=()=>{$('ov').style.display='none'};
$('ovx').onclick=closeOv;$('ov').addEventListener('click',e=>{if(e.target===$('ov'))closeOv()});
$('hlp').onclick=()=>{$('coach').style.display=$('coach').style.display==='none'?'flex':'none'};
const typing=t=>t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable);
let mapHover=false;mw.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')mapHover=true});mw.addEventListener('pointerleave',()=>{mapHover=false;clearHover()});
const mapKeys=()=>mapHover||document.activeElement===mw||mw.classList.contains('fs');
function closeTop(){if($('ov').style.display==='flex'){closeOv();return true}if($('coach').style.display!=='none'){coachOff();return true}if(mw.classList.contains('fs')){toggleFs(false);return true}if(sel&&mapKeys()){select(null);return true}return false}
const KM={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',KeyQ:'q',KeyE:'e',Equal:'zi',NumpadAdd:'zi',Minus:'zo',NumpadSubtract:'zo'};
addEventListener('keydown',e=>{if(typing(e.target)||e.altKey||e.metaKey||e.ctrlKey||$('tour').classList.contains('on'))return;
if(e.key==='Escape'){if(closeTop())e.preventDefault();return}
if(!mapKeys()||$('ov').style.display==='flex')return;
const c=e.code;let used=true;
if(KM[c])kv[KM[c]]=1;
else if(c==='KeyR'&&sel)setTf(sel,sel.a+(e.shiftKey?-1:1)*Math.PI/12,sel.s);
else if(c==='BracketRight')stepS(.05);else if(c==='BracketLeft')stepS(-.05);
else if((c==='Delete'||c==='Backspace')&&sel)$('del').click();
else if(c==='KeyT')$('tv').click();else if(c==='KeyF')toggleFs();else if(c==='KeyH'||c==='Home')homeView();
else used=false;
if(used)e.preventDefault()});
addEventListener('keyup',e=>{if(KM[e.code])delete kv[KM[e.code]]});
addEventListener('blur',()=>{for(const k in kv)delete kv[k]});
function lines(){const c={};c['Земля: '+LOCS[loc].n+', '+Math.round(sotN())+' соток × '+fmt(LOCS[loc].lp)]={p:landCost(),q:1};items.forEach(i=>{const k=nm(i);c[k]=c[k]||{p:0,q:0};c[k].p+=pr(i);c[k].q++});if(fenceCost())c['Забор: '+FENCES[fenceSt].n+' ('+Math.round(fenceLen())+' м)']={p:fenceCost(),q:1};return c}
$('est').onclick=()=>{const c=lines();
$('lst').innerHTML='<div style="font-family:Unbounded,sans-serif;font-size:20px;margin-bottom:6px">Смета проекта</div><div style="font-size:13px;color:var(--mut);margin-bottom:12px">'+$('mapinfo').textContent+' · коэффициент стоимости строительства в районе ×'+String(LOCS[loc].rk).replace('.',',')+'</div>'+Object.keys(c).map(k=>'<div class="r"><span>'+k+(c[k].q>1?' × '+c[k].q:'')+'</span><b>'+fmt(c[k].p)+'</b></div>').join('')+'<div class="r" style="font-size:17px"><span>Итого</span><b>'+$('tot').textContent+'</b></div>';
$('ov').style.display='flex'};
$('cl').onclick=()=>{$('ov').style.display='none'};
