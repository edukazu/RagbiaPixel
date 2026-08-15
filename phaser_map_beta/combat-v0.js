(() => {
  'use strict';

  // M001.5A — Telegraph Inimigo V1
  // Escala mínima deliberada para facilitar leitura e detectar erros:
  // Player HP 1 / ATK 1; inimigos HP 1 / ATK 0.5.
  // O ataque inimigo é ativado sem perseguição/IA de movimento: só conecta se o
  // jogador permanecer dentro do alcance de laboratório durante o windup.

  const PLAYER_BASE = Object.freeze({ maxHP: 1, hp: 1, attack: 1 });
  const ENEMY_BASE = Object.freeze({ maxHP: 1, hp: 1, attack: 0.5 });
  const ENEMY_ATTACK_V0 = Object.freeze({ range: 150, cooldown: 1.60, windup: 1.00, hitAt: 1.00, telegraphStartRatio: 0.28 });

  function createPlayerStats() {
    return { ...PLAYER_BASE, alive: true, damageable: true };
  }

  function ensureEntityStats(entity) {
    if (!entity) return entity;
    if (!Number.isFinite(entity.maxHP)) entity.maxHP = ENEMY_BASE.maxHP;
    if (!Number.isFinite(entity.hp)) entity.hp = entity.maxHP;
    if (!Number.isFinite(entity.attack)) entity.attack = ENEMY_BASE.attack;
    if (entity.damageable === undefined) entity.damageable = true;
    return entity;
  }

  function canReceiveDamage(entity) {
    return !!entity && entity.alive === true && entity.damageable !== false && Number.isFinite(entity.hp) && entity.hp > 0;
  }

  function applyDamage(entity, amount) {
    ensureEntityStats(entity);
    const damage = Number(amount);
    if (!canReceiveDamage(entity) || !Number.isFinite(damage) || damage <= 0) {
      return { applied: false, damage: 0, hpBefore: entity ? entity.hp : null, hpAfter: entity ? entity.hp : null, killed: false };
    }
    const hpBefore = entity.hp;
    entity.hp = Math.max(0, entity.hp - damage);
    const killed = entity.hp <= 0;
    if (killed) {
      entity.alive = false;
      entity.targetable = false;
      entity.solid = false;
    }
    return { applied: true, damage, hpBefore, hpAfter: entity.hp, killed };
  }


  function respawnPlayer(stats) {
    if (!stats) return null;
    stats.maxHP = PLAYER_BASE.maxHP;
    stats.hp = stats.maxHP;
    stats.attack = PLAYER_BASE.attack;
    stats.alive = true;
    stats.damageable = true;
    return stats;
  }

  function respawnEntity(entity) {
    if (!entity) return null;
    ensureEntityStats(entity);
    entity.hp = entity.maxHP;
    entity.alive = true;
    entity.targetable = true;
    entity.solid = true;
    entity.damageable = true;
    if (Number.isFinite(entity.spawnX)) entity.x = entity.spawnX;
    if (Number.isFinite(entity.spawnY)) entity.y = entity.spawnY;
    entity.hitFlashT = 0;
    entity.hitKnockT = 0;
    entity.hitKnockMax = 0;
    entity.hitKnockX = 0;
    entity.hitKnockY = 0;
    entity.hitKnockDistance = 0;
    entity.visualOffsetX = 0;
    entity.visualOffsetY = 0;
    entity.deathAnimating = false;
    entity.deathT = 0;
    entity.respawnT = 0;
    entity.enemyAttackT = 0;
    entity.enemyAttackHitApplied = false;
    entity.attackCooldownT = 0.45;
    entity.enemyAttackPulseT = 0;
    // M001.9: respawn também reinicia o estado de IA.
    entity.aiState = 'idle';
    entity.aggro = false;
    entity.aggroReason = null;
    entity.resetReason = null;
    entity.aiBlocked = false;
    return entity;
  }

  function projectileHitsEntity(px, py, projectileRadius, entity) {
    if (!canReceiveDamage(entity)) return false;
    const r = Number.isFinite(entity.hitRadius) ? entity.hitRadius : 34;
    const oy = Number.isFinite(entity.hitOffsetY) ? entity.hitOffsetY : 0;
    const dx = px - entity.x;
    const dy = py - (entity.y + oy);
    const rr = r + (Number.isFinite(projectileRadius) ? projectileRadius : 8);
    return dx * dx + dy * dy <= rr * rr;
  }

  function selfTest() {
    const errors = [];
    const player = createPlayerStats();
    if (player.maxHP !== 1 || player.hp !== 1 || player.attack !== 1 || !player.alive) errors.push('Player deve iniciar HP 1 / ATK 1 e vivo');
    const pHalf = applyDamage(player, 0.5);
    if (!pHalf.applied || pHalf.hpAfter !== 0.5 || pHalf.killed) errors.push('Primeiro hit inimigo 0.5 deve deixar Player HP 0.5');
    const pKill = applyDamage(player, 0.5);
    if (!pKill.killed || player.hp !== 0 || player.alive) errors.push('Segundo hit inimigo 0.5 deve matar Player HP 1');
    respawnPlayer(player);
    if (!player.alive || player.hp !== 1 || !player.damageable) errors.push('Respawn do Player deve restaurar HP 1 e estado vivo');
    const enemy = { id:'test', alive:true, targetable:true, solid:true, damageable:true, maxHP:1, hp:1, attack:0.5, x:0, y:0 };
    if (enemy.attack !== 0.5) errors.push('Inimigo deve ter ATK 0.5');
    const half = applyDamage({ ...enemy }, 0.5);
    if (!half.applied || half.hpAfter !== 0.5 || half.killed) errors.push('0.5 de dano deve deixar HP 0.5');
    const victim = { ...enemy };
    const hit = applyDamage(victim, 1);
    if (!hit.applied || !hit.killed || victim.hp !== 0 || victim.alive || victim.targetable || victim.solid) {
      errors.push('1 de dano deve matar inimigo HP 1 e remover target/solidez');
    }
    const deadAgain = applyDamage(victim, 1);
    if (deadAgain.applied) errors.push('Inimigo morto não pode receber novo dano');
    victim.spawnX = 12; victim.spawnY = 34; victim.x = 99; victim.y = 88;
    respawnEntity(victim);
    if (!victim.alive || !victim.targetable || !victim.solid || victim.hp !== 1 || victim.x !== 12 || victim.y !== 34) {
      errors.push('Respawn deve restaurar HP/estado/solidez e ponto de spawn');
    }
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaCombatV0 = {
    PLAYER_BASE,
    ENEMY_BASE,
    ENEMY_ATTACK_V0,
    createPlayerStats,
    respawnPlayer,
    ensureEntityStats,
    canReceiveDamage,
    applyDamage,
    respawnEntity,
    projectileHitsEntity,
    selfTest
  };
})();
