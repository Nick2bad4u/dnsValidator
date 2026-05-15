import { describe, it, expect } from "vitest";
import { testGetCachedRegex } from "../src/performance";

describe("performance regex cache coverage", () => {
    it("creates new regex on first request and reuses on second", () => {
        const first = testGetCachedRegex("^abc$", "i");
        const second = testGetCachedRegex("^abc$", "i");

        expect(first).toBe(second);
    });
});
