const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'phaser_map_beta', 'index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'phaser_map_beta', 'm002-house-game.js'), 'utf8');
const asset = path.join(root, 'phaser_map_beta', 'assets', 'house_avo_pixel_v1.png');

assert(fs.existsSync(asset), 'asset pixelado M002.2A.1 ausente');
assert(fs.statSync(asset).size > 500000, 'asset visual M002.2A.1 parece inválido/pequeno demais');
for (const token of ['house-collision-v1.js', "s.src = 'm002-house-game.js'", 'M002.2A.1']) {
  assert(html.includes(token), `index sem contrato M002.2A.1: ${token}`);
}
for (const token of [
  "this.load.image('house-art-v1', 'assets/house_avo_pixel_v1.png')",
  'RagbiaHouseCollisionV1.move',
  'this.player.setDepth(this.player.y)',
  'createOccluder',
  "'occ-table'",
  "'occ-desk'",
  "'occ-rack'",
  'Casa do Avô — M002.2A.1'
]) {
  assert(game.includes(token), `runtime sem contrato M002.2A.1: ${token}`);
}
assert(!game.includes('createSlimes'), 'M002.2A.1 não deve carregar Slimes');
assert(!game.includes('toggleClass'), 'M002.2A.1 não deve permitir troca técnica de classe');
console.log('m002_2a1_visual_static_contract: OK');
