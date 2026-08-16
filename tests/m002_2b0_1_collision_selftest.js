const assert = require('assert');
const path = require('path');

const c = require(path.join(__dirname, '..', 'phaser_map_beta', 'microtest-northwall-collision-v1.js'));

const result = c.selfTest();
assert(result.ok, result.errors.join(' | '));
assert.strictEqual(c.shapes.length, 3, 'microteste v1 deve manter colisão mínima');
assert.strictEqual(c.collidesAnchor(c.spawn.x, c.spawn.y).hit, false, 'spawn v1 deve ser livre');

const moved = c.move(c.spawn.x, c.spawn.y, 0, -420);
assert(moved.y < c.spawn.y, 'movimento para norte deveria subir na v1');
assert(moved.y > 250, 'movimento para norte deveria parar antes de entrar demais na parede na v1');
assert(moved.hit, 'movimento contra parede deveria registrar hit na v1');

console.log('m002_2b0_1_collision_selftest: OK');
