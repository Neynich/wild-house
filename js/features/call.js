/* Кнопка звонка */
/* call */
$('fab').onclick=()=>$('cm').classList.add('on');$('cm_x').onclick=()=>$('cm').classList.remove('on');
$('cm').addEventListener('click',e=>{if(e.target.id==='cm')$('cm').classList.remove('on')});
$('cp').onclick=async()=>{const n='89999777439';try{await navigator.clipboard.writeText(n);note('Номер скопирован: 8 (999) 977-74-39')}catch(e){const t=document.createElement('textarea');t.value=n;document.body.appendChild(t);t.select();try{document.execCommand('copy');note('Номер скопирован: 8 (999) 977-74-39')}catch(x){note('Номер: 8 (999) 977-74-39')}t.remove()}};
