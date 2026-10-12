var CUR=[];
(function(){
const $=s=>document.querySelector(s);
let mode,idx,answers;
const VG=/theme=vangogh/.test(location.search);
const T=()=>VG?'v':(mode==='funny'?'f':'s');
function paint(root){(root||document).querySelectorAll('[data-ic]').forEach(el=>{const t=el.dataset.t&&!VG?el.dataset.t:(VG?'v':(el.dataset.t||'s'));el.innerHTML=ICON(el.dataset.ic,t,+(el.dataset.size||el.offsetWidth||40))})}
function theme(m){document.body.className=(m?'t-'+m:'')+(VG?' vg':'')}
if(VG){theme();$('#themeLink').href='./';$('#themeText').textContent='回到手绘版';$('#themeLink').firstElementChild.dataset.ic='heart';}
paint();
function show(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('show',p.id===id));scrollTo(0,0)}
function start(m){mode=m;theme(m);idx=0;answers=[];CUR=nextQuiz(m);const t=T();
  $('#modeTag').innerHTML=ICON(QUIZ[m].icon,t,22)+'<span>'+QUIZ[m].name+'</span>';
  $('#pen').innerHTML=ICON(VG?'sunflower':'pencil',t,30);
  $('#qdeco').innerHTML=ICON(m==='funny'?'star':'heart',t,36);
  render();show('quiz')}
function render(){
  const qs=CUR,q=qs[idx];
  $('#count').textContent=(idx+1)+' / '+qs.length;
  const w=(idx/qs.length*100)+'%';$('#barIn').style.width=w;$('#pen').style.left=w;
  const qc=$('#qcard');qc.classList.remove('flip');void qc.offsetWidth;qc.classList.add('flip');
  $('#qdim').textContent=mode==='serious'&&q.d?(DIMLBL[q.d]||q.d):'';
  $('#qtext').textContent=q.q;
  $('#opts').innerHTML='';
  q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt'+(answers[idx]===i?' on':'');
    b.innerHTML='<b>'+'ABCD'[i]+'</b><span>'+o[0]+'</span>';b.onpointerdown=()=>{try{if(navigator.vibrate)navigator.vibrate(12)}catch(e){}};b.onclick=()=>pick(i);$('#opts').appendChild(b)});
  $('#back').style.visibility=idx?'visible':'hidden';
}
function pick(i){
  answers[idx]=i;
  try{if(navigator.vibrate)navigator.vibrate([8,30,8])}catch(e){}
  const btns=[...document.querySelectorAll('#opts .opt')];
  btns.forEach((b,k)=>b.classList.toggle('on',k===i));
  const go=()=>{if(idx<CUR.length-1){idx++;render()}else result()};
  setTimeout(go,160);
}
function score(){
  const s={O:0,I:0,S:0,C:0},n={O:0,I:0,S:0,C:0},src={O:[],I:[],S:[],C:[]};
  answers.forEach((a,qi)=>{const sc=CUR[qi].opts[a][1];for(const k in sc){s[k]+=sc[k];n[k]+=2;src[k].push({qi,v:sc[k]})}});
  const r={};for(const k in s)r[k]=n[k]?s[k]/n[k]:0.5;
  return {r,src};
}
function result(){
  const {r,src}=score(),Q=QUIZ[mode],t=T();
  const status=[...STATUS].reverse().find(x=>r.O>=x.min);
  const sigKey=r.I>=0.6?'near':(r.O>=0.5&&r.C>=0.5?'chance':'slow');
  const sig=SIGNAL[sigKey],tip=sig.tips[Math.floor(Math.random()*sig.tips.length)];
  let best,bd=1e9;Q.chars.forEach(c=>{let d=c.bias||0;for(const k in c.p)d+=Math.pow(c.p[k]/2-r[k],2);if(d<bd){bd=d;best=c}});
  const pct=k=>Math.round(r[k]*100);
  const top=(k,hi)=>src[k].filter(x=>hi?x.v>=1.5:x.v<=0.5).map(x=>'第'+(x.qi+1)+'题').slice(0,3).join('、');
  let basis='';
  if(mode==='serious'){const o=top('O',r.O>=0.5),i=top('I',r.I>=0.5);
    basis='依据：'+(o?o+'显示你'+(r.O>=0.5?'愿意给恋爱机会':'更享受现状'):'')+(i?'；'+i+'显示你'+(r.I>=0.5?'偏主动':'偏等待'):'')+'。'}
  const dims=Object.keys(DIMS).map(k=>'<div>'+DIMS[k]+' '+pct(k)+'%<span><i style="width:'+pct(k)+'%"></i></span></div>').join('');
  const li=(ic,txt,cls)=>'<p class="li '+(cls||'')+'">'+ICON(ic,t,18)+'<span>'+txt+'</span></p>';
  $('#card').innerHTML=
   '<div class="head"><span class="badge">'+ICON(Q.icon,t,16)+Q.name+' · 人间选择题</span>'+
   '<div class="portrait">'+ICON(best.motif,t,132,best.bg)+'</div>'+
   '<p class="you">恋爱后的你，像</p><h3 class="cname">'+best.name+'</h3>'+('<p class="fp"><small>'+(mode==='funny'?'本局标签':'你的选择指纹')+'</small>'+[status.fp,sig.fp,best.fp].filter(Boolean).join(' · ')+'</p>')+
   '<div class="stage">'+best.from+'<br>'+best.stage+'</div></div>'+
   '<div class="sec s1"><h4>壹 · 会不会恋爱</h4><div class="row">'+ICON(status.icon,t,44)+'<div><div class="big">'+status.name+'</div><p>'+status.text+'</p></div></div>'+(mode==='serious'?'<div class="dims">'+dims+'</div>':'')+'</div>'+
   '<div class="sec s2"><h4>贰 · 恋爱信号灯 <small>娱乐向，不是预言</small></h4><div class="row">'+ICON(sig.icon,t,44)+'<div><div class="big">'+sig.name+'</div><p>'+sig.text+'</p></div></div>'+li('bulb',tip,'fun')+'</div>'+
   '<div class="sec s3"><h4>叁 · 恋爱后的你</h4><p>'+best.why+'</p><p class="diff">'+best.diff+'</p>'+best.fun.map(f=>li('spark',f,'fun')).join('')+(basis?'<div class="basis">'+basis+'</div>':'')+'</div>'+
   '<div class="hook">@你的闺蜜，看她先脱单还是你先</div>'+
   '<div class="foot">仅供娱乐，不是心理诊断或感情预测。答题在本地完成，不收集个人信息。<br>角色匹配只是有趣类比，请勿当真。</div>';
  const other=mode==='serious'?'funny':'serious';
  $('#other').innerHTML='换「'+QUIZ[other].name+'」再测一次';
  $('#other').onclick=()=>start(other);
  $('#camIc').innerHTML=ICON('camera',t,24);
  show('result');
}
function loadH2C(){return window.html2canvas?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='vendor/html2canvas.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');try{navigator.vibrate&&navigator.vibrate(12)}catch(e){};setTimeout(()=>start(b.dataset.mode),180)});
$('#back').onclick=()=>{if(idx>0){idx--;render()}};
$('#again').onclick=()=>{mode=null;theme();show('start')};
$('#closePrev').onclick=()=>$('#preview').classList.add('hide');
$('#save').onclick=async()=>{
  try{await loadH2C()}catch(e){alert('请直接截图保存～');return}
  await document.fonts.ready;const c=await html2canvas($('#card'),{scale:2,backgroundColor:null,useCORS:true});
  const url=c.toDataURL('image/png');$('#previewImg').src=url;$('#preview').classList.remove('hide');
  const a=document.createElement('a');a.href=url;a.download='我的恋爱测试结果.png';
  if(!/MicroMessenger|xhs|discover/i.test(navigator.userAgent))a.click();
};
const lt=$('#legalToggle'),lp=$('#legalPanel'),lc=$('#legalClose');
function openLegal(on){if(!lp)return;lp.classList.toggle('hide',!on);lp.hidden=!on;if(lt)lt.setAttribute('aria-expanded',on?'true':'false')}
if(lt)lt.onclick=()=>openLegal(lp.hidden);
if(lc)lc.onclick=()=>openLegal(false);
window.__start=start;window.__pick=pick;
})();
