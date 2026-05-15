import { describe, it, expect } from "vitest";
import packageJson from "../package.json";

type RuntimeModule = Readonly<Record<string, unknown>> & {
    readonly default?: unknown;
};

function isRuntimeModule(value: unknown): value is RuntimeModule {
    return typeof value === "object" && value !== null;
}

function getRuntimeExport(moduleValue: unknown, exportName: string): unknown {
    if (!isRuntimeModule(moduleValue)) {
        return undefined;
    }

    if (Object.hasOwn(moduleValue, exportName)) {
        return moduleValue[exportName];
    }

    const defaultExport = moduleValue.default;

    if (
        isRuntimeModule(defaultExport) &&
        Object.hasOwn(defaultExport, exportName)
    ) {
        return defaultExport[exportName];
    }

    return undefined;
}

describe("deep import subpaths", () => {
    it("validators deep import", async () => {
        const validatorsModule: unknown =
            await import("dns-response-validator/validators");
        const validateDNSRecord = getRuntimeExport(
            validatorsModule,
            "validateDNSRecord"
        );

        expect(validateDNSRecord).toBeTypeOf("function");
    });

    it("dnssec deep import", async () => {
        const dnssecModule: unknown =
            await import("dns-response-validator/dnssec");
        const validateRRSIG = getRuntimeExport(dnssecModule, "validateRRSIG");

        expect(validateRRSIG).toBeTypeOf("function");
    });

    it("types deep import (types only)", () => {
        expect(packageJson.exports["./types"].import.types).toBe(
            "./dist/types.d.mts"
        );
        expect(packageJson.exports["./types"].require.types).toBe(
            "./dist/types.d.ts"
        );
    });
});
