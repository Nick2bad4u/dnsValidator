import { describe, it, expect } from "vitest";
import {
    isARecord,
    isAAAARecord,
    isCNAMERecord,
    isMXRecord,
    isTXTRecord,
    isNSRecord,
    isPTRRecord,
    isSOARecord,
    isSRVRecord,
    isCAARecord,
    isNAPTRRecord,
    isTLSARecord,
    isANYRecord,
    isDNSRecord,
    validateDNSRecord,
} from "../src/validators";

describe("dNS Record Validators", () => {
    describe(isARecord, () => {
        it("should validate valid A records", () => {
            const validARecord = {
                type: "A",
                address: "192.168.1.1",
                ttl: 300,
            };

            expect(isARecord(validARecord)).toBeTruthy();
        });

        it("should reject invalid IP addresses", () => {
            const invalidARecord = {
                type: "A",
                address: "999.999.999.999",
                ttl: 300,
            };

            expect(isARecord(invalidARecord)).toBeFalsy();
        });

        it("should reject IPv6 addresses", () => {
            const invalidARecord = {
                type: "A",
                address: "2001:db8::1",
                ttl: 300,
            };

            expect(isARecord(invalidARecord)).toBeFalsy();
        });

        it("should work without TTL", () => {
            const validARecord = {
                type: "A",
                address: "8.8.8.8",
            };

            expect(isARecord(validARecord)).toBeTruthy();
        });

        it("should reject non-object inputs", () => {
            expect(isARecord(null)).toBeFalsy();
            expect(isARecord(undefined)).toBeFalsy();
            expect(isARecord("string")).toBeFalsy();
            expect(isARecord(123)).toBeFalsy();
            expect(isARecord([])).toBeFalsy();
        });

        it("should reject records with wrong type", () => {
            const wrongTypeRecord = {
                type: "AAAA",
                address: "192.168.1.1",
                ttl: 300,
            };

            expect(isARecord(wrongTypeRecord)).toBeFalsy();
        });

        it("should reject records with invalid TTL", () => {
            const invalidTTLRecord = {
                type: "A",
                address: "192.168.1.1",
                ttl: -1,
            };

            expect(isARecord(invalidTTLRecord)).toBeFalsy();
        });
    });

    describe(isAAAARecord, () => {
        it("should validate valid AAAA records", () => {
            const validAAAARecord = {
                type: "AAAA",
                address: "2001:db8::1",
                ttl: 300,
            };

            expect(isAAAARecord(validAAAARecord)).toBeTruthy();
        });

        it("should reject IPv4 addresses", () => {
            const invalidAAAARecord = {
                type: "AAAA",
                address: "192.168.1.1",
                ttl: 300,
            };

            expect(isAAAARecord(invalidAAAARecord)).toBeFalsy();
        });

        it("should reject invalid IPv6 addresses", () => {
            const invalidAAAARecord = {
                type: "AAAA",
                address: "invalid:ipv6:address",
                ttl: 300,
            };

            expect(isAAAARecord(invalidAAAARecord)).toBeFalsy();
        });

        it("should work without TTL", () => {
            const validAAAARecord = {
                type: "AAAA",
                address: "::1",
            };

            expect(isAAAARecord(validAAAARecord)).toBeTruthy();
        });

        it("should reject non-object inputs", () => {
            expect(isAAAARecord(null)).toBeFalsy();
            expect(isAAAARecord(undefined)).toBeFalsy();
            expect(isAAAARecord("string")).toBeFalsy();
            expect(isAAAARecord([])).toBeFalsy();
        });
    });

    describe(isCNAMERecord, () => {
        it("should validate valid CNAME records", () => {
            const validCNAMERecord = {
                type: "CNAME",
                value: "example.com",
                ttl: 300,
            };

            expect(isCNAMERecord(validCNAMERecord)).toBeTruthy();
        });

        it("should reject invalid domain names", () => {
            const invalidCNAMERecord = {
                type: "CNAME",
                value: "invalid..domain",
                ttl: 300,
            };

            expect(isCNAMERecord(invalidCNAMERecord)).toBeFalsy();
        });
    });

    describe(isMXRecord, () => {
        it("should validate valid MX records", () => {
            const validMXRecord = {
                type: "MX",
                priority: 10,
                exchange: "mail.example.com",
                ttl: 300,
            };

            expect(isMXRecord(validMXRecord)).toBeTruthy();
        });

        it("should reject invalid priority values", () => {
            const invalidMXRecord = {
                type: "MX",
                priority: -1,
                exchange: "mail.example.com",
                ttl: 300,
            };

            expect(isMXRecord(invalidMXRecord)).toBeFalsy();
        });

        it("should reject invalid exchange domains", () => {
            const invalidMXRecord = {
                type: "MX",
                priority: 10,
                exchange: "invalid..domain",
                ttl: 300,
            };

            expect(isMXRecord(invalidMXRecord)).toBeFalsy();
        });
    });

    describe(isTXTRecord, () => {
        it("should validate valid TXT records", () => {
            const validTXTRecord = {
                type: "TXT",
                entries: [
                    "v=spf1 include:_spf.google.com ~all",
                    "google-site-verification=abc123",
                ],
                ttl: 300,
            };

            expect(isTXTRecord(validTXTRecord)).toBeTruthy();
        });

        it("should reject non-array entries", () => {
            const invalidTXTRecord = {
                type: "TXT",
                entries: "not an array",
                ttl: 300,
            };

            expect(isTXTRecord(invalidTXTRecord)).toBeFalsy();
        });

        it("should handle empty entries array", () => {
            const validTXTRecord = {
                type: "TXT",
                entries: [],
                ttl: 300,
            };

            expect(isTXTRecord(validTXTRecord)).toBeTruthy();
        });

        it("should reject entries with non-string values", () => {
            const invalidTXTRecord = {
                type: "TXT",
                entries: [
                    "valid string",
                    123,
                    "another string",
                ],
                ttl: 300,
            };

            expect(isTXTRecord(invalidTXTRecord)).toBeFalsy();
        });

        it("should handle single entry", () => {
            const validTXTRecord = {
                type: "TXT",
                entries: ["single entry"],
                ttl: 300,
            };

            expect(isTXTRecord(validTXTRecord)).toBeTruthy();
        });

        it("should work without TTL", () => {
            const validTXTRecord = {
                type: "TXT",
                entries: ["test entry"],
            };

            expect(isTXTRecord(validTXTRecord)).toBeTruthy();
        });
    });

    describe(isNSRecord, () => {
        it("should validate valid NS records", () => {
            const validNSRecord = {
                type: "NS",
                value: "ns1.example.com",
                ttl: 300,
            };

            expect(isNSRecord(validNSRecord)).toBeTruthy();
        });

        it("should reject invalid domain names", () => {
            const invalidNSRecord = {
                type: "NS",
                value: "invalid..domain",
                ttl: 300,
            };

            expect(isNSRecord(invalidNSRecord)).toBeFalsy();
        });
    });

    describe(isPTRRecord, () => {
        it("should validate valid PTR records", () => {
            const validPTRRecord = {
                type: "PTR",
                value: "example.com",
                ttl: 300,
            };

            expect(isPTRRecord(validPTRRecord)).toBeTruthy();
        });

        it("should reject invalid domain names", () => {
            const invalidPTRRecord = {
                type: "PTR",
                value: "invalid..domain",
                ttl: 300,
            };

            expect(isPTRRecord(invalidPTRRecord)).toBeFalsy();
        });

        it("should work without TTL", () => {
            const validPTRRecord = {
                type: "PTR",
                value: "host.example.com",
            };

            expect(isPTRRecord(validPTRRecord)).toBeTruthy();
        });
    });

    describe(isNAPTRRecord, () => {
        it("should validate valid NAPTR records", () => {
            const validNAPTRRecord = {
                type: "NAPTR",
                order: 100,
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
                ttl: 300,
            };

            expect(isNAPTRRecord(validNAPTRRecord)).toBeTruthy();
        });

        it("should validate NAPTR with empty replacement", () => {
            const validNAPTRRecord = {
                type: "NAPTR",
                order: 100,
                preference: 10,
                flags: "U",
                service: "E2U+sip",
                regexp: "!^.*$!sip:info@example.com!",
                replacement: "",
                ttl: 300,
            };

            expect(isNAPTRRecord(validNAPTRRecord)).toBeTruthy();
        });

        it("should reject invalid order values", () => {
            const invalidNAPTRRecord = {
                type: "NAPTR",
                order: -1,
                preference: 10,
                flags: "S",
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
                ttl: 300,
            };

            expect(isNAPTRRecord(invalidNAPTRRecord)).toBeFalsy();
        });

        it("should reject invalid flags", () => {
            const invalidNAPTRRecord = {
                type: "NAPTR",
                order: 100,
                preference: 10,
                flags: "Z", // Invalid flag
                service: "SIP+D2U",
                regexp: "",
                replacement: "sip.example.com",
                ttl: 300,
            };

            expect(isNAPTRRecord(invalidNAPTRRecord)).toBeFalsy();
        });
    });

    describe(isANYRecord, () => {
        it("should validate valid ANY records", () => {
            const validANYRecord = {
                type: "ANY",
                value: "some data",
                ttl: 300,
            };

            expect(isANYRecord(validANYRecord)).toBeTruthy();
        });

        it("should validate ANY records with various value types", () => {
            const anyRecordWithObject = {
                type: "ANY",
                value: { nested: "data" },
                ttl: 300,
            };

            expect(isANYRecord(anyRecordWithObject)).toBeTruthy();

            const anyRecordWithArray = {
                type: "ANY",
                value: ["array", "data"],
                ttl: 300,
            };

            expect(isANYRecord(anyRecordWithArray)).toBeTruthy();
        });

        it("should work without TTL", () => {
            const validANYRecord = {
                type: "ANY",
                value: "some data",
            };

            expect(isANYRecord(validANYRecord)).toBeTruthy();
        });

        it("should reject records without value", () => {
            const invalidANYRecord = {
                type: "ANY",
                ttl: 300,
            };

            expect(isANYRecord(invalidANYRecord)).toBeFalsy();
        });
    });

    describe(isSOARecord, () => {
        it("should validate valid SOA records", () => {
            const validSOARecord = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 2_023_010_101,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
                ttl: 300,
            };

            expect(isSOARecord(validSOARecord)).toBeTruthy();
        });

        it("should reject invalid serial numbers", () => {
            const invalidSOARecord = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: -1,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
                ttl: 300,
            };

            expect(isSOARecord(invalidSOARecord)).toBeFalsy();
        });

        it("should reject invalid admin format", () => {
            const invalidSOARecord = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "invalid-admin-format",
                serial: 2_023_010_101,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
                ttl: 300,
            };

            expect(isSOARecord(invalidSOARecord)).toBeFalsy();
        });

        it("should reject invalid refresh values", () => {
            const invalidSOARecord = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 2_023_010_101,
                refresh: -1,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
                ttl: 300,
            };

            expect(isSOARecord(invalidSOARecord)).toBeFalsy();
        });

        it("should work without TTL", () => {
            const validSOARecord = {
                type: "SOA",
                primary: "ns1.example.com",
                admin: "admin.example.com",
                serial: 2_023_010_101,
                refresh: 86_400,
                retry: 7200,
                expiration: 3_600_000,
                minimum: 86_400,
            };

            expect(isSOARecord(validSOARecord)).toBeTruthy();
        });
    });

    describe(isSRVRecord, () => {
        it("should validate valid SRV records", () => {
            const validSRVRecord = {
                type: "SRV",
                priority: 10,
                weight: 20,
                port: 443,
                name: "target.example.com",
                ttl: 300,
            };

            expect(isSRVRecord(validSRVRecord)).toBeTruthy();
        });

        it("should reject invalid port numbers", () => {
            const invalidSRVRecord = {
                type: "SRV",
                priority: 10,
                weight: 20,
                port: 70_000,
                name: "target.example.com",
                ttl: 300,
            };

            expect(isSRVRecord(invalidSRVRecord)).toBeFalsy();
        });
    });

    describe(isCAARecord, () => {
        it("should validate valid CAA records with issue property", () => {
            const validCAARecord = {
                type: "CAA",
                critical: 0,
                issue: "letsencrypt.org",
                ttl: 300,
            };

            expect(isCAARecord(validCAARecord)).toBeTruthy();
        });

        it("should validate valid CAA records with contact email", () => {
            const validCAARecord = {
                type: "CAA",
                critical: 128,
                contactemail: "admin@example.com",
                ttl: 300,
            };

            expect(isCAARecord(validCAARecord)).toBeTruthy();
        });

        it("should reject CAA records without any properties", () => {
            const invalidCAARecord = {
                type: "CAA",
                critical: 0,
                ttl: 300,
            };

            expect(isCAARecord(invalidCAARecord)).toBeFalsy();
        });
    });

    describe(isTLSARecord, () => {
        it("should validate valid TLSA records", () => {
            const validTLSARecord = {
                type: "TLSA",
                usage: 3,
                selector: 1,
                matchingType: 1,
                certificate: "abcdef1234567890",
                ttl: 300,
            };

            expect(isTLSARecord(validTLSARecord)).toBeTruthy();
        });

        it("should reject invalid usage values", () => {
            const invalidTLSARecord = {
                type: "TLSA",
                usage: 5,
                selector: 1,
                matchingType: 1,
                certificate: "abcdef1234567890",
                ttl: 300,
            };

            expect(isTLSARecord(invalidTLSARecord)).toBeFalsy();
        });

        it("should reject non-hex certificate data", () => {
            const invalidTLSARecord = {
                type: "TLSA",
                usage: 3,
                selector: 1,
                matchingType: 1,
                certificate: "not-hex-data!",
                ttl: 300,
            };

            expect(isTLSARecord(invalidTLSARecord)).toBeFalsy();
        });
    });

    describe(isDNSRecord, () => {
        it("should validate any valid DNS record type", () => {
            const aRecord = { type: "A", address: "192.168.1.1" };
            const aaaaRecord = { type: "AAAA", address: "2001:db8::1" };
            const cnameRecord = { type: "CNAME", value: "example.com" };

            expect(isDNSRecord(aRecord)).toBeTruthy();
            expect(isDNSRecord(aaaaRecord)).toBeTruthy();
            expect(isDNSRecord(cnameRecord)).toBeTruthy();
        });

        it("should reject unknown record types", () => {
            const unknownRecord = { type: "UNKNOWN", value: "something" };

            expect(isDNSRecord(unknownRecord)).toBeFalsy();
        });
    });

    describe(validateDNSRecord, () => {
        it("should return validation result for valid records", () => {
            const validRecord = { type: "A", address: "192.168.1.1" };
            const result = validateDNSRecord(validRecord);

            expect(result.isValid).toBeTruthy();
            expect(result.errors).toHaveLength(0);
        });

        it("should return validation errors for invalid records", () => {
            const invalidRecord = { type: "A", address: "invalid-ip" };
            const result = validateDNSRecord(invalidRecord);

            expect(result.isValid).toBeFalsy();
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it("should handle non-object inputs", () => {
            const result = validateDNSRecord("not an object");

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toContain("Record must be an object");
        });
    });
});
