(() => {
  'use strict';

  if (typeof RagbiaOutdoorKitV11Data === 'undefined') {
    throw new Error('Outdoor Kit V1.1: dados do kit ausentes.');
  }

  const K = RagbiaOutdoorKitV11Data;
  const P = K.palette;

  function rng(seed) {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function rect(ctx, x, y, w, h, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
    ctx.restore();
  }

  function poly(ctx, points, color, alpha = 1) {
    if (!points || !points.length) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
    for (let i = 1; i < points.length; i++) ctx.lineTo(Math.round(points[i][0]), Math.round(points[i][1]));
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function ellipse(ctx, x, y, w, h, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y), Math.max(1, Math.round(w/2)), Math.max(1, Math.round(h/2)), 0, 0, Math.PI*2);
    ctx.fill(); ctx.restore();
  }

  function strokePath(ctx, points, color, width = 1, alpha = 1) {
    if (!points || points.length < 2) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = Math.max(1,width);
    ctx.lineJoin='round'; ctx.lineCap='round'; ctx.beginPath();
    ctx.moveTo(Math.round(points[0][0])+.5,Math.round(points[0][1])+.5);
    for(let i=1;i<points.length;i++) ctx.lineTo(Math.round(points[i][0])+.5,Math.round(points[i][1])+.5);
    ctx.stroke(); ctx.restore();
  }

  function pointOnSegments(points, r) {
    if (!points || points.length < 2) return [0,0];
    const lengths=[]; let total=0;
    for(let i=0;i<points.length;i++) {
      const a=points[i], b=points[(i+1)%points.length];
      const len=Math.hypot(b[0]-a[0],b[1]-a[1]); lengths.push(len); total+=len;
    }
    let target=r*total;
    for(let i=0;i<lengths.length;i++) {
      if(target<=lengths[i]) {
        const a=points[i], b=points[(i+1)%points.length], t=lengths[i] ? target/lengths[i] : 0;
        return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      }
      target-=lengths[i];
    }
    return points[0];
  }

  function organicPatch(ctx,x,y,w,h,color,alpha,r) {
    const count=4+Math.floor(r()*4);
    for(let i=0;i<count;i++) {
      const ox=(r()-.5)*w*.48, oy=(r()-.5)*h*.44;
      const ww=w*(.38+r()*.34), hh=h*(.38+r()*.35);
      ellipse(ctx,x+ox,y+oy,ww,hh,color,alpha*(.72+r()*.28));
    }
  }

  function grassTuft(ctx,x,y,scale=1,color=P.grassLight) {
    const s=n=>Math.max(1,Math.round(n*scale));
    rect(ctx,x-s(2),y,s(1),s(3),color,.78);
    rect(ctx,x,y-s(1),s(1),s(4),color,.88);
    rect(ctx,x+s(2),y,s(1),s(3),P.grassWarm,.64);
    rect(ctx,x-s(1),y+s(2),s(4),s(1),P.grassDeep,.48);
  }

  function drawGrass(ctx,w,h,seed) {
    rect(ctx,0,0,w,h,P.grassBase);
    const r=rng(seed);

    for(let i=0;i<K.variation.grassLargePatches;i++) {
      const x=Math.floor(r()*w), y=Math.floor(r()*h);
      const pw=65+Math.floor(r()*175), ph=42+Math.floor(r()*100);
      const col=i%5===0?P.grassDeep:i%3===0?P.grassMoss:P.grassMid;
      organicPatch(ctx,x,y,pw,ph,col,.10+r()*.12,r);
    }

    for(let i=0;i<K.variation.grassMicroClusters;i++) {
      const x=Math.floor(r()*w), y=Math.floor(r()*h), roll=r();
      const col=roll<.57?P.grassMid:roll<.82?P.grassLight:roll<.94?P.grassWarm:P.grassDry;
      rect(ctx,x,y,1+Math.floor(r()*3),1,col,.32+r()*.35);
      if(r()>.88) rect(ctx,x+1,y-1,1,1,P.grassLight,.55);
    }

    for(let i=0;i<K.variation.grassTufts;i++) {
      grassTuft(ctx,Math.round(r()*w),Math.round(r()*h),.42+r()*.42,r()>.82?P.grassDry:P.grassLight);
    }
  }

  function roadEdgeDetail(ctx,points,seed,count) {
    const r=rng(seed);
    for(let i=0;i<count;i++) {
      const p=pointOnSegments(points,r());
      const x=Math.round(p[0]+(r()-.5)*8), y=Math.round(p[1]+(r()-.5)*8);
      if(r()<.63) grassTuft(ctx,x,y,.34+r()*.34,r()>.80?P.grassWarm:P.grassMid);
      else {
        rect(ctx,x,y,2+Math.floor(r()*5),1,P.dirtGrass,.45+r()*.28);
        if(r()>.7) rect(ctx,x+1,y-1,1,1,P.grassLight,.45);
      }
    }
  }

  function drawRoad(ctx,road,seed) {
    poly(ctx,road.outer,P.dirtEdgeDeep);
    poly(ctx,road.inner,P.dirtBase);
    poly(ctx,road.branchOuter,P.dirtEdgeDeep);
    poly(ctx,road.branchInner,P.dirtMid);

    strokePath(ctx,road.outer,P.dirtEdge,2,.70);
    strokePath(ctx,road.inner,P.dirtLight,1,.48);
    strokePath(ctx,road.branchOuter,P.dirtEdge,2,.68);
    strokePath(ctx,road.branchInner,P.dirtLight,1,.42);

    const mainTop=road.inner.slice(0,Math.ceil(road.inner.length/2));
    const branchTop=road.branchInner.slice(0,Math.ceil(road.branchInner.length/2));
    strokePath(ctx,mainTop,P.dirtDust,2,.26);
    strokePath(ctx,branchTop,P.dirtDust,2,.22);

    roadEdgeDetail(ctx,road.outer,seed+101,K.variation.roadEdgeIntrusions);
    roadEdgeDetail(ctx,road.branchOuter,seed+151,Math.round(K.variation.roadEdgeIntrusions*.42));

    const r=rng(seed+300);
    const all=road.outer.concat(road.branchOuter||[]);
    const minX=Math.min(...all.map(p=>p[0])),maxX=Math.max(...all.map(p=>p[0]));
    const minY=Math.min(...all.map(p=>p[1])),maxY=Math.max(...all.map(p=>p[1]));
    for(let i=0;i<K.variation.roadSurfaceMarks;i++) {
      const x=Math.round(minX+r()*(maxX-minX)), y=Math.round(minY+r()*(maxY-minY));
      const col=r()>.63?P.dirtLight:P.dirtRut;
      rect(ctx,x,y,1+Math.floor(r()*5),1,col,.26+r()*.28);
    }
  }

  function drawRiver(ctx,river,seed) {
    poly(ctx,river.bank,P.bankDeep);
    poly(ctx,river.water,P.bankBase);
    poly(ctx,river.water,P.waterDeep);
    poly(ctx,river.inner,P.waterBase);
    strokePath(ctx,river.water,P.bankLight,2,.55);
    strokePath(ctx,river.inner,P.waterMid,2,.45);

    const r=rng(seed);
    for(let i=0;i<K.variation.waterFlowMarks;i++) {
      const y=Math.floor(r()*672);
      const center=948+Math.sin(y*.034)*23+Math.sin(y*.011)*11;
      const x=Math.round(center+(r()-.5)*48);
      const len=2+Math.floor(r()*7);
      rect(ctx,x,y,len,1,r()>.80?P.waterFoam:r()>.55?P.waterLight:P.waterMid,.34+r()*.42);
      if(r()>.86) rect(ctx,x+1,y+2,Math.max(1,len-2),1,P.waterDeep,.38);
    }

    const rr=rng(seed+717);
    for(let i=0;i<K.variation.shorePebbles;i++) {
      const p=pointOnSegments(river.water,rr());
      const x=Math.round(p[0]+(rr()-.5)*8),y=Math.round(p[1]+(rr()-.5)*8);
      if(rr()<.48) rect(ctx,x,y,1+Math.floor(rr()*3),1,rr()>.5?P.stoneMid:P.bankLight,.45+.3*rr());
      else grassTuft(ctx,x,y,.30+rr()*.26,P.grassWarm);
    }
  }

  function drawBridge(ctx,b) {
    ellipse(ctx,b.x+b.w/2+2,b.y+b.h+5,b.w+16,12,P.ao,.34);
    rect(ctx,b.x-4,b.y-4,b.w+8,b.h+9,P.woodDeep);
    rect(ctx,b.x+1,b.y+1,b.w-2,b.h,P.woodBase);
    for(let x=b.x+4,row=0;x<b.x+b.w-3;x+=10,row++) {
      const col=row%3===0?P.woodWarm:P.woodMid;
      rect(ctx,x,b.y+3,7,b.h-5,col);
      rect(ctx,x,b.y+3,1,b.h-5,P.woodDeep,.72);
      rect(ctx,x+1,b.y+4,5,1,P.woodLight,.60);
    }
    rect(ctx,b.x-5,b.y-8,b.w+10,4,P.woodDeep);
    rect(ctx,b.x-5,b.y+b.h+2,b.w+10,4,P.woodDeep);
    for(let x=b.x+2;x<=b.x+b.w-2;x+=28) {
      rect(ctx,x,b.y-11,3,12,P.woodDeep);
      rect(ctx,x+1,b.y-10,1,7,P.woodLight,.42);
      rect(ctx,x,b.y+b.h,3,12,P.woodDeep);
    }
    rect(ctx,b.x-2,b.y-6,b.w+4,1,P.woodLight,.42);
  }

  function treeProfile(variant) {
    if(variant===1) return {w:28,h:38,trunk:20,tall:true,warm:false};
    if(variant===2) return {w:39,h:27,trunk:16,tall:false,warm:true};
    if(variant===3) return {w:26,h:24,trunk:14,tall:false,warm:false,young:true};
    return {w:34,h:31,trunk:17,tall:false,warm:false};
  }

  function drawTree(ctx,x,y,scale=1,variant=0) {
    const p=treeProfile(variant),s=n=>Math.max(1,Math.round(n*scale));
    ellipse(ctx,x+s(3),y+s(15),s(p.w+13),s(11),P.ao,.36);
    ellipse(ctx,x+s(1),y+s(12),s(p.w+7),s(8),P.shadow,.25);
    rect(ctx,x-s(3),y,s(7),s(p.trunk),P.woodDeep);
    rect(ctx,x-s(1),y+s(1),s(4),s(p.trunk-1),P.woodBase);
    rect(ctx,x,y+s(2),s(1),s(7),P.woodLight,.62);

    const base=p.warm?P.leafWarm:P.leafBase;
    const cy=y-s(p.tall?16:11);
    ellipse(ctx,x-s(10),cy+s(5),s(p.w*.58),s(p.h*.64),P.leafDeep);
    ellipse(ctx,x+s(10),cy+s(5),s(p.w*.59),s(p.h*.65),P.leafShade);
    ellipse(ctx,x,cy-s(2),s(p.w),s(p.h),base);
    ellipse(ctx,x-s(8),cy-s(4),s(p.w*.46),s(p.h*.52),P.leafMid);
    ellipse(ctx,x+s(7),cy-s(6),s(p.w*.43),s(p.h*.48),P.leafMid);
    if(!p.young) ellipse(ctx,x+s(1),cy+s(7),s(p.w*.54),s(p.h*.37),P.leafDeep,.68);

    rect(ctx,x-s(11),cy-s(10),s(7),s(3),P.leafLight,.78);
    rect(ctx,x+s(2),cy-s(13),s(8),s(3),P.leafLight,.82);
    rect(ctx,x-s(4),cy-s(6),s(5),s(2),P.leafLight,.38);
    if(p.warm) rect(ctx,x+s(11),cy+s(1),s(5),s(3),P.grassDry,.55);
  }

  function drawBush(ctx,x,y,scale=1,variant=0) {
    const s=n=>Math.max(1,Math.round(n*scale));
    ellipse(ctx,x+1,y+s(5),s(29),s(8),P.ao,.30);
    ellipse(ctx,x-s(8),y+s(1),s(15),s(12),P.leafDeep);
    ellipse(ctx,x+s(8),y+s(2),s(16),s(12),P.leafShade);
    ellipse(ctx,x,y-s(4),s(21),s(16),variant%2?P.leafMid:P.leafBase);
    rect(ctx,x-s(6),y-s(9),s(5),s(2),P.leafLight,.70);
    if(variant%2) rect(ctx,x+s(3),y-s(6),s(4),s(2),P.leafLight,.52);
  }

  function drawRock(ctx,x,y,scale=1,variant=0) {
    const w=Math.max(4,Math.round((variant?15:13)*scale));
    const h=Math.max(3,Math.round((variant?8:10)*scale));
    ellipse(ctx,x+1,y+4,w+7,Math.max(2,h/2),P.ao,.31);
    const pts=variant
      ? [[x-w/2,y+2],[x-w*.22,y-h*.48],[x+w*.28,y-h*.40],[x+w*.52,y],[x+w*.24,y+h*.40],[x-w*.34,y+h*.32]]
      : [[x-w/2,y+2],[x-w*.34,y-h*.38],[x+w*.18,y-h*.55],[x+w*.52,y],[x+w*.31,y+h*.42],[x-w*.28,y+h*.4]];
    poly(ctx,pts,P.stoneDeep);
    poly(ctx,[[x-w*.31,y],[x-w*.15,y-h*.28],[x+w*.16,y-h*.38],[x+w*.31,y],[x+w*.10,y+h*.15],[x-w*.23,y+h*.19]],P.stoneBase);
    rect(ctx,x-Math.round(w*.16),y-Math.round(h*.25),Math.max(1,Math.round(w*.30)),1,P.stoneLight,.72);
    if(scale>.55 && variant) rect(ctx,x+Math.round(w*.13),y+1,2,1,P.stoneMoss,.70);
  }

  function drawFence(ctx,f) {
    const gap=12;
    for(let i=0;i<f.count;i++) {
      const x=f.x+(f.horizontal?i*gap:0),y=f.y+(f.horizontal?0:i*gap);
      rect(ctx,x-2,y-6,4,13,P.woodDeep);
      rect(ctx,x-1,y-5,2,4,P.woodLight,.68);
      if(i<f.count-1) {
        if(f.horizontal) {rect(ctx,x+1,y-3,gap,3,P.woodMid);rect(ctx,x+1,y+2,gap,2,P.woodDeep);}
        else {rect(ctx,x-3,y+1,3,gap,P.woodMid);rect(ctx,x+2,y+1,2,gap,P.woodDeep);}
      }
    }
  }

  function drawHouse(ctx,h) {
    const x=h.x,y=h.y,w=h.w,hh=h.h,v=h.variant||0;
    ellipse(ctx,x+w/2+4,y+hh+5,w+22,13,P.ao,.35);
    rect(ctx,x-1,y+14,w+2,hh-13,P.wallDeep);
    rect(ctx,x+2,y+16,w-4,hh-17,P.wallBase);
    rect(ctx,x+4,y+17,w-8,2,P.wallLight,.62);
    rect(ctx,x+2,y+hh-7,w-4,5,P.wallDeep,.72);

    // subtle plaster breakup, deterministic from the house geometry
    const hr=rng((x*73856093)^(y*19349663)^(v*83492791));
    for(let i=0;i<5;i++) rect(ctx,x+5+Math.floor(hr()*(w-12)),y+21+Math.floor(hr()*Math.max(4,hh-31)),2+Math.floor(hr()*4),1,P.wallMid,.28);

    const roofBase=v===1?'#6b4835':v===2?'#7a5038':P.roofBase;
    rect(ctx,x-8,y+8,w+16,8,P.roofDeep);
    rect(ctx,x-5,y+4,w+10,7,roofBase);
    rect(ctx,x,y,w,6,P.roofMid);
    rect(ctx,x+7,y-3,w-14,4,P.roofLight,.82);
    rect(ctx,x-5,y+14,w+10,2,P.woodDeep,.72);

    for(let tx=x+3,row=0;tx<x+w-4;tx+=8,row++) {
      rect(ctx,tx,y+4,5,1,P.roofDeep,.62);
      if(row%2===0) rect(ctx,tx+2,y+1,4,1,P.roofDeep,.38);
      if(row%3===0) rect(ctx,tx+1,y+7,5,1,P.roofLight,.30);
    }

    // one small chimney on larger/variant houses; still derived from structure data
    if(w>=65 && v!==2) {
      const cx=x+w-18;
      rect(ctx,cx,y-8,8,11,P.roofDeep);
      rect(ctx,cx+2,y-7,5,8,P.stoneBase);
      rect(ctx,cx+1,y-9,7,3,P.stoneDeep);
    }

    const doorX=Math.round(x+w*.43);
    rect(ctx,doorX-1,y+hh-19,15,19,P.woodDeep);
    rect(ctx,doorX+2,y+hh-16,9,16,P.woodBase);
    rect(ctx,doorX+9,y+hh-8,1,1,'#d9c27a');
    rect(ctx,doorX+2,y+hh-16,9,1,P.woodLight,.40);

    for(const wx of [x+9,x+w-21]) {
      rect(ctx,wx-2,y+23,15,13,P.woodDeep);
      rect(ctx,wx+1,y+25,9,8,'#477074');
      rect(ctx,wx+2,y+26,7,2,'#aac0ac');
      rect(ctx,wx+5,y+25,1,8,P.wallLight,.65);
      rect(ctx,wx+1,y+32,9,1,P.woodLight,.38);
    }

    for(let sx=x+4,idx=0;sx<x+w-5;sx+=10,idx++) {
      rect(ctx,sx,y+hh-5,7,3,idx%2?P.stoneBase:P.stoneMid,.76);
      if(idx%3===0) rect(ctx,sx+1,y+hh-5,3,1,P.stoneMoss,.44);
    }
  }

  function drawField(ctx,f) {
    rect(ctx,f.x,f.y,f.w,f.h,'#6d603a');
    rect(ctx,f.x+2,f.y+2,f.w-4,f.h-4,'#94814b');
    for(let yy=f.y+5,row=0;yy<f.y+f.h-3;yy+=6,row++) {
      rect(ctx,f.x+4,yy,f.w-8,1,'#665535',.78);
      for(let xx=f.x+7;xx<f.x+f.w-5;xx+=10) {
        rect(ctx,xx+(row%2?2:0),yy-2,1,2,'#c7aa5d',.88);
        if(row%3===0) rect(ctx,xx+3,yy-1,1,1,P.grassWarm,.50);
      }
    }
  }

  function drawClearing(ctx,c,variant=0) {
    // three overlapping ellipses break the perfect oval without changing semantic bounds
    ellipse(ctx,c.x,c.y,c.w,c.h,variant?P.dirtMid:P.grassLight,variant?.28:.24);
    ellipse(ctx,c.x-c.w*.12,c.y+c.h*.04,c.w*.72,c.h*.70,variant?P.dirtBase:P.grassWarm,.12);
    ellipse(ctx,c.x+c.w*.15,c.y-c.h*.05,c.w*.62,c.h*.66,P.grassBase,.10);
  }

  function drawRuins(ctx,landmark) {
    const x=landmark.origin.x,y=landmark.origin.y;
    ellipse(ctx,x+38,y+46,96,27,P.ao,.31);
    rect(ctx,x,y,64,6,P.stoneDeep);rect(ctx,x,y,7,45,P.stoneBase);rect(ctx,x+55,y,7,45,P.stoneBase);
    rect(ctx,x+12,y+13,12,33,P.stoneDeep);rect(ctx,x+38,y+20,13,26,P.stoneDeep);
    rect(ctx,x+3,y+2,58,3,P.stoneLight,.56);
    rect(ctx,x+69,y+25,19,6,P.stoneBase);rect(ctx,x+82,y+17,6,14,P.stoneDeep);
    rect(ctx,x+5,y+33,3,7,P.stoneMoss,.52);rect(ctx,x+56,y+17,3,8,P.stoneMoss,.44);
    drawRock(ctx,x-12,y+42,.78,1);drawRock(ctx,x+95,y+44,.66,0);
  }

  function flower(ctx,x,y,color) {
    rect(ctx,x,y,1,1,color,.95); rect(ctx,x,y+1,1,1,P.grassDeep,.9);
    if((x+y)%3===0) rect(ctx,x+1,y,1,1,color,.58);
  }

  window.RagbiaOutdoorKitV11Renderer = {
    data:K,rng,rect,poly,ellipse,strokePath,
    drawGrass,drawRoad,drawRiver,drawBridge,
    drawTree,drawBush,drawRock,drawFence,drawHouse,
    drawField,drawClearing,drawRuins,flower
  };
})();
