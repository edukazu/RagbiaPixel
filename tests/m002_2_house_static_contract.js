const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'phaser_map_beta', 'index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'phaser_map_beta', 'm002-house-game.js'), 'utf8');
const map = fs.readFileSync(path.join(root, 'phaser_map_beta', 'house-map-v0.js'), 'utf8');

for (const token of ['apprentice-art-v0.js', 'house-map-v0.js', 'house-collision-v0.js', "s.src = 'm002-house-game.js'"]) {
  assert(html.includes(token), `index sem runtime M002.2: ${token}`);
}
for (const token of ['Casa do Avô — M002.2', 'RagbiaHouseMapV0.create(this)', 'RagbiaHouseCollisionV0.move', 'apprentice-${this.dir}', 'this.playerSession.name']) {
  assert(game.includes(token), `game M002.2 sem contrato: ${token}`);
}
assert(!game.includes('toggleClass'), 'M002.2 não deve permitir troca técnica de classe');
assert(!game.includes('createSlimes'), 'M002.2 não deve carregar Slimes na Casa do Avô');
assert(!game.includes('ENGAGE'), 'M002.2 não deve exibir Engage no runtime normal da casa');
for (const token of ['drawBed', 'drawFireplace', 'drawTable', 'drawWeaponRack', 'drawDesk']) {
  assert(map.includes(token), `mapa da casa sem elemento de referência: ${token}`);
}
console.log('m002_2_house_static_contract: OK');
