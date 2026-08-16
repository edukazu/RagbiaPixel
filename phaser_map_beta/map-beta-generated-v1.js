(() => {
  'use strict';

  if (typeof RagbiaMapSemanticV0 === 'undefined') throw new Error('Mapa semântico V0 ausente.');
  if (typeof RagbiaOutdoorKitV1Renderer === 'undefined') throw new Error('Renderer Outdoor Kit V1 ausente.');

  const M = RagbiaMapSemanticV0;
  const R = RagbiaOutdoorKitV1Renderer;
  const W = M.world;
  const ART_W = W.artWidth;
  const ART_H = W.artHeight;
  const CHUNK_W = W.chunkWidth;
  const CHUNK_H = W.chunkHeight;
  const CHUNK_COLS = W.chunkCols;
  const CHUNK_ROWS = W.chunkRows;
  const ART_CHUNK_W = CHUNK_W / W.pixelScale;
  const ART_CHUNK_H = CHUNK_H / W.pixelScale;

  function drawSettlements(ctx) {
    M.settlements.forEach((s, index) => {
      R.drawClearing(ctx, s.clearing, index);
      s.structures.forEach(h => R.drawHouse(ctx, h));
      s.fences.forEach(f => R.drawFence(ctx, f));
      s.fields.forEach(f => R.drawField(ctx, f));
      s.trees.forEach(t => R.drawTree(ctx, t.x, t.y, t.scale, t.variant));
    });
  }

  function drawVegetation(ctx) {
    M.vegetation.staticTrees.forEach(t => R.drawTree(ctx, t[0], t[1], t[2], t[3]));

    const random = R.rng(M.seeds.treeClusters);
    M.vegetation.clusters.forEach(cluster => {
      for (let i=0; i<cluster.count; i++) {
        const a = random() * Math.PI * 2;
        const radius = Math.sqrt(random());
        const x = Math.round(cluster.cx + Math.cos(a) * cluster.rx * radius);
        const y = Math.round(cluster.cy + Math.sin(a) * cluster.ry * radius);
        const scale = .68 + random() * .33;
        const variant = Math.floor(random() * 3);
        R.drawTree(ctx, x, y, scale, variant);
      }
    });
  }

  function drawAmbient(ctx) {
    const random = R.rng(M.seeds.ambientDetails);
    const P = R.data.palette;

    // Ambient generation is deterministic and semantic-area aware.
    for (let i=0; i<R.data.variation.ambientRocks; i++) {
      const x = 20 + Math.floor(random() * (ART_W - 40));
      const y = 20 + Math.floor(random() * (ART_H - 40));
      if (x > 850 && x < 1070) continue;
      R.drawRock(ctx, x, y, .28 + random() * .34);
    }

    for (let i=0; i<R.data.variation.ambientBushes; i++) {
      const x = 24 + Math.floor(random() * (ART_W - 48));
      const y = 24 + Math.floor(random() * (ART_H - 48));
      if (x > 845 && x < 1075) continue;
      R.drawBush(ctx, x, y, .45 + random() * .35, i % 2);
    }

    const colors = [P.flowerGold, P.flowerRose, P.flowerBlue];
    M.vegetation.flowerSpots.forEach((spot, spotIndex) => {
      const count = 7 + Math.floor(random() * 7);
      for (let i=0; i<count; i++) {
        const x = Math.round(spot[0] + (random()-.5)*44);
        const y = Math.round(spot[1] + (random()-.5)*27);
        R.flower(ctx, x, y, colors[(spotIndex+i)%colors.length]);
      }
    });
  }

  function drawLogical(canvas) {
    canvas.width = ART_W;
    canvas.height = ART_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    R.drawGrass(ctx, ART_W, ART_H, M.seeds.grassNoise);
    R.drawRoad(ctx, M.terrain.road, M.seeds.roadNoise);
    R.drawRiver(ctx, M.terrain.river, M.seeds.riverNoise);
    R.drawBridge(ctx, M.terrain.bridge);
    drawSettlements(ctx);
    M.landmarks.forEach(l => { if (l.kind === 'ruins') R.drawRuins(ctx, l); });
    drawVegetation(ctx);
    drawAmbient(ctx);

    // Existing wooden marker is now derived from gameplay spawn rather than a hardcoded map composition point.
    const sx = Math.round(M.gameplay.playerSpawnWorld.x / W.pixelScale);
    const sy = Math.round(M.gameplay.playerSpawnWorld.y / W.pixelScale);
    R.rect(ctx, sx + 11, sy - 16, 3, 16, R.data.palette.woodDeep);
    R.rect(ctx, sx + 14, sy - 15, 16, 7, R.data.palette.woodBase);
    R.rect(ctx, sx + 15, sy - 14, 14, 2, R.data.palette.woodLight);

    return canvas;
  }

  function renderPreview(canvas) { return drawLogical(canvas); }

  function create(scene) {
    const master = document.createElement('canvas');
    drawLogical(master);

    const chunks=[];
    for (let row=0; row<CHUNK_ROWS; row++) {
      for (let col=0; col<CHUNK_COLS; col++) {
        const chunk=document.createElement('canvas');
        chunk.width=CHUNK_W;
        chunk.height=CHUNK_H;
        const c=chunk.getContext('2d');
        c.imageSmoothingEnabled=false;
        c.drawImage(master,
          col*ART_CHUNK_W,row*ART_CHUNK_H,ART_CHUNK_W,ART_CHUNK_H,
          0,0,CHUNK_W,CHUNK_H);
        const key=`map-generated-v1-${col}-${row}`;
        scene.textures.addCanvas(key, chunk);
        const image=scene.add.image(col*CHUNK_W,row*CHUNK_H,key).setOrigin(0,0).setDepth(.01);
        chunks.push(image);
      }
    }
    master.width=1; master.height=1;
    return { chunks, kitId: R.data.id, semanticMapId: M.id };
  }

  window.RagbiaMapBetaGeneratedV1 = {
    WORLD_W: W.worldWidth,
    WORLD_H: W.worldHeight,
    PIXEL_SCALE: W.pixelScale,
    CHUNK_W, CHUNK_H,
    create, renderPreview
  };
})();
