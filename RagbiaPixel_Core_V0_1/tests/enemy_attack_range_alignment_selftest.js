'use strict';
const fs=require('fs'), vm=require('vm'), path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const context={window:{}}; vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'enemy-ai-v0.js'),'utf8'),context,{filename:'enemy-ai-v0.js'});
const AI=context.window.RagbiaEnemyAIV0;
const enemy={alive:true,behavior:'aggressive',aiState:'chase',aggro:true,x:0,y:0,spawnX:0,spawnY:0,attackRange:150,visionRange:420,resetRange:700,resetEnabled:true,collisionOffsetY:22};
let p=AI.plan(enemy,0,145,true,28);
if(p.mode!=='chase' || Math.abs(p.distance-151)>1e-6) throw new Error(`Norte: esperado CHASE a 151, obtido ${p.mode} ${p.distance}`);
enemy.y=1;
p=AI.plan(enemy,0,145,true,28);
if(p.mode!=='attack' || Math.abs(p.distance-150)>1e-6) throw new Error(`Norte: esperado ATTACK a 150, obtido ${p.mode} ${p.distance}`);
// Sul deve continuar coerente também.
enemy.x=0; enemy.y=300; enemy.spawnX=0; enemy.spawnY=300; enemy.aiState='chase'; enemy.aggro=true;
p=AI.plan(enemy,0,151,true,28); // enemy foot 322, player foot179 => 143
if(p.mode!=='attack' || p.distance>150) throw new Error('Sul: footprint dentro do range deve atacar');
console.log('OK — FIX1 usa footprint consistente para CHASE -> ATTACK em diferentes direções.');
