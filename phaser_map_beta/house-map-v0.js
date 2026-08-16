(() => {
  'use strict';

  // M002.2 — primeira interpretação pixelada jogável da Casa do Avô.
  // Arte lógica 480x270, ampliada 4x por nearest-neighbor para 1920x1080.
  const SCALE = 4;
  const ART_W = 480;
  const ART_H = 270;
  const WORLD_W = ART_W * SCALE;
  const WORLD_H = ART_H * SCALE;
  const spawn = { x: 240 * SCALE, y: 211 * SCALE };

  const palette = {
    grassDark: '#1d3b24', grass: '#315b2e', grassLight: '#4f7638', flower: '#d8cf75',
    shadow: '#121410', stoneDark: '#493f32', stone: '#766a58', stoneLight: '#a29377',
    beamDark: '#3a2418', beam: '#6e4227', beamLight: '#9a6339',
    floorDark: '#4b2f1d', floor: '#6b4125', floorLight: '#895733',
    rugDark: '#57402b', rug: '#816441', rugLight: '#a08356',
    woodDark: '#382116', wood: '#684024', woodLight: '#956037',
    bedBlue: '#384c63', bedGreen: '#48563c', cloth: '#c5b69a', clothShadow: '#8e8069',
    fireDark: '#8f3318', fire: '#e56a21', fireLight: '#ffd46a', metal: '#899095'
  };

  function rect(ctx, x, y, w, h, c, a = 1) {
    ctx.globalAlpha = a;
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    ctx.globalAlpha = 1;
  }
  function line(ctx, x1, y1, x2, y2, c, w = 1) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function ellipse(ctx, x, y, rx, ry, c, a = 1) {
    ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  function poly(ctx, c, pts) {
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath(); ctx.fill();
  }

  function drawGrass(ctx) {
    rect(ctx, 0, 0, ART_W, ART_H, palette.grassDark);
    for (let y = 0; y < ART_H; y += 7) {
      for (let x = (y % 14 ? 3 : 0); x < ART_W; x += 11) {
        const k = ((x * 17 + y * 31) % 9);
        if (k < 3) rect(ctx, x, y, 2, 1, palette.grass, .8);
        if (k === 4) rect(ctx, x + 2, y + 1, 1, 2, palette.grassLight, .7);
        if (k === 7 && (x < 38 || x > 442 || y < 15 || y > 250)) rect(ctx, x, y, 1, 1, palette.flower, .75);
      }
    }
  }

  function drawFloor(ctx) {
    rect(ctx, 50, 31, 380, 205, palette.floorDark);
    for (let y = 34; y < 236; y += 8) {
      rect(ctx, 50, y, 380, 6, palette.floor);
      line(ctx, 50, y + 6, 430, y + 6, palette.woodDark);
      const off = ((y / 8) % 2) ? 14 : 0;
      for (let x = 50 + off; x < 430; x += 46) line(ctx, x, y, x, y + 6, palette.floorLight);
    }
  }

  function wallSegment(ctx, x, y, w, h, horizontal = true) {
    rect(ctx, x, y, w, h, palette.stoneDark);
    rect(ctx, x + 2, y + 2, w - 4, h - 4, palette.stone);
    if (horizontal) {
      for (let xx = x + 4; xx < x + w - 4; xx += 18) {
        rect(ctx, xx, y + 4, 12, 5, palette.stoneLight, .45);
        rect(ctx, xx + 7, y + 11, 9, 4, palette.stoneDark, .5);
      }
      rect(ctx, x - 2, y - 3, w + 4, 6, palette.beamDark);
      rect(ctx, x, y - 2, w, 3, palette.beam);
      for (let xx = x + 20; xx < x + w; xx += 80) rect(ctx, xx, y - 5, 6, 10, palette.beamLight);
    } else {
      rect(ctx, x - 3, y - 2, 6, h + 4, palette.beamDark);
      rect(ctx, x - 2, y, 3, h, palette.beam);
      for (let yy = y + 20; yy < y + h; yy += 70) rect(ctx, x - 5, yy, 10, 6, palette.beamLight);
    }
  }

  function drawWalls(ctx) {
    wallSegment(ctx, 42, 20, 396, 16, true);
    wallSegment(ctx, 42, 32, 15, 210, false);
    wallSegment(ctx, 423, 32, 15, 210, false);
    wallSegment(ctx, 42, 234, 180, 14, true);
    wallSegment(ctx, 258, 234, 180, 14, true);

    // Porta fechada enquanto a Vila não existe.
    rect(ctx, 222, 225, 36, 28, palette.beamDark);
    rect(ctx, 226, 229, 28, 24, palette.wood);
    for (let x = 230; x < 254; x += 7) rect(ctx, x, 231, 3, 20, palette.woodLight, .45);
    rect(ctx, 249, 240, 2, 2, '#d1b15d');
  }

  function drawWindow(ctx, x, y) {
    rect(ctx, x - 14, y - 10, 28, 22, palette.beamDark);
    rect(ctx, x - 10, y - 7, 20, 16, '#9ec4b8');
    rect(ctx, x - 8, y - 6, 8, 14, '#c9e2c0');
    rect(ctx, x + 2, y - 6, 6, 14, '#d7e7c7');
    rect(ctx, x - 1, y - 7, 2, 16, palette.beamDark);
    rect(ctx, x - 10, y, 20, 2, palette.beamDark);
  }

  function drawBed(ctx, x, y, blanket) {
    rect(ctx, x, y, 55, 82, palette.woodDark);
    rect(ctx, x + 4, y + 5, 47, 70, palette.wood);
    rect(ctx, x + 7, y + 8, 41, 22, palette.clothShadow);
    rect(ctx, x + 9, y + 9, 37, 18, palette.cloth);
    rect(ctx, x + 6, y + 31, 43, 41, blanket);
    rect(ctx, x + 8, y + 33, 39, 4, '#ffffff', .09);
    rect(ctx, x - 3, y - 3, 6, 82, palette.woodLight);
    rect(ctx, x + 52, y - 3, 6, 82, palette.woodLight);
  }

  function drawFireplace(ctx) {
    rect(ctx, 205, 34, 70, 55, palette.stoneDark);
    rect(ctx, 210, 37, 60, 48, palette.stone);
    for (let y = 39; y < 81; y += 9) {
      for (let x = 212 + ((y / 9) % 2 ? 5 : 0); x < 267; x += 13) rect(ctx, x, y, 10, 6, palette.stoneLight, .32);
    }
    rect(ctx, 222, 56, 36, 29, '#211710');
    ellipse(ctx, 240, 75, 14, 7, palette.fireDark);
    poly(ctx, palette.fire, [[232,76],[236,59],[241,70],[247,54],[250,76]]);
    poly(ctx, palette.fireLight, [[237,76],[241,64],[244,73],[247,63],[248,76]]);
    rect(ctx, 202, 83, 76, 7, palette.beamDark);
  }

  function drawCabinet(ctx, x, y, w = 40, h = 54) {
    rect(ctx, x, y, w, h, palette.woodDark);
    rect(ctx, x + 3, y + 3, w - 6, h - 6, palette.wood);
    rect(ctx, x + 5, y + 8, w - 10, 3, palette.woodLight);
    rect(ctx, x + 5, y + 25, w - 10, 3, palette.woodLight);
    rect(ctx, x + w / 2 - 1, y + 31, 2, h - 36, palette.woodDark);
  }

  function drawChest(ctx, x, y, w = 40) {
    rect(ctx, x, y + 8, w, 25, palette.woodDark);
    rect(ctx, x + 3, y + 10, w - 6, 20, palette.wood);
    rect(ctx, x + 2, y + 4, w - 4, 10, palette.woodLight);
    rect(ctx, x + w / 2 - 2, y + 15, 4, 6, palette.metal);
  }

  function drawTable(ctx) {
    // Tapete e mesa centrais conforme a referência.
    rect(ctx, 177, 115, 126, 75, palette.rugDark);
    rect(ctx, 181, 119, 118, 67, palette.rug);
    for (let x = 185; x < 298; x += 9) rect(ctx, x, 122, 4, 2, palette.rugLight, .35);
    rect(ctx, 203, 128, 76, 48, palette.woodDark);
    rect(ctx, 207, 124, 68, 44, palette.wood);
    line(ctx, 212, 128, 270, 163, palette.woodLight);
    line(ctx, 268, 127, 215, 164, palette.woodDark);
    rect(ctx, 210, 168, 8, 18, palette.woodDark);
    rect(ctx, 264, 168, 8, 18, palette.woodDark);
    ellipse(ctx, 241, 144, 8, 5, '#5b391e');
    rect(ctx, 248, 140, 3, 8, palette.fireLight);
  }

  function drawDesk(ctx) {
    rect(ctx, 72, 180, 72, 36, palette.woodDark);
    rect(ctx, 76, 176, 66, 33, palette.wood);
    rect(ctx, 84, 183, 22, 14, '#b69d73');
    line(ctx, 85, 187, 104, 187, '#6e5a3d');
    line(ctx, 109, 184, 132, 197, palette.woodLight);
    rect(ctx, 78, 207, 7, 21, palette.woodDark);
    rect(ctx, 133, 207, 7, 21, palette.woodDark);
  }

  function drawWeaponRack(ctx) {
    // Suporte reservado para M002.3/M002.4. Ainda não é interativo neste passo.
    rect(ctx, 337, 173, 74, 39, palette.woodDark);
    rect(ctx, 341, 177, 66, 5, palette.wood);
    rect(ctx, 341, 202, 66, 5, palette.wood);
    for (let x = 349; x <= 397; x += 16) {
      line(ctx, x, 184, x, 201, palette.metal, 2);
      rect(ctx, x - 2, 197, 5, 4, palette.woodLight);
    }
    // Silhuetas simples de espada e arco para leitura do objeto.
    line(ctx, 356, 183, 356, 198, '#c7ced0', 2); rect(ctx, 352, 194, 8, 2, '#b78a44');
    ctx.strokeStyle = '#b8894f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(386, 191, 8, -1.15, 1.15); ctx.stroke();
    line(ctx, 389, 184, 389, 198, '#d0c8a7', 1);
  }

  function drawProps(ctx) {
    drawWindow(ctx, 151, 45); drawWindow(ctx, 329, 45);
    drawBed(ctx, 66, 57, palette.bedBlue);
    drawBed(ctx, 359, 57, palette.bedGreen);
    drawFireplace(ctx);
    drawCabinet(ctx, 282, 42, 42, 55);
    drawCabinet(ctx, 61, 127, 32, 45);
    drawChest(ctx, 97, 137, 42);
    drawChest(ctx, 367, 133, 44);
    drawTable(ctx);
    drawDesk(ctx);
    drawWeaponRack(ctx);

    // Lenha e pequenos objetos ao redor da lareira.
    for (let i = 0; i < 5; i++) {
      ellipse(ctx, 178 + i * 5, 78 - (i % 2) * 3, 5, 3, palette.woodDark);
      rect(ctx, 174 + i * 5, 76 - (i % 2) * 3, 10, 3, palette.wood);
    }
    ellipse(ctx, 315, 111, 14, 8, palette.rugDark, .5);
  }

  function renderCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = ART_W; canvas.height = ART_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawGrass(ctx);
    drawFloor(ctx);
    drawWalls(ctx);
    drawProps(ctx);
    return canvas;
  }

  function create(scene) {
    const canvas = renderCanvas();
    if (!scene.textures.exists('m002-house-map')) scene.textures.addCanvas('m002-house-map', canvas);
    const image = scene.add.image(0, 0, 'm002-house-map').setOrigin(0, 0).setScale(SCALE).setDepth(0);
    return { image, canvas };
  }

  function regionAt(x, y) {
    const lx = x / SCALE, ly = y / SCALE;
    if (lx >= 50 && lx <= 430 && ly >= 31 && ly <= 236) return 'Casa do Avô';
    return 'Exterior técnico';
  }

  window.RagbiaHouseMapV0 = {
    SCALE, ART_W, ART_H, WORLD_W, WORLD_H, spawn,
    create, renderCanvas, regionAt
  };
})();
