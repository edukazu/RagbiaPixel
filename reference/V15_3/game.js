(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = false;

  const W = 1920;
  const H = 1080;
  const HEADER_H = 92;
  const HUD_H = 196;
  const FIELD = { x: 12, y: HEADER_H, w: W - 24, h: H - HEADER_H - HUD_H };

  const keys = new Set();
  const justPressed = new Set();
  const gpPrev = { attack: false, lb: false, rb: false };
  let connectedPad = '';
  let gameTime = 0;
  let hitStop = 0;
  let shakeT = 0;
  let shakeMag = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  addEventListener('keydown', e => {
    if (!keys.has(e.code)) justPressed.add(e.code);
    keys.add(e.code);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) {
      e.preventDefault();
    }
  });
  addEventListener('keyup', e => keys.delete(e.code));
  addEventListener('blur', () => { keys.clear(); justPressed.clear(); });
  addEventListener('gamepadconnected', e => { connectedPad = e.gamepad.id || 'Gamepad'; });
  addEventListener('gamepaddisconnected', () => { connectedPad = ''; });
  canvas.addEventListener('click', () => canvas.focus());
  canvas.focus();

  function seededRandom(seed) {
    let s = seed >>> 0;
    return () => {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = seededRandom(0x52414742);
  const rnd = (a, b) => a + rand() * (b - a);

  const vegetation = [];
  const stones = [];
  const flowers = [];
  const groundSpecks = [];
  const roadSpecks = [];
  for (let i = 0; i < 220; i++) {
    vegetation.push({ x: rnd(FIELD.x + 22, FIELD.x + FIELD.w - 22), y: rnd(FIELD.y + 24, FIELD.y + FIELD.h - 20), t: (rand() * 4) | 0 });
  }
  for (let i = 0; i < 42; i++) {
    stones.push({ x: rnd(FIELD.x + 30, FIELD.x + FIELD.w - 30), y: rnd(FIELD.y + 25, FIELD.y + FIELD.h - 25), s: rand() < .25 ? 1.4 : 1 });
  }
  for (let i = 0; i < 44; i++) {
    flowers.push({ x: rnd(FIELD.x + 30, FIELD.x + FIELD.w - 30), y: rnd(FIELD.y + 25, FIELD.y + FIELD.h - 25), yellow: rand() < .45 });
  }
  for (let i = 0; i < 780; i++) {
    groundSpecks.push({
      x: rnd(FIELD.x + 8, FIELD.x + FIELD.w - 8),
      y: rnd(FIELD.y + 8, FIELD.y + FIELD.h - 8),
      t: (rand() * 4) | 0,
      w: rand() < .82 ? 3 : 5,
    });
  }
  for (let i = 0; i < 210; i++) {
    roadSpecks.push({
      x: rnd(FIELD.x + 8, FIELD.x + FIELD.w - 8),
      y: rnd(0, 98),
      t: (rand() * 4) | 0,
      w: rand() < .75 ? 4 : 7,
    });
  }

  const bushes = [
    [54, 135], [182, 338], [1735, 130], [1810, 350], [72, 765], [1760, 750],
    [1480, 170], [360, 700]
  ].map(([x, y], i) => ({ x, y, i }));

  const player = {
    x: W * 0.48,
    y: FIELD.y + FIELD.h * 0.61,
    dir: 'down',
    moving: false,
    walkT: 0,
    attackT: 0,
    cooldown: 0,
    classId: 'warrior',
    classFlash: 0,
    speed: 300,
    stepDustT: 0,
  };

  const slimeSpawns = [
    [380, 245], [720, 350], [1220, 270], [1530, 390],
    [500, 650], [1090, 650], [1580, 700], [1320, 520], [250, 490]
  ];
  const slimes = slimeSpawns.map(([x, y], i) => ({
    x, y, homeX: x, homeY: y, hp: 3, maxHp: 3, deadT: 0,
    flash: 0, vx: 0, vy: 0, bob: rnd(0, 10), id: i
  }));

  const projectiles = [];
  const damageNumbers = [];
  const particles = [];
  let slashEffect = null;
  let swordSwing = null;
  let bowShot = null;

  function addShake(mag, time = 0.12) {
    shakeMag = Math.max(shakeMag, mag);
    shakeT = Math.max(shakeT, time);
  }

  function spawnParticle(x, y, vx, vy, life, color, size = 6, gravity = 0) {
    particles.push({ x, y, vx, vy, life, maxLife: life, color, size, gravity });
  }

  function spawnDust(x, y, dir = 0) {
    const colors = ['#b89d67', '#9e8758', '#c9b07a'];
    for (let i = 0; i < 4; i++) {
      const a = dir + (i - 1.5) * 0.45;
      const sp = 30 + i * 8;
      spawnParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp - 8, 0.28 + i * 0.03, colors[i % colors.length], 5 + (i % 2), 20);
    }
  }

  function spawnImpact(x, y, color = '#ffd96a', strong = false) {
    for (let i = 0; i < (strong ? 12 : 7); i++) {
      const a = (Math.PI * 2 * i) / (strong ? 12 : 7) + (i % 2) * 0.15;
      const sp = strong ? 150 - i * 4 : 110 - i * 5;
      spawnParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp, strong ? 0.32 : 0.24, color, strong ? 6 : 5, 30);
    }
  }

  function spawnLeafBits(x, y) {
    const cols = ['#5e8d45', '#7eaa58', '#4c7738'];
    for (let i = 0; i < 5; i++) {
      const a = -1.5 + i * 0.7;
      const sp = 25 + i * 8;
      spawnParticle(x, y, Math.cos(a) * sp, Math.sin(a) * sp - 10, 0.45, cols[i % cols.length], 4, 18);
    }
  }

  function currentGamepad() {
    if (!navigator.getGamepads) return null;
    const pads = navigator.getGamepads();
    const gp = pads ? Array.from(pads).find(Boolean) : null;
    if (gp) connectedPad = gp.id || 'Gamepad';
    return gp || null;
  }

  function readInput() {
    let x = 0, y = 0;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
    if (keys.has('KeyW') || keys.has('ArrowUp')) y -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) y += 1;

    let attackDown = false, lbDown = false, rbDown = false;
    const gp = currentGamepad();
    if (gp) {
      let gx = 0, gy = 0;
      const ax = gp.axes[0] || 0;
      const ay = gp.axes[1] || 0;
      if (Math.abs(ax) > .18) gx = ax;
      if (Math.abs(ay) > .18) gy = ay;
      if (gp.buttons[14]?.pressed) gx -= 1;
      if (gp.buttons[15]?.pressed) gx += 1;
      if (gp.buttons[12]?.pressed) gy -= 1;
      if (gp.buttons[13]?.pressed) gy += 1;
      if (Math.hypot(gx, gy) > Math.hypot(x, y)) { x = gx; y = gy; }

      attackDown = !!(gp.buttons[0]?.pressed || gp.buttons[2]?.pressed || (gp.buttons[7]?.value || 0) > .55);
      lbDown = !!gp.buttons[4]?.pressed;
      rbDown = !!gp.buttons[5]?.pressed;
    }

    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }

    const attackPressed = ['Space', 'KeyJ', 'KeyX'].some(k => justPressed.has(k)) || (attackDown && !gpPrev.attack);
    const nextPressed = justPressed.has('Tab') || justPressed.has('KeyE') || (rbDown && !gpPrev.rb);
    const prevPressed = justPressed.has('KeyQ') || (lbDown && !gpPrev.lb);
    const fullscreenPressed = justPressed.has('KeyF');

    gpPrev.attack = attackDown;
    gpPrev.lb = lbDown;
    gpPrev.rb = rbDown;

    return { x, y, attackPressed, nextPressed, prevPressed, fullscreenPressed };
  }

  function toggleClass() {
    player.classId = player.classId === 'warrior' ? 'archer' : 'warrior';
    player.classFlash = .28;
    player.attackT = 0;
    player.cooldown = Math.min(player.cooldown, .12);
    player.stepDustT = 0;
    addShake(2, 0.08);
  }

  function startAttack() {
    if (player.cooldown > 0 || player.attackT > 0 || swordSwing || slashEffect || bowShot) return;
    if (player.classId === 'warrior') {
      player.attackT = .28;
      player.cooldown = .46;
      addShake(2.2, 0.06);
      hitWithSword();
    } else {
      player.attackT = .34;
      player.cooldown = .56;
      addShake(1.4, 0.05);
      startBowShot();
    }
  }

  function attackMoment() {
    // O ataque agora resolve no disparo do input; mantido apenas por compatibilidade.
  }

  function dirVector(dir = player.dir) {
    return ({ left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] })[dir];
  }

  function damageSlime(s, dmg, kx, ky) {
    if (s.deadT > 0) return;
    s.hp -= dmg;
    s.flash = .14;
    s.vx += kx;
    s.vy += ky;
    damageNumbers.push({ x: s.x, y: s.y - 25, value: dmg, t: .62 });
    const killed = s.hp <= 0;
    spawnImpact(s.x, s.y - 4, killed ? '#fff2a8' : '#ffd96a', killed);
    addShake(killed ? 8 : 4, killed ? 0.16 : 0.11);
    hitStop = Math.max(hitStop, killed ? 0.06 : 0.035);
    if (killed) {
      s.deadT = 3.1;
      s.vx += kx * .7;
      s.vy += ky * .7;
      spawnLeafBits(s.x, s.y + 4);
    }
  }

  function hitWithSword() {
    const [dx, dy] = dirVector();
    slashEffect = { x: player.x, y: player.y, dir: player.dir, t: 0.34, maxT: 0.34, layer: player.dir === 'up' ? 'behind' : 'front' };
    swordSwing = { x: player.x, y: player.y, dir: player.dir, t: 0.38, maxT: 0.38, layer: player.dir === 'up' ? 'behind' : 'front' };

    let cx = player.x, cy = player.y, rx = 88, ry = 72;
    if (player.dir === 'down') cy += 34;
    else if (player.dir === 'up') cy -= 26;
    else if (player.dir === 'right') { cx += 42; cy += 3; rx = 70; ry = 88; }
    else if (player.dir === 'left') { cx -= 42; cy += 3; rx = 70; ry = 88; }

    spawnDust(cx - dx * 10, cy + 8, Math.atan2(dy, dx) + Math.PI * 0.5);

    for (const s of slimes) {
      if (s.deadT > 0) continue;
      const ox = s.x - cx;
      const oy = s.y - cy;
      if ((ox * ox) / (rx * rx) + (oy * oy) / (ry * ry) > 1.0) continue;
      if (player.dir === 'down' && s.y < player.y - 4) continue;
      if (player.dir === 'up' && s.y > player.y + 8) continue;
      if (player.dir === 'right' && s.x < player.x - 4) continue;
      if (player.dir === 'left' && s.x > player.x + 4) continue;
      damageSlime(s, 1, dx * 230, dy * 230);
    }
  }

  function startBowShot() {
    bowShot = {
      x: player.x,
      y: player.y,
      dir: player.dir,
      t: 0.36,
      maxT: 0.36,
      released: false,
      releaseAt: 0.54,
      layer: player.dir === 'up' ? 'behind' : 'front'
    };
  }

  function releaseArrowFromBow(shot) {
    const [dx, dy] = dirVector(shot.dir);
    let sx = shot.x, sy = shot.y - 10;
    if (shot.dir === 'down') {
      sx += 0; sy += 8;
    } else if (shot.dir === 'up') {
      sx += 0; sy -= 28;
    } else if (shot.dir === 'right') {
      sx += 28; sy -= 6;
    } else {
      sx -= 28; sy -= 6;
    }
    projectiles.push({
      x: sx,
      y: sy,
      vx: dx * 840,
      vy: dy * 840,
      dir: shot.dir,
      life: 1.45,
      hit: false,
      trailT: 0,
    });
    spawnParticle(sx, sy, -dx * 35, -dy * 35, 0.14, '#efe5ba', 4, 0);
    spawnParticle(sx, sy, -dx * 20, -dy * 20, 0.10, '#d6b55a', 5, 0);
    addShake(2.1, 0.05);
  }

  function tryFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }

  let priorAttackT = 0;
  function update(dt) {
    gameTime += dt;
    const inp = readInput();

    if (inp.fullscreenPressed) tryFullscreen();
    if (shakeT > 0) {
      shakeT = Math.max(0, shakeT - dt);
      if (shakeT === 0) shakeMag = 0;
    }
    if (hitStop > 0) {
      hitStop = Math.max(0, hitStop - dt);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt * 0.7;
        p.x += p.vx * dt * 0.3; p.y += p.vy * dt * 0.3;
        p.vy += p.gravity * dt * 0.3;
        if (p.life <= 0) particles.splice(i, 1);
      }
      if (slashEffect) {
        slashEffect.x = player.x;
        slashEffect.y = player.y;
        slashEffect.t -= dt;
        if (slashEffect.t <= 0) slashEffect = null;
      }
      if (swordSwing) {
        swordSwing.x = player.x;
        swordSwing.y = player.y;
        swordSwing.t -= dt;
        if (swordSwing.t <= 0) swordSwing = null;
      }
      if (bowShot) {
        bowShot.x = player.x;
        bowShot.y = player.y;
        const progress = 1 - clamp(bowShot.t / bowShot.maxT, 0, 1);
        if (!bowShot.released && progress >= bowShot.releaseAt) {
          bowShot.released = true;
          releaseArrowFromBow(bowShot);
        }
        bowShot.t -= dt;
        if (bowShot.t <= 0) bowShot = null;
      }
      justPressed.clear();
      return;
    }
    if (inp.nextPressed || inp.prevPressed) toggleClass();
    if (inp.attackPressed) startAttack();

    player.cooldown = Math.max(0, player.cooldown - dt);
    player.classFlash = Math.max(0, player.classFlash - dt);
    priorAttackT = player.attackT;
    player.attackT = Math.max(0, player.attackT - dt);

    const attacking = player.attackT > 0.02;
    const moveMul = 1;
    player.x += inp.x * player.speed * moveMul * dt;
    player.y += inp.y * player.speed * moveMul * dt;
    player.x = clamp(player.x, FIELD.x + 38, FIELD.x + FIELD.w - 38);
    player.y = clamp(player.y, FIELD.y + 55, FIELD.y + FIELD.h - 42);

    player.moving = Math.hypot(inp.x, inp.y) > .12;
    if (player.moving) {
      player.walkT += dt * 7.0;
      player.stepDustT += dt;
      if (Math.abs(inp.x) > Math.abs(inp.y)) player.dir = inp.x < 0 ? 'left' : 'right';
      else player.dir = inp.y < 0 ? 'up' : 'down';
      if (player.stepDustT >= 0.14 && !attacking) {
        player.stepDustT = 0;
        spawnDust(player.x, player.y + 30, Math.atan2(inp.y, inp.x) + Math.PI);
      }
    } else {
      player.stepDustT = 0;
    }

    for (const s of slimes) {
      s.bob += dt * 2.5;
      s.flash = Math.max(0, s.flash - dt);
      if (s.deadT > 0) {
        s.deadT -= dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        s.vx *= Math.pow(.015, dt); s.vy *= Math.pow(.015, dt);
        if (s.deadT <= 0) {
          s.x = s.homeX; s.y = s.homeY; s.hp = s.maxHp;
          s.vx = 0; s.vy = 0; s.flash = 0;
        }
      } else {
        s.x += s.vx * dt; s.y += s.vy * dt;
        s.vx *= Math.pow(.02, dt); s.vy *= Math.pow(.02, dt);
        s.x += Math.sin(s.bob * .55 + s.id) * 3.8 * dt;
        s.y += Math.cos(s.bob * .47 + s.id) * 2.2 * dt;
        s.x = lerp(s.x, s.homeX, dt * .32);
        s.y = lerp(s.y, s.homeY, dt * .32);
      }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.life -= dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.trailT -= dt;
      if (p.trailT <= 0) {
        p.trailT = 0.03;
        spawnParticle(p.x, p.y, -p.vx * 0.05, -p.vy * 0.05, 0.12, '#efe5ba', 4, 0);
      }
      if (!p.hit) {
        for (const s of slimes) {
          if (s.deadT > 0) continue;
          const dx = s.x - p.x, dy = s.y - p.y;
          if (dx * dx + dy * dy < 34 * 34) {
            p.hit = true;
            const len = Math.hypot(p.vx, p.vy) || 1;
            damageSlime(s, 1, (p.vx / len) * 185, (p.vy / len) * 185);
            break;
          }
        }
      }
      if (p.life <= 0 || p.hit || p.x < FIELD.x || p.x > FIELD.x + FIELD.w || p.y < FIELD.y || p.y > FIELD.y + FIELD.h) {
        if (!p.hit) spawnParticle(p.x, p.y, 0, 0, 0.08, '#efe5ba', 4, 0);
        projectiles.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.vx *= Math.pow(0.08, dt);
      if (p.life <= 0) particles.splice(i, 1);
    }

    if (slashEffect) {
      // Mantém o golpe ancorado ao personagem durante a animação.
      slashEffect.x = player.x;
      slashEffect.y = player.y;
      slashEffect.t -= dt;
      if (slashEffect.t <= 0) slashEffect = null;
    }
    if (swordSwing) {
      // Mantém a espada acompanhando o personagem durante todo o arco.
      swordSwing.x = player.x;
      swordSwing.y = player.y;
      swordSwing.t -= dt;
      if (swordSwing.t <= 0) swordSwing = null;
    }
    if (bowShot) {
      bowShot.x = player.x;
      bowShot.y = player.y;
      const progress = 1 - clamp(bowShot.t / bowShot.maxT, 0, 1);
      if (!bowShot.released && progress >= bowShot.releaseAt) {
        bowShot.released = true;
        releaseArrowFromBow(bowShot);
      }
      bowShot.t -= dt;
      if (bowShot.t <= 0) bowShot = null;
    }

    for (let i = damageNumbers.length - 1; i >= 0; i--) {
      const d = damageNumbers[i];
      d.t -= dt; d.y -= 40 * dt;
      if (d.t <= 0) damageNumbers.splice(i, 1);
    }

    justPressed.clear();
  }

  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function borderPanel(x, y, w, h, fill = '#0d1718', border = '#52615c') {
    rect(x, y, w, h, '#05090a');
    rect(x + 3, y + 3, w - 6, h - 6, border);
    rect(x + 6, y + 6, w - 12, h - 12, fill);
    rect(x + 13, y + 13, 5, 5, '#708078');
    rect(x + w - 18, y + 13, 5, 5, '#708078');
    rect(x + 13, y + h - 18, 5, 5, '#708078');
    rect(x + w - 18, y + h - 18, 5, 5, '#708078');
  }

  function text(str, x, y, size = 28, color = '#f1f3ef', align = 'left', weight = '700') {
    ctx.font = `${weight} ${size}px Consolas, "Courier New", monospace`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000aa';
    ctx.fillText(str, x + 2, y + 2);
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  }

  function drawHeader() {
    rect(0, 0, W, HEADER_H, '#0a1113');
    borderPanel(8, 8, 690, 74, '#0c1517', '#44534e');
    drawSwordIcon(35, 46, 1.3);
    text('Ragbia — Mini Protótipo Pixel', 92, 46, 32, '#f5f7f3');

    borderPanel(1290, 8, 622, 74, '#0c1517', '#44534e');
    drawShieldIcon(1324, 46, 1.2);
    text('Classe Atual:', 1378, 46, 31, '#f5f7f3');
    text(player.classId === 'warrior' ? 'Guerreiro' : 'Arqueiro', 1640, 46, 31, player.classId === 'warrior' ? '#ffd84a' : '#8fd96b');
  }

  function drawField() {
    rect(FIELD.x, FIELD.y, FIELD.w, FIELD.h, '#2f5d35');
    rect(FIELD.x + 5, FIELD.y + 5, FIELD.w - 10, FIELD.h - 10, '#477a3e');

    // textura pixelada de base: irregularidade suficiente para aproximar a prévia
    const grassCols = ['#3f733a', '#568745', '#386a36', '#66924b'];
    for (const g of groundSpecks) {
      rect(g.x, g.y, g.w, g.t === 3 ? 3 : 2, grassCols[g.t]);
      if (g.t === 3) rect(g.x + 4, g.y - 3, 2, 5, '#315f31');
    }

    // manchas suaves em blocos, ainda usando apenas pixels/retângulos
    for (let y = FIELD.y + 20; y < FIELD.y + FIELD.h; y += 82) {
      const off = ((y / 82) | 0) % 2 ? 30 : 0;
      for (let x = FIELD.x + 18 + off; x < FIELD.x + FIELD.w - 30; x += 140) {
        rect(x, y, 42, 5, '#4d8241');
        rect(x + 12, y + 6, 25, 3, '#3f7439');
      }
    }

    // estrada horizontal central
    const roadY = FIELD.y + 365;
    rect(FIELD.x + 5, roadY - 8, FIELD.w - 10, 132, '#5b673e');
    rect(FIELD.x + 5, roadY, FIELD.w - 10, 116, '#9a8152');
    rect(FIELD.x + 5, roadY + 9, FIELD.w - 10, 98, '#a58b5b');
    for (const r of roadSpecks) {
      const rc = ['#8c744d', '#b59b68', '#796445', '#c0a673'][r.t];
      rect(r.x, roadY + 9 + r.y, r.w, r.t === 2 ? 3 : 2, rc);
    }
    for (let x = FIELD.x + 35; x < FIELD.x + FIELD.w - 30; x += 84) {
      const d = ((x / 84) | 0) % 3;
      rect(x, roadY + 22 + d * 18, 18, 8, '#806c48');
      if (d !== 1) rect(x + 35, roadY + 76 - d * 8, 10, 6, '#b59a68');
    }
    // bordas orgânicas da estrada
    for (let x = FIELD.x + 18; x < FIELD.x + FIELD.w - 18; x += 38) {
      const n = ((x / 38) | 0) % 3;
      rect(x, roadY - 7 - n * 2, 16, 4 + n, '#315f32');
      rect(x + 8, roadY + 111 + n * 2, 18, 4, '#315f32');
      if (n === 1) { rect(x + 5, roadY - 13, 3, 9, '#477b3b'); rect(x + 18, roadY + 113, 3, 10, '#477b3b'); }
    }

    for (const v of vegetation) drawGrass(v);
    for (const f of flowers) drawFlower(f);
    for (const s of stones) drawStone(s.x, s.y, s.s);
    for (const b of bushes) drawBush(b.x, b.y, 1 + (b.i % 2) * .1);

    // borda discreta do campo
    rect(FIELD.x, FIELD.y, FIELD.w, 5, '#213d29');
    rect(FIELD.x, FIELD.y + FIELD.h - 5, FIELD.w, 5, '#213d29');
    rect(FIELD.x, FIELD.y, 5, FIELD.h, '#213d29');
    rect(FIELD.x + FIELD.w - 5, FIELD.y, 5, FIELD.h, '#213d29');
  }

  function drawGrass(v) {
    const x = Math.round(v.x), y = Math.round(v.y);
    const cols = ['#2d6032', '#376b36', '#487a3b', '#315a32'];
    const c = cols[v.t];
    rect(x, y, 4, 13, c);
    rect(x - 7, y + 7, 4, 8, c);
    rect(x + 8, y + 4, 4, 10, c);
    if (v.t === 2) rect(x + 14, y + 10, 3, 6, '#5c8b45');
  }

  function drawFlower(f) {
    const x = Math.round(f.x), y = Math.round(f.y);
    rect(x, y + 5, 3, 12, '#376a36');
    const c = f.yellow ? '#ffd949' : '#f0eee1';
    const alt = f.yellow ? '#ff8f34' : '#8f73d9';
    rect(x - 5, y, 6, 6, c); rect(x + 2, y, 6, 6, c); rect(x - 1, y - 4, 6, 6, c);
    if (((x + y) & 3) === 0) rect(x - 8, y + 1, 5, 5, alt);
    if (((x + y) & 7) === 0) rect(x + 6, y - 3, 5, 5, alt);
    rect(x, y + 2, 3, 3, f.yellow ? '#f2a62e' : '#d9bc4b');
  }

  function drawStone(x, y, s = 1) {
    const w = 19 * s, h = 12 * s;
    rect(x - w / 2, y, w, h, '#5d6558');
    rect(x - w * .32, y - 5 * s, w * .62, 8 * s, '#747b6a');
    rect(x - w * .15, y - 7 * s, w * .28, 4 * s, '#91917b');
  }

  function drawBush(x, y, s = 1) {
    rect(x - 24 * s, y + 12 * s, 54 * s, 18 * s, '#1f4d2b');
    const blobs = [[-19, 8], [-5, -2], [13, 5], [25, 12], [0, 14]];
    for (const [bx, by] of blobs) {
      rect(x + bx * s - 14 * s, y + by * s - 12 * s, 28 * s, 24 * s, '#2f6d35');
      rect(x + bx * s - 8 * s, y + by * s - 16 * s, 20 * s, 15 * s, '#4b873e');
      rect(x + bx * s - 3 * s, y + by * s - 13 * s, 7 * s, 5 * s, '#6e9c4c');
    }
  }

  function drawSlime(s) {
    if (s.deadT > 0 && s.deadT < 2.35 && (((s.deadT * 11) | 0) & 1) === 0) return;
    const jump = Math.sin(s.bob) > .52 ? -4 : 0;
    const squash = Math.sin(s.bob) > .52 ? 1 : 0;
    const x = Math.round(s.x), y = Math.round(s.y + jump);
    const alpha = s.deadT > 0 ? clamp((s.deadT - 2.0) / .8, 0, 1) : 1;
    ctx.save(); ctx.globalAlpha = alpha;

    // sombra e contorno: mantém o slime legível sobre qualquer detalhe do campo
    rect(x - 34, y + 23, 68, 11, '#214226');
    rect(x - 29, y + 20, 58, 10, '#2d6533');
    const outline = '#174622';
    rect(x - 30 - squash, y - 11, 60 + squash * 2, 33, outline);
    rect(x - 24, y - 25, 48, 15, outline);
    rect(x - 18, y - 30, 36, 8, outline);

    const main = s.flash > 0 ? '#efffe9' : '#7be66f';
    rect(x - 27 - squash, y - 9, 54 + squash * 2, 28, main);
    rect(x - 21, y - 22, 42, 18, main);
    rect(x - 15, y - 26, 30, 8, main);
    rect(x - 25, y + 10, 50, 9, '#4fbd55');
    rect(x - 21, y + 17, 42, 5, '#359445');

    // brilho e rosto
    rect(x - 18, y - 19, 14, 6, '#b8f39d');
    rect(x - 20, y - 14, 7, 5, '#9af085');
    rect(x - 14, y - 6, 7, 10, '#16351e');
    rect(x + 8, y - 6, 7, 10, '#16351e');
    rect(x - 13, y - 5, 2, 3, '#eaffdf');
    rect(x + 9, y - 5, 2, 3, '#eaffdf');
    rect(x - 7, y + 8, 14, 4, '#277a38');
    rect(x - 4, y + 11, 8, 3, '#3ca949');
    ctx.restore();

    if (s.deadT <= 0 && s.hp < s.maxHp) {
      rect(x - 37, y - 46, 74, 9, '#18251b');
      rect(x - 35, y - 44, Math.ceil(70 * s.hp / s.maxHp), 5, '#e2d45c');
    }
  }

  function drawPlayer() {
    if (player.classId === 'warrior') drawWarrior();
    else drawArcher();
  }

  function walkFrame() {
    if (!player.moving) return 0;
    // Tibia-like: três fases de passo independentes da direção.
    return Math.floor(player.walkT) % 3;
  }

  function walkOffset() {
    if (!player.moving) return 0;
    return [0, -3, 3][walkFrame()];
  }

  function attackPhase() {
    if (player.attackT <= 0) return 0;
    if (player.classId === 'warrior') {
      if (player.attackT > .30) return 1;
      if (player.attackT > .24) return 2;
      if (player.attackT > .18) return 3;
      if (player.attackT > .12) return 4;
      return 5;
    }
    if (player.attackT > .35) return 1;
    if (player.attackT > .28) return 2;
    if (player.attackT > .21) return 3;
    if (player.attackT > .14) return 4;
    if (player.attackT > .08) return 5;
    return 6;
  }

  function pixelLine(x1, y1, x2, y2, thickness, color, step = 5) {
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const n = Math.max(1, Math.ceil(dist / step));
    for (let i = 0; i <= n; i++) {
      const q = i / n;
      rect(Math.round(x1 + dx * q - thickness / 2), Math.round(y1 + dy * q - thickness / 2), thickness, thickness, color);
    }
  }

  function drawPixelSword(baseX, baseY, tipX, tipY) {
    // punho -> guarda -> lâmina em degraus, sem suavização vetorial
    const dx = tipX - baseX, dy = tipY - baseY;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = dx / len, ny = dy / len;
    const px = -ny, py = nx;
    const guardX = baseX + nx * 10, guardY = baseY + ny * 10;
    const bladeX = baseX + nx * 16, bladeY = baseY + ny * 16;

    pixelLine(baseX - nx * 8, baseY - ny * 8, guardX, guardY, 7, '#5a3928', 4);
    pixelLine(guardX - px * 11, guardY - py * 11, guardX + px * 11, guardY + py * 11, 6, '#c3a253', 4);
    pixelLine(bladeX, bladeY, tipX, tipY, 10, '#dce4e6', 4);
    pixelLine(bladeX + px * 2, bladeY + py * 2, tipX + px * 2, tipY + py * 2, 4, '#ffffff', 4);
    rect(tipX - 4, tipY - 4, 8, 8, '#f2f5f5');
  }

  function walkPoseValues() {
    const f = walkFrame();
    return {
      footA: [0, 4, -3][f],
      footB: [0, -3, 4][f],
      armA: [0, -2, 2][f],
      armB: [0, 2, -2][f],
      bob: [0, -1, 0][f],
    };
  }

  function drawWarrior() {
    const x = Math.round(player.x), y = Math.round(player.y);
    const p = walkPoseValues();
    const idle = !player.moving ? (Math.sin(gameTime * 3.1) > .72 ? -1 : 0) : 0;
    const by = y + idle + p.bob;

    rect(x - 30, y + 31, 60, 12, '#203e28');
    rect(x - 21, y + 36, 42, 7, '#193621');

    if (player.dir === 'south' || player.dir === 'down') {
      // SOUTH: frente, referência principal de proporção.
      rect(x - 18, by + 14 + p.footA, 12, 23, '#2c2927');
      rect(x + 6, by + 14 + p.footB, 12, 23, '#2c2927');
      rect(x - 20, by + 31 + p.footA, 15, 7, '#17191a');
      rect(x + 5, by + 31 + p.footB, 15, 7, '#17191a');

      rect(x - 29, by - 22, 58, 49, '#303a40');
      rect(x - 24, by - 18, 48, 42, '#6f7c83');
      rect(x - 17, by - 15, 34, 31, '#a7b1b5');
      rect(x - 17, by - 15, 34, 6, '#c8d0d2');
      rect(x - 23, by + 10, 46, 8, '#4b555b');
      rect(x - 7, by - 8, 14, 4, '#7b878d');
      rect(x - 3, by - 4, 6, 17, '#87949a');

      rect(x - 32, by - 13 + p.armA, 9, 17, '#4b565d');
      rect(x + 23, by - 13 + p.armB, 9, 17, '#4b565d');
      rect(x - 30, by + 1 + p.armA, 8, 13, '#7f8c92');
      rect(x + 22, by + 1 + p.armB, 8, 13, '#7f8c92');
      rect(x - 29, by + 12 + p.armA, 7, 5, '#c9946a');
      rect(x + 23, by + 12 + p.armB, 7, 5, '#c9946a');

      rect(x - 19, by - 57, 38, 37, '#3e2b24');
      rect(x - 15, by - 50, 30, 27, '#c9946a');
      rect(x - 17, by - 58, 34, 13, '#6b432c');
      rect(x - 14, by - 61, 23, 7, '#805137');
      rect(x + 10, by - 53, 7, 15, '#5e3a28');
      rect(x - 9, by - 39, 5, 5, '#26201d');
      rect(x + 5, by - 39, 5, 5, '#26201d');
      rect(x - 5, by - 29, 10, 3, '#8b5741');
      rect(x - 4, by - 13, 8, 8, '#3d6f9d');
      rect(x - 1, by - 11, 2, 6, '#dce5e9');
    } else if (player.dir === 'up') {
      // NORTH: costas, mesma largura e altura do Sul.
      rect(x - 18, by + 14 + p.footA, 12, 23, '#2c2927');
      rect(x + 6, by + 14 + p.footB, 12, 23, '#2c2927');
      rect(x - 20, by + 31 + p.footA, 15, 7, '#17191a');
      rect(x + 5, by + 31 + p.footB, 15, 7, '#17191a');

      rect(x - 29, by - 22, 58, 49, '#303a40');
      rect(x - 24, by - 18, 48, 42, '#627078');
      rect(x - 17, by - 15, 34, 31, '#8f9ca2');
      rect(x - 17, by - 15, 34, 6, '#b8c0c3');
      rect(x - 23, by + 10, 46, 8, '#4b555b');
      rect(x - 7, by - 8, 14, 4, '#768088');
      rect(x - 3, by - 4, 6, 17, '#808d94');

      rect(x - 32, by - 13 + p.armA, 9, 17, '#4b565d');
      rect(x + 23, by - 13 + p.armB, 9, 17, '#4b565d');
      rect(x - 30, by + 1 + p.armA, 8, 13, '#7f8c92');
      rect(x + 22, by + 1 + p.armB, 8, 13, '#7f8c92');
      rect(x - 29, by + 12 + p.armA, 7, 5, '#c9946a');
      rect(x + 23, by + 12 + p.armB, 7, 5, '#c9946a');

      rect(x - 19, by - 57, 38, 37, '#3e2b24');
      rect(x - 16, by - 53, 32, 31, '#65402c');
      rect(x - 12, by - 59, 24, 12, '#7b4b31');
      rect(x - 6, by - 18, 12, 4, '#5d7283');
      rect(x - 2, by - 16, 4, 4, '#dce5e9');
    } else if (player.dir === 'left') {
      // WEST: sprite próprio, mas estilizado como Tibia: não afina a massa corporal.
      rect(x - 18, by + 14 + p.footA, 12, 23, '#2c2927');
      rect(x + 6, by + 14 + p.footB, 12, 23, '#272522');
      rect(x - 20, by + 31 + p.footA, 15, 7, '#17191a');
      rect(x + 5, by + 31 + p.footB, 15, 7, '#151718');

      rect(x - 27, by - 22, 54, 49, '#303a40');
      rect(x - 23, by - 18, 45, 42, '#67747b');
      rect(x - 16, by - 15, 32, 31, '#9da7ac');
      rect(x - 16, by - 15, 32, 6, '#c3cbce');
      rect(x - 22, by + 10, 44, 8, '#4b555b');
      rect(x - 5, by - 8, 13, 4, '#768088');

      // braço posterior apenas um pouco escondido; ambos continuam compactos.
      rect(x + 20, by - 12 + p.armB, 8, 16, '#535e65');
      rect(x + 20, by + 1 + p.armB, 7, 12, '#77848a');
      rect(x + 19, by + 11 + p.armB, 6, 5, '#c9946a');
      rect(x - 30, by - 13 + p.armA, 9, 17, '#4b565d');
      rect(x - 28, by + 1 + p.armA, 8, 13, '#7f8c92');
      rect(x - 27, by + 12 + p.armA, 7, 5, '#c9946a');

      rect(x - 18, by - 57, 37, 37, '#3e2b24');
      rect(x - 14, by - 50, 29, 27, '#c9946a');
      rect(x - 16, by - 58, 33, 13, '#6b432c');
      rect(x + 9, by - 52, 7, 17, '#65402c');
      rect(x - 9, by - 40, 5, 5, '#26201d');
      rect(x - 14, by - 34, 4, 2, '#8b5741');
      rect(x - 2, by - 13, 7, 8, '#3d6f9d');
      rect(x, by - 11, 2, 6, '#dce5e9');
    } else {
      // EAST: par independente de Oeste; mesma escala, sem espelhamento estrutural.
      rect(x - 18, by + 14 + p.footB, 12, 23, '#272522');
      rect(x + 6, by + 14 + p.footA, 12, 23, '#2c2927');
      rect(x - 20, by + 31 + p.footB, 15, 7, '#151718');
      rect(x + 5, by + 31 + p.footA, 15, 7, '#17191a');

      rect(x - 27, by - 22, 54, 49, '#303a40');
      rect(x - 22, by - 18, 45, 42, '#6f7c83');
      rect(x - 16, by - 15, 32, 31, '#a7b1b5');
      rect(x - 16, by - 15, 32, 6, '#c8d0d2');
      rect(x - 22, by + 10, 44, 8, '#4b555b');
      rect(x - 8, by - 8, 13, 4, '#7b878d');

      rect(x - 28, by - 12 + p.armA, 8, 16, '#535e65');
      rect(x - 27, by + 1 + p.armA, 7, 12, '#77848a');
      rect(x - 25, by + 11 + p.armA, 6, 5, '#c9946a');
      rect(x + 21, by - 13 + p.armB, 9, 17, '#4b565d');
      rect(x + 20, by + 1 + p.armB, 8, 13, '#7f8c92');
      rect(x + 20, by + 12 + p.armB, 7, 5, '#c9946a');

      rect(x - 19, by - 57, 37, 37, '#3e2b24');
      rect(x - 15, by - 50, 29, 27, '#c9946a');
      rect(x - 17, by - 58, 33, 13, '#6b432c');
      rect(x - 16, by - 52, 7, 17, '#65402c');
      rect(x + 4, by - 40, 5, 5, '#26201d');
      rect(x + 10, by - 34, 4, 2, '#8b5741');
      rect(x - 5, by - 13, 7, 8, '#3d6f9d');
      rect(x - 2, by - 11, 2, 6, '#dce5e9');
    }
  }

  function drawArcher() {
    const x = Math.round(player.x), y = Math.round(player.y);
    const p = walkPoseValues();
    const idle = !player.moving ? (Math.sin(gameTime * 3.0 + 1.2) > .72 ? -1 : 0) : 0;
    const by = y + idle + p.bob;

    rect(x - 28, y + 31, 56, 12, '#203e28');

    if (player.dir === 'down') {
      rect(x - 18, by + 14 + p.footA, 12, 23, '#332a24');
      rect(x + 6, by + 14 + p.footB, 12, 23, '#332a24');
      rect(x - 20, by + 31 + p.footA, 15, 7, '#17191a');
      rect(x + 5, by + 31 + p.footB, 15, 7, '#17191a');

      rect(x - 27, by - 22, 54, 49, '#284329');
      rect(x - 22, by - 18, 44, 43, '#456a34');
      rect(x - 15, by - 15, 30, 33, '#66883f');
      rect(x - 21, by + 8, 42, 9, '#324c2d');
      rect(x - 7, by - 13, 14, 4, '#86a84f');

      // NORTH/BACK: braços do arqueiro espelhados com proporção igual.
      rect(x - 30, by - 12 + p.armA, 9, 17, '#3b5e31');
      rect(x + 20, by - 12 + p.armB, 9, 17, '#3b5e31');
      rect(x - 29, by - 2 + p.armA, 8, 6, '#4b733f');
      rect(x + 20, by - 2 + p.armB, 8, 6, '#4b733f');
      rect(x - 28, by + 1 + p.armA, 8, 13, '#6a4a32');
      rect(x + 21, by + 1 + p.armB, 8, 13, '#6a4a32');
      rect(x - 27, by + 12 + p.armA, 7, 5, '#c9946a');
      rect(x + 21, by + 12 + p.armB, 7, 5, '#c9946a');

      rect(x - 20, by - 57, 40, 38, '#27462b');
      rect(x - 16, by - 50, 32, 28, '#c9946a');
      rect(x - 20, by - 60, 40, 16, '#355b31');
      rect(x - 13, by - 63, 26, 8, '#4e7139');
      rect(x - 20, by - 48, 8, 25, '#2f532e');
      rect(x + 12, by - 48, 8, 25, '#2f532e');
      rect(x - 9, by - 39, 5, 5, '#26201d');
      rect(x + 5, by - 39, 5, 5, '#26201d');
      rect(x - 3, by - 29, 6, 2, '#8b5741');
    } else if (player.dir === 'up') {
      rect(x - 18, by + 14 + p.footA, 12, 23, '#332a24');
      rect(x + 6, by + 14 + p.footB, 12, 23, '#332a24');
      rect(x - 20, by + 31 + p.footA, 15, 7, '#17191a');
      rect(x + 5, by + 31 + p.footB, 15, 7, '#17191a');

      rect(x - 27, by - 22, 54, 49, '#284329');
      rect(x - 22, by - 18, 44, 43, '#456a34');
      rect(x - 15, by - 15, 30, 33, '#66883f');
      rect(x - 21, by + 8, 42, 9, '#324c2d');
      rect(x - 7, by - 13, 14, 4, '#86a84f');

      rect(x - 30, by - 12 + p.armA, 9, 17, '#3b5e31');
      rect(x + 21, by - 12 + p.armB, 9, 17, '#3b5e31');
      rect(x - 29, by - 2 + p.armA, 8, 6, '#4b733f');
      rect(x + 21, by - 2 + p.armB, 8, 6, '#4b733f');
      rect(x - 28, by + 1 + p.armA, 8, 13, '#6a4a32');
      rect(x + 21, by + 1 + p.armB, 8, 13, '#6a4a32');
      rect(x - 27, by + 12 + p.armA, 7, 5, '#c9946a');
      rect(x + 22, by + 12 + p.armB, 7, 5, '#c9946a');

      rect(x - 20, by - 57, 40, 38, '#27462b');
      rect(x - 16, by - 52, 32, 30, '#31552f');
      rect(x - 10, by - 57, 20, 10, '#426637');
    } else if (player.dir === 'left') {
      rect(x - 18, by + 14 + p.footA, 12, 23, '#332a24');
      rect(x + 6, by + 14 + p.footB, 12, 23, '#2a221d');
      rect(x - 20, by + 31 + p.footA, 15, 7, '#17191a');
      rect(x + 5, by + 31 + p.footB, 15, 7, '#121617');

      rect(x - 25, by - 22, 50, 49, '#284329');
      rect(x - 21, by - 18, 42, 43, '#456a34');
      rect(x - 14, by - 15, 28, 33, '#66883f');
      rect(x - 20, by + 8, 40, 9, '#324c2d');

      // WEST profile: paleta dos braços reequilibrada.
      rect(x + 18, by - 11 + p.armB, 7, 16, '#35552d');
      rect(x + 18, by - 1 + p.armB, 7, 5, '#47753e');
      rect(x + 18, by + 1 + p.armB, 7, 12, '#6a4a32');
      rect(x + 18, by + 11 + p.armB, 6, 5, '#c9946a');
      rect(x - 28, by - 12 + p.armA, 8, 17, '#3b5e31');
      rect(x - 27, by - 2 + p.armA, 7, 5, '#4b733f');
      rect(x - 27, by + 1 + p.armA, 7, 13, '#6a4a32');
      rect(x - 26, by + 12 + p.armA, 6, 5, '#c9946a');

      rect(x - 19, by - 58, 38, 39, '#27462b');
      rect(x - 15, by - 51, 29, 28, '#c9946a');
      rect(x - 19, by - 61, 36, 16, '#355b31');
      rect(x - 12, by - 64, 23, 8, '#4e7139');
      rect(x - 9, by - 40, 4, 5, '#26201d');
      rect(x - 14, by - 34, 3, 2, '#8b5741');
    } else {
      rect(x - 18, by + 14 + p.footB, 12, 23, '#2a221d');
      rect(x + 6, by + 14 + p.footA, 12, 23, '#332a24');
      rect(x - 20, by + 31 + p.footB, 15, 7, '#121617');
      rect(x + 5, by + 31 + p.footA, 15, 7, '#17191a');

      rect(x - 25, by - 22, 50, 49, '#284329');
      rect(x - 21, by - 18, 42, 43, '#456a34');
      rect(x - 14, by - 15, 28, 33, '#66883f');
      rect(x - 20, by + 8, 40, 9, '#324c2d');

      // EAST profile: paleta dos braços reequilibrada.
      rect(x - 25, by - 11 + p.armA, 7, 16, '#35552d');
      rect(x - 24, by - 1 + p.armA, 7, 5, '#47753e');
      rect(x - 24, by + 1 + p.armA, 7, 12, '#6a4a32');
      rect(x - 24, by + 11 + p.armA, 6, 5, '#c9946a');
      rect(x + 20, by - 12 + p.armB, 8, 17, '#3b5e31');
      rect(x + 20, by - 2 + p.armB, 7, 5, '#4b733f');
      rect(x + 20, by + 1 + p.armB, 7, 13, '#6a4a32');
      rect(x + 20, by + 12 + p.armB, 6, 5, '#c9946a');

      rect(x - 19, by - 58, 38, 39, '#27462b');
      rect(x - 14, by - 51, 29, 28, '#c9946a');
      rect(x - 17, by - 61, 36, 16, '#355b31');
      rect(x - 11, by - 64, 23, 8, '#4e7139');
      rect(x + 5, by - 40, 4, 5, '#26201d');
      rect(x + 11, by - 34, 3, 2, '#8b5741');
    }
  }

  function drawArrow(p) {
    const x = Math.round(p.x), y = Math.round(p.y);
    if (p.dir === 'right') {
      rect(x - 14, y - 2, 22, 4, '#dfddc8');
      rect(x + 8, y - 4, 8, 8, '#d1bb76');
      rect(x - 20, y - 4, 6, 8, '#8d6331');
    } else if (p.dir === 'left') {
      rect(x - 8, y - 2, 22, 4, '#dfddc8');
      rect(x - 16, y - 4, 8, 8, '#d1bb76');
      rect(x + 14, y - 4, 6, 8, '#8d6331');
    } else if (p.dir === 'up') {
      rect(x - 2, y - 14, 4, 22, '#dfddc8');
      rect(x - 4, y - 20, 8, 8, '#d1bb76');
      rect(x - 4, y + 8, 8, 6, '#8d6331');
    } else {
      rect(x - 2, y - 8, 4, 22, '#dfddc8');
      rect(x - 4, y + 14, 8, 8, '#d1bb76');
      rect(x - 4, y - 20, 8, 6, '#8d6331');
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
      rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size, p.color);
      ctx.restore();
    }
  }

  function getSlashArcPoints(s) {
    const x = Math.round(s.x), y = Math.round(s.y);
    if (s.dir === 'down') {
      return [[x - 60, y + 8],[x - 46, y + 22],[x - 18, y + 34],[x + 14, y + 34],[x + 42, y + 22],[x + 58, y + 6]];
    } else if (s.dir === 'up') {
      return [[x + 58, y - 8],[x + 42, y - 24],[x + 14, y - 36],[x - 18, y - 36],[x - 46, y - 24],[x - 60, y - 8]];
    } else if (s.dir === 'right') {
      return [[x + 10, y + 42],[x + 22, y + 26],[x + 34, y + 4],[x + 32, y - 20],[x + 20, y - 38],[x + 8, y - 54]];
    }
    return [[x - 8, y - 54],[x - 20, y - 38],[x - 32, y - 16],[x - 34, y + 8],[x - 22, y + 28],[x - 10, y + 42]];
  }

  function drawSwordSpriteAtPivot(px, py, angle, alpha, scale = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(Math.round(px), Math.round(py));
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    // cabo e pomo
    ctx.fillStyle = '#6d4629';
    ctx.fillRect(-4, -5, 10, 10);
    ctx.fillRect(-9, -3, 5, 6);
    // guarda
    ctx.fillStyle = '#c9a458';
    ctx.fillRect(-3, -11, 8, 22);
    // lâmina maior
    ctx.fillStyle = '#e8eceb';
    ctx.fillRect(5, -5, 56, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, -2, 42, 4);
    ctx.beginPath();
    ctx.moveTo(61, -5);
    ctx.lineTo(74, 0);
    ctx.lineTo(61, 5);
    ctx.fill();
    ctx.restore();
  }

  function drawSwingSword(s) {
    const alpha = clamp(s.t / s.maxT, 0, 1);
    const progress = 1 - clamp(s.t / s.maxT, 0, 1);
    if (progress > 0.96) return;
    let pivotX = s.x, pivotY = s.y, a0 = 0, a1 = 0;
    if (s.dir === 'down') {
      pivotX = s.x; pivotY = s.y + 6;
      a0 = 2.72; a1 = 0.42;
    } else if (s.dir === 'up') {
      pivotX = s.x; pivotY = s.y - 8;
      a0 = -0.42; a1 = -2.72;
    } else if (s.dir === 'right') {
      pivotX = s.x + 2; pivotY = s.y + 2;
      a0 = 1.25; a1 = -1.12;
    } else {
      pivotX = s.x - 2; pivotY = s.y + 2;
      a0 = 4.28; a1 = 1.90;
    }
    const eased = 0.08 + 0.92 * (1 - Math.cos(progress * Math.PI * 0.5));
    const angle = lerp(a0, a1, eased);
    drawSwordSpriteAtPivot(pivotX, pivotY, angle, alpha * 0.98, 1.22);
  }

  function drawSlashEffect(s) {
    const alpha = clamp(s.t / s.maxT, 0, 1);
    const progress = 1 - clamp(s.t / s.maxT, 0, 1);
    const pts = getSlashArcPoints(s);
    const head = progress * (pts.length - 1);
    ctx.save();
    ctx.globalAlpha = alpha * 0.98;
    for (let i = 0; i < pts.length; i++) {
      const dist = head - i;
      if (dist < -0.2 || dist > 2.6) continue;
      const glow = 1 - Math.max(0, dist) / 2.6;
      const [px, py] = pts[i];
      const w = dist < 0.4 ? 18 : dist < 1.2 ? 14 : 10;
      const h = dist < 0.4 ? 10 : dist < 1.2 ? 8 : 6;
      rect(px - w / 2, py - h / 2, w, h, dist < 0.5 ? '#fff4b3' : dist < 1.4 ? '#ffe27c' : '#f7ca52');
      ctx.globalAlpha = alpha * glow * 0.55;
      rect(px - (w + 8) / 2, py - (h + 4) / 2, w + 8, h + 4, '#ffd057');
      ctx.globalAlpha = alpha * 0.98;
    }
    ctx.restore();
  }

  function drawBowShot(b) {
    const alpha = clamp(b.t / b.maxT, 0, 1);
    const progress = 1 - clamp(b.t / b.maxT, 0, 1);
    const pullPhase = Math.min(1, progress / b.releaseAt);
    const releasedPhase = b.released ? clamp((progress - b.releaseAt) / (1 - b.releaseAt), 0, 1) : 0;
    const drawPull = b.released ? 1 - releasedPhase * 0.75 : pullPhase;
    const showArrow = !b.released || releasedPhase < 0.12;

    const x = Math.round(b.x), y = Math.round(b.y);
    let px = x, py = y, angle = 0;
    const drawDir = -1; // sempre puxa a corda para trás do disparo
    if (b.dir === 'right') {
      px = x + 20; py = y - 8; angle = 0;
    } else if (b.dir === 'left') {
      px = x - 20; py = y - 8; angle = Math.PI;
    } else if (b.dir === 'down') {
      px = x; py = y - 2; angle = Math.PI / 2;
    } else {
      px = x; py = y - 25; angle = -Math.PI / 2;
    }

    ctx.save();
    ctx.globalAlpha = alpha * 0.98;
    ctx.translate(px, py);
    ctx.rotate(angle);

    // arco maior, com pontas mais presentes
    ctx.fillStyle = '#8d5b29';
    ctx.fillRect(-5, -36, 5, 72);
    ctx.fillRect(10, -36, 5, 72);
    ctx.fillStyle = '#c58a45';
    ctx.fillRect(-3, -30, 3, 60);
    ctx.fillRect(10, -30, 3, 60);
    // pontas reforçadas
    ctx.fillStyle = '#e4bf72';
    ctx.fillRect(-6, -38, 7, 5);
    ctx.fillRect(9, -38, 7, 5);
    ctx.fillRect(-6, 33, 7, 5);
    ctx.fillRect(9, 33, 7, 5);
    // grip central
    ctx.fillStyle = '#6d4629';
    ctx.fillRect(2, -10, 7, 20);

    // corda puxada
    ctx.strokeStyle = '#ece1c5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(3, -33);
    ctx.lineTo(3 + drawDir * (12 + 18 * drawPull), 0);
    ctx.lineTo(3, 33);
    ctx.stroke();

    if (pullPhase > 0.25 && !b.released) {
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = '#ffe08a';
      ctx.fillRect(5 + drawDir * (12 + 14 * drawPull), -5, 10, 10);
      ctx.globalAlpha = alpha * 0.98;
    }

    // flecha maior e com mais detalhes
    if (showArrow) {
      const ax = 3 + drawDir * (8 + 21 * drawPull);
      ctx.fillStyle = '#dfe0d1';
      ctx.fillRect(ax - 26, -3, 38, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ax - 20, -1, 22, 2);
      // ponta
      ctx.fillStyle = '#d4b764';
      ctx.beginPath();
      ctx.moveTo(ax + 12, -6);
      ctx.lineTo(ax + 22, 0);
      ctx.lineTo(ax + 12, 6);
      ctx.fill();
      // haste traseira
      ctx.fillStyle = '#7b532d';
      ctx.fillRect(ax - 30, -5, 5, 10);
      // emplumação
      ctx.fillStyle = '#f0d89f';
      ctx.fillRect(ax - 34, -6, 4, 5);
      ctx.fillRect(ax - 34, 1, 4, 5);
    }

    ctx.restore();
  }

  function drawDamageNumbers() {
    for (const d of damageNumbers) {
      ctx.save();
      ctx.globalAlpha = clamp(d.t / .25, 0, 1);
      text(`-${d.value}`, d.x, d.y, 27, '#ffd538', 'center', '900');
      ctx.restore();
    }
  }

  function drawSwordIcon(x, y, s = 1) {
    rect(x - 4 * s, y - 27 * s, 8 * s, 42 * s, '#e5ebec');
    rect(x - 1 * s, y - 27 * s, 3 * s, 36 * s, '#ffffff');
    rect(x - 13 * s, y + 10 * s, 26 * s, 6 * s, '#b5924d');
    rect(x - 4 * s, y + 15 * s, 8 * s, 16 * s, '#69452d');
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.translate(-x, -y); ctx.restore();
  }

  function drawShieldIcon(x, y, s = 1) {
    rect(x - 18 * s, y - 25 * s, 36 * s, 40 * s, '#d4c49b');
    rect(x - 14 * s, y - 21 * s, 28 * s, 31 * s, '#3c6d9b');
    rect(x - 2 * s, y - 19 * s, 4 * s, 29 * s, '#e8e4d2');
    rect(x - 12 * s, y - 3 * s, 24 * s, 4 * s, '#e8e4d2');
    rect(x - 10 * s, y + 10 * s, 20 * s, 8 * s, '#d4c49b');
  }

  function drawClassPortrait(x, y, cls, selected) {
    borderPanel(x, y, 145, 150, selected ? '#18201d' : '#101719', selected ? '#d9b93d' : '#52615c');
    const oldX = player.x, oldY = player.y, oldClass = player.classId, oldDir = player.dir, oldMoving = player.moving, oldAttack = player.attackT;
    player.x = x + 72; player.y = y + 79; player.classId = cls; player.dir = 'down'; player.moving = false; player.attackT = 0;
    ctx.save(); ctx.translate(player.x, player.y); ctx.scale(.74, .74); ctx.translate(-player.x, -player.y);
    cls === 'warrior' ? drawWarrior() : drawArcher();
    ctx.restore();
    player.x = oldX; player.y = oldY; player.classId = oldClass; player.dir = oldDir; player.moving = oldMoving; player.attackT = oldAttack;
    text(cls === 'warrior' ? 'Guerreiro' : 'Arqueiro', x + 72, y + 132, 21, selected ? '#ffd84a' : '#e5e9e5', 'center');
  }

  function drawGamepadIcon(x, y) {
    rect(x - 27, y - 12, 54, 25, '#d8dcda');
    rect(x - 35, y - 4, 12, 18, '#d8dcda'); rect(x + 23, y - 4, 12, 18, '#d8dcda');
    rect(x - 18, y - 2, 15, 5, '#4d5555'); rect(x - 13, y - 7, 5, 15, '#4d5555');
    rect(x + 12, y - 5, 6, 6, '#4d5555'); rect(x + 20, y + 2, 6, 6, '#4d5555');
  }

  function drawKeyboardIcon(x, y) {
    rect(x - 32, y - 13, 64, 27, '#d8dcda');
    for (let yy = -8; yy <= 5; yy += 7) for (let xx = -27; xx <= 23; xx += 10) rect(x + xx, y + yy, 6, 4, '#4d5555');
  }

  function drawSlimeIcon(x, y) {
    rect(x - 19, y - 7, 38, 22, '#58b957'); rect(x - 15, y - 16, 30, 13, '#79e06d');
    rect(x - 16, y - 5, 32, 15, '#79e06d'); rect(x - 8, y - 4, 4, 5, '#17351d'); rect(x + 5, y - 4, 4, 5, '#17351d');
  }

  function drawHUD() {
    const y = H - HUD_H;
    rect(0, y, W, HUD_H, '#091012');

    borderPanel(8, y + 8, 312, HUD_H - 16, '#0d1718');
    drawSlimeIcon(55, y + 67);
    text('Slimes ativos', 95, y + 53, 26);
    const alive = slimes.filter(s => s.deadT <= 0).length;
    text(String(alive), 162, y + 119, 50, '#8dde59', 'center', '900');

    borderPanel(328, y + 8, 362, HUD_H - 16, '#0d1718');
    text('Classe atual', 509, y + 42, 24, '#e9ece8', 'center');
    if (player.classId === 'warrior') drawShieldIcon(402, y + 103, .9);
    else drawBowMiniIcon(402, y + 103);
    text(player.classId === 'warrior' ? 'Guerreiro' : 'Arqueiro', 455, y + 105, 35, player.classId === 'warrior' ? '#ffd84a' : '#8fd96b');
    text('V12.1 = base estável / V15.3 = perfis do arqueiro', 509, y + 148, 18, '#aeb8b2', 'center', '500');

    borderPanel(698, y + 8, 480, HUD_H - 16, '#0d1718');
    drawClassPortrait(720, y + 22, 'warrior', player.classId === 'warrior');
    drawClassPortrait(1009, y + 22, 'archer', player.classId === 'archer');
    text('↔', 939, y + 66, 42, '#c9d0cc', 'center');
    text('LB / RB', 939, y + 109, 20, '#d7bc55', 'center');
    text('TAB / Q / E', 939, y + 137, 18, '#aeb8b2', 'center', '500');

    borderPanel(1186, y + 8, 726, HUD_H - 16, '#0d1718');
    text('Controles / Ajuda', 1550, y + 34, 25, '#f1f3ef', 'center');
    drawKeyboardIcon(1237, y + 84);
    text('Teclado:', 1288, y + 79, 22);
    text('WASD/Setas', 1408, y + 79, 22, '#8fd96b');
    text('+ Espaço/J/X', 1584, y + 79, 22, '#64b9e8');
    text('+ TAB/Q/E', 1788, y + 79, 22, '#ffd84a');

    drawGamepadIcon(1237, y + 132);
    text('Gamepad:', 1288, y + 132, 22);
    text('Analógico/D-pad', 1418, y + 132, 22, '#cfd5d1');
    text('+ A/X/RT', 1656, y + 132, 22, '#8fd96b');
    text('+ LB/RB', 1794, y + 132, 22, '#ffd84a');

    text(connectedPad ? 'GAMEPAD CONECTADO' : 'GAMEPAD: aguardando...', 1884, HEADER_H + 28, 18, connectedPad ? '#9be777' : '#c3cbc5', 'right', '600');
    text('F = tela cheia', 1884, HEADER_H + 53, 17, '#b3bbb6', 'right', '500');
  }

  function drawBowMiniIcon(x, y) {
    rect(x - 20, y - 28, 6, 57, '#a96f32'); rect(x - 14, y - 22, 3, 45, '#e7ddbc');
    rect(x - 4, y - 2, 42, 4, '#ded9be'); rect(x + 32, y - 5, 8, 10, '#c7c0a5');
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const shakeX = shakeT > 0 ? Math.round((Math.sin(gameTime * 90) * 0.5 + Math.sin(gameTime * 57) * 0.5) * shakeMag) : 0;
    const shakeY = shakeT > 0 ? Math.round((Math.cos(gameTime * 80) * 0.5 + Math.sin(gameTime * 41) * 0.5) * shakeMag * 0.7) : 0;
    drawHeader();
    ctx.save();
    ctx.translate(shakeX, shakeY);
    drawField();

    const actors = [];
    for (const s of slimes) actors.push({ y: s.y, type: 'slime', obj: s });
    actors.push({ y: player.y, type: 'player', obj: player });
    actors.sort((a, b) => a.y - b.y);
    for (const a of actors) {
      if (a.type === 'slime') {
        drawSlime(a.obj);
      } else {
        if (slashEffect && slashEffect.layer === 'behind') drawSlashEffect(slashEffect);
        if (swordSwing && swordSwing.layer === 'behind') drawSwingSword(swordSwing);
        if (bowShot && bowShot.layer === 'behind') drawBowShot(bowShot);
        drawPlayer();
      }
    }
    if (slashEffect && slashEffect.layer !== 'behind') drawSlashEffect(slashEffect);
    if (swordSwing && swordSwing.layer !== 'behind') drawSwingSword(swordSwing);
    if (bowShot && bowShot.layer !== 'behind') drawBowShot(bowShot);
    for (const p of projectiles) drawArrow(p);
    drawParticles();
    drawDamageNumbers();
    ctx.restore();
    drawHUD();

    if (player.classFlash > 0) {
      ctx.save(); ctx.globalAlpha = player.classFlash * .33;
      rect(FIELD.x, FIELD.y, FIELD.w, FIELD.h, player.classId === 'warrior' ? '#e0b42f' : '#67ba55');
      ctx.restore();
    }
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.033, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
