'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const pursuit=fs.readFileSync(path.join(root,'pursuit-v0.js'),'utf8');
const checks=[
  ['resolveMovement existe', pursuit.includes('function resolveMovement(')],
  ['manual é resolvido antes do chase', pursuit.indexOf("mode: 'manual'") < pursuit.indexOf("mode: 'chase'")],
  ['game usa resolveMovement', game.includes('RagbiaPursuitV0.resolveMovement(pursuitPlan, x, y, speed, dt)')],
  ['estado de override existe', game.includes('this.pursuitManualOverride')],
  ['HUD mostra CHASE MANUAL', game.includes("'  |  CHASE MANUAL'")],
  ['chase automático depende do modo chase', game.includes("this.pursuitActive = movementPlan.mode === 'chase'")],
  ['facing lock permanece após movimento', game.includes('this.lockFacingToTarget();')],
  ['Dash continua sendo resolvido antes do bloco de movimento', game.indexOf('const dashing = this.updateDash(dt);') < game.indexOf('RagbiaPursuitV0.resolveMovement')]
];
let bad=false; for(const [name,ok] of checks){ console.log(`${ok?'OK':'FAIL'} — ${name}`); if(!ok) bad=true; }
if(bad) process.exit(1);
