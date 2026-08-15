(() => {
  'use strict';

  // M001.10 — Passivo Reativo V0 (base M001.9 IA Inimigo V0)
  // Objetivo: separar claramente percepção, ataque e leash/reset.
  // FOV NÃO encerra perseguição. Uma vez percebido, o jogador continua sendo
  // perseguido até morte/reset explícito ou até o inimigo atingir resetRange
  // medido a partir do ponto original de spawn.

  const STATES = Object.freeze({
    IDLE: 'idle',
    CHASE: 'chase',
    ATTACK: 'attack',
    RESET: 'reset'
  });

  const BEHAVIORS = Object.freeze({
    PASSIVE: 'passive',
    AGGRESSIVE: 'aggressive'
  });

  const DEFAULTS = Object.freeze({
    visionRange: 420,
    resetRange: 700,
    moveSpeed: 165,
    resetSpeed: 240,
    resetArrival: 10,
    playerFootOffsetY: 28
  });

  function distance(ax, ay, bx, by) {
    return Math.hypot((bx || 0) - (ax || 0), (by || 0) - (ay || 0));
  }

  function playerDistance(entity, playerX, playerY) {
    if (!entity) return Infinity;
    return distance(entity.x, entity.y, playerX, playerY);
  }

  // FIX1: combate e aproximação usam a mesma referência física dos footprints.
  // Antes, a IA parava pelo centro dos sprites, enquanto o ataque validava os pés.
  // Como Player offset=28 e Slime offset=22, um inimigo vindo do norte podia parar
  // 6 px cedo demais e nunca satisfazer enemyCanAttackPlayer().
  function combatDelta(entity, playerX, playerY, playerFootOffsetY = DEFAULTS.playerFootOffsetY) {
    if (!entity) return { dx: 0, dy: 0, distance: Infinity };
    const entityFootOffsetY = Number.isFinite(entity.collisionOffsetY) ? entity.collisionOffsetY : 22;
    const ex = entity.x;
    const ey = entity.y + entityFootOffsetY;
    const px = playerX;
    const py = playerY + playerFootOffsetY;
    const dx = px - ex;
    const dy = py - ey;
    return { dx, dy, distance: Math.hypot(dx, dy) };
  }

  function combatDistance(entity, playerX, playerY, playerFootOffsetY = DEFAULTS.playerFootOffsetY) {
    return combatDelta(entity, playerX, playerY, playerFootOffsetY).distance;
  }

  function spawnDistance(entity) {
    if (!entity) return Infinity;
    return distance(entity.spawnX, entity.spawnY, entity.x, entity.y);
  }

  function isAggressive(entity) {
    return !!entity && entity.behavior === BEHAVIORS.AGGRESSIVE;
  }

  // M001.10: passivo não detecta por FOV, mas dano recebido provoca aggro.
  // O comportamento-base NÃO muda: behavior continua 'passive'. Assim, depois
  // do reset (aggro=false), ele volta naturalmente a ignorar o jogador.
  function provoke(entity, reason = 'damage') {
    if (!entity || !entity.alive || entity.aiState === STATES.RESET) return false;
    entity.aggro = true;
    entity.aggroReason = reason;
    if (entity.aiState === STATES.IDLE) entity.aiState = STATES.CHASE;
    return true;
  }

  function canDetect(entity, playerX, playerY, playerAlive = true) {
    if (!entity || !entity.alive || !playerAlive || !isAggressive(entity)) return false;
    const visionRange = Number.isFinite(entity.visionRange) ? entity.visionRange : DEFAULTS.visionRange;
    return playerDistance(entity, playerX, playerY) <= visionRange;
  }

  function shouldReset(entity) {
    if (!entity || !entity.alive || entity.resetEnabled === false) return false;
    const resetRange = Number.isFinite(entity.resetRange) ? entity.resetRange : DEFAULTS.resetRange;
    return spawnDistance(entity) >= resetRange;
  }

  function restoreResources(entity) {
    if (!entity) return entity;
    if (Number.isFinite(entity.maxHP)) entity.hp = entity.maxHP;
    entity.enemyAttackT = 0;
    entity.enemyAttackHitApplied = false;
    entity.attackCooldownT = 0;
    entity.enemyAttackPulseT = 0;
    return entity;
  }

  function beginReset(entity, reason = 'leash') {
    if (!entity || !entity.alive) return false;
    if (entity.resetEnabled === false) return false;
    entity.aiState = STATES.RESET;
    entity.aggro = false;
    entity.aggroReason = null;
    entity.resetReason = reason;
    entity.damageable = false;
    entity.targetable = false;
    restoreResources(entity); // recursos recuperados imediatamente ao iniciar reset
    return true;
  }

  function finishReset(entity) {
    if (!entity) return false;
    entity.x = entity.spawnX;
    entity.y = entity.spawnY;
    entity.aiState = STATES.IDLE;
    entity.aggro = false;
    entity.aggroReason = null;
    entity.resetReason = null;
    entity.damageable = true;
    entity.targetable = true;
    entity.solid = true;
    restoreResources(entity);
    return true;
  }

  function plan(entity, playerX, playerY, playerAlive = true, playerFootOffsetY = DEFAULTS.playerFootOffsetY) {
    if (!entity || !entity.alive) return { mode: 'dead', active: false, dx: 0, dy: 0, distance: Infinity };

    if (entity.aiState === STATES.RESET) {
      const dx = entity.spawnX - entity.x;
      const dy = entity.spawnY - entity.y;
      const d = Math.hypot(dx, dy);
      if (d <= (Number.isFinite(entity.resetArrival) ? entity.resetArrival : DEFAULTS.resetArrival)) {
        return { mode: 'reset-arrived', active: true, dx: 0, dy: 0, distance: d };
      }
      return { mode: STATES.RESET, active: true, dx: dx / Math.max(0.001, d), dy: dy / Math.max(0.001, d), distance: d };
    }

    if (!playerAlive) {
      if (entity.aggro && entity.resetEnabled !== false) beginReset(entity, 'player-dead');
      return entity.aiState === STATES.RESET
        ? plan(entity, playerX, playerY, playerAlive)
        : { mode: STATES.IDLE, active: false, dx: 0, dy: 0, distance: Infinity };
    }

    // Passivos possuem FOV configurável, mas NÃO iniciam agressão automaticamente.
    // Se já foram provocados por dano (aggro=true), entram exatamente no mesmo
    // fluxo CHASE/ATTACK/RESET dos agressivos. O FOV não é necessário para reagir.
    if (!isAggressive(entity) && !entity.aggro) {
      entity.aiState = STATES.IDLE;
      return { mode: STATES.IDLE, active: false, dx: 0, dy: 0, distance: playerDistance(entity, playerX, playerY) };
    }

    if (isAggressive(entity) && !entity.aggro && canDetect(entity, playerX, playerY, playerAlive)) {
      entity.aggro = true;
      entity.aggroReason = 'fov';
    }

    if (!entity.aggro) {
      entity.aiState = STATES.IDLE;
      return { mode: STATES.IDLE, active: false, dx: 0, dy: 0, distance: playerDistance(entity, playerX, playerY) };
    }

    // IMPORTANTE: não há teste de FOV aqui. Sair do FOV não quebra aggro.
    if (shouldReset(entity)) {
      beginReset(entity, 'leash');
      return plan(entity, playerX, playerY, playerAlive, playerFootOffsetY);
    }

    // FIX1: a mesma distância de footprint usada pelo ataque real decide quando
    // CHASE termina. Assim a IA nunca estaciona fora do alcance efetivo.
    const combat = combatDelta(entity, playerX, playerY, playerFootOffsetY);
    const dx = combat.dx;
    const dy = combat.dy;
    const d = combat.distance;
    const attackRange = Number.isFinite(entity.attackRange) ? entity.attackRange : 150;
    if (d <= attackRange) {
      entity.aiState = STATES.ATTACK;
      return { mode: STATES.ATTACK, active: true, dx: 0, dy: 0, distance: d };
    }

    entity.aiState = STATES.CHASE;
    return { mode: STATES.CHASE, active: true, dx: dx / Math.max(0.001, d), dy: dy / Math.max(0.001, d), distance: d };
  }

  function canAttack(entity) {
    return !!entity && entity.alive === true && entity.damageable !== false && entity.aiState === STATES.ATTACK;
  }

  function selfTest() {
    const errors = [];
    const aggro = {
      alive: true, behavior: BEHAVIORS.AGGRESSIVE, aiState: STATES.IDLE, aggro: false,
      x: 0, y: 0, spawnX: 0, spawnY: 0, visionRange: 420, attackRange: 150,
      resetRange: 700, resetEnabled: true, maxHP: 1, hp: 0.5, damageable: true, targetable: true, solid: true
    };
    let p = plan(aggro, 300, 0, true);
    if (!aggro.aggro || p.mode !== STATES.CHASE) errors.push('Agressivo deve adquirir jogador dentro do FOV e iniciar chase');

    // Sair do FOV não encerra perseguição.
    p = plan(aggro, 600, 0, true);
    if (!aggro.aggro || p.mode !== STATES.CHASE) errors.push('Sair do FOV não pode resetar aggro já adquirido');

    aggro.x = 705;
    p = plan(aggro, 900, 0, true);
    if (p.mode !== STATES.RESET || aggro.damageable !== false || aggro.targetable !== false || aggro.hp !== 1) {
      errors.push('Leash deve iniciar reset, invulnerabilidade e recuperação imediata de recursos');
    }
    finishReset(aggro);
    if (aggro.x !== 0 || aggro.y !== 0 || aggro.aiState !== STATES.IDLE || !aggro.damageable || !aggro.targetable || aggro.hp !== 1) {
      errors.push('Fim do reset deve restaurar spawn e estado normal');
    }

    // FIX1 regressão: vindo do NORTE, centro pode estar <=150 enquanto os
    // footprints ainda estão >150 por causa dos offsets (28 player / 22 slime).
    const north = {
      alive: true, behavior: BEHAVIORS.AGGRESSIVE, aiState: STATES.CHASE, aggro: true,
      x: 0, y: 0, spawnX: 0, spawnY: 0, visionRange: 420, attackRange: 150,
      resetRange: 700, resetEnabled: true, collisionOffsetY: 22
    };
    p = plan(north, 0, 145, true, 28); // centro=145, footprints=151
    if (p.mode !== STATES.CHASE || p.distance <= 150) errors.push('FIX1: inimigo ao norte deve continuar chase até o footprint entrar no range');
    north.y = 1; // footprints agora =150 exatos
    p = plan(north, 0, 145, true, 28);
    if (p.mode !== STATES.ATTACK || Math.abs(p.distance - 150) > 1e-6) errors.push('FIX1: deve entrar em ATTACK exatamente quando footprints atingem 150');

    const passive = {
      alive: true, behavior: BEHAVIORS.PASSIVE, aiState: STATES.IDLE, aggro: false,
      x: 0, y: 0, spawnX: 0, spawnY: 0, visionRange: 420, attackRange: 150,
      resetRange: 700, resetEnabled: true
    };
    p = plan(passive, 20, 0, true);
    if (p.mode !== STATES.IDLE || passive.aggro) errors.push('Passivo não deve iniciar agressão automática mesmo dentro do FOV');

    // M001.10: dano provoca passivo independentemente de FOV.
    passive.maxHP = 2; passive.hp = 1;
    if (!provoke(passive, 'damage') || !passive.aggro) errors.push('Dano deve provocar inimigo passivo sobrevivente');
    p = plan(passive, 500, 0, true); // fora do FOV 420, mas já provocado
    if (p.mode !== STATES.CHASE || !passive.aggro) errors.push('Passivo provocado deve perseguir como agressivo mesmo fora do FOV');
    passive.x = 705;
    p = plan(passive, 900, 0, true);
    if (p.mode !== STATES.RESET || passive.damageable !== false || passive.hp !== 2) errors.push('Passivo provocado deve usar o mesmo leash/reset e restaurar HP');
    finishReset(passive);
    p = plan(passive, 20, 0, true);
    if (passive.behavior !== BEHAVIORS.PASSIVE || passive.aggro || p.mode !== STATES.IDLE) errors.push('Após reset, passivo deve voltar a ser passivo/IDLE');

    const vip = {
      alive: true, behavior: BEHAVIORS.AGGRESSIVE, aiState: STATES.CHASE, aggro: true,
      x: 900, y: 0, spawnX: 0, spawnY: 0, visionRange: 420, attackRange: 150,
      resetRange: 700, resetEnabled: false
    };
    if (shouldReset(vip)) errors.push('Inimigo com resetEnabled=false não pode resetar por leash');

    return { ok: errors.length === 0, errors };
  }

  window.RagbiaEnemyAIV0 = {
    STATES, BEHAVIORS, DEFAULTS,
    distance, playerDistance, combatDelta, combatDistance, spawnDistance,
    isAggressive, provoke, canDetect, shouldReset,
    restoreResources, beginReset, finishReset,
    plan, canAttack, selfTest
  };
})();
