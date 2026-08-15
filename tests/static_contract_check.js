'use strict';
const fs = require('fs');
const path = require('path');
const game = fs.readFileSync(path.resolve(__dirname, '..', 'phaser_map_beta', 'game.js'), 'utf8');
const targeting = fs.readFileSync(path.resolve(__dirname, '..', 'phaser_map_beta', 'targeting-soft.js'), 'utf8');
const collision = fs.readFileSync(path.resolve(__dirname, '..', 'phaser_map_beta', 'collision-v0.js'), 'utf8');
const entities = fs.readFileSync(path.resolve(__dirname, '..', 'phaser_map_beta', 'entities-v0.js'), 'utf8');
const checks = [
  ['startAttack exige selectedTarget', /startAttack\(\)[\s\S]*?const target = this\.selectedTarget\(\)[\s\S]*?if \(!target/],
  ['startAttack exige attackRange', /startAttack\(\)[\s\S]*?isInAttackRange\(target, this\.player\.x, this\.player\.y, this\.classId\)/],
  ['Soft filtra por targetRange', /softCandidates[\s\S]*?profile\.targetRange[\s\S]*?filter\(entry => entry\.distanceSq <= maxSq\)[\s\S]*?slice\(0, profile\.softCount\)/],
  ['Perfis possuem visionRange', /visionRange:\s*500[\s\S]*visionRange:\s*650/],
  ['Perfis possuem attackRange', /attackRange:\s*130[\s\S]*attackRange:\s*520/],
  ['Engage usa Space', /engage: 'SPACE'/],
  ['RT é Engage', /engageHeld: rt/],
  ['release não limpa target', /this\.engageHeld = engageHeldNow/],
  ['Facing lock', /lockFacingToTarget\(\)/],
  ['Anel vermelho', /0xd92f36/],
  ['Anel abaixo do slime', /targetGraphics = this\.add\.graphics\(\)\.setDepth\(9\)/],
  ['HUD informa fora de alcance', /FORA ATK/],
  ['Sem losango', !game.includes('fillPoints([\n        { x, y: topY')],
  ['Move recebe entidades', /RagbiaCollisionV0\.move\([\s\S]*?this\.entities/.test(game)],
  ['Collision possui collidesEntities', /function collidesEntities\(/.test(collision)],
  ['Entidades sólidas possuem footprint', /solid:\s*true[\s\S]*collisionRadius:\s*30[\s\S]*collisionOffsetY:\s*22/.test(entities)]
];
let failed = false;
for (const [name, test] of checks) {
  const source = name.includes('Soft') || name.includes('Perfis') ? targeting : game;
  const ok = typeof test === 'boolean' ? test : test.test(source);
  console.log(`${ok ? 'OK' : 'FAIL'} — ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
