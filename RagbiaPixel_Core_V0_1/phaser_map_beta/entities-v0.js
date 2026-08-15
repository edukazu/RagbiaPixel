(() => {
  'use strict';

  // M001.3 — Entidades V0
  // Modelo lógico mínimo, independente do Phaser. A view (sprite) é apenas
  // uma referência opcional anexada em runtime.

  function createSlimes(spawns) {
    return spawns.map((spawn, index) => ({
      id: `slime-${String(index + 1).padStart(2, '0')}`,
      kind: 'slime',
      faction: 'enemy',
      targetable: true,
      alive: true,
      x: spawn.x,
      y: spawn.y,
      spawnX: spawn.x,
      spawnY: spawn.y,
      radius: 30,
      // M001.4: escala mínima de combate.
      // M001.10: Slime-02 é o passivo-teste robusto para sobreviver ao primeiro hit.
      maxHP: index === 1 ? 2 : 1,
      hp: index === 1 ? 2 : 1,
      attack: 0.5,
      damageable: true,
      // M001.5A: ataque inimigo mais lento + telegraph expansivo (sem perseguição).
      attackRange: 150,
      attackCooldown: 1.60,
      attackCooldownT: 0.35 + index * 0.07,
      attackWindup: 1.00,
      enemyAttackT: 0,
      enemyAttackHitApplied: false,
      // M001.9: IA V0. Índices pares (1,3,5,7 visualmente) são agressivos;
      // índices ímpares são passivos para comparação no mesmo laboratório.
      behavior: index % 2 === 0 ? 'aggressive' : 'passive',
      labRole: index === 1 ? 'passive-reactive-test' : null,
      aiState: 'idle',
      aggro: false,
      visionRange: 420,
      resetRange: 700,
      resetEnabled: true,
      moveSpeed: 165,
      resetSpeed: 240,
      resetArrival: 10,
      resetReason: null,
      aiBlocked: false,
      hitRadius: 34,
      hitOffsetY: -8,
      // M001.3C: footprint físico próprio, menor que o sprite.
      solid: true,
      collisionRadius: 30,
      collisionOffsetY: 22,
      // M001.4A: estado visual mínimo de hit/morte/respawn.
      hitFlashT: 0,
      hitKnockT: 0,
      hitKnockMax: 0,
      hitKnockX: 0,
      hitKnockY: 0,
      hitKnockDistance: 0,
      visualOffsetX: 0,
      visualOffsetY: 0,
      deathAnimating: false,
      deathT: 0,
      respawnT: 0,
      enemyAttackPulseT: 0,
      view: null
    }));
  }

  function attachView(entity, view) {
    entity.view = view;
    if (view) {
      view.entityId = entity.id;
      view.entityKind = entity.kind;
    }
    return entity;
  }

  function syncFromView(entity) {
    if (!entity || !entity.view) return entity;
    // M001.4B: offsets de knock são somente visuais e não podem contaminar
    // a posição lógica usada por colisão/targeting.
    entity.x = entity.view.x - (Number(entity.visualOffsetX) || 0);
    entity.y = entity.view.y - (Number(entity.visualOffsetY) || 0);
    return entity;
  }

  function byId(entities, id) {
    return entities.find(entity => entity.id === id) || null;
  }

  function isValidEnemy(entity) {
    return !!entity && entity.alive === true && entity.targetable === true && entity.faction === 'enemy';
  }

  window.RagbiaEntitiesV0 = {
    createSlimes,
    attachView,
    syncFromView,
    byId,
    isValidEnemy
  };
})();
