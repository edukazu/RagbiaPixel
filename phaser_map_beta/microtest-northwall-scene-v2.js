(() => {
  'use strict';

  const VIEW_W = 1280;
  const VIEW_H = 720;
  const DIRS = ['down', 'up', 'left', 'right'];

  class MicrotestNorthWallSceneV2 extends Phaser.Scene {
    constructor() {
      super('microtest-northwall-v2');
      this.dir = 'up';
      this.walkT = 0;
      this.moving = false;
      this.debugMode = false;
      this.lastHit = null;
    }

    create() {
      this.playerSession = window.RagbiaPlayerSession || null;
      if (!this.playerSession) throw new Error('M002.2B.0.2 exige sessão de personagem.');

      this.cameras.main.setBackgroundColor('#0f1410');
      this.buildTextures();
      this.buildVisual();
      this.buildPlayer();
      this.buildInput();
      this.buildHud();

      const test = RagbiaMicrotestCollisionV2.selfTest();
      if (!test.ok) throw new Error(`Autoteste M002.2B.0.2 falhou: ${test.errors.join(' | ')}`);
      if (window.RagbiaBoot) window.RagbiaBoot.ok('M002.2B.0.2 — microteste carregado');
    }

    buildTextures() {
      this.textures.addCanvas('microtest-base-v2', RagbiaMicrotestArtV2.drawBase());
      for (const dir of DIRS) {
        this.textures.addCanvas(`apprentice-${dir}-idle`, RagbiaApprenticeArtV0.render(dir, 0, false));
        for (let f = 0; f < 3; f++) this.textures.addCanvas(`apprentice-${dir}-walk-${f}`, RagbiaApprenticeArtV0.render(dir, f, true));
      }
    }

    buildVisual() {
      this.base = this.add.image(0, 0, 'microtest-base-v2').setOrigin(0, 0).setScale(2).setDepth(0);
      this.shadow = this.add.graphics().setDepth(1);
      this.shadow.fillStyle(0x1c1510, 0.42);
      this.shadow.fillRect(684, 294, 186, 14);
      this.shadow.fillRect(946, 288, 118, 12);
      this.debugGraphics = this.add.graphics().setDepth(3000).setVisible(false);
    }

    buildPlayer() {
      const s = RagbiaMicrotestCollisionV2.spawn;
      this.player = this.add.image(s.x, s.y, 'apprentice-up-idle');
      this.player.setOrigin(0.5, 92 / 128);
      this.player.setScale(0.86);
      this.player.setDepth(this.playerFootY());
    }

    buildInput() {
      this.keys = this.input.keyboard.addKeys({
        up: 'W', down: 'S', left: 'A', right: 'D',
        arrowUp: 'UP', arrowDown: 'DOWN', arrowLeft: 'LEFT', arrowRight: 'RIGHT',
        fullscreen: 'F', debug: 'C', reset: 'R'
      });

      this.input.keyboard.on('keydown-F', () => this.scale.toggleFullscreen());
      this.input.keyboard.on('keydown-C', () => {
        this.debugMode = !this.debugMode;
        this.debugGraphics.setVisible(this.debugMode);
        if (!this.debugMode) this.debugGraphics.clear();
      });
      this.input.keyboard.on('keydown-R', () => {
        const s = RagbiaMicrotestCollisionV2.spawn;
        this.player.setPosition(s.x, s.y);
      });
    }

    buildHud() {
      const hud = this.add.graphics().setDepth(4000).setScrollFactor(0);
      hud.fillStyle(0x07100d, 0.78).fillRoundedRect(14, 14, 560, 92, 8);
      hud.lineStyle(2, 0x6f9475, 0.75).strokeRoundedRect(14, 14, 560, 92, 8);
      hud.fillStyle(0x07100d, 0.74).fillRoundedRect(14, VIEW_H - 54, 1038, 40, 6);

      this.add.text(30, 27, 'M002.2B.0.2 — ESCALA HUMANA', {
        fontFamily: 'Consolas, monospace', fontSize: '20px', color: '#f0ead7', fontStyle: 'bold'
      }).setDepth(4001).setScrollFactor(0);

      this.add.text(30, 60, `${this.playerSession.name} — ${this.playerSession.className}`, {
        fontFamily: 'Consolas, monospace', fontSize: '17px', color: '#b9cfad'
      }).setDepth(4001).setScrollFactor(0);

      this.add.text(30, VIEW_H - 45,
        'Mover: WASD/Setas/analógico   C: colisão   R: reset   F: tela cheia   |   Janela baixa + lareira reduzida',
        { fontFamily: 'Consolas, monospace', fontSize: '15px', color: '#d9e3d6' }
      ).setDepth(4001).setScrollFactor(0);

      this.debugLabel = this.add.text(VIEW_W - 18, 18, 'DESENHADO DO ZERO\nDEBUG OFF', {
        fontFamily: 'Consolas, monospace', fontSize: '14px', color: '#93a091', align: 'right'
      }).setOrigin(1, 0).setDepth(4001).setScrollFactor(0);
    }

    readPad() {
      let x = 0, y = 0;
      if (navigator.getGamepads) {
        const gp = Array.from(navigator.getGamepads() || []).find(Boolean);
        if (gp) {
          const ax = gp.axes[0] || 0;
          const ay = gp.axes[1] || 0;
          if (Math.abs(ax) > 0.18) x = ax;
          if (Math.abs(ay) > 0.18) y = ay;
          if (gp.buttons[14]?.pressed) x -= 1;
          if (gp.buttons[15]?.pressed) x += 1;
          if (gp.buttons[12]?.pressed) y -= 1;
          if (gp.buttons[13]?.pressed) y += 1;
        }
      }
      return { x, y };
    }

    playerFootY() {
      return this.player ? this.player.y + RagbiaMicrotestCollisionV2.PLAYER_FOOT_OFFSET_Y : 0;
    }

    renderDebug() {
      if (!this.debugMode) return;
      const g = this.debugGraphics;
      g.clear();
      g.lineStyle(2, 0xffca55, 0.92);
      for (const s of RagbiaMicrotestCollisionV2.shapes) g.strokeRect(s.x, s.y, s.w, s.h);
      g.lineStyle(2, 0x6fe5ff, 0.98);
      g.strokeCircle(this.player.x, this.playerFootY(), RagbiaMicrotestCollisionV2.PLAYER_RADIUS);
      g.lineStyle(1, 0xca72ff, 0.75);
      g.lineBetween(0, 282, VIEW_W, 282);
    }

    update(_time, delta) {
      const dt = Math.min(delta / 1000, 0.05);
      const pad = this.readPad();
      let x = pad.x, y = pad.y;
      if (this.keys.left.isDown || this.keys.arrowLeft.isDown) x -= 1;
      if (this.keys.right.isDown || this.keys.arrowRight.isDown) x += 1;
      if (this.keys.up.isDown || this.keys.arrowUp.isDown) y -= 1;
      if (this.keys.down.isDown || this.keys.arrowDown.isDown) y += 1;

      const len = Math.hypot(x, y);
      this.moving = len > 0.01;

      if (this.moving) {
        x /= len; y /= len;
        const speed = 175;
        const result = RagbiaMicrotestCollisionV2.move(this.player.x, this.player.y, x * speed * dt, y * speed * dt);
        this.player.x = result.x; this.player.y = result.y;
        this.lastHit = result.hit || null;
        this.walkT += dt * 6.5;
        if (Math.abs(x) > Math.abs(y)) this.dir = x < 0 ? 'left' : 'right';
        else this.dir = y < 0 ? 'up' : 'down';
      } else {
        this.lastHit = null;
      }

      const frame = Math.floor(this.walkT) % 3;
      const tex = this.moving ? `apprentice-${this.dir}-walk-${frame}` : `apprentice-${this.dir}-idle`;
      if (this.player.texture.key !== tex) this.player.setTexture(tex);
      this.player.setDepth(this.playerFootY());

      if (this.debugMode) this.renderDebug();
      if (this.debugLabel) {
        if (this.debugMode) {
          const hit = this.lastHit ? `\nHIT ${this.lastHit.id}` : '';
          this.debugLabel.setText(`DESENHADO DO ZERO\nDEBUG ON\nFOOT ${Math.round(this.playerFootY())}${hit}`);
          this.debugLabel.setColor('#ffd36a');
        } else {
          this.debugLabel.setText('DESENHADO DO ZERO\nDEBUG OFF');
          this.debugLabel.setColor('#93a091');
        }
      }
    }
  }

  const config = {
    type: Phaser.CANVAS,
    parent: 'game-root',
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#0f1410',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIEW_W,
      height: VIEW_H
    },
    scene: MicrotestNorthWallSceneV2
  };

  let gameInstance = null;

  function startSession(rawName) {
    if (gameInstance) return gameInstance;
    const state = RagbiaPlayerStateV0.create(rawName);
    const validation = RagbiaPlayerStateV0.validate(state);
    if (!validation.ok) throw new Error(`Estado inicial inválido: ${validation.errors.join(' | ')}`);
    window.RagbiaPlayerSession = state;
    const start = document.getElementById('start-screen');
    if (start) {
      start.classList.remove('ready');
      start.setAttribute('aria-hidden', 'true');
    }
    gameInstance = new Phaser.Game(config);
    return gameInstance;
  }

  function setupStartScreen() {
    const screen = document.getElementById('start-screen');
    const input = document.getElementById('character-name');
    const button = document.getElementById('play-button');
    const error = document.getElementById('start-error');
    if (!screen || !input || !button || !error) throw new Error('Tela inicial do microteste incompleta.');

    const submit = () => {
      error.textContent = '';
      try { startSession(input.value); }
      catch (err) { error.textContent = err && err.message ? err.message : String(err); input.focus(); }
    };

    button.addEventListener('click', submit);
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); submit(); } });

    screen.classList.add('ready');
    screen.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 0);
    if (window.RagbiaBoot) window.RagbiaBoot.ready('M002.2B.0.2 — tela pronta');
  }

  setupStartScreen();
})();
