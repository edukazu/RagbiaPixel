(() => {
  'use strict';

  const DIRS = ['down', 'up', 'left', 'right'];

  function render(dir = 'down', frame = 0, moving = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 80; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const x = 40, y = 76;
    const pose = moving ? [0, 3, -3][frame % 3] : 0;
    const alt = moving ? [0, -3, 3][frame % 3] : 0;
    const r = (xx, yy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(xx), Math.round(yy), Math.round(w), Math.round(h)); };

    // Sombra/footprint visual.
    r(x - 25, y + 30, 50, 10, '#172c1d');

    // Botas e calças neutras.
    r(x - 15, y + 8 + pose, 11, 23, '#34291f');
    r(x + 4, y + 8 + alt, 11, 23, '#34291f');
    r(x - 17, y + 27 + pose, 14, 6, '#171817');
    r(x + 3, y + 27 + alt, 14, 6, '#171817');

    // Túnica de Aprendiz: marrom/ocre neutro, sem identidade de classe.
    const bodyDark = '#4b3827', body = '#80613c', bodyLight = '#a6814d';
    if (dir === 'left' || dir === 'right') {
      r(x - 23, y - 28, 46, 43, bodyDark);
      r(x - 19, y - 24, 38, 37, body);
      r(x - 13, y - 20, 26, 28, bodyLight);
    } else {
      r(x - 25, y - 28, 50, 43, bodyDark);
      r(x - 21, y - 24, 42, 37, body);
      r(x - 14, y - 20, 28, 28, bodyLight);
    }
    r(x - 20, y + 6, 40, 7, '#493626');
    r(x - 3, y - 15, 6, 22, '#d0aa68');

    // Braços simples; perfis reais, sem espelhar o sprite inteiro.
    const skin = '#c9946a';
    if (dir === 'left') {
      r(x + 17, y - 20 + alt, 7, 22, '#62492f'); r(x + 17, y - 1 + alt, 7, 9, skin);
      r(x - 27, y - 21 + pose, 8, 22, '#765737'); r(x - 26, y - 2 + pose, 7, 10, skin);
    } else if (dir === 'right') {
      r(x - 24, y - 20 + pose, 7, 22, '#62492f'); r(x - 24, y - 1 + pose, 7, 9, skin);
      r(x + 19, y - 21 + alt, 8, 22, '#765737'); r(x + 19, y - 2 + alt, 7, 10, skin);
    } else {
      r(x - 29, y - 21 + pose, 8, 22, '#765737'); r(x - 28, y - 2 + pose, 7, 10, skin);
      r(x + 21, y - 21 + alt, 8, 22, '#765737'); r(x + 21, y - 2 + alt, 7, 10, skin);
    }

    // Cabeça/cabelo. Frente e perfis têm olhos; costas não.
    r(x - 17, y - 61, 34, 34, '#4b3022');
    if (dir === 'up') {
      r(x - 14, y - 58, 28, 27, '#60402b');
      r(x - 11, y - 63, 22, 9, '#754a30');
    } else {
      r(x - 13, y - 55, 26, 24, skin);
      r(x - 16, y - 62, 31, 12, '#6b432c');
      r(x - 11, y - 65, 21, 7, '#805137');
      if (dir === 'down') {
        r(x - 8, y - 45, 4, 4, '#25201d'); r(x + 5, y - 45, 4, 4, '#25201d');
      } else if (dir === 'left') {
        r(x - 8, y - 45, 4, 4, '#25201d');
      } else {
        r(x + 5, y - 45, 4, 4, '#25201d');
      }
    }
    return canvas;
  }

  window.RagbiaApprenticeArtV0 = { DIRS, render };
})();
