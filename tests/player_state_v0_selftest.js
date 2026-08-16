const assert = require('assert');
const PlayerState = require('../phaser_map_beta/player-state-v0.js');

const s = PlayerState.create('  Edu   Kazu  ');
assert.strictEqual(s.name, 'Edu Kazu');
assert.strictEqual(s.classId, 'apprentice');
assert.strictEqual(s.className, 'Aprendiz');
assert.strictEqual(s.outfitId, 'apprentice');
assert.deepStrictEqual(s.stats, { hp: 1, attack: 1, defense: 1 });
assert.deepStrictEqual(s.equipment, { weapon: null });
assert.deepStrictEqual(s.items, []);
assert.strictEqual(PlayerState.validate(s).ok, true);
assert.throws(() => PlayerState.create('   '), /obrigatório/);

console.log('player_state_v0_selftest: OK');
