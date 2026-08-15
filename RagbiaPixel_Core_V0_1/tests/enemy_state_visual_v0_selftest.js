const fs = require('fs');
const vm = require('vm');
global.window = global;
vm.runInThisContext(fs.readFileSync('phaser_map_beta/enemy-state-visual-v0.js','utf8'));
const r = RagbiaEnemyStateVisualV0.selfTest();
if (!r.ok) { console.error(r.errors.join('\n')); process.exit(1); }
console.log('OK enemy_state_visual_v0_selftest');
