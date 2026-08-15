(() => {
  'use strict';

  let ctx;
  let gameTime = 0;
  let player = null;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function walkFrame() {
    if (!player.moving) return 0;
    return Math.floor(player.walkT) % 3;
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


  function drawSlimeLocal(flash = false, bob = 0) {
    const jump = Math.sin(bob) > .52 ? -4 : 0;
    const squash = Math.sin(bob) > .52 ? 1 : 0;
    const x = 64, y = 62 + jump;
    rect(x - 34, y + 23, 68, 11, '#214226');
    rect(x - 29, y + 20, 58, 10, '#2d6533');
    const outline = '#174622';
    rect(x - 30 - squash, y - 11, 60 + squash * 2, 33, outline);
    rect(x - 24, y - 25, 48, 15, outline);
    rect(x - 18, y - 30, 36, 8, outline);
    const main = flash ? '#efffe9' : '#7be66f';
    rect(x - 27 - squash, y - 9, 54 + squash * 2, 28, main);
    rect(x - 21, y - 22, 42, 18, main);
    rect(x - 15, y - 26, 30, 8, main);
    rect(x - 25, y + 10, 50, 9, '#4fbd55');
    rect(x - 21, y + 17, 42, 5, '#359445');
    rect(x - 18, y - 19, 14, 6, '#b8f39d');
    rect(x - 20, y - 14, 7, 5, '#9af085');
    rect(x - 14, y - 6, 7, 10, '#16351e');
    rect(x + 8, y - 6, 7, 10, '#16351e');
    rect(x - 13, y - 5, 2, 3, '#eaffdf');
    rect(x + 9, y - 5, 2, 3, '#eaffdf');
    rect(x - 7, y + 8, 14, 4, '#277a38');
    rect(x - 4, y + 11, 8, 3, '#3ca949');
  }

  function renderCharacter(classId, dir, frame, moving) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 144;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player = {
      x: 64,
      y: 80,
      dir,
      moving,
      walkT: frame,
      attackT: 0,
      classId
    };
    gameTime = 0;
    if (classId === 'warrior') drawWarrior();
    else drawArcher();
    return canvas;
  }

  function renderSlime(frame = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 112;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlimeLocal(false, [0, 1.15, 2.3][frame % 3]);
    return canvas;
  }

  function renderArrow() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 20;
    const c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    const r = (x, y, w, h, color) => { c.fillStyle = color; c.fillRect(x, y, w, h); };
    r(8, 8, 26, 4, '#dfddc8');
    r(34, 6, 8, 8, '#d1bb76');
    r(2, 6, 6, 8, '#8d6331');
    r(0, 5, 4, 4, '#f0d89f');
    r(0, 11, 4, 4, '#f0d89f');
    return canvas;
  }

  window.RagbiaBaselineArt = { renderCharacter, renderSlime, renderArrow };
})();
