/* Визуальные эффекты (счётчики, появление, tilt) */
/* ---- effects ---- */
Q('.tilt').forEach(el=>{el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(700px) rotateX('+(-y*7)+'deg) rotateY('+(x*7)+'deg) translateY(-4px)'});el.addEventListener('pointerleave',()=>el.style.transform='')});
const rvo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target;el.style.transitionDelay=Math.min([...el.parentNode.children].indexOf(el),5)*70+'ms';el.classList.add('in');rvo.unobserve(el)}}),{threshold:.1});
Q('.rv').forEach(el=>rvo.observe(el));
const cno=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target,to=+el.dataset.c,t0=performance.now();cno.unobserve(el);(function f(t){const k=Math.min(1,(t-t0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}}));
Q('.stats [data-c]').forEach(el=>cno.observe(el));
/* ---- init ---- */
