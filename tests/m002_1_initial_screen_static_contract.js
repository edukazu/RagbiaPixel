const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'phaser_map_beta', 'index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'phaser_map_beta', 'game.js'), 'utf8');

for (const token of ['id="start-screen"', 'id="character-name"', 'id="play-button"', 'player-state-v0.js']) {
  assert(html.includes(token), `index.html sem contrato M002.1: ${token}`);
}
for (const token of ['RagbiaPlayerStateV0.create(rawName)', 'window.RagbiaPlayerSession = state', 'setupStartScreen()', 'RagbiaBoot.ready']) {
  assert(game.includes(token), `game.js sem contrato M002.1: ${token}`);
}

// FIX1: identidade deve ocupar linha própria e o HUD normal deve refletir a classe da sessão.
for (const token of [
  'this.add.text(42, 70, identity',
  'this.hudStatus = this.add.text(42, 108',
  "const displayClass = this.playerSession?.className",
  'LAB CLASS ${this.classId.toUpperCase()}'
]) {
  assert(game.includes(token), `game.js sem correção visual M002.1 FIX1: ${token}`);
}
assert(!game.includes('Classe: Q/E ou Y'), 'atalho técnico de troca de classe não deve ser anunciado no HUD normal M002.1');

console.log('m002_1_initial_screen_static_contract: OK');
