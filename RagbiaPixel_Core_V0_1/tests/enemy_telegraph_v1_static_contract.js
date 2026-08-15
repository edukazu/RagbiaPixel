'use strict';
const fs=require('fs'); const path=require('path');
const game=fs.readFileSync(path.resolve(__dirname,'..','phaser_map_beta','game.js'),'utf8');
const combat=fs.readFileSync(path.resolve(__dirname,'..','phaser_map_beta','combat-v0.js'),'utf8');
if(!combat.includes('range: 150') || !combat.includes('windup: 1.00') || !combat.includes('hitAt: 1.00')) throw new Error('Config V1 ausente');
if(!game.includes('telegraphRadius = attackRange') || !game.includes('fillCircle(entity.x, entity.y + 22, telegraphRadius)')) throw new Error('Área expansiva V1 ausente');
if(!game.includes('strokeCircle(entity.x, entity.y + 22, Number.isFinite(entity.attackRange)')) throw new Error('Flash do instante exato ausente');
console.log('OK — contrato estático M001.5A Telegraph Inimigo V1.');
