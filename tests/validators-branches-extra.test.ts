import { describe, it, expect } from "vitest";
import {
    isANYRecord,
    isCNAMERecord,
    isNSRecord,
    isPTRRecord,
    isTXTRecord,
    validateDNSRecord,
} from "../src/validators";
import {
    getValidationSuggestions,
    validateARecord,
    validateAAAARecord,
    validateMXRecord,
} from "../src/enhanced-validators";

describe("validators extra branches", () => {
    it("validateDNSRecord unsupported type suggestions", () => {
        const result = validateDNSRecord({
            type: "UNSUPPORTED",
            foo: "bar",
        } as any);

        expect(result.isValid).toBeFalsy();
        expect(
            result.errors.some((e) => e.includes("Unsupported record type"))
        ).toBeTruthy();
    });

    it("validateDNSRecord per-type suggestions A", () => {
        const r = validateDNSRecord({ type: "A", address: "999.0.0.1" } as any);

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("A records require"))
        ).toBeTruthy();
    });

    it("validateDNSRecord per-type suggestions MX", () => {
        const r = validateDNSRecord({ type: "MX", priority: 10 } as any);

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("MX records require"))
        ).toBeTruthy();
    });

    it("getValidationSuggestions covers all switch cases", () => {
        const a = getValidationSuggestions("A");
        const aaaa = getValidationSuggestions("AAAA");
        const mx = getValidationSuggestions("MX");
        const cname = getValidationSuggestions("CNAME");
        const def = getValidationSuggestions("SOMETHINGELSE");

        expect(a.some((s) => s.includes("IPv4"))).toBeTruthy();
        expect(aaaa.some((s) => s.includes("IPv6"))).toBeTruthy();
        expect(mx.some((s) => s.includes("priority"))).toBeTruthy();
        expect(cname.some((s) => s.includes("CNAME records"))).toBeTruthy();
        expect(def.length).toBeGreaterThan(0);
    });

    it("enhanced validators negative TTL branches", () => {
        const aRes = validateARecord({
            type: "A",
            address: "1.2.3.4",
            ttl: -5,
        });

        expect(aRes.isValid).toBeFalsy();

        const aaaaRes = validateAAAARecord({
            type: "AAAA",
            address: "::1",
            ttl: 999_999_999_999,
        });

        expect(aaaaRes.isValid).toBeFalsy();

        const mxRes = validateMXRecord({
            type: "MX",
            exchange: "mail.example.com",
            priority: -1,
        });

        expect(mxRes.isValid).toBeFalsy();
    });
});

describe("validators additional ttl and any array branches", () => {
    it("cNAME invalid ttl branch", () => {
        const rec = { type: "CNAME", value: "example.com", ttl: -5 };

        expect(isCNAMERecord(rec)).toBeFalsy();
    });

    it("tXT invalid ttl branch", () => {
        const rec = { type: "TXT", entries: ["ok"], ttl: -10 };

        expect(isTXTRecord(rec)).toBeFalsy();
    });

    it("nS invalid ttl branch", () => {
        const rec = { type: "NS", value: "ns1.example.com", ttl: -1 };

        expect(isNSRecord(rec)).toBeFalsy();
    });

    it("pTR invalid ttl branch", () => {
        const rec = { type: "PTR", value: "ptr.example.com", ttl: -2 };

        expect(isPTRRecord(rec)).toBeFalsy();
    });

    it("aNY records array path valid", () => {
        const rec = {
            type: "ANY",
            records: [{ type: "A", address: "1.2.3.4" }],
        } as any;

        expect(isANYRecord(rec)).toBeTruthy();
    });

    it("aNY records array invalid entry", () => {
        const rec = { type: "ANY", records: [{ notype: true }] } as any;

        expect(isANYRecord(rec)).toBeFalsy();
    });
});
