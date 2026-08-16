(() => {
  'use strict';

  // M002.2B.0.2 — ESCALA HUMANA

  const LOGICAL_W = 640;
  const LOGICAL_H = 360;
  const SCALE = 2;

  const P = Object.freeze({
    bg: '#0f1410',
    plasterShadow: '#544c3e',
    plaster: '#766c5a',
    plasterLight: '#958972',
    timberDark: '#352318',
    timber: '#5b3a24',
    timberLight: '#7f5330',
    stoneDark: '#413f3a',
    stone: '#66625b',
    stoneLight: '#888279',
    floorDark: '#332115',
    floor: '#573622',
    floorLight: '#71482c',
    windowDark: '#314543',
    window: '#8ba9a0',
    windowLight: '#d5d8af',
    curtainDark: '#364530',
    curtain: '#567149',
    curtainLight: '#779261',
    fire1: '#df6525',
    fire2: '#f6a139',
    fire3: '#fee483'
  });

  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawBackground(ctx) {
    px(ctx, 0, 0, LOGICAL_W, LOGICAL_H, P.bg);
  }

  function drawWall(ctx) {
    px(ctx, 38, 30, 564, 102, P.plasterShadow);
    px(ctx, 44, 34, 552, 92, P.plaster);
    px(ctx, 44, 34, 552, 6, P.plasterLight);

    const beamXs = [44, 246, 446, 582];
    for (const x of beamXs) {
      px(ctx, x, 22, 11, 110, P.timberDark);
      px(ctx, x + 2, 24, 7, 106, P.timber);
      px(ctx, x + 3, 24, 2, 104, P.timberLight);
    }

    px(ctx, 38, 22, 564, 13, P.timberDark);
    px(ctx, 42, 24, 556, 8, P.timber);
    px(ctx, 42, 24, 556, 2, P.timberLight);

    const patches = [
      [82, 56, 12, 4], [136, 82, 12, 4], [185, 64, 10, 4],
      [288, 86, 14, 4], [346, 54, 14, 4], [489, 66, 14, 4],
      [537, 82, 13, 4]
    ];
    for (const [x, y, w, h] of patches) px(ctx, x, y, w, h, P.plasterLight);
    for (const [x, y, w, h] of patches.slice(1)) px(ctx, x + 2, y + 4, w - 4, 2, P.plasterShadow);
  }

  function drawWindow(ctx) {
    // lowered and slightly smaller: sill sits closer to character waist height
    const x = 106, y = 64, w = 64, h = 48;
    px(ctx, x - 10, y - 8, w + 20, h + 16, P.timberDark);
    px(ctx, x - 5, y - 4, w + 10, h + 8, P.timber);
    px(ctx, x, y, w, h, '#232622');
    px(ctx, x + 6, y + 6, w - 12, h - 12, P.windowDark);
    px(ctx, x + 10, y + 10, w - 20, h - 20, P.window);
    px(ctx, x + 13, y + 13, 14, 9, P.windowLight);
    px(ctx, x + 30, y + 13, 11, 9, '#b8c7b4');
    px(ctx, x + 13, y + 25, 14, 8, '#7d978e');
    px(ctx, x + 30, y + 25, 11, 8, '#94ac9e');
    px(ctx, x + 26, y + 8, 4, h - 16, P.timberDark);
    px(ctx, x + 8, y + 21, w - 16, 4, P.timberDark);

    px(ctx, x - 15, y + 2, 10, 34, P.curtainDark);
    px(ctx, x - 13, y + 4, 6, 29, P.curtain);
    px(ctx, x - 14, y + 27, 8, 4, P.curtainLight);
    px(ctx, x + w + 5, y + 2, 10, 34, P.curtainDark);
    px(ctx, x + w + 7, y + 4, 6, 29, P.curtain);
    px(ctx, x + w + 6, y + 27, 8, 4, P.curtainLight);

    px(ctx, x - 8, y + h + 2, w + 16, 7, P.timberDark);
    px(ctx, x - 4, y + h + 2, w + 8, 2, P.timberLight);
  }

  function drawFireplace(ctx) {
    // reduced opening and total mass to fit human scale better
    const x = 334, y = 54, w = 108, h = 74;
    px(ctx, x - 8, y - 2, w + 16, h + 8, P.stoneDark);
    px(ctx, x, y + 4, w, h - 4, P.stone);
    px(ctx, x + 4, y + 8, w - 8, h - 12, P.stoneLight);

    const blocks = [
      [x + 6, y + 9, 20, 12], [x + 30, y + 9, 20, 12], [x + 54, y + 9, 19, 12], [x + 77, y + 9, 20, 12],
      [x + 6, y + 25, 20, 13], [x + 30, y + 25, 20, 13], [x + 54, y + 25, 19, 13], [x + 77, y + 25, 20, 13],
      [x + 6, y + 42, 20, 13], [x + 30, y + 42, 20, 13], [x + 54, y + 42, 19, 13], [x + 77, y + 42, 20, 13]
    ];
    for (const [bx, by, bw, bh] of blocks) {
      px(ctx, bx, by, bw, bh, P.stone);
      px(ctx, bx, by, bw, 2, P.stoneLight);
      px(ctx, bx + bw - 2, by, 2, bh, P.stoneDark);
    }

    px(ctx, x + 32, y + 28, 44, 31, '#261a14');
    px(ctx, x + 37, y + 22, 34, 7, '#261a14');
    px(ctx, x + 42, y + 17, 24, 6, '#261a14');

    px(ctx, x + 45, y + 45, 14, 14, P.fire1);
    px(ctx, x + 48, y + 37, 8, 22, P.fire2);
    px(ctx, x + 50, y + 32, 4, 20, P.fire3);
    px(ctx, x + 40, y + 58, 24, 4, P.fire2);

    px(ctx, x - 11, y + 12, w + 22, 7, P.timberDark);
    px(ctx, x - 7, y + 12, w + 14, 2, P.timberLight);

    px(ctx, x + 18, y + 60, 72, 12, P.stoneDark);
    px(ctx, x + 22, y + 62, 64, 6, P.stone);
  }

  function drawWoodpile(ctx) {
    const x = 474, y = 112;
    px(ctx, x, y + 4, 52, 16, P.timberDark);
    const logs = [
      [x + 2, y - 4, 15, 9], [x + 16, y - 8, 16, 10], [x + 31, y - 4, 15, 9],
      [x + 7, y - 14, 15, 9], [x + 22, y - 16, 15, 10], [x + 36, y - 12, 13, 8]
    ];
    for (const [lx, ly, lw, lh] of logs) {
      px(ctx, lx, ly, lw, lh, '#6d4529');
      px(ctx, lx + 2, ly + 2, lw - 4, lh - 4, '#936037');
      px(ctx, lx + lw - 5, ly + 2, 3, lh - 4, '#c58f54');
    }
  }

  function drawFloor(ctx) {
    px(ctx, 38, 132, 564, 7, P.timberDark);
    px(ctx, 44, 132, 552, 4, P.timber);
    px(ctx, 44, 139, 552, 215, P.floorDark);
    px(ctx, 50, 143, 540, 211, P.floor);

    for (let y = 147; y < 352; y += 14) {
      px(ctx, 50, y, 540, 1, P.floorLight);
      px(ctx, 50, y + 11, 540, 2, P.floorDark);
    }

    const xs = [86, 164, 239, 334, 430, 516];
    let toggle = 0;
    for (const x of xs) {
      for (let y = 145 + (toggle ? 12 : 0); y < 346; y += 28) {
        px(ctx, x, y, 2, 12, P.floorDark);
      }
      toggle = 1 - toggle;
    }
  }

  function drawBase() {
    const canvas = document.createElement('canvas');
    canvas.width = LOGICAL_W;
    canvas.height = LOGICAL_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    drawBackground(ctx);
    drawWall(ctx);
    drawWindow(ctx);
    drawFireplace(ctx);
    drawWoodpile(ctx);
    drawFloor(ctx);
    px(ctx, 44, 139, 552, 2, '#1d1611');
    px(ctx, 44, 141, 552, 2, '#261b14');

    return canvas;
  }

  window.RagbiaMicrotestArtV2 = { LOGICAL_W, LOGICAL_H, SCALE, palette: P, drawBase };
})();
