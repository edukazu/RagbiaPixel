(() => {
  'use strict';

  // M001.1C — Tratamento Visual do Mapa Beta 01
  // O mundo continua exatamente com 4608x2688. A arte é desenhada em uma
  // malha lógica 4x menor e ampliada com nearest-neighbor. Isso força uma
  // linguagem pixel consistente sem mudar câmera, coordenadas ou gameplay.
  const WORLD_W = 4608;
  const WORLD_H = 2688;
  const PIXEL_SCALE = 4;
  const ART_W = WORLD_W / PIXEL_SCALE;   // 1152
  const ART_H = WORLD_H / PIXEL_SCALE;  // 672

  const CHUNK_W = 1536;
  const CHUNK_H = 1344;
  const CHUNK_COLS = 3;
  const CHUNK_ROWS = 2;
  const ART_CHUNK_W = CHUNK_W / PIXEL_SCALE;
  const ART_CHUNK_H = CHUNK_H / PIXEL_SCALE;

  const spawn = { x: 720, y: 1910 };

  const slimeSpawns = [
    { x: 1110, y: 1700 }, { x: 1460, y: 1480 },
    { x: 2010, y: 1780 }, { x: 2460, y: 1270 },
    { x: 2820, y: 860 },  { x: 3290, y: 1650 },
    { x: 3690, y: 1090 }, { x: 4100, y: 720 }
  ];

  const palette = {
    grass0: '#2b6538',
    grass1: '#347642',
    grass2: '#3f8248',
    grass3: '#4b8d50',
    grassDark: '#245631',
    grassShade: '#1e482a',
    grassDry: '#6f8748',
    dirtDark: '#72573a',
    dirt: '#9a784b',
    dirtLight: '#b08d59',
    dirtPale: '#c2a36d',
    mud: '#69513a',
    waterDark: '#173f4d',
    water: '#1e6271',
    waterLight: '#2b7e88',
    waterGlint: '#62a5a2',
    bankDark: '#5b5534',
    bank: '#7f7348',
    stoneDark: '#4d5651',
    stone: '#69736c',
    stoneLight: '#8a948b',
    woodDark: '#4f3525',
    wood: '#765033',
    woodLight: '#9c7043',
    wallDark: '#736348',
    wall: '#aa9468',
    wallLight: '#c6b17c',
    roofDark: '#573426',
    roof: '#75442f',
    roofLight: '#96593b',
    roofHi: '#b66f45',
    leafDark: '#1f4c2b',
    leaf: '#2e6a39',
    leafMid: '#3e7f42',
    leafLight: '#57924d',
    flowerA: '#d7c96b',
    flowerB: '#d58b92',
    flowerC: '#9ec5cf',
    shadow: '#173c26'
  };

  function mulberry32(seed) {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function rect(ctx, x, y, w, h, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
    ctx.restore();
  }

  function poly(ctx, color, points, alpha = 1) {
    if (!points.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
    for (let i = 1; i < points.length; i++) ctx.lineTo(Math.round(points[i][0]), Math.round(points[i][1]));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function ellipse(ctx, x, y, w, h, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(Math.round(x), Math.round(y), Math.round(w / 2), Math.round(h / 2), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function line(ctx, x1, y1, x2, y2, width, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, width);
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
    ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
    ctx.stroke();
    ctx.restore();
  }

  function drawGrassBase(ctx) {
    rect(ctx, 0, 0, ART_W, ART_H, palette.grass0);

    // Grandes manchas orgânicas: dão leitura de terreno sem virar ruído.
    poly(ctx, palette.grass1, [[0,0],[388,0],[356,106],[284,151],[186,240],[0,225]]);
    poly(ctx, palette.grassDark, [[758,0],[1152,0],[1152,282],[1051,261],[960,205],[843,145]]);
    poly(ctx, palette.grass2, [[0,510],[193,482],[341,526],[447,672],[0,672]]);
    poly(ctx, palette.grass1, [[700,470],[884,419],[1074,454],[1152,559],[1152,672],[744,672]]);
    poly(ctx, palette.grass3, [[455,22],[628,4],[710,95],[646,161],[499,146]]);
    poly(ctx, palette.grassShade, [[38,323],[186,301],[274,335],[254,397],[85,410]]);

    const rnd = mulberry32(0x15082026);

    // Patches de 2–6 pixels lógicos criam um tapete visual, não "confete".
    for (let i = 0; i < 1450; i++) {
      const x = Math.floor(rnd() * ART_W);
      const y = Math.floor(rnd() * ART_H);
      const roll = rnd();
      const col = roll < .36 ? palette.grass1 : roll < .70 ? palette.grass2 : roll < .90 ? palette.grassDark : palette.grassDry;
      const w = 1 + Math.floor(rnd() * 3);
      const h = 1 + Math.floor(rnd() * 2);
      rect(ctx, x, y, w, h, col, .66);
      if (rnd() > .83) rect(ctx, x + 1, y - 1, 1, 1, palette.grass3, .72);
    }
  }

  function roadOuter() {
    return [[0,538],[130,500],[234,454],[356,420],[486,392],[614,326],[719,255],[818,190],[902,127],[874,81],[787,148],[690,209],[588,275],[470,338],[350,367],[215,405],[104,449],[0,475]];
  }

  function roadInner() {
    return [[0,515],[120,479],[226,435],[350,400],[480,373],[605,307],[710,238],[806,175],[884,110],[870,96],[790,155],[696,218],[594,282],[472,351],[343,378],[220,415],[109,459],[0,493]];
  }

  function drawRoad(ctx) {
    poly(ctx, palette.dirtDark, roadOuter());
    poly(ctx, palette.dirt, roadInner());

    // Bordas quebradas e tufos ajudam a estrada a parecer integrada ao campo.
    const rnd = mulberry32(61477);
    for (let i = 0; i < 320; i++) {
      const t = rnd();
      const x = Math.round(t * 900);
      const yCenter = 510 - t * 400 + Math.sin(t * 8.8) * 18;
      const side = rnd() > .5 ? -1 : 1;
      const y = Math.round(yCenter + side * (22 + rnd() * 19));
      rect(ctx, x, y, 1 + Math.floor(rnd()*3), 1, rnd() > .5 ? palette.grassDry : palette.grass1, .9);
    }

    // Marcas de roda / áreas mais pisadas.
    line(ctx, 42, 501, 830, 124, 3, palette.dirtLight, .38);
    line(ctx, 32, 518, 842, 138, 2, palette.mud, .34);
    line(ctx, 85, 485, 722, 191, 1, palette.dirtPale, .42);

    // Pedrinhas discretas.
    for (let i = 0; i < 120; i++) {
      const t = rnd();
      const x = Math.round(t * 875);
      const y = Math.round(503 - t * 389 + (rnd() - .5) * 26);
      const col = rnd() > .55 ? palette.dirtLight : palette.mud;
      rect(ctx, x, y, rnd() > .85 ? 2 : 1, 1, col, .7);
    }

    // Ramal para o núcleo beta.
    poly(ctx, palette.dirtDark, [[458,370],[515,348],[542,409],[570,469],[637,521],[621,552],[539,493],[505,425]]);
    poly(ctx, palette.dirtLight, [[476,367],[505,360],[529,415],[557,465],[629,519],[619,535],[552,477],[522,418]]);
  }

  function drawRiver(ctx) {
    const bank = [[861,0],[1024,0],[1000,118],[1036,205],[1000,304],[1046,383],[1002,493],[1068,575],[1040,672],[883,672],[912,579],[866,482],[905,391],[861,303],[895,211],[865,117]];
    const water = [[884,0],[1001,0],[978,119],[1013,205],[978,303],[1024,383],[980,493],[1044,575],[1015,672],[910,672],[938,579],[892,482],[930,391],[887,303],[921,211],[892,117]];
    const inner = [[905,0],[979,0],[958,119],[991,205],[956,303],[1001,383],[958,493],[1022,575],[994,672],[930,672],[956,579],[912,482],[950,391],[909,303],[942,211],[915,117]];

    poly(ctx, palette.bankDark, bank);
    poly(ctx, palette.bank, water);
    poly(ctx, palette.waterDark, water);
    poly(ctx, palette.water, inner);

    // Sombras e espuma/ondas em segmentos curtos, mantendo pixel art.
    const rnd = mulberry32(76321);
    for (let i = 0; i < 150; i++) {
      const y = Math.floor(rnd() * ART_H);
      const center = 946 + Math.sin(y * .041) * 18 + Math.sin(y * .013) * 10;
      const x = Math.round(center + (rnd() - .5) * 48);
      const len = 2 + Math.floor(rnd() * 7);
      const col = rnd() > .35 ? palette.waterLight : palette.waterGlint;
      rect(ctx, x, y, len, 1, col, rnd() > .7 ? .92 : .6);
    }

    // Pedras nas margens para quebrar o recorte.
    for (const [x,y] of [[873,82],[1007,148],[875,268],[1014,331],[879,438],[1029,529],[894,625]]) {
      drawRock(ctx, x, y, .42);
    }
  }

  function drawBridge(ctx) {
    // Ponte sobre o ponto onde a estrada encontra o rio. Sem colisão ainda.
    rect(ctx, 875, 127, 137, 49, palette.woodDark);
    rect(ctx, 880, 131, 127, 39, palette.wood);
    for (let x = 883; x < 1007; x += 10) {
      rect(ctx, x, 133, 7, 35, x % 20 === 3 ? palette.woodLight : palette.wood);
      rect(ctx, x, 133, 1, 35, palette.woodDark, .62);
    }
    rect(ctx, 876, 126, 136, 4, palette.woodLight);
    rect(ctx, 876, 171, 136, 4, palette.woodDark);
    for (let x = 882; x <= 1006; x += 31) {
      rect(ctx, x, 120, 3, 13, palette.woodDark);
      rect(ctx, x, 168, 3, 13, palette.woodDark);
    }
  }

  function drawTree(ctx, x, y, scale = 1, variant = 0) {
    const s = scale;
    const sx = n => Math.round(n * s);

    ellipse(ctx, x + sx(2), y + sx(13), sx(27), sx(9), palette.shadow, .35);
    rect(ctx, x - sx(3), y + sx(5), sx(6), sx(17), palette.woodDark);
    rect(ctx, x - sx(2), y + sx(5), sx(4), sx(16), palette.wood);
    rect(ctx, x, y + sx(7), sx(2), sx(7), palette.woodLight, .8);

    const dark = variant === 1 ? '#214b30' : palette.leafDark;
    const mid = variant === 2 ? '#366d3a' : palette.leaf;
    const light = variant === 2 ? '#629555' : palette.leafLight;

    // Copa em blocos sobrepostos, mais natural que retângulo único.
    ellipse(ctx, x - sx(10), y - sx(2), sx(22), sx(18), dark);
    ellipse(ctx, x + sx(8), y - sx(3), sx(23), sx(19), dark);
    ellipse(ctx, x, y - sx(12), sx(28), sx(24), mid);
    ellipse(ctx, x - sx(8), y - sx(10), sx(18), sx(17), palette.leafMid);
    ellipse(ctx, x + sx(7), y - sx(13), sx(18), sx(17), palette.leafMid);
    rect(ctx, x - sx(10), y - sx(18), sx(7), sx(4), light, .9);
    rect(ctx, x + sx(4), y - sx(20), sx(8), sx(4), light, .86);
    rect(ctx, x - sx(16), y - sx(7), sx(5), sx(3), palette.leafLight, .72);
  }

  function drawRock(ctx, x, y, scale = 1) {
    const s = scale;
    const w = Math.max(3, Math.round(12 * s));
    const h = Math.max(2, Math.round(8 * s));
    ellipse(ctx, x + 1, y + 3, w + 4, Math.max(2, h / 2), palette.shadow, .28);
    poly(ctx, palette.stoneDark, [[x-w/2,y+2],[x-w*.36,y-h*.35],[x+w*.22,y-h/2],[x+w/2,y],[x+w*.36,y+h*.35],[x-w*.25,y+h*.42]]);
    poly(ctx, palette.stone, [[x-w*.36,y],[x-w*.2,y-h*.35],[x+w*.18,y-h*.43],[x+w*.34,y],[x+w*.18,y+h*.18],[x-w*.3,y+h*.2]]);
    rect(ctx, x - Math.round(w*.18), y - Math.round(h*.28), Math.max(1, Math.round(w*.28)), 1, palette.stoneLight, .85);
  }

  function drawFence(ctx, x, y, count, horizontal = true) {
    const gap = 12;
    for (let i = 0; i < count; i++) {
      const px = x + (horizontal ? i * gap : 0);
      const py = y + (horizontal ? 0 : i * gap);
      rect(ctx, px - 1, py - 5, 3, 11, palette.woodDark);
      rect(ctx, px, py - 5, 1, 2, palette.woodLight);
      if (i < count - 1) {
        if (horizontal) {
          rect(ctx, px + 1, py - 2, gap, 2, palette.wood);
          rect(ctx, px + 1, py + 2, gap, 2, palette.woodDark);
        } else {
          rect(ctx, px - 2, py + 1, 2, gap, palette.wood);
          rect(ctx, px + 2, py + 1, 2, gap, palette.woodDark);
        }
      }
    }
  }

  function drawHouse(ctx, x, y, w = 70, h = 47, variant = 0) {
    const roofMain = variant === 1 ? '#68412f' : variant === 2 ? '#684735' : palette.roof;
    const roofLight = variant === 1 ? '#8d593b' : palette.roofLight;

    ellipse(ctx, x + w / 2 + 4, y + h + 4, w + 16, 12, palette.shadow, .32);

    // Parede com contorno e base sombreada.
    rect(ctx, x, y + 14, w, h - 14, palette.wallDark);
    rect(ctx, x + 2, y + 16, w - 4, h - 18, palette.wall);
    rect(ctx, x + 3, y + 17, w - 6, 4, palette.wallLight, .75);
    rect(ctx, x + 2, y + h - 6, w - 4, 4, palette.wallDark, .7);

    // Telhado em degraus. A silhueta fica pixelada sem parecer só uma barra.
    rect(ctx, x - 6, y + 8, w + 12, 7, palette.roofDark);
    rect(ctx, x - 3, y + 4, w + 6, 7, roofMain);
    rect(ctx, x + 2, y, w - 4, 7, roofLight);
    rect(ctx, x + 8, y - 3, w - 16, 5, palette.roofHi, .8);

    for (let tx = x + 5; tx < x + w - 4; tx += 9) {
      rect(ctx, tx, y + 5, 6, 1, palette.roofDark, .7);
      rect(ctx, tx + 2, y + 1, 5, 1, palette.roofDark, .5);
    }

    // Porta e janelas.
    const doorX = Math.round(x + w * .43);
    rect(ctx, doorX, y + h - 17, 12, 17, palette.woodDark);
    rect(ctx, doorX + 2, y + h - 15, 8, 15, palette.wood);
    rect(ctx, doorX + 8, y + h - 8, 1, 1, '#d7c070');

    for (const wx of [x + 9, x + w - 20]) {
      rect(ctx, wx - 1, y + 25, 12, 10, palette.woodDark);
      rect(ctx, wx, y + 24, 10, 9, '#47727a');
      rect(ctx, wx + 1, y + 25, 8, 2, '#7ca5a3');
      rect(ctx, wx + 4, y + 24, 1, 9, palette.wallLight, .65);
      rect(ctx, wx, y + 28, 10, 1, palette.wallLight, .65);
    }

    // Pequenos detalhes de reboco/pedra.
    rect(ctx, x + 5, y + 39, 7, 2, palette.wallLight, .46);
    rect(ctx, x + w - 15, y + 42, 9, 2, palette.wallDark, .55);
  }

  function drawField(ctx, x, y, w, h) {
    rect(ctx, x, y, w, h, '#8d7b48');
    rect(ctx, x + 2, y + 2, w - 4, h - 4, '#9d8d54');
    for (let yy = y + 5; yy < y + h - 3; yy += 6) {
      line(ctx, x + 4, yy, x + w - 4, yy, 1, '#705f3c', .8);
      for (let xx = x + 7; xx < x + w - 5; xx += 10) {
        rect(ctx, xx + ((yy/6)%2 ? 2 : 0), yy - 2, 1, 2, '#c0a35d', .9);
      }
    }
  }

  function drawRuins(ctx) {
    // Ruínas do norte: um marco visual forte e futuro laboratório de colisão.
    const x = 745, y = 128;
    ellipse(ctx, x + 38, y + 45, 90, 24, palette.shadow, .28);
    rect(ctx, x, y, 64, 6, palette.stoneDark);
    rect(ctx, x, y, 7, 45, palette.stone);
    rect(ctx, x + 55, y, 7, 45, palette.stone);
    rect(ctx, x + 12, y + 13, 12, 33, palette.stoneDark);
    rect(ctx, x + 38, y + 20, 13, 26, palette.stoneDark);
    rect(ctx, x + 3, y + 2, 58, 3, palette.stoneLight, .55);
    rect(ctx, x + 69, y + 25, 19, 6, palette.stone);
    rect(ctx, x + 82, y + 17, 6, 14, palette.stoneDark);
    drawRock(ctx, x - 12, y + 42, .75);
    drawRock(ctx, x + 95, y + 44, .62);
  }

  function drawVillage(ctx) {
    // Clareira inicial / posto rural.
    ellipse(ctx, 178, 478, 206, 134, '#4b8448', .7);
    drawHouse(ctx, 103, 381, 76, 50, 0);
    drawFence(ctx, 81, 453, 10, true);
    drawFence(ctx, 81, 453, 5, false);
    drawField(ctx, 133, 454, 70, 42);
    drawTree(ctx, 74, 414, .92, 2);
    drawTree(ctx, 201, 421, .82, 0);

    // Núcleo beta: pequeno agrupamento, mas sem se comprometer com vila final.
    ellipse(ctx, 605, 474, 152, 96, '#9a8050', .65);
    drawHouse(ctx, 555, 418, 68, 47, 1);
    drawHouse(ctx, 646, 441, 59, 43, 2);
    drawHouse(ctx, 577, 522, 63, 44, 0);
    drawFence(ctx, 525, 565, 16, true);
    drawFence(ctx, 525, 505, 6, false);
    drawField(ctx, 652, 521, 71, 47);
    drawTree(ctx, 531, 466, .83, 1);
    drawTree(ctx, 724, 493, .92, 0);
  }

  function drawForestBands(ctx) {
    const trees = [
      [41,65,1.08,0],[83,96,.94,2],[131,58,1.07,1],[184,105,.91,0],[238,65,1.12,2],[296,106,.92,1],
      [361,61,1.03,0],[425,96,.92,2],[493,62,1.10,1],[557,94,.91,0],[630,63,1.04,2],[708,106,.90,1],
      [45,230,1.00,1],[95,267,.88,0],[164,224,1.08,2],[247,267,.92,1],[320,225,1.00,0],[393,260,.87,2],
      [766,70,.96,2],[815,60,.88,0],[1072,78,1.08,1],[1118,128,.94,0],[1085,220,1.06,2],[1120,293,.90,1],
      [53,615,1.10,0],[133,580,.92,2],[229,616,1.06,1],[334,591,.90,0],[411,631,1.08,2],
      [744,596,.98,1],[809,631,1.08,0],[869,572,.91,2],[1096,612,1.09,1]
    ];
    trees.forEach(v => drawTree(ctx, ...v));

    // Bosques menores: clusters não uniformes.
    const rnd = mulberry32(199503);
    const clusters = [
      [120,160,95,45,13], [292,150,105,38,13], [505,180,80,34,10],
      [1084,380,58,90,12], [795,540,75,45,10], [370,550,65,36,8]
    ];
    for (const [cx,cy,rx,ry,count] of clusters) {
      for (let i = 0; i < count; i++) {
        const a = rnd() * Math.PI * 2;
        const r = Math.sqrt(rnd());
        drawTree(ctx,
          Math.round(cx + Math.cos(a) * rx * r),
          Math.round(cy + Math.sin(a) * ry * r),
          .66 + rnd() * .34,
          Math.floor(rnd() * 3));
      }
    }
  }

  function drawAmbientDetails(ctx) {
    const rnd = mulberry32(8877331);

    // Pedras menores e manchas secas.
    for (let i = 0; i < 115; i++) {
      const x = 18 + Math.floor(rnd() * (ART_W - 36));
      const y = 18 + Math.floor(rnd() * (ART_H - 36));
      if (x > 850 && x < 1060) continue; // rio
      if (rnd() < .58) drawRock(ctx, x, y, .28 + rnd() * .28);
      else {
        rect(ctx, x, y, 2 + Math.floor(rnd()*4), 1 + Math.floor(rnd()*2), palette.grassDry, .45);
      }
    }

    // Flores em pequenos agrupamentos, evitando distribuição homogênea.
    const flowerSpots = [[250,310],[420,305],[330,470],[155,542],[695,355],[777,466],[1040,335],[839,252]];
    const cols = [palette.flowerA, palette.flowerB, palette.flowerC];
    for (const [cx,cy] of flowerSpots) {
      const n = 8 + Math.floor(rnd()*9);
      for (let i = 0; i < n; i++) {
        const x = Math.round(cx + (rnd()-.5)*50);
        const y = Math.round(cy + (rnd()-.5)*32);
        rect(ctx, x, y, 1, 1, cols[Math.floor(rnd()*cols.length)], .9);
        if (rnd() > .62) rect(ctx, x, y+1, 1, 1, palette.grassDark, .9);
      }
    }
  }

  function drawWholeMapLogical(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    drawGrassBase(ctx);
    drawRoad(ctx);
    drawRiver(ctx);
    drawBridge(ctx);
    drawVillage(ctx);
    drawRuins(ctx);
    drawForestBands(ctx);
    drawAmbientDetails(ctx);

    // Marco de madeira perto do spawn — somente leitura visual por enquanto.
    rect(ctx, 191, 463, 3, 16, palette.woodDark);
    rect(ctx, 194, 464, 16, 7, palette.wood);
    rect(ctx, 195, 465, 14, 2, palette.woodLight);
  }

  function renderPreview(canvas) {
    canvas.width = ART_W;
    canvas.height = ART_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawWholeMapLogical(canvas);
    return canvas;
  }

  function create(scene) {
    // A arte-base fica pequena (1152x672). Cada região é ampliada 4x para
    // o chunk final com nearest-neighbor, garantindo pixel uniforme.
    const master = document.createElement('canvas');
    master.width = ART_W;
    master.height = ART_H;
    drawWholeMapLogical(master);

    const chunkImages = [];
    for (let row = 0; row < CHUNK_ROWS; row++) {
      for (let col = 0; col < CHUNK_COLS; col++) {
        const chunk = document.createElement('canvas');
        chunk.width = CHUNK_W;
        chunk.height = CHUNK_H;
        const c = chunk.getContext('2d');
        c.imageSmoothingEnabled = false;
        c.drawImage(
          master,
          col * ART_CHUNK_W, row * ART_CHUNK_H, ART_CHUNK_W, ART_CHUNK_H,
          0, 0, CHUNK_W, CHUNK_H
        );
        const key = `map-beta-${col}-${row}`;
        scene.textures.addCanvas(key, chunk);
        const image = scene.add.image(col * CHUNK_W, row * CHUNK_H, key).setOrigin(0, 0).setDepth(0);
        chunkImages.push(image);
      }
    }

    master.width = 1;
    master.height = 1;
    return { chunks: chunkImages };
  }

  function regionAt(x, y) {
    if (x < 1350 && y > 1400) return 'Clareira Sul';
    if (x > 1900 && x < 3000 && y > 1500) return 'Núcleo Beta';
    if (x > 3380 && x < 4260) return 'Margem do Rio';
    if (x > 2750 && y < 900) return 'Ruínas do Norte';
    if (y < 1050) return 'Campos do Norte';
    return 'Estrada Central';
  }

  window.RagbiaMapBeta = {
    WORLD_W, WORLD_H, PIXEL_SCALE,
    CHUNK_W, CHUNK_H,
    spawn, slimeSpawns,
    create, renderPreview, regionAt
  };
})();
