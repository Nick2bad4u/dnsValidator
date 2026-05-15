import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import * as nodePath from "node:path";
import { pathToFileURL } from "node:url";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const testDirectory = import.meta.dirname;

describe("esm build entry", () => {
    const nodeCmd = process.execPath;

    function runESM(code: string) {
        const dir = mkdtempSync(nodePath.join(tmpdir(), "dnsval-esm-"));
        const file = nodePath.join(dir, "test.mjs");
        writeFileSync(file, code, "utf8");
        return spawnSync(nodeCmd, [file], { encoding: "utf8" });
    }

    it("import root export", () => {
        const esmPath = pathToFileURL(
            nodePath.join(testDirectory, "../dist/esm/index.js")
        ).href;
        const code = `import * as m from '${esmPath}';\nconsole.log(typeof m.validateDNSRecord);`;
        const { stdout, stderr, status } = runESM(code);

        expect({
            status,
            stderr: stderr.trim(),
            out: stdout.trim(),
        }).toStrictEqual({
            status: 0,
            stderr: "",
            out: "function",
        });
    });

    it("import validators subpath", () => {
        const esmPath = pathToFileURL(
            nodePath.join(testDirectory, "../dist/esm/validators.js")
        ).href;
        const code = `import * as m from '${esmPath}';\nconsole.log(typeof m.isARecord);`;
        const { stdout, stderr, status } = runESM(code);

        expect({
            status,
            stderr: stderr.trim(),
            out: stdout.trim(),
        }).toStrictEqual({
            status: 0,
            stderr: "",
            out: "function",
        });
    });
});
