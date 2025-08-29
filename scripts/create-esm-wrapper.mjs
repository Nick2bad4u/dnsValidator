import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
const target = new URL('../dist/index.mjs', import.meta.url);
mkdirSync(dirname(target), { recursive: true });
const content = `// Auto-generated ESM wrapper\nexport * from './esm/index.js';\nexport { default } from './esm/index.js';\n`;
writeFileSync(target, content);
console.log('Created dist/index.mjs (ESM wrapper).');
