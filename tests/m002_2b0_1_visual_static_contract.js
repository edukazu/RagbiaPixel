const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const artPath = path.join(root, 'phaser_map_beta', 'microtest-northwall-art-v1.js');
const scenePath = path.join(root, 'phaser_map_beta', 'microtest-northwall-scene-v1.js');
const htmlPath = path.join(root, 'phaser_map_beta', 'microtest-northwall-v1.html');

assert(fs.existsSync(artPath), 'arte v1 do microteste ausente');
assert(fs.existsSync(scenePath), 'cena v1 do microteste ausente');
assert(fs.existsSync(htmlPath), 'HTML v1 do microteste ausente');

const art = fs.readFileSync(artPath, 'utf8');
const scene = fs.readFileSync(scenePath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

for (const forbidden of ['house_avo_pixel_v1.png', 'house_avo_v2b.png', 'referencia_pixelada_casa.png', 'house_avo']) {
  assert(!art.includes(forbidden), `arte v1 reutiliza referência/asset proibido: ${forbidden}`);
  assert(!scene.includes(forbidden), `cena v1 reutiliza referência/asset proibido: ${forbidden}`);
}

for (const token of ['PROPORÇÃO E CONTINUIDADE', 'drawWindow', 'drawFireplace', 'drawWoodpile', 'RagbiaMicrotestArtV1']) {
  assert(art.includes(token), `arte v1 sem contrato: ${token}`);
}

for (const token of ['RagbiaMicrotestCollisionV1.move', 'this.player.setScale(0.84)', 'this.player.setDepth(this.playerFootY())', 'Janela/lareira reescaladas', 'M002.2B.0.1']) {
  assert(scene.includes(token), `cena v1 sem contrato: ${token}`);
}

assert(html.includes('microtest-northwall-art-v1.js'), 'HTML v1 não carrega arte');
assert(html.includes('microtest-northwall-collision-v1.js'), 'HTML v1 não carrega colisão');
assert(html.includes('microtest-northwall-scene-v1.js'), 'HTML v1 não carrega cena');

console.log('m002_2b0_1_visual_static_contract: OK');
