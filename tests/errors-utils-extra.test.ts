import { describe, it, expect } from "vitest";
import { isNodeDNSErrorCode } from "../src/errors";
import { isValidDNSRecord, isValidDNSQueryResult } from "../src/utils";

describe("errors & utils extra branches", () => {
    it("isNodeDNSErrorCode valid and invalid", () => {
        expect(isNodeDNSErrorCode("NODATA")).toBeTruthy();
        expect(isNodeDNSErrorCode("NOT_A_CODE")).toBeFalsy();
        expect(isNodeDNSErrorCode(123 as any)).toBeFalsy();
    });

    it("isValidDNSRecord invalid TTL range and invalid type", () => {
        expect(
            isValidDNSRecord({ type: "A", ttl: 999_999_999_999 })
        ).toBeFalsy(); // Ttl out of range
        expect(isValidDNSRecord({ type: "UNKNOWN" } as any)).toBeFalsy(); // Unsupported type
    });

    it("isValidDNSQueryResult invalid answers entry", () => {
        const bad = {
            question: { name: "example.com", type: "A", class: "IN" },
            answers: [{}, { type: "A" }],
        } as any;

        expect(isValidDNSQueryResult(bad)).toBeFalsy();
    });
});
