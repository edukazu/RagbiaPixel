(() => {
  'use strict';

  const BASE_STATS = Object.freeze({ hp: 1, attack: 1, defense: 1 });

  function normalizeName(value) {
    return String(value == null ? '' : value).trim().replace(/\s+/g, ' ');
  }

  function create(name) {
    const normalizedName = normalizeName(name);
    if (!normalizedName) throw new Error('O nome do personagem é obrigatório.');

    return {
      name: normalizedName,
      classId: 'apprentice',
      className: 'Aprendiz',
      outfitId: 'apprentice',
      stats: {
        hp: BASE_STATS.hp,
        attack: BASE_STATS.attack,
        defense: BASE_STATS.defense
      },
      equipment: {
        weapon: null
      },
      items: []
    };
  }

  function validate(state) {
    const errors = [];
    if (!state || typeof state !== 'object') return { ok: false, errors: ['estado ausente'] };
    if (!normalizeName(state.name)) errors.push('nome ausente');
    if (state.classId !== 'apprentice') errors.push('classId inicial deve ser apprentice');
    if (state.className !== 'Aprendiz') errors.push('className inicial deve ser Aprendiz');
    if (state.outfitId !== 'apprentice') errors.push('outfitId inicial deve ser apprentice');
    if (!state.stats || state.stats.hp !== 1 || state.stats.attack !== 1 || state.stats.defense !== 1) {
      errors.push('atributos iniciais devem ser HP=1, Ataque=1, Defesa=1');
    }
    if (!state.equipment || state.equipment.weapon !== null) errors.push('arma inicial deve estar vazia');
    if (!Array.isArray(state.items) || state.items.length !== 0) errors.push('inventário inicial deve estar vazio');
    return { ok: errors.length === 0, errors };
  }

  const api = { BASE_STATS, normalizeName, create, validate };
  if (typeof window !== 'undefined') window.RagbiaPlayerStateV0 = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
