(() => {
  'use strict';

  // M002.2B.0.1 — PROPORÇÃO E CONTINUIDADE

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
    px(ctx, 38, 24, 564, 112, P.plasterShadow);
    px(ctx, 44, 30, 552, 100, P.plaster);
    px(ctx, 44, 30, 552, 8, P.plasterLight);

    const beamXs = [44, 246, 446, 582];
    for (const x of beamXs) {
      px(ctx, x, 18, 12, 120, P.timberDark);
      px(ctx, x + 2, 20, 8, 116, P.timber);
      px(ctx, x + 3, 20, 2, 114, P.timberLight);
    }

    px(ctx, 38, 18, 564, 14, P.timberDark);
    px(ctx, 42, 21, 556, 8, P.timber);
    px(ctx, 42, 21, 556, 2, P.timberLight);

    const patches = [
      [76, 48, 15, 5], [131, 79, 13, 4], [184, 60, 11, 5],
      [286, 89, 15, 5], [340, 48, 17, 5], [482, 63, 16, 4],
      [536, 84, 15, 5]
    ];
    for (const [x, y, w, h] of patches) px(ctx, x, y, w, h, P.plasterLight);
    for (const [x, y, w, h] of patches.slice(1)) px(ctx, x + 2, y + 5, w - 4, 2, P.plasterShadow);
  }

  function drawWindow(ctx) {
    const x = 102, y = 48, w = 78, h = 58;
    px(ctx, x - 11, y - 8, w + 22, h + 16, P.timberDark);
    px(ctx, x - 6, y - 4, w + 12, h + 8, P.timber);
    px(ctx, x, y, w, h, '#232622');
    px(ctx, x + 7, y + 7, w - 14, h - 14, P.windowDark);
    px(ctx, x + 11, y + 11, w - 22, h - 22, P.window);
    px(ctx, x + 15, y + 14, 17, 11, P.windowLight);
    px(ctx, x + 38, y + 14, 17, 11, '#b8c7b4');
    px(ctx, x + 15, y + 30, 17, 11, '#7d978e');
    px(ctx, x + 38, y + 30, 17, 11, '#94ac9e');
    px(ctx, x + 34, y + 8, 4, h - 16, P.timberDark);
    px(ctx, x + 8, y + 26, w - 16, 4, P.timberDark);
    px(ctx, x - 18, y + 3, 11, 42, P.curtainDark);
    px(ctx, x - 16, y + 5, 7, 35, P.curtain);
    px(ctx, x - 17, y + 34, 9, 4, P.curtainLight);
    px(ctx, x + w + 7, y + 3, 11, 42, P.curtainDark);
    px(ctx, x + w + 9, y + 5, 7, 35, P.curtain);
    px(ctx, x + w + 8, y + 34, 9, 4, P.curtainLight);
    px(ctx, x - 10, y + h + 3, w + 20, 8, P.timberDark);
    px(ctx, x - 6, y + h + 3, w + 12, 3, P.timberLight);
  }

  function drawFireplace(ctx) {
    const x = 324, y = 46, w = 122, h = 88;
    px(ctx, x - 8, y - 2, w + 16, h + 8, P.stoneDark);
    px(ctx, x, y + 4, w, h - 4, P.stone);
    px(ctx, x + 4, y + 8, w - 8, h - 12, P.stoneLight);

    const blocks = [
      [x + 6, y + 9, 24, 14], [x + 34, y + 9, 25, 14], [x + 63, y + 9, 23, 14], [x + 90, y + 9, 22, 14],
      [x + 6, y + 27, 26, 15], [x + 36, y + 27, 23, 15], [x + 63, y + 27, 23, 15], [x + 90, y + 27, 22, 15],
      [x + 6, y + 46, 24, 16], [x + 34, y + 46, 25, 16], [x + 63, y + 46, 23, 16], [x + 90, y + 46, 22, 16]
    ];
    for (const [bx, by, bw, bh] of blocks) {
      px(ctx, bx, by, bw, bh, P.stone);
      px(ctx, bx, by, bw, 2, P.stoneLight);
      px(ctx, bx + bw - 2, by, 2, bh, P.stoneDark);
    }

    px(ctx, x + 31, y + 30, 60, 42, '#261a14');
    px(ctx, x + 36, y + 24, 50, 8, '#261a14');
    px(ctx, x + 43, y + 18, 36, 7, '#261a14');

    px(ctx, x + 51, y + 50, 18, 18, P.fire1);
    px(ctx, x + 55, y + 40, 10, 28, P.fire2);
    px(ctx, x + 58, y + 34, 4, 26, P.fire3);
    px(ctx, x + 46, y + 66, 28, 5, P.fire2);

    px(ctx, x - 12, y + 14, w + 24, 8, P.timberDark);
    px(ctx, x - 8, y + 14, w + 16, 3, P.timberLight);

    px(ctx, x + 16, y + 72, 90, 14, P.stoneDark);
    px(ctx, x + 20, y + 74, 82, 8, P.stone);
  }

  function drawWoodpile(ctx) {
    const x = 470, y = 116;
    px(ctx, x, y, 58, 18, P.timberDark);
    const logs = [
      [x + 3, y - 8, 18, 10], [x + 18, y - 12, 18, 12], [x + 34, y - 7, 18, 10],
      [x + 8, y - 20, 18, 10], [x + 25, y - 24, 18, 11], [x + 40, y - 18, 15, 9]
    ];
    for (const [lx, ly, lw, lh] of logs) {
      px(ctx, lx, ly, lw, lh, '#6d4529');
      px(ctx, lx + 2, ly + 2, lw - 4, lh - 4, '#936037');
      px(ctx, lx + lw - 6, ly + 2, 4, lh - 4, '#c58f54');
    }
  }

  function drawFloor(ctx) {
    px(ctx, 38, 136, 564, 8, P.timberDark);
    px(ctx, 44, 136, 552, 4, P.timber);
    px(ctx, 44, 144, 552, 210, P.floorDark);
    px(ctx, 50, 148, 540, 206, P.floor);

    for (let y = 152; y < 352; y += 14) {
      px(ctx, 50, y, 540, 1, P.floorLight);
      px(ctx, 50, y + 11, 540, 2, P.floorDark);
    }

    const xs = [88, 165, 236, 326, 425, 514];
    let toggle = 0;
    for (const x of xs) {
      for (let y = 150 + (toggle ? 12 : 0); y < 346; y += 28) {
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
    px(ctx, 44, 142, 552, 2, '#1d1611');
    px(ctx, 44, 144, 552, 2, '#261b14');

    return canvas;
  }

  window.RagbiaMicrotestArtV1 = { LOGICAL_W, LOGICAL_H, SCALE, palette: P, drawBase };
})();