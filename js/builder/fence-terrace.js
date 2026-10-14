/* Ограждение и терраса */
/* ---- fence & terrace UI ---- */
function fenceUI(){Q('#fnc button').forEach(b=>b.className=b.dataset.k===fenceSt?'on':'');$('fni').textContent=FENCES[fenceSt].d+' · периметр ≈ '+Math.round(fenceLen())+' м'+(fenceCost()?' · доплата '+fmt(fenceCost()):'')}
function setFence(k){fenceSt=k;fpKey='';mkPlot();total();fenceUI();if(ready)note('Забор: '+FENCES[k].n+(fenceCost()?'. Доплата '+fmt(fenceCost())+'.':'. Без доплаты.'))}
Object.keys(FENCES).forEach(k=>{const b=document.createElement('button');b.dataset.k=k;b.textContent=FENCES[k].n+(FENCES[k].r?' +'+FENCES[k].r.toLocaleString('ru-RU')+' ₽/м':'');b.onclick=()=>setFence(k);$('fnc').appendChild(b)});
['Нет','Открытая +450 тыс. ₽','Крытая +950 тыс. ₽'].forEach((n,i)=>{const b=document.createElement('button');b.textContent=n;b.onclick=()=>{const h=house();if(h){h.tr=i;rebuild();note(i?'Терраса: '+n+'. Цена пересчитана.':'Терраса убрана')}};$('trc').appendChild(b)});
