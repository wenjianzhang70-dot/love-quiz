// 3D 小摆件原型（千寻 · 汤屋灯笼）。three.js (MIT) 原始几何体搭建，用户不能拖动/旋转，只能戳一下回弹。
import {WebGLRenderer,Scene,PerspectiveCamera,Group,Mesh,LatheGeometry,CylinderGeometry,SphereGeometry,TorusGeometry,CircleGeometry,
  MeshToonMaterial,MeshBasicMaterial,HemisphereLight,DirectionalLight,DataTexture,RedFormat,NearestFilter,Vector2,Color} from 'three';
const PAL={
  s:{body:'#d98c84',cap:'#7b6a5c',rib:'#b86e68',blush:'#f2b5b0',sky:'#fff6ea',ground:'#c9b8a6',tassel:'#c98b8b'},
  f:{body:'#ff5fa8',cap:'#111111',rib:'#e0157a',blush:'#ffb3d6',sky:'#ffffff',ground:'#ffe14d',tassel:'#30d5ea'},
  v:{body:'#e8873a',cap:'#1d2f6f',rib:'#c4561f',blush:'#ffd0a0',sky:'#fff2c0',ground:'#3b6fc0',tassel:'#ffd54a'}};
export function mountPet(host,theme){
  const p=PAL[theme]||PAL.s,S=240;
  const r=new WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  r.setPixelRatio(Math.min(2,window.devicePixelRatio||1));r.setSize(S,S);r.setClearColor(0,0);
  host.appendChild(r.domElement);
  const scene=new Scene(),cam=new PerspectiveCamera(30,1,0.1,50);cam.position.set(0,0.2,7);cam.lookAt(0,-0.12,0);
  const g3=new Uint8Array([90,170,255]),grad=new DataTexture(g3,3,1,RedFormat);grad.minFilter=grad.magFilter=NearestFilter;grad.needsUpdate=true;
  const toon=c=>new MeshToonMaterial({color:new Color(c),gradientMap:grad});
  scene.add(new HemisphereLight(p.sky,p.ground,1.6));const d=new DirectionalLight('#ffffff',1.6);d.position.set(2,3,4);scene.add(d);
  const pet=new Group(),squash=new Group();squash.add(pet);scene.add(squash);
  // 圆滚滚的灯笼身体（车削）
  const pts=[];for(let i=0;i<=16;i++){const t=i/16,y=-0.95+t*1.9;const x=0.34+0.96*Math.sin(Math.PI*t)**0.75;pts.push(new Vector2(x,y))}
  const body=new Mesh(new LatheGeometry(pts,28),toon(p.body));pet.add(body);
  // 竹骨环
  [-0.58,0.6].forEach(y=>{const rr=0.34+0.96*Math.sin(Math.PI*((y+0.95)/1.9))**0.75;const t=new Mesh(new TorusGeometry(rr+0.005,0.035,6,32),toon(p.rib));t.rotation.x=Math.PI/2;t.position.y=y;pet.add(t)});
  // 上下盖
  const capT=new Mesh(new CylinderGeometry(0.42,0.46,0.22,20),toon(p.cap));capT.position.y=1.0;pet.add(capT);
  const capB=new Mesh(new CylinderGeometry(0.46,0.40,0.2,20),toon(p.cap));capB.position.y=-1.0;pet.add(capB);
  const hook=new Mesh(new TorusGeometry(0.14,0.04,6,16),toon(p.cap));hook.position.y=1.24;pet.add(hook);
  // 流苏
  const tas=new Mesh(new CylinderGeometry(0.03,0.12,0.42,10),toon(p.tassel));tas.position.y=-1.32;pet.add(tas);
  const bead=new Mesh(new SphereGeometry(0.08,10,8),toon(p.tassel));bead.position.y=-1.12;pet.add(bead);
  // 小脸：豆豆眼 + 腮红 + 小嘴
  const face=new Group();face.position.set(0,0.05,1.27);pet.add(face);
  const eyeM=new MeshBasicMaterial({color:'#2b2124'});
  [-0.26,0.26].forEach(x=>{const e=new Mesh(new SphereGeometry(0.075,10,8),eyeM);e.position.set(x,0.08,0);e.scale.z=0.5;face.add(e);
    const hl=new Mesh(new SphereGeometry(0.022,6,6),new MeshBasicMaterial({color:'#ffffff'}));hl.position.set(x+0.025,0.11,0.035);face.add(hl);
    const b=new Mesh(new CircleGeometry(0.12,16),new MeshBasicMaterial({color:p.blush,transparent:true,opacity:.85}));b.position.set(x*1.55,-0.08,-0.04);b.rotation.y=x>0?0.35:-0.35;b.scale.y=0.6;face.add(b)});
  const mouth=new Mesh(new TorusGeometry(0.075,0.022,6,12,Math.PI),eyeM);mouth.rotation.z=Math.PI;mouth.position.set(0,-0.04,0.02);face.add(mouth);
  // 弹簧挤压
  let sy=1,vy=0,t0=performance.now(),tilt={x:0,y:0},tt={x:0,y:0},alive=true;
  const el=r.domElement;el.style.touchAction='manipulation';
  el.addEventListener('pointerdown',e=>{vy-=4.2;e.preventDefault()});
  el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();tt.x=((e.clientX-b.left)/b.width-.5);tt.y=((e.clientY-b.top)/b.height-.5)});
  el.addEventListener('pointerleave',()=>{tt.x=tt.y=0});
  let last=performance.now();
  function frame(now){if(!alive)return;const dt=Math.min(0.033,(now-last)/1000);last=now;const t=(now-t0)/1000;
    vy+=(-(sy-1)*180-vy*9)*dt;sy+=vy*dt;
    const breathe=1+Math.sin(t*2.2)*0.018;
    squash.scale.set(1/Math.sqrt(sy)*breathe,sy*breathe,1/Math.sqrt(sy)*breathe);
    squash.position.y=Math.sin(t*1.6)*0.05;
    tilt.x+=(tt.x-tilt.x)*0.08;tilt.y+=(tt.y-tilt.y)*0.08;
    pet.rotation.y=tilt.x*0.5;pet.rotation.x=tilt.y*0.35;pet.rotation.z=-tilt.x*0.12+Math.sin(t*1.3)*0.03;
    r.render(scene,cam);requestAnimationFrame(frame)}
  // 挤压支点在底部：把模型整体抬高后在外层下移
  scene.remove(squash);const root=new Group();root.add(squash);root.position.y=-1.0;pet.position.y=1.0;scene.add(root);
  requestAnimationFrame(frame);
  return {canvas:el,poke(){vy-=4.2},snapshot(){r.render(scene,cam);return el.toDataURL('image/png')},destroy(){alive=false;r.dispose();el.remove()}};
}
