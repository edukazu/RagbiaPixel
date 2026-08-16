const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const artPath = path.join(root, 'phaser_map_beta', 'microtest-northwall-art-v2.js');
const scenePath = path.join(root, 'phaser_map_beta', 'microtest-northwall-scene-v2.js');
const htmlPath = path.join(root, 'phaser_map_beta', 'microtest-northwall-v2.html');

assert(fs.existsSync(artPath), 'arte v2 ausente');
assert(fs.existsSync(scenePath), 'cena v2 ausente');
assert(fs.existsSync(htmlPath), 'HTML v2 ausente');

const art = fs.readFileSync(artPath, 'utf8');
const scene = fs.readFileSync(scenePath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

for (const forbidden of ['house_avo_pixel_v1.png', 'house_avo_v2b.png', 'referencia_pixelada_casa.png', 'house_avo']) {
  assert(!art.includes(forbidden), `arte v2 reutiliza referência/asset proibido: ${forbidden}`);
  assert(!scene.includes(forbidden), `cena v2 reutiliza referência/asset proibido: ${forbidden}`);
}

for (const token of ['ESCALA HUMANA', 'drawWindow', 'drawFireplace', 'drawWoodpile', 'RagbiaMicrotestArtV2']) {
  assert(art.includes(token), `arte v2 sem contrato: ${token}`);
}

for (const token of ['RagbiaMicrotestCollisionV2.move', 'this.player.setScale(0.86)', 'this.player.setDepth(this.playerFootY())', 'Janela baixa + lareira reduzida', 'M002.2B.0.2']) {
  assert(scene.includes(token), `cena v2 sem contrato: ${token}`);
}

assert(html.includes('microtest-northwall-art-v2.js'), 'HTML v2 não carrega arte');
assert(html.includes('microtest-northwall-collision-v2.js'), 'HTML v2 não carrega colisão');
assert(html.includes('microtest-northwall-scene-v2.js'), 'HTML v2 não carrega cena');

console.log('m002_2b0_2_visual_static_contract: OK');
