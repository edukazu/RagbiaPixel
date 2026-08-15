const fs = require('fs');
const g = fs.readFileSync('phaser_map_beta/game.js','utf8');
const i = fs.readFileSync('phaser_map_beta/index.html','utf8');
const checks = [
  ['visual module loaded', i.includes('enemy-state-visual-v0.js')],
  ['visual global checked', i.includes('RagbiaEnemyStateVisualV0')],
  ['state render method', g.includes('renderEnemyStateVisuals(time)')],
  ['state visuals invoked', g.includes('this.renderEnemyStateVisuals(time)')],
  ['no IA logic mutation marker', g.includes('indicadores de estado são DEBUG-ONLY')]
];
const failed = checks.filter(x=>!x[1]);
if (failed.length) { console.error(failed.map(x=>'FAIL '+x[0]).join('\n')); process.exit(1); }
console.log('OK enemy_state_visual_v0_static_contract');
