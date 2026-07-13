import nickTwoBadFourU from "eslint-config-nick2bad4u";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nickTwoBadFourU.configs.all,
    {
        files: ["package.json"],
        rules: {
            "package-json/require-peerDependencies": "off",
        },
    },
    {
        files: ["src/**/*.ts"],
        rules: {
            "no-use-before-define": [
                "error",
                {
                    classes: true,
                    functions: false,
                    variables: true,
                },
            ],
            // Preserve Node.js 22 support and the repository's established DNS terminology.
            "typefest/prefer-ts-extras-object-assign": "off",
            "unicorn/comment-content": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/custom-error-definition": "off",
            "unicorn/prefer-error-is-error": "off",
        },
    },
    {
        files: ["src/cli.ts"],
        rules: {
            "init-declarations": "off",
            "n/hashbang": "off",
            "n/no-process-exit": "off",
            "n/no-sync": "off",
            "n/shebang": "off",
            "no-console": "off",
            "no-undef": "off",
            "security/detect-non-literal-fs-filename": "off",
            "unicorn/no-process-exit": "off",
            "unicorn/no-top-level-side-effects": "off",
            "unicorn/prefer-module": "off",
            "unicorn/try-complexity": "off",
        },
    },
    {
        files: ["src/index.ts"],
        rules: {
            "canonical/filename-no-index": "off",
            "canonical/no-re-export": "off",
            "no-barrel-files/no-barrel-files": "off",
        },
    },
    {
        files: ["src/dnssec.ts", "tests/performance-benchmarks.test.ts"],
        rules: {
            "no-bitwise": "off",
        },
    },
    {
        files: ["src/dnssec.ts"],
        rules: {
            "no-redeclare": "off",
            "perfectionist/sort-objects": "off",
            "unicorn/no-declarations-before-early-exit": "off",
        },
    },
    {
        files: ["src/errors.ts"],
        rules: {
            "max-classes-per-file": "off",
        },
    },
    {
        files: [
            "src/dnssec-validators.ts",
            "src/errors.ts",
            "src/performance.ts",
        ],
        rules: {
            "perfectionist/sort-modules": "off",
        },
    },
    {
        files: ["src/performance.ts"],
        rules: {
            "unicorn/consistent-class-member-order": "off",
            "unicorn/prefer-string-raw": "off",
        },
    },
    {
        files: ["src/types.ts"],
        rules: {
            "no-use-before-define": "off",
        },
    },
    {
        files: ["src/validators.ts"],
        rules: {
            complexity: ["error", 25],
        },
    },
    {
        files: ["tests/**/*.ts"],
        rules: {
            // Avoid a migration-only rewrite of the mature test suite's object, import, and assertion style.
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "perfectionist/sort-imports": "off",
            "perfectionist/sort-interfaces": "off",
            "perfectionist/sort-modules": "off",
            "perfectionist/sort-named-imports": "off",
            "perfectionist/sort-object-types": "off",
            "perfectionist/sort-objects": "off",
            "perfectionist/sort-union-types": "off",
            "regexp/require-unicode-regexp": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "test-signal/no-duplicate-assertions": "off",
            "test-signal/no-fixed-delay-tests": "off",
            "test-signal/no-weak-existence-assertions": "off",
            "test-signal/no-weak-truthy-assertions": "off",
            "test-signal/require-assertions": "off",
            "test-signal/require-negative-path": "off",
            "unicorn/no-break-in-nested-loop": "off",
            "unicorn/prefer-error-is-error": "off",
            "unicorn/prefer-import-meta-properties": "off",
            "unicorn/prefer-temporal": "off",
            "vitest/prefer-expect-assertions": "off",
            "vitest/prefer-strict-boolean-matchers": "off",
        },
    },
    {
        files: ["tests/deep-imports.test.ts"],
        rules: {
            "import-x/extensions": "off",
        },
    },
    {
        files: ["tests/dnssec-negative-more.test.ts"],
        rules: {
            "vitest/expect-expect": [
                "warn",
                {
                    assertFunctionNames: ["expect", "expectError"],
                },
            ],
        },
    },
    {
        files: ["vite.config.ts"],
        rules: {
            "n/no-process-env": "off",
            "vite/no-vitest-globals": "off",
        },
    },
    {
        // These generated/reference files are intentionally outside the Remark CLI target.
        files: [
            ".docs/**/*.md",
            ".github/**/*.md",
            "docs/**/*.md",
        ],
        rules: {
            "markdown/no-duplicate-headings": "off",
            "markdown/no-empty-links": "off",
            "remark/remark": "off",
        },
    },
    {
        files: ["**/*.html"],
        rules: {
            "@stylistic/spaced-comment": "off",
        },
    },
];

export default config;
