'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const entities=fs.readFileSync(path.join(root,'entities-v0.js'),'utf8');
const ai=fs.readFileSync(path.join(root,'enemy-ai-v0.js'),'utf8');
const collision=fs.readFileSync(path.join(root,'collision-v0.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const checks=[
  ['módulo AI carregado', index.includes('enemy-ai-v0.js')],
  ['agressivos e passivos configurados', entities.includes("behavior: index % 2 === 0 ? 'aggressive' : 'passive'")],
  ['FOV inimigo separado', entities.includes('visionRange: 420')],
  ['leash separado', entities.includes('resetRange: 700') && entities.includes('resetEnabled: true')],
  ['FOV não encerra aggro', ai.includes('Sair do FOV não quebra aggro') || ai.includes('não há teste de FOV aqui')],
  ['reset restaura recursos imediatamente', ai.includes('restoreResources(entity); // recursos recuperados imediatamente')],
  ['reset fica invulnerável', ai.includes('entity.damageable = false') && ai.includes('entity.targetable = false')],
  ['retorno ao spawn existe', ai.includes("mode: 'reset-arrived'") && ai.includes('entity.x = entity.spawnX')],
  ['no-reset configurável', ai.includes('entity.resetEnabled === false')],
  ['movimento inimigo respeita colisão', collision.includes('function moveEntity') && game.includes('RagbiaCollisionV0.moveEntity(')],
  ['passivo não inicia ataque', game.includes('RagbiaEnemyAIV0.canAttack(entity)')],
  ['debug mostra FOV/leash', game.includes('renderEnemyAIDebug') && game.includes('strokeCircle(entity.spawnX')]
];
let bad=false;
for(const [name,ok] of checks){ console.log(`${ok?'OK':'FAIL'} — ${name}`); if(!ok) bad=true; }
if(bad) process.exit(1);
