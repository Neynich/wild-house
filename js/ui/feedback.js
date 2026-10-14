/* Уведомления, конфетти, хранилище заявок */
/* ---- toast/note/store ---- */
let nt;function note(m){const e=$('sn');e.textContent=m;e.className='on';clearTimeout(nt);nt=setTimeout(()=>e.className='',4200)}
function confetti(){const cs=['#C26A1B','#E9A765','#8FC49A','#F4F0E6','#2C5A3F'];for(let i=0;i<46;i++){const e=document.createElement('i');e.className='cf';e.style.left=Math.random()*100+'vw';e.style.background=cs[i%5];e.style.animationDelay=Math.random()*.6+'s';e.style.animationDuration=1.8+Math.random()*1.4+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),3800)}}
let DB=null,UID=null;
(async()=>{try{const C=window.claude;if(!C||!C.use)return;const u=await C.use('user');UID=u&&u.id?await u.id():null;DB=await C.use('db')}catch(e){}})();
async function remote(kind,o){if(!DB||!UID)return;try{await DB.collection('leads/'+UID+'/items').add(Object.assign({kind,ts:Date.now()},o))}catch(e){}}
function rec(kind,o){o=Object.assign({id:Date.now(),at:new Date().toLocaleString('ru-RU')},o);const a=LS.g('wh_'+kind,[]);a.unshift(o);LS.s('wh_'+kind,a);remote(kind,o);return o}
const okPhone=v=>(v.match(/\d/g)||[]).length>=10;
