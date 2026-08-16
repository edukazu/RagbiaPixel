(() => {
  'use strict';

  const WORLD_W = 1280;
  const WORLD_H = 720;
  const PLAYER_RADIUS = 14;
  const PLAYER_FOOT_OFFSET_Y = 18;

  const shapes = Object.freeze([
    // Parede inteira — o jogador anda no plano do piso, nunca "sobe" na parede.
    { id: 'north-wall', type: 'rect', x: 56, y: 0, w: 1168, h: 286, group: 'wall' },

    // Hearth da lareira avança para dentro do piso.
    { id: 'fireplace-hearth', type: 'rect', x: 706, y: 278, w: 246, h: 64, group: 'furniture' },

    // Pilha de lenha: prop único do microteste.
    { id: 'woodpile', type: 'rect', x: 975, y: 280, w: 192, h: 72, group: 'prop' },
  ]);

  const spawn = Object.freeze({ x: 600, y: 548 });

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

    if (
      cx - PLAYER_RADIUS < 0 || cx + PLAYER_RADIUS > WORLD_W ||
      cy - PLAYER_RADIUS < 0 || cy + PLAYER_RADIUS > WORLD_H
    ) {
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
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 6));
    const sx = deltaX / steps;
    const sy = deltaY / steps;

    for (let i = 0; i < steps; i++) {
      if (sx !== 0) {
        const t = collidesAnchor(x + sx, y);
        if (!t.hit) x += sx;
        else { blockedX = true; lastHit = t.shape; }
      }
      if (sy !== 0) {
        const t = collidesAnchor(x, y + sy);
        if (!t.hit) y += sy;
        else { blockedY = true; lastHit = t.shape; }
      }
    }
    return { x, y, blockedX, blockedY, hit: lastHit };
  }

  function selfTest() {
    const checks = [
      ['spawn livre', spawn.x, spawn.y, false],
      ['parede bloqueia', 640, 210, true],
      ['frente da parede livre', 640, 390, false],
      ['hearth bloqueia', 820, 320, true],
      ['corredor esquerdo livre', 360, 360, false],
      ['corredor direito livre', 1110, 430, false],
      ['woodpile bloqueia', 1060, 325, true],
    ];
    const errors = [];
    for (const [name, x, y, expected] of checks) {
      const actual = collidesAnchor(x, y).hit;
      if (actual !== expected) errors.push(`${name}: esperado ${expected}, obtido ${actual}`);
    }
    return { ok: errors.length === 0, errors };
  }

  const api = {
    WORLD_W, WORLD_H, PLAYER_RADIUS, PLAYER_FOOT_OFFSET_Y,
    shapes, spawn, collidesAnchor, move, selfTest
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.RagbiaMicrotestCollisionV0 = api;
})();
