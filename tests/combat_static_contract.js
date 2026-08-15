'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const combat=fs.readFileSync(path.join(root,'combat-v0.js'),'utf8');
const entities=fs.readFileSync(path.join(root,'entities-v0.js'),'utf8');
const checks=[
 ['Player HP1/ATK1', combat.includes("const PLAYER_BASE = Object.freeze({ maxHP: 1, hp: 1, attack: 1 });")],
 ['Slime baseline HP1/ATK0.5 + passivo-teste HP2', entities.includes("maxHP: index === 1 ? 2 : 1") && entities.includes("hp: index === 1 ? 2 : 1") && entities.includes('attack: 0.5')],
 ['Melee dano no impacto', game.includes('progress >= 0.58') && game.includes('this.resolveWarriorHit()')],
 ['Melee usa attack stat', game.includes("this.damageEntity(target, this.playerStats.attack, 'melee', target.x - this.player.x, target.y - this.player.y)")],
 ['Flecha carrega dano', game.includes('p.damage = this.playerStats.attack')],
 ['Flecha colide antes do dano', game.includes('RagbiaCombatV0.projectileHitsEntity') && game.includes("this.damageEntity(target, p.damage, 'projectile', p.vx, p.vy)")],
 ['Morte usa animação antes de ocultar', game.includes('this.startDeathAnimation(entity)') && game.includes('entity.deathAnimating = true') && game.includes('entity.view.setVisible(false)')],
 ['Dano amarelo', game.includes("color: '#ffd84a'")],
 ['Impacto visual ativo', game.includes('spawnImpact(entity') && game.includes('this.cameras.main.shake')],
 ['Hit-stop V1 ativo', game.includes('this.hitStopT') && game.includes('hitStop: 0.072') && game.includes('hitStop: 0.046')],
 ['Knock visual sem mover lógica', game.includes('entity.visualOffsetX') && entities.includes('entity.view.x - (Number(entity.visualOffsetX) || 0)')],
 ['Impacto melee maior que flecha', game.includes('spread: 56') && game.includes('spread: 42') && game.includes('knockDistance: 18') && game.includes('knockDistance: 11')],
 ['Respawn laboratório 3s', game.includes('this.respawnDelay = 3.0') && game.includes('this.respawnEnemy(entity)') && combat.includes('function respawnEntity(entity)')],
 ['Morte invalida alvo selecionado antes da continuidade', game.includes('const killedWasSelected = this.targetId === entity.id') && game.includes('if (killedWasSelected) this.targetId = null')],
 ['Telegraph inimigo V1 ativo', game.includes('updateEnemyCombat(dt)') && game.includes('damagePlayer(amount, sourceEntity)') && entities.includes('attackRange: 150') && combat.includes('hitAt: 1.00')]
];
let bad=false; for(const [n,ok] of checks){console.log(`${ok?'OK':'FAIL'} — ${n}`); if(!ok)bad=true;} if(bad)process.exit(1);
