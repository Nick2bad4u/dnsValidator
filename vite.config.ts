import { defineConfig, type ViteUserConfig } from "vitest/config";

const isCiEnvironment = process.env["CI"] === "true";
const configuredMaxWorkers =
    process.env["MAX_THREADS"] ?? (isCiEnvironment ? "1" : "4");
const parsedMaxWorkers = Number.parseInt(configuredMaxWorkers, 10);
const maxWorkers =
    Number.isFinite(parsedMaxWorkers) && parsedMaxWorkers > 0
        ? parsedMaxWorkers
        : 1;

const config: ViteUserConfig = defineConfig({
    cacheDir: ".cache/vitest",
    test: {
        coverage: {
            clean: true,
            exclude: [
                "**/*.d.ts",
                "**/*.test.ts",
                "**/dist/**",
                "**/node_modules/**",
                "src/index.ts",
            ],
            include: ["src/**/*.ts"],
            provider: "v8",
            reporter: [
                "text",
                "json",
                "lcov",
                "html",
            ],
            reportsDirectory: "coverage",
            thresholds: {
                branches: 90,
                functions: 95,
                lines: 95,
                statements: 95,
            },
        },
        environment: "node",
        fileParallelism: !isCiEnvironment,
        globals: true,
        include: ["tests/**/*.test.ts"],
        isolate: true,
        maxWorkers,
        restoreMocks: true,
        slowTestThreshold: 1000,
    },
});

export default config;
