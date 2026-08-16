const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'phaser_map_beta', 'house-collision-v1.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(code, context);
const C = context.window.RagbiaHouseCollisionV1;
assert(C, 'RagbiaHouseCollisionV1 ausente');
const result = C.selfTest();
assert(result.ok, result.errors.join(' | '));
assert(C.shapes.some(s => s.id === 'weapon-rack'), 'colisor do suporte de armas ausente');
assert(C.shapes.some(s => s.id === 'central-table'), 'colisor da mesa central ausente');
assert(C.interactionZones.some(s => s.id === 'weapon-rack-zone'), 'zona de interação futura ausente');
console.log('m002_2a1_collision_selftest: OK');
