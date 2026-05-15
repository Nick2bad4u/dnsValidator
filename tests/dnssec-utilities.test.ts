import { describe, it, expect } from "vitest";
import {
    validateRRSIG,
    validateDNSKEY,
    validateDS,
    validateNSEC,
    validateNSEC3,
    validateNSEC3PARAM,
    calculateKeyTag,
    isRecommendedAlgorithm,
    isRecommendedDigestAlgorithm,
    validateSignatureTimestamps,
    DNSSECAlgorithm,
    DigestAlgorithm,
} from "../src/dnssec";
import { DNSValidationError } from "../src/errors";

describe("dnssec utilities", () => {
    it("validateRRSIG success", () => {
        const now = Math.floor(Date.now() / 1000);
        const rec = validateRRSIG({
            typeCovered: "A",
            algorithm: 8,
            labels: 2,
            originalTTL: 300,
            signatureExpiration: now + 3600,
            signatureInception: now - 60,
            keyTag: 12_345,
            signerName: "example.com",
            signature: "QUJDRA==", // 'ABCD'
        });

        expect(rec.typeCovered).toBe("A");
    });

    it("validateRRSIG invalid timestamp order", () => {
        const now = Math.floor(Date.now() / 1000);

        expect(() =>
            validateRRSIG({
                typeCovered: "A",
                algorithm: 8,
                labels: 1,
                originalTTL: 10,
                signatureExpiration: now,
                signatureInception: now + 10,
                keyTag: 1,
                signerName: "example.com",
                signature: "QUJDRA==",
            })
        ).toThrow(DNSValidationError);
    });

    it("validateDNSKEY success", () => {
        const rec = validateDNSKEY({
            flags: 256,
            protocol: 3,
            algorithm: 8,
            publicKey: "QUJDRA==",
        });

        expect(rec.algorithm).toBe(8);
    });

    it("validateDNSKEY invalid protocol", () => {
        expect(() =>
            validateDNSKEY({
                flags: 256,
                protocol: 2,
                algorithm: 8,
                publicKey: "QUJDRA==",
            })
        ).toThrow(DNSValidationError);
    });

    it("validateDS success", () => {
        const rec = validateDS({
            keyTag: 1,
            algorithm: 8,
            digestType: 2,
            digest: "a".repeat(64),
        });

        expect(rec.digest).toHaveLength(64);
    });

    it("validateDS invalid digest length", () => {
        expect(() =>
            validateDS({
                keyTag: 1,
                algorithm: 8,
                digestType: 2,
                digest: "abc",
            })
        ).toThrow(DNSValidationError);
    });

    it("validateNSEC success", () => {
        const rec = validateNSEC({
            nextDomainName: "b.example.com",
            types: ["A", "NS"],
        });

        // Prefer canonical property
        expect(rec.typeBitMaps).toHaveLength(2);
    });

    it("validateNSEC invalid type", () => {
        expect(() =>
            validateNSEC({
                nextDomainName: "b.example.com",
                types: ["A", "BADTYPE"],
            })
        ).toThrow(DNSValidationError);
    });

    it("validateNSEC3 success", () => {
        // Base32 (RFC4648) uppercase chars only, no padding required here
        const rec = validateNSEC3({
            hashAlgorithm: 1,
            flags: 0,
            iterations: 10,
            salt: "a1b2",
            nextHashedOwnerName: "ABCDE234",
            types: ["A", "NS"],
        });

        expect(rec.hashAlgorithm).toBe(1);
    });

    it("validateNSEC3 invalid nextHashedOwnerName format", () => {
        expect(() =>
            validateNSEC3({
                hashAlgorithm: 1,
                flags: 0,
                iterations: 10,
                salt: "a1b2",
                nextHashedOwnerName: "invalid$",
                types: ["A"],
            })
        ).toThrow(DNSValidationError);
    });

    it("validateNSEC3PARAM success", () => {
        const rec = validateNSEC3PARAM({
            hashAlgorithm: 1,
            flags: 0,
            iterations: 10,
            salt: "abcd",
        });

        expect(rec.flags).toBe(0);
    });

    it("validateNSEC3PARAM invalid salt format", () => {
        expect(() =>
            validateNSEC3PARAM({
                hashAlgorithm: 1,
                flags: 0,
                iterations: 10,
                salt: "zz",
            })
        ).toThrow(DNSValidationError);
    });

    it("calculateKeyTag deterministic", () => {
        const key = {
            type: "DNSKEY" as const,
            flags: 256,
            protocol: 3,
            algorithm: 8,
            publicKey: "QUJDRA==",
        };
        const tag1 = calculateKeyTag(key);
        const tag2 = calculateKeyTag(key);

        expect(tag1).toBe(tag2);
    });

    it("isRecommendedAlgorithm true/false cases", () => {
        expect(isRecommendedAlgorithm(DNSSECAlgorithm.RSASHA256)).toBeTruthy();
        expect(isRecommendedAlgorithm(DNSSECAlgorithm.RSASHA1)).toBeFalsy();
    });

    it("isRecommendedDigestAlgorithm true/false", () => {
        expect(
            isRecommendedDigestAlgorithm(DigestAlgorithm.SHA256)
        ).toBeTruthy();
        expect(isRecommendedDigestAlgorithm(DigestAlgorithm.SHA1)).toBeFalsy();
    });

    it("validateSignatureTimestamps not yet valid", () => {
        const now = Math.floor(Date.now() / 1000);

        expect(validateSignatureTimestamps(now + 1000, now + 2000)).toBeFalsy();
    });

    it("validateSignatureTimestamps expired", () => {
        const now = Math.floor(Date.now() / 1000);

        expect(validateSignatureTimestamps(now - 4000, now - 3000)).toBeFalsy();
    });

    it("validateSignatureTimestamps valid window", () => {
        const now = Math.floor(Date.now() / 1000);

        expect(validateSignatureTimestamps(now - 100, now + 100)).toBeTruthy();
    });
});
