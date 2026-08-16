(() => {
  'use strict';

  const VIEW_W = 1920;
  const VIEW_H = 1080;
  const DIRS = ['down', 'up', 'left', 'right'];
  const CLASSES = ['warrior', 'archer'];

  class MapBetaScene extends Phaser.Scene {
    constructor() {
      super('map-beta');
      this.classId = 'warrior';
      this.dir = 'down';
      this.walkT = 0;
      this.moving = false;
      this.attackT = 0;
      this.cooldown = 0;
      this.bowReleased = false;
      this.prevPad = { lb: false, rb: false, both: false, lt: false, rt: false, y: false, b: false };
      this.rbSoftPending = 0;
      this.engageHeld = false;
      this.attackTargetId = null;
      this.lastTargetMode = 'soft';
      this.projectiles = [];
      this.targetId = null;
      this.targetCandidates = [];
      // CORE V0.1: debug técnico inicia DESLIGADO.
      this.debugMode = false;
      this.collisionDebug = false;
      this.lastCollisionHit = null;
      this.blockedX = false;
      this.blockedY = false;
      this.playerStats = null;
      this.attackHitApplied = false;
      this.damageTexts = [];
      this.impactBursts = [];
      this.hitStopT = 0;
      this.lastImpactKind = '—';
      this.respawnDelay = 3.0;
      this.deathAnimDuration = 0.42;
      this.lastCombatEvent = '—';
      // M001.5A — Telegraph Inimigo V1.
      this.enemyAttackGraphics = null;
      this.playerHitFlashT = 0;
      this.playerDeathAnimating = false;
      this.playerDeathT = 0;
      this.playerDeathDuration = 0.45;
      this.playerRespawnT = 0;
      this.playerRespawnDelay = 3.0;
      this.engageNeedsRelease = false;
      // M001.6 — Dash/Esquiva V0.
      this.dashCharges = RagbiaDodgeV0.profileFor(this.classId).charges;
      this.dashCooldownT = 0;
      this.dashT = 0;
      this.dashDuration = 0;
      this.dashDirX = 0;
      this.dashDirY = 1;
      this.dashDir = 'down';
      this.dashIFrameT = 0;
      this.lastMoveX = 0;
      this.lastMoveY = 1;
      this.dashAfterimages = [];
      this.dashAfterimageT = 0;
      this.dashBlocked = false;
      this.keyboardDodgePending = 0;
      this.keyboardDodgePendingDelay = 0.10;
      this.justDodge = false;
      // M001.7A — Manual Override da Perseguição.
      this.pursuitActive = false;
      this.pursuitBlocked = false;
      this.pursuitManualOverride = false;
      this.pursuitTargetId = null;
      this.pursuitLastDistance = Infinity;
      // M001.8 — Continuidade do Engage após morte do alvo.
      this.engageContinuityPending = false;
      this.engageContinuityLastKilledId = null;
      this.engageContinuitySwitches = 0;
      // M001.9 — IA de Movimento Inimigo V0.
      this.enemyAggroEvents = 0;
      this.enemyResetEvents = 0;
    }

    create() {
      this.playerSession = window.RagbiaPlayerSession || null;
      this.cameras.main.setBackgroundColor('#13251a');
      this.buildTextures();
      this.mapVisual = RagbiaMapBeta.create(this);

      // M001.3: os Slimes deixam de ser apenas imagens soltas e passam a ter
      // um registro lógico mínimo de entidade. A view continua sendo Phaser.
      this.entities = RagbiaEntitiesV0.createSlimes(RagbiaMapBeta.slimeSpawns);
      this.slimes = this.entities.map(entity => {
        const s = this.add.image(entity.x, entity.y, 'slime-0');
        s.setOrigin(0.5, 62 / 112);
        s.setDepth(10);
        s.baseX = entity.x;
        s.baseY = entity.y;
        RagbiaEntitiesV0.attachView(entity, s);
        return s;
      });

      this.player = this.add.image(RagbiaMapBeta.spawn.x, RagbiaMapBeta.spawn.y, 'warrior-down-idle');
      this.player.setOrigin(0.5, 80 / 144);
      this.player.setDepth(20);
      this.playerStats = RagbiaCombatV0.createPlayerStats();

      this.attackGraphics = this.add.graphics().setDepth(30);
      this.impactGraphics = this.add.graphics().setDepth(45);
      this.dashGraphics = this.add.graphics().setDepth(19);
      this.enemyAttackGraphics = this.add.graphics().setDepth(18);
      this.enemyAIGraphics = this.add.graphics().setDepth(8).setVisible(false);
      // M001.11 consolidado: indicadores de estado são DEBUG-ONLY.
      this.enemyStateGraphics = this.add.graphics().setDepth(12).setVisible(false);
      // Anel de soft target fica abaixo do sprite inimigo (slimes = depth 10).
      this.targetGraphics = this.add.graphics().setDepth(9);
      this.collisionGraphics = this.add.graphics().setDepth(900).setVisible(false);

      this.keys = this.input.keyboard.addKeys({
        up: 'W', down: 'S', left: 'A', right: 'D',
        arrowUp: 'UP', arrowDown: 'DOWN', arrowLeft: 'LEFT', arrowRight: 'RIGHT',
        engage: 'SPACE', dodge: 'SHIFT',
        classNext: 'E', classPrev: 'Q', target: 'TAB', targetClear: 'ESC',
        fullscreen: 'F', collisionDebug: 'C'
      });

      this.input.keyboard.on('keydown-TAB', e => e.preventDefault());
      this.input.keyboard.on('keydown-F', () => this.scale.toggleFullscreen());
      this.input.keyboard.on('keydown-C', () => {
        this.debugMode = !this.debugMode;
        // Mantém collisionDebug como alias interno para módulos/rotinas já validados.
        this.collisionDebug = this.debugMode;
        this.collisionGraphics.setVisible(this.debugMode);
        this.enemyAIGraphics.setVisible(this.debugMode);
        this.enemyStateGraphics.setVisible(this.debugMode);
        if (!this.debugMode) {
          this.collisionGraphics.clear();
          this.enemyAIGraphics.clear();
          this.enemyStateGraphics.clear();
        }
      });

      this.justClassNext = false;
      this.justClassPrev = false;
      this.justSoftTarget = false;
      this.justWideTarget = false;
      this.justTargetClear = false;
      this.input.keyboard.on('keydown', ev => {
        if (ev.repeat) return;
        if (ev.code === 'KeyE') this.justClassNext = true;
        if (ev.code === 'KeyQ') this.justClassPrev = true;
        if (ev.code === 'ShiftLeft' || ev.code === 'ShiftRight') {
          // Shift também participa de Shift+Tab. Uma janela curta evita disparar
          // o dash quando a intenção era abrir o ciclo amplo de targeting.
          this.keyboardDodgePending = this.keyboardDodgePendingDelay;
        }
        if (ev.code === 'Tab') {
          ev.preventDefault();
          if (ev.shiftKey) {
            this.keyboardDodgePending = 0;
            this.justWideTarget = true;
          } else this.justSoftTarget = true;
        }
        if (ev.code === 'Escape') this.justTargetClear = true;
      });

      // M001.2: câmera aprovada preservada; colisão é resolvida na camada lógica separada.
      const cam = this.cameras.main;
      cam.setBounds(0, 0, RagbiaMapBeta.WORLD_W, RagbiaMapBeta.WORLD_H);
      cam.startFollow(this.player, true, 0.12, 0.12);
      cam.setDeadzone(620, 360);
      cam.roundPixels = true;

      const mapKeys = ['map-beta-0-0','map-beta-1-0','map-beta-2-0','map-beta-0-1','map-beta-1-1','map-beta-2-1'];
      const missingMap = mapKeys.filter(key => !this.textures.exists(key));
      if (missingMap.length) {
        const msg = `Chunks visuais do mapa ausentes do cache: ${missingMap.join(', ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }

      this.buildHud();
      const collisionTest = RagbiaCollisionV0.selfTest();
      if (!collisionTest.ok) {
        const msg = `Autoteste de colisão falhou: ${collisionTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const targetingTest = RagbiaTargetingSoft.selfTest();
      if (!targetingTest.ok) {
        const msg = `Autoteste de targeting falhou: ${targetingTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const combatTest = RagbiaCombatV0.selfTest();
      if (!combatTest.ok) {
        const msg = `Autoteste de combate falhou: ${combatTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const dodgeTest = RagbiaDodgeV0.selfTest();
      if (!dodgeTest.ok) {
        const msg = `Autoteste de dash falhou: ${dodgeTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const pursuitTest = RagbiaPursuitV0.selfTest();
      if (!pursuitTest.ok) {
        const msg = `Autoteste de perseguição falhou: ${pursuitTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const continuityTest = RagbiaEngageContinuityV0.selfTest();
      if (!continuityTest.ok) {
        const msg = `Autoteste de continuidade do Engage falhou: ${continuityTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const enemyAITest = RagbiaEnemyAIV0.selfTest();
      if (!enemyAITest.ok) {
        const msg = `Autoteste de IA inimiga falhou: ${enemyAITest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const enemyStateVisualTest = RagbiaEnemyStateVisualV0.selfTest();
      if (!enemyStateVisualTest.ok) {
        const msg = `Autoteste visual de estados da IA falhou: ${enemyStateVisualTest.errors.join(' | ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const spawnTest = RagbiaCollisionV0.collidesAnchor(this.player.x, this.player.y);
      if (spawnTest.hit) {
        const msg = `Spawn inválido: colide com ${spawnTest.shape && spawnTest.shape.id}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      const entityCollisionTest = RagbiaCollisionV0.collidesEntities(
        this.entities[0].x,
        this.entities[0].y - RagbiaCollisionV0.PLAYER_FOOT_OFFSET_Y,
        this.entities
      );
      if (!entityCollisionTest.hit) {
        const msg = 'Autoteste de colisão dinâmica falhou: entidade sólida não bloqueou o footprint do jogador.';
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
      if (window.RagbiaBoot) window.RagbiaBoot.ok('Ragbia Pixel CORE V0.1 carregado — debug técnico desligado por padrão');
    }

    buildTextures() {
      for (const cls of CLASSES) {
        for (const dir of DIRS) {
          this.textures.addCanvas(`${cls}-${dir}-idle`, RagbiaBaselineArt.renderCharacter(cls, dir, 0, false));
          for (let f = 0; f < 3; f++) {
            this.textures.addCanvas(`${cls}-${dir}-walk-${f}`, RagbiaBaselineArt.renderCharacter(cls, dir, f, true));
          }
        }
      }
      for (let f = 0; f < 3; f++) {
        this.textures.addCanvas(`slime-${f}`, RagbiaBaselineArt.renderSlime(f));
      }
      this.textures.addCanvas('arrow', RagbiaBaselineArt.renderArrow());

      const required = [
        'warrior-down-idle', 'warrior-up-walk-1', 'archer-left-walk-2',
        'slime-0', 'slime-1', 'slime-2', 'arrow'
      ];
      const missing = required.filter(key => !this.textures.exists(key));
      if (missing.length) {
        const msg = `Texturas visuais ausentes do cache: ${missing.join(', ')}`;
        if (window.RagbiaBoot) window.RagbiaBoot.fail(msg);
        throw new Error(msg);
      }
    }

    buildHud() {
      const hud = this.add.graphics().setDepth(1000).setScrollFactor(0);
      // M002.1 FIX1: identidade ganhou uma linha própria para não colidir com o título.
      hud.fillStyle(0x07100d, 0.86).fillRect(18, 18, 920, 156);
      hud.lineStyle(3, 0x6f9475, 0.8).strokeRect(18, 18, 920, 156);
      hud.fillStyle(0x07100d, 0.82).fillRect(18, VIEW_H - 112, VIEW_W - 36, 94);

      this.add.text(42, 34, 'Ragbia Pixel — CORE V0.1 / M002.1', {
        fontFamily: 'Consolas, monospace', fontSize: '27px', color: '#f4f3df', fontStyle: 'bold'
      }).setDepth(1001).setScrollFactor(0);

      const identity = this.playerSession
        ? `${this.playerSession.name} — ${this.playerSession.className}`
        : 'Sessão sem personagem';
      this.add.text(42, 70, identity, {
        fontFamily: 'Consolas, monospace', fontSize: '21px', color: '#bcd3b8'
      }).setDepth(1001).setScrollFactor(0);

      this.hudStatus = this.add.text(42, 108, '', {
        fontFamily: 'Consolas, monospace', fontSize: '21px', color: '#ffd967'
      }).setDepth(1001).setScrollFactor(0);

      this.hudControls = this.add.text(42, VIEW_H - 86, 'Mover: WASD/Setas/analógico   DASH: Shift/B   Soft: TAB/RB   Campo: Shift+TAB/LB+RB   ENGAGE: Espaço/RT   Limpar: Esc/LT   C: DEBUG', {
        fontFamily: 'Consolas, monospace', fontSize: '21px', color: '#d9e3d6'
      }).setDepth(1001).setScrollFactor(0);

      this.debugLabel = this.add.text(VIEW_W - 54, 36, 'CORE V0.1\nDEBUG OFF', {
        fontFamily: 'Consolas, monospace', fontSize: '20px', color: '#8ea096', align: 'right'
      }).setOrigin(1, 0).setDepth(1001).setScrollFactor(0);
    }

    readPad(dt) {
      let x = 0, y = 0, lb = false, rb = false, lt = false, rt = false, yButton = false, bButton = false;
      if (navigator.getGamepads) {
        const gp = Array.from(navigator.getGamepads() || []).find(Boolean);
        if (gp) {
          const ax = gp.axes[0] || 0;
          const ay = gp.axes[1] || 0;
          if (Math.abs(ax) > .18) x = ax;
          if (Math.abs(ay) > .18) y = ay;
          if (gp.buttons[14]?.pressed) x -= 1;
          if (gp.buttons[15]?.pressed) x += 1;
          if (gp.buttons[12]?.pressed) y -= 1;
          if (gp.buttons[13]?.pressed) y += 1;
          lb = !!gp.buttons[4]?.pressed;
          rb = !!gp.buttons[5]?.pressed;
          lt = !!((gp.buttons[6]?.value || 0) > .55 || gp.buttons[6]?.pressed);
          rt = !!((gp.buttons[7]?.value || 0) > .55 || gp.buttons[7]?.pressed);
          yButton = !!gp.buttons[3]?.pressed;
          bButton = !!gp.buttons[1]?.pressed;
        }
      }

      const both = lb && rb;
      let wideTargetPressed = false;
      let softTargetPressed = false;

      // Pequena janela evita que RB dispare soft target um frame antes de LB+RB.
      if (rb && !this.prevPad.rb && !lb) this.rbSoftPending = 0.11;
      if (both && !this.prevPad.both) {
        this.rbSoftPending = 0;
        wideTargetPressed = true;
      }
      if (this.rbSoftPending > 0) {
        const before = this.rbSoftPending;
        this.rbSoftPending = Math.max(0, this.rbSoftPending - dt);
        if (before > 0 && this.rbSoftPending === 0) softTargetPressed = true;
      }

      const result = {
        x, y,
        engageHeld: rt,
        engagePressed: rt && !this.prevPad.rt,
        softTargetPressed,
        wideTargetPressed,
        targetClearPressed: lt && !this.prevPad.lt,
        classTogglePressed: yButton && !this.prevPad.y,
        dodgePressed: bButton && !this.prevPad.b
      };
      this.prevPad = { lb, rb, both, lt, rt, y: yButton, b: bButton };
      return result;
    }

    toggleClass() {
      this.classId = this.classId === 'warrior' ? 'archer' : 'warrior';
      this.attackT = 0;
      this.cooldown = Math.min(this.cooldown, 0.12);
      this.bowReleased = false;
      const profile = RagbiaDodgeV0.profileFor(this.classId);
      this.dashCharges = Math.min(this.dashCharges, profile.charges);
    }

    startDash(inputX, inputY) {
      if (!this.playerStats.alive || this.dashT > 0) return false;
      const profile = RagbiaDodgeV0.profileFor(this.classId);
      if (this.dashCharges <= 0) return false;

      const intent = RagbiaDodgeV0.normalizeIntent(inputX, inputY, this.lastMoveX, this.lastMoveY);
      this.dashDirX = intent.x;
      this.dashDirY = intent.y;
      this.dashDir = RagbiaDodgeV0.directionFromVector(intent.x, intent.y);
      this.dir = this.dashDir;

      this.dashDuration = profile.duration;
      this.dashT = profile.duration;
      this.dashIFrameT = profile.invulnerability;
      this.dashCharges -= 1;
      this.dashCooldownT = profile.cooldown;
      this.dashAfterimageT = 0;
      this.dashBlocked = false;

      // Dash interrompe a animação ofensiva atual, mas NÃO cancela Engage nem alvo.
      this.cancelAttack();
      this.spawnDashDust();
      this.spawnDashAfterimage();
      this.lastCombatEvent = `DASH ${this.dashDir.toUpperCase()} — i-frame ${Math.round(profile.invulnerability * 1000)}ms`;
      return true;
    }

    spawnDashDust() {
      this.impactBursts.push({
        x: this.player.x - this.dashDirX * 18,
        y: this.player.y + 26 - this.dashDirY * 8,
        life: 0.24, maxLife: 0.24, source: 'dashDust',
        dirX: -this.dashDirX, dirY: -this.dashDirY
      });
    }

    spawnDashAfterimage() {
      if (!this.player || !this.player.visible) return;
      const ghost = this.add.image(this.player.x, this.player.y, this.player.texture.key);
      ghost.setOrigin(this.player.originX, this.player.originY);
      ghost.setDepth(19);
      ghost.setAlpha(0.28);
      ghost.setTint(0xbcd7e6);
      ghost.setScale(this.player.scaleX, this.player.scaleY);
      this.dashAfterimages.push({ view: ghost, life: 0.18, maxLife: 0.18 });
    }

    updateDashAfterimages(dt) {
      for (let i = this.dashAfterimages.length - 1; i >= 0; i--) {
        const a = this.dashAfterimages[i];
        a.life -= dt;
        a.view.setAlpha(Math.max(0, 0.28 * (a.life / a.maxLife)));
        if (a.life <= 0) {
          a.view.destroy();
          this.dashAfterimages.splice(i, 1);
        }
      }
    }

    updateDodgeRecharge(dt) {
      const profile = RagbiaDodgeV0.profileFor(this.classId);
      if (this.dashCharges >= profile.charges) {
        this.dashCooldownT = 0;
        return;
      }
      this.dashCooldownT = Math.max(0, this.dashCooldownT - dt);
      if (this.dashCooldownT <= 0) {
        this.dashCharges = Math.min(profile.charges, this.dashCharges + 1);
        if (this.dashCharges < profile.charges) this.dashCooldownT = profile.cooldown;
      }
    }

    updateDash(dt) {
      if (this.dashT <= 0) return false;
      const profile = RagbiaDodgeV0.profileFor(this.classId);
      const before = this.dashT;
      this.dashT = Math.max(0, this.dashT - dt);
      this.dashIFrameT = Math.max(0, this.dashIFrameT - dt);
      const travelDt = Math.min(dt, before);
      const speed = profile.distance / Math.max(0.001, profile.duration);
      const moveResult = RagbiaCollisionV0.move(
        this.player.x, this.player.y,
        this.dashDirX * speed * travelDt,
        this.dashDirY * speed * travelDt,
        this.entities
      );
      this.player.x = moveResult.x;
      this.player.y = moveResult.y;
      this.blockedX = moveResult.blockedX;
      this.blockedY = moveResult.blockedY;
      this.lastCollisionHit = moveResult.hit;
      if (moveResult.blockedX || moveResult.blockedY) this.dashBlocked = true;

      const progress = 1 - this.dashT / Math.max(0.001, this.dashDuration);
      const dashTex = `${this.classId}-${this.dashDir}-idle`;
      if (this.player.texture.key !== dashTex) this.player.setTexture(dashTex);
      const scale = RagbiaDodgeV0.flipScale(this.dashDir, progress);
      this.player.setScale(scale.x, scale.y);

      this.dashAfterimageT -= travelDt;
      if (this.dashAfterimageT <= 0 && this.dashT > 0) {
        this.spawnDashAfterimage();
        this.dashAfterimageT = 0.045;
      }

      if (this.dashT <= 0) {
        this.player.setScale(1, 1);
        this.dashIFrameT = 0;
        // Soft Target reassume imediatamente a visão ao término da esquiva.
        this.lockFacingToTarget();
      }
      return true;
    }

    startAttack() {
      const target = this.selectedTarget();
      if (!target || !RagbiaEntitiesV0.isValidEnemy(target)) return false;
      // M001.7: seleção/visão continua separada do alcance de ataque.
      // A perseguição aproxima o personagem; o ataque só começa depois que o alvo entra no attackRange.
      if (!RagbiaTargetingSoft.isInAttackRange(target, this.player.x, this.player.y, this.classId)) return false;
      if (this.cooldown > 0 || this.attackT > 0) return false;
      this.attackTargetId = target.id;
      this.attackHitApplied = false;
      if (this.classId === 'warrior') {
        this.attackT = 0.38;
        this.cooldown = 0.46;
      } else {
        this.attackT = 0.36;
        this.cooldown = 0.56;
        this.bowReleased = false;
      }
      return true;
    }

    cancelAttack() {
      this.attackT = 0;
      this.attackTargetId = null;
      this.bowReleased = false;
      this.attackHitApplied = false;
      this.attackGraphics.clear();
    }

    directionVector() {
      return ({ left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] })[this.dir];
    }

    releaseArrow() {
      const target = this.attackTargetId ? RagbiaEntitiesV0.byId(this.entities, this.attackTargetId) : this.selectedTarget();
      if (!target || !RagbiaEntitiesV0.isValidEnemy(target)) return;
      let dx = target.x - this.player.x;
      let dy = (target.y - 8) - (this.player.y - 10);
      const len = Math.max(0.001, Math.hypot(dx, dy));
      dx /= len;
      dy /= len;
      const p = this.add.image(this.player.x + dx * 34, this.player.y - 10 + dy * 20, 'arrow');
      p.setDepth(35);
      p.setAngle(Math.atan2(dy, dx) * 180 / Math.PI);
      p.vx = dx * 840;
      p.vy = dy * 840;
      p.life = 1.45;
      p.targetId = target.id;
      p.damage = this.playerStats.attack;
      p.hitRadius = 9;
      this.projectiles.push(p);
    }

    drawPixelLine(g, x1, y1, x2, y2, thickness, color, step = 5, alpha = 1) {
      const dx = x2 - x1, dy = y2 - y1;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const n = Math.max(1, Math.ceil(dist / step));
      g.fillStyle(color, alpha);
      for (let i = 0; i <= n; i++) {
        const q = i / n;
        g.fillRect(Math.round(x1 + dx * q - thickness / 2), Math.round(y1 + dy * q - thickness / 2), thickness, thickness);
      }
    }

    drawSwordAttack(progress) {
      const g = this.attackGraphics;
      const px = this.player.x, py = this.player.y;
      let a0, a1;
      if (this.dir === 'down') { a0 = 2.72; a1 = 0.42; }
      else if (this.dir === 'up') { a0 = -0.42; a1 = -2.72; }
      else if (this.dir === 'right') { a0 = 1.25; a1 = -1.12; }
      else { a0 = 4.28; a1 = 1.90; }
      const eased = 0.08 + 0.92 * (1 - Math.cos(progress * Math.PI * 0.5));
      const angle = a0 + (a1 - a0) * eased;
      const bx = px + Math.cos(angle) * 16;
      const by = py + Math.sin(angle) * 16;
      const tx = px + Math.cos(angle) * 78;
      const ty = py + Math.sin(angle) * 78;

      for (let k = 1; k <= 3; k++) {
        const pa = a0 + (a1 - a0) * Math.max(0, eased - k * 0.09);
        const sx = px + Math.cos(pa) * 72;
        const sy = py + Math.sin(pa) * 72;
        g.fillStyle(k === 1 ? 0xffe27c : 0xf7ca52, 0.72 - k * 0.12);
        g.fillRect(Math.round(sx - 8), Math.round(sy - 5), 16, 10);
      }
      this.drawPixelLine(g, bx, by, tx, ty, 9, 0xdce4e6, 4, 1);
      this.drawPixelLine(g, px + Math.cos(angle) * 5, py + Math.sin(angle) * 5, bx, by, 7, 0x5a3928, 4, 1);
    }

    drawBowAttack(progress) {
      const g = this.attackGraphics;
      const px = this.player.x, py = this.player.y;
      let ox = 0, oy = -10, rotation = 0;
      if (this.dir === 'right') { ox = 20; oy = -8; rotation = 0; }
      else if (this.dir === 'left') { ox = -20; oy = -8; rotation = Math.PI; }
      else if (this.dir === 'down') { oy = -2; rotation = Math.PI / 2; }
      else { oy = -25; rotation = -Math.PI / 2; }

      const releaseAt = 0.54;
      const pull = Math.min(1, progress / releaseAt);
      const x = px + ox, y = py + oy;
      const cos = Math.cos(rotation), sin = Math.sin(rotation);
      const tr = (lx, ly) => [x + lx * cos - ly * sin, y + lx * sin + ly * cos];

      for (const [lx, ly, w, h, col] of [
        [-5,-36,5,72,0x8d5b29],[10,-36,5,72,0x8d5b29],[-3,-30,3,60,0xc58a45],[10,-30,3,60,0xc58a45]
      ]) {
        const a = tr(lx + w/2, ly); const b = tr(lx + w/2, ly + h);
        this.drawPixelLine(g, a[0], a[1], b[0], b[1], w, col, 4, 1);
      }
      const top = tr(3, -33), mid = tr(3 - (12 + 18 * pull), 0), bot = tr(3, 33);
      this.drawPixelLine(g, top[0], top[1], mid[0], mid[1], 2, 0xece1c5, 3, 1);
      this.drawPixelLine(g, mid[0], mid[1], bot[0], bot[1], 2, 0xece1c5, 3, 1);
    }

    enemyDistanceToPlayer(entity) {
      if (!entity || !this.player) return Infinity;
      const ex = entity.x;
      const ey = entity.y + (Number(entity.collisionOffsetY) || 0);
      const px = this.player.x;
      const py = this.player.y + RagbiaCollisionV0.PLAYER_FOOT_OFFSET_Y;
      return Math.hypot(ex - px, ey - py);
    }

    enemyCanAttackPlayer(entity) {
      if (!entity || !entity.alive || !this.playerStats || !this.playerStats.alive) return false;
      const range = Number.isFinite(entity.attackRange) ? entity.attackRange : RagbiaCombatV0.ENEMY_ATTACK_V0.range;
      return this.enemyDistanceToPlayer(entity) <= range;
    }

    startEnemyAttack(entity) {
      if (!RagbiaEnemyAIV0.canAttack(entity)) return false;
      if (!this.enemyCanAttackPlayer(entity)) return false;
      if ((entity.attackCooldownT || 0) > 0 || (entity.enemyAttackT || 0) > 0) return false;
      entity.enemyAttackT = Number.isFinite(entity.attackWindup) ? entity.attackWindup : RagbiaCombatV0.ENEMY_ATTACK_V0.windup;
      entity.enemyAttackHitApplied = false;
      entity.attackCooldownT = Number.isFinite(entity.attackCooldown) ? entity.attackCooldown : RagbiaCombatV0.ENEMY_ATTACK_V0.cooldown;
      entity.enemyAttackPulseT = entity.enemyAttackT;
      return true;
    }

    showPlayerDamage(amount) {
      const label = Number.isInteger(amount) ? String(amount) : String(amount).replace(/0+$/, '').replace(/\.$/, '');
      const t = this.add.text(this.player.x, this.player.y - 74, `-${label}`, {
        fontFamily: 'Consolas, monospace', fontSize: '30px', color: '#ffd84a', fontStyle: 'bold',
        stroke: '#3b2a00', strokeThickness: 5
      }).setOrigin(0.5).setDepth(120);
      this.damageTexts.push({ view: t, life: 0.72, vy: -46 });
    }

    spawnPlayerImpact(sourceEntity) {
      const sx = sourceEntity ? sourceEntity.x : this.player.x;
      const sy = sourceEntity ? sourceEntity.y : this.player.y;
      let dx = this.player.x - sx;
      let dy = this.player.y - sy;
      const len = Math.max(0.001, Math.hypot(dx, dy));
      dx /= len; dy /= len;
      this.impactBursts.push({
        x: this.player.x, y: this.player.y - 8,
        life: 0.27, maxLife: 0.27, source: 'enemy',
        dirX: dx, dirY: dy, spread: 42, particleSize: 10, rays: 6
      });
      this.playerHitFlashT = 0.15;
      this.player.setTintFill(0xffb08f);
      this.hitStopT = Math.max(this.hitStopT, 0.052);
      this.cameras.main.shake(82, 0.0023);
    }

    startPlayerDeath() {
      if (this.playerDeathAnimating || !this.player) return;
      this.playerDeathAnimating = true;
      this.playerDeathT = this.playerDeathDuration;
      this.playerRespawnT = this.playerRespawnDelay;
      this.targetId = null;
      this.cancelEngageContinuity();
      this.cancelAttack();
      this.engageHeld = false;
      this.engageNeedsRelease = true;
      this.pursuitActive = false;
      this.pursuitBlocked = false;
      this.pursuitManualOverride = false;
      this.pursuitTargetId = null;
      this.dashT = 0;
      this.dashIFrameT = 0;
      this.player.setScale(1, 1);
      for (const a of this.dashAfterimages) a.view.destroy();
      this.dashAfterimages.length = 0;
      for (const p of this.projectiles) p.destroy();
      this.projectiles.length = 0;
      this.lastCombatEvent = `PLAYER DERROTADO — respawn ${this.playerRespawnDelay.toFixed(0)}s`;
    }

    respawnPlayer() {
      RagbiaCombatV0.respawnPlayer(this.playerStats);
      this.player.x = RagbiaMapBeta.spawn.x;
      this.player.y = RagbiaMapBeta.spawn.y;
      this.player.setVisible(true);
      this.player.setAlpha(1);
      this.player.setScale(1, 1);
      this.player.clearTint();
      this.playerDeathAnimating = false;
      this.playerDeathT = 0;
      this.playerRespawnT = 0;
      this.playerHitFlashT = 0;
      this.dashT = 0;
      this.dashIFrameT = 0;
      this.player.setScale(1, 1);
      const dodgeProfile = RagbiaDodgeV0.profileFor(this.classId);
      this.dashCharges = dodgeProfile.charges;
      this.dashCooldownT = 0;
      this.targetId = null;
      this.cancelEngageContinuity();
      this.cancelAttack();
      this.pursuitActive = false;
      this.pursuitBlocked = false;
      this.pursuitManualOverride = false;
      this.pursuitTargetId = null;
      this.lastCombatEvent = `PLAYER RESPAWN HP ${this.playerStats.hp}/${this.playerStats.maxHP}`;
      this.impactBursts.push({ x: this.player.x, y: this.player.y + 8, life: 0.28, maxLife: 0.28, source: 'playerRespawn' });
    }

    updatePlayerLifecycle(dt) {
      if (this.playerHitFlashT > 0) {
        this.playerHitFlashT = Math.max(0, this.playerHitFlashT - dt);
        if (this.playerHitFlashT <= 0 && this.playerStats.alive) this.player.clearTint();
      }
      if (this.playerDeathAnimating) {
        this.playerDeathT = Math.max(0, this.playerDeathT - dt);
        const p = 1 - this.playerDeathT / this.playerDeathDuration;
        this.player.setScale(1 + p * 0.15, Math.max(0.08, 1 - p * 0.90));
        this.player.setAlpha(Math.max(0, 1 - p));
        if (this.playerDeathT <= 0) {
          this.playerDeathAnimating = false;
          this.player.setVisible(false);
          this.player.setAlpha(1);
          this.player.setScale(1, 1);
        }
      }
      if (!this.playerStats.alive && this.playerRespawnT > 0) {
        this.playerRespawnT = Math.max(0, this.playerRespawnT - dt);
        if (this.playerRespawnT <= 0 && !this.playerDeathAnimating) this.respawnPlayer();
      }
    }

    damagePlayer(amount, sourceEntity) {
      if (this.dashIFrameT > 0 && this.playerStats.alive) {
        this.lastCombatEvent = `ESQUIVA PERFEITA — dano evitado de ${sourceEntity ? sourceEntity.id : 'inimigo'}`;
        return { applied: false, dodged: true, damage: 0, hpBefore: this.playerStats.hp, hpAfter: this.playerStats.hp, killed: false };
      }
      const result = RagbiaCombatV0.applyDamage(this.playerStats, amount);
      if (!result.applied) return result;
      this.showPlayerDamage(result.damage);
      this.spawnPlayerImpact(sourceEntity);
      this.lastCombatEvent = `PLAYER: ${result.hpBefore} -> ${result.hpAfter} HP por ${sourceEntity ? sourceEntity.id : 'inimigo'}`;
      if (result.killed) this.startPlayerDeath();
      return result;
    }

    updateEnemyAI(dt) {
      for (const entity of this.entities) {
        if (!entity.alive) continue;
        const wasAggro = !!entity.aggro;
        const wasReset = entity.aiState === RagbiaEnemyAIV0.STATES.RESET;
        let plan = RagbiaEnemyAIV0.plan(
          entity, this.player.x, this.player.y, !!(this.playerStats && this.playerStats.alive),
          RagbiaCollisionV0.PLAYER_FOOT_OFFSET_Y
        );

        if (!wasAggro && entity.aggro) {
          this.enemyAggroEvents += 1;
          this.lastCombatEvent = `${entity.id}: AGGRO (FOV ${entity.visionRange})`;
        }
        if (!wasReset && entity.aiState === RagbiaEnemyAIV0.STATES.RESET) {
          this.enemyResetEvents += 1;
          this.lastCombatEvent = `${entity.id}: RESET ${entity.resetReason || 'leash'} — HP/recursos restaurados`;
        }

        if (plan.mode === 'reset-arrived') {
          RagbiaEnemyAIV0.finishReset(entity);
          if (entity.view) {
            entity.view.x = entity.x;
            entity.view.y = entity.y;
            entity.view.clearTint();
          }
          this.lastCombatEvent = `${entity.id}: RESET concluído no spawn`;
          continue;
        }

        if (plan.mode === RagbiaEnemyAIV0.STATES.CHASE || plan.mode === RagbiaEnemyAIV0.STATES.RESET) {
          const speed = plan.mode === RagbiaEnemyAIV0.STATES.RESET
            ? (Number.isFinite(entity.resetSpeed) ? entity.resetSpeed : RagbiaEnemyAIV0.DEFAULTS.resetSpeed)
            : (Number.isFinite(entity.moveSpeed) ? entity.moveSpeed : RagbiaEnemyAIV0.DEFAULTS.moveSpeed);
          const move = RagbiaCollisionV0.moveEntity(
            entity, plan.dx * speed * dt, plan.dy * speed * dt, this.entities,
            { ignoreEntities: plan.mode === RagbiaEnemyAIV0.STATES.RESET }
          );
          entity.x = move.x;
          entity.y = move.y;
          entity.aiBlocked = !!(move.blockedX || move.blockedY);

          // O leash é medido pela posição do INIMIGO em relação ao spawn, nunca pelo FOV.
          if (plan.mode === RagbiaEnemyAIV0.STATES.CHASE && RagbiaEnemyAIV0.shouldReset(entity)) {
            RagbiaEnemyAIV0.beginReset(entity, 'leash');
            this.enemyResetEvents += 1;
            this.lastCombatEvent = `${entity.id}: LEASH atingido — RESET`;
          }
        } else {
          entity.aiBlocked = false;
        }

        // Entidade é autoritativa; view apenas acompanha. Knock visual continua separado.
        if (entity.view && (entity.hitKnockT || 0) <= 0 && !entity.deathAnimating) {
          entity.view.x = entity.x;
          entity.view.y = entity.y;
        }
      }
    }

    renderEnemyStateVisuals(time) {
      const g = this.enemyStateGraphics;
      g.clear();
      // CORE V0.1: metadados visuais da IA só existem em modo DEBUG (C).
      if (!this.debugMode) return;
      const basePulse = RagbiaEnemyStateVisualV0.pulse(time);

      for (const entity of this.entities) {
        if (!entity.alive || !entity.view || !entity.view.visible || entity.deathAnimating) continue;
        const visual = RagbiaEnemyStateVisualV0.describe(entity);
        const x = Math.round(entity.x);
        const y = Math.round(entity.y);
        const activeAlpha = visual.active ? basePulse : 0.72;

        // Barra curta abaixo do sprite: leitura laboratorial constante do estado.
        // Não interfere no anel vermelho de Soft Target nem na hitbox.
        g.fillStyle(RagbiaEnemyStateVisualV0.COLORS.BACK, 0.88);
        g.fillRect(x - 17, y + 51, 34, 7);
        g.fillStyle(visual.color, activeAlpha);
        g.fillRect(x - 14, y + 53, 28, 3);

        if (visual.icon === 'alert') {
          // Alerta pixelado acima da cabeça. CHASE vermelho; ATTACK laranja.
          const iconAlpha = 0.72 + 0.28 * RagbiaEnemyStateVisualV0.pulse(time, 0.016, 0, 1);
          g.fillStyle(visual.color, iconAlpha);
          g.fillRect(x - 3, y - 84, 6, 16);
          g.fillRect(x - 3, y - 63, 6, 6);
          // pequenos brackets laterais reforçam a leitura de estado ativo sem cobrir o sprite
          g.fillRect(x - 22, y - 48, 9, 4);
          g.fillRect(x + 13, y - 48, 9, 4);
        } else if (visual.icon === 'return') {
          // RESET: seta roxa aponta fisicamente de volta ao spawn.
          const d = RagbiaEnemyStateVisualV0.resetDirection(entity);
          const sx = x;
          const sy = y - 76;
          const ex = sx + d.x * 24;
          const ey = sy + d.y * 24;
          const px = -d.y;
          const py = d.x;
          g.lineStyle(5, visual.color, activeAlpha);
          g.beginPath();
          g.moveTo(sx, sy);
          g.lineTo(ex, ey);
          g.strokePath();
          g.fillStyle(visual.color, activeAlpha);
          g.beginPath();
          g.moveTo(ex, ey);
          g.lineTo(ex - d.x * 10 + px * 6, ey - d.y * 10 + py * 6);
          g.lineTo(ex - d.x * 10 - px * 6, ey - d.y * 10 - py * 6);
          g.closePath();
          g.fillPath();
        }
      }
    }

    renderEnemyAIDebug() {
      const g = this.enemyAIGraphics;
      g.clear();
      if (!this.collisionDebug) return;
      for (const entity of this.entities) {
        if (!entity.alive) continue;
        const vision = Number.isFinite(entity.visionRange) ? entity.visionRange : RagbiaEnemyAIV0.DEFAULTS.visionRange;
        const reset = Number.isFinite(entity.resetRange) ? entity.resetRange : RagbiaEnemyAIV0.DEFAULTS.resetRange;
        const aggressive = entity.behavior === RagbiaEnemyAIV0.BEHAVIORS.AGGRESSIVE;
        g.lineStyle(3, aggressive ? 0x61d4ff : 0x8fa2ad, aggressive ? 0.52 : 0.28);
        g.strokeCircle(entity.x, entity.y + 22, vision);
        if (entity.resetEnabled !== false) {
          g.lineStyle(3, 0xd36cff, 0.42);
          g.strokeCircle(entity.spawnX, entity.spawnY + 22, reset);
        }
        const stateColor = entity.aiState === 'reset' ? 0xd36cff : entity.aggro ? 0xff5b45 : aggressive ? 0x61d4ff : 0xaab4b8;
        g.fillStyle(stateColor, 0.9);
        g.fillRect(Math.round(entity.x - 6), Math.round(entity.y - 66), 12, 12);
      }
    }

    updateEnemyCombat(dt) {
      const g = this.enemyAttackGraphics;
      g.clear();
      for (const entity of this.entities) {
        entity.attackCooldownT = Math.max(0, (entity.attackCooldownT || 0) - dt);
        if (!entity.alive) {
          entity.enemyAttackT = 0;
          entity.enemyAttackHitApplied = false;
          continue;
        }

        if ((entity.enemyAttackT || 0) <= 0) {
          if (this.playerStats.alive && RagbiaEnemyAIV0.canAttack(entity)) this.startEnemyAttack(entity);
          continue;
        }

        const maxT = Number.isFinite(entity.attackWindup) ? entity.attackWindup : RagbiaCombatV0.ENEMY_ATTACK_V0.windup;
        entity.enemyAttackT = Math.max(0, entity.enemyAttackT - dt);
        const progress = Math.max(0, Math.min(1, 1 - entity.enemyAttackT / Math.max(0.001, maxT)));

        // Telegraph V1: a área de ameaça nasce pequena e cresce continuamente
        // até alcançar EXATAMENTE o alcance lógico do ataque no instante do golpe.
        // Isto é legibilidade de ameaça, não balanceamento final.
        const attackRange = Number.isFinite(entity.attackRange) ? entity.attackRange : RagbiaCombatV0.ENEMY_ATTACK_V0.range;
        const startRatio = RagbiaCombatV0.ENEMY_ATTACK_V0.telegraphStartRatio || 0.28;
        const eased = progress * progress * (3 - 2 * progress); // smoothstep, sem salto no final
        const telegraphRadius = attackRange * (startRatio + (1 - startRatio) * eased);
        const urgency = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));

        // preenchimento translúcido + borda forte: ambos crescem com a área real.
        g.fillStyle(0xff5a32, 0.07 + urgency * 0.15);
        g.fillCircle(entity.x, entity.y + 22, telegraphRadius);
        g.lineStyle(4 + urgency * 3, urgency > 0.55 ? 0xff3d28 : 0xff8a45, 0.55 + progress * 0.42);
        g.strokeCircle(entity.x, entity.y + 22, telegraphRadius);

        // anel interno acelera perto do impacto e ajuda a comunicar o instante exato.
        const innerRadius = Math.max(18, telegraphRadius * (0.30 + 0.18 * Math.sin(progress * Math.PI * 8)));
        g.lineStyle(3, 0xffc05a, 0.28 + urgency * 0.60);
        g.strokeCircle(entity.x, entity.y + 22, innerRadius);

        if (this.playerStats.alive) {
          const dx = this.player.x - entity.x;
          const dy = (this.player.y - 10) - (entity.y - 4);
          const len = Math.max(0.001, Math.hypot(dx, dy));
          const nx = dx / len, ny = dy / len;
          const reach = 24 + progress * Math.min(attackRange * 0.62, 92);
          const marker = 8 + urgency * 8;
          g.fillStyle(urgency > 0.55 ? 0xff492f : 0xffa05f, 0.48 + progress * 0.48);
          g.fillRect(Math.round(entity.x + nx * reach - marker/2), Math.round(entity.y - 4 + ny * reach - marker/2), marker, marker);
        }

        const hitAt = RagbiaCombatV0.ENEMY_ATTACK_V0.hitAt;
        if (!entity.enemyAttackHitApplied && progress >= hitAt) {
          entity.enemyAttackHitApplied = true;
          // O jogador pode escapar do alcance durante o windup: nesse caso o ataque erra.
          // instante do golpe: flash de área completa antes de resolver o contato.
          g.lineStyle(8, 0xffd060, 0.95);
          g.strokeCircle(entity.x, entity.y + 22, Number.isFinite(entity.attackRange) ? entity.attackRange : RagbiaCombatV0.ENEMY_ATTACK_V0.range);
          if (this.enemyCanAttackPlayer(entity)) {
            this.damagePlayer(entity.attack, entity);
          } else {
            this.lastCombatEvent = `${entity.id}: ataque inimigo ERROU (fora de alcance)`;
          }
        }
      }
    }

    showDamage(entity, amount) {
      if (!entity) return;
      const label = Number.isInteger(amount) ? String(amount) : String(amount).replace(/0+$/, '').replace(/\.$/, '');
      const t = this.add.text(entity.x, entity.y - 64, `-${label}`, {
        fontFamily: 'Consolas, monospace', fontSize: '30px', color: '#ffd84a', fontStyle: 'bold',
        stroke: '#3b2a00', strokeThickness: 5
      }).setOrigin(0.5).setDepth(120);
      this.damageTexts.push({ view: t, life: 0.65, vy: -42 });
    }

    updateDamageTexts(dt) {
      for (let i = this.damageTexts.length - 1; i >= 0; i--) {
        const d = this.damageTexts[i];
        d.life -= dt;
        d.view.y += d.vy * dt;
        d.view.setAlpha(Math.max(0, Math.min(1, d.life / 0.28)));
        if (d.life <= 0) {
          d.view.destroy();
          this.damageTexts.splice(i, 1);
        }
      }
    }

    impactProfile(source) {
      // M001.4B — diferenças deliberadas de peso entre melee e projétil.
      if (source === 'melee') {
        return { life: 0.34, hitStop: 0.072, flash: 0.17, knockTime: 0.16, knockDistance: 18,
          shakeMs: 105, shakeIntensity: 0.0032, spread: 56, particleSize: 13, rays: 8 };
      }
      if (source === 'projectile') {
        return { life: 0.27, hitStop: 0.046, flash: 0.13, knockTime: 0.13, knockDistance: 11,
          shakeMs: 78, shakeIntensity: 0.0021, spread: 42, particleSize: 10, rays: 6 };
      }
      return { life: 0.24, hitStop: 0.040, flash: 0.12, knockTime: 0.12, knockDistance: 9,
        shakeMs: 70, shakeIntensity: 0.0018, spread: 38, particleSize: 9, rays: 6 };
    }

    spawnImpact(entity, source = 'attack', dirX = 0, dirY = 0) {
      if (!entity) return;
      const profile = this.impactProfile(source);
      let dx = Number(dirX) || 0;
      let dy = Number(dirY) || 0;
      if (Math.hypot(dx, dy) < 0.001) {
        dx = entity.x - this.player.x;
        dy = entity.y - this.player.y;
      }
      const len = Math.max(0.001, Math.hypot(dx, dy));
      dx /= len; dy /= len;

      this.impactBursts.push({
        x: entity.x,
        y: entity.y - 10,
        life: profile.life,
        maxLife: profile.life,
        source,
        dirX: dx, dirY: dy,
        spread: profile.spread, particleSize: profile.particleSize, rays: profile.rays
      });

      entity.hitFlashT = profile.flash;
      entity.hitKnockT = profile.knockTime;
      entity.hitKnockMax = profile.knockTime;
      entity.hitKnockX = dx;
      entity.hitKnockY = dy;
      entity.hitKnockDistance = profile.knockDistance;
      entity.visualOffsetX = 0;
      entity.visualOffsetY = 0;
      if (entity.view && entity.view.visible) entity.view.setTintFill(0xffffd2);

      // Hit-stop congela o gameplay por poucos frames. O valor é maior no melee.
      this.hitStopT = Math.max(this.hitStopT, profile.hitStop);
      this.lastImpactKind = source === 'melee' ? 'MELEE' : source === 'projectile' ? 'FLECHA' : source.toUpperCase();
      this.cameras.main.shake(profile.shakeMs, profile.shakeIntensity);
    }

    startDeathAnimation(entity) {
      if (!entity || !entity.view) return;
      entity.deathAnimating = true;
      entity.deathT = this.deathAnimDuration;
      entity.respawnT = this.respawnDelay;
      entity.view.setVisible(true);
      entity.view.setAlpha(1);
      entity.view.setScale(1, 1);
      // Mantém o tint de hit por alguns frames mesmo quando o golpe é fatal.
    }

    respawnEnemy(entity) {
      RagbiaCombatV0.respawnEntity(entity);
      if (entity.view) {
        entity.view.x = entity.x;
        entity.view.y = entity.y;
        entity.view.setVisible(true);
        entity.view.setAlpha(1);
        entity.view.setScale(1, 1);
        entity.view.clearTint();
      }
      this.impactBursts.push({ x: entity.x, y: entity.y + 10, life: 0.24, maxLife: 0.24, source: 'respawn' });
      this.lastCombatEvent = `${entity.id}: RESPAWN HP ${entity.hp}/${entity.maxHP}`;
    }

    updateCombatFeedback(dt) {
      const g = this.impactGraphics;
      g.clear();

      for (let i = this.impactBursts.length - 1; i >= 0; i--) {
        const fx = this.impactBursts[i];
        fx.life -= dt;
        const p = Math.max(0, Math.min(1, 1 - fx.life / fx.maxLife));
        const alpha = Math.max(0, 1 - p);

        if (fx.source === 'dashDust') {
          const spread = 8 + p * 26;
          const size = Math.max(3, Math.round(9 - p * 5));
          const bx = fx.x + (fx.dirX || 0) * spread;
          const by = fx.y + (fx.dirY || 0) * spread * 0.55;
          g.fillStyle(0xc9b281, alpha * 0.75);
          g.fillRect(Math.round(bx - size * 1.6), Math.round(by - size/2), size, size);
          g.fillRect(Math.round(bx + size * 0.8), Math.round(by - size/2 - 4), size, size);
          g.fillStyle(0x8f7b59, alpha * 0.55);
          g.fillRect(Math.round(bx - size/2), Math.round(by + size * 0.7), Math.max(3, size - 2), Math.max(3, size - 2));
        } else if (fx.source === 'respawn' || fx.source === 'playerRespawn') {
          const spread = 10 + p * 24;
          const size = Math.max(3, Math.round(8 - p * 4));
          g.fillStyle(0x9fe8a6, alpha);
          g.fillRect(Math.round(fx.x - size/2), Math.round(fx.y - spread - size/2), size, size);
          g.fillRect(Math.round(fx.x - size/2), Math.round(fx.y + spread - size/2), size, size);
          g.fillRect(Math.round(fx.x - spread - size/2), Math.round(fx.y - size/2), size, size);
          g.fillRect(Math.round(fx.x + spread - size/2), Math.round(fx.y - size/2), size, size);
        } else {
          // Impacto V1: estrela pixelada mais ampla + núcleo branco/amarelo.
          const maxSpread = Number.isFinite(fx.spread) ? fx.spread : 42;
          const spread = 12 + p * maxSpread;
          const baseSize = Number.isFinite(fx.particleSize) ? fx.particleSize : 10;
          const size = Math.max(4, Math.round(baseSize * (1 - p * 0.55)));
          const rays = Math.max(4, fx.rays || 6);
          const biasAngle = Math.atan2(fx.dirY || 0, fx.dirX || 1);
          for (let r = 0; r < rays; r++) {
            const a = biasAngle + (Math.PI * 2 * r / rays);
            const dist = spread * (r % 2 === 0 ? 1 : 0.72);
            const rx = fx.x + Math.cos(a) * dist;
            const ry = fx.y + Math.sin(a) * dist;
            const enemyHit = fx.source === 'enemy';
            g.fillStyle(enemyHit ? (r % 2 === 0 ? 0xff704f : 0xffb36b) : (r % 2 === 0 ? 0xffd84a : 0xfff3a0), alpha);
            g.fillRect(Math.round(rx - size/2), Math.round(ry - size/2), size, size);
          }
          const core = Math.max(8, Math.round(22 * (1 - p * 0.65)));
          g.fillStyle(0xffffff, Math.min(1, alpha * 1.25));
          g.fillRect(Math.round(fx.x - core/2), Math.round(fx.y - core/2), core, core);
          g.fillStyle(fx.source === 'enemy' ? 0xff7a52 : 0xffd84a, alpha);
          g.fillRect(Math.round(fx.x - core * 0.75), Math.round(fx.y - 3), Math.round(core * 1.5), 6);
          g.fillRect(Math.round(fx.x - 3), Math.round(fx.y - core * 0.75), 6, Math.round(core * 1.5));
        }
        if (fx.life <= 0) this.impactBursts.splice(i, 1);
      }

      for (const entity of this.entities) {
        if (entity.hitFlashT > 0) {
          entity.hitFlashT = Math.max(0, entity.hitFlashT - dt);
          if (entity.hitFlashT <= 0 && entity.view) entity.view.clearTint();
        }

        // Knock exclusivamente visual: a posição lógica/colisão da entidade não muda.
        if (entity.hitKnockT > 0 && entity.view) {
          entity.hitKnockT = Math.max(0, entity.hitKnockT - dt);
          const maxT = Math.max(0.001, entity.hitKnockMax || 0.14);
          const kp = Math.max(0, Math.min(1, 1 - entity.hitKnockT / maxT));
          const strength = Math.sin(kp * Math.PI) * (entity.hitKnockDistance || 10);
          entity.visualOffsetX = (entity.hitKnockX || 0) * strength;
          entity.visualOffsetY = (entity.hitKnockY || 0) * strength;
          entity.view.x = entity.x + entity.visualOffsetX;
          entity.view.y = entity.y + entity.visualOffsetY;
          if (entity.hitKnockT <= 0) {
            entity.visualOffsetX = entity.visualOffsetY = 0;
            entity.view.x = entity.x;
            entity.view.y = entity.y;
          }
        }

        if (entity.deathAnimating && entity.view) {
          entity.deathT = Math.max(0, entity.deathT - dt);
          const p = 1 - entity.deathT / this.deathAnimDuration;
          entity.view.setScale(1 + p * 0.18, Math.max(0.10, 1 - p * 0.88));
          entity.view.setAlpha(Math.max(0, 1 - p));
          if (entity.deathT <= 0) {
            entity.deathAnimating = false;
            entity.view.setVisible(false);
            entity.view.setAlpha(1);
            entity.view.setScale(1, 1);
          }
        }

        if (!entity.alive && entity.respawnT > 0) {
          entity.respawnT = Math.max(0, entity.respawnT - dt);
          if (entity.respawnT <= 0 && !entity.deathAnimating) this.respawnEnemy(entity);
        }
      }
    }

    damageEntity(entity, amount, source = 'attack', impactDirX = 0, impactDirY = 0) {
      const result = RagbiaCombatV0.applyDamage(entity, amount);
      if (!result.applied) return result;
      // M001.10: passivo que SOBREVIVE ao dano entra em aggro sem depender do FOV.
      if (!result.killed && entity.behavior === RagbiaEnemyAIV0.BEHAVIORS.PASSIVE) {
        const wasAggro = !!entity.aggro;
        RagbiaEnemyAIV0.provoke(entity, 'damage');
        if (!wasAggro && entity.aggro) {
          this.enemyAggroEvents += 1;
          this.lastCombatEvent = `${entity.id}: PASSIVO PROVOCADO — AGGRO`;
        }
      }
      this.showDamage(entity, result.damage);
      this.spawnImpact(entity, source, impactDirX, impactDirY);
      this.lastCombatEvent = `${entity.id}: ${result.hpBefore} -> ${result.hpAfter} HP`;
      if (result.killed) {
        const killedWasSelected = this.targetId === entity.id;
        this.lastCombatEvent = `${entity.id}: DERROTADO — respawn ${this.respawnDelay.toFixed(0)}s`;
        this.startDeathAnimation(entity);
        if (killedWasSelected) this.targetId = null;
        this.handleEngageTargetKilled(entity, killedWasSelected);
      }
      return result;
    }

    resolveWarriorHit() {
      if (this.attackHitApplied) return;
      this.attackHitApplied = true;
      const target = this.attackTargetId ? RagbiaEntitiesV0.byId(this.entities, this.attackTargetId) : null;
      if (!target || !RagbiaEntitiesV0.isValidEnemy(target)) return;
      // O golpe só conecta no momento do impacto se o alvo ainda estiver em alcance.
      if (!RagbiaTargetingSoft.isInAttackRange(target, this.player.x, this.player.y, this.classId)) {
        this.lastCombatEvent = `${target.id}: golpe fora de alcance`;
        return;
      }
      this.damageEntity(target, this.playerStats.attack, 'melee', target.x - this.player.x, target.y - this.player.y);
    }

    updateProjectiles(dt) {
      const W = RagbiaMapBeta.WORLD_W;
      const H = RagbiaMapBeta.WORLD_H;
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        let consumed = false;
        const target = p.targetId ? RagbiaEntitiesV0.byId(this.entities, p.targetId) : null;
        if (target && RagbiaCombatV0.projectileHitsEntity(p.x, p.y, p.hitRadius, target)) {
          this.damageEntity(target, p.damage, 'projectile', p.vx, p.vy);
          consumed = true;
        }

        if (consumed || p.life <= 0 || p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 80) {
          p.destroy();
          this.projectiles.splice(i, 1);
        }
      }
    }

    updateTargetCandidates() {
      this.entities.forEach(entity => RagbiaEntitiesV0.syncFromView(entity));
      this.softTargetCandidates = RagbiaTargetingSoft.softCandidates(
        this.entities, this.player.x, this.player.y, this.classId
      );
      this.fieldTargetCandidates = RagbiaTargetingSoft.fieldCandidates(
        this.entities, this.player.x, this.player.y, this.classId
      );
      this.targetCandidates = this.fieldTargetCandidates;
      const kept = RagbiaTargetingSoft.keepIfEnemyValid(this.targetId, this.entities);
      if (this.targetId && !kept) this.cancelAttack();
      this.targetId = kept;
    }

    tryEngageContinuityTarget() {
      if (!this.engageContinuityPending || !this.engageHeld || this.engageNeedsRelease || !this.playerStats.alive) return false;
      if (this.selectedTarget()) {
        this.engageContinuityPending = false;
        return false;
      }
      this.updateTargetCandidates();
      const nextId = RagbiaEngageContinuityV0.chooseNextId(
        this.softTargetCandidates, this.engageContinuityLastKilledId
      );
      if (!nextId) return false;
      this.targetId = nextId;
      this.lastTargetMode = 'soft';
      this.engageContinuityPending = false;
      this.engageContinuitySwitches += 1;
      this.lastCombatEvent = `ENGAGE CONTINUA -> ${nextId.toUpperCase()}`;
      return true;
    }

    handleEngageTargetKilled(entity, killedWasSelected) {
      if (!entity) return false;
      if (!RagbiaEngageContinuityV0.shouldArm(
        this.engageHeld, killedWasSelected, this.playerStats.alive, this.engageNeedsRelease
      )) return false;
      this.engageContinuityPending = true;
      this.engageContinuityLastKilledId = entity.id;
      // Tenta a troca no mesmo instante. Se não houver alvo Soft válido no FOV,
      // o estado permanece pendente enquanto Engage continuar segurado.
      this.tryEngageContinuityTarget();
      return true;
    }

    cancelEngageContinuity() {
      this.engageContinuityPending = false;
      this.engageContinuityLastKilledId = null;
    }

    cycleSoftTarget() {
      this.cancelEngageContinuity();
      this.updateTargetCandidates();
      this.targetId = RagbiaTargetingSoft.cycle(this.targetId, this.softTargetCandidates, 1);
      this.lastTargetMode = 'soft';
    }

    cycleFieldTarget() {
      this.cancelEngageContinuity();
      this.updateTargetCandidates();
      this.targetId = RagbiaTargetingSoft.cycle(this.targetId, this.fieldTargetCandidates, 1);
      this.lastTargetMode = 'field';
    }

    clearTarget() {
      this.targetId = null;
      this.cancelEngageContinuity();
      this.cancelAttack();
      this.pursuitActive = false;
      this.pursuitBlocked = false;
      this.pursuitManualOverride = false;
      this.pursuitTargetId = null;
    }

    selectedTarget() {
      return this.targetId ? RagbiaEntitiesV0.byId(this.entities, this.targetId) : null;
    }

    lockFacingToTarget() {
      const target = this.selectedTarget();
      if (!target || !RagbiaEntitiesV0.isValidEnemy(target)) return false;
      const dx = target.x - this.player.x;
      const dy = target.y - this.player.y;
      if (Math.abs(dx) > Math.abs(dy)) this.dir = dx < 0 ? 'left' : 'right';
      else this.dir = dy < 0 ? 'up' : 'down';
      return true;
    }

    renderTargeting(time) {
      const g = this.targetGraphics;
      g.clear();
      const target = this.selectedTarget();
      if (!target || !target.view || !target.view.visible) return;

      // Somente anel vermelho, abaixo da camada do inimigo.
      const pulse = (Math.sin(time * 0.008) + 1) * 0.5;
      const x = target.x;
      const y = target.y + 24;
      const w = 72 + pulse * 6;
      const h = 34 + pulse * 3;
      g.lineStyle(6, 0xd92f36, 0.96);
      g.strokeEllipse(x, y, w, h);
      g.lineStyle(2, 0xff6a6f, 0.72);
      g.strokeEllipse(x, y, w + 10, h + 7);
    }

    renderCollisionDebug() {
      const g = this.collisionGraphics;
      g.clear();
      if (!this.collisionDebug) return;

      const colors = {
        building: 0xff8d5b, fence: 0xf0c35a, ruin: 0xc888ff,
        water: 0x55b9ff, tree: 0x70e070, rock: 0xbfc5c8, entity: 0xff4f72, obstacle: 0xff6666
      };
      for (const s of RagbiaCollisionV0.shapes) {
        const color = colors[s.group] || 0xff6666;
        g.fillStyle(color, 0.18);
        g.lineStyle(3, color, 0.9);
        if (s.type === 'rect') {
          g.fillRect(s.x, s.y, s.w, s.h);
          g.strokeRect(s.x, s.y, s.w, s.h);
        } else if (s.type === 'circle') {
          g.fillCircle(s.x, s.y, s.r);
          g.strokeCircle(s.x, s.y, s.r);
        } else if (s.type === 'poly') {
          const pts = s.points.map(([x, y]) => ({ x, y }));
          g.fillPoints(pts, true);
          g.strokePoints(pts, true);
        }
      }

      // M001.3C: footprints físicos das entidades sólidas.
      for (const entity of this.entities) {
        const collider = RagbiaCollisionV0.entityColliderFor(entity);
        if (!collider) continue;
        g.fillStyle(0xff4f72, 0.20);
        g.lineStyle(3, 0xff4f72, 0.95);
        g.fillCircle(collider.x, collider.y, collider.r);
        g.strokeCircle(collider.x, collider.y, collider.r);
      }

      const cx = this.player.x;
      const cy = this.player.y + RagbiaCollisionV0.PLAYER_FOOT_OFFSET_Y;
      g.fillStyle(0xffffff, 0.25);
      g.lineStyle(3, 0xffffff, 1);
      g.fillCircle(cx, cy, RagbiaCollisionV0.PLAYER_RADIUS);
      g.strokeCircle(cx, cy, RagbiaCollisionV0.PLAYER_RADIUS);
    }

    update(time, deltaMs) {
      const dt = Math.min(0.05, deltaMs / 1000);

      // M001.4B — HIT-STOP: congela movimento, animação de ataque e projéteis por poucos frames.
      // O feedback também fica congelado, preservando o frame exato do contato.
      if (this.hitStopT > 0) {
        this.hitStopT = Math.max(0, this.hitStopT - dt);
        this.updateDamageTexts(0);
        this.updateCombatFeedback(0);
        this.renderTargeting(time);
        this.renderCollisionDebug();
        this.renderEnemyStateVisuals(time);
        return;
      }

      this.cooldown = Math.max(0, this.cooldown - dt);
      this.updatePlayerLifecycle(dt);
      this.updateDodgeRecharge(dt);
      this.updateDashAfterimages(dt);
      if (this.keyboardDodgePending > 0) {
        const beforePending = this.keyboardDodgePending;
        this.keyboardDodgePending = Math.max(0, this.keyboardDodgePending - dt);
        if (beforePending > 0 && this.keyboardDodgePending === 0) this.justDodge = true;
      }

      // Player morto: mundo/respawns continuam, mas input, movimento e ataques ficam suspensos.
      if (!this.playerStats.alive) {
        this.updateEnemyAI(dt);
        this.updateEnemyCombat(dt);
        this.updateProjectiles(dt);
        this.updateDamageTexts(dt);
        this.updateCombatFeedback(dt);
        const slimeFrameDead = Math.floor(time / 180) % 3;
        this.slimes.forEach((slime, i) => {
          const key = `slime-${(slimeFrameDead + i) % 3}`;
          if (slime.texture.key !== key) slime.setTexture(key);
        });
        this.updateTargetCandidates();
        this.renderTargeting(time);
        this.renderCollisionDebug();
        this.renderEnemyStateVisuals(time);
        this.renderEnemyAIDebug();
        const remaining = Math.max(0, this.playerRespawnT).toFixed(1);
        this.hudStatus.setText(`PLAYER HP ${this.playerStats.hp}/${this.playerStats.maxHP} — DERROTADO | RESPAWN ${remaining}s | COMBATE ${this.lastCombatEvent}`);
        return;
      }

      let x = 0, y = 0;
      if (this.keys.left.isDown || this.keys.arrowLeft.isDown) x -= 1;
      if (this.keys.right.isDown || this.keys.arrowRight.isDown) x += 1;
      if (this.keys.up.isDown || this.keys.arrowUp.isDown) y -= 1;
      if (this.keys.down.isDown || this.keys.arrowDown.isDown) y += 1;

      const pad = this.readPad(dt);
      if (Math.hypot(pad.x, pad.y) > Math.hypot(x, y)) { x = pad.x; y = pad.y; }
      const len = Math.hypot(x, y);
      if (len > 1) { x /= len; y /= len; }

      if (Math.hypot(x, y) > 0.12) {
        this.lastMoveX = x;
        this.lastMoveY = y;
      }

      if (this.justClassNext || this.justClassPrev || pad.classTogglePressed) this.toggleClass();
      if (this.justSoftTarget || pad.softTargetPressed) this.cycleSoftTarget();
      if (this.justWideTarget || pad.wideTargetPressed) this.cycleFieldTarget();
      if (this.justTargetClear || pad.targetClearPressed) this.clearTarget();
      if (this.justDodge || pad.dodgePressed) this.startDash(x, y);
      this.justClassNext = this.justClassPrev = false;
      this.justSoftTarget = this.justWideTarget = this.justTargetClear = this.justDodge = false;

      const keyboardEngageHeld = this.keys.engage.isDown;
      const engageHeldNow = keyboardEngageHeld || pad.engageHeld;
      const wasEngageHeld = this.engageHeld;
      const engagePressedNow = engageHeldNow && !wasEngageHeld;
      const engageReleasedNow = !engageHeldNow && wasEngageHeld;
      this.engageHeld = engageHeldNow;
      if (this.engageNeedsRelease) {
        if (!engageHeldNow) this.engageNeedsRelease = false;
        this.engageHeld = false;
      }
      if (engageReleasedNow || !this.engageHeld) this.cancelEngageContinuity();
      if (engagePressedNow && !this.engageNeedsRelease && !this.selectedTarget()) this.cycleSoftTarget();
      // M001.8: após uma morte sem sucessor imediato, continua procurando somente
      // enquanto o MESMO Engage permanecer segurado. Esc/LT e release cancelam isso.
      if (this.engageHeld && this.engageContinuityPending && !this.selectedTarget()) this.tryEngageContinuityTarget();

      const dashing = this.updateDash(dt);
      if (!dashing) {
        const speed = 300;

        // M001.7A — hierarquia de movimento:
        // Dash (tratado acima) > intenção manual > perseguição automática.
        // Enquanto o jogador estiver fornecendo direção, o chase cede imediatamente.
        // Ao cessar o input manual, Engage continua segurado e o chase reassume sozinho.
        const pursuitTarget = this.selectedTarget();
        const attackProfile = RagbiaTargetingSoft.profileFor(this.classId);
        const pursuitPlan = (this.engageHeld && pursuitTarget && RagbiaEntitiesV0.isValidEnemy(pursuitTarget))
          ? RagbiaPursuitV0.plan(pursuitTarget, this.player.x, this.player.y, this.classId, attackProfile.attackRange)
          : { active: false, distance: Infinity };
        const movementPlan = RagbiaPursuitV0.resolveMovement(pursuitPlan, x, y, speed, dt);

        let deltaX = movementPlan.dx;
        let deltaY = movementPlan.dy;
        let visualMoveX = movementPlan.visualX;
        let visualMoveY = movementPlan.visualY;

        this.pursuitManualOverride = movementPlan.manualOverride;
        this.pursuitActive = movementPlan.mode === 'chase';
        this.pursuitBlocked = false;
        this.pursuitTargetId = pursuitPlan.active && pursuitTarget ? pursuitTarget.id : null;
        this.pursuitLastDistance = pursuitPlan.distance ?? Infinity;

        const beforeX = this.player.x;
        const beforeY = this.player.y;
        const moveResult = RagbiaCollisionV0.move(
          this.player.x, this.player.y, deltaX, deltaY, this.entities
        );
        this.player.x = moveResult.x;
        this.player.y = moveResult.y;
        this.blockedX = moveResult.blockedX;
        this.blockedY = moveResult.blockedY;
        this.lastCollisionHit = moveResult.hit;

        const actualMove = Math.hypot(this.player.x - beforeX, this.player.y - beforeY);
        this.moving = actualMove > 0.05;
        if (this.pursuitActive && (moveResult.blockedX || moveResult.blockedY) && actualMove < Math.hypot(deltaX, deltaY) * 0.35) {
          this.pursuitBlocked = true;
        }

        if (this.moving) {
          this.walkT += dt * 7;
          if (!this.selectedTarget()) {
            if (Math.abs(visualMoveX) > Math.abs(visualMoveY)) this.dir = visualMoveX < 0 ? 'left' : 'right';
            else this.dir = visualMoveY < 0 ? 'up' : 'down';
          }
        }
        // Facing lock: alvo selecionado domina a direção, exceto durante o dash.
        this.lockFacingToTarget();
      } else {
        this.moving = false;
        this.pursuitActive = false;
        this.pursuitBlocked = false;
        this.pursuitManualOverride = false;
        this.pursuitTargetId = null;
      }

      // M001.10: agressivos detectam por FOV; passivos só entram no mesmo fluxo após serem provocados por dano.
      this.updateEnemyAI(dt);
      this.updateEnemyCombat(dt);
      if (!this.playerStats.alive) {
        this.updateDamageTexts(dt);
        this.updateCombatFeedback(dt);
        this.renderTargeting(time);
        this.renderCollisionDebug();
        this.renderEnemyStateVisuals(time);
        this.renderEnemyAIDebug();
        this.hudStatus.setText(`PLAYER HP ${this.playerStats.hp}/${this.playerStats.maxHP} — DERROTADO | RESPAWN ${this.playerRespawnT.toFixed(1)}s | COMBATE ${this.lastCombatEvent}`);
        return;
      }

      // ENGAGE M001.8: fora do range persegue; dentro do range repete ataques; morte do alvo pode encadear o próximo Soft Target.
      // Sem alvo selecionado, nenhum ataque é iniciado. Soltar ENGAGE para o chase imediatamente.
      if (!dashing && this.engageHeld && this.selectedTarget()) this.startAttack();

      if (!dashing) {
        const frame = Math.floor(this.walkT) % 3;
        const tex = this.moving ? `${this.classId}-${this.dir}-walk-${frame}` : `${this.classId}-${this.dir}-idle`;
        if (this.player.texture.key !== tex) this.player.setTexture(tex);
        if (this.player.scaleX !== 1 || this.player.scaleY !== 1) this.player.setScale(1, 1);
      }

      this.attackGraphics.clear();
      if (!dashing && this.attackT > 0) {
        this.attackT = Math.max(0, this.attackT - dt);
        if (this.classId === 'warrior') {
          const progress = 1 - this.attackT / 0.38;
          this.attackGraphics.setDepth(this.dir === 'up' ? 15 : 30);
          this.drawSwordAttack(progress);
          if (!this.attackHitApplied && progress >= 0.58) this.resolveWarriorHit();
        } else {
          const progress = 1 - this.attackT / 0.36;
          this.attackGraphics.setDepth(this.dir === 'up' ? 15 : 30);
          this.drawBowAttack(progress);
          if (!this.bowReleased && progress >= 0.54) {
            this.bowReleased = true;
            this.releaseArrow();
          }
        }
      }

      this.updateProjectiles(dt);
      this.updateDamageTexts(dt);
      this.updateCombatFeedback(dt);

      const slimeFrame = Math.floor(time / 180) % 3;
      this.slimes.forEach((s, i) => {
        const sf = (slimeFrame + i) % 3;
        const key = `slime-${sf}`;
        if (s.texture.key !== key) s.setTexture(key);
      });

      // Revalida entidades/candidatos. O alvo selecionado persiste fora do FOV enquanto continuar válido.
      this.updateTargetCandidates();
      this.renderTargeting(time);
      this.renderCollisionDebug();
      this.renderEnemyStateVisuals(time);
      this.renderEnemyAIDebug();

      const region = RagbiaMapBeta.regionAt(this.player.x, this.player.y);
      const selected = this.selectedTarget();
      const profile = RagbiaTargetingSoft.profileFor(this.classId);
      const distanceToTarget = selected ? RagbiaTargetingSoft.attackDistance(selected, this.player.x, this.player.y) : Infinity;
      const inAttackRange = selected ? RagbiaTargetingSoft.isInAttackRange(selected, this.player.x, this.player.y, this.classId) : false;
      const targetText = selected
        ? `  |  ALVO ${selected.id.toUpperCase()} HP ${selected.hp}/${selected.maxHP} (${Math.round(distanceToTarget)} px)`
        : '  |  ALVO —';
      const engageText = this.engageHeld ? '  |  ENGAGE ON' : '  |  ENGAGE OFF';
      const dodgeProfile = RagbiaDodgeV0.profileFor(this.classId);
      const dashText = this.dashCharges > 0
        ? `  |  DASH ${this.dashCharges}/${dodgeProfile.charges} READY${this.dashT > 0 ? ' ATIVO' : ''}`
        : `  |  DASH 0/${dodgeProfile.charges} CD ${this.dashCooldownT.toFixed(1)}s`;
      const iframeText = this.dashIFrameT > 0 ? ' I-FRAME' : '';

      // HUD normal: não expõe PASSIVO/AGRESSIVO, FOV, leash ou estado interno da IA.
      // M002.1 FIX1: identidade oficial vem do estado da sessão; a classe técnica do
      // laboratório do CORE continua interna até a escolha de arma do M002.4.
      const displayClass = this.playerSession?.className || (this.classId === 'warrior' ? 'Guerreiro' : 'Arqueiro');
      let status = `${displayClass} HP ${this.playerStats.hp}/${this.playerStats.maxHP} ATK ${this.playerStats.attack}${targetText}${engageText}${dashText}${iframeText}`;

      if (this.debugMode) {
        const blocked = (this.blockedX || this.blockedY)
          ? `  |  BLOQUEIO ${this.lastCollisionHit ? this.lastCollisionHit.id : 'obstáculo'}`
          : '';
        const debugTarget = selected
          ? `  |  IA ${selected.behavior === 'aggressive' ? 'AGRESSIVO' : 'PASSIVO'}:${String(selected.aiState || 'idle').toUpperCase()}`
          : '';
        const continuityText = this.engageContinuityPending
          ? '  |  CONTINUIDADE AGUARDANDO'
          : this.engageContinuitySwitches > 0
            ? `  |  CONTINUIDADE x${this.engageContinuitySwitches}`
            : '';
        const chaseText = this.pursuitManualOverride
          ? '  |  CHASE MANUAL'
          : this.pursuitActive
            ? `  |  CHASE ${this.pursuitBlocked ? 'BLOQUEADO' : 'ON'}`
            : '  |  CHASE OFF';
        const rangeText = selected
          ? `  |  ${inAttackRange ? 'ATK OK' : 'FORA ATK'} ${Math.round(distanceToTarget)}/${profile.attackRange}`
          : `  |  ATK RANGE ${profile.attackRange}`;
        const poolText = `  |  SOFT ${this.softTargetCandidates.length}/2  FOV ${this.fieldTargetCandidates.length}@${profile.visionRange}`;
        const aggressiveCount = this.entities.filter(e => e.alive && e.behavior === 'aggressive').length;
        const passiveCount = this.entities.filter(e => e.alive && e.behavior === 'passive').length;
        const aggroCount = this.entities.filter(e => e.alive && e.aggro).length;
        const resetCount = this.entities.filter(e => e.alive && e.aiState === 'reset').length;
        const reactiveTest = this.entities.find(e => e.labRole === 'passive-reactive-test');
        const reactiveText = reactiveTest ? ` PTEST ${reactiveTest.id.toUpperCase()} HP${reactiveTest.hp}/${reactiveTest.maxHP}` : '';
        const aiText = `  |  AI A${aggressiveCount}/P${passiveCount} AGGRO${aggroCount} RESET${resetCount}${reactiveText}`;
        status += `\nDEBUG | ${region} X${Math.round(this.player.x)} Y${Math.round(this.player.y)} | LAB CLASS ${this.classId.toUpperCase()}${debugTarget}${continuityText}${chaseText}${poolText}${rangeText}${aiText}${blocked} | EVENTO ${this.lastCombatEvent}`;
      }

      this.hudStatus.setText(status);
      if (this.debugLabel) {
        this.debugLabel.setText(this.debugMode ? 'CORE V0.1\nDEBUG ON' : 'CORE V0.1\nDEBUG OFF');
        this.debugLabel.setColor(this.debugMode ? '#ffd36a' : '#8ea096');
      }

    }
  }

  const config = {
    // CORE V0.1: baseline consolidada pós-M001.11; debug interno desligado por padrão.
    type: Phaser.CANVAS,
    parent: 'game-root',
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#13251a',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIEW_W,
      height: VIEW_H
    },
    scene: MapBetaScene
  };

  let gameInstance = null;

  function startSession(rawName) {
    if (gameInstance) return gameInstance;

    const state = RagbiaPlayerStateV0.create(rawName);
    const validation = RagbiaPlayerStateV0.validate(state);
    if (!validation.ok) throw new Error(`Estado inicial inválido: ${validation.errors.join(' | ')}`);

    window.RagbiaPlayerSession = state;
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
      startScreen.classList.remove('ready');
      startScreen.setAttribute('aria-hidden', 'true');
    }

    gameInstance = new Phaser.Game(config);
    return gameInstance;
  }

  function setupStartScreen() {
    const screen = document.getElementById('start-screen');
    const input = document.getElementById('character-name');
    const button = document.getElementById('play-button');
    const error = document.getElementById('start-error');
    if (!screen || !input || !button || !error) {
      throw new Error('Tela inicial M002.1 incompleta no DOM.');
    }

    const submit = () => {
      error.textContent = '';
      try {
        startSession(input.value);
      } catch (err) {
        error.textContent = err && err.message ? err.message : String(err);
        input.focus();
      }
    };

    button.addEventListener('click', submit);
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        submit();
      }
    });

    screen.classList.add('ready');
    screen.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 0);
    if (window.RagbiaBoot) window.RagbiaBoot.ready('Ragbia Pixel M002.1 — tela inicial pronta');
  }

  window.RagbiaM002 = { startSession };
  setupStartScreen();
})();
