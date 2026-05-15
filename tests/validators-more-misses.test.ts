import { describe, it, expect } from "vitest";
import {
    isARecord,
    isAAAARecord,
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
} from "../src/validators";

describe("validators additional branch coverage", () => {
    const overTTL = 9_999_999_999; // Invalid ttl

    it("invalid TTL branches for multiple record types", () => {
        expect(
            isARecord({ type: "A", address: "1.1.1.1", ttl: overTTL })
        ).toBeFalsy();
        expect(
            isAAAARecord({ type: "AAAA", address: "2001:db8::1", ttl: overTTL })
        ).toBeFalsy();
        expect(
            isMXRecord({
                type: "MX",
                exchange: "mail.example.com",
                priority: 10,
                ttl: overTTL,
            })
        ).toBeFalsy();
        expect(
            isTXTRecord({ type: "TXT", entries: ["a"], ttl: overTTL })
        ).toBeFalsy();
        expect(
            isNSRecord({ type: "NS", value: "ns1.example.com", ttl: overTTL })
        ).toBeFalsy();
        expect(
            isPTRRecord({ type: "PTR", value: "ptr.example.com", ttl: overTTL })
        ).toBeFalsy();
        expect(
            isSRVRecord({
                type: "SRV",
                name: "s.example.com",
                priority: 1,
                weight: 1,
                port: 80,
                ttl: overTTL,
            })
        ).toBeFalsy();
        expect(
            isCAARecord({
                type: "CAA",
                critical: 0,
                issue: "letsencrypt.org",
                ttl: overTTL,
            })
        ).toBeFalsy();
        expect(
            isNAPTRRecord({
                type: "NAPTR",
                order: 1,
                preference: 1,
                flags: "U",
                service: "E2U+sip",
                regexp: "!.*!",
                replacement: "",
                ttl: overTTL,
            })
        ).toBeFalsy();
        expect(
            isTLSARecord({
                type: "TLSA",
                usage: 0,
                selector: 0,
                matchingType: 1,
                certificate: "abcdef",
                ttl: overTTL,
            })
        ).toBeFalsy();
    });

    it("aNY record with value path (no records array)", () => {
        expect(isANYRecord({ type: "ANY", value: "some value" })).toBeTruthy();
    });

    it("tLSA invalid usage outside range", () => {
        expect(
            isTLSARecord({
                type: "TLSA",
                usage: 9,
                selector: 0,
                matchingType: 1,
                certificate: "abcdef",
            })
        ).toBeFalsy();
    });

    it("nAPTR replacement FQDN path", () => {
        expect(
            isNAPTRRecord({
                type: "NAPTR",
                order: 1,
                preference: 1,
                flags: "U",
                service: "E2U+sip",
                regexp: "!.*!",
                replacement: "example.com",
            })
        ).toBeTruthy();
    });

    it("sOA record with alternate fields plus ttl", () => {
        const soa = {
            type: "SOA",
            nsname: "ns1.example.com",
            hostmaster: "hostmaster.example.com",
            serial: 1,
            refresh: 1,
            retry: 1,
            expire: 1,
            minttl: 1,
            ttl: 60,
        };

        expect(isSOARecord(soa)).toBeTruthy();
    });

    it("isDNSRecord default unsupported type returns false", () => {
        expect(isDNSRecord({ type: "UNSUPPORTED" })).toBeFalsy();
    });
});
