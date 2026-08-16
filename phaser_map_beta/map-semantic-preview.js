(() => {
  'use strict';
  const data = window.RagbiaMapSemanticV0;
  const canvas = document.getElementById('map');
  const overlay = document.getElementById('overlay');
  const status = document.getElementById('status');
  if (!data || !window.RagbiaMapBeta) {
    status.textContent = 'ERRO: semantic data ou RagbiaMapBeta ausente.';
    status.className = 'err';
    return;
  }

  RagbiaMapBeta.renderPreview(canvas);
  overlay.width = data.world.artWidth;
  overlay.height = data.world.artHeight;
  const ctx = overlay.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  let visible = true;

  function poly(points, color, width = 2) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i=1;i<points.length;i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath(); ctx.stroke();
  }
  function rect(o, color) { ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.strokeRect(o.x,o.y,o.w,o.h); }
  function dot(x,y,r,color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }

  function draw() {
    ctx.clearRect(0,0,overlay.width,overlay.height);
    if (!visible) return;

    poly(data.terrain.road.outer, '#ffd85a', 2);
    poly(data.terrain.road.inner, '#fff1a4', 1);
    poly(data.terrain.road.branchOuter, '#ffd85a', 2);
    poly(data.terrain.river.water, '#58d9ff', 2);
    rect(data.terrain.bridge, '#5ffff0');

    for (const s of data.settlements) {
      for (const h of s.structures) rect(h, '#ff9b5f');
      for (const f of s.fields) rect(f, '#d3ff67');
      for (const t of s.trees) dot(t.x, t.y + 14*t.scale, 4, '#6dff7c');
    }
    for (const t of data.vegetation.staticTrees) dot(t[0], t[1] + 14*t[2], 3, '#6dff7c');
    for (const l of data.landmarks) for (const r of l.collisionRects) rect(r, '#d18cff');

    const scale = data.world.pixelScale;
    dot(data.gameplay.playerSpawnWorld.x/scale, data.gameplay.playerSpawnWorld.y/scale, 6, '#ffffff');
    for (const s of data.gameplay.slimeSpawnsWorld) dot(s.x/scale, s.y/scale, 5, '#ff66da');
  }

  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'c') { visible = !visible; draw(); status.textContent = `OVERLAY ${visible ? 'ON' : 'OFF'} — C alterna`; }
  });
  draw();
  status.textContent = 'OVERLAY ON — amarelo estrada | azul rio | laranja casas | verde árvores | branco player | rosa Slimes | C alterna';
})();
