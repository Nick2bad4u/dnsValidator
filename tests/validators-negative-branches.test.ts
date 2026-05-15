import { describe, it, expect } from "vitest";
import { validateDNSRecord } from "../src/validators";

describe("validateDNSRecord negative suggestion branches", () => {
    it("a record suggestion", () => {
        const r = validateDNSRecord({ type: "A", address: "999.999.999.999" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("A records require"))
        ).toBeTruthy();
    });

    it("aAAA record suggestion", () => {
        const r = validateDNSRecord({ type: "AAAA", address: "not:ipv6" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("AAAA records require"))
        ).toBeTruthy();
    });

    it("mX record suggestion", () => {
        const r = validateDNSRecord({
            type: "MX",
            priority: -1,
            exchange: "bad..domain",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("MX records require"))
        ).toBeTruthy();
    });

    it("cNAME record suggestion", () => {
        const r = validateDNSRecord({ type: "CNAME", value: "bad..domain" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("CNAME records require"))
        ).toBeTruthy();
    });

    it("tXT record suggestion", () => {
        const r = validateDNSRecord({ type: "TXT", entries: "not-array" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("TXT records require"))
        ).toBeTruthy();
    });

    it("nS record suggestion", () => {
        const r = validateDNSRecord({ type: "NS", value: "invalid..domain" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("NS records require"))
        ).toBeTruthy();
    });

    it("pTR record suggestion", () => {
        const r = validateDNSRecord({ type: "PTR", value: "invalid..domain" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("PTR records require"))
        ).toBeTruthy();
    });

    it("sOA record suggestion (alias fields)", () => {
        const r = validateDNSRecord({
            type: "SOA",
            primary: "ns1..bad",
            admin: "bad-admin",
            serial: -1,
            refresh: -1,
            retry: -1,
            expiration: -1,
            minimum: -1,
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("SOA records require"))
        ).toBeTruthy();
    });

    it("sRV record suggestion", () => {
        const r = validateDNSRecord({
            type: "SRV",
            priority: -1,
            weight: -1,
            port: 99_999,
            name: "bad..domain",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("SRV records require"))
        ).toBeTruthy();
    });

    it("cAA record suggestion", () => {
        const r = validateDNSRecord({ type: "CAA", critical: 999 });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("CAA records require"))
        ).toBeTruthy();
    });

    it("nAPTR record suggestion", () => {
        const r = validateDNSRecord({
            type: "NAPTR",
            order: -1,
            preference: -2,
            flags: "Z",
            service: "",
            regexp: 5 as any,
            replacement: 7 as any,
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("NAPTR records require"))
        ).toBeTruthy();
    });

    it("tLSA record suggestion (alias fields)", () => {
        const r = validateDNSRecord({
            type: "TLSA",
            usage: 9,
            selector: -1,
            matchingType: 9,
            certificate: "nothex!",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("TLSA records require"))
        ).toBeTruthy();
    });

    it("dNSKEY record suggestion", () => {
        const r = validateDNSRecord({
            type: "DNSKEY",
            flags: -1,
            protocol: 2,
            algorithm: 999,
            publicKey: "nothex!",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("DNSKEY records require"))
        ).toBeTruthy();
    });

    it("dS record suggestion", () => {
        const r = validateDNSRecord({
            type: "DS",
            keyTag: -5,
            algorithm: 999,
            digestType: 9,
            digest: "nothex",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("DS records require"))
        ).toBeTruthy();
    });

    it("nSEC record suggestion", () => {
        const r = validateDNSRecord({
            type: "NSEC",
            nextDomainName: "bad..domain",
            typeBitMaps: "not-array",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("NSEC records require"))
        ).toBeTruthy();
    });

    it("nSEC3 record suggestion", () => {
        const r = validateDNSRecord({
            type: "NSEC3",
            hashAlgorithm: 2,
            flags: -1,
            iterations: -1,
            salt: "ZZ",
            nextHashedOwnerName: 123,
            typeBitMaps: "oops",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("NSEC3 records require"))
        ).toBeTruthy();
    });

    it("rRSIG record suggestion", () => {
        const r = validateDNSRecord({
            type: "RRSIG",
            typeCovered: 123,
            algorithm: "x",
            labels: "y",
            originalTTL: -1,
            signatureExpiration: -2,
            signatureInception: -3,
            keyTag: "abc",
            signerName: 42,
            signature: 99,
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("RRSIG records require"))
        ).toBeTruthy();
    });

    it("sSHFP record suggestion", () => {
        const r = validateDNSRecord({
            type: "SSHFP",
            algorithm: 99,
            fpType: 3,
            fingerprint: "nothex",
        });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("SSHFP records require"))
        ).toBeTruthy();
    });

    it("unsupported type suggestion", () => {
        const r = validateDNSRecord({ type: "UNKNOWN", some: "data" });

        expect(r.isValid).toBeFalsy();
        expect(
            r.errors.some((e) => e.includes("Unsupported record type"))
        ).toBeTruthy();
    });
});
