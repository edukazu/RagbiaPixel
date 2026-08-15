const fs = require('fs');
const g = fs.readFileSync('phaser_map_beta/game.js','utf8');
const i = fs.readFileSync('phaser_map_beta/index.html','utf8');
const checks = [
  ['CORE title', i.includes('Ragbia Pixel — CORE V0.1')],
  ['debug starts off', g.includes('this.debugMode = false')],
  ['C toggles debug', g.includes('this.debugMode = !this.debugMode')],
  ['AI state visuals gated by debug', /renderEnemyStateVisuals\(time\)[\s\S]*?if \(!this\.debugMode\) return;/.test(g)],
  ['normal HUD hides behavior/state', g.includes('HUD normal: não expõe PASSIVO/AGRESSIVO, FOV, leash ou estado interno da IA.')],
  ['debug contains AI metadata', g.includes("IA ${selected.behavior === 'aggressive' ? 'AGRESSIVO' : 'PASSIVO'}")],
  ['debug label exists', g.includes("DEBUG OFF") && g.includes("DEBUG ON")],
  ['Phaser pinned', i.includes('vendor/phaser.min.js')]
];
const failed = checks.filter(x => !x[1]);
if (failed.length) {
  console.error(failed.map(x => 'FAIL — ' + x[0]).join('\n'));
  process.exit(1);
}
console.log('OK — CORE V0.1 debug isolation + baseline markers.');
