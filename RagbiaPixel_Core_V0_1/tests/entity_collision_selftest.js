'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..', 'phaser_map_beta');
global.window = global;
vm.runInThisContext(fs.readFileSync(path.join(root, 'entities-v0.js'), 'utf8'), { filename: 'entities-v0.js' });
vm.runInThisContext(fs.readFileSync(path.join(root, 'collision-v0.js'), 'utf8'), { filename: 'collision-v0.js' });

const enemy = {
  id: 'test-enemy', x: 2000, y: 1000, alive: true, targetable: true, faction: 'enemy',
  solid: true, collisionRadius: 30, collisionOffsetY: 22
};
// player anchor y=994 => pé=1022; collider inimigo y=1022.
let hit = RagbiaCollisionV0.collidesEntities(2000, 994, [enemy]);
if (!hit.hit || hit.shape.entityId !== 'test-enemy') {
  console.error('FAIL: overlap com inimigo sólido não detectado'); process.exit(1);
}
hit = RagbiaCollisionV0.collidesEntities(1900, 994, [enemy]);
if (hit.hit) { console.error('FAIL: inimigo distante bloqueou'); process.exit(1); }
const dead = { ...enemy, alive: false };
if (RagbiaCollisionV0.collidesEntities(2000, 994, [dead]).hit) {
  console.error('FAIL: inimigo morto bloqueou'); process.exit(1);
}
const ghost = { ...enemy, solid: false };
if (RagbiaCollisionV0.collidesEntities(2000, 994, [ghost]).hit) {
  console.error('FAIL: entidade não sólida bloqueou'); process.exit(1);
}
const collider = RagbiaCollisionV0.entityColliderFor(enemy);
if (!collider || collider.r !== 30 || collider.y !== 1022) {
  console.error('FAIL: footprint de entidade incorreto'); process.exit(1);
}
console.log('OK — colisão jogador ↔ entidade sólida validada.');

// Procura um trecho horizontal livre de cenário e confirma que a entidade passa
// a ser o único bloqueio da movimentação.
let lane = null;
for (let y = 350; y <= 2200 && !lane; y += 90) {
  for (let x = 350; x <= 3000 && !lane; x += 90) {
    if (RagbiaCollisionV0.collidesAnchor(x, y).hit) continue;
    const freeMove = RagbiaCollisionV0.move(x, y, 120, 0, []);
    if (!freeMove.blockedX && Math.abs(freeMove.x - (x + 120)) < 0.01) lane = { x, y };
  }
}
if (!lane) { console.error('FAIL: não foi encontrada pista livre para testar move dinâmico'); process.exit(1); }
const blocker = { ...enemy, id:'move-blocker', x: lane.x + 85, y: lane.y + 6 };
const dynamicMove = RagbiaCollisionV0.move(lane.x, lane.y, 120, 0, [blocker]);
if (!dynamicMove.blockedX || dynamicMove.x >= lane.x + 80 || !dynamicMove.hit || dynamicMove.hit.entityId !== 'move-blocker') {
  console.error('FAIL: move não parou/identificou a entidade sólida', dynamicMove); process.exit(1);
}
console.log('OK — move em micropassos respeita entidade sólida e retorna seu ID.');
