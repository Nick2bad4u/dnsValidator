import { describe, it, expect, vi } from "vitest";
import { runCLI } from "../src/cli";

type RecordFixture = Readonly<Record<string, unknown> & { type: string }>;

function invoke(args: string[]) {
    const logs: string[] = [];
    const errs: string[] = [];
    let exitCode = 0;
    const logSpy = vi.spyOn(console, "log").mockImplementation((...m) => {
        logs.push(m.map(String).join(" "));
    });
    const errSpy = vi.spyOn(console, "error").mockImplementation((...m) => {
        errs.push(m.map(String).join(" "));
    });
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((
        code?: string | number | null | undefined
    ) => {
        exitCode = typeof code === "number" ? code : 0;
        return undefined as never;
    }) as typeof process.exit);
    try {
        runCLI(args);
    } finally {
        logSpy.mockRestore();
        errSpy.mockRestore();
        exitSpy.mockRestore();
    }
    return { stdout: logs.join("\n"), stderr: errs.join("\n"), exitCode };
}

describe("command line record command all supported types", () => {
    const records: readonly RecordFixture[] = [
        { type: "A", address: "1.1.1.1" },
        { type: "AAAA", address: "2001:db8::1" },
        { type: "MX", exchange: "mail.example.com", priority: 10 },
        { type: "TXT", entries: ["hello"] },
        { type: "NS", value: "ns1.example.com" },
        { type: "CNAME", value: "target.example.com" },
        { type: "PTR", value: "ptr.example.com" },
        {
            type: "SRV",
            name: "service.example.com",
            priority: 10,
            weight: 5,
            port: 5060,
        },
        { type: "CAA", critical: 0, issue: "letsencrypt.org" },
        {
            type: "NAPTR",
            order: 1,
            preference: 1,
            flags: "U",
            service: "E2U+sip",
            regexp: "!.*!",
            replacement: "",
        },
        {
            type: "TLSA",
            usage: 0,
            selector: 0,
            matchingType: 1,
            certificate: "abcdef",
        },
        {
            type: "SOA",
            primary: "ns1.example.com",
            admin: "hostmaster.example.com",
            serial: 1,
            refresh: 1,
            retry: 1,
            expiration: 1,
            minimum: 1,
        },
        { type: "ZZZ", foo: 1 }, // Unknown non-strict
    ];

    it.each(records)("validates $type via command line", (rec) => {
        const { exitCode, stdout } = invoke([
            "record",
            "--data",
            JSON.stringify(rec),
        ]);

        expect(exitCode).toBe(0); // Unknown type produces success true with warning
        expect(stdout).toContain(rec.type);
    });
});
