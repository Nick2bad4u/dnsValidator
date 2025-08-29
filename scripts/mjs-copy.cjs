#!/usr/bin/env node
/* Copy select CommonJS outputs to .mjs if missing (already using NodeNext, but keep for safety) */
const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, '..', 'dist');
const modules = [
  'validators',
  'dnssec',
  'dnssec-validators',
  'enhanced-validators',
  'errors',
  'performance',
  'utils',
  'index'
];
modules.forEach(m => {
  const js = path.join(dist, `${m}.js`);
  const mjs = path.join(dist, `${m}.mjs`);
  if (fs.existsSync(js) && !fs.existsSync(mjs)) {
    fs.copyFileSync(js, mjs);
  }
});
