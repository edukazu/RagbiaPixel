const fs = require('fs');
const path = require('path');
const data = require(path.join(__dirname, '..', 'maps', 'semantic', 'map-beta-v0.js'));
const out = path.join(__dirname, '..', 'maps', 'generated', 'map-beta-v0.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`M002-MAP.1 exportado: ${out}`);
