import { describe, it, expect } from "vitest";
import {
    normalizeSOA,
    normalizeTLSA,
    fromNodeTxt,
    toNodeTxt,
    fromNodeResolveAny,
} from "../src/node-compat";
import {
    isSOARecord,
    isTLSARecord,
    isANYRecord,
    isTXTRecord,
} from "../src/validators";
import { NodeDNSErrorCodes, isNodeDNSErrorCode } from "../src/errors";

describe("node compatibility helpers", () => {
    it("sOA normalization adds aliases", () => {
        const soa = normalizeSOA({
            type: "SOA",
            nsname: "ns1.example.com",
            hostmaster: "admin.example.com",
            serial: 1,
            refresh: 10,
            retry: 5,
            expire: 100,
            minttl: 50,
        });

        expect(isSOARecord(soa)).toBeTruthy();
        expect(soa.primary).toBe("ns1.example.com");
        expect(soa.admin).toBe("admin.example.com");
    });

    it("tLSA normalization adds aliases", () => {
        const tlsa = normalizeTLSA({
            type: "TLSA",
            certUsage: 3,
            selector: 1,
            match: 1,
            data: "abcdef",
        });

        expect(isTLSARecord(tlsa)).toBeTruthy();
        expect(tlsa.usage).toBe(3);
        expect(tlsa.certificate).toBe("abcdef");
    });

    it("tXT conversion round trip", () => {
        const nodeShape = [["part1", "part2"]];
        const internal = fromNodeTxt(nodeShape, 300);

        expect(internal).toHaveLength(1);
        expect(isTXTRecord(internal[0])).toBeTruthy();

        const back = toNodeTxt(internal);

        expect(back).toEqual(nodeShape);
    });

    it("aNY conversion", () => {
        const anyArr = [
            { type: "A", address: "1.2.3.4", ttl: 100 },
            { type: "CNAME", value: "example.com" },
        ];
        const anyRecord = fromNodeResolveAny(anyArr);

        expect(isANYRecord(anyRecord)).toBeTruthy();
        expect(anyRecord.records?.length).toBe(2);
    });

    it("error codes integrity", () => {
        // Spot check some codes
        expect(NodeDNSErrorCodes.NODATA).toBe("NODATA");
        expect(NodeDNSErrorCodes.CANCELLED).toBe("CANCELLED");
        // Guard
        expect(isNodeDNSErrorCode("NOTFOUND")).toBeTruthy();
        expect(isNodeDNSErrorCode("FAKE_CODE")).toBeFalsy();
    });
});
