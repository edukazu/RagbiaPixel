const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const kitData = require(path.join(root, 'maps', 'kits', 'outdoor-v1.js'));
assert.strictEqual(kitData.id, 'outdoor-v1');
assert.strictEqual(kitData.logicalPixelScale, 4);
assert(kitData.families.terrain.includes('dirt-road'));
assert(kitData.families.nature.includes('tree-round'));

const renderer = fs.readFileSync(path.join(root, 'phaser_map_beta', 'outdoor-kit-v1-renderer.js'), 'utf8');
const generated = fs.readFileSync(path.join(root, 'phaser_map_beta', 'map-beta-generated-v1.js'), 'utf8');
const game = fs.readFileSync(path.join(root, 'phaser_map_beta', 'game.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'phaser_map_beta', 'index.html'), 'utf8');

for (const token of ['drawGrass','drawRoad','drawRiver','drawBridge','drawTree','drawHouse','drawBush']) {
  assert(renderer.includes(token), `renderer sem função do kit: ${token}`);
}
for (const token of ['RagbiaMapSemanticV0','M.settlements','M.vegetation.staticTrees','M.vegetation.clusters','M.terrain.road','M.terrain.river','M.terrain.bridge']) {
  assert(generated.includes(token), `mapa gerado não consome semântica: ${token}`);
}
for (const forbidden of ['drawHouse(ctx, 103, 381','drawHouse(ctx, 555, 418','const x = 745, y = 128']) {
  assert(!generated.includes(forbidden), `mapa gerado reintroduziu composição hardcoded: ${forbidden}`);
}
assert(game.includes("this.mapVisualGenerated = RagbiaMapBetaGeneratedV1.create(this);"));
assert(game.includes("keydown-V"));
assert(game.includes("V: MAPA"));
assert(game.includes("MAPA: OUTDOOR KIT V1 (SEMÂNTICO)"));
assert(html.includes('../maps/semantic/map-beta-v0.js'));
assert(html.includes('../maps/kits/outdoor-v1.js'));
assert(html.includes('outdoor-kit-v1-renderer.js'));
assert(html.includes('map-beta-generated-v1.js'));

console.log('m002_map2_outdoor_kit_static_contract: OK');
