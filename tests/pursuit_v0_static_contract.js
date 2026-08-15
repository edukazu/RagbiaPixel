'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const pursuit=fs.readFileSync(path.join(root,'pursuit-v0.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const checks=[
  ['pursuit-v0 carregado antes de game.js', index.includes('<script src="pursuit-v0.js"></script>')],
  ['Engage + alvo gera plano de perseguição', game.includes('this.engageHeld && pursuitTarget') && game.includes('RagbiaPursuitV0.plan(')],
  ['Perseguição só opera fora do attackRange', pursuit.includes('if (distance <= attackRange')],
  ['Perseguição usa delta limitado e 300 px/s', pursuit.includes('speed: 300') && pursuit.includes('const chase = deltaForPlan(pursuitPlan, dt)')],
  ['Chase usa colisão existente', game.includes('RagbiaCollisionV0.move(') && game.includes('deltaX, deltaY, this.entities')],
  ['Dash suspende chase', game.includes('this.pursuitActive = false;') && game.includes('const dashing = this.updateDash(dt);')],
  ['Soltar Engage não limpa target', game.includes('this.engageHeld = engageHeldNow') && !game.includes('if (!engageHeldNow) this.targetId = null')],
  ['HUD possui CHASE ON/BLOQUEADO', game.includes("CHASE ${this.pursuitBlocked ? 'BLOQUEADO' : 'ON'}")],
  ['Ataque continua exigindo attackRange', game.includes('isInAttackRange(target, this.player.x, this.player.y, this.classId)')]
];
let bad=false; for(const [n,ok] of checks){console.log(`${ok?'OK':'FAIL'} — ${n}`); if(!ok) bad=true;} if(bad) process.exit(1);
