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
    }

    preload() {
      this.load.image('house-art-v1', 'assets/house_avo_pixel_v1.png');
    }

    create() {
      this.playerSession = window.RagbiaPlayerSession || null;
      if (!this.playerSession) throw new Error('M002.2A.1 exige sessão de personagem criada pela tela inicial.');

      this.cameras.main.setBackgroundColor('#10150f');
      this.buildTextures();
      this.buildHouseVisual();

      const spawn = RagbiaHouseCollisionV1.spawn;
      this.player = this.add.image(spawn.x, spawn.y, 'apprentice-up-idle');
      this.player.setOrigin(0.5, 92 / 128);
      this.player.setDepth(this.player.y);

      this.collisionGraphics = this.add.graphics().setDepth(3000).setVisible(false);
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

      const cam = this.cameras.main;
      cam.setBounds(0, 0, VIEW_W, VIEW_H);
      cam.roundPixels = true;

      this.buildHud();

      const collisionTest = RagbiaHouseCollisionV1.selfTest();
      if (!collisionTest.ok) throw new Error(`Autoteste M002.2A.1 falhou: ${collisionTest.errors.join(' | ')}`);
      const spawnTest = RagbiaHouseCollisionV1.collidesAnchor(this.player.x, this.player.y);
      if (spawnTest.hit) throw new Error(`Spawn M002.2A.1 inválido: ${spawnTest.shape && spawnTest.shape.id}`);

      if (window.RagbiaBoot) window.RagbiaBoot.ok('Ragbia Pixel M002.2A.1 — Pixelado Melhorado carregado');
    }

    buildTextures() {
      for (const dir of DIRS) {
        this.textures.addCanvas(`apprentice-${dir}-idle`, RagbiaApprenticeArtV0.render(dir, 0, false));
        for (let f = 0; f < 3; f++) this.textures.addCanvas(`apprentice-${dir}-walk-${f}`, RagbiaApprenticeArtV0.render(dir, f, true));
      }
    }

    buildHouseVisual() {
      this.houseBackground = this.add.image(0, 0, 'house-art-v1').setOrigin(0, 0).setDepth(0);

      // Prova de depth layering: recortes da própria arte retornam à frente do personagem
      // quando seus pés estão ao norte do objeto. Isso mantém a lógica 2D e cria leitura pseudo-2.5D.
      const source = this.textures.get('house-art-v1').getSourceImage();
      this.occluders = [
        this.createOccluder(source, 'occ-table', 690, 470, 480, 285, 650),
        this.createOccluder(source, 'occ-desk', 300, 675, 365, 205, 810),
        this.createOccluder(source, 'occ-rack', 1360, 555, 270, 275, 745)
      ];
    }

    createOccluder(source, key, x, y, w, h, depth) {
      const canvas = document.createElement('canvas');
      canvas.width = VIEW_W; canvas.height = VIEW_H;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(source, x, y, w, h, x, y, w, h);
      this.textures.addCanvas(key, canvas);
      return this.add.image(0, 0, key).setOrigin(0, 0).setDepth(depth);
    }

    buildHud() {
      const hud = this.add.graphics().setDepth(4000).setScrollFactor(0);
      hud.fillStyle(0x07100d, 0.76).fillRoundedRect(18, 18, 540, 96, 8);
      hud.lineStyle(2, 0x728a69, 0.72).strokeRoundedRect(18, 18, 540, 96, 8);
      hud.fillStyle(0x07100d, 0.72).fillRoundedRect(18, VIEW_H - 66, 900, 48, 7);

      this.add.text(38, 32, 'Casa do Avô — M002.2A.1', {
        fontFamily: 'Consolas, monospace', fontSize: '24px', color: '#f4f0dc', fontStyle: 'bold'
      }).setDepth(4001).setScrollFactor(0);
      this.add.text(38, 69, `${this.playerSession.name} — ${this.playerSession.className}`, {
        fontFamily: 'Consolas, monospace', fontSize: '19px', color: '#b9cfad'
      }).setDepth(4001).setScrollFactor(0);
      this.add.text(38, VIEW_H - 54, 'Mover: WASD/Setas/analógico    F: Tela cheia    C: Colisão/Depth técnico', {
        fontFamily: 'Consolas, monospace', fontSize: '17px', color: '#d9e3d6'
      }).setDepth(4001).setScrollFactor(0);
      this.debugLabel = this.add.text(VIEW_W - 28, 26, 'M002.2A.1\nDEBUG OFF', {
        fontFamily: 'Consolas, monospace', fontSize: '17px', color: '#a0aaa0', align: 'right'
      }).setOrigin(1, 0).setDepth(4001).setScrollFactor(0);
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
      g.lineStyle(3, 0xffcf5b, .88);
      for (const s of RagbiaHouseCollisionV1.shapes) g.strokeRect(s.x, s.y, s.w, s.h);
      g.lineStyle(3, 0x63d4ff, .95);
      for (const z of RagbiaHouseCollisionV1.interactionZones) g.strokeRect(z.x, z.y, z.w, z.h);
      const fy = this.player.y + RagbiaHouseCollisionV1.PLAYER_FOOT_OFFSET_Y;
      g.lineStyle(3, 0x74e6ff, .95);
      g.strokeCircle(this.player.x, fy, RagbiaHouseCollisionV1.PLAYER_RADIUS);

      // Linhas dos três depth thresholds testados.
      g.lineStyle(2, 0xd774ff, .66);
      for (const y of [650, 745, 810]) g.lineBetween(0, y, VIEW_W, y);
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
        const speed = 250;
        const result = RagbiaHouseCollisionV1.move(this.player.x, this.player.y, x * speed * dt, y * speed * dt);
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

      // Depth pelo footprint: quanto mais ao sul, mais à frente.
      this.player.setDepth(this.player.y);

      if (this.debugMode) this.renderCollisionDebug();
      if (this.debugLabel) {
        if (!this.debugMode) {
          this.debugLabel.setText('M002.2A.1\nDEBUG OFF');
          this.debugLabel.setColor('#a0aaa0');
        } else {
          const nearRack = RagbiaHouseCollisionV1.zoneContains(RagbiaHouseCollisionV1.interactionZones[0], this.player.x, this.player.y);
          const hit = this.lastHit ? `\nHIT ${this.lastHit.id}` : '';
          this.debugLabel.setText(`M002.2A.1\nDEBUG ON\nDEPTH ${Math.round(this.player.y)}${hit}${nearRack ? '\nRACK ZONE' : ''}`);
          this.debugLabel.setColor('#ffd36a');
        }
      }
    }
  }

  const config = {
    type: Phaser.CANVAS,
    parent: 'game-root',
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#10150f',
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
    if (window.RagbiaBoot) window.RagbiaBoot.ready('Ragbia Pixel M002.2A.1 — tela inicial pronta');
  }

  window.RagbiaM002 = { startSession };
  setupStartScreen();
})();
