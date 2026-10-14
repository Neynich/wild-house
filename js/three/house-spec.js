/* Описание геометрии домов и построек (spec) */
function spec(it,sg){const t=it.type,o=[],B=(x,z,w,d,y,h,c,a)=>o.push({t:'B',x,z,w,d,y,h,c,a}),C=(x,z,r,y,h,c)=>o.push({t:'C',x,z,r,y,h,c}),O=(x,y,z,r,c)=>o.push({t:'O',x,y,z,r,c}),G=(x,z,len,span,y,rise,roof,cap,ov)=>o.push({t:'G',x,z,len,span,y,rise,roof,cap,ov:ov||0}),Pp=f=>o.push({t:'P',faces:f});
if(t==='house'){const st=it.st||'modern',Y=STY[st]||STY.modern,F=it.fl===2?2:1,W=16,BD=10,BZ=-1.5,H=3.2,ZF=BZ+BD/2,ZB=BZ-BD/2,y0=.4+H*F,
L=it.c1!=null?it.c1:(it.mt&&MATS[it.mt]?MATS[it.mt].c:Y.wall),R=it.c2!=null?it.c2:Y.roof,GL=Y.glass,DK=Y.trim,WD=Y.wood,CP=Y.cap,DR=0x5A3A22,body=sg>=1,roof=sg>=2,tr=it.tr||0,MLOW=(it.c1==null&&it.mt&&MATS[it.mt]&&MATS[it.mt].low)?MATS[it.mt].low:null,WL=(x,z,w,d,y,h,c)=>{if(MLOW&&h>1.4){B(x,z,w,d,y,1.1,MLOW);B(x,z,w,d,y+1.1,h-1.1,c)}else B(x,z,w,d,y,h,c)};
const bxw=(f,p,b,wd,dp,y,h,c,pz)=>{if(f==='l'||f==='r'){const s=f==='l'?-1:1;B(s*(W/2+b),p,dp,wd,y,h,c)}else{const s=f==='f'?1:-1,z0=pz!=null?pz:(f==='f'?ZF:ZB);B(p,z0+s*b,wd,dp,y,h,c)}};
const win=(f,p,y,w,h,o)=>{o=o||{};const pz=o.pz,m=o.mul==null?(w>1.3?Math.floor(w/1.3):0):o.mul,fr=o.fr!=null?o.fr:DK;
bxw(f,p,.02,w,.06,y,h,GL,pz);bxw(f,p,.05,w+.16,.09,y+h-.03,.09,fr,pz);bxw(f,p,.05,w+.16,.09,y-.06,.09,fr,pz);
[-1,1].forEach(s=>bxw(f,p+s*w/2,.05,.09,.09,y-.03,h+.06,fr,pz));for(let i=1;i<=m;i++)bxw(f,p-w/2+w*i/(m+1),.04,.05,.06,y,h,fr,pz);
if(h>1.6)bxw(f,p,.04,w,.06,y+h*.6,.045,fr,pz);if(o.sill!==false)bxw(f,p,.12,w+.34,.22,y-.14,.07,o.sill||CP,pz);
if(o.lintel)bxw(f,p,.08,w+.4,.12,y+h+.08,.15,o.lintel,pz);if(o.shut)[-1,1].forEach(s=>bxw(f,p+s*(w/2+.32),.07,.46,.06,y-.03,h+.06,o.shut,pz));
if(o.box&&f==='f'){bxw(f,p,.2,w+.1,.3,y-.4,.3,WD,pz);[-.3,-.1,.1,.3].forEach((q,i)=>O(p+q*w*.6,y-.06,(pz!=null?pz:ZF)+.2,.1,[0xE86A92,0xF2C94C,0xFFFFFF,0xB070D0][i%4]))}};
const door=(f,p,w,h,o)=>{o=o||{};const dc=o.c!=null?o.c:DR,pz=o.pz;bxw(f,p,.025,w,.07,.4,h,dc,pz);bxw(f,p,.06,w+.24,.09,.4+h-.02,.13,DK,pz);[-1,1].forEach(s=>bxw(f,p+s*(w/2+.06),.06,.12,.09,.4,h,DK,pz));
if(o.glass)bxw(f,p,.05,w*.55,.04,.4+h*.42,h*.46,GL,pz);else[-1,1].forEach(sx=>[0,1].forEach(sy=>bxw(f,p+sx*w*.24,.05,w*.34,.03,.4+h*.1+sy*h*.45,h*.36,sh(dc,.82),pz)));
bxw(f,p+w*.36,.1,.05,.06,.4+h*.46,.14,0xD8C9A0,pz);if(o.lamp!==false)[-1,1].forEach(s=>bxw(f,p+s*(w/2+.55),.1,.14,.12,.4+h*.75,.26,0xFFE2A8,pz))};
const railX=(x0,x1,z,y,c)=>{const n=Math.max(2,Math.round((x1-x0)/.28));B((x0+x1)/2,z,x1-x0,.07,y+.78,.07,c);B((x0+x1)/2,z,x1-x0,.05,y+.12,.05,c);for(let i=0;i<=n;i++)C(x0+(x1-x0)*i/n,z,.025,y,.8,c)};
const railZ=(z0,z1,x,y,c)=>{const n=Math.max(2,Math.round((z1-z0)/.28));B(x,(z0+z1)/2,.07,z1-z0,y+.78,.07,c);B(x,(z0+z1)/2,.05,z1-z0,y+.12,.05,c);for(let i=0;i<=n;i++)C(x,z0+(z1-z0)*i/n,.025,y,.8,c)};
B(0,BZ,W+.3,BD+.3,0,.4,0x8A8D8F);
if(st==='modern'){
if(body){WL(0,BZ,W,BD,.4,H,L);
if(F===2){B(-1.8,BZ+.7,W*.7,BD+1.4,.4+H,H,L);B(-1.8,BZ+.7,W*.7+.14,BD+1.54,.4+H-.12,.24,DK);const pz2=BZ+.7+(BD+1.4)/2;win('f',-1.8,.4+H+.5,6.4,2.1,{pz:pz2,mul:4,sill:false});railX(-7,3.4,pz2+.05,.4+H+.0,GL)}
else{B(-W*.28,BZ,W*.42,BD,.4+H,1.3,L);win('f',-4.5,.4+H+.35,3.4,.65,{mul:2,sill:false})}
B(-5.6,ZF+.01,2.7,.04,.4,H,sh(WD,.55));for(let i=0;i<13;i++)B(-6.9+i*.2,ZF+.045,.1,.09,.4,H,WD);
win('f',2.0,.55,7.6,2.6,{mul:5,sill:false});door('f',6.6,1.3,2.6,{c:WD,glass:false});bxw('f',6.18,.12,.05,.05,.6,2.0,0xB9B9B9);
[BZ+.5,BZ-2.2].forEach(z=>{win('l',z,1.0,2.4,2.0,{mul:1});win('r',z,1.0,2.4,2.0,{mul:1})});[-4,4].forEach(x=>win('b',x,1.0,3,2.0,{mul:2}));
B(-2.5,ZF+.55,2.4,.7,0,.5,0x8A8D8F);O(-3.1,.95,ZF+.55,.4,0x3F8F45);O(-1.9,.9,ZF+.55,.35,0x4FA04A)}
if(roof){if(F===2){B(0,BZ,W+.9,BD+.9,.4+H,.25,R);B(-1.8,BZ+.7,W*.7+.9,BD+2.3,.4+2*H,.3,R);B(-1.8,BZ+.7,W*.7+.9,BD+2.3,.4+2*H-.06,.08,DK)}
else{B(0,BZ,W+.9,BD+.9,.4+H,.3,R);B(0,BZ,W+.9,BD+.9,.4+H-.06,.08,DK);B(-W*.28,BZ,W*.42+.9,BD+.9,.4+H+1.3,.3,R);B(-W*.28,BZ,W*.42+.9,BD+.9,.4+H+1.24,.08,DK)}
B(6,5,3.6,3,3.02,.2,R);[4.4,7.6].forEach(x=>C(x,6.2,.07,0,3.02,DK))}}
else if(st==='minimal'){
if(body){WL(0,BZ,W,BD,.4,H*F,L);[-6.4,-5.1,-3.8].forEach(x=>win('f',x,.7,.7,2.3,{mul:0,sill:false}));win('f',-.4,.9,3.2,2.1,{mul:2,sill:false});
B(5.8,ZF+.35,2.6,.7,.4,3.0,WD);door('f',5.8,1.1,2.4,{pz:ZF+.7,lamp:false,glass:true});win('f',4.2,.9,.5,2.2,{mul:0,sill:false});
if(F===2){[-6.4,-5.1,-3.8].forEach(x=>win('f',x,.4+H+.7,.7,2.3,{mul:0,sill:false}));win('f',-.4,.4+H+.9,3.2,2.1,{mul:2,sill:false});win('f',5.8,.4+H+.9,2.2,1.9,{pz:ZF+.7,mul:1,sill:false})}
[BZ+.8,BZ-2.4].forEach(z=>{win('l',z,1.0,1.6,2.4,{mul:1});win('r',z,1.0,1.6,2.4,{mul:1})});[-4,0,4].forEach(x=>win('b',x,1.0,2.4,2.2,{mul:1}));B(5.8,ZF+1.1,2.2,.8,0,.14,0xBDB6A6)}
if(roof){Pp(shedF(0,BZ,W+1,BD+.4,y0,2.0,R,L));B(0,BZ+BD/2+.2,W+1,.14,y0-.12,.3,DK);B(5.8,ZF+.9,3.4,1.9,.4+3.05,.14,DK)}}
else if(st==='classic'){
if(body){WL(0,BZ,W,BD,.4,H*F,L);B(0,BZ,W+.3,BD+.3,.4,.6,0xB9B2A2);if(F===2)B(0,BZ,W+.14,BD+.14,.4+H-.12,.24,CP);
for(let k=0;k<Math.round(H*F/.5);k++){const wd=k%2?.95:.55,wd2=k%2?.55:.95;[-1,1].forEach(s=>{B(s*(W/2-wd/2+.02),ZF+.03,wd,.07,1+k*.5-.1,.5,CP);B(s*(W/2+.03),ZF-wd2/2+.02,.07,wd2,1+k*.5-.1,.5,CP)})}
[-6.2,-3.4,3.4,6.2].forEach((x,i)=>win('f',x,1.15,1.35,1.75,{mul:1,lintel:CP,shut:WD,box:i%3===0,sill:CP}));
if(F===2)[-6.2,-3.4,0,3.4,6.2].forEach(x=>win('f',x,.4+H+1.05,1.3,1.6,{mul:1,lintel:CP,shut:WD}));
[BZ+.8,BZ-2.4].forEach(z=>{win('l',z,1.3,1.3,1.6,{mul:1,lintel:CP,shut:WD});win('r',z,1.3,1.3,1.6,{mul:1,lintel:CP,shut:WD});if(F===2){win('l',z,.4+H+1.1,1.3,1.5,{mul:1,lintel:CP});win('r',z,.4+H+1.1,1.3,1.5,{mul:1,lintel:CP})}});
[-5,0,5].forEach(x=>win('b',x,1.3,1.4,1.6,{mul:1,shut:WD}));
door('f',0,1.5,2.5,{});B(0,ZF+1.4,4,2.8,0,.4,CP);[-1.5,1.5].forEach(x=>C(x,ZF+2.3,.17,.4,2.8,CP));G(0,ZF+1.4,4,2.8,.4+2.8,.9,CP,CP,0);B(0,ZF+3.1,3.2,.6,0,.2,0xBDB6A6);B(0,ZF+3.5,3.8,.5,0,.1,0xBDB6A6)}
if(roof){Pp(hipF(0,BZ,W+1.6,BD+1.6,y0,3.4,R));B(0,BZ,W+.5,BD+.5,y0-.25,.25,CP);B(-3.4,BZ-1,.9,.9,y0+.8,3.2,0x8A6A55);B(-3.4,BZ-1,1.2,1.2,y0+3.9,.15,0x4A3A30);
if(F===1)[-4.4,4.4].forEach(x=>{B(x,2.4,1.9,1.5,y0+.5,1.7,L);win('f',x,y0+.95,1.1,1.0,{pz:3.15,sill:CP,mul:1});G(x,2.4,1.9,1.5,y0+2.2,.8,R,CP,.15)})}}
else if(st==='forest'){
if(body){const N=Math.round(H*F/.4);B(0,BZ,W+.2,BD+.2,.4,.6,0x8E8A82);for(let i=0;i<N;i++){const lc=(MLOW&&i<3)?MLOW:(i%2?L:sh(L,.82));B(0,BZ,W,BD,.4+i*.4,.4,lc);[-1,1].forEach(sx=>[ZF,ZB].forEach(zz=>{if(i%2)B(sx*(W/2+.1),zz,.4,.3,.4+i*.4+.02,.36,sh(lc,.9));else B(sx*(W/2-.05),zz+(zz>BZ?.1:-.1),.3,.4,.4+i*.4+.02,.36,sh(lc,.9))}))}
[-4.6,4.6].forEach(x=>win('f',x,1.4,1.4,1.3,{mul:1,shut:WD,box:true,sill:WD}));door('f',0,1.5,2.3,{c:sh(WD,.75)});
if(F===2)[-4.6,0,4.6].forEach(x=>win('f',x,.4+H+1.1,1.4,1.3,{mul:1,shut:WD,sill:WD}));
[BZ+.8,BZ-2.4].forEach(z=>{win('l',z,1.5,1.4,1.2,{mul:1,sill:WD});win('r',z,1.5,1.4,1.2,{mul:1,sill:WD})});[-4,0,4].forEach(x=>win('b',x,1.5,1.6,1.2,{mul:1,sill:WD}));
B(0,5,W*.9,3,0,.25,sh(0xB88A5A,.9));[-7,-3.5,3.5,7].forEach(x=>C(x,5.6,.18,0,y0-.1,WD));railX(-7,-1.4,6.3,.25,WD);railX(1.4,7,6.3,.25,WD);B(0,6.9,2.6,.7,0,.12,0xA98A60);B(0,6.5,2.6,.5,0,.22,0xA98A60);
B(-5.8,BZ-3,1.5,1.5,.4,H*F+3.6,0x8E8A82)}
if(roof){G(0,BZ+.6,W+2,BD+2.8,y0,4.6,R,CP,0);B(0,BZ+.6,W+2.2,.3,y0+4.5,.18,CP);B(-5.8,BZ-3,1.8,1.8,y0+3.6,.2,0x6E6A62);
[-1,1].forEach(s=>{const gx=s*((W+2)/2+.03);B(gx,BZ+.6,.06,1.3,y0+1.0,1.5,GL);B(gx+s*.03,BZ+.6,.09,1.5,y0+.95,.09,DK);B(gx+s*.03,BZ+.6,.09,1.5,y0+2.45,.09,DK);B(gx+s*.03,BZ+.6,.09,.09,y0+.95,1.6,DK)})}}
else{
if(body){WL(0,BZ,W,BD,.4,H*F,L);[-7.4,7.4].forEach(x=>B(x,ZF+.02,1,.14,.4,H*F,CP));B(0,5.1,12.8,3.4,0,.25,0xCFC8B8);B(0,ZF+3.3,13.4,.5,0,.15,0xCFC8B8);B(0,ZF+3.7,14,.5,0,.08,0xCFC8B8);
win('f',-2.4,.7,8.8,H*F-.6,{mul:5,sill:false});door('f',5.4,2.0,2.7,{glass:true,lamp:true});
if(F===2){B(0,ZF+.02,15.2,.1,.4+H-.1,.2,CP);}
[BZ+.8,BZ-2.4].forEach(z=>{win('l',z,.9,3.0,H*F-.9,{mul:2,sill:false});win('r',z,.9,3.0,H*F-.9,{mul:2,sill:false})});[-5,0,5].forEach(x=>win('b',x,.9,3.6,H*F-.9,{mul:2,sill:false}));
[-5.8,-2,2,5.8].forEach(x=>C(x,6,.3,.25,H*F+.15,0xF4EFE6));[-7.2,7.2].forEach(x=>{B(x,6.3,.7,.7,.25,.5,0x8A8D8F);O(x,1.35,6.3,.5,0x2F6B3A)})}
if(roof){B(0,BZ,W+1,BD+1,y0,.45,R);B(0,5,12.6,3.2,y0,.45,R);B(0,BZ,W+1.1,BD+1.1,y0-.12,.14,CP);railX(-8.5,8.5,BZ+BD/2+.5,y0+.45,CP);railZ(BZ-BD/2-.4,BZ+BD/2+.5,-8.5,y0+.45,CP);railZ(BZ-BD/2-.4,BZ+BD/2+.5,8.5,y0+.45,CP);
B(2.5,BZ-1,6,4.5,y0+.45,2,L);win('f',2.5,y0+.9,5.2,1.2,{pz:BZ-1+2.25,mul:3,sill:false});B(2.5,BZ-1,6.8,5.3,y0+2.45,.3,R)}}
const DX={modern:6.6,minimal:null,classic:null,forest:null,luxury:null}[st];
if(body&&DX!=null&&!tr)B(DX,ZF+.32,1.8,.7,0,.14,0xBDB6A6);
if(body&&tr>0){const dc={modern:0xB88A5A,minimal:0xD8D1C2,classic:0xCFC8B8,forest:0x9C7444,luxury:0xCFC8B8}[st]||0xB88A5A,rc=st==='forest'?0x5A3A22:(st==='classic'?0xFAF6EA:DK),X=W*.44;
B(0,5,W*.88,3,0,.22,dc);B(0,6.7,2.6,.7,0,.12,sh(dc,.92));
[-4.3,4.3].forEach(x=>{B(x,6.42,5.4,.07,.9,.06,rc);B(x,6.42,5.4,.05,.42,.05,rc)});
[-1,1].forEach(s=>{B(s*X,5,.07,2.9,.9,.06,rc);B(s*X,5,.05,2.9,.42,.05,rc)});
[-X,-4.7,-2.2,2.2,4.7,X].forEach(x=>C(x,6.42,.045,.22,.75,rc));[-1,1].forEach(s=>[3.9,5,6.1].forEach(z=>C(s*X,z,.045,.22,.75,rc)));
if(tr===2&&roof){B(0,5,W*.88+.5,3.6,2.95,.18,rc);[-1,1].forEach(s=>[3.6,6.4].forEach(z=>C(s*(X+.1),z,.1,.22,2.73,rc)))}}
}
if(t==='pool'){const wc=it.c1!=null?it.c1:0x35B6E8,cp=it.c2!=null?it.c2:0xEDE8DC;B(0,0,6,3,0,.3,0x9AA6AD);[-1,1].forEach(s=>{B(0,s*1.275,6,.45,0,.42,cp);B(s*2.775,0,.45,2.1,0,.42,cp)});B(0,0,5.1,2.1,.3,.06,wc,.92);[-.18,.18].forEach(z=>C(2.35,z,.035,.3,.9,0xD5D9DC));B(2.35,0,.04,.4,1.15,.04,0xD5D9DC)}
if(t==='sauna'){const wc=it.c1!=null?it.c1:0xA36D3F,rc=it.c2!=null?it.c2:0x3A2E26;B(0,0,4.2,4.2,0,.25,0x77797B);for(let i=0;i<7;i++)B(0,0,4,4,.25+i*.36,.36,i%2?wc:sh(wc,.9));G(0,0,4,4,2.77,1.5,rc,sh(wc,.7),.5);B(-.6,2.02,1.1,.12,.25,2.1,0x4A2E1A);B(1,2.02,.9,.12,1.2,.9,0xFFE2A8);B(-.6,2.2,1.4,.4,0,.12,0x8B6B3E);C(1,-.8,.13,3.1,1.3,0x555555)}
if(t==='garage'){const wc=it.c1!=null?it.c1:0xD3D6D5,gc=it.c2!=null?it.c2:0x9AA3A1;B(0,0,6,4,0,2.8,wc);B(0,0,6.4,4.4,2.8,.25,0x3A3F45);B(-.6,2.02,4.2,.1,0,2.3,gc);for(let i=1;i<5;i++)B(-.6,2.03,4.2,.12,i*.46,.04,sh(gc,.75));B(2.04,2.02,.7,.1,1.3,.9,0x86B9CF);B(2.7,2.01,.5,.12,0,2.8,0xA9794B);B(-.6,2.1,.3,.2,2.5,.15,0x222222)}
if(t==='bbq'){const bc=it.c1!=null?it.c1:0x9C4F3A,uc=it.c2!=null?it.c2:0xE9A765;B(0,0,3,3,0,.06,0xD6CDB8);B(0,-1,1.8,.8,.06,.9,bc);B(0,-1,1.6,.7,.96,.06,0x222222);B(.6,-1.1,.45,.45,.06,1.9,sh(bc,.88));B(0,.6,1.5,.8,.8,.07,0x8B6B3E);[[-.65,.3],[.65,.3],[-.65,.9],[.65,.9]].forEach(q=>C(q[0],q[1],.05,.06,.8,0x444444));[-.5,.5].forEach(x=>C(x,1.3,.22,.06,.45,0xA9794B));C(0,.6,.04,.06,2.3,0x666666);o.push({t:'U',x:0,z:.6,y:2.36,r:1.15,c:uc})}
if(t==='garden'){const fc=it.c1,gc=it.c2!=null?it.c2:0x3E8A3E;B(0,0,5,5,0,.08,0x5FA14C);[-1.3,1.3].forEach(x=>{B(x,1.9,1.8,.7,.08,.15,0x6B4A2F);[-.7,-.35,0,.35,.7].forEach((q,i)=>O(x+q,.35,1.9+(i%2?.1:-.1),.15,fc!=null?(i%2?sh(fc,1.15):fc):[0xE86A92,0xF2C94C,0xFFFFFF][i%3]))});
[1,.2,-.6].forEach((z,i)=>C(i%2?.15:-.15,z,.32,.08,.06,0xA7A59E));
[[-1.5,-1.3,1],[1.6,-1.1,.85]].forEach(q=>{C(q[0],q[1],.15,.08,1.4*q[2],0x6B4A2F);O(q[0],2.3*q[2],q[1],1.1*q[2],gc);O(q[0]+.5*q[2],1.8*q[2],q[1]+.3,.8*q[2],sh(gc,1.15));O(q[0]-.5*q[2],2*q[2],q[1]-.3,.8*q[2],sh(gc,.85))});
[-2.1,2.1].forEach(x=>O(x,.4,.2,.5,sh(gc,1.05)));B(0,-2,1.3,.4,.45,.1,0x8B6B3E);[-.5,.5].forEach(x=>B(x,-2,.1,.35,.08,.4,0x555555))}
if(t==='gazebo'){const wc=it.c1!=null?it.c1:0xB88A5A,rc=it.c2!=null?it.c2:0x6B4A2F;B(0,0,4,4,0,.18,sh(wc,.85));[[-1.7,-1.7],[1.7,-1.7],[-1.7,1.7],[1.7,1.7]].forEach(q=>C(q[0],q[1],.11,.18,2.3,wc));
B(0,-1.7,3.4,.08,.18+.9,.08,wc);[-1,1].forEach(s=>B(s*1.7,0,.08,3.4,.18+.9,.08,wc));B(0,0,1.2,1.2,.9,.07,wc);C(0,0,.12,.18,.72,sh(wc,.8));
B(0,-1.2,2.6,.45,.18,.28,sh(wc,.9));B(0,1.2,2.6,.45,.18,.28,sh(wc,.9));Pp(hipF(0,0,4.8,4.8,2.48,1.5,rc))}
if(t==='greenhouse'){const gc=it.c1!=null?it.c1:0xBFE3E8,fc=it.c2!=null?it.c2:0xC9CED2;B(0,0,6,3,0,.35,fc);B(0,0,5.9,2.9,.35,1.5,gc,.4);G(0,0,5.9,2.9,1.85,1.1,gc,fc,0);[-2,0,2].forEach(x=>B(x,0,.08,2.9,.35,1.5,fc));
[-2.2,-.7,.8,2.3].forEach(x=>{O(x,.7,-.7,.35,0x4FA04A);O(x,.7,.7,.35,0x6DBE5A)})}
if(t==='playground'){const fc=it.c1!=null?it.c1:0x8B6B3E,sc=it.c2!=null?it.c2:0xE86A52;B(0,0,6,5,0,.06,0xE6D3A3);
[-2.4,-.6].forEach(x=>C(x,-1.8,.07,.06,2,fc));B(-1.5,-1.8,2.1,.14,2,.12,fc);
[-1.9,-1.1].forEach(x=>{C(x,-1.8,.015,.55,1.45,0x555555);B(x,-1.8,.45,.25,.5,.06,sc)});
B(1.7,-.7,1.2,1.2,0,1.5,fc);B(1.7,-.7,1.4,1.4,1.5,.12,sc);Pp([{v:[[1.25,1.5,-.1],[2.15,1.5,-.1],[2.15,.08,1.9],[1.25,.08,1.9]],c:sc}]);
B(-1.5,1.4,2.2,1.6,.06,.25,fc);B(-1.5,1.4,1.9,1.3,.31,.02,0xF0DFAE)}
if(t==='carport'){const rc=it.c1!=null?it.c1:0x6E7378,pc=it.c2!=null?it.c2:0x3A3F45;B(0,0,6,3.2,0,.05,0xB9B5AA);
B(0,0,4.2,1.8,.3,.65,0xC0392B);B(-.2,0,2.2,1.6,.95,.55,0x86B9CF);[[-2.8,-1.4],[2.8,-1.4],[-2.8,1.4],[2.8,1.4]].forEach(q=>C(q[0],q[1],.1,.05,2.5,pc));B(0,0,6.3,3.5,2.55,.2,rc)}
if(t==='shed'){const wc=it.c1!=null?it.c1:0xB59A72,rc=it.c2!=null?it.c2:0x4B5057;B(0,0,3,3,0,2.3,wc);Pp(shedF(0,0,3.4,3.4,2.3,.7,rc,sh(wc,.85)));B(-.5,1.52,1,.1,0,1.9,sh(wc,.6));B(.9,1.51,.6,.1,1.1,.7,0x86B9CF)}
if(t==='pond'){const wc=it.c1!=null?it.c1:0x3C9FCB,rc=it.c2!=null?it.c2:0x8E8A82;B(0,0,5,4,0,.1,sh(rc,.8));B(0,0,4.3,3.3,.1,.04,wc,.9);
[[-2.2,-1.6,.45],[-1,-1.85,.35],[1.4,-1.7,.5],[2.2,.4,.4],[1.6,1.7,.45],[-.5,1.8,.35],[-2.2,1.1,.5]].forEach(q=>O(q[0],q[2]*.6,q[1],q[2],rc));
[[.5,.3],[-.8,-.2],[1.2,-.6]].forEach(q=>B(q[0],q[1],.5,.5,.14,.02,0x3E8A3E));[[-2,-1],[-1.8,-1.2],[2,1.2]].forEach(q=>C(q[0],q[1],.03,.1,.9,0x5E7A3A))}
if(t==='court'){const cc=it.c1!=null?it.c1:0x4A8F5C,lc=it.c2!=null?it.c2:0xFFFFFF;B(0,0,10,6,0,.06,cc);
B(0,2.8,9.4,.1,.06,.02,lc);B(0,-2.8,9.4,.1,.06,.02,lc);[-4.7,0,4.7].forEach(x=>B(x,0,.1,5.7,.06,.02,lc));
[-4.5,4.5].forEach(x=>{C(x,0,.06,.06,3,0x555555);B(x-Math.sign(x)*.1,0,.08,1.4,2.7,.9,lc)})}
if(t==='spa'){const wc=it.c1!=null?it.c1:0xC9B79A,rc=it.c2!=null?it.c2:0x3A2E26;B(-1,0,3,4,0,2.8,wc);B(-1,0,3.4,4.4,2.8,.25,rc);B(-.6,2.02,2,.1,.4,2.1,0x86B9CF);B(-2,2.02,.7,.12,.4,2.1,0x5A3A22);
C(1.5,0,1,0,.85,0x8B6B3E);C(1.5,0,.85,.85,.05,0x35B6E8);B(1.5,1.5,1.2,.4,0,.3,0xA9794B)}
if(t==='battery'){const bc=it.c1!=null?it.c1:0xE4E2DC,pc=it.c2!=null?it.c2:0x2E5C8A;B(0,0,2,1.5,0,.12,0x9AA3A1);B(0,0,1.6,.9,.12,1.6,bc);B(0,.46,1.2,.04,.5,.9,pc);B(.5,.47,.2,.04,1.3,.15,0x4FD18B);B(0,0,1.7,1,1.72,.08,sh(bc,.8))}
if(t==='veg'){const bc=it.c1!=null?it.c1:0xA9794B,pc=it.c2!=null?it.c2:0x4FA04A;B(0,0,6,4,0,.05,0xD2C29A);[-2,0,2].forEach(x=>{B(x,0,1.4,3.4,.05,.3,bc);B(x,0,1.2,3.2,.35,.03,0x5A3F2A);[-1.2,-.6,0,.6,1.2].forEach((z,i)=>{O(x-.3,.55,z,.2,pc);O(x+.3,.55,z+.2,.2,i%2?sh(pc,.85):0xD94A3A)})})}
if(t==='pergola'){const wc=it.c1!=null?it.c1:0xA9794B,vc=it.c2!=null?it.c2:0x4FA04A;B(0,0,4,3,0,.1,0xCFC8B8);[[-1.8,-1.3],[1.8,-1.3],[-1.8,1.3],[1.8,1.3]].forEach(q=>C(q[0],q[1],.1,.1,2.3,wc));B(0,-1.3,4.2,.18,2.4,.2,wc);B(0,1.3,4.2,.18,2.4,.2,wc);[-1.6,-.8,0,.8,1.6].forEach(x=>B(x,0,.12,3,2.6,.08,wc));[[-1.2,-.4],[0,.5],[1.2,-.2],[.6,-.9]].forEach(q=>O(q[0],2.75,q[1],.4,vc));B(0,-1.05,3,.5,.1,.45,sh(wc,.9))}
if(t==='well'){const sc=it.c1!=null?it.c1:0x8E8A82,rc=it.c2!=null?it.c2:0x6B4A2F;C(0,0,.7,0,.8,sc);C(0,0,.5,.8,.03,0x1B3A63);[-.62,.62].forEach(x=>C(x,0,.05,.8,1.3,rc));G(0,0,1.6,1.2,2.1,.5,rc,sh(rc,.8),.1);C(0,0,.03,1.1,.9,0x555555)}
if(t==='woodshed'){const wc=it.c1!=null?it.c1:0xA9794B,rc=it.c2!=null?it.c2:0x4A3B2E;B(0,-.8,4,.1,0,2,wc);[-1.95,1.95].forEach(x=>B(x,0,.1,1.8,0,2,wc));Pp(shedF(0,0,4.4,2.2,2,.6,rc,wc));B(-1,.1,1.8,1.2,.1,1.1,0x8B5A32);B(1,.1,1.8,1.2,.1,.8,0x7A4A28);[0,.4,.8].forEach(y=>B(-1,.1,1.8,1.22,.1+y,.03,0x5A3A22))}
if(t==='coop'){const wc=it.c1!=null?it.c1:0xD9B77A,rc=it.c2!=null?it.c2:0xB5532F;[[-1.2,-.7],[-.1,-.7],[-1.2,.5],[-.1,.5]].forEach(q=>C(q[0],q[1],.05,0,.5,0x6B4A2F));B(-.65,-.1,1.6,1.5,.5,1.1,wc);G(-.65,-.1,1.6,1.5,1.6,.55,rc,sh(wc,.8),.1);B(-.65,.66,.5,.06,.6,.6,0x5A3A22);B(.85,1.2,1.35,.04,0,.8,0xBFC5CA,.4);B(.85,-1,1.35,.04,0,.8,0xBFC5CA,.4);B(1.5,.1,.04,2.2,0,.8,0xBFC5CA,.4);O(.7,.18,.3,.16,0xFFFFFF);O(.7,.32,.3,.07,0xD94A3A);O(1.1,.18,-.2,.16,0xE8C27A)}
if(t==='fountain'){const sc=it.c1!=null?it.c1:0xBDB8AC,wc=it.c2!=null?it.c2:0x6FC7E8;C(0,0,1.4,0,.45,sc);C(0,0,1.22,.45,.04,wc);C(0,0,.28,.45,1,sc);C(0,0,.65,1.35,.14,sc);C(0,0,.5,1.49,.04,wc);C(0,0,.12,1.5,.45,sc);C(0,0,.3,1.95,.1,sc);[0,1,2,3,4,5].forEach(i=>{const a=i/6*6.2832;O(Math.cos(a)*.55,1.75,Math.sin(a)*.55,.08,wc)});O(0,2.3,0,.14,wc)}
if(t==='guest'){const wc=it.c1!=null?it.c1:0xE8DCC4,rc=it.c2!=null?it.c2:0x4A3B2E;B(0,0,6.2,5.2,0,.3,0x8A8D8F);B(0,0,6,5,.3,2.6,wc);G(0,0,6,5,2.9,1.7,rc,sh(rc,1.5),.45);B(-1.6,2.52,1.1,.12,.3,2.1,0x5A3A22);B(1.4,2.52,1.6,.12,.9,1.2,0x86B9CF);[-1,1].forEach(s=>B(s*3.01,0,.12,2,.9,1.2,0x86B9CF));B(-1.6,2.8,1.8,.8,0,.14,0xBDB6A6);B(1.8,-1.2,.8,.8,2.9,1.2,0x8A6A55)}
if(t==='lounge'){const dc=it.c1!=null?it.c1:0xB88A5A,uc=it.c2!=null?it.c2:0xE9A765;B(0,0,4,3.5,0,.15,dc);[-1.1,.2].forEach(x=>{B(x,0,.7,1.8,.15,.22,0xF4EFE6);B(x,-.8,.7,.15,.37,.5,0xF4EFE6)});B(1.4,.2,.7,.7,.15,.4,sh(dc,.8));C(1.4,.2,.04,.15,2.2,0x666666);o.push({t:'U',x:1.4,z:.2,y:2.3,r:1.2,c:uc})}
if(t==='parking'){const a=it.c1!=null?it.c1:0xC9CED3,b=it.c2!=null?it.c2:0x2E4A6B;B(0,0,6,5,0,.05,0xB5B1A6);B(0,0,.08,4.6,.05,.01,0xFFFFFF);[[-1.5,a],[1.5,b]].forEach(q=>{const x=q[0],c=q[1];B(x,0,1.9,4.2,.12,.6,c);B(x,-.2,1.6,2.2,.72,.5,0x86B9CF);[-.85,.85].forEach(dx=>[-1.3,1.3].forEach(dz=>B(x+dx,dz,.2,.6,.05,.5,0x111111)))})}
if(t==='solar')o.push({t:'SP',w:4,d:2,c:it.c1!=null?it.c1:0x1B3A63,f:it.c2!=null?it.c2:0xB8BEC4});
return o}
