/* Утилиты: вывод ошибок, заглушка THREE, форматирование, localStorage */
const artImg=(k,fb)=>IMGS[k]?'<img class="rimg" alt="Визуализация" decoding="async" loading="lazy" src="'+IMGS[k]+'">':fb();

addEventListener('error',e=>{const b=document.getElementById('eb');if(b){b.style.display='block';b.textContent='Ошибка на странице: '+(e.message||'')}});
let ready=false;
function stubT(){const f=function(){},mk=()=>new Proxy(f,{get(t,k){if(k==='__stub')return true;if(k===Symbol.toPrimitive)return()=>0;if(k==='length')return 0;return mk()},set(){return true},apply(){return mk()},construct(){return mk()}});return mk()}
const T=window.THREE||stubT(),$=id=>document.getElementById(id),Q=s=>document.querySelectorAll(s);
const fmt=n=>n.toLocaleString('ru-RU')+' ₽',snap=v=>Math.round(v*2)/2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const LS={g(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
