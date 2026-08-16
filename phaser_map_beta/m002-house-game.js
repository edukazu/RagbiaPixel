(() => {
  'use strict';

  const VIEW_W = 1920;
  const VIEW_H = 1080;
  const DIRS = ['down', 'up', 'left', 'right'];

  class HouseScene extends Phaser.Scene {
    constructor() {
      super('m002-house');
      this.dir = 'up';
      this.walkT = 0;
      this.moving = false;
      this.debugMode = false;
      this.lastHit = null;
      this.prevPadB = false;
    }

    create() {
      this.playerSession = window.RagbiaPlayerSession || null;
      if (!this.playerSession) throw new Error('M002.2 exige sessão de personagem criada pela tela inicial.');

      this.cameras.main.setBackgroundColor('#15251a');
      this.buildTextures();
      this.houseMap = RagbiaHouseMapV0.create(this);

      this.player = this.add.image(RagbiaHouseMapV0.spawn.x, RagbiaHouseMapV0.spawn.y, 'apprentice-up-idle');
      this.player.setOrigin(0.5, 92 / 128);
      this.player.setDepth(30);

      this.collisionGraphics = this.add.graphics().setDepth(900).setVisible(false);
      this.keys = this.input.keyboard.addKeys({
        up: 'W', down: 'S', left: 'A', right: 'D',
        arrowUp: 'UP', arrowDown: 'DOWN', arrowLeft: 'LEFT', arrowRight: 'RIGHT',
        fullscreen: 'F', debug: 'C'
      });
      this.input.keyboard.on('keydown-F', () => this.scale.toggleFullscreen());
      this.input.keyboard.on('keydown-C', () => {
        this.debugMode = !this.debugMode;
        this.collisionGraphics.setVisible(this.debugMode);
        if (!this.debugMode) this.collisionGraphics.clear();
      });

      // A casa inteira cabe na viewport; câmera ainda usa limites reais da área.
      const cam = this.cameras.main;
      cam.setBounds(0, 0, RagbiaHouseMapV0.WORLD_W, RagbiaHouseMapV0.WORLD_H);
      cam.roundPixels = true;

      this.buildHud();

      const collisionTest = RagbiaHouseCollisionV0.selfTest();
      if (!collisionTest.ok) throw new Error(`Autoteste Casa do Avô falhou: ${collisionTest.errors.join(' | ')}`);
      const spawnTest = RagbiaHouseCollisionV0.collidesAnchor(this.player.x, this.player.y);
      if (spawnTest.hit) throw new Error(`Spawn da Casa do Avô inválido: ${spawnTest.shape && spawnTest.shape.id}`);

      if (window.RagbiaBoot) window.RagbiaBoot.ok('Ragbia Pixel M002.2 — Casa do Avô carregada');
    }

    buildTextures() {
      for (const dir of DIRS) {
        this.textures.addCanvas(`apprentice-${dir}-idle`, RagbiaApprenticeArtV0.render(dir, 0, false));
        for (let f = 0; f < 3; f++) this.textures.addCanvas(`apprentice-${dir}-walk-${f}`, RagbiaApprenticeArtV0.render(dir, f, true));
      }
    }

    buildHud() {
      const hud = this.add.graphics().setDepth(1000).setScrollFactor(0);
      hud.fillStyle(0x07100d, 0.82).fillRect(18, 18, 760, 112);
      hud.lineStyle(3, 0x6f9475, 0.78).strokeRect(18, 18, 760, 112);
      hud.fillStyle(0x07100d, 0.78).fillRect(18, VIEW_H - 82, VIEW_W - 36, 64);

      this.add.text(42, 34, 'Casa do Avô — M002.2', {
        fontFamily: 'Consolas, monospace', fontSize: '27px', color: '#f4f3df', fontStyle: 'bold'
      }).setDepth(1001).setScrollFactor(0);
      this.add.text(42, 72, `${this.playerSession.name} — ${this.playerSession.className}`, {
        fontFamily: 'Consolas, monospace', fontSize: '21px', color: '#bcd3b8'
      }).setDepth(1001).setScrollFactor(0);
      this.add.text(42, VIEW_H - 61, 'Mover: WASD/Setas/analógico   F: Tela cheia   C: Colisão técnica', {
        fontFamily: 'Consolas, monospace', fontSize: '20px', color: '#d9e3d6'
      }).setDepth(1001).setScrollFactor(0);
      this.debugLabel = this.add.text(VIEW_W - 42, 34, 'M002.2\nDEBUG OFF', {
        fontFamily: 'Consolas, monospace', fontSize: '19px', color: '#8ea096', align: 'right'
      }).setOrigin(1, 0).setDepth(1001).setScrollFactor(0);
    }

    readPad() {
      let x = 0, y = 0;
      if (navigator.getGamepads) {
        const gp = Array.from(navigator.getGamepads() || []).find(Boolean);
        if (gp) {
          const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
          if (Math.abs(ax) > .18) x = ax;
          if (Math.abs(ay) > .18) y = ay;
          if (gp.buttons[14]?.pressed) x -= 1;
          if (gp.buttons[15]?.pressed) x += 1;
          if (gp.buttons[12]?.pressed) y -= 1;
          if (gp.buttons[13]?.pressed) y += 1;
        }
      }
      return { x, y };
    }

    renderCollisionDebug() {
      if (!this.debugMode) return;
      const g = this.collisionGraphics;
      g.clear();
      g.lineStyle(3, 0xffcf5b, .9);
      for (const s of RagbiaHouseCollisionV0.shapes) {
        if (s.type === 'rect') g.strokeRect(s.x, s.y, s.w, s.h);
      }
      const fy = this.player.y + RagbiaHouseCollisionV0.PLAYER_FOOT_OFFSET_Y;
      g.lineStyle(3, 0x74e6ff, .95);
      g.strokeCircle(this.player.x, fy, RagbiaHouseCollisionV0.PLAYER_RADIUS);
      if (this.lastHit) {
        this.debugLabel.setText(`M002.2\nDEBUG ON\n${this.lastHit.id}`);
      } else {
        this.debugLabel.setText('M002.2\nDEBUG ON');
      }
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
        const speed = 270;
        const result = RagbiaHouseCollisionV0.move(this.player.x, this.player.y, x * speed * dt, y * speed * dt);
        this.player.x = result.x; this.player.y = result.y;
        this.lastHit = result.hit || null;
        this.walkT += dt * 7;
        if (Math.abs(x) > Math.abs(y)) this.dir = x < 0 ? 'left' : 'right';
        else this.dir = y < 0 ? 'up' : 'down';
      } else {
        this.lastHit = null;
      }

      const frame = Math.floor(this.walkT) % 3;
      const tex = this.moving ? `apprentice-${this.dir}-walk-${frame}` : `apprentice-${this.dir}-idle`;
      if (this.player.texture.key !== tex) this.player.setTexture(tex);

      if (this.debugMode) this.renderCollisionDebug();
      if (this.debugLabel) {
        if (!this.debugMode) {
          this.debugLabel.setText('M002.2\nDEBUG OFF');
          this.debugLabel.setColor('#8ea096');
        } else this.debugLabel.setColor('#ffd36a');
      }
    }
  }

  const config = {
    type: Phaser.CANVAS,
    parent: 'game-root',
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#15251a',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIEW_W,
      height: VIEW_H
    },
    scene: HouseScene
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
    if (!screen || !input || !button || !error) throw new Error('Tela inicial M002 incompleta no DOM.');
    const submit = () => {
      error.textContent = '';
      try { startSession(input.value); }
      catch (err) { error.textContent = err && err.message ? err.message : String(err); input.focus(); }
    };
    button.addEventListener('click', submit);
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') { ev.preventDefault(); submit(); }
    });
    screen.classList.add('ready');
    screen.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 0);
    if (window.RagbiaBoot) window.RagbiaBoot.ready('Ragbia Pixel M002.2 — tela inicial pronta');
  }

  window.RagbiaM002 = { startSession };
  setupStartScreen();
})();
