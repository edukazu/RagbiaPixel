(() => {
  'use strict';

  // M001.11 — Estados Visuais e Leitura da IA V0
  // Camada estritamente visual/laboratorial. Não altera aggro, FOV, ataque,
  // leash, colisão, dano, targeting ou qualquer estado autoritativo da IA.

  const COLORS = Object.freeze({
    PASSIVE_IDLE: 0x9fb7aa,
    AGGRESSIVE_IDLE: 0x61d4ff,
    CHASE: 0xff5b45,
    ATTACK: 0xffaa3c,
    RESET: 0xd36cff,
    BACK: 0x111816
  });

  function describe(entity) {
    if (!entity || !entity.alive) return { state: 'dead', color: 0x555555, icon: 'none', active: false };
    const state = String(entity.aiState || 'idle').toLowerCase();
    if (state === 'reset') return { state, color: COLORS.RESET, icon: 'return', active: true };
    if (state === 'attack') return { state, color: COLORS.ATTACK, icon: 'alert', active: true };
    if (state === 'chase' || entity.aggro) return { state: 'chase', color: COLORS.CHASE, icon: 'alert', active: true };
    const aggressive = entity.behavior === 'aggressive';
    return {
      state: 'idle',
      color: aggressive ? COLORS.AGGRESSIVE_IDLE : COLORS.PASSIVE_IDLE,
      icon: 'none',
      active: false
    };
  }

  function pulse(timeMs, speed = 0.010, min = 0.58, max = 1.0) {
    const n = (Math.sin((Number(timeMs) || 0) * speed) + 1) * 0.5;
    return min + (max - min) * n;
  }

  function resetDirection(entity) {
    if (!entity) return { x: 0, y: 1 };
    const dx = (Number(entity.spawnX) || 0) - (Number(entity.x) || 0);
    const dy = (Number(entity.spawnY) || 0) - (Number(entity.y) || 0);
    const d = Math.max(0.001, Math.hypot(dx, dy));
    return { x: dx / d, y: dy / d };
  }

  function selfTest() {
    const errors = [];
    const passive = describe({ alive:true, behavior:'passive', aiState:'idle', aggro:false });
    if (passive.state !== 'idle' || passive.color !== COLORS.PASSIVE_IDLE || passive.active) errors.push('Passivo IDLE deve usar leitura neutra');
    const aggressive = describe({ alive:true, behavior:'aggressive', aiState:'idle', aggro:false });
    if (aggressive.color !== COLORS.AGGRESSIVE_IDLE) errors.push('Agressivo IDLE deve permanecer distinguível');
    const chase = describe({ alive:true, behavior:'passive', aiState:'chase', aggro:true });
    if (chase.state !== 'chase' || chase.color !== COLORS.CHASE || chase.icon !== 'alert') errors.push('CHASE deve usar alerta vermelho');
    const attack = describe({ alive:true, behavior:'aggressive', aiState:'attack', aggro:true });
    if (attack.color !== COLORS.ATTACK || attack.icon !== 'alert') errors.push('ATTACK deve usar leitura laranja');
    const reset = describe({ alive:true, behavior:'aggressive', aiState:'reset', aggro:false });
    if (reset.color !== COLORS.RESET || reset.icon !== 'return') errors.push('RESET deve usar leitura roxa/retorno');
    const dead = describe({ alive:false });
    if (dead.active || dead.icon !== 'none') errors.push('Entidade morta não deve exibir estado ativo');
    const dir = resetDirection({x:10,y:0,spawnX:0,spawnY:0});
    if (Math.abs(dir.x + 1) > 1e-6 || Math.abs(dir.y) > 1e-6) errors.push('Seta de reset deve apontar ao spawn');
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaEnemyStateVisualV0 = { COLORS, describe, pulse, resetDirection, selfTest };
})();
