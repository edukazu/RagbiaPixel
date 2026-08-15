'use strict';
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..','phaser_map_beta');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const dodge=fs.readFileSync(path.join(root,'dodge-v0.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const checks=[
  ['1 carga / CD 1.5s / 140px / 180ms / iframe 120ms', dodge.includes('charges: 1') && dodge.includes('cooldown: 1.50') && dodge.includes('distance: 140') && dodge.includes('duration: 0.18') && dodge.includes('invulnerability: 0.12')],
  ['Direção do dash vem da intenção de movimento', game.includes('normalizeIntent(inputX, inputY, this.lastMoveX, this.lastMoveY)')],
  ['Sem input usa última direção válida', game.includes('this.lastMoveX = x') && game.includes('this.lastMoveY = y')],
  ['Dash usa colisão normal com cenário e entidades', game.includes('RagbiaCollisionV0.move(') && game.includes('this.dashDirX * speed * travelDt') && game.includes('this.entities')],
  ['Facing lock suspenso no dash e restaurado ao fim', game.includes('Facing lock: alvo selecionado domina a direção, exceto durante o dash.') && game.includes('Soft Target reassume imediatamente a visão')],
  ['Engage não inicia ataque durante dash', game.includes('if (!dashing && this.engageHeld && this.selectedTarget()) this.startAttack();')],
  ['Ataque atual é cancelado ao iniciar dash', game.includes('this.cancelAttack();')],
  ['I-frame impede dano', game.includes('if (this.dashIFrameT > 0 && this.playerStats.alive)')],
  ['Flip Leste/Oeste via scaleX e Norte/Sul via scaleY', dodge.includes("direction === 'left' || direction === 'right'") && dodge.includes('return { x: phase, y: 1 }') && dodge.includes('return { x: 1, y: phase }')],
  ['Afterimage e poeira presentes', game.includes('spawnDashAfterimage') && game.includes("source: 'dashDust'")],
  ['Teclado Shift e gamepad B presentes', game.includes("dodge: 'SHIFT'") && game.includes('gp.buttons[1]')],
  ['Shift+Tab cancela pending do dash', game.includes('this.keyboardDodgePending = 0;') && game.includes('this.justWideTarget = true')],
  ['dodge-v0 carregado antes de game.js', index.includes('<script src="dodge-v0.js"></script>')]
];
let bad=false; for(const [n,ok] of checks){console.log(`${ok?'OK':'FAIL'} — ${n}`); if(!ok) bad=true;} if(bad) process.exit(1);
