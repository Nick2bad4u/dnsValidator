import { describe, it, expect } from "vitest";
import {
    isValidDNSQueryResult,
    validateDNSResponse,
    isValidPort,
    isValidPriority,
    isValidWeight,
    isValidTTL,
    isValidCAAFlags,
    isValidNAPTRFlags,
    isValidTLSAUsage,
    isValidTLSASelector,
    isValidTLSAMatchingType,
    isValidHexString,
    isValidTextRecord,
} from "../src/utils";
import type { DNSQueryResult } from "../src/types";

describe("dNS Utility Functions", () => {
    describe(isValidDNSQueryResult, () => {
        it("should validate complete DNS query results", () => {
            const validResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: [
                    {
                        type: "A",
                        address: "192.168.1.1",
                        ttl: 300,
                    },
                ],
            };

            expect(isValidDNSQueryResult(validResult)).toBeTruthy();
        });

        it("should reject results without question section", () => {
            const invalidResult = {
                answers: [
                    {
                        type: "A",
                        address: "192.168.1.1",
                        ttl: 300,
                    },
                ],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject results with invalid answers", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: [
                    {
                        type: "INVALID",
                        data: "something",
                    },
                ],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });
    });

    describe(validateDNSResponse, () => {
        it("should validate responses with matching question and answer types", () => {
            const response: DNSQueryResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: [
                    {
                        type: "A",
                        address: "192.168.1.1",
                        ttl: 300,
                    },
                ],
            };
            const result = validateDNSResponse(response);

            expect(result.isValid).toBeTruthy();
            expect(result.warnings).toHaveLength(0);
        });

        it("should warn about type mismatches", () => {
            const response: DNSQueryResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: [
                    {
                        type: "CNAME",
                        value: "alias.example.com",
                        ttl: 300,
                    },
                ],
            };
            const result = validateDNSResponse(response);

            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it("should handle ANY query type without warnings", () => {
            const response: DNSQueryResult = {
                question: {
                    name: "example.com",
                    type: "ANY",
                    class: "IN",
                },
                answers: [
                    {
                        type: "A",
                        address: "192.168.1.1",
                        ttl: 300,
                    },
                    {
                        type: "CNAME",
                        value: "alias.example.com",
                        ttl: 300,
                    },
                ],
            };
            const result = validateDNSResponse(response);

            expect(result.isValid).toBeTruthy();
            expect(result.warnings).toHaveLength(0); // No warnings for ANY type
        });
    });

    describe("validation utility functions", () => {
        describe(isValidPort, () => {
            it("should validate valid port numbers", () => {
                expect(isValidPort(80)).toBeTruthy();
                expect(isValidPort(443)).toBeTruthy();
                expect(isValidPort(0)).toBeTruthy();
                expect(isValidPort(65_535)).toBeTruthy();
            });

            it("should reject invalid port numbers", () => {
                expect(isValidPort(-1)).toBeFalsy();
                expect(isValidPort(65_536)).toBeFalsy();
                expect(isValidPort(1.5)).toBeFalsy();
            });
        });

        describe(isValidTTL, () => {
            it("should validate valid TTL values", () => {
                expect(isValidTTL(0)).toBeTruthy();
                expect(isValidTTL(300)).toBeTruthy();
                expect(isValidTTL(2_147_483_647)).toBeTruthy();
            });

            it("should reject invalid TTL values", () => {
                expect(isValidTTL(-1)).toBeFalsy();
                expect(isValidTTL(2_147_483_648)).toBeFalsy();
                expect(isValidTTL(300.5)).toBeFalsy();
            });
        });

        describe(isValidHexString, () => {
            it("should validate hex strings", () => {
                expect(isValidHexString("abcdef123456")).toBeTruthy();
                expect(isValidHexString("ABCDEF123456")).toBeTruthy();
                expect(isValidHexString("0123456789abcdef")).toBeTruthy();
            });

            it("should reject non-hex strings", () => {
                expect(isValidHexString("ghijkl")).toBeFalsy();
                expect(isValidHexString("12345g")).toBeFalsy();
                expect(isValidHexString("hello world")).toBeFalsy();
            });
        });

        describe(isValidNAPTRFlags, () => {
            it("should validate NAPTR flags", () => {
                expect(isValidNAPTRFlags("S")).toBeTruthy();
                expect(isValidNAPTRFlags("A")).toBeTruthy();
                expect(isValidNAPTRFlags("U")).toBeTruthy();
                expect(isValidNAPTRFlags("P")).toBeTruthy();
                expect(isValidNAPTRFlags("")).toBeTruthy();
                expect(isValidNAPTRFlags("s")).toBeTruthy(); // Case insensitive
            });

            it("should reject invalid NAPTR flags", () => {
                expect(isValidNAPTRFlags("X")).toBeFalsy();
                expect(isValidNAPTRFlags("SA")).toBeFalsy();
            });
        });

        describe("tLSA validation functions", () => {
            it("should validate TLSA usage values", () => {
                expect(isValidTLSAUsage(0)).toBeTruthy();
                expect(isValidTLSAUsage(1)).toBeTruthy();
                expect(isValidTLSAUsage(2)).toBeTruthy();
                expect(isValidTLSAUsage(3)).toBeTruthy();
                expect(isValidTLSAUsage(4)).toBeFalsy();
                expect(isValidTLSAUsage(-1)).toBeFalsy();
            });

            it("should validate TLSA selector values", () => {
                expect(isValidTLSASelector(0)).toBeTruthy();
                expect(isValidTLSASelector(1)).toBeTruthy();
                expect(isValidTLSASelector(2)).toBeFalsy();
                expect(isValidTLSASelector(-1)).toBeFalsy();
            });

            it("should validate TLSA matching type values", () => {
                expect(isValidTLSAMatchingType(0)).toBeTruthy();
                expect(isValidTLSAMatchingType(1)).toBeTruthy();
                expect(isValidTLSAMatchingType(2)).toBeTruthy();
                expect(isValidTLSAMatchingType(3)).toBeFalsy();
                expect(isValidTLSAMatchingType(-1)).toBeFalsy();
            });
        });

        describe(isValidTextRecord, () => {
            it("should validate printable ASCII text", () => {
                expect(isValidTextRecord("Hello World")).toBeTruthy();
                expect(
                    isValidTextRecord("v=spf1 include:_spf.google.com ~all")
                ).toBeTruthy();
                expect(isValidTextRecord("123456789")).toBeTruthy();
            });

            it("should handle empty strings", () => {
                expect(isValidTextRecord("")).toBeTruthy();
            });
        });

        describe(isValidPriority, () => {
            it("should validate valid priority values", () => {
                expect(isValidPriority(0)).toBeTruthy();
                expect(isValidPriority(10)).toBeTruthy();
                expect(isValidPriority(65_535)).toBeTruthy();
            });

            it("should reject invalid priority values", () => {
                expect(isValidPriority(-1)).toBeFalsy();
                expect(isValidPriority(65_536)).toBeFalsy();
                expect(isValidPriority(1.5)).toBeFalsy();
                expect(isValidPriority(Number.NaN)).toBeFalsy();
                expect(isValidPriority(Infinity)).toBeFalsy();
            });
        });

        describe(isValidWeight, () => {
            it("should validate valid weight values", () => {
                expect(isValidWeight(0)).toBeTruthy();
                expect(isValidWeight(20)).toBeTruthy();
                expect(isValidWeight(65_535)).toBeTruthy();
            });

            it("should reject invalid weight values", () => {
                expect(isValidWeight(-1)).toBeFalsy();
                expect(isValidWeight(65_536)).toBeFalsy();
                expect(isValidWeight(2.5)).toBeFalsy();
                expect(isValidWeight(Number.NaN)).toBeFalsy();
                expect(isValidWeight(Infinity)).toBeFalsy();
            });
        });

        describe(isValidCAAFlags, () => {
            it("should validate valid CAA flags", () => {
                expect(isValidCAAFlags(0)).toBeTruthy();
                expect(isValidCAAFlags(128)).toBeTruthy();
                expect(isValidCAAFlags(255)).toBeTruthy();
            });

            it("should reject invalid CAA flags", () => {
                expect(isValidCAAFlags(-1)).toBeFalsy();
                expect(isValidCAAFlags(256)).toBeFalsy();
                expect(isValidCAAFlags(1.5)).toBeFalsy();
                expect(isValidCAAFlags(Number.NaN)).toBeFalsy();
            });
        });
    });
});
