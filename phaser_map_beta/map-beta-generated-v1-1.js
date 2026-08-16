(() => {
  'use strict';

  if (typeof RagbiaMapSemanticV0 === 'undefined') throw new Error('Mapa semântico V0 ausente.');
  if (typeof RagbiaOutdoorKitV11Renderer === 'undefined') throw new Error('Renderer Outdoor Kit V1.1 ausente.');

  const M=RagbiaMapSemanticV0,R=RagbiaOutdoorKitV11Renderer,W=M.world;
  const ART_W=W.artWidth,ART_H=W.artHeight,CHUNK_W=W.chunkWidth,CHUNK_H=W.chunkHeight;
  const CHUNK_COLS=W.chunkCols,CHUNK_ROWS=W.chunkRows,ART_CHUNK_W=CHUNK_W/W.pixelScale,ART_CHUNK_H=CHUNK_H/W.pixelScale;

  function drawSettlements(ctx) {
    M.settlements.forEach((s,index)=>{
      R.drawClearing(ctx,s.clearing,index);
      s.structures.forEach(h=>R.drawHouse(ctx,h));
      s.fences.forEach(f=>R.drawFence(ctx,f));
      s.fields.forEach(f=>R.drawField(ctx,f));
      s.trees.forEach(t=>R.drawTree(ctx,t.x,t.y,t.scale,t.variant));
    });
  }

  function drawVegetation(ctx) {
    M.vegetation.staticTrees.forEach((t,index)=>R.drawTree(ctx,t[0],t[1],t[2],index%11===0?3:t[3]));
    const random=R.rng(M.seeds.treeClusters);
    M.vegetation.clusters.forEach(cluster=>{
      for(let i=0;i<cluster.count;i++) {
        const a=random()*Math.PI*2,radius=Math.sqrt(random());
        const x=Math.round(cluster.cx+Math.cos(a)*cluster.rx*radius);
        const y=Math.round(cluster.cy+Math.sin(a)*cluster.ry*radius);
        const scale=.66+random()*.35;
        const roll=random();
        const variant=roll<.12?3:roll<.40?0:roll<.70?1:2;
        R.drawTree(ctx,x,y,scale,variant);
      }
    });
  }

  function drawAmbient(ctx) {
    const random=R.rng(M.seeds.ambientDetails),P=R.data.palette;
    for(let i=0;i<R.data.variation.ambientRocks;i++) {
      const x=20+Math.floor(random()*(ART_W-40)),y=20+Math.floor(random()*(ART_H-40));
      if(x>850&&x<1070) continue;
      R.drawRock(ctx,x,y,.28+random()*.36,i%2);
    }
    for(let i=0;i<R.data.variation.ambientBushes;i++) {
      const x=24+Math.floor(random()*(ART_W-48)),y=24+Math.floor(random()*(ART_H-48));
      if(x>845&&x<1075) continue;
      R.drawBush(ctx,x,y,.44+random()*.36,i%2);
    }
    const colors=[P.flowerGold,P.flowerRose,P.flowerBlue,P.flowerWhite];
    M.vegetation.flowerSpots.forEach((spot,spotIndex)=>{
      const count=6+Math.floor(random()*7);
      for(let i=0;i<count;i++) {
        const x=Math.round(spot[0]+(random()-.5)*42),y=Math.round(spot[1]+(random()-.5)*25);
        R.flower(ctx,x,y,colors[(spotIndex+i)%colors.length]);
      }
    });
  }

  function drawLogical(canvas) {
    canvas.width=ART_W;canvas.height=ART_H;
    const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    R.drawGrass(ctx,ART_W,ART_H,M.seeds.grassNoise);
    R.drawRoad(ctx,M.terrain.road,M.seeds.roadNoise);
    R.drawRiver(ctx,M.terrain.river,M.seeds.riverNoise);
    R.drawBridge(ctx,M.terrain.bridge);
    drawSettlements(ctx);
    M.landmarks.forEach(l=>{if(l.kind==='ruins')R.drawRuins(ctx,l);});
    drawVegetation(ctx);drawAmbient(ctx);

    const sx=Math.round(M.gameplay.playerSpawnWorld.x/W.pixelScale),sy=Math.round(M.gameplay.playerSpawnWorld.y/W.pixelScale);
    R.rect(ctx,sx+11,sy-16,3,16,R.data.palette.woodDeep);
    R.rect(ctx,sx+14,sy-15,16,7,R.data.palette.woodBase);
    R.rect(ctx,sx+15,sy-14,14,2,R.data.palette.woodLight);
    return canvas;
  }

  function renderPreview(canvas){return drawLogical(canvas);}

  function create(scene) {
    const master=document.createElement('canvas');drawLogical(master);const chunks=[];
    for(let row=0;row<CHUNK_ROWS;row++) for(let col=0;col<CHUNK_COLS;col++) {
      const chunk=document.createElement('canvas');chunk.width=CHUNK_W;chunk.height=CHUNK_H;
      const c=chunk.getContext('2d');c.imageSmoothingEnabled=false;
      c.drawImage(master,col*ART_CHUNK_W,row*ART_CHUNK_H,ART_CHUNK_W,ART_CHUNK_H,0,0,CHUNK_W,CHUNK_H);
      const key=`map-generated-v1-1-${col}-${row}`;scene.textures.addCanvas(key,chunk);
      chunks.push(scene.add.image(col*CHUNK_W,row*CHUNK_H,key).setOrigin(0,0).setDepth(.012));
    }
    master.width=1;master.height=1;
    return {chunks,kitId:R.data.id,semanticMapId:M.id};
  }

  window.RagbiaMapBetaGeneratedV11={WORLD_W:W.worldWidth,WORLD_H:W.worldHeight,PIXEL_SCALE:W.pixelScale,CHUNK_W,CHUNK_H,create,renderPreview};
})();
