// 原创 SVG 插画：同一套几何造型，按主题渲染成三种画风
// s = 水彩手账（细墨线+透明水彩） f = 孟菲斯漫画（粗黑线+平涂+网点+错位阴影） v = 梵高（厚涂短笔触+旋涡）
(function(){
const PAL={
 s:{line:'#5b5048',a:'#c98b8b',b:'#8fa88a',c:'#d9b26f',d:'#9aa7c4',e:'#f6efe3',o:'#d79a6a',g:'#8fa88a',bg:'#efe3d6'},
 f:{line:'#111111',a:'#ff5fa8',b:'#30d5ea',c:'#ffe14d',d:'#a17cff',e:'#ffffff',o:'#ff8a3d',g:'#b8f04a',bg:'#30d5ea'},
 v:{line:'#13235a',a:'#e0663a',b:'#3b6fc0',c:'#ffd54a',d:'#2a4a9a',e:'#fdf4d8',o:'#e8873a',g:'#7fb069',bg:'#1d2f6f'}};
let uid=0;
function mix(h,t,k){const p=x=>parseInt(x,16);const a=[1,3,5].map(i=>p(h.substr(i,2))),b=[1,3,5].map(i=>p(t.substr(i,2)));return'#'+a.map((v,i)=>Math.round(v+(b[i]-v)*k).toString(16).padStart(2,'0')).join('')}
// 伪随机（固定种子，保证每次一样）
function rng(seed){let s=seed;return()=>(s=(s*16807)%2147483647)/2147483647}
const P=(x,y,r,n=5,inner=.45,rot=-90)=>{let d='';for(let i=0;i<n*2;i++){const rr=i%2?r*inner:r,a=(rot+i*180/n)*Math.PI/180;d+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1)}return d+'Z'};
const C=(x,y,r)=>`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`;
const heart=(x,y,s)=>`M${x} ${y+s*.9}C${x-s*1.3} ${y+s*.1} ${x-s} ${y-s*.9} ${x} ${y-s*.3}C${x+s} ${y-s*.9} ${x+s*1.3} ${y+s*.1} ${x} ${y+s*.9}Z`;
// 形状：[路径, 填色角色|null(仅线条), 线条色角色(可选), 线宽倍数]
const M={
 comet:[['M58 40Q34 58 10 90Q28 56 54 32Z','d'],[C(66,30,13),'c'],['M8 72C22 62 32 82 46 72S72 60 92 74',null,'a',2.2],['M8 78C22 68 32 88 46 78S72 66 92 80',null,'a',1.2],[P(26,22,5,4,.4),'c']],
 lantern:[['M50 6V22',null],['M40 20h20v7H40Z','d'],['M34 28Q50 20 66 28Q76 50 66 74Q50 82 34 74Q24 50 34 28Z','a'],['M50 27V77M41 29Q33 50 41 75M59 29Q67 50 59 75',null],['M42 76h16v7H42Z','d'],['M46 83l-2 12M50 83v13M54 83l2 12',null,'a']],
 bow:[['M50 48L18 30Q10 48 18 66Z','a'],['M50 48L82 30Q90 48 82 66Z','a'],['M46 54L36 86L44 82L48 58Z','a'],['M54 54L64 86L56 82L52 58Z','a'],[C(50,48,8),'c'],[P(86,16,5,4,.4),'c'],[P(14,84,4,4,.4),'b']],
 quill:[['M12 66Q31 57 50 66Q69 57 88 66V82Q69 73 50 82Q31 73 12 82Z','e'],['M50 66V82M20 68Q31 64 42 68M58 68Q69 64 80 68',null],['M56 60Q60 28 86 10Q82 40 62 58Z','b'],['M56 64L84 14',null],[C(26,40,6),'c']],
 cat:[['M32 86Q28 62 36 50L32 28L44 40Q50 38 56 40L68 28L64 50Q72 62 68 86Z','e'],['M68 82Q86 80 82 60',null,null,1.4],['M42 54q3-3 6 0M52 54q3-3 6 0M48 62h4',null],['M72 20Q90 14 92 34Q74 40 72 20Z','b'],['M74 22L90 32',null]],
 starplanet:[[P(62,36,26),'c'],[C(26,72,13),'d'],['M8 76Q26 62 46 68',null,null,1.3],[P(84,78,5,4,.4),'a'],[P(18,20,4,4,.4),'a']],
 ball:[[C(50,54,32),'o'],['M18 54H82M50 22V86M28 32Q44 54 28 76M72 32Q56 54 72 76',null],['M8 30h10M6 42h8M82 16l6-6',null,'a',1.2]],
 moonfan:[['M64 10A28 28 0 1 0 92 44A21 21 0 1 1 64 10Z','c'],['M40 90L10 56Q34 34 68 50Z','a'],['M40 90L16 52M40 90L28 44M40 90L42 42M40 90L56 44',null],[P(24,20,4,4,.4),'c']],
 flame:[['M50 88Q22 82 26 58Q30 44 40 36Q40 50 50 54Q44 34 56 14Q64 38 72 50Q80 64 74 76Q66 88 50 88Z','o'],['M50 84Q38 80 40 68Q44 60 50 56Q58 66 60 72Q60 82 50 84Z','c'],[P(16,24,5,4,.4),'c'],[P(86,30,4,4,.4),'c']],
 sprout:[['M28 52H52V72H74Q82 72 82 80V88H28Z','d'],['M28 60H52',null],['M42 52Q42 36 46 26',null,null,1.2],['M46 30Q28 20 28 34Q38 40 46 30Z','g'],['M46 28Q62 14 66 28Q56 36 46 28Z','g']],
 blossom:[['M16 88L64 34',null,'c',2.6],[C(66,18,9),'a'],[C(82,30,9),'a'],[C(76,48,9),'a'],[C(56,48,9),'a'],[C(52,28,9),'a'],[C(67,34,6),'c'],[C(26,72,3),'a']],
 ufo:[['M38 54Q38 34 50 34Q62 34 62 54Z','b'],['M14 60Q50 42 86 60Q50 76 14 60Z','d'],[C(32,62,3),'c'],[C(50,66,3),'c'],[C(68,62,3),'c'],['M36 74L28 90M64 74L72 90',null,'c'],[heart(50,20,7),'a']],
 dooropen:[['M30 18H72V88H30Z','e'],['M30 18L14 26V94L30 88Z','a'],[heart(52,50,10),'a'],['M80 30l8-6M82 50h10M80 70l8 6',null,'c']],
 doorhalf:[['M30 18H72V88H30Z','e'],['M30 18L52 24V92L30 88Z','c'],[C(47,56,2.5),'d'],['M58 50l8 0',null,'a']],
 lock:[['M34 48V34A16 16 0 0 1 66 34V48',null,null,2],['M26 48H74V88H26Z','d'],[C(50,64,6),'e'],['M50 68V78',null,null,1.6]],
 sig_near:[['M34 8H66V92H34Z','e'],[C(50,24,9),'n'],[C(50,50,9),'n'],[C(50,76,10),'g'],['M72 76h10M70 66l8-6M70 86l8 6',null,'g']],
 sig_chance:[['M34 8H66V92H34Z','e'],[C(50,24,9),'n'],[C(50,50,10),'c'],[C(50,76,9),'n'],['M72 50h10M70 40l8-6M70 60l8 6',null,'c']],
 sig_slow:[['M34 8H66V92H34Z','e'],[C(50,24,10),'d'],[C(50,50,9),'n'],[C(50,76,9),'n'],['M72 24h10M70 14l8-6M70 34l8 6',null,'d']],
 lens:[['M60 62L86 88',null,null,3],[C(42,42,26),'e'],[heart(42,42,10),'a']],
 popper:[['M16 88L34 38L64 68Z','a'],['M22 72L46 52M28 84L56 62',null,'c',1.4],[C(66,20,5),'c'],[C(84,40,4),'b'],[P(52,14,6,4,.4),'d'],['M70 52Q80 48 86 58M44 28Q42 16 52 8',null,'g',1.4]],
 pencil:[['M10 70L58 22L74 38L26 86L8 90Z','c'],['M58 22L66 14Q70 10 74 14L82 22Q86 26 82 30L74 38Z','a'],['M8 90L12 76L22 86Z','line']],
 sunflower:[...Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,x=50+28*Math.cos(a),y=50+28*Math.sin(a);return[`M50 50Q${(50+20*Math.cos(a-0.5)).toFixed(1)} ${(50+20*Math.sin(a-0.5)).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Q${(50+20*Math.cos(a+0.5)).toFixed(1)} ${(50+20*Math.sin(a+0.5)).toFixed(1)} 50 50Z`,'c']}),[C(50,50,15),'o'],['M44 46h0M52 44h0M56 52h0M46 56h0',null,null,2]],
 bulb:[['M50 12A24 24 0 0 1 64 56V66H36V56A24 24 0 0 1 50 12Z','c'],['M38 72H62M40 80H60M44 88H56',null],['M14 30l8 4M86 30l-8 4M50 2v4',null,'o']],
 spark:[[P(50,50,40,4,.28),'c']],
 heart:[[heart(50,52,30),'a']],
 star:[[P(50,52,40),'c']],
 flower:[[C(50,22,14),'d'],[C(76,40,14),'d'],[C(66,72,14),'d'],[C(34,72,14),'d'],[C(24,40,14),'d'],[C(50,50,12),'c']],
 camera:[['M14 34H32L38 24H62L68 34H86V80H14Z','e'],[C(50,56,15),'d'],[C(50,56,7),'e'],[heart(76,44,4),'a']],
 envelope:[['M8 22H92V82H8Z','e'],['M10 24L50 56L90 24',null],[heart(50,48,11),'a']]
};
const SW=[];{const r=rng(11);for(let i=0;i<70;i++){const x=r()*100,y=r()*100,a=r()*6.28,l=6+r()*8;SW.push(`M${x.toFixed(1)} ${y.toFixed(1)}q${(Math.cos(a)*l/2+Math.sin(a)*3).toFixed(1)} ${(Math.sin(a)*l/2-Math.cos(a)*3).toFixed(1)} ${(Math.cos(a)*l).toFixed(1)} ${(Math.sin(a)*l).toFixed(1)}`)}}
function backdrop(t,p,id){
 if(t==='s')return `<path d="M50 6C76 4 96 24 94 50C92 78 72 96 46 94C20 92 4 72 8 46C10 22 26 8 50 6Z" fill="${p.a}" opacity=".16"/><path d="M54 12C78 14 92 34 88 58C84 82 62 92 40 88C18 84 8 62 14 40C18 22 36 10 54 12Z" fill="${p.c}" opacity=".14"/>`;
 if(t==='f')return `<circle cx="53" cy="53" r="46" fill="#111"/><circle cx="50" cy="50" r="46" fill="${p.bg}" stroke="#111" stroke-width="3"/><circle cx="50" cy="50" r="46" fill="url(#ht${id})"/>`;
 let s=`<circle cx="50" cy="50" r="48" fill="${p.bg}"/>`;const r=rng(5);
 for(let k=0;k<6;k++){const rr=12+k*6.5;s+=`<circle cx="50" cy="50" r="${rr}" fill="none" stroke="${k%2?'#3b6fc0':'#6f9be0'}" stroke-width="3" stroke-dasharray="${(6+r()*6).toFixed(0)} ${(3+r()*4).toFixed(0)}" stroke-linecap="round" opacity=".8"/>`}
 return s+`<circle cx="50" cy="50" r="47" fill="none" stroke="${p.c}" stroke-width="3"/>`;
}
window.ICON=function(name,t,size,bg){if(typeof bg==="string"){PAL.f.bg=PAL.f[bg]||PAL.f.bg}else if(bg)PAL.f.bg="#30d5ea";
 const p=PAL[t],sh=M[name],id=++uid;if(!sh)return'';const lw={s:1.6,f:3,v:2.2}[t];
 let defs='',body='';
 if(t==='f')defs+=`<pattern id="ht${id}" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.1" fill="#111" opacity=".22"/></pattern>`;
 const col=r=>r==='n'?(t==='v'?'#4a5a8a':mix(p.line,'#ffffff',.78)):r==='line'?p.line:p[r];
 sh.forEach((s,i)=>{const [d,fr,lr,w]=s;const stroke=lr?col(lr):p.line,sw=lw*(w||1);
  if(!fr){body+=`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${t==='v'?' stroke-dasharray="7 2.5"':''}/>`;return}
  const f=col(fr);
  if(t==='s'){body+=`<path d="${d}" fill="${f}" opacity=".62" transform="translate(2.2 2)"/><path d="${d}" fill="${f}" opacity=".5"/><path d="${d}" fill="none" stroke="${p.line}" stroke-width="${lw}" stroke-linejoin="round" stroke-linecap="round"/>`}
  else if(t==='f'){body+=`<path d="${d}" fill="#111" transform="translate(3 3)"/><path d="${d}" fill="${f}" stroke="#111" stroke-width="${lw}" stroke-linejoin="round"/>`+(i===0&&fr!=='e'?`<path d="${d}" fill="url(#ht${id})"/>`:'')}
  else{defs+=`<clipPath id="c${id}_${i}"><path d="${d}"/></clipPath>`;
   body+=`<path d="${d}" fill="${f}"/><g clip-path="url(#c${id}_${i})" stroke-linecap="round" fill="none">`+SW.map((q,j)=>`<path d="${q}" stroke="${j%2?mix(f,'#ffffff',.35):mix(f,'#13235a',.25)}" stroke-width="3"/>`).join('')+`</g><path d="${d}" fill="none" stroke="${p.line}" stroke-width="${lw}" stroke-linejoin="round"/>`}
 });
 return `<svg class="ic" width="${size}" height="${size}" viewBox="${bg?'0 0 100 100':'-4 -4 108 108'}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${bg?backdrop(t,p,id):''}${bg?'<g transform="translate(16 16) scale(.68)">'+body+'</g>':body}</svg>`;
};
})();
