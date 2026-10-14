/* Материалы */
/* ---- materials ---- */
function setMat(k,fromCard){const h=house();if(!h)return;h.mt=k||null;h.c1=null;rebuild();refreshPrices();if(k&&ready)pg('materials');note(k?'Материал стен: '+MATS[k].n+'. Цена дома пересчитана.':'Материал стен — по стилю фасада.');if(fromCard)$('map').scrollIntoView({behavior:'smooth'})}
[['','По стилю']].concat(Object.keys(MATS).map(k=>[k,MATS[k].n])).forEach(m=>{const b=document.createElement('button');b.textContent=m[1];b.dataset.k=m[0];b.onclick=()=>setMat(m[0]);$('mtchips').appendChild(b)});
Object.keys(MATS).forEach(k=>{const m=MATS[k],c=document.createElement('div');c.className='card mc tilt rv';c.dataset.k=k;
c.innerHTML='<div class="mh mt">'+artImg('t_'+k,()=>matArt(k))+'</div><div class="h" style="font-size:18px">'+m.n+'</div><p class="m" style="margin-top:8px;font-size:14px">'+m.t+'</p><div class="mp" data-k="'+k+'" style="color:var(--acc);font-weight:700;margin-top:10px;font-size:14px"></div><button class="p" style="margin-top:12px;width:100%">Применить к дому</button>';
c.onclick=()=>setMat(k,true);$('mats').appendChild(c)});
