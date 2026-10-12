const fs=require('fs');global.window=global;
eval(fs.readFileSync(''+__dirname+'/../data.js','utf8'));eval(fs.readFileSync(''+__dirname+'/../bank.js','utf8'));
let ok=true;const stat={};
function run(m,B,label,plays,trials){const rep3=[];let firstRep=[];
 for(let trial=0;trial<trials;trial++){let seen=[];
  for(let p=0;p<plays;p++){const qs=drawQuiz(m,seen,p);const c={};qs.forEach(q=>c[q.d]=(c[q.d]||0)+1);
   if(qs.length!==10||Object.values(c).some(v=>v<2||v>3)||Object.keys(c).length!==4){ok=false;console.log('quota fail',label,c)}
   if(new Set(qs.map(q=>q.g)).size!==10){ok=false;console.log('group dup',label,p)}
   if(new Set(qs.map(q=>q.id)).size!==10){ok=false}
   const rep=qs.filter(q=>seen.includes(q.id)).length;
   if(!firstRep[p])firstRep[p]=0;firstRep[p]+=rep;
   seen=seen.concat(qs.map(q=>q.id)).slice(-100)}}
 const avg=firstRep.map(x=>(x/trials).toFixed(2));console.log(label,'每局平均重复题数(第1..'+plays+'局):',avg.join(' '));return firstRep}
for(const m of ['serious','funny']){const B=BANK[m];const cnt={};B.forEach(q=>cnt[q.d]=(cnt[q.d]||0)+1);
 if(new Set(B.map(q=>q.id)).size!==B.length)ok=false;
 B.forEach(q=>q.opts.forEach(o=>{for(const k in o[1])if(o[1][k]<0||o[1][k]>2)ok=false;if(!(q.d in o[1]))(global.PM=global.PM||new Set).add(q.id)}));
 console.log(m,'total',B.length,JSON.stringify(cnt),'groups',new Set(B.map(q=>q.g)).size);
 const fr=run(m,B,m+'[真实题库]',10,500);
 if(fr[0]+fr[1]+fr[2]!==0){ok=false;console.log('repeat within first 3 plays')}
}
// 引擎压力测试：模拟最终 100 题库（每维 25 题，40 个场景组）
for(const m of ['serious','funny']){const real=BANK[m];const fake=[];
 for(let i=0;i<100;i++){const d='OISC'[i%4];const src=real.filter(q=>q.d===d)[i%10];fake.push(Object.assign({},src,{id:m+'X'+i,g:'G'+((i*7)%40)}))}
 BANK[m]=fake;const fr=run(m,fake,m+'[模拟100题]',10,500);if(fr.some(x=>x>0)){ok=false;console.log('100-bank repeats!')}
 BANK[m]=real}
console.log('opts lacking primary dim:',[...(global.PM||[])].join(' '));console.log(ok?'ALL ASSERTIONS PASS':'FAIL');
// 偏置校准：预抽 20000 局（每 10 局为一个用户），随机作答
if(process.argv[2]!=='cal')process.exit(ok?0:1);
const out={};
for(const m of ['serious','funny']){const C=QUIZ[m].chars,D=[];let seen=[];
 for(let t=0;t<20000;t++){if(t%10===0)seen=[];const qs=drawQuiz(m,seen,t%10);seen=seen.concat(qs.map(q=>q.id));D.push(qs)}
 function dist(N){const h=new Array(C.length).fill(0);for(let t=0;t<N;t++){const qs=D[t%D.length];
  const s={O:0,I:0,S:0,C:0},n={O:0,I:0,S:0,C:0};qs.forEach(q=>{const sc=q.opts[Math.floor(Math.random()*4)][1];for(const k in sc){s[k]+=sc[k];n[k]+=2}});
  const r={};for(const k in s)r[k]=n[k]?s[k]/n[k]:.5;let bi=0,bd=1e9;C.forEach((c,i)=>{let d=c.bias||0;for(const k in c.p)d+=(c.p[k]/2-r[k])**2;if(d<bd){bd=d;bi=i}});h[bi]++}return h.map(x=>x/N)}
 C.forEach(c=>c.bias=0);
 for(let it=0;it<150;it++){const h=dist(40000);C.forEach((c,i)=>c.bias+=(h[i]-1/C.length)*(it<50?.3:it<100?.1:.04))}
 const h=dist(200000);out[m]=C.map(c=>+c.bias.toFixed(3));console.log(m,C.map((c,i)=>c.name+' '+(h[i]*100).toFixed(1)+'%').join(' | '))}
console.log('BIAS',JSON.stringify(out));
