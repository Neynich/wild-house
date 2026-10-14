/* Цвета объектов */
/* ---- object colors ---- */
const PAL=[0xFFFFFF,0xF1EBDD,0xD9D2BE,0xBFC3C6,0x6E7378,0x2E3238,0x111214,0xB8603F,0x9C4A32,0xC9A06A,0x8A5A32,0x6F4E37,0x93A383,0x2F6B4F,0x2E5C8A,0x35B6E8,0xC9A15A,0xE9A765,0xE86A92,0xB3261E];
function rebuildItem(it){const was=it.mesh.userData.sp.visible;S.remove(it.mesh);it.mesh=build(it.type,it.fl,it.st,it.mt,it.c1,it.c2,it.tr);it.mesh.userData.id=it.id;it.mesh.userData.sp.visible=was;S.add(it.mesh);commit(it,it.x,it.z);total();chipsState();sync();applyStage()}
function setCol(which,c){if(!sel)return;sel[which]=c;rebuildItem(sel)}
function swRow(id,which){const el=$(id);el.innerHTML='';PAL.forEach(c=>{const b=document.createElement('button');b.className='sw3';b.style.background='#'+c.toString(16).padStart(6,'0');b.dataset.col=c;b.setAttribute('aria-label','Цвет');b.onclick=()=>setCol(which,c);el.appendChild(b)});
const l=document.createElement('label');l.className='sw3 cust';l.title='Свой цвет';const i=document.createElement('input');i.type='color';i.oninput=()=>setCol(which,parseInt(i.value.slice(1),16));l.appendChild(i);el.appendChild(l)}
function colUI(){const on=!!sel,lb=on?LBL[sel.type]:['—','—'];$('cl1n').textContent=lb[0];$('cl2n').textContent=lb[1];$('clr').disabled=!on;
Q('#cs1 button.sw3,#cs2 button.sw3').forEach(b=>b.disabled=!on);
[['cs1','c1'],['cs2','c2']].forEach(r=>Q('#'+r[0]+' button.sw3').forEach(b=>b.classList.toggle('on',on&&sel[r[1]]===+b.dataset.col)))}
swRow('cs1','c1');swRow('cs2','c2');
$('clr').onclick=()=>{if(!sel)return;sel.c1=null;sel.c2=null;if(sel.type==='house')sel.mt=null;rebuildItem(sel);note('Цвета объекта возвращены по умолчанию')};
