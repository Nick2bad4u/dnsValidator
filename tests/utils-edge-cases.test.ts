import { describe, it, expect } from "vitest";
import {
    isValidDNSQueryResult,
    isValidDNSRecord,
    validateDNSResponse,
    isValidCAAFlags,
    isValidTLSAUsage,
    isValidTLSASelector,
    isValidTLSAMatchingType,
    isValidHexString,
    isValidTextRecord,
} from "../src/utils";

describe("utils Edge Cases and Uncovered Paths", () => {
    describe("isValidDNSQueryResult edge cases", () => {
        it("should reject null input", () => {
            expect(isValidDNSQueryResult(null)).toBeFalsy();
        });

        it("should reject non-object input", () => {
            expect(isValidDNSQueryResult("string")).toBeFalsy();
            expect(isValidDNSQueryResult(123)).toBeFalsy();
            expect(isValidDNSQueryResult(true)).toBeFalsy();
        });

        it("should reject result with non-object question", () => {
            const invalidResult = {
                question: "invalid",
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with missing question name", () => {
            const invalidResult = {
                question: {
                    type: "A",
                    class: "IN",
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with non-string question name", () => {
            const invalidResult = {
                question: {
                    name: 123,
                    type: "A",
                    class: "IN",
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with missing question type", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    class: "IN",
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with non-string question type", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    type: 123,
                    class: "IN",
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with missing question class", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    type: "A",
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with non-string question class", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: 123,
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with non-array answers", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: "not an array",
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should reject result with invalid answer records", () => {
            const invalidResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: [
                    {
                        type: "INVALID_TYPE",
                        address: "192.168.1.1",
                    },
                ],
            };

            expect(isValidDNSQueryResult(invalidResult)).toBeFalsy();
        });

        it("should accept result with empty answers array", () => {
            const validResult = {
                question: {
                    name: "example.com",
                    type: "A",
                    class: "IN",
                },
                answers: [],
            };

            expect(isValidDNSQueryResult(validResult)).toBeTruthy();
        });
    });

    describe("isValidDNSRecord edge cases", () => {
        it("should reject null input", () => {
            expect(isValidDNSRecord(null)).toBeFalsy();
        });

        it("should reject non-object input", () => {
            expect(isValidDNSRecord("string")).toBeFalsy();
            expect(isValidDNSRecord(123)).toBeFalsy();
            expect(isValidDNSRecord(true)).toBeFalsy();
        });

        it("should reject record without type field", () => {
            const invalidRecord = {
                address: "192.168.1.1",
            };

            expect(isValidDNSRecord(invalidRecord)).toBeFalsy();
        });

        it("should reject record with non-string type", () => {
            const invalidRecord = {
                type: 123,
                address: "192.168.1.1",
            };

            expect(isValidDNSRecord(invalidRecord)).toBeFalsy();
        });

        it("should reject record with invalid type", () => {
            const invalidRecord = {
                type: "INVALID_TYPE",
                address: "192.168.1.1",
            };

            expect(isValidDNSRecord(invalidRecord)).toBeFalsy();
        });

        it("should reject record with invalid TTL (non-integer)", () => {
            const invalidRecord = {
                type: "A",
                address: "192.168.1.1",
                ttl: 300.5,
            };

            expect(isValidDNSRecord(invalidRecord)).toBeFalsy();
        });

        it("should reject record with negative TTL", () => {
            const invalidRecord = {
                type: "A",
                address: "192.168.1.1",
                ttl: -1,
            };

            expect(isValidDNSRecord(invalidRecord)).toBeFalsy();
        });

        it("should reject record with TTL too large", () => {
            const invalidRecord = {
                type: "A",
                address: "192.168.1.1",
                ttl: 2_147_483_648, // Max int32 + 1
            };

            expect(isValidDNSRecord(invalidRecord)).toBeFalsy();
        });

        it("should accept record without TTL", () => {
            const validRecord = {
                type: "A",
                address: "192.168.1.1",
            };

            expect(isValidDNSRecord(validRecord)).toBeTruthy();
        });

        it("should accept valid record types", () => {
            const validTypes = [
                "A",
                "AAAA",
                "ANY",
                "CAA",
                "CNAME",
                "MX",
                "NAPTR",
                "NS",
                "PTR",
                "SOA",
                "SRV",
                "TLSA",
                "TXT",
            ];

            for (const type of validTypes) {
                const record = {
                    type,
                    data: "test",
                    ttl: 300,
                };

                expect(isValidDNSRecord(record)).toBeTruthy();
            }
        });
    });

    describe("validateDNSResponse edge cases", () => {
        it("should handle response with invalid records in answers", () => {
            const response = {
                question: {
                    name: "example.com",
                    type: "A" as const,
                    class: "IN",
                },
                answers: [
                    {
                        type: "INVALID",
                        data: "test",
                    },
                ],
            } as any;

            const result = validateDNSResponse(response);

            expect(result.isValid).toBeTruthy(); // Invalid records in answers don't make the overall result invalid
            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it("should validate complete valid response", () => {
            const response = {
                question: {
                    name: "example.com",
                    type: "A" as const,
                    class: "IN",
                },
                answers: [
                    {
                        type: "A",
                        address: "192.168.1.1",
                        ttl: 300,
                    },
                ],
            } as any;

            const result = validateDNSResponse(response);

            expect(result.isValid).toBeTruthy();
        });

        it("should handle response with type mismatch warnings", () => {
            const response = {
                question: {
                    name: "example.com",
                    type: "A" as const,
                    class: "IN",
                },
                answers: [
                    {
                        type: "CNAME",
                        value: "alias.example.com",
                        ttl: 300,
                    },
                ],
            } as any;

            const result = validateDNSResponse(response);

            expect(result.isValid).toBeTruthy();
            expect(result.warnings.length).toBeGreaterThan(0);
        });
    });

    describe("validation utility edge cases", () => {
        describe(isValidTLSAUsage, () => {
            it("should accept valid usage values", () => {
                expect(isValidTLSAUsage(0)).toBeTruthy();
                expect(isValidTLSAUsage(1)).toBeTruthy();
                expect(isValidTLSAUsage(2)).toBeTruthy();
                expect(isValidTLSAUsage(3)).toBeTruthy();
            });

            it("should reject invalid usage values", () => {
                expect(isValidTLSAUsage(-1)).toBeFalsy();
                expect(isValidTLSAUsage(4)).toBeFalsy();
                expect(isValidTLSAUsage(1.5)).toBeFalsy();
            });
        });

        describe(isValidTLSASelector, () => {
            it("should accept valid selector values", () => {
                expect(isValidTLSASelector(0)).toBeTruthy();
                expect(isValidTLSASelector(1)).toBeTruthy();
            });

            it("should reject invalid selector values", () => {
                expect(isValidTLSASelector(-1)).toBeFalsy();
                expect(isValidTLSASelector(2)).toBeFalsy();
                expect(isValidTLSASelector(0.5)).toBeFalsy();
            });
        });

        describe(isValidTLSAMatchingType, () => {
            it("should accept valid matching type values", () => {
                expect(isValidTLSAMatchingType(0)).toBeTruthy();
                expect(isValidTLSAMatchingType(1)).toBeTruthy();
                expect(isValidTLSAMatchingType(2)).toBeTruthy();
            });

            it("should reject invalid matching type values", () => {
                expect(isValidTLSAMatchingType(-1)).toBeFalsy();
                expect(isValidTLSAMatchingType(3)).toBeFalsy();
                expect(isValidTLSAMatchingType(1.5)).toBeFalsy();
            });
        });

        describe(isValidCAAFlags, () => {
            it("should accept valid CAA flags", () => {
                expect(isValidCAAFlags(0)).toBeTruthy();
                expect(isValidCAAFlags(128)).toBeTruthy();
                expect(isValidCAAFlags(255)).toBeTruthy();
                expect(isValidCAAFlags(1)).toBeTruthy();
            });

            it("should reject invalid CAA flags", () => {
                expect(isValidCAAFlags(-1)).toBeFalsy();
                expect(isValidCAAFlags(256)).toBeFalsy();
                expect(isValidCAAFlags(0.5)).toBeFalsy();
            });
        });

        describe(isValidHexString, () => {
            it("should accept valid hex strings", () => {
                expect(isValidHexString("0123456789ABCDEF")).toBeTruthy();
                expect(isValidHexString("abcdef")).toBeTruthy();
                expect(isValidHexString("FEDCBA9876543210")).toBeTruthy();
                expect(isValidHexString("123")).toBeTruthy();
            });

            it("should reject invalid hex strings", () => {
                expect(isValidHexString("")).toBeFalsy(); // Empty string is not valid hex
                expect(isValidHexString("XYZ")).toBeFalsy();
                expect(isValidHexString("123G")).toBeFalsy();
                expect(isValidHexString("12 34")).toBeFalsy();
                expect(isValidHexString("12-34")).toBeFalsy();
            });
        });

        describe(isValidTextRecord, () => {
            it("should accept valid text records", () => {
                expect(isValidTextRecord("")).toBeTruthy();
                expect(isValidTextRecord("Simple text")).toBeTruthy();
                expect(
                    isValidTextRecord("Multiple words with spaces")
                ).toBeTruthy();
                expect(isValidTextRecord("Text with numbers 123")).toBeTruthy();
                expect(
                    isValidTextRecord("Special chars: @#$%^&*()")
                ).toBeTruthy();
            });

            it("should handle very long text records", () => {
                const longText = "a".repeat(1000);

                expect(isValidTextRecord(longText)).toBeTruthy();
            });
        });
    });
});
