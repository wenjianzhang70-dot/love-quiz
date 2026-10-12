/* 系列方向通用引擎：爱情观 / 生活 / 工作。数据在 sx-*.js 里注册到 window.SX */
(function(){
var $=function(s){return document.querySelector(s)},W=window,SX=W.SX=W.SX||{};
var ORDER=['love','life','work'],NUM=['壹','贰','叁','肆'];
// —— 原创毛毡小图（不用官方形象）——
var C=function(x,y,r,f){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"/>'},P=function(d,f,s){return '<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"':'')+'/>'};
var M={
 yarn:C(50,54,28,'#ffb3c6')+P('M26 44q24 10 48 0M24 58q26 10 52 0M36 30q10 24 6 50M60 28q-6 26 4 52',0,'#fff')+P('M76 70q10 6 14 20',0,'#ffb3c6'),
 balloon:P('M50 12c20 0 30 16 30 30 0 18-18 30-30 34-12-4-30-16-30-34 0-14 10-30 30-30Z','#ffd6a5')+P('M38 16q12 30 0 58M62 16q-12 30 0 58',0,'#fff')+P('M42 80h16v12H42Z','#d9b48a')+P('M44 76l-2 6M56 76l2 6',0,'#b08a6a'),
 plant:P('M30 64h40l-6 26H36Z','#f2b8a0')+P('M50 64V40',0,'#8cc6ad')+P('M50 46c-16-2-20-16-18-22 12 0 18 10 18 22ZM50 40c4-16 18-20 24-16-2 12-12 18-24 16Z','#a9dcc1'),
 firework:C(50,46,6,'#ffd76a')+P('M50 14v16M50 62v16M18 46h16M66 46h16M27 23l11 11M62 58l11 11M73 23 62 34M38 58 27 69',0,'#ff9fbb')+C(50,14,4,'#c9b8f0')+C(82,46,4,'#a9dcc1')+C(18,46,4,'#ffd76a'),
 light:P('M40 88l4-50h12l4 50Z','#fff')+P('M42 56h16M41 72h18',0,'#ffb3c6')+P('M38 38h24l-4-12H42Z','#ffd76a')+P('M14 26l18 6M86 26l-18 6',0,'#ffe9a8'),
 letter:P('M14 30h72v46H14Z','#fff4ee')+P('M14 30l36 26 36-26',0,'#e0a8b6')+P('M50 52c-7-5-7-10-4-11 2-1 3 0 4 2 1-2 2-3 4-2 3 1 3 6-4 11Z','#ff9fbb'),
 cat:P('M28 86c-4-24 2-36 8-42l-4-20 12 12c4-2 8-2 12 0l12-12-4 20c6 6 12 18 8 42Z','#f6e3d4')+P('M42 56q3-3 6 0M52 56q3-3 6 0M47 64h6',0,'#8a6a72')+P('M72 82c14-2 16-16 10-24',0,'#f6e3d4'),
 bike:C(28,68,14,'none').replace('fill="none"','fill="none" stroke="#9cc9b0" stroke-width="5"')+C(72,68,14,'none').replace('fill="none"','fill="none" stroke="#9cc9b0" stroke-width="5"')+P('M28 68l16-26h20l8 26M44 42l10 26h18M38 34h12M60 36h10',0,'#e98aa3')+P('M50 22c-5-4-5-7-3-8 1-1 2 0 3 1 1-1 2-2 3-1 2 1 2 4-3 8Z','#ff9fbb'),
 leaf:P('M50 86C20 70 20 34 50 14c30 20 30 56 0 72Z','#a9dcc1')+P('M50 84V26M50 50l-12-10M50 62l12-10',0,'#fff'),
 table:P('M16 52h68v8H16Z','#e8c9a8')+P('M24 60v28M76 60v28',0,'#d0ab88')+C(36,44,8,'#fff4ee')+C(64,44,8,'#fff4ee')+C(50,40,7,'#ffd6a5'),
 broom:P('M66 14 40 64',0,'#d0ab88')+P('M30 60l18 8-6 22c-10-2-18-8-22-16Z','#ffd76a')+C(76,28,5,'#c9b8f0')+C(24,30,4,'#a9dcc1'),
 bag:P('M24 40h52l-4 44H28Z','#ffb3c6')+P('M38 40c0-18 24-18 24 0',0,'#e98aa3')+P('M46 60h8',0,'#fff')+P('M70 22l4 8 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2Z','#ffd76a'),
 lantern:P('M34 30q16-8 32 0 10 22 0 46-16 8-32 0-10-24 0-46Z','#ffd6a5')+P('M50 22v-10M42 80h16v8H42Z','#d9b48a')+P('M50 30v46',0,'#fff'),
 bowl:P('M18 50h64c0 20-14 32-32 32S18 70 18 50Z','#f6e3d4')+P('M34 40q4-10 0-20M50 40q4-10 0-20M66 40q4-10 0-20',0,'#e0c6c8'),
 suit:P('M28 30h44l8 56H20Z','#c9d8f0')+P('M40 30l10 18 10-18',0,'#fff')+P('M50 48v36',0,'#9fb3d1')+C(50,58,3,'#fff'),
 bucket:P('M28 40h44l-6 46H34Z','#bfe3cf')+P('M28 40c0-20 44-20 44 0',0,'#8cc6ad')+P('M38 56h24',0,'#fff'),
 ball:C(50,52,32,'#ffc4a0')+P('M18 52h64M50 20v64M28 30q16 22 0 44M72 30q-16 22 0 44',0,'#fff'),
 book:P('M14 30q18-8 36 2v54q-18-10-36-2Z','#e2d9fb')+P('M86 30q-18-8-36 2v54q18-10 36-2Z','#ffd6e3')+P('M70 14l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1Z','#ffd76a'),
 badge:P('M50 12l30 10v24c0 20-14 34-30 40-16-6-30-20-30-40V22Z','#ffd6a5')+P('M38 48l8 8 16-18',0,'#fff'),
 chef:P('M28 46c-12 0-12-20 2-18 2-14 18-16 22-6 6-10 22-6 20 6 14-2 14 18 0 18Z','#fff')+P('M30 46h40v14H30Z','#f6e3d4')+C(50,74,10,'#ffb3c6'),
 robot:P('M26 46h48v34H26Z','#ffd76a')+C(40,36,9,'#e2d9fb')+C(60,36,9,'#e2d9fb')+C(40,36,3,'#6a5a98')+C(60,36,3,'#6a5a98')+P('M34 60h32',0,'#c99a2a'),
 fire:P('M50 86C28 82 26 62 34 52c0 10 6 14 10 14-6-16 2-34 14-44 0 16 12 22 16 34 6 18-6 30-24 30Z','#ffb38a')+P('M50 82c-8-2-10-10-6-16 2 4 6 6 8 4 2-6 6-8 8-8 2 12-2 20-10 20Z','#ffe9a8')
};
function shape(k,size,bg){return '<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'"><circle cx="50" cy="50" r="49" fill="'+(bg||'#fff5f0')+'"/>'+(M[k]||M.yarn)+'</svg>'}
W.SXSHAPE=shape;
// —— 抽题：10 题，各维 2–3，同组互斥，优先没见过的 ——
// 10 局一轮的配额表：每维 10 局合计正好 25 题，100 题库一轮刚好用完
var SCHED=[[3,3,2,2],[2,2,3,3],[3,2,3,2],[2,3,2,3],[3,2,2,3],[2,3,3,2],[3,3,2,2],[2,2,3,3],[3,2,3,2],[2,3,2,3]];
function sh(a,r){for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function pickSet(bank,dims,quota,seen,r){var rank={},left={};seen.forEach(function(id,i){rank[id]=i});
  bank.forEach(function(x){if(!(x.id in rank))left[x.g]=(left[x.g]||0)+1});var best=null,bs=1e9;
  for(var t=0;t<40&&bs>0;t++){var out=[],gs={},rep=0;
    sh(dims.map(function(d,k){return k}),r).forEach(function(k){var d=dims[k],need=quota[k],c=sh(bank.filter(function(x){return x.d===d}),r);
      var fresh=c.filter(function(x){return !(x.id in rank)}).sort(function(a,b){return left[b.g]-left[a.g]+(r()-.5)*(t?1.5:0)}),
          old=c.filter(function(x){return x.id in rank}).sort(function(a,b){return rank[a.id]-rank[b.id]});
      fresh.forEach(function(x){if(need>0&&!gs[x.g]){gs[x.g]=1;out.push(x);need--}});
      old.forEach(function(x){if(need>0&&!gs[x.g]){gs[x.g]=1;out.push(x);need--;rep++}});
      if(need>0)rep+=100});
    if(rep<bs){bs=rep;best=out}}
  return sh(best,r)}
function draw(key,seen,play,r){r=r||Math.random;var D=SX[key];return pickSet(D.bank,Object.keys(D.dims),SCHED[(play||0)%10],seen,r)}
function next(key){var k='lq-seen-'+key,s={ids:[],n:0},st=null;try{st=W.localStorage;s=JSON.parse(st.getItem(k)||'{"ids":[],"n":0}')}catch(e){st=null;s=(W.__sxMem||{})[key]||{ids:[],n:0}}
  var qs=draw(key,s.ids,s.n||0);s.ids=s.ids.concat(qs.map(function(x){return x.id})).slice(-SX[key].bank.length);s.n=(s.n||0)+1;
  try{st.setItem(k,JSON.stringify(s))}catch(e){(W.__sxMem=W.__sxMem||{})[key]=s}return qs}
W.SXPICK=pickSet;
function score(key,qs,ans){var D=SX[key],s={},n={};Object.keys(D.dims).forEach(function(k){s[k]=0;n[k]=0});
  ans.forEach(function(a,i){var sc=qs[i].opts[a][1];for(var k in sc){s[k]+=sc[k];n[k]+=2}});var r={};for(var k in s)r[k]=n[k]?s[k]/n[k]:.5;return r}
function hsh(t){var h=2166136261;for(var i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967296}
// 同一组答案结果稳定：用答案算出的固定微扰打破平局，让分布更均匀
function pickRes(key,r){var D=SX[key],best,bd=1e9,sig=Object.keys(r).map(function(k){return r[k].toFixed(3)}).join(',');D.results.forEach(function(x){var d=((D.bias&&D.bias[x.id])||0)+hsh(sig+x.id)*0.04;for(var k in x.p)d+=Math.pow(x.p[k]/2-r[k],2);if(d<bd){bd=d;best=x}});return best}
W.SXE={draw:draw,next:next,score:score,pick:pickRes,ORDER:ORDER};
if(typeof document==='undefined'||!document.getElementById('sxQuiz'))return;
// —— 页面 ——
var key,qs,idx,ans,lastR;
function vib(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function show(id){document.querySelectorAll('.page').forEach(function(p){p.classList.toggle('show',p.id===id)});scrollTo(0,0)}
function home(){document.body.className=/theme=vangogh/.test(location.search)?'vg':'';show('start')}
function start(k){key=k;var D=SX[k];document.body.className='t-sx t-sx-'+k+(/theme=vangogh/.test(location.search)?' vg':'');qs=next(k);idx=0;ans=[];
  $('#sxChip').innerHTML='<span>'+D.name+'</span>';render();show('sxQuiz')}
function render(){var q=qs[idx];$('#sxCount').textContent=(idx+1)+' / '+qs.length;var w=(idx/qs.length*100)+'%';$('#sxBar').style.width=w;
  var qc=$('#sxQcard');qc.classList.remove('flip');void qc.offsetWidth;qc.classList.add('flip');$('#sxQ').textContent=q.q;var o=$('#sxOpts');o.innerHTML='';
  q.opts.forEach(function(op,i){var b=document.createElement('button');b.className='opt'+(ans[idx]===i?' on':'');b.innerHTML='<b>'+'ABCD'[i]+'</b><span>'+op[0]+'</span>';
    b.onpointerdown=function(){vib(12)};b.onclick=function(){pick(i)};o.appendChild(b)});$('#sxBack').style.visibility=idx?'visible':'hidden'}
function pick(i){ans[idx]=i;vib([8,30,8]);$('#sxOpts').querySelectorAll('.opt').forEach(function(b,k){b.classList.toggle('on',k===i)});
  setTimeout(function(){if(idx<qs.length-1){idx++;render()}else result()},160)}
function pole(D,r){var best=null,bv=-1;for(var k in D.dims){var v=Math.abs(r[k]-.5);if(v>bv){bv=v;best=k}}return D.dims[best][r[best]>=.5?0:1]+'派'}
function result(){var D=SX[key],r=score(key,qs,ans),x=pickRes(key,r);lastR=r;
  var sec=function(n,h,b){return '<div class="sec sxs'+n+'"><h4>'+NUM[n]+' · '+h+'</h4>'+b+'</div>'};
  var mod=D.module(r,x);
  $('#sxCard').innerHTML='<div class="head"><span class="badge">'+D.name+' · 人间选择题</span>'+
   '<div class="portrait">'+shape(x.shape,132,D.soft)+'</div><p class="you">'+D.youText+'</p><h3 class="cname">'+x.name+'</h3>'+
   '<p class="fp"><small>你的选择指纹</small>'+[x.short,pole(D,r),x.fp].join(' · ')+'</p>'+
   '<div class="stage">像'+x.from+'里<br>'+x.stage+'</div></div>'+
   sec(0,D.sec[0],'<p>'+x.text+'</p>')+sec(1,mod.title,mod.html)+sec(2,D.sec[2],x.fun.map(function(f){return '<p class="li">'+f+'</p>'}).join(''))+
   (D.extra?D.extra(r,x):'')+
   '<div class="hook">'+D.hook+'</div><div class="foot">仅供娱乐，不是心理测评、性格诊断'+(D.footX||'')+'。<br>角色只是有趣类比，答题在本地完成，不收集个人信息。</div>';
  var nx=ORDER.slice(ORDER.indexOf(key)+1).concat(ORDER).filter(function(k){return k!==key&&SX[k]&&SX[k].live})[0];
  $('#sxNext').hidden=!nx;if(nx){$('#sxNext').textContent='再开一扇门：'+SX[nx].name;$('#sxNext').onclick=function(){start(nx)}}
  if(D.after)D.after(r,x);show('sxResult')}
function loadH2C(){return W.html2canvas?Promise.resolve():new Promise(function(ok,no){var s=document.createElement('script');s.src='vendor/html2canvas.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
document.querySelectorAll('.sdoor[data-sx]').forEach(function(b){var k=b.dataset.sx;if(!SX[k]||!SX[k].live)return;b.disabled=false;b.classList.remove('soon');b.classList.add('live');
  b.querySelector('small').textContent=SX[k].doorSub;b.onclick=function(){vib(12);b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');setTimeout(function(){start(k)},160)}});
$('#sxBack').onclick=function(){if(idx>0){idx--;render()}};$('#sxHome').onclick=home;$('#sxAgain').onclick=function(){start(key)};
$('#sxClose').onclick=function(){$('#sxPrev').classList.add('hide')};
$('#sxSave').onclick=function(){loadH2C().then(function(){return document.fonts.ready}).then(function(){return html2canvas($('#sxCard'),{scale:2,backgroundColor:null})}).then(function(c){
  var u=c.toDataURL('image/png');$('#sxImg').src=u;$('#sxPrev').classList.remove('hide');var a=document.createElement('a');a.href=u;a.download='我的'+SX[key].name+'结果.png';if(!/MicroMessenger|xhs|discover/i.test(navigator.userAgent))a.click()}).catch(function(){alert('请直接截图保存～')})};
W.__sx={start:start,pick:pick,r:function(){return lastR}};
var m=/[?&]pair=(love)-(\d{4})/.exec(location.search);if(m&&SX.love&&SX.love.live){W.__sxPair=m[2];setTimeout(function(){start('love')},50)}
})();
