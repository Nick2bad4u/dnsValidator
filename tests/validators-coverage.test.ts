import { describe, it, expect } from "vitest";
import {
    isSRVRecord,
    isCAARecord,
    isNAPTRRecord,
    isANYRecord,
    isTLSARecord,
    validateDNSRecord,
    isDNSRecord,
} from "../src/validators";

describe("validators Coverage Improvements", () => {
    describe("isSRVRecord edge cases", () => {
        it("should validate SRV record priority edge cases", () => {
            const invalidPriority = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: -1, // Invalid negative priority
                weight: 0,
                port: 80,
                target: "target.example.com",
            };

            expect(isSRVRecord(invalidPriority)).toBeFalsy();

            const invalidPriorityMax = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: 65_536, // Too high
                weight: 0,
                port: 80,
                target: "target.example.com",
            };

            expect(isSRVRecord(invalidPriorityMax)).toBeFalsy();
        });

        it("should validate SRV record weight edge cases", () => {
            const invalidWeight = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: 10,
                weight: -1, // Invalid negative weight
                port: 80,
                target: "target.example.com",
            };

            expect(isSRVRecord(invalidWeight)).toBeFalsy();

            const invalidWeightMax = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: 10,
                weight: 65_536, // Too high
                port: 80,
                target: "target.example.com",
            };

            expect(isSRVRecord(invalidWeightMax)).toBeFalsy();
        });

        it("should validate SRV record port edge cases", () => {
            const validPort0 = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: 10,
                weight: 0,
                port: 0, // Port 0 is actually valid
                target: "target.example.com",
            };

            expect(isSRVRecord(validPort0)).toBeTruthy();

            const invalidPortMax = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: 10,
                weight: 0,
                port: 65_536, // Too high
                target: "target.example.com",
            };

            expect(isSRVRecord(invalidPortMax)).toBeFalsy();
        });
    });

    describe("isCAARecord edge cases", () => {
        it("should reject invalid flags", () => {
            const invalidFlags = {
                type: "CAA",
                critical: 256, // Invalid flag value
                issue: "ca.example.net",
            };

            expect(isCAARecord(invalidFlags)).toBeFalsy();

            const negativeFlags = {
                type: "CAA",
                critical: -1, // Invalid negative flag
                issue: "ca.example.net",
            };

            expect(isCAARecord(negativeFlags)).toBeFalsy();
        });

        it("should validate type check paths", () => {
            // Test non-object input
            expect(isCAARecord(null)).toBeFalsy();
            expect(isCAARecord("string")).toBeFalsy();

            // Test wrong type
            const wrongType = {
                type: "A",
                critical: 0,
                issue: "ca.example.net",
            };

            expect(isCAARecord(wrongType)).toBeFalsy();
        });

        it("should validate critical value edge cases", () => {
            // Valid critical values
            const valid0 = {
                type: "CAA",
                critical: 0,
                issue: "ca.example.net",
            };

            expect(isCAARecord(valid0)).toBeTruthy();

            const valid128 = {
                type: "CAA",
                critical: 128,
                issue: "ca.example.net",
            };

            expect(isCAARecord(valid128)).toBeTruthy();

            // Invalid critical values - string type
            const invalidString = {
                type: "CAA",
                critical: "invalid",
                issue: "ca.example.net",
            };

            expect(isCAARecord(invalidString)).toBeFalsy();
        });
    });

    describe("isNAPTRRecord edge cases", () => {
        it("should validate order field boundaries", () => {
            const invalidOrderNegative = {
                type: "NAPTR",
                order: -1, // Invalid negative order
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
            };

            expect(isNAPTRRecord(invalidOrderNegative)).toBeFalsy();

            const invalidOrderMax = {
                type: "NAPTR",
                order: 65_536, // Too high
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
            };

            expect(isNAPTRRecord(invalidOrderMax)).toBeFalsy();
        });

        it("should validate preference field boundaries", () => {
            const invalidPrefNegative = {
                type: "NAPTR",
                order: 10,
                preference: -1, // Invalid negative preference
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
            };

            expect(isNAPTRRecord(invalidPrefNegative)).toBeFalsy();

            const invalidPrefMax = {
                type: "NAPTR",
                order: 10,
                preference: 65_536, // Too high
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
            };

            expect(isNAPTRRecord(invalidPrefMax)).toBeFalsy();
        });

        it("should validate flags string", () => {
            const invalidFlags = {
                type: "NAPTR",
                order: 10,
                preference: 10,
                flags: "INVALID", // Invalid flags
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
            };

            expect(isNAPTRRecord(invalidFlags)).toBeFalsy();
        });

        it("should validate replacement field", () => {
            const emptyReplacement = {
                type: "NAPTR",
                order: 10,
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "", // Empty replacement should be valid
            };

            expect(isNAPTRRecord(emptyReplacement)).toBeTruthy();

            const invalidFQDN = {
                type: "NAPTR",
                order: 10,
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "invalid..domain", // Invalid FQDN
            };

            expect(isNAPTRRecord(invalidFQDN)).toBeFalsy();
        });
    });

    describe(isANYRecord, () => {
        it("should validate ANY record structure", () => {
            const validAny = {
                type: "ANY",
                value: "any-value",
            };

            expect(isANYRecord(validAny)).toBeTruthy();

            const validAnyWithTTL = {
                type: "ANY",
                value: "any-value",
                ttl: 300,
            };

            expect(isANYRecord(validAnyWithTTL)).toBeTruthy();

            const invalidNoValue = {
                type: "ANY",
                // Missing value
            };

            expect(isANYRecord(invalidNoValue)).toBeFalsy();

            const invalidTTL = {
                type: "ANY",
                value: "any-value",
                ttl: -1, // Invalid TTL
            };

            expect(isANYRecord(invalidTTL)).toBeFalsy();
        });
    });

    describe("validateDNSRecord with specific types", () => {
        it("should route to correct validators", () => {
            const srvRecord = {
                type: "SRV",
                name: "service.tcp.example.com",
                priority: 10,
                weight: 0,
                port: 80,
                target: "target.example.com",
            };
            const srvResult = validateDNSRecord(srvRecord);

            expect(srvResult.isValid).toBeTruthy();

            const caaRecord = {
                type: "CAA",
                critical: 0,
                issue: "ca.example.net",
            };
            const caaResult = validateDNSRecord(caaRecord);

            expect(caaResult.isValid).toBeTruthy();
        });

        it("should handle NAPTR records correctly", () => {
            const naptrRecord = {
                type: "NAPTR",
                order: 10,
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
            };
            const naptrResult = validateDNSRecord(naptrRecord);
            console.log("NAPTR validation result:", naptrResult);

            expect(naptrResult.isValid).toBeTruthy();
        });

        it("should handle ANY records correctly", () => {
            const anyRecord = {
                type: "ANY",
                value: "any-value",
            };
            const anyResult = validateDNSRecord(anyRecord);

            expect(anyResult.isValid).toBeTruthy();
        });
    });

    describe("isTLSARecord edge cases", () => {
        it("should validate TLSA usage values", () => {
            const validTLSA = {
                type: "TLSA",
                usage: 3,
                selector: 1,
                matchingType: 1,
                certificate: "abcd1234",
            };

            expect(isTLSARecord(validTLSA)).toBeTruthy();

            // Invalid usage
            const invalidUsage = { ...validTLSA, usage: 5 };

            expect(isTLSARecord(invalidUsage)).toBeFalsy();
        });

        it("should validate TLSA selector values", () => {
            const validTLSA = {
                type: "TLSA",
                usage: 3,
                selector: 0,
                matchingType: 1,
                certificate: "abcd1234",
            };

            expect(isTLSARecord(validTLSA)).toBeTruthy();

            // Invalid selector
            const invalidSelector = { ...validTLSA, selector: 2 };

            expect(isTLSARecord(invalidSelector)).toBeFalsy();
        });

        it("should validate TLSA matchingType values", () => {
            const validTLSA = {
                type: "TLSA",
                usage: 3,
                selector: 1,
                matchingType: 2,
                certificate: "abcd1234",
            };

            expect(isTLSARecord(validTLSA)).toBeTruthy();

            // Invalid matchingType
            const invalidMatching = { ...validTLSA, matchingType: 4 };

            expect(isTLSARecord(invalidMatching)).toBeFalsy();
        });

        it("should validate TLSA certificate hex string", () => {
            const validTLSA = {
                type: "TLSA",
                usage: 3,
                selector: 1,
                matchingType: 1,
                certificate: "ABCDEF123456",
            };

            expect(isTLSARecord(validTLSA)).toBeTruthy();

            // Invalid hex string
            const invalidHex = { ...validTLSA, certificate: "GHIJK" };

            expect(isTLSARecord(invalidHex)).toBeFalsy();
        });
    });

    describe("isDNSRecord edge cases", () => {
        it("should handle records without explicit type validation", () => {
            const unknownTypeRecord = {
                type: "UNKNOWN_TYPE",
                data: "some-data",
            };

            // Should return false for unknown types
            expect(isDNSRecord(unknownTypeRecord)).toBeFalsy();
        });
    });
});
