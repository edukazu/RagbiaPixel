(() => {
  'use strict';

  // M002.2B.0 — MICROTESTE AUTORAL.
  // IMPORTANTE: nenhum pixel de referência ilustrada é carregado ou reutilizado aqui.
  // A referência serve apenas como conceito de atmosfera/composição.
  const LOGICAL_W = 640;
  const LOGICAL_H = 360;
  const SCALE = 2;

  const P = Object.freeze({
    void: '#10150f',
    wallShadow: '#2a251f',
    plasterDark: '#5b5142',
    plaster: '#756a57',
    plasterLight: '#8c8068',
    timberDark: '#35251a',
    timber: '#5a3b24',
    timberLight: '#7b5130',
    stoneDark: '#3d3b38',
    stone: '#595651',
    stoneLight: '#77736b',
    floorDark: '#38271c',
    floor: '#513522',
    floorLight: '#65452b',
    brass: '#bb8a3b',
    fire1: '#e45f20',
    fire2: '#ffad3a',
    fire3: '#ffe178',
    glassDark: '#44615d',
    glass: '#89a89a',
    glassLight: '#d4d6a9',
    curtainDark: '#31452f',
    curtain: '#4e6745',
    curtainLight: '#6d8256',
  });

  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function line(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
    ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
    ctx.stroke();
  }

  function drawPlaster(ctx) {
    px(ctx, 0, 0, LOGICAL_W, 360, P.void);

    // Parede com altura real visual: vigamento superior + face vertical.
    px(ctx, 35, 18, 570, 118, P.wallShadow);
    px(ctx, 42, 24, 556, 109, P.plasterDark);
    px(ctx, 48, 29, 544, 99, P.plaster);
    px(ctx, 48, 29, 544, 8, P.plasterLight);

    // Dither manual muito contido: apenas algumas manchas grandes, nada de textura ilustrada.
    const marks = [
      [76,50,18,7],[103,91,14,6],[252,48,17,7],[286,103,22,6],
      [507,62,16,6],[550,101,19,6],[438,42,13,5],[190,111,15,5]
    ];
    for (const [x,y,w,h] of marks) px(ctx, x,y,w,h, P.plasterLight);
    for (const [x,y,w,h] of marks.slice(2,7)) px(ctx, x+5,y+5,Math.max(5,w-7),3, P.plasterDark);

    // Vigas estruturais — espessas, mas simples.
    for (const x of [38, 287, 595]) {
      px(ctx, x, 13, 16, 132, P.timberDark);
      px(ctx, x+3, 17, 10, 126, P.timber);
      px(ctx, x+5, 20, 3, 120, P.timberLight);
    }
    px(ctx, 31, 13, 578, 18, P.timberDark);
    px(ctx, 36, 17, 568, 11, P.timber);
    px(ctx, 40, 19, 560, 3, P.timberLight);

    // Rodapé / transição de plano.
    px(ctx, 39, 126, 564, 13, P.timberDark);
    px(ctx, 44, 127, 554, 7, P.timber);
    px(ctx, 44, 135, 554, 7, '#251d17');
  }

  function drawFloor(ctx) {
    // Piso começa claramente abaixo da parede.
    px(ctx, 28, 142, 584, 218, P.floorDark);
    px(ctx, 34, 147, 572, 213, P.floor);

    // Tábuas largas, poucas linhas e juntas irregulares.
    for (let y = 151; y < 360; y += 18) {
      px(ctx, 34, y, 572, 2, P.floorDark);
      px(ctx, 34, y+2, 572, 1, P.floorLight);
      const off = ((y / 18) % 2) ? 52 : 14;
      for (let x = off; x < 600; x += 94) {
        px(ctx, x, y+3, 2, 14, P.floorDark);
      }
    }

    // Zona central com menos ruído para manter legibilidade do personagem.
    px(ctx, 218, 185, 210, 150, '#4d3321');
    for (let y = 188; y < 335; y += 18) {
      px(ctx, 218, y, 210, 2, '#38271c');
      px(ctx, 218, y+2, 210, 1, '#604129');
    }
  }

  function drawWindow(ctx) {
    const x = 104, y = 45, w = 118, h = 80;

    // Nicho profundo na parede.
    px(ctx, x-8, y-7, w+16, h+14, P.timberDark);
    px(ctx, x-3, y-3, w+6, h+6, P.timber);
    px(ctx, x+5, y+5, w-10, h-10, '#2b2924');

    // Vidro simples, dividido em painéis.
    px(ctx, x+14, y+11, w-28, h-22, P.glassDark);
    px(ctx, x+18, y+15, w-36, h-30, P.glass);
    px(ctx, x+22, y+18, 25, 18, P.glassLight);
    px(ctx, x+52, y+18, 25, 18, '#adc0a6');
    px(ctx, x+22, y+41, 25, 17, '#78988b');
    px(ctx, x+52, y+41, 25, 17, '#91aa97');

    // Cruz central.
    px(ctx, x+48, y+13, 5, 50, P.timberDark);
    px(ctx, x+16, y+37, 66, 5, P.timberDark);

    // Cortinas: silhueta simples; sem drapeado ilustrado.
    px(ctx, x-17, y+3, 16, 65, P.curtainDark);
    px(ctx, x-13, y+7, 10, 56, P.curtain);
    px(ctx, x+w+1, y+3, 16, 65, P.curtainDark);
    px(ctx, x+w+4, y+7, 10, 56, P.curtain);
    px(ctx, x-15, y+50, 12, 5, P.curtainLight);
    px(ctx, x+w+4, y+50, 12, 5, P.curtainLight);

    // Peitoril com espessura.
    px(ctx, x-11, y+h+2, w+22, 11, P.timberDark);
    px(ctx, x-7, y+h+2, w+14, 5, P.timberLight);
  }

  function drawFireplace(ctx) {
    const x = 334, y = 39, w = 158, h = 121;

    // Massa de pedra: blocos desenhados, sem textura fotográfica.
    px(ctx, x-8, y, w+16, h, P.stoneDark);
    px(ctx, x, y+7, w, h-14, P.stone);
    px(ctx, x+5, y+12, w-10, h-24, P.stoneLight);

    // Blocos maiores para quebrar geometria sem microdetalhe.
    const blocks = [
      [x+7,y+13,35,18],[x+46,y+13,42,18],[x+92,y+13,57,18],
      [x+6,y+35,47,21],[x+57,y+35,38,21],[x+99,y+35,51,21],
      [x+6,y+60,34,22],[x+44,y+60,48,22],[x+96,y+60,54,22]
    ];
    for (const [bx,by,bw,bh] of blocks) {
      px(ctx,bx,by,bw,bh,P.stone);
      px(ctx,bx,by,bw,2,P.stoneLight);
      px(ctx,bx+bw-2,by,2,bh,P.stoneDark);
    }

    // Boca em arco aproximado por degraus.
    px(ctx, x+41, y+48, 76, 57, '#211913');
    px(ctx, x+34, y+60, 90, 45, '#211913');
    px(ctx, x+47, y+42, 64, 8, '#211913');

    // Fogo em clusters grandes.
    px(ctx, x+64, y+74, 30, 25, P.fire1);
    px(ctx, x+70, y+65, 17, 33, P.fire2);
    px(ctx, x+76, y+59, 8, 37, P.fire3);
    px(ctx, x+55, y+91, 49, 7, P.fire2);

    // Pedra do piso/hearth avançando no chão.
    px(ctx, x+22, y+102, 116, 28, P.stoneDark);
    px(ctx, x+28, y+105, 104, 17, P.stone);
    px(ctx, x+28, y+105, 104, 4, P.stoneLight);

    // Prateleira simples.
    px(ctx, x-13, y+30, w+26, 11, P.timberDark);
    px(ctx, x-8, y+30, w+16, 5, P.timberLight);
  }

  function drawBase() {
    const canvas = document.createElement('canvas');
    canvas.width = LOGICAL_W;
    canvas.height = LOGICAL_H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    drawPlaster(ctx);
    drawFloor(ctx);
    drawWindow(ctx);
    drawFireplace(ctx);

    // Pequena faixa de sombra ambiente para separar parede e piso.
    px(ctx, 48, 139, 544, 5, '#1c1814');

    return canvas;
  }

  function drawWoodpile() {
    const canvas = document.createElement('canvas');
    canvas.width = 104;
    canvas.height = 54;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Um único prop simples, construído com clusters, não com textura.
    px(ctx, 7, 29, 90, 18, P.timberDark);
    const logs = [
      [13,26,28,13],[38,21,28,16],[61,27,30,13],
      [20,14,28,15],[48,9,28,17],[70,15,23,14]
    ];
    for (const [x,y,w,h] of logs) {
      px(ctx,x,y,w,h,'#6a4327');
      px(ctx,x+3,y+3,w-6,h-6,'#8a5930');
      px(ctx,x+w-8,y+3,6,h-6,'#c18a4e');
      px(ctx,x+w-6,y+5,2,h-10,'#6c4429');
    }
    px(ctx, 5, 45, 94, 4, '#241a14');
    return canvas;
  }

  window.RagbiaMicrotestArtV0 = {
    LOGICAL_W, LOGICAL_H, SCALE, palette: P,
    drawBase, drawWoodpile
  };
})();
