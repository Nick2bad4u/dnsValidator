import { describe, it, expect } from "vitest";
import { isDNSKEYRecord } from "../src/dnssec-validators";

describe("dNSSEC basic sanity", () => {
    it("isDNSKEYRecord rejects invalid input", () => {
        expect(isDNSKEYRecord({} as any)).toBeFalsy();
    });
});
