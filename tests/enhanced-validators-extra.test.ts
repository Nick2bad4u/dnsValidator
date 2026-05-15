import { describe, it, expect } from "vitest";
import {
    validateAAAARecord,
    validateMXRecord,
    validateARecord,
} from "../src/enhanced-validators";

describe("enhanced validators extra branches", () => {
    it("validateAAAARecord wrong type early return", () => {
        const res = validateAAAARecord({
            type: "A",
            address: "1.2.3.4",
        } as any);

        expect(res.isValid).toBeFalsy();
        expect(res.errors[0]).toMatch(/Expected record type 'A{4}'/);
    });

    it("validateAAAARecord invalid ipv6 branch", () => {
        const res = validateAAAARecord({
            type: "AAAA",
            address: "invalid::ip",
        });

        expect(res.isValid).toBeFalsy();
        expect(
            res.errors.some((e) => /Invalid IPv6 address/.test(e))
        ).toBeTruthy();
    });

    it("validateAAAARecord invalid ttl branch", () => {
        const res = validateAAAARecord({
            type: "AAAA",
            address: "2001:db8::1",
            ttl: -5,
        });

        expect(res.isValid).toBeFalsy();
        expect(res.errors.some((e) => /Invalid TTL/.test(e))).toBeTruthy();
    });

    it("validateMXRecord wrong type early return", () => {
        const res = validateMXRecord({
            type: "A",
            exchange: "mail.example.com",
            priority: 10,
        } as any);

        expect(res.isValid).toBeFalsy();
        expect(res.errors[0]).toMatch(/Expected record type 'MX'/);
    });

    it("validateMXRecord invalid exchange fqdn branch", () => {
        const res = validateMXRecord({
            type: "MX",
            exchange: "not_a_domain",
            priority: 10,
        });

        expect(res.isValid).toBeFalsy();
        expect(
            res.errors.some((e) => /Invalid FQDN for exchange/.test(e))
        ).toBeTruthy();
    });

    it("validateMXRecord invalid priority branch", () => {
        const res = validateMXRecord({
            type: "MX",
            exchange: "mail.example.com",
            priority: 999_999,
        });

        expect(res.isValid).toBeFalsy();
        expect(res.errors.some((e) => /Invalid priority/.test(e))).toBeTruthy();
    });

    it("validateMXRecord invalid ttl branch", () => {
        const res = validateMXRecord({
            type: "MX",
            exchange: "mail.example.com",
            priority: 10,
            ttl: -10,
        });

        expect(res.isValid).toBeFalsy();
        expect(
            res.errors.some((e) => /Invalid TTL value: -10/.test(e))
        ).toBeTruthy();
    });

    // Added tests to cover missing address branches for A and AAAA records where address is not a string
    it("validateARecord missing address field type error", () => {
        const res = validateARecord({ type: "A", address: 123 } as any);

        expect(res.isValid).toBeFalsy();
        expect(
            res.errors.some((e) =>
                /A record must have a 'address' field of type string/.test(e)
            )
        ).toBeTruthy();
    });

    it("validateAAAARecord missing address field type error", () => {
        const res = validateAAAARecord({ type: "AAAA", address: 123 } as any);

        expect(res.isValid).toBeFalsy();
        expect(
            res.errors.some((e) =>
                /AAAA record must have a 'address' field of type string/.test(e)
            )
        ).toBeTruthy();
    });
});
