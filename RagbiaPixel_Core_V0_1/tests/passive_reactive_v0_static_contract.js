'use strict';
const fs=require('fs'),path=require('path'); const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const ent=fs.readFileSync(path.join(root,'entities-v0.js'),'utf8');
const ai=fs.readFileSync(path.join(root,'enemy-ai-v0.js'),'utf8');
const checks=[
 ['slime02 HP2', ent.includes("maxHP: index === 1 ? 2 : 1") && ent.includes("labRole: index === 1 ? 'passive-reactive-test' : null")],
 ['provoke exportado', ai.includes('function provoke(') && ai.includes('isAggressive, provoke, canDetect')],
 ['passivo idle sem aggro', ai.includes('!isAggressive(entity) && !entity.aggro')],
 ['dano provoca passivo sobrevivente', game.includes("entity.behavior === RagbiaEnemyAIV0.BEHAVIORS.PASSIVE") && game.includes("RagbiaEnemyAIV0.provoke(entity, 'damage')")],
 ['reset limpa aggro', ai.includes('entity.aggro = false') && ai.includes('entity.aggroReason = null')],
]; let bad=false; for(const [n,ok] of checks){console.log(`${ok?'OK':'FAIL'} — ${n}`); if(!ok)bad=true;} if(bad)process.exit(1);
