const assert = require('assert');
const path = require('path');

const c = require(path.join(__dirname, '..', 'phaser_map_beta', 'microtest-northwall-collision-v0.js'));

const result = c.selfTest();
assert(result.ok, result.errors.join(' | '));
assert.strictEqual(c.shapes.length, 3, 'microteste deve manter colisão mínima: parede + hearth + woodpile');
assert.strictEqual(c.collidesAnchor(c.spawn.x, c.spawn.y).hit, false, 'spawn deve ser livre');

const moved = c.move(c.spawn.x, c.spawn.y, 0, -500);
assert(moved.y > 270 && moved.y < 320, `movimento para norte parou em Y inesperado: ${moved.y}`);
assert(moved.hit, 'movimento contra parede deveria registrar hit');

console.log('m002_2b0_collision_selftest: OK');
