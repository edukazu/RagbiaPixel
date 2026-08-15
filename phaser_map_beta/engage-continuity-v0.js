(() => {
  'use strict';

  // M001.8 — Continuidade do Engage após morte do alvo.
  // Este módulo não move nem ataca: define somente a política de encadeamento.
  // A aquisição automática reutiliza EXCLUSIVAMENTE o pool de Soft Target já
  // filtrado por FOV/validade pela camada de targeting.

  function shouldArm(engageHeld, killedWasSelected, playerAlive = true, engageNeedsRelease = false) {
    return !!engageHeld && !!killedWasSelected && !!playerAlive && !engageNeedsRelease;
  }

  function chooseNextId(candidateEntries, excludedId = null) {
    if (!Array.isArray(candidateEntries)) return null;
    for (const entry of candidateEntries) {
      const id = entry && entry.entity && entry.entity.id;
      if (id && id !== excludedId) return id;
    }
    return null;
  }

  function selfTest() {
    const errors = [];
    const candidates = [
      { entity: { id: 'slime-01' } },
      { entity: { id: 'slime-02' } }
    ];
    if (!shouldArm(true, true, true, false)) errors.push('Engage segurado + alvo selecionado morto deve armar continuidade');
    if (shouldArm(false, true, true, false)) errors.push('release do Engage não pode armar continuidade');
    if (shouldArm(true, false, true, false)) errors.push('morte de entidade que não era o alvo não pode trocar alvo');
    if (shouldArm(true, true, false, false)) errors.push('player morto não pode continuar Engage');
    if (shouldArm(true, true, true, true)) errors.push('cancelamento explícito não pode continuar Engage');
    if (chooseNextId(candidates, 'slime-01') !== 'slime-02') errors.push('deve ignorar o alvo recém-morto e escolher o próximo Soft Target');
    if (chooseNextId([{ entity:{ id:'slime-01' } }], 'slime-01') !== null) errors.push('sem sucessor válido deve permanecer sem alvo');
    if (chooseNextId([], null) !== null) errors.push('pool vazio deve retornar null');
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaEngageContinuityV0 = { shouldArm, chooseNextId, selfTest };
})();
