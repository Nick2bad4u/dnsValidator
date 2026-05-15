import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const target = new URL("../dist/index.mjs", import.meta.url);
const targetPath = fileURLToPath(target);
mkdirSync(dirname(targetPath), { recursive: true });
const content = `// Auto-generated ESM wrapper\nexport * from './esm/index.js';\n`;
writeFileSync(targetPath, content);

const esmPackageJson = new URL("../dist/esm/package.json", import.meta.url);
writeFileSync(
    esmPackageJson,
    `${JSON.stringify({ type: "module" }, undefined, 2)}\n`
);

const declarationEntries = [
    "dnssec",
    "dnssec-validators",
    "enhanced-validators",
    "errors",
    "index",
    "node-compat",
    "performance",
    "types",
    "utils",
    "validators",
];

/**
 * @param {string} match
 * @param {string} prefix
 * @param {string} specifier
 * @param {string} suffix
 *
 * @returns {string}
 */
function appendJavaScriptExtension(match, prefix, specifier, suffix) {
    if (
        !specifier.startsWith(".") ||
        /\.[cm]?[jt]sx?$|\.json$/u.test(specifier)
    ) {
        return match;
    }

    return `${prefix}${specifier}.js${suffix}`;
}

/**
 * @param {string} content
 *
 * @returns {string}
 */
function toEsmDeclaration(content) {
    return content
        .replaceAll(
            /(from\s+["'])(\.[^"']+)(["'])/gu,
            appendJavaScriptExtension
        )
        .replaceAll(
            /(import\(\s*["'])(\.[^"']+)(["']\s*\))/gu,
            appendJavaScriptExtension
        );
}

for (const entry of declarationEntries) {
    const declarationContent = readFileSync(
        new URL(`../dist/${entry}.d.ts`, import.meta.url),
        "utf8"
    );

    writeFileSync(
        new URL(`../dist/${entry}.d.mts`, import.meta.url),
        toEsmDeclaration(declarationContent)
    );
}

console.log("Created ESM wrappers and declaration aliases.");
