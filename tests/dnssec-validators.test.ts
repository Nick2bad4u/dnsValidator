import { describe, it, expect } from "vitest";
import {
    isDNSKEYRecord,
    isDSRecord,
    isNSECRecord,
    isNSEC3Record,
    isRRSIGRecord,
    isSSHFPRecord,
} from "../src/dnssec-validators";

describe("dNSSEC Record Validators", () => {
    describe(isDNSKEYRecord, () => {
        it("should validate valid DNSKEY records", () => {
            const validDNSKEYRecord = {
                type: "DNSKEY",
                flags: 256,
                protocol: 3,
                algorithm: 8,
                publicKey:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
                ttl: 3600,
            };

            expect(isDNSKEYRecord(validDNSKEYRecord)).toBeTruthy();
        });

        it("should reject invalid protocol values", () => {
            const invalidDNSKEYRecord = {
                type: "DNSKEY",
                flags: 256,
                protocol: 2, // Must be 3
                algorithm: 8,
                publicKey:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isDNSKEYRecord(invalidDNSKEYRecord)).toBeFalsy();
        });

        it("should reject invalid algorithm values", () => {
            const invalidDNSKEYRecord = {
                type: "DNSKEY",
                flags: 256,
                protocol: 3,
                algorithm: 99, // Invalid algorithm
                publicKey:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isDNSKEYRecord(invalidDNSKEYRecord)).toBeFalsy();
        });

        it("should reject non-hex public keys", () => {
            const invalidDNSKEYRecord = {
                type: "DNSKEY",
                flags: 256,
                protocol: 3,
                algorithm: 8,
                publicKey: "not-hex-data!",
            };

            expect(isDNSKEYRecord(invalidDNSKEYRecord)).toBeFalsy();
        });
    });

    describe(isDSRecord, () => {
        it("should validate valid DS records", () => {
            const validDSRecord = {
                type: "DS",
                keyTag: 12_345,
                algorithm: 8,
                digestType: 2,
                digest: "A1B2C3D4E5F67890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
                ttl: 3600,
            };

            expect(isDSRecord(validDSRecord)).toBeTruthy();
        });

        it("should reject invalid digest types", () => {
            const invalidDSRecord = {
                type: "DS",
                keyTag: 12_345,
                algorithm: 8,
                digestType: 99, // Invalid digest type
                digest: "A1B2C3D4E5F67890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isDSRecord(invalidDSRecord)).toBeFalsy();
        });

        it("should reject invalid key tags", () => {
            const invalidDSRecord = {
                type: "DS",
                keyTag: 70_000, // Out of range
                algorithm: 8,
                digestType: 2,
                digest: "A1B2C3D4E5F67890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isDSRecord(invalidDSRecord)).toBeFalsy();
        });
    });

    describe(isNSECRecord, () => {
        it("should validate valid NSEC records", () => {
            const validNSECRecord = {
                type: "NSEC",
                nextDomainName: "next.example.com",
                typeBitMaps: [
                    "A",
                    "AAAA",
                    "RRSIG",
                    "NSEC",
                ],
                ttl: 3600,
            };

            expect(isNSECRecord(validNSECRecord)).toBeTruthy();
        });

        it("should reject invalid next domain names", () => {
            const invalidNSECRecord = {
                type: "NSEC",
                nextDomainName: "invalid..domain",
                typeBitMaps: ["A", "AAAA"],
            };

            expect(isNSECRecord(invalidNSECRecord)).toBeFalsy();
        });

        it("should reject non-array type bit maps", () => {
            const invalidNSECRecord = {
                type: "NSEC",
                nextDomainName: "next.example.com",
                typeBitMaps: "not-an-array",
            };

            expect(isNSECRecord(invalidNSECRecord)).toBeFalsy();
        });
    });

    describe(isNSEC3Record, () => {
        it("should validate valid NSEC3 records", () => {
            const validNSEC3Record = {
                type: "NSEC3",
                hashAlgorithm: 1,
                flags: 0,
                iterations: 10,
                salt: "AABBCCDD",
                nextHashedOwnerName: "A1B2C3D4E5F6",
                typeBitMaps: ["A", "RRSIG"],
                ttl: 3600,
            };

            expect(isNSEC3Record(validNSEC3Record)).toBeTruthy();
        });

        it("should validate NSEC3 records with empty salt", () => {
            const validNSEC3Record = {
                type: "NSEC3",
                hashAlgorithm: 1,
                flags: 1,
                iterations: 0,
                salt: "",
                nextHashedOwnerName: "A1B2C3D4E5F6",
                typeBitMaps: ["A"],
            };

            expect(isNSEC3Record(validNSEC3Record)).toBeTruthy();
        });

        it("should reject invalid hash algorithms", () => {
            const invalidNSEC3Record = {
                type: "NSEC3",
                hashAlgorithm: 2, // Only 1 (SHA-1) is valid
                flags: 0,
                iterations: 10,
                salt: "AABBCCDD",
                nextHashedOwnerName: "A1B2C3D4E5F6",
                typeBitMaps: ["A"],
            };

            expect(isNSEC3Record(invalidNSEC3Record)).toBeFalsy();
        });
    });

    describe(isRRSIGRecord, () => {
        it("should validate valid RRSIG records", () => {
            const validRRSIGRecord = {
                type: "RRSIG",
                typeCovered: "A",
                algorithm: 8,
                labels: 2,
                originalTTL: 3600,
                signatureExpiration: 1_234_567_890,
                signatureInception: 1_234_567_800,
                keyTag: 12_345,
                signerName: "example.com",
                signature:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
                ttl: 3600,
            };

            expect(isRRSIGRecord(validRRSIGRecord)).toBeTruthy();
        });

        it("should reject invalid signer names", () => {
            const invalidRRSIGRecord = {
                type: "RRSIG",
                typeCovered: "A",
                algorithm: 8,
                labels: 2,
                originalTTL: 3600,
                signatureExpiration: 1_234_567_890,
                signatureInception: 1_234_567_800,
                keyTag: 12_345,
                signerName: "invalid..domain",
                signature:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isRRSIGRecord(invalidRRSIGRecord)).toBeFalsy();
        });

        it("should reject invalid labels count", () => {
            const invalidRRSIGRecord = {
                type: "RRSIG",
                typeCovered: "A",
                algorithm: 8,
                labels: 300, // Out of range
                originalTTL: 3600,
                signatureExpiration: 1_234_567_890,
                signatureInception: 1_234_567_800,
                keyTag: 12_345,
                signerName: "example.com",
                signature:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isRRSIGRecord(invalidRRSIGRecord)).toBeFalsy();
        });
    });

    describe(isSSHFPRecord, () => {
        it("should validate valid SSHFP records", () => {
            const validSSHFPRecord = {
                type: "SSHFP",
                algorithm: 1,
                fpType: 1,
                fingerprint: "ABCDEF1234567890ABCDEF1234567890ABCDEF12",
                ttl: 3600,
            };

            expect(isSSHFPRecord(validSSHFPRecord)).toBeTruthy();
        });

        it("should validate SSHFP records with different algorithms", () => {
            const validSSHFPRecord = {
                type: "SSHFP",
                algorithm: 4, // Ed25519
                fpType: 2, // SHA-256
                fingerprint:
                    "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
            };

            expect(isSSHFPRecord(validSSHFPRecord)).toBeTruthy();
        });

        it("should reject invalid algorithms", () => {
            const invalidSSHFPRecord = {
                type: "SSHFP",
                algorithm: 99, // Invalid algorithm
                fpType: 1,
                fingerprint: "ABCDEF1234567890ABCDEF1234567890ABCDEF12",
            };

            expect(isSSHFPRecord(invalidSSHFPRecord)).toBeFalsy();
        });

        it("should reject invalid fingerprint types", () => {
            const invalidSSHFPRecord = {
                type: "SSHFP",
                algorithm: 1,
                fpType: 99, // Invalid fingerprint type
                fingerprint: "ABCDEF1234567890ABCDEF1234567890ABCDEF12",
            };

            expect(isSSHFPRecord(invalidSSHFPRecord)).toBeFalsy();
        });

        it("should reject non-hex fingerprints", () => {
            const invalidSSHFPRecord = {
                type: "SSHFP",
                algorithm: 1,
                fpType: 1,
                fingerprint: "not-hex-data!",
            };

            expect(isSSHFPRecord(invalidSSHFPRecord)).toBeFalsy();
        });
    });

    describe("edge cases", () => {
        it("should reject null and undefined inputs", () => {
            expect(isDNSKEYRecord(null)).toBeFalsy();
            expect(isDNSKEYRecord(undefined)).toBeFalsy();
            expect(isDSRecord(null)).toBeFalsy();
            expect(isDSRecord(undefined)).toBeFalsy();
            expect(isNSECRecord(null)).toBeFalsy();
            expect(isNSECRecord(undefined)).toBeFalsy();
            expect(isNSEC3Record(null)).toBeFalsy();
            expect(isNSEC3Record(undefined)).toBeFalsy();
            expect(isRRSIGRecord(null)).toBeFalsy();
            expect(isRRSIGRecord(undefined)).toBeFalsy();
            expect(isSSHFPRecord(null)).toBeFalsy();
            expect(isSSHFPRecord(undefined)).toBeFalsy();
        });

        it("should reject non-object inputs", () => {
            expect(isDNSKEYRecord("string")).toBeFalsy();
            expect(isDSRecord(123)).toBeFalsy();
            expect(isNSECRecord([])).toBeFalsy();
            expect(isNSEC3Record(true)).toBeFalsy();
            expect(isRRSIGRecord(new Date())).toBeFalsy();
            expect(isSSHFPRecord(Symbol("test"))).toBeFalsy();
        });
    });
});
