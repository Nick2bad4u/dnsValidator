---
name: "Codex-Instructions-DNS-Response-Validator"
description: "Instructions for maintaining the dns-response-validator TypeScript library and CLI."
applyTo: "**"
---

# Project Instructions

## Project Shape

- This repository publishes `dns-response-validator`, a Node.js 22+ TypeScript library and CLI for validating DNS query results and DNS record objects.
- Source files live in `src/`; Vitest tests live in `tests/`; example consumers live in `examples/`.
- The package is dual-published:
  - CommonJS runtime files are bundled into `dist/*.js`.
  - ESM runtime files are bundled into `dist/esm/*.js` with `dist/esm/package.json` declaring `"type": "module"`.
  - TypeScript declaration files are emitted by `tsc -p tsconfig.build.json`.
- Preserve the public `exports` map in `package.json` when adding or moving entry points.

## Development Standards

- Use strict TypeScript patterns compatible with TypeScript 6.0+ and the repository `tsconfig.json`.
- Keep source as pure ESM syntax. Do not add `require`, `module.exports`, or CommonJS helpers to TypeScript source files.
- Avoid `any`. Prefer `unknown`, precise generics, and small runtime type guards.
- Use `type-fest` for expressive public or domain types when it is clearer than built-in utilities.
- Use `ts-extras` for the local runtime helpers already established in the codebase, but do not force it when native APIs produce clearer and safer types.
- Keep validation functions defensive. Invalid user input should return validation failures or typed errors; it should not crash the process.
- CLI behavior in `src/cli.ts` is a supported runtime surface. Keep command behavior, output modes, and exit-code semantics covered by tests.

## Testing And Verification

- Use Vitest only. Do not reintroduce Jest configuration or Jest globals.
- Tests that exercise `dist/` require a fresh build first. Use `npm run build` before CLI/deep-import packaging checks.
- Preferred verification commands:
  - `npm run lint:nocache`
  - `npm run typecheck`
  - `npm run build`
  - `npm test`
  - `npm run test:coverage`
  - `npm run release:verify`
- `release:verify` is the authoritative release gate. Do not call the repo release-ready until it completes successfully.
- Coverage thresholds are enforced in `vite.config.ts`; raise coverage with meaningful tests rather than lowering thresholds.

## Linting And Formatting

- `eslint.config.mjs` is the source of truth for lint behavior and extends the shared `eslint-config-nick2bad4u` config.
- Prefer real code fixes over disables. If a scoped override is necessary, keep it narrow and document the reason in the config shape.
- Use `npm run lint:fix` for ESLint autofixes, `npm run lint:prettier:fix` for formatting, and `npm run lint:package:fix` for package sorting.
- If command output is too large or truncated, redirect it to a file under `temp/` and inspect that file. `temp/` is disposable.

## Release Notes

- Git-cliff is configured through `cliff.toml`.
- Use:
  - `npm run changelog:preview` to preview unreleased notes.
  - `npm run changelog:generate` to update `CHANGELOG.md`.
  - `npm run changelog:release-notes` for latest release notes output.

## Commit Messages

- When asked for a commit message, first check `.github/copilot-commit-message-instructions.md` and follow the repository-local format exactly.
