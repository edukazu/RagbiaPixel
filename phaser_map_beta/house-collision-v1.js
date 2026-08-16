(() => {
  'use strict';

  const WORLD_W = 1920;
  const WORLD_H = 1080;
  const PLAYER_RADIUS = 18;
  const PLAYER_FOOT_OFFSET_Y = 27;
  const shapes = [];
  const addRect = (id, x, y, w, h, group = 'obstacle') => shapes.push({ id, type: 'rect', x, y, w, h, group });

  // M002.2A.1 — colisão calibrada sobre a arte pixelada derivada da referência ilustrada.
  // Limites internos da casa. A saída permanece bloqueada até o M003.
  addRect('wall-top', 0, 0, WORLD_W, 292, 'wall');
  addRect('wall-left', 0, 250, 286, 660, 'wall');
  addRect('wall-right', 1640, 250, 280, 660, 'wall');
  addRect('wall-bottom-left', 0, 874, 855, 206, 'wall');
  addRect('door-village-locked', 855, 840, 210, 240, 'door');
  addRect('wall-bottom-right', 1065, 874, 855, 206, 'wall');

  // Grandes volumes do interior. Mantemos hitboxes mais simples que a arte para preservar navegação.
  addRect('bed-left', 315, 184, 188, 274, 'furniture');
  addRect('nightstand-left', 497, 198, 110, 125, 'furniture');
  addRect('logs-barrel', 605, 171, 174, 157, 'furniture');
  addRect('fireplace', 786, 143, 233, 208, 'furniture');
  addRect('cabinet-top', 1005, 62, 155, 279, 'furniture');
  addRect('nightstand-right', 1215, 185, 127, 140, 'furniture');
  addRect('bed-right', 1345, 145, 213, 338, 'furniture');
  addRect('chest-right', 1375, 373, 172, 156, 'furniture');

  addRect('shelf-left', 278, 431, 132, 259, 'furniture');
  addRect('chest-left', 397, 493, 165, 153, 'furniture');
  addRect('central-table', 700, 390, 460, 360, 'furniture');
  addRect('desk-left', 315, 658, 336, 211, 'furniture');
  addRect('counter-right', 1277, 657, 150, 201, 'furniture');
  addRect('weapon-rack', 1380, 553, 229, 267, 'weapon-rack');

  const interactionZones = [
    { id: 'weapon-rack-zone', x: 1300, y: 515, w: 330, h: 335, group: 'interaction' }
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function circleVsRect(cx, cy, r, s) {
    const nx = clamp(cx, s.x, s.x + s.w);
    const ny = clamp(cy, s.y, s.y + s.h);
    const dx = cx - nx, dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  function collidesAnchor(anchorX, anchorY) {
    const cx = anchorX;
    const cy = anchorY + PLAYER_FOOT_OFFSET_Y;
    if (cx - PLAYER_RADIUS < 0 || cx + PLAYER_RADIUS > WORLD_W || cy - PLAYER_RADIUS < 0 || cy + PLAYER_RADIUS > WORLD_H) {
      return { hit: true, shape: { id: 'world-bounds', type: 'bounds', group: 'bounds' } };
    }
    for (const s of shapes) {
      if (circleVsRect(cx, cy, PLAYER_RADIUS, s)) return { hit: true, shape: s };
    }
    return { hit: false, shape: null };
  }

  function move(anchorX, anchorY, deltaX, deltaY) {
    let x = anchorX, y = anchorY;
    let blockedX = false, blockedY = false, lastHit = null;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 7));
    const sx = deltaX / steps, sy = deltaY / steps;
    for (let i = 0; i < steps; i++) {
      if (sx !== 0) {
        const test = collidesAnchor(x + sx, y);
        if (!test.hit) x += sx;
        else { blockedX = true; lastHit = test.shape; }
      }
      if (sy !== 0) {
        const test = collidesAnchor(x, y + sy);
        if (!test.hit) y += sy;
        else { blockedY = true; lastHit = test.shape; }
      }
    }
    return { x, y, blockedX, blockedY, hit: lastHit };
  }

  function zoneContains(zone, anchorX, anchorY) {
    const fy = anchorY + PLAYER_FOOT_OFFSET_Y;
    return anchorX >= zone.x && anchorX <= zone.x + zone.w && fy >= zone.y && fy <= zone.y + zone.h;
  }

  function selfTest() {
    const checks = [
      ['spawn-livre', 960, 790, false],
      ['parede-topo', 960, 220, true],
      ['mesa-bloqueia', 930, 545, true],
      ['rack-bloqueia', 1490, 670, true],
      ['corredor-esquerdo-livre', 620, 585, false],
      ['corredor-direito-livre', 1220, 560, false],
      ['porta-bloqueada', 960, 900, true]
    ];
    const errors = [];
    for (const [name, x, y, expected] of checks) {
      const actual = collidesAnchor(x, y).hit;
      if (actual !== expected) errors.push(`${name}: esperado ${expected}, obtido ${actual}`);
    }
    if (!zoneContains(interactionZones[0], 1320, 700)) errors.push('zona de interação do suporte deveria alcançar corredor frontal');
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaHouseCollisionV1 = {
    WORLD_W, WORLD_H, PLAYER_RADIUS, PLAYER_FOOT_OFFSET_Y,
    spawn: { x: 960, y: 790 }, shapes, interactionZones,
    collidesAnchor, move, zoneContains, selfTest
  };
})();
