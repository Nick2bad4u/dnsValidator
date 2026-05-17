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
        files: ["tests/**/*.ts"],
        rules: {
            "vitest/prefer-expect-assertions": "off",
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
        files: ["docs/**/*.md"],
        rules: {
            "markdown/no-duplicate-headings": "off",
            "markdown/no-empty-links": "off",
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
