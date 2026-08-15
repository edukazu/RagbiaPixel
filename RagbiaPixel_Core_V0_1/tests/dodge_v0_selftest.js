'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, '..', 'phaser_map_beta', 'dodge-v0.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(code, context);
const D = context.window.RagbiaDodgeV0;
if (!D) throw new Error('RagbiaDodgeV0 não foi exportado');
const result = D.selfTest();
if (!result.ok) throw new Error(result.errors.join(' | '));
const p = D.profileFor('warrior');
if (p.distance !== 140 || p.duration !== 0.18 || p.cooldown !== 1.5 || p.invulnerability !== 0.12 || p.charges !== 1) {
  throw new Error('Perfil de laboratório incorreto');
}
console.log('OK — M001.6 Dash/Esquiva V0 selftest.');
