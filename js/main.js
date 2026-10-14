/* Запуск, цикл отрисовки, контроль WebGL */
const stp=f=>{try{f()}catch(e){console.error(e);const b=$('eb');b.style.display='block';b.textContent='Ошибка на странице: '+e.message}};
stp(()=>{$('kmv').textContent='любое расстояние';pick(1)});
stp(()=>setPlot(12));
stp(()=>{add('house',0,-4,{s:mScale(MODELS[curModel])});select(null);chipsState();setStage(3);finState()});
stp(()=>{Q('#models .mc').forEach(c=>c.classList.toggle('sel',+c.dataset.i===curModel));qUpd()});
stp(()=>{const a=LS.g('wh_auto',null);if(a&&a.items&&a.items.length){applyProject({loc:a.loc,PW:a.PW,PD:a.PD,model:a.model,fence:a.fence,items:a.items});if(a.items.length>1)note('Восстановили ваш последний проект')}});
stp(()=>{const m=(location.hash||'').match(/W[12]\.[A-Za-z0-9_-]+/);if(m)unpackProj(m[0]).then(applyShared).catch(()=>{})});
stp(trR);stp(ecoR);stp(accUpd);stp(()=>{setIso();if(HR.noGL){$('hc').style.display='none';$('hc2').style.display='block'}if(R.noGL)toast('В вашем браузере нет WebGL — включён лёгкий 3D-режим. Всё работает так же.')});stp(size);stp(()=>pg());stp(calc);
ready=true;
let vM=true,vH=true;new IntersectionObserver(es=>es.forEach(e=>vM=e.isIntersecting)).observe(mw);new IntersectionObserver(es=>es.forEach(e=>vH=e.isIntersecting)).observe(hv);
let mf=0,hf2=0,ge=0,he=0,heroLite=!!HR.noGL;
function glFail(why){if(ISO)return;liteOn=true;setIso();toast('3D-графика устройства не отрисовалась ('+why+'). Включён лёгкий 3D-режим. Кнопка «Режим 3D» пробует полный режим снова.',1)}
function heroFail(){if(heroLite)return;heroLite=true;$('hc').style.display='none';$('hc2').style.display='block'}
function pxAt(r){const gl=r.getContext(),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,p=new Uint8Array(4);if(w<2||h<2)return null;gl.readPixels(w>>1,h>>1,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);return p}
try{new ResizeObserver(()=>size()).observe(mw);new ResizeObserver(()=>size()).observe(hv)}catch(e){}
(function loop(){requestAnimationFrame(loop);
try{if(vH){if(hauto){hth+=.004;hupd()}if(heroLite)isoHero();else{HR.render(HS,hcam);hf2++;if(hf2===10||hf2===90){const p=pxAt(HR);if(!p||!p[3])heroFail()}}}}catch(e){he++;if(he>1)heroFail()}
try{if(vM){frame();if(ISO)isoFrame();else{R.render(S,cam);mf++;if(!isFinite(cam.position.x)||!isFinite(cam.position.y)){th=.6;ph=1;fitRad();upd()}
if(mf===8||mf===40||mf===150){const p=pxAt(R),b=S.background;if(!p)glFail('нулевой размер холста');else if((Math.abs(p[0]-Math.round(b.r*255))<=3&&Math.abs(p[1]-Math.round(b.g*255))<=3&&Math.abs(p[2]-Math.round(b.b*255))<=3)||p[0]+p[1]+p[2]<6)glFail('пустой кадр')}}}}catch(e){ge++;if(ge>1)glFail(e.message)}
})();
