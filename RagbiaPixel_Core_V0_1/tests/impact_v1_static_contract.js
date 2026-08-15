'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const entities=fs.readFileSync(path.join(root,'entities-v0.js'),'utf8');
const checks=[
  ['Impacto V1 preservado no M001.5A', game.includes('hitStop: 0.072') && game.includes('knockDistance: 18')],
  ['Melee hit-stop 72ms', game.includes('hitStop: 0.072')],
  ['Projétil hit-stop 46ms', game.includes('hitStop: 0.046')],
  ['Melee shake reforçado', game.includes('shakeMs: 105') && game.includes('shakeIntensity: 0.0032')],
  ['Projétil shake menor', game.includes('shakeMs: 78') && game.includes('shakeIntensity: 0.0021')],
  ['Melee knock visual 18px', game.includes('knockDistance: 18')],
  ['Projétil knock visual 11px', game.includes('knockDistance: 11')],
  ['Burst pixelado com núcleo', game.includes('Impacto V1: estrela pixelada') && game.includes('g.fillStyle(0xffffff')],
  ['Offset visual não contamina lógica', entities.includes('visualOffsetX') && entities.includes('entity.view.x - (Number(entity.visualOffsetX) || 0)')],
  ['Morte/respawn preservados', game.includes('this.deathAnimDuration = 0.42') && game.includes('this.respawnDelay = 3.0')]
];
let bad=false; for(const [n,ok] of checks){console.log(`${ok?'OK':'FAIL'} — ${n}`); if(!ok) bad=true;} if(bad) process.exit(1);
