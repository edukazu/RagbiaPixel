'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..', 'phaser_map_beta');
global.window = global;
vm.runInThisContext(fs.readFileSync(path.join(root, 'entities-v0.js'), 'utf8'), { filename: 'entities-v0.js' });
vm.runInThisContext(fs.readFileSync(path.join(root, 'targeting-soft.js'), 'utf8'), { filename: 'targeting-soft.js' });

const result = RagbiaTargetingSoft.selfTest();
if (!result.ok) {
  console.error('FAIL:', result.errors.join(' | '));
  process.exit(1);
}

const enemies = [
  { id:'n1', x:100, y:0, alive:true, targetable:true, faction:'enemy' },
  { id:'n2', x:200, y:0, alive:true, targetable:true, faction:'enemy' },
  { id:'n3', x:300, y:0, alive:true, targetable:true, faction:'enemy' },
  { id:'far', x:700, y:0, alive:true, targetable:true, faction:'enemy' }
];
const soft = RagbiaTargetingSoft.softCandidates(enemies, 0, 0, 'warrior');
if (soft.length !== 2 || soft[0].entity.id !== 'n1' || soft[1].entity.id !== 'n2') {
  console.error('FAIL: contrato dos dois mais próximos dentro do FOV');
  process.exit(1);
}
const noSoft = RagbiaTargetingSoft.softCandidates([
  { id:'far1', x:600, y:0, alive:true, targetable:true, faction:'enemy' }
], 0, 0, 'warrior');
if (noSoft.length !== 0) {
  console.error('FAIL: Soft Target adquiriu inimigo fora do FOV');
  process.exit(1);
}
if (RagbiaTargetingSoft.cycle('n2', soft, 1) !== 'n1') {
  console.error('FAIL: wrap dos dois mais próximos');
  process.exit(1);
}
if (!RagbiaTargetingSoft.isInAttackRange(enemies[0], 0, 0, 'warrior')) {
  console.error('FAIL: guerreiro deveria atacar n1 a 100 px');
  process.exit(1);
}
if (RagbiaTargetingSoft.isInAttackRange(enemies[1], 0, 0, 'warrior')) {
  console.error('FAIL: guerreiro não deveria atacar n2 a 200 px');
  process.exit(1);
}
console.log('OK — Soft Target respeita FOV e attackRange é independente.');
