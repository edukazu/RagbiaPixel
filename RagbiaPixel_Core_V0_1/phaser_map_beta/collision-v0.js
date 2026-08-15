(() => {
  'use strict';

  // M001.3C — Colisão V0 de cenário + entidades sólidas
  // Camada lógica independente da arte. Todas as medidas estão em coordenadas
  // do mundo (4608x2688). O mapa pode ser substituído sem alterar este módulo.
  const SCALE = 4;
  const WORLD_W = 4608;
  const WORLD_H = 2688;
  const PLAYER_RADIUS = 20;
  const PLAYER_FOOT_OFFSET_Y = 28;
  const ENTITY_DEFAULT_RADIUS = 30;
  const ENTITY_DEFAULT_OFFSET_Y = 22;

  const shapes = [];
  const L = n => Math.round(n * SCALE);

  const addRect = (id, x, y, w, h, group = 'obstacle') => shapes.push({ id, type: 'rect', x, y, w, h, group });
  const addCircle = (id, x, y, r, group = 'obstacle') => shapes.push({ id, type: 'circle', x, y, r, group });
  const addPoly = (id, points, group = 'obstacle') => shapes.push({ id, type: 'poly', points, group });

  // -------------------------------------------------------------------------
  // CONSTRUÇÕES — footprint deliberadamente simples no V0.
  // -------------------------------------------------------------------------
  addRect('casa-sul', L(97), L(376), L(88), L(60), 'building');
  addRect('casa-nucleo-oeste', L(550), L(413), L(80), L(59), 'building');
  addRect('casa-nucleo-leste', L(640), L(436), L(72), L(54), 'building');
  addRect('casa-nucleo-sul', L(571), L(517), L(75), L(55), 'building');

  // -------------------------------------------------------------------------
  // CERCAS — barras finas independentes. Há espaço para contorná-las.
  // -------------------------------------------------------------------------
  addRect('cerca-sul-horizontal', L(80), L(449), L(112), L(8), 'fence');
  addRect('cerca-sul-vertical', L(77), L(450), L(8), L(58), 'fence');
  addRect('cerca-nucleo-horizontal', L(523), L(561), L(188), L(8), 'fence');
  addRect('cerca-nucleo-vertical', L(521), L(503), L(8), L(66), 'fence');

  // -------------------------------------------------------------------------
  // RUÍNAS — somente alvenaria estrutural visível.
  // -------------------------------------------------------------------------
  addRect('ruina-topo', L(743), L(126), L(68), L(10), 'ruin');
  addRect('ruina-esquerda', L(742), L(126), L(11), L(49), 'ruin');
  addRect('ruina-direita', L(798), L(126), L(11), L(49), 'ruin');
  addRect('ruina-coluna-a', L(755), L(139), L(15), L(36), 'ruin');
  addRect('ruina-coluna-b', L(780), L(146), L(16), L(29), 'ruin');
  addRect('ruina-fragmento', L(813), L(150), L(25), L(12), 'ruin');

  // -------------------------------------------------------------------------
  // RIO — água bloqueia. A faixa da ponte (aprox. Y 504–704) fica livre.
  // Polígonos aproximam o desenho do rio sem acoplar colisão à imagem.
  // -------------------------------------------------------------------------
  addPoly('rio-norte', [
    [L(884), L(0)], [L(1001), L(0)], [L(978), L(119)], [L(1009), L(126)],
    [L(1009), L(126)], [L(878), L(126)], [L(892), L(117)]
  ], 'water');

  addPoly('rio-sul', [
    [L(897), L(176)], [L(1008), L(176)], [L(978), L(205)], [L(978), L(303)],
    [L(1024), L(383)], [L(980), L(493)], [L(1044), L(575)], [L(1015), L(672)],
    [L(910), L(672)], [L(938), L(579)], [L(892), L(482)], [L(930), L(391)],
    [L(887), L(303)], [L(921), L(211)]
  ], 'water');

  // -------------------------------------------------------------------------
  // ÁRVORES — colisor apenas no tronco/base, não na copa.
  // Reproduzimos os mesmos pontos estáticos e clusters determinísticos usados
  // por map-beta.js para que a arte e a lógica continuem separadas, mas coerentes.
  // -------------------------------------------------------------------------
  const staticTrees = [
    [41,65,1.08],[83,96,.94],[131,58,1.07],[184,105,.91],[238,65,1.12],[296,106,.92],
    [361,61,1.03],[425,96,.92],[493,62,1.10],[557,94,.91],[630,63,1.04],[708,106,.90],
    [45,230,1.00],[95,267,.88],[164,224,1.08],[247,267,.92],[320,225,1.00],[393,260,.87],
    [766,70,.96],[815,60,.88],[1072,78,1.08],[1118,128,.94],[1085,220,1.06],[1120,293,.90],
    [53,615,1.10],[133,580,.92],[229,616,1.06],[334,591,.90],[411,631,1.08],
    [744,596,.98],[809,631,1.08],[869,572,.91],[1096,612,1.09],
    // árvores desenhadas junto às áreas rurais
    [74,414,.92],[201,421,.82],[531,466,.83],[724,493,.92]
  ];

  staticTrees.forEach(([x, y, s], i) => {
    addCircle(`tree-static-${i}`, L(x), L(y + 14 * s), Math.max(22, L(7.2 * s)), 'tree');
  });

  function mulberry32(seed) {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const rndTrees = mulberry32(199503);
  const clusters = [
    [120,160,95,45,13], [292,150,105,38,13], [505,180,80,34,10],
    [1084,380,58,90,12], [795,540,75,45,10], [370,550,65,36,8]
  ];
  let clusterIndex = 0;
  for (const [cx, cy, rx, ry, count] of clusters) {
    for (let i = 0; i < count; i++) {
      const a = rndTrees() * Math.PI * 2;
      const r = Math.sqrt(rndTrees());
      const x = Math.round(cx + Math.cos(a) * rx * r);
      const y = Math.round(cy + Math.sin(a) * ry * r);
      const s = .66 + rndTrees() * .34;
      rndTrees(); // variant: Math.floor(rnd()*3), consumido no mapa visual
      addCircle(`tree-cluster-${clusterIndex++}`, L(x), L(y + 14 * s), Math.max(20, L(7 * s)), 'tree');
    }
  }

  // -------------------------------------------------------------------------
  // PEDRAS — regra refinada após validação do M001.2.
  // Pedrinhas pequenas/decorativas NÃO bloqueiam movimento. Apenas rochas
  // visualmente relevantes/maiores recebem colisão. As duas pedras junto às
  // ruínas são mantidas como exemplos de rocha física.
  // Plaquinhas decorativas também permanecem sem colisão.
  // -------------------------------------------------------------------------
  addCircle('rock-ruin-a', L(733), L(172), L(7), 'rock');
  addCircle('rock-ruin-b', L(840), L(172), L(6), 'rock');

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function circleVsRect(cx, cy, r, s) {
    const nx = clamp(cx, s.x, s.x + s.w);
    const ny = clamp(cy, s.y, s.y + s.h);
    const dx = cx - nx, dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  function circleVsCircle(cx, cy, r, s) {
    const dx = cx - s.x, dy = cy - s.y;
    const rr = r + s.r;
    return dx * dx + dy * dy < rr * rr;
  }

  function pointInPoly(x, y, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1];
      const xj = pts[j][0], yj = pts[j][1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function pointSegmentDistanceSq(px, py, ax, ay, bx, by) {
    const abx = bx - ax, aby = by - ay;
    const apx = px - ax, apy = py - ay;
    const denom = abx * abx + aby * aby;
    const t = denom > 0 ? clamp((apx * abx + apy * aby) / denom, 0, 1) : 0;
    const qx = ax + abx * t, qy = ay + aby * t;
    const dx = px - qx, dy = py - qy;
    return dx * dx + dy * dy;
  }

  function circleVsPoly(cx, cy, r, s) {
    if (pointInPoly(cx, cy, s.points)) return true;
    const rr = r * r;
    for (let i = 0, j = s.points.length - 1; i < s.points.length; j = i++) {
      const a = s.points[j], b = s.points[i];
      if (pointSegmentDistanceSq(cx, cy, a[0], a[1], b[0], b[1]) < rr) return true;
    }
    return false;
  }

  function collidesWorldCircle(cx, cy, r) {
    if (cx - r < 0 || cx + r > WORLD_W || cy - r < 0 || cy + r > WORLD_H) {
      return { hit: true, shape: { id: 'world-bounds', type: 'bounds', group: 'bounds' } };
    }
    for (const s of shapes) {
      let hit = false;
      if (s.type === 'rect') hit = circleVsRect(cx, cy, r, s);
      else if (s.type === 'circle') hit = circleVsCircle(cx, cy, r, s);
      else if (s.type === 'poly') hit = circleVsPoly(cx, cy, r, s);
      if (hit) return { hit: true, shape: s };
    }
    return { hit: false, shape: null };
  }

  function entityColliderFor(entity) {
    if (!entity || entity.alive !== true || entity.solid !== true) return null;
    const r = Number.isFinite(entity.collisionRadius) ? entity.collisionRadius : ENTITY_DEFAULT_RADIUS;
    const oy = Number.isFinite(entity.collisionOffsetY) ? entity.collisionOffsetY : ENTITY_DEFAULT_OFFSET_Y;
    return {
      id: entity.id || 'entity',
      entityId: entity.id || null,
      type: 'circle',
      group: 'entity',
      x: entity.x,
      y: entity.y + oy,
      r
    };
  }

  function collidesEntities(anchorX, anchorY, entities) {
    if (!Array.isArray(entities) || entities.length === 0) return { hit: false, shape: null };
    const cx = anchorX;
    const cy = anchorY + PLAYER_FOOT_OFFSET_Y;
    const r = PLAYER_RADIUS;
    for (const entity of entities) {
      const collider = entityColliderFor(entity);
      if (!collider) continue;
      if (circleVsCircle(cx, cy, r, collider)) return { hit: true, shape: collider };
    }
    return { hit: false, shape: null };
  }

  function collidesAnchor(anchorX, anchorY, entities = null) {
    const cx = anchorX;
    const cy = anchorY + PLAYER_FOOT_OFFSET_Y;
    const r = PLAYER_RADIUS;

    const worldHit = collidesWorldCircle(cx, cy, r);
    if (worldHit.hit) return worldHit;

    const entityHit = collidesEntities(anchorX, anchorY, entities);
    if (entityHit.hit) return entityHit;
    return { hit: false, shape: null };
  }

  // Movimento em micropassos + resolução por eixo. Evita tunneling em cercas
  // finas, permite deslizar por obstáculos e agora também contorna entidades sólidas.
  function move(anchorX, anchorY, deltaX, deltaY, entities = null) {
    let x = anchorX, y = anchorY;
    let blockedX = false, blockedY = false, lastHit = null;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 7));
    const sx = deltaX / steps, sy = deltaY / steps;

    for (let i = 0; i < steps; i++) {
      if (sx !== 0) {
        const test = collidesAnchor(x + sx, y, entities);
        if (!test.hit) x += sx;
        else { blockedX = true; lastHit = test.shape; }
      }
      if (sy !== 0) {
        const test = collidesAnchor(x, y + sy, entities);
        if (!test.hit) y += sy;
        else { blockedY = true; lastHit = test.shape; }
      }
    }

    return { x, y, blockedX, blockedY, hit: lastHit };
  }


  // M001.9: movimento de entidade com footprint próprio.
  // Chase respeita cenário e outras entidades; reset pode ignorar outras entidades
  // para garantir retorno ao ponto de origem sem atravessar paredes do mapa.
  function collidesEntityAt(entity, anchorX, anchorY, entities = null, ignoreEntities = false) {
    if (!entity) return { hit: false, shape: null };
    const r = Number.isFinite(entity.collisionRadius) ? entity.collisionRadius : ENTITY_DEFAULT_RADIUS;
    const oy = Number.isFinite(entity.collisionOffsetY) ? entity.collisionOffsetY : ENTITY_DEFAULT_OFFSET_Y;
    const cx = anchorX;
    const cy = anchorY + oy;
    const worldHit = collidesWorldCircle(cx, cy, r);
    if (worldHit.hit) return worldHit;
    if (ignoreEntities || !Array.isArray(entities)) return { hit: false, shape: null };
    for (const other of entities) {
      if (!other || other === entity || other.id === entity.id) continue;
      const collider = entityColliderFor(other);
      if (!collider) continue;
      if (circleVsCircle(cx, cy, r, collider)) return { hit: true, shape: collider };
    }
    return { hit: false, shape: null };
  }

  function moveEntity(entity, deltaX, deltaY, entities = null, options = {}) {
    let x = entity.x, y = entity.y;
    let blockedX = false, blockedY = false, lastHit = null;
    const ignoreEntities = options.ignoreEntities === true;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 7));
    const sx = deltaX / steps, sy = deltaY / steps;
    for (let i = 0; i < steps; i++) {
      if (sx !== 0) {
        const test = collidesEntityAt(entity, x + sx, y, entities, ignoreEntities);
        if (!test.hit) x += sx;
        else { blockedX = true; lastHit = test.shape; }
      }
      if (sy !== 0) {
        const test = collidesEntityAt(entity, x, y + sy, entities, ignoreEntities);
        if (!test.hit) y += sy;
        else { blockedY = true; lastHit = test.shape; }
      }
    }
    return { x, y, blockedX, blockedY, hit: lastHit };
  }


  function selfTest() {
    const checks = [
      ['spawn-livre', 720, 1910, false],
      ['casa-bloqueia', 500, 1600, true],
      ['rio-bloqueia', 3800, 1000, true],
      ['ponte-passavel', 3800, 600, false],
      ['limite-mundo', 5, 5, true]
    ];
    const errors = [];
    for (const [name, x, y, expected] of checks) {
      const actual = collidesAnchor(x, y).hit;
      if (actual !== expected) errors.push(`${name}: esperado ${expected}, obtido ${actual}`);
    }
    return { ok: errors.length === 0, errors };
  }

  window.RagbiaCollisionV0 = {
    WORLD_W, WORLD_H,
    PLAYER_RADIUS, PLAYER_FOOT_OFFSET_Y,
    ENTITY_DEFAULT_RADIUS, ENTITY_DEFAULT_OFFSET_Y,
    shapes,
    collidesWorldCircle,
    entityColliderFor, collidesEntities, collidesAnchor,
    collidesEntityAt, moveEntity,
    move,
    selfTest
  };
})();
