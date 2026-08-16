const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const artPath = path.join(root, 'phaser_map_beta', 'microtest-northwall-art-v0.js');
const scenePath = path.join(root, 'phaser_map_beta', 'microtest-northwall-scene-v0.js');
const htmlPath = path.join(root, 'phaser_map_beta', 'microtest-northwall-v0.html');

assert(fs.existsSync(artPath), 'arte autoral do microteste ausente');
assert(fs.existsSync(scenePath), 'cena do microteste ausente');
assert(fs.existsSync(htmlPath), 'HTML do microteste ausente');

const art = fs.readFileSync(artPath, 'utf8');
const scene = fs.readFileSync(scenePath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

for (const token of [
  'MICROTESTE AUTORAL',
  'drawWindow',
  'drawFireplace',
  'drawWoodpile',
  'drawFloor',
  'RagbiaMicrotestArtV0'
]) {
  assert(art.includes(token), `arte do microteste sem contrato: ${token}`);
}

// Regra crítica: o microteste não pode carregar qualquer asset da casa ilustrada.
for (const forbidden of [
  'house_avo_pixel_v1.png',
  'house_avo_v2b.png',
  'referencia_pixelada_casa.png',
  'identidade visual casa'
]) {
  assert(!art.includes(forbidden), `arte reutiliza referência proibida: ${forbidden}`);
  assert(!scene.includes(forbidden), `cena reutiliza referência proibida: ${forbidden}`);
  assert(!html.includes(forbidden), `HTML reutiliza referência proibida: ${forbidden}`);
}

for (const token of [
  'RagbiaMicrotestCollisionV0.move',
  'this.player.setDepth(this.playerFootY())',
  'microtest-woodpile-v0',
  'DESENHADO DO ZERO',
  'M002.2B.0'
]) {
  assert(scene.includes(token), `cena sem contrato: ${token}`);
}

assert(html.includes('microtest-northwall-art-v0.js'), 'HTML não carrega arte autoral');
assert(html.includes('microtest-northwall-collision-v0.js'), 'HTML não carrega colisão');
assert(html.includes('microtest-northwall-scene-v0.js'), 'HTML não carrega cena');

console.log('m002_2b0_visual_static_contract: OK');
