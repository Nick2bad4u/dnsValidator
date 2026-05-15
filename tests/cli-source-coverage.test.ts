import { describe, it, expect } from "vitest";
import { runCLI } from "../src/cli";
import * as nodePath from "node:path";
import { writeFileSync, unlinkSync, readFileSync } from "node:fs";

const testDirectory = import.meta.dirname;

describe("cli.ts source coverage via runCLI", () => {
    function capture(argv: string[]) {
        const originalLog = console.log;
        const originalErr = console.error;
        const originalExit = process.exit;
        const logs: string[] = [];
        const errs: string[] = [];
        let code: number | undefined;
        (console as any).log = (...a: any[]) => logs.push(a.join(" "));
        (console as any).error = (...a: any[]) => errs.push(a.join(" "));
        (process as any).exit = (c?: number) => {
            code = c;
            throw new Error("EXIT");
        };
        try {
            runCLI(argv);
        } catch (error: any) {
            if (error.message !== "EXIT") throw error;
        } finally {
            console.log = originalLog;
            console.error = originalErr;
            process.exit = originalExit;
        }
        return { logs, errs, code };
    }

    it("record valid", () => {
        const res = capture([
            "record",
            "--type",
            "A",
            "--data",
            '{"address":"1.2.3.4"}',
        ]);

        expect(res.code).toBeUndefined();
    });

    it("record invalid strict", () => {
        const res = capture([
            "record",
            "--type",
            "A",
            "--data",
            '{"address":"999.999.999.999"}',
            "--strict",
        ]);

        expect(res.code).toBe(1);
    });

    it("query valid", () => {
        const q =
            '{"question":{"name":"example.com","type":"A","class":"IN"},"answers":[{"type":"A","address":"1.2.3.4"}] }';
        const res = capture([
            "query",
            "--data",
            q,
        ]);

        expect(res.code).toBeUndefined();
    });

    it("bulk records strict failure", () => {
        const file = nodePath.join(testDirectory, "bulk-src.json");
        writeFileSync(
            file,
            JSON.stringify([
                { type: "A", address: "1.2.3.4" },
                { type: "A", address: "999.999.999.999" },
            ])
        );
        const res = capture([
            "bulk",
            "--file",
            file,
            "--format",
            "table",
            "--strict",
        ]);

        expect(res.code).toBe(1);

        unlinkSync(file);
    });

    it("bulk queries csv success", () => {
        const file = nodePath.join(testDirectory, "bulkq-src.json");
        writeFileSync(
            file,
            JSON.stringify([
                {
                    question: { name: "example.com", type: "A", class: "IN" },
                    answers: [{ type: "A", address: "1.2.3.4" }],
                },
            ])
        );
        const res = capture([
            "bulk",
            "--file",
            file,
            "--mode",
            "queries",
            "--format",
            "csv",
        ]);

        expect(res.code).toBeUndefined();

        unlinkSync(file);
    });

    it("record csv output file", () => {
        const outFile = nodePath.join(testDirectory, "out-src.csv");
        const res = capture([
            "record",
            "--type",
            "A",
            "--data",
            '{"address":"1.1.1.1"}',
            "--format",
            "csv",
            "--output",
            outFile,
        ]);

        expect(res.code).toBeUndefined();

        const c = readFileSync(outFile, "utf8");

        expect(c).toMatch(/Type","Success","Error","RecordData/);

        unlinkSync(outFile);
    });

    it("examples command", () => {
        const res = capture(["examples"]);

        expect(res.code).toBeUndefined();
    });
});
