'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cont=fs.readFileSync(path.join(root,'engage-continuity-v0.js'),'utf8');
const checks=[
  ['módulo de continuidade carregado', index.includes('engage-continuity-v0.js')],
  ['estado pending existe', game.includes('this.engageContinuityPending = false')],
  ['morte do alvo chama continuidade', game.includes('this.handleEngageTargetKilled(entity, killedWasSelected)')],
  ['continuidade reutiliza Soft Target', game.includes('this.softTargetCandidates, this.engageContinuityLastKilledId')],
  ['release cancela pending', game.includes('if (engageReleasedNow || !this.engageHeld) this.cancelEngageContinuity();')],
  ['Esc/LT clear cancela pending', game.includes('clearTarget()') && game.includes('this.cancelEngageContinuity();')],
  ['sem sucessor mantém pending', game.includes('if (!nextId) return false;')],
  ['módulo impede armamento após release', cont.includes('return !!engageHeld && !!killedWasSelected')],
  ['HUD expõe continuidade', game.includes('CONTINUIDADE AGUARDANDO')]
];
let bad=false;
for(const [name,ok] of checks){ console.log(`${ok?'OK':'FAIL'} — ${name}`); if(!ok) bad=true; }
if(bad) process.exit(1);
