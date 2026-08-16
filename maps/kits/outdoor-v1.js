(function (root, factory) {
  const data = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  if (root) root.RagbiaOutdoorKitV1Data = data;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  return {
    schema: 'ragbia-visual-kit-v1',
    id: 'outdoor-v1',
    role: 'semantic-to-visual vocabulary',
    logicalPixelScale: 4,
    design: {
      direction: 'pixel-art outdoor readable against CORE sprites',
      goals: [
        'more material variation than Map Beta CORE',
        'strong silhouettes instead of micro-detail',
        'deterministic generation from semantic data',
        'no change to collision or gameplay coordinates'
      ]
    },
    palette: {
      grassDeep: '#1e4d31',
      grassBase: '#2f6e3d',
      grassMid: '#3e7c43',
      grassLight: '#568d4b',
      grassDry: '#7d8249',
      grassShade: '#274f32',

      dirtEdge: '#67513c',
      dirtBase: '#92714a',
      dirtMid: '#a98555',
      dirtLight: '#c29c66',
      dirtRut: '#75583c',

      bankDeep: '#4b4932',
      bankBase: '#716943',
      bankLight: '#97865a',
      waterDeep: '#173e51',
      waterBase: '#1e6072',
      waterMid: '#2f7b86',
      waterLight: '#6ba9a7',

      woodDeep: '#3e2b21',
      woodBase: '#69482e',
      woodMid: '#8a6138',
      woodLight: '#b07f47',

      stoneDeep: '#454a48',
      stoneBase: '#626966',
      stoneMid: '#7c827d',
      stoneLight: '#a2a69e',

      wallDeep: '#6d5d43',
      wallBase: '#a58d63',
      wallLight: '#cfb887',
      roofDeep: '#53382d',
      roofBase: '#754936',
      roofMid: '#925b3e',
      roofLight: '#bd7950',

      leafDeep: '#183f2a',
      leafBase: '#286038',
      leafMid: '#3b7843',
      leafLight: '#619151',
      leafWarm: '#6d8c49',

      flowerGold: '#d7c267',
      flowerRose: '#cb8991',
      flowerBlue: '#8fb7c2',
      shadow: '#173725'
    },
    families: {
      terrain: ['grass-base', 'grass-patch', 'dirt-road', 'road-edge'],
      water: ['bank', 'river-deep', 'river-flow', 'shore-detail'],
      nature: ['tree-round', 'tree-tall', 'tree-broad', 'bush', 'rock', 'flower-cluster'],
      structure: ['house-rural', 'fence-rural', 'field', 'ruins'],
      traversal: ['wood-bridge']
    },
    variation: {
      grassLargePatches: 11,
      grassMicroClusters: 820,
      roadEdgeClusters: 250,
      waterFlowMarks: 130,
      ambientRocks: 70,
      ambientBushes: 42
    }
  };
});
