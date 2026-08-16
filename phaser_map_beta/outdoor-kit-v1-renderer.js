(() => {
  'use strict';

  if (typeof RagbiaOutdoorKitV1Data === 'undefined') {
    throw new Error('Outdoor Kit V1: dados do kit ausentes.');
  }

  const K = RagbiaOutdoorKitV1Data;
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
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
    ctx.restore();
  }

  function poly(ctx, points, color, alpha = 1) {
    if (!points || !points.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
    for (let i = 1; i < points.length; i++) ctx.lineTo(Math.round(points[i][0]), Math.round(points[i][1]));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function ellipse(ctx, x, y, w, h, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y), Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 2)), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function strokePath(ctx, points, color, width = 1, alpha = 1) {
    if (!points || points.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, width);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(Math.round(points[0][0]) + .5, Math.round(points[0][1]) + .5);
    for (let i = 1; i < points.length; i++) ctx.lineTo(Math.round(points[i][0]) + .5, Math.round(points[i][1]) + .5);
    ctx.stroke();
    ctx.restore();
  }

  function drawGrass(ctx, w, h, seed) {
    rect(ctx, 0, 0, w, h, P.grassBase);
    const r = rng(seed);

    // Large, low-frequency patches keep the field organic without visual noise.
    for (let i = 0; i < K.variation.grassLargePatches; i++) {
      const x = Math.floor(r() * w);
      const y = Math.floor(r() * h);
      const pw = 95 + Math.floor(r() * 210);
      const ph = 55 + Math.floor(r() * 130);
      const col = i % 4 === 0 ? P.grassDeep : i % 3 === 0 ? P.grassShade : P.grassMid;
      ellipse(ctx, x, y, pw, ph, col, .16 + r() * .15);
    }

    // Small clusters are sparse enough for player/enemy readability.
    for (let i = 0; i < K.variation.grassMicroClusters; i++) {
      const x = Math.floor(r() * w);
      const y = Math.floor(r() * h);
      const roll = r();
      const col = roll < .55 ? P.grassMid : roll < .82 ? P.grassLight : P.grassDry;
      const ww = 1 + Math.floor(r() * 3);
      rect(ctx, x, y, ww, 1, col, .42 + r() * .34);
      if (r() > .84) rect(ctx, x + 1, y - 1, 1, 1, P.grassLight, .66);
    }
  }

  function drawRoad(ctx, road, seed) {
    poly(ctx, road.outer, P.dirtEdge);
    poly(ctx, road.inner, P.dirtBase);
    poly(ctx, road.branchOuter, P.dirtEdge);
    poly(ctx, road.branchInner, P.dirtMid);

    // Parallel worn bands derived from semantic path, not hand-painted coordinates.
    const center = road.inner.slice(0, Math.ceil(road.inner.length / 2));
    strokePath(ctx, center, P.dirtLight, 2, .34);

    const r = rng(seed);
    const all = road.outer.concat(road.branchOuter || []);
    const minX = Math.min(...all.map(p => p[0]));
    const maxX = Math.max(...all.map(p => p[0]));
    const minY = Math.min(...all.map(p => p[1]));
    const maxY = Math.max(...all.map(p => p[1]));

    for (let i = 0; i < K.variation.roadEdgeClusters; i++) {
      const x = Math.round(minX + r() * (maxX - minX));
      const y = Math.round(minY + r() * (maxY - minY));
      const col = r() > .55 ? P.dirtLight : P.dirtRut;
      rect(ctx, x, y, r() > .8 ? 2 : 1, 1, col, .40 + r() * .32);
    }
  }

  function drawRiver(ctx, river, seed) {
    poly(ctx, river.bank, P.bankDeep);
    poly(ctx, river.water, P.bankBase);
    // visible bank ring is created by drawing water after bank
    poly(ctx, river.water, P.waterDeep);
    poly(ctx, river.inner, P.waterBase);

    // Highlight an inner band with a translated copy impression.
    strokePath(ctx, river.inner.slice(0, Math.ceil(river.inner.length / 2)), P.waterMid, 3, .38);

    const r = rng(seed);
    for (let i = 0; i < K.variation.waterFlowMarks; i++) {
      const y = Math.floor(r() * 672);
      const center = 948 + Math.sin(y * .034) * 23 + Math.sin(y * .011) * 11;
      const x = Math.round(center + (r() - .5) * 48);
      rect(ctx, x, y, 2 + Math.floor(r() * 6), 1, r() > .72 ? P.waterLight : P.waterMid, .45 + r() * .4);
    }
  }

  function drawBridge(ctx, b) {
    // stronger silhouette with rails separated from floor
    rect(ctx, b.x - 3, b.y - 3, b.w + 6, b.h + 8, P.woodDeep);
    rect(ctx, b.x + 2, b.y + 2, b.w - 4, b.h - 2, P.woodBase);
    for (let x = b.x + 5; x < b.x + b.w - 3; x += 11) {
      rect(ctx, x, b.y + 4, 7, b.h - 8, P.woodMid);
      rect(ctx, x, b.y + 4, 1, b.h - 8, P.woodDeep, .8);
      rect(ctx, x + 1, b.y + 5, 5, 1, P.woodLight, .72);
    }
    rect(ctx, b.x - 4, b.y - 7, b.w + 8, 4, P.woodDeep);
    rect(ctx, b.x - 4, b.y + b.h + 1, b.w + 8, 4, P.woodDeep);
    for (let x = b.x + 1; x <= b.x + b.w - 2; x += 30) {
      rect(ctx, x, b.y - 10, 3, 11, P.woodDeep);
      rect(ctx, x, b.y + b.h - 1, 3, 11, P.woodDeep);
    }
  }

  function treeProfile(variant) {
    if (variant === 1) return { width: 30, height: 34, trunk: 19, warm: false, tall: true };
    if (variant === 2) return { width: 37, height: 27, trunk: 16, warm: true, tall: false };
    return { width: 34, height: 30, trunk: 17, warm: false, tall: false };
  }

  function drawTree(ctx, x, y, scale = 1, variant = 0) {
    const p = treeProfile(variant);
    const s = n => Math.max(1, Math.round(n * scale));

    ellipse(ctx, x + s(2), y + s(14), s(p.width + 9), s(10), P.shadow, .30);
    rect(ctx, x - s(3), y + s(1), s(7), s(p.trunk), P.woodDeep);
    rect(ctx, x - s(1), y + s(2), s(4), s(p.trunk - 1), P.woodBase);
    rect(ctx, x, y + s(3), s(1), s(8), P.woodLight, .7);

    const base = p.warm ? P.leafWarm : P.leafBase;
    const mid = p.tall ? P.leafMid : P.leafMid;
    const crownY = y - s(p.tall ? 14 : 10);
    ellipse(ctx, x - s(9), crownY + s(4), s(p.width * .60), s(p.height * .67), P.leafDeep);
    ellipse(ctx, x + s(9), crownY + s(5), s(p.width * .63), s(p.height * .68), P.leafDeep);
    ellipse(ctx, x, crownY - s(2), s(p.width), s(p.height), base);
    ellipse(ctx, x - s(8), crownY - s(3), s(p.width * .48), s(p.height * .53), mid);
    ellipse(ctx, x + s(8), crownY - s(5), s(p.width * .46), s(p.height * .52), mid);

    // highlight clusters are asymmetric to avoid the "same circle" look
    rect(ctx, x - s(10), crownY - s(10), s(7), s(3), P.leafLight, .82);
    rect(ctx, x + s(3), crownY - s(13), s(8), s(3), P.leafLight, .84);
    if (variant === 2) rect(ctx, x + s(11), crownY + s(2), s(5), s(3), P.grassDry, .68);
  }

  function drawBush(ctx, x, y, scale = 1, variant = 0) {
    const s = n => Math.max(1, Math.round(n * scale));
    ellipse(ctx, x, y + s(4), s(26), s(8), P.shadow, .24);
    ellipse(ctx, x - s(7), y, s(15), s(12), P.leafDeep);
    ellipse(ctx, x + s(7), y + s(1), s(15), s(12), P.leafDeep);
    ellipse(ctx, x, y - s(5), s(20), s(15), variant % 2 ? P.leafMid : P.leafBase);
    rect(ctx, x - s(5), y - s(9), s(5), s(2), P.leafLight, .72);
  }

  function drawRock(ctx, x, y, scale = 1) {
    const w = Math.max(4, Math.round(13 * scale));
    const h = Math.max(3, Math.round(9 * scale));
    ellipse(ctx, x + 1, y + 3, w + 5, Math.max(2, h / 2), P.shadow, .25);
    poly(ctx, [[x-w/2,y+2],[x-w*.34,y-h*.38],[x+w*.18,y-h*.55],[x+w*.52,y],[x+w*.31,y+h*.42],[x-w*.28,y+h*.4]], P.stoneDeep);
    poly(ctx, [[x-w*.30,y],[x-w*.17,y-h*.30],[x+w*.15,y-h*.40],[x+w*.31,y],[x+w*.12,y+h*.17],[x-w*.23,y+h*.20]], P.stoneBase);
    rect(ctx, x - Math.round(w*.17), y - Math.round(h*.28), Math.max(1, Math.round(w*.31)), 1, P.stoneLight, .8);
  }

  function drawFence(ctx, f) {
    const gap = 12;
    for (let i = 0; i < f.count; i++) {
      const x = f.x + (f.horizontal ? i * gap : 0);
      const y = f.y + (f.horizontal ? 0 : i * gap);
      rect(ctx, x - 2, y - 6, 4, 13, P.woodDeep);
      rect(ctx, x - 1, y - 5, 2, 4, P.woodLight, .8);
      if (i < f.count - 1) {
        if (f.horizontal) {
          rect(ctx, x + 1, y - 3, gap, 3, P.woodMid);
          rect(ctx, x + 1, y + 2, gap, 2, P.woodDeep);
        } else {
          rect(ctx, x - 3, y + 1, 3, gap, P.woodMid);
          rect(ctx, x + 2, y + 1, 2, gap, P.woodDeep);
        }
      }
    }
  }

  function drawHouse(ctx, h) {
    const x=h.x, y=h.y, w=h.w, hh=h.h, v=h.variant||0;
    ellipse(ctx, x + w/2 + 3, y + hh + 4, w + 18, 12, P.shadow, .28);

    rect(ctx, x, y + 14, w, hh - 14, P.wallDeep);
    rect(ctx, x + 2, y + 16, w - 4, hh - 18, P.wallBase);
    rect(ctx, x + 3, y + 17, w - 6, 3, P.wallLight, .68);
    rect(ctx, x + 2, y + hh - 6, w - 4, 4, P.wallDeep, .7);

    const roofBase = v === 1 ? '#6d4935' : v === 2 ? '#7b5139' : P.roofBase;
    rect(ctx, x - 7, y + 8, w + 14, 7, P.roofDeep);
    rect(ctx, x - 4, y + 4, w + 8, 7, roofBase);
    rect(ctx, x + 1, y, w - 2, 6, P.roofMid);
    rect(ctx, x + 8, y - 3, w - 16, 4, P.roofLight, .85);

    // tile breakup comes from the house's own size instead of manual coordinates
    for (let tx=x+4, row=0; tx<x+w-4; tx+=9, row++) {
      rect(ctx, tx, y+4, 6, 1, P.roofDeep, .64);
      if (row%2===0) rect(ctx, tx+2, y+1, 5, 1, P.roofDeep, .42);
    }

    const doorX = Math.round(x + w*.43);
    rect(ctx, doorX, y + hh - 18, 13, 18, P.woodDeep);
    rect(ctx, doorX + 2, y + hh - 16, 9, 16, P.woodBase);
    rect(ctx, doorX + 9, y + hh - 8, 1, 1, '#d9c27a');

    for (const wx of [x+9, x+w-21]) {
      rect(ctx, wx-1, y+24, 13, 11, P.woodDeep);
      rect(ctx, wx+1, y+25, 9, 8, '#4b7376');
      rect(ctx, wx+2, y+26, 7, 2, '#9eb7a7');
      rect(ctx, wx+5, y+25, 1, 8, P.wallLight, .68);
    }

    // foundation stones add material contrast without changing footprint
    for (let sx=x+4; sx<x+w-5; sx+=11) {
      rect(ctx, sx, y+hh-4, 8, 2, sx%22 ? P.stoneBase : P.stoneMid, .75);
    }
  }

  function drawField(ctx, f) {
    rect(ctx, f.x, f.y, f.w, f.h, '#75663d');
    rect(ctx, f.x+2, f.y+2, f.w-4, f.h-4, '#9a864e');
    for (let yy=f.y+5; yy<f.y+f.h-3; yy+=6) {
      rect(ctx, f.x+4, yy, f.w-8, 1, '#665535', .8);
      for (let xx=f.x+7; xx<f.x+f.w-5; xx+=10) {
        rect(ctx, xx + (((yy-f.y)/6)%2 ? 2 : 0), yy-2, 1, 2, '#c6a95d', .9);
      }
    }
  }

  function drawClearing(ctx, c, variant = 0) {
    ellipse(ctx, c.x, c.y, c.w, c.h, variant ? P.dirtMid : P.grassLight, variant ? .34 : .30);
  }

  function drawRuins(ctx, landmark) {
    const x = landmark.origin.x, y = landmark.origin.y;
    ellipse(ctx, x+38, y+45, 92, 25, P.shadow, .25);
    rect(ctx, x, y, 64, 6, P.stoneDeep);
    rect(ctx, x, y, 7, 45, P.stoneBase);
    rect(ctx, x+55, y, 7, 45, P.stoneBase);
    rect(ctx, x+12, y+13, 12, 33, P.stoneDeep);
    rect(ctx, x+38, y+20, 13, 26, P.stoneDeep);
    rect(ctx, x+3, y+2, 58, 3, P.stoneLight, .58);
    rect(ctx, x+69, y+25, 19, 6, P.stoneBase);
    rect(ctx, x+82, y+17, 6, 14, P.stoneDeep);
    drawRock(ctx, x-12, y+42, .76);
    drawRock(ctx, x+95, y+44, .64);
  }

  function flower(ctx, x, y, color) {
    rect(ctx, x, y, 1, 1, color, .95);
    rect(ctx, x, y+1, 1, 1, P.grassDeep, .9);
  }

  window.RagbiaOutdoorKitV1Renderer = {
    data: K,
    rng, rect, poly, ellipse, strokePath,
    drawGrass, drawRoad, drawRiver, drawBridge,
    drawTree, drawBush, drawRock, drawFence, drawHouse,
    drawField, drawClearing, drawRuins, flower
  };
})();
