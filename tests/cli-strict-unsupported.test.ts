import { describe, it, expect } from "vitest";
import { runCLI } from "../src/cli";

function invoke(args: string[]) {
    const logs: string[] = [];
    const errs: string[] = [];
    let exitCode = 0;
    const logSpy = vi
        .spyOn(console, "log")
        .mockImplementation((...m: any[]) => {
            logs.push(m.map(String).join(" "));
        });
    const errSpy = vi
        .spyOn(console, "error")
        .mockImplementation((...m: any[]) => {
            errs.push(m.map(String).join(" "));
        });
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((
        code?: number
    ) => {
        exitCode = code ?? 0;
        return undefined as never;
    }) as any);
    runCLI(args);
    logSpy.mockRestore();
    errSpy.mockRestore();
    exitSpy.mockRestore();
    return { stdout: logs.join("\n"), stderr: errs.join("\n"), exitCode };
}

describe("command line strict unsupported record type", () => {
    it("fails when unknown type with --strict", () => {
        const rec = { type: "UNKNOWN", foo: 1 };
        const { exitCode, stdout } = invoke([
            "record",
            "--strict",
            "--data",
            JSON.stringify(rec),
        ]);

        expect(exitCode).toBe(1);
        expect(stdout).toContain("Invalid UNKNOWN record structure");
    });
});
