(() => {
  'use strict';

  // M001.3B — Soft Target limitado pelo FOV + attackRange separado.
  // Valores continuam provisórios de laboratório; o contrato é a parte em validação.
  const PROFILES = Object.freeze({
    warrior: Object.freeze({
      id: 'warrior',
      visionRange: 500,
      targetRange: 500,
      attackRange: 130,
      softCount: 2,
      fovShape: 'radius'
    }),
    archer: Object.freeze({
      id: 'archer',
      visionRange: 650,
      targetRange: 650,
      attackRange: 520,
      softCount: 2,
      fovShape: 'radius'
    })
  });

  function distanceSq(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
  }

  function distance(ax, ay, bx, by) {
    return Math.sqrt(distanceSq(ax, ay, bx, by));
  }

  function profileFor(classId) {
    return PROFILES[classId] || PROFILES.warrior;
  }

  function sortedValidEnemies(entities, playerX, playerY) {
    return entities
      .filter(entity => RagbiaEntitiesV0.isValidEnemy(entity))
      .map(entity => ({
        entity,
        distanceSq: distanceSq(playerX, playerY, entity.x, entity.y)
      }))
      .sort((a, b) => a.distanceSq - b.distanceSq || a.entity.id.localeCompare(b.entity.id));
  }

  function fieldCandidates(entities, playerX, playerY, classId) {
    const profile = profileFor(classId);
    const maxSq = profile.visionRange * profile.visionRange;
    return sortedValidEnemies(entities, playerX, playerY)
      .filter(entry => entry.distanceSq <= maxSq);
  }

  function softCandidates(entities, playerX, playerY, classId) {
    const profile = profileFor(classId);
    // M001.3B: Soft Target usa o MESMO limite espacial de visão/target da classe,
    // mas reduz a lista aos 2 inimigos válidos mais próximos dentro desse alcance.
    const maxSq = profile.targetRange * profile.targetRange;
    return sortedValidEnemies(entities, playerX, playerY)
      .filter(entry => entry.distanceSq <= maxSq)
      .slice(0, profile.softCount);
  }

  function isInAttackRange(entity, playerX, playerY, classId) {
    if (!RagbiaEntitiesV0.isValidEnemy(entity)) return false;
    const profile = profileFor(classId);
    return distanceSq(playerX, playerY, entity.x, entity.y) <= profile.attackRange * profile.attackRange;
  }

  function attackDistance(entity, playerX, playerY) {
    if (!entity) return Infinity;
    return distance(playerX, playerY, entity.x, entity.y);
  }

  function cycle(currentId, candidateEntries, direction = 1) {
    if (!candidateEntries.length) return null;
    const ids = candidateEntries.map(entry => entry.entity.id);
    if (!currentId || !ids.includes(currentId)) {
      return direction >= 0 ? ids[0] : ids[ids.length - 1];
    }
    const index = ids.indexOf(currentId);
    const next = (index + (direction >= 0 ? 1 : -1) + ids.length) % ids.length;
    return ids[next];
  }

  function keepIfEnemyValid(currentId, entities) {
    if (!currentId) return null;
    const entity = RagbiaEntitiesV0.byId(entities, currentId);
    return RagbiaEntitiesV0.isValidEnemy(entity) ? currentId : null;
  }

  function selfTest() {
    const fake = [
      { id: 'a', x: 100, y: 0, alive: true, targetable: true, faction: 'enemy' },
      { id: 'b', x: 200, y: 0, alive: true, targetable: true, faction: 'enemy' },
      { id: 'c', x: 300, y: 0, alive: true, targetable: true, faction: 'enemy' },
      { id: 'outside-warrior', x: 550, y: 0, alive: true, targetable: true, faction: 'enemy' },
      { id: 'outside-all', x: 2000, y: 0, alive: true, targetable: true, faction: 'enemy' },
      { id: 'dead', x: 50, y: 0, alive: false, targetable: true, faction: 'enemy' }
    ];
    const errors = [];
    const soft = softCandidates(fake, 0, 0, 'warrior');
    const field = fieldCandidates(fake, 0, 0, 'warrior');
    if (soft.map(x => x.entity.id).join(',') !== 'a,b') errors.push('soft precisa conter os 2 mais próximos dentro do FOV');
    if (field.map(x => x.entity.id).join(',') !== 'a,b,c') errors.push('campo de visão deve conter todos os válidos dentro do alcance');
    if (softCandidates([{ id:'far', x:600, y:0, alive:true, targetable:true, faction:'enemy' }], 0, 0, 'warrior').length !== 0) {
      errors.push('soft não pode adquirir alvo fora do FOV/targetRange');
    }
    if (cycle(null, soft, 1) !== 'a') errors.push('primeira seleção soft');
    if (cycle('a', soft, 1) !== 'b') errors.push('ciclo soft');
    if (cycle('b', soft, 1) !== 'a') errors.push('wrap soft');
    if (cycle('b', field, 1) !== 'c') errors.push('ciclo campo de visão');
    if (keepIfEnemyValid('c', fake) !== 'c') errors.push('alvo válido deve ser preservado fora da lista soft');
    if (keepIfEnemyValid('dead', fake) !== null) errors.push('alvo morto deve ser invalidado');
    if (!isInAttackRange(fake[0], 0, 0, 'warrior')) errors.push('guerreiro deve poder atacar alvo a 100 px');
    if (isInAttackRange(fake[1], 0, 0, 'warrior')) errors.push('guerreiro não deve atacar alvo a 200 px');
    if (!isInAttackRange({ id:'archer-in', x:500, y:0, alive:true, targetable:true, faction:'enemy' }, 0, 0, 'archer')) {
      errors.push('arqueiro deve poder atacar alvo a 500 px');
    }
    if (isInAttackRange({ id:'archer-out', x:600, y:0, alive:true, targetable:true, faction:'enemy' }, 0, 0, 'archer')) {
      errors.push('arqueiro não deve atacar alvo a 600 px');
    }
    if (profileFor('archer').visionRange === profileFor('warrior').visionRange) errors.push('perfis de visão devem ser independentes');
    if (profileFor('warrior').attackRange >= profileFor('warrior').targetRange) errors.push('attackRange do guerreiro precisa ser menor que targetRange');
    if (profileFor('archer').attackRange >= profileFor('archer').targetRange) errors.push('attackRange do arqueiro precisa ser menor que targetRange');
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaTargetingSoft = {
    PROFILES,
    profileFor,
    fieldCandidates,
    softCandidates,
    isInAttackRange,
    attackDistance,
    cycle,
    keepIfEnemyValid,
    selfTest
  };
})();
