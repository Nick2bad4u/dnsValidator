import { describe, it, expect } from "vitest";
import {
    isARecord,
    isSOARecord,
    isSRVRecord,
    isCAARecord,
    isNAPTRRecord,
    isDNSRecord,
} from "../src/validators";
import {
    isValidTTL,
    isValidPriority,
    isValidWeight,
    isValidPort,
    isValidNAPTRFlags,
} from "../src/utils";

describe("additional Validator Edge Cases", () => {
    describe("isSOARecord edge cases", () => {
        it("should reject SOA with missing primary field", () => {
            const invalidSOA = {
                type: "SOA",
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with invalid primary FQDN", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "invalid..domain",
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with non-string primary", () => {
            const invalidSOA = {
                type: "SOA",
                primary: 123,
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with non-string admin", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: 123,
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with invalid admin email format", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "invalid-email",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with non-integer serial", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 123.45,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with negative refresh", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 123,
                refresh: -1,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with non-integer retry", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200.5,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with negative expiration", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: -1,
                minimum: 86_400,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should reject SOA with non-integer minimum", () => {
            const invalidSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400.5,
            };

            expect(isSOARecord(invalidSOA)).toBeFalsy();
        });

        it("should accept SOA without TTL", () => {
            const validSOA = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 123,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(validSOA)).toBeTruthy();
        });
    });

    describe("isSRVRecord edge cases", () => {
        it("should reject SRV with missing name field", () => {
            const invalidSRV = {
                type: "SRV",
                priority: 10,
                weight: 20,
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with non-string name", () => {
            const invalidSRV = {
                type: "SRV",
                name: 123,
                priority: 10,
                weight: 20,
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with invalid FQDN name", () => {
            const invalidSRV = {
                type: "SRV",
                name: "invalid..domain",
                priority: 10,
                weight: 20,
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with non-number priority", () => {
            const invalidSRV = {
                type: "SRV",
                name: "example.com",
                priority: "10",
                weight: 20,
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with invalid priority", () => {
            const invalidSRV = {
                type: "SRV",
                name: "example.com",
                priority: 70_000,
                weight: 20,
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with non-number weight", () => {
            const invalidSRV = {
                type: "SRV",
                name: "example.com",
                priority: 10,
                weight: "20",
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with invalid weight", () => {
            const invalidSRV = {
                type: "SRV",
                name: "example.com",
                priority: 10,
                weight: 70_000,
                port: 80,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with non-number port", () => {
            const invalidSRV = {
                type: "SRV",
                name: "example.com",
                priority: 10,
                weight: 20,
                port: "80",
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should reject SRV with invalid port", () => {
            const invalidSRV = {
                type: "SRV",
                name: "example.com",
                priority: 10,
                weight: 20,
                port: 70_000,
            };

            expect(isSRVRecord(invalidSRV)).toBeFalsy();
        });

        it("should accept SRV without TTL", () => {
            const validSRV = {
                type: "SRV",
                name: "example.com",
                priority: 10,
                weight: 20,
                port: 80,
            };

            expect(isSRVRecord(validSRV)).toBeTruthy();
        });
    });

    describe("isCAARecord edge cases", () => {
        it("should accept CAA with issue property", () => {
            const validCAA = {
                type: "CAA",
                critical: 0,
                issue: "ca.example.com",
            };

            expect(isCAARecord(validCAA)).toBeTruthy();
        });

        it("should accept CAA with issuewild property", () => {
            const validCAA = {
                type: "CAA",
                critical: 0,
                issuewild: "ca.example.com",
            };

            expect(isCAARecord(validCAA)).toBeTruthy();
        });

        it("should accept CAA with iodef property", () => {
            const validCAA = {
                type: "CAA",
                critical: 0,
                iodef: "mailto:security@example.com",
            };

            expect(isCAARecord(validCAA)).toBeTruthy();
        });

        it("should accept CAA with contactemail property", () => {
            const validCAA = {
                type: "CAA",
                critical: 0,
                contactemail: "security@example.com",
            };

            expect(isCAARecord(validCAA)).toBeTruthy();
        });

        it("should accept CAA with contactphone property", () => {
            const validCAA = {
                type: "CAA",
                critical: 0,
                contactphone: "+1-555-123-4567",
            };

            expect(isCAARecord(validCAA)).toBeTruthy();
        });

        it("should reject CAA with invalid critical flag", () => {
            const invalidCAA = {
                type: "CAA",
                critical: 999,
                issue: "test",
            };

            expect(isCAARecord(invalidCAA)).toBeFalsy();
        });

        it("should reject CAA with missing required fields", () => {
            const invalidCAA = {
                type: "CAA",
                critical: 0,
            };

            expect(isCAARecord(invalidCAA)).toBeFalsy();
        });

        it("should accept CAA without TTL", () => {
            const validCAA = {
                type: "CAA",
                critical: 0,
                issue: "ca.example.com",
            };

            expect(isCAARecord(validCAA)).toBeTruthy();
        });
    });

    describe("isNAPTRRecord edge cases", () => {
        it("should reject NAPTR with non-integer order", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10.5,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with order out of range", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 70_000,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with negative order", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: -1,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with non-integer preference", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20.5,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with preference out of range", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 70_000,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with non-string flags", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: 123,
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with invalid flags", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: "INVALID",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with non-string service", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: "U",
                service: 123,
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with non-string regexp", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: 123,
                replacement: "example.com",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with non-string replacement", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: 123,
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should reject NAPTR with invalid replacement FQDN", () => {
            const invalidNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "invalid..domain",
            };

            expect(isNAPTRRecord(invalidNAPTR)).toBeFalsy();
        });

        it("should accept NAPTR without TTL", () => {
            const validNAPTR = {
                type: "NAPTR",
                order: 10,
                preference: 20,
                flags: "U",
                service: "SIP+D2U",
                regexp: "",
                replacement: "example.com",
            };

            expect(isNAPTRRecord(validNAPTR)).toBeTruthy();
        });
    });

    describe("isDNSRecord edge cases", () => {
        it("should return false for null", () => {
            expect(isDNSRecord(null)).toBeFalsy();
        });

        it("should return false for undefined", () => {
            expect(isDNSRecord(undefined)).toBeFalsy();
        });

        it("should return false for non-object", () => {
            expect(isDNSRecord("string")).toBeFalsy();
            expect(isDNSRecord(123)).toBeFalsy();
            expect(isDNSRecord(true)).toBeFalsy();
        });

        it("should return false for unknown record type", () => {
            const unknownRecord = {
                type: "UNKNOWN",
                data: "test",
            };

            expect(isDNSRecord(unknownRecord)).toBeFalsy();
        });

        it("should handle DNSSEC record types", () => {
            const dnskeyRecord = {
                type: "DNSKEY",
                flags: 256,
                protocol: 3,
                algorithm: 8,
                publicKey: "ABCDEF123456",
            };

            expect(isDNSRecord(dnskeyRecord)).toBeTruthy();
        });
    });

    describe("utility function edge cases", () => {
        describe(isValidNAPTRFlags, () => {
            it("should accept valid single flags", () => {
                expect(isValidNAPTRFlags("S")).toBeTruthy();
                expect(isValidNAPTRFlags("A")).toBeTruthy();
                expect(isValidNAPTRFlags("U")).toBeTruthy();
                expect(isValidNAPTRFlags("P")).toBeTruthy();
            });

            it("should accept empty flags", () => {
                expect(isValidNAPTRFlags("")).toBeTruthy();
            });

            it("should accept lowercase flags", () => {
                expect(isValidNAPTRFlags("s")).toBeTruthy();
                expect(isValidNAPTRFlags("a")).toBeTruthy();
                expect(isValidNAPTRFlags("u")).toBeTruthy();
                expect(isValidNAPTRFlags("p")).toBeTruthy();
            });

            it("should reject invalid flags", () => {
                expect(isValidNAPTRFlags("X")).toBeFalsy();
                expect(isValidNAPTRFlags("123")).toBeFalsy();
            });

            it("should reject combination flags", () => {
                expect(isValidNAPTRFlags("SA")).toBeFalsy();
                expect(isValidNAPTRFlags("SU")).toBeFalsy();
                expect(isValidNAPTRFlags("AU")).toBeFalsy();
            });
        });

        describe("validation utilities with edge cases", () => {
            it("should handle edge case TTL values", () => {
                expect(isValidTTL(0)).toBeTruthy();
                expect(isValidTTL(2_147_483_647)).toBeTruthy();
                expect(isValidTTL(-1)).toBeFalsy();
                expect(isValidTTL(2_147_483_648)).toBeFalsy();
            });

            it("should handle edge case priority values", () => {
                expect(isValidPriority(0)).toBeTruthy();
                expect(isValidPriority(65_535)).toBeTruthy();
                expect(isValidPriority(-1)).toBeFalsy();
                expect(isValidPriority(65_536)).toBeFalsy();
            });

            it("should handle edge case weight values", () => {
                expect(isValidWeight(0)).toBeTruthy();
                expect(isValidWeight(65_535)).toBeTruthy();
                expect(isValidWeight(-1)).toBeFalsy();
                expect(isValidWeight(65_536)).toBeFalsy();
            });

            it("should handle edge case port values", () => {
                expect(isValidPort(0)).toBeTruthy();
                expect(isValidPort(65_535)).toBeTruthy();
                expect(isValidPort(-1)).toBeFalsy();
                expect(isValidPort(65_536)).toBeFalsy();
            });
        });
    });

    describe("type coercion and boundary tests", () => {
        it("should handle records with extra properties", () => {
            const recordWithExtra = {
                type: "A",
                address: "192.168.1.1",
                ttl: 300,
                extraProperty: "should be ignored",
            };

            expect(isARecord(recordWithExtra)).toBeTruthy();
        });

        it("should handle records with null/undefined optional fields", () => {
            const recordWithNulls = {
                type: "A",
                address: "192.168.1.1",
                ttl: null,
            };

            expect(isARecord(recordWithNulls)).toBeFalsy(); // TTL should be number or undefined
        });

        it("should handle array-like objects", () => {
            const arrayLike = {
                0: "A",
                1: "192.168.1.1",
                length: 2,
                type: "A",
                address: "192.168.1.1",
            };

            expect(isARecord(arrayLike)).toBeTruthy();
        });
    });
});
