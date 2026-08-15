(() => {
  'use strict';

  // M001.6 — Dash/Esquiva V0
  // Arquitetura preparada para parâmetros específicos por classe.
  // Os valores abaixo são de laboratório, não balanceamento final.
  const PROFILES = Object.freeze({
    warrior: Object.freeze({ charges: 1, cooldown: 1.50, distance: 140, duration: 0.18, invulnerability: 0.12 }),
    archer:  Object.freeze({ charges: 1, cooldown: 1.50, distance: 140, duration: 0.18, invulnerability: 0.12 })
  });

  function profileFor(classId) {
    return PROFILES[classId] || PROFILES.warrior;
  }

  function normalizeIntent(x, y, lastX = 0, lastY = 1) {
    let dx = Number(x) || 0;
    let dy = Number(y) || 0;
    let len = Math.hypot(dx, dy);
    if (len <= 0.12) {
      dx = Number.isFinite(Number(lastX)) ? Number(lastX) : 0;
      dy = Number.isFinite(Number(lastY)) ? Number(lastY) : 1;
      if (Math.hypot(dx, dy) <= 0.001) { dx = 0; dy = 1; }
      len = Math.max(0.001, Math.hypot(dx, dy));
    }
    return { x: dx / len, y: dy / len };
  }

  function directionFromVector(x, y) {
    if (Math.abs(x) > Math.abs(y)) return x < 0 ? 'left' : 'right';
    return y < 0 ? 'up' : 'down';
  }

  // Flip pseudo-3D: um giro completo durante a duração do dash.
  // Leste/Oeste -> comprime a largura (rotação aparente em torno do eixo Y).
  // Norte/Sul  -> comprime a altura  (rotação aparente em torno do eixo X).
  function flipScale(direction, progress) {
    const p = Math.max(0, Math.min(1, Number(progress) || 0));
    const phase = Math.cos(p * Math.PI * 2);
    if (direction === 'left' || direction === 'right') return { x: phase, y: 1 };
    return { x: 1, y: phase };
  }

  function selfTest() {
    const errors = [];
    for (const cls of ['warrior', 'archer']) {
      const p = profileFor(cls);
      if (p.charges !== 1 || p.cooldown !== 1.5 || p.distance !== 140 || p.duration !== 0.18 || p.invulnerability !== 0.12) {
        errors.push(`${cls}: perfil de laboratório inesperado`);
      }
    }
    const east = normalizeIntent(1, 0, 0, 1);
    if (Math.abs(east.x - 1) > 1e-6 || Math.abs(east.y) > 1e-6) errors.push('intenção leste inválida');
    const fallback = normalizeIntent(0, 0, -1, 0);
    if (fallback.x > -0.99 || Math.abs(fallback.y) > 0.01) errors.push('fallback de última direção inválido');
    if (directionFromVector(1, 0) !== 'right' || directionFromVector(0, -1) !== 'up') errors.push('direção dominante inválida');
    const q = flipScale('right', 0.25);
    if (Math.abs(q.x) > 1e-6 || q.y !== 1) errors.push('flip horizontal não comprime largura em 25%');
    const half = flipScale('up', 0.5);
    if (half.x !== 1 || Math.abs(half.y + 1) > 1e-6) errors.push('flip vertical não inverte altura em 50%');
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaDodgeV0 = { PROFILES, profileFor, normalizeIntent, directionFromVector, flipScale, selfTest };
})();
