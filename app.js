(function(){
const $=s=>document.querySelector(s);
let mode,idx,answers;
function show(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('show',p.id===id));scrollTo(0,0)}
function start(m){mode=m;idx=0;answers=[];$('#modeTag').textContent=QUIZ[m].emoji+' '+QUIZ[m].name;render();show('quiz')}
function render(){
  const qs=QUIZ[mode].questions,q=qs[idx];
  $('#count').textContent=(idx+1)+' / '+qs.length;
  $('#barIn').style.width=(idx/qs.length*100)+'%';
  $('#qdim').textContent=mode==='serious'&&q.d?q.d:'';
  $('#qtext').textContent=q.q;
  $('#opts').innerHTML='';
  q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt'+(answers[idx]===i?' on':'');
    b.innerHTML='<b>'+'ABCD'[i]+'</b>'+o[0];b.onclick=()=>pick(i);$('#opts').appendChild(b)});
  $('#back').style.visibility=idx?'visible':'hidden';
}
function pick(i){answers[idx]=i;if(idx<QUIZ[mode].questions.length-1){idx++;setTimeout(render,120)}else result()}
function score(){
  const s={O:0,I:0,S:0,C:0},n={O:0,I:0,S:0,C:0},src={O:[],I:[],S:[],C:[]};
  answers.forEach((a,qi)=>{const sc=QUIZ[mode].questions[qi].opts[a][1];for(const k in sc){s[k]+=sc[k];n[k]+=2;src[k].push({qi,v:sc[k]})}});
  const r={};for(const k in s)r[k]=n[k]?s[k]/n[k]:0.5; // 0~1
  return {r,src};
}
function result(){
  const {r,src}=score(),Q=QUIZ[mode];
  const status=[...STATUS].reverse().find(x=>r.O>=x.min);
  const sigKey=r.I>=0.6?'near':(r.O>=0.5&&r.C>=0.5?'chance':'slow');
  const sig=SIGNAL[sigKey],tip=sig.tips[Math.floor(Math.random()*sig.tips.length)];
  let best,bd=1e9;Q.chars.forEach(c=>{let d=0;for(const k in c.p)d+=Math.pow(c.p[k]/2-r[k],2);if(d<bd){bd=d;best=c}});
  const pct=k=>Math.round(r[k]*100);
  const top=(k,hi)=>src[k].filter(x=>hi?x.v>=1.5:x.v<=0.5).map(x=>'第'+(x.qi+1)+'题').slice(0,3).join('、');
  let basis='';
  if(mode==='serious'){
    const o=top('O',r.O>=0.5),i=top('I',r.I>=0.5);
    basis='依据：'+(o?o+'显示你'+(r.O>=0.5?'愿意给恋爱机会':'更享受现状'):'')+(i?'；'+i+'显示你'+(r.I>=0.5?'偏主动':'偏等待'):'')+'。';
  }
  const dims=Object.keys(DIMS).map(k=>'<div>'+DIMS[k]+' '+pct(k)+'%<span><i style="width:'+pct(k)+'%"></i></span></div>').join('');
  $('#card').innerHTML=
   '<div class="head"><span class="badge">'+Q.emoji+' '+Q.name+'模式 · 恋爱小测验</span>'+
   '<div class="avatar">'+best.emoji+'</div><h3>你是'+best.name+'</h3>'+
   '<div class="stage">'+best.from+' · '+best.stage+'</div></div>'+
   '<div class="sec"><h4>① 会不会恋爱</h4><div class="big">'+status.name+'</div><p>'+status.text+'</p>'+(mode==='serious'?'<div class="dims">'+dims+'</div>':'')+'</div>'+
   '<div class="sec"><h4>② 恋爱信号灯（娱乐向，不是预言）</h4><div class="big">'+sig.name+'</div><p>'+sig.text+'</p><p class="fun">💡 '+tip+'</p></div>'+
   '<div class="sec"><h4>③ 恋爱后的你</h4><p>'+best.why+'</p><p>'+best.diff+'</p>'+best.fun.map(f=>'<p class="fun">✨ '+f+'</p>').join('')+(basis?'<div class="basis">'+basis+'</div>':'')+'</div>'+
   '<div class="hook">@你的闺蜜，看她先脱单还是你先 👀</div>'+
   '<div class="foot">'+(mode==='serious'?'本测试参考常见恋爱沟通与依恋说法，仅供娱乐，不构成心理诊断':'纯属娱乐，请勿当真 · 但可以截图')+'</div>';
  const other=mode==='serious'?'funny':'serious';
  $('#other').textContent='换 '+QUIZ[other].emoji+' '+QUIZ[other].name+' 模式再测，看两边像不像';
  $('#other').onclick=()=>start(other);
  show('result');
}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('#back').onclick=()=>{if(idx>0){idx--;render()}};
$('#again').onclick=()=>show('start');
$('#closePrev').onclick=()=>$('#preview').classList.add('hide');
$('#save').onclick=async()=>{
  if(!window.html2canvas){alert('请直接截图保存～');return}
  const c=await html2canvas($('#card'),{scale:2,backgroundColor:'#fff0f4'});
  const url=c.toDataURL('image/png');$('#previewImg').src=url;$('#preview').classList.remove('hide');
  const a=document.createElement('a');a.href=url;a.download='我的恋爱测试结果.png';
  if(!/MicroMessenger|xhs|discover/i.test(navigator.userAgent))a.click();
};
window.__start=start;window.__pick=pick;
})();
