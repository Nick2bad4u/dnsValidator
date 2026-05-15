import { describe, it, expect, vi } from "vitest";
import { runCLI } from "../src/cli";
import * as fs from "node:fs";
import { globalPerformanceTracker } from "../src/performance";

// Reusable capture helper mirroring existing pattern
function capture(argv: string[]) {
    const logs: string[] = [];
    const errs: string[] = [];
    let code: number | undefined;
    const logSpy = vi.spyOn(console, "log").mockImplementation((...args) => {
        logs.push(args.join(" "));
    });
    const errorSpy = vi
        .spyOn(console, "error")
        .mockImplementation((...args) => {
            errs.push(args.join(" "));
        });
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((
        exitCode?: string | number | null | undefined
    ) => {
        code = typeof exitCode === "number" ? exitCode : 0;
        return undefined as never;
    }) as typeof process.exit);
    try {
        runCLI(argv);
    } finally {
        logSpy.mockRestore();
        errorSpy.mockRestore();
        exitSpy.mockRestore();
    }
    return { logs, errs, code };
}

describe("command line additional uncovered paths", () => {
    it("record command missing input error", () => {
        const res = capture(["record"]);

        expect(res.code).toBe(1);
        expect(res.errs.join("\n")).toMatch(
            /Must provide either --data or --file/
        );
    });

    it("query command output file success path", () => {
        const out = "tmp-query-out.json";
        const query = JSON.stringify({
            question: { name: "example.com", type: "A", class: "IN" },
            answers: [{ type: "A", address: "1.2.3.4" }],
        });
        const res = capture([
            "query",
            "--data",
            query,
            "--output",
            out,
        ]);

        expect(res.code).toBeUndefined();

        const content = fs.readFileSync(out, "utf8");

        expect(content).toMatch(/"success"\s*:\s*true/);

        fs.unlinkSync(out);
    });

    it("bulk records all success (failCount = 0 path)", () => {
        const file = "tmp-bulk-success.json";
        fs.writeFileSync(
            file,
            JSON.stringify([
                { type: "A", address: "1.2.3.4" },
                { type: "A", address: "8.8.8.8" },
            ])
        );
        const res = capture([
            "bulk",
            "--file",
            file,
        ]);
        fs.unlinkSync(file);

        // Expect summary with 0 failed and no exit code set
        expect(res.errs.join("\n")).toMatch(/Summary: 2 succeeded, 0 failed/);
        expect(res.code).toBeUndefined();
    });
});

describe("performance tracker cache hit/miss direct usage", () => {
    it("record cache hit/miss increments", () => {
        globalPerformanceTracker.reset();
        globalPerformanceTracker.recordCacheHit();
        globalPerformanceTracker.recordCacheMiss();
        const metrics = globalPerformanceTracker.getMetrics();

        expect(metrics.cacheHits).toBe(1);
        expect(metrics.cacheMisses).toBe(1);
    });
});
