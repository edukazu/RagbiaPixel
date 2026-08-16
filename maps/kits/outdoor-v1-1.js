(function (root, factory) {
  const data = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  if (root) root.RagbiaOutdoorKitV11Data = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  return {
    schema: 'ragbia-visual-kit-v1',
    id: 'outdoor-v1.1',
    parentKit: 'outdoor-v1',
    role: 'quality pass over semantic outdoor vocabulary',
    logicalPixelScale: 4,
    design: {
      direction: 'pixel-art outdoor with stronger silhouettes, material breakup and deterministic edge detail',
      goals: [
        'preserve semantic map and all gameplay coordinates',
        'increase quality through reusable vocabulary, not manual map painting',
        'make road, grass, vegetation, water and structures easier to read as materials',
        'keep detail density compatible with CORE character and enemy sprites'
      ],
      limits: [
        'no new map geometry',
        'no gameplay or collision changes',
        'no hand-painted per-map cleanup',
        'no illustrated-background workflow'
      ]
    },
    palette: {
      grassDeep: '#19452c',
      grassBase: '#2d6b3c',
      grassMid: '#3b7943',
      grassLight: '#54894b',
      grassWarm: '#6c8248',
      grassDry: '#8c8a50',
      grassShade: '#245734',
      grassMoss: '#477844',

      dirtEdgeDeep: '#574433',
      dirtEdge: '#70563d',
      dirtBase: '#95724a',
      dirtMid: '#aa8655',
      dirtLight: '#c49c65',
      dirtDust: '#d1ae78',
      dirtRut: '#795b3d',
      dirtGrass: '#55733f',

      bankDeep: '#3e4430',
      bankBase: '#666440',
      bankMid: '#807650',
      bankLight: '#a08b5e',
      waterDeep: '#153d50',
      waterBase: '#1d6072',
      waterMid: '#327f89',
      waterLight: '#79b0ac',
      waterFoam: '#a2c6bc',

      woodDeep: '#38261d',
      woodBase: '#65452d',
      woodMid: '#8b6038',
      woodLight: '#b68249',
      woodWarm: '#9b693b',

      stoneDeep: '#414744',
      stoneBase: '#606762',
      stoneMid: '#7a8078',
      stoneLight: '#a1a69c',
      stoneMoss: '#526c4c',

      wallDeep: '#675940',
      wallBase: '#a0875f',
      wallMid: '#b49b6e',
      wallLight: '#d0b886',
      roofDeep: '#50362b',
      roofBase: '#704735',
      roofMid: '#925a3d',
      roofLight: '#c17b50',

      leafDeep: '#163c27',
      leafBase: '#275d36',
      leafMid: '#3b7843',
      leafLight: '#619250',
      leafWarm: '#718e4b',
      leafShade: '#204e30',

      flowerGold: '#dfc96e',
      flowerRose: '#d28d97',
      flowerBlue: '#91bdc9',
      flowerWhite: '#d7d8c4',
      shadow: '#143423',
      ao: '#102c1d'
    },
    families: {
      terrain: ['grass-base', 'grass-organic-patch', 'grass-tuft', 'dirt-road', 'road-edge-intrusion', 'road-rut'],
      water: ['bank', 'shore-pebble', 'river-deep', 'river-flow', 'shore-grass'],
      nature: ['tree-round-a', 'tree-round-b', 'tree-tall', 'tree-broad', 'tree-young', 'bush-a', 'bush-b', 'rock-a', 'rock-b', 'flower-cluster'],
      structure: ['house-rural-a', 'house-rural-b', 'house-rural-c', 'fence-rural', 'field', 'ruins'],
      traversal: ['wood-bridge']
    },
    variation: {
      grassLargePatches: 17,
      grassMicroClusters: 610,
      grassTufts: 145,
      roadEdgeIntrusions: 105,
      roadSurfaceMarks: 120,
      waterFlowMarks: 118,
      shorePebbles: 72,
      ambientRocks: 60,
      ambientBushes: 38
    }
  };
});
