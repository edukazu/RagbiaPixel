const fs = require('fs');
const path = require('path');
const m = require(path.join(__dirname, '..', 'maps', 'semantic', 'map-beta-v0.js'));

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function clusterTreeCount() {
  return m.vegetation.clusters.reduce((sum, c) => sum + c.count, 0);
}

function derivedTreeCount() {
  const settlementTrees = m.settlements.reduce((sum, s) => sum + (s.trees || []).length, 0);
  return m.vegetation.staticTrees.length + settlementTrees + clusterTreeCount();
}

console.log('=== M002-MAP.1 — AUDITORIA SEMÂNTICA ===');
console.log(`Mapa: ${m.id}`);
console.log(`Mundo: ${m.world.worldWidth}x${m.world.worldHeight}`);
console.log(`Malha visual: ${m.world.artWidth}x${m.world.artHeight} @ ${m.world.pixelScale}x`);
console.log(`Spawn jogador: ${m.gameplay.playerSpawnWorld.x},${m.gameplay.playerSpawnWorld.y}`);
console.log(`Spawns Slime: ${m.gameplay.slimeSpawnsWorld.length}`);
console.log(`Estruturas: ${m.settlements.reduce((s,v)=>s+v.structures.length,0)}`);
console.log(`Cercas semânticas: ${m.settlements.reduce((s,v)=>s+v.fences.length,0)}`);
console.log(`Árvores estáticas de floresta: ${m.vegetation.staticTrees.length}`);
console.log(`Árvores de assentamentos: ${m.settlements.reduce((s,v)=>s+v.trees.length,0)}`);
console.log(`Árvores geradas em clusters: ${clusterTreeCount()}`);
console.log(`Total de árvores de cena: ${derivedTreeCount()}`);
console.log(`Polígonos de água físicos: ${m.collision.waterPolygons.length}`);
console.log('Sem alteração do runtime neste marco.');
