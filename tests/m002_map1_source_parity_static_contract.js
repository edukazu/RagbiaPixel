const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const map = fs.readFileSync(path.join(root, 'phaser_map_beta', 'map-beta.js'), 'utf8');
const col = fs.readFileSync(path.join(root, 'phaser_map_beta', 'collision-v0.js'), 'utf8');

const mapTokens = [
  'const WORLD_W = 4608;',
  'const WORLD_H = 2688;',
  'const PIXEL_SCALE = 4;',
  'const spawn = { x: 720, y: 1910 };',
  '{ x: 4100, y: 720 }',
  'mulberry32(199503)',
  '[120,160,95,45,13]',
  'drawHouse(ctx, 103, 381, 76, 50, 0)',
  'drawHouse(ctx, 555, 418, 68, 47, 1)',
  'drawHouse(ctx, 646, 441, 59, 43, 2)',
  'drawHouse(ctx, 577, 522, 63, 44, 0)',
  'const x = 745, y = 128;'
];
for (const t of mapTokens) assert(map.includes(t), `map-beta.js divergiu do baseline esperado: ${t}`);

const collisionTokens = [
  "addRect('casa-sul', L(97), L(376), L(88), L(60), 'building');",
  "addRect('casa-nucleo-oeste', L(550), L(413), L(80), L(59), 'building');",
  "addRect('cerca-sul-horizontal', L(80), L(449), L(112), L(8), 'fence');",
  "addPoly('rio-norte'",
  "addPoly('rio-sul'",
  "addCircle('rock-ruin-a', L(733), L(172), L(7), 'rock');",
  "addCircle('rock-ruin-b', L(840), L(172), L(6), 'rock');",
  'const rndTrees = mulberry32(199503);'
];
for (const t of collisionTokens) assert(col.includes(t), `collision-v0.js divergiu do baseline esperado: ${t}`);

console.log('m002_map1_source_parity_static_contract: OK');
