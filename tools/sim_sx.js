// 用法: node tools/sim_sx.js love [cal]
const fs=require('fs');global.window=global;const R=__dirname+'/../',key=process.argv[2];
eval(fs.readFileSync(R+'sx-'+key+'.js','utf8'));eval(fs.readFileSync(R+'series.js','utf8'));
const D=SX[key],B=D.bank,dims=Object.keys(D.dims);let ok=true;
const c={};B.forEach(q=>{c[q.d]=(c[q.d]||0)+1;q.opts.forEach(o=>{for(const k in o[1])if(!(k in D.dims)||o[1][k]<0||o[1][k]>2){ok=false;console.log('bad score',q.id)}})});
if(new Set(B.map(q=>q.id)).size!==B.length)ok=false;
console.log(key,'bank',B.length,JSON.stringify(c),'groups',new Set(B.map(q=>q.g)).size);
const rep=[];for(let t=0;t<500;t++){let seen=[];for(let p=0;p<10;p++){const qs=SXE.draw(key,seen,p);const d={};qs.forEach(q=>d[q.d]=(d[q.d]||0)+1);
 if(qs.length!==10||Object.values(d).some(v=>v<2||v>3)||Object.keys(d).length!==4||new Set(qs.map(q=>q.g)).size!==10)ok=false;
 rep[p]=(rep[p]||0)+qs.filter(q=>seen.includes(q.id)).length;seen=seen.concat(qs.map(q=>q.id)).slice(-B.length)}}
console.log('10局内重复总数:',rep.reduce((a,b)=>a+b,0));if(rep.some(x=>x>0))ok=false;
console.log('每局平均重复题数(第1..10局):',rep.map(x=>(x/500).toFixed(2)).join(' '));
function sample(n){const out=[];for(let i=0;i<n;i++){const qs=SXE.draw(key,[]);out.push(SXE.score(key,qs,qs.map(()=>Math.floor(Math.random()*4))))}return out}
function dist(S){const t={};D.results.forEach(x=>t[x.id]=0);S.forEach(r=>t[SXE.pick(key,r).id]++);return t}
if(process.argv[3]==='cal'){const S=sample(+process.argv[4]||40000);D.bias={};D.results.forEach(x=>D.bias[x.id]=0);
 for(let it=0;it<800;it++){const t=dist(S),tg=S.length/D.results.length,st=0.003*(1-it/900);D.results.forEach(x=>D.bias[x.id]+=st*Math.log((t[x.id]+1)/tg))}
 const o={};for(const k in D.bias)o[k]=+D.bias[k].toFixed(6);console.log('BIAS',JSON.stringify(o))}
const t=dist(sample(10000));console.log('结果分布:',D.results.map(x=>x.name+' '+(t[x.id]/100).toFixed(1)+'%').join(' | '));
const mx=Math.max(...Object.values(t))/100,mn=Math.min(...Object.values(t))/100;if(mn<8)ok=false;console.log('min',mn,'max',mx);
console.log(ok?'ALL ASSERTIONS PASS':'FAIL');
