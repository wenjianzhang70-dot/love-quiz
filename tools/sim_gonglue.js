const fs=require('fs');global.window=global;const R=__dirname+'/../';
eval(fs.readFileSync(R+'data.js','utf8'));eval(fs.readFileSync(R+'gonglue-data.js','utf8'));
let ok=true;const B=GL.bank;const c={};B.forEach(q=>c[q.d]=(c[q.d]||0)+1);console.log('bank',B.length,JSON.stringify(c),'groups',new Set(B.map(q=>q.g)).size);
// 抽题：8 题、每维 2、组互斥、连玩重复
const rep=[];for(let t=0;t<500;t++){let seen=[];for(let p=0;p<10;p++){const qs=GL.draw(seen);const d={};qs.forEach(q=>d[q.d]=(d[q.d]||0)+1);
 if(qs.length!==8||Object.values(d).some(v=>v!==2)||new Set(qs.map(q=>q.g)).size!==8){ok=false}
 rep[p]=(rep[p]||0)+qs.filter(q=>seen.includes(q.id)).length;seen=seen.concat(qs.map(q=>q.id)).slice(-60)}}
console.log('每局平均重复题数(第1..10局):',rep.map(x=>(x/500).toFixed(2)).join(' '));
// 匹配度分布：每类对象 × 随机作答
const N=+process.argv[2]||4000;const all=[];const by={};
for(const T of GL.targets){for(let i=0;i<N/10;i++){const qs=GL.draw([]);const a=qs.map(()=>Math.floor(Math.random()*4));const r=GL.score(qs,a);const m=GL.match(r,T);
 if(m<38||m>96)ok=false;all.push(m);(by[T.type]=by[T.type]||[]).push(m)}}
function rep2(L,n){const t={near:0,slow:0,meal:0};L.forEach(m=>t[GL.tier(m).k]++);const s=[...L].sort((a,b)=>a-b);
 console.log(n.padEnd(6),'n='+L.length,'min',s[0],'p10',s[L.length/10|0],'中位',s[L.length/2|0],'p90',s[L.length*.9|0],'max',s[L.length-1],
 '| 可以试着靠近',(t.near/L.length*100).toFixed(1)+'%','先慢慢熟起来',(t.slow/L.length*100).toFixed(1)+'%','更适合当饭搭子',(t.meal/L.length*100).toFixed(1)+'%')}
rep2(all,'全部');for(const k in by)rep2(by[k],k);
// 同答案稳定
const qs=GL.draw([]);const a=qs.map(()=>1);if(GL.match(GL.score(qs,a),GL.targets[0])!==GL.match(GL.score(qs,a),GL.targets[0]))ok=false;
console.log(ok?'ALL ASSERTIONS PASS':'FAIL');
