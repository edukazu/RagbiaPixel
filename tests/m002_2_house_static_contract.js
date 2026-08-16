const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'phaser_map_beta', 'index.html'), 'utf8');
const game = fs.readFileSync(path.join(root, 'phaser_map_beta', 'm002-house-game.js'), 'utf8');
const map = fs.readFileSync(path.join(root, 'phaser_map_beta', 'house-map-v0.js'), 'utf8');

// O protótipo procedural M002.2 permanece no repositório como histórico/auditoria.
for (const token of ['apprentice-art-v0.js', 'house-map-v0.js', 'house-collision-v0.js', "s.src = 'm002-house-game.js'"]) {
  assert(html.includes(token), `index sem legado auditável M002.2: ${token}`);
}
for (const token of ['drawBed', 'drawFireplace', 'drawTable', 'drawWeaponRack', 'drawDesk']) {
  assert(map.includes(token), `mapa procedural M002.2 perdeu elemento histórico: ${token}`);
}
// Runtime ativo evoluiu para o laboratório visual M002.2A.1.
for (const token of ['M002.2A.1', 'RagbiaHouseCollisionV1.move', 'apprentice-${this.dir}', 'this.playerSession.name']) {
  assert(game.includes(token), `runtime ativo da casa sem continuidade: ${token}`);
}
assert(!game.includes('toggleClass'), 'Casa não deve permitir troca técnica de classe');
assert(!game.includes('createSlimes'), 'Casa não deve carregar Slimes');
assert(!game.includes('ENGAGE'), 'Casa não deve exibir Engage no runtime normal');
console.log('m002_2_house_static_contract: OK');
