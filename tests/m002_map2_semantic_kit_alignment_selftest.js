const assert = require('assert');
const path = require('path');
const root = path.join(__dirname, '..');
const m = require(path.join(root, 'maps', 'semantic', 'map-beta-v0.js'));
const k = require(path.join(root, 'maps', 'kits', 'outdoor-v1.js'));

assert.strictEqual(m.world.pixelScale, k.logicalPixelScale, 'kit e mapa usam escalas lógicas diferentes');
assert.strictEqual(m.settlements.reduce((n,s)=>n+s.structures.length,0), 4, 'esperadas 4 estruturas semânticas');
assert.strictEqual(m.gameplay.slimeSpawnsWorld.length, 8, 'esperados 8 slimes semânticos');
assert(m.terrain.road.outer.length >= 10, 'estrada sem geometria suficiente');
assert(m.terrain.river.inner.length >= 10, 'rio sem geometria suficiente');
assert(m.vegetation.staticTrees.length >= 30, 'árvores estáticas insuficientes');
assert(m.vegetation.clusters.length >= 6, 'clusters semânticos insuficientes');

console.log('m002_map2_semantic_kit_alignment_selftest: OK');
