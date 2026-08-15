'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname,'..','phaser_map_beta','engage-continuity-v0.js'),'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(code, context);
const C = context.window.RagbiaEngageContinuityV0;
if (!C) throw new Error('RagbiaEngageContinuityV0 não exportado');
const result = C.selfTest();
if (!result.ok) throw new Error(result.errors.join(' | '));
const pool = [
  { entity: { id:'dead' } },
  { entity: { id:'next' } },
  { entity: { id:'third' } }
];
if (C.chooseNextId(pool,'dead') !== 'next') throw new Error('não escolheu próximo Soft Target');
if (!C.shouldArm(true,true,true,false)) throw new Error('continuidade não armou no cenário válido');
if (C.shouldArm(false,true,true,false)) throw new Error('continuidade armou após release');
console.log('OK — M001.8 Continuidade do Engage selftest.');
