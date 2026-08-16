(() => {
  'use strict';

  const SCALE = 4;
  const WORLD_W = 1920;
  const WORLD_H = 1080;
  const PLAYER_RADIUS = 18;
  const PLAYER_FOOT_OFFSET_Y = 27;
  const shapes = [];
  const L = n => Math.round(n * SCALE);
  const addRect = (id, x, y, w, h, group = 'obstacle') => shapes.push({ id, type: 'rect', x: L(x), y: L(y), w: L(w), h: L(h), group });

  // Paredes externas. A porta permanece bloqueada até a transição Casa → Vila existir.
  addRect('wall-top', 42, 20, 396, 18, 'wall');
  addRect('wall-left', 42, 32, 16, 216, 'wall');
  addRect('wall-right', 422, 32, 16, 216, 'wall');
  addRect('wall-bottom-left', 42, 232, 181, 17, 'wall');
  addRect('wall-bottom-right', 257, 232, 181, 17, 'wall');
  addRect('door-village-locked', 221, 225, 38, 28, 'door');

  // Mobiliário principal da referência ilustrada.
  addRect('bed-left', 62, 53, 62, 90, 'furniture');
  addRect('bed-right', 355, 53, 63, 90, 'furniture');
  addRect('fireplace', 201, 32, 78, 61, 'furniture');
  addRect('cabinet-top', 278, 39, 50, 62, 'furniture');
  addRect('cabinet-left', 58, 123, 38, 53, 'furniture');
  addRect('chest-left', 94, 136, 48, 39, 'furniture');
  addRect('chest-right', 364, 132, 50, 40, 'furniture');
  addRect('central-table', 199, 121, 84, 67, 'furniture');
  addRect('desk-left', 69, 174, 77, 55, 'furniture');
  addRect('weapon-rack', 334, 170, 80, 45, 'weapon-rack');

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

  function selfTest() {
    const checks = [
      ['spawn-livre', L(240), L(211), false],
      ['parede-topo', L(240), L(25), true],
      ['mesa-bloqueia', L(240), L(145), true],
      ['rack-bloqueia', L(370), L(185), true],
      ['corredor-livre', L(160), L(205), false],
      ['porta-bloqueada', L(240), L(236), true]
    ];
    const errors = [];
    for (const [name, x, y, expected] of checks) {
      const actual = collidesAnchor(x, y).hit;
      if (actual !== expected) errors.push(`${name}: esperado ${expected}, obtido ${actual}`);
    }
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaHouseCollisionV0 = {
    WORLD_W, WORLD_H, PLAYER_RADIUS, PLAYER_FOOT_OFFSET_Y, shapes,
    collidesAnchor, move, selfTest
  };
})();
