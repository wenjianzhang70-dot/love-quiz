import numpy as np, random, math
from PIL import Image, ImageDraw, ImageFilter
random.seed(7); np.random.seed(7)
W,H=780,1688
# ---------- Van Gogh-inspired swirl (original, procedural) ----------
img=Image.new('RGB',(W,H),(22,42,96)); d=ImageDraw.Draw(img)
vort=[(560,260,170,1),(180,620,150,-1),(620,1050,190,1),(200,1450,160,-1),(420,820,120,1)]
stars=[(560,260,70),(150,180,40),(690,700,36),(90,980,30),(380,1250,44),(700,1500,38)]
def flow(x,y):
    vx,vy=1.0,0.25*math.sin(y/90)
    for cx,cy,r,s in vort:
        dx,dy=x-cx,y-cy; dist=math.hypot(dx,dy)+1; w=math.exp(-(dist/r)**2*0.7)*3
        vx+=-dy/dist*w*s; vy+=dx/dist*w*s
    n=math.hypot(vx,vy); return vx/n,vy/n
blues=[(18,36,92),(30,60,130),(48,92,168),(70,120,190),(110,160,210),(25,50,110),(140,185,220)]
yel=[(244,206,66),(250,226,120),(232,170,40),(255,240,170)]
for _ in range(16000):
    x,y=random.uniform(0,W),random.uniform(0,H)
    near=min((math.hypot(x-sx,y-sy)/sr for sx,sy,sr in stars))
    if near<1.0: col=random.choice(yel)
    elif near<1.6 and random.random()<.5: col=random.choice([(200,210,150),(240,220,130),(150,190,200)])
    else: col=random.choice(blues)
    col=tuple(min(255,max(0,c+random.randint(-12,12))) for c in col)
    pts=[(x,y)]; L=random.randint(5,10)
    for _ in range(L):
        fx,fy=flow(x,y); x+=fx*4; y+=fy*4; pts.append((x,y))
    d.line(pts,fill=col,width=random.randint(4,7),joint='curve')
    # highlight edge -> impasto feel
    d.line([(p[0]-1,p[1]-1) for p in pts],fill=tuple(min(255,c+35) for c in col),width=1)
img=img.filter(ImageFilter.SMOOTH)
img.save('love-quiz/img/vg-bg.jpg',quality=62,optimize=True,progressive=True)
# ---------- watercolor journal wash ----------
wc=Image.new('RGB',(W,H),(250,246,238)); layer=Image.new('RGBA',(W,H),(0,0,0,0)); ld=ImageDraw.Draw(layer)
cols=[(214,170,170),(178,196,170),(226,200,150),(190,180,210)]
for i in range(26):
    c=random.choice(cols); x,y=random.uniform(-100,W),random.uniform(-100,H); r=random.uniform(70,200)
    for k in range(6):
        rr=r*(1-k*0.12); ld.ellipse([x-rr+random.uniform(-15,15),y-rr*0.8,x+rr,y+rr*0.8+random.uniform(-15,15)],fill=c+(16,))
layer=layer.filter(ImageFilter.GaussianBlur(18)); wc.paste(layer,(0,0),layer)
grain=(np.random.normal(0,5,(H,W,1))).repeat(3,2)
wc=Image.fromarray(np.clip(np.asarray(wc).astype(float)+grain,0,255).astype('uint8'))
wc.save('love-quiz/img/wc-bg.jpg',quality=60,optimize=True,progressive=True)
