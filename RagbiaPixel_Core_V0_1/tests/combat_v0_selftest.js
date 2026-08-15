
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..', 'phaser_map_beta');
global.window = global;
vm.runInThisContext(fs.readFileSync(path.join(root, 'entities-v0.js'), 'utf8'), { filename:'entities-v0.js' });
vm.runInThisContext(fs.readFileSync(path.join(root, 'combat-v0.js'), 'utf8'), { filename:'combat-v0.js' });
vm.runInThisContext(fs.readFileSync(path.join(root, 'collision-v0.js'), 'utf8'), { filename:'collision-v0.js' });
const t = RagbiaCombatV0.selfTest();
if (!t.ok) { console.error('FAIL:', t.errors.join(' | ')); process.exit(1); }
const e = RagbiaEntitiesV0.createSlimes([{x:10,y:20}])[0];
if (e.hp !== 1 || e.maxHP !== 1 || e.attack !== 0.5) { console.error('FAIL: stats do Slime'); process.exit(1); }
const r = RagbiaCombatV0.applyDamage(e, 1);
if (!r.killed || e.alive || e.targetable || e.solid) { console.error('FAIL: morte lógica'); process.exit(1); }
if (RagbiaCollisionV0.entityColliderFor(e) !== null) { console.error('FAIL: inimigo morto ainda tem colisor'); process.exit(1); }
console.log('OK — Combate V0: HP/ATK/dano/morte validados.');
