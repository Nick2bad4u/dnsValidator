import { describe, it, expect } from "vitest";
import {
    ValidationPatterns,
    fastPreValidate,
    isPlainObject,
    isValidIntegerInRange,
    getRequiredField,
    getOptionalField,
    isValidRecordType,
    ValidationPerformanceTracker,
    trackPerformance,
} from "../src/performance";

interface TestValidationResult {
    readonly isValid: boolean;
}

type TestValidationFunction = (value: string) => TestValidationResult;

function restoreGlobalPerformance(
    descriptor: PropertyDescriptor | undefined
): void {
    if (descriptor) {
        Object.defineProperty(globalThis, "performance", descriptor);
        return;
    }

    Reflect.deleteProperty(globalThis, "performance");
}

describe("performance utilities", () => {
    describe("validationPatterns", () => {
        it("should have IPv4 pattern that matches valid IPs", () => {
            expect(ValidationPatterns.ipv4.test("192.168.1.1")).toBeTruthy();
            expect(ValidationPatterns.ipv4.test("8.8.8.8")).toBeTruthy();
            expect(
                ValidationPatterns.ipv4.test("255.255.255.255")
            ).toBeTruthy();
            expect(ValidationPatterns.ipv4.test("0.0.0.0")).toBeTruthy();
        });

        it("should have IPv4 pattern that rejects invalid IPs", () => {
            expect(ValidationPatterns.ipv4.test("999.999.999.999")).toBeFalsy();
            expect(ValidationPatterns.ipv4.test("192.168.1")).toBeFalsy();
            expect(
                ValidationPatterns.ipv4.test("not.an.ip.address")
            ).toBeFalsy();
            expect(ValidationPatterns.ipv4.test("")).toBeFalsy();
        });

        it("should have hex pattern that matches valid hex strings", () => {
            expect(ValidationPatterns.hex.test("ABCDEF123456")).toBeTruthy();
            expect(
                ValidationPatterns.hex.test("0123456789abcdef")
            ).toBeTruthy();
            expect(ValidationPatterns.hex.test("FF")).toBeTruthy();
        });

        it("should have hex pattern that rejects invalid hex strings", () => {
            expect(ValidationPatterns.hex.test("GHIJKL")).toBeFalsy();
            expect(ValidationPatterns.hex.test("123XYZ")).toBeFalsy();
            expect(ValidationPatterns.hex.test("12 34")).toBeFalsy();
        });

        it("should have FQDN pattern that matches valid domain names", () => {
            expect(ValidationPatterns.fqdn.test("example.com")).toBeTruthy();
            expect(
                ValidationPatterns.fqdn.test("sub.example.com")
            ).toBeTruthy();
            expect(ValidationPatterns.fqdn.test("a.b.c.d")).toBeTruthy();
        });

        it("should have FQDN pattern that rejects invalid domain names", () => {
            expect(ValidationPatterns.fqdn.test("invalid..domain")).toBeFalsy();
            expect(ValidationPatterns.fqdn.test(".example.com")).toBeFalsy();
            expect(ValidationPatterns.fqdn.test("example.com.")).toBeFalsy();
        });

        it("should have email pattern that matches valid email formats", () => {
            expect(
                ValidationPatterns.email.test("user@example.com")
            ).toBeTruthy();
            expect(
                ValidationPatterns.email.test("admin@sub.example.org")
            ).toBeTruthy();
        });

        it("should have email pattern that rejects invalid email formats", () => {
            expect(
                ValidationPatterns.email.test("userexample.com")
            ).toBeFalsy();
            expect(ValidationPatterns.email.test("@example.com")).toBeFalsy();
            expect(ValidationPatterns.email.test("user@")).toBeFalsy();
        });
    });

    describe(fastPreValidate, () => {
        it("should return false for definitely invalid values", () => {
            expect(fastPreValidate("999.999.999.999", "ipv4")).toBeFalsy();
            expect(fastPreValidate("GHIJKL", "hex")).toBeFalsy();
            expect(fastPreValidate("invalid..domain", "fqdn")).toBeFalsy();
        });

        it("should return null for values that pass pre-validation", () => {
            expect(fastPreValidate("192.168.1.1", "ipv4")).toBeNull();
            expect(fastPreValidate("ABCDEF123456", "hex")).toBeNull();
            expect(fastPreValidate("example.com", "fqdn")).toBeNull();
        });

        it("should return false for empty strings", () => {
            expect(fastPreValidate("", "ipv4")).toBeFalsy();
            expect(fastPreValidate("", "hex")).toBeFalsy();
            expect(fastPreValidate("", "fqdn")).toBeFalsy();
        });

        it("should return false for non-string inputs", () => {
            expect(fastPreValidate(123 as any, "ipv4")).toBeFalsy();
            expect(fastPreValidate(null as any, "hex")).toBeFalsy();
            expect(fastPreValidate(undefined as any, "fqdn")).toBeFalsy();
        });
    });

    describe(isPlainObject, () => {
        it("should return true for plain objects", () => {
            expect(isPlainObject({})).toBeTruthy();
            expect(isPlainObject({ a: 1, b: 2 })).toBeTruthy();
            expect(isPlainObject(Object.create(null))).toBeFalsy();
        });

        it("should return false for non-plain objects", () => {
            expect(isPlainObject([])).toBeFalsy();
            expect(isPlainObject(new Date())).toBeFalsy();
            expect(isPlainObject(new Map())).toBeFalsy();
            expect(isPlainObject(null)).toBeFalsy();
            expect(isPlainObject(undefined)).toBeFalsy();
            expect(isPlainObject("string")).toBeFalsy();
            expect(isPlainObject(123)).toBeFalsy();
        });
    });

    describe(isValidIntegerInRange, () => {
        it("should validate integers within range", () => {
            expect(isValidIntegerInRange(5, 0, 10)).toBeTruthy();
            expect(isValidIntegerInRange(0, 0, 10)).toBeTruthy();
            expect(isValidIntegerInRange(10, 0, 10)).toBeTruthy();
        });

        it("should reject integers outside range", () => {
            expect(isValidIntegerInRange(-1, 0, 10)).toBeFalsy();
            expect(isValidIntegerInRange(11, 0, 10)).toBeFalsy();
        });

        it("should reject non-integers", () => {
            expect(isValidIntegerInRange(5.5, 0, 10)).toBeFalsy();
            expect(isValidIntegerInRange("5", 0, 10)).toBeFalsy();
            expect(isValidIntegerInRange(null, 0, 10)).toBeFalsy();
        });
    });

    describe(getRequiredField, () => {
        const testObj = {
            stringField: "test",
            numberField: 42,
            booleanField: true,
            objectField: { nested: true },
            nullField: null,
        };

        it("should return field value when type matches", () => {
            expect(getRequiredField(testObj, "stringField", "string")).toBe(
                "test"
            );
            expect(getRequiredField(testObj, "numberField", "number")).toBe(42);
            expect(
                getRequiredField(testObj, "booleanField", "boolean")
            ).toBeTruthy();
            expect(
                getRequiredField(testObj, "objectField", "object")
            ).toStrictEqual({ nested: true });
        });

        it("should return null when field is missing", () => {
            expect(
                getRequiredField(testObj, "missingField", "string")
            ).toBeNull();
        });

        it("should return null when type does not match", () => {
            expect(
                getRequiredField(testObj, "stringField", "number")
            ).toBeNull();
            expect(
                getRequiredField(testObj, "numberField", "string")
            ).toBeNull();
        });

        it("should return null for null fields", () => {
            expect(getRequiredField(testObj, "nullField", "string")).toBeNull();
        });
    });

    describe(getOptionalField, () => {
        const testObj = {
            stringField: "test",
            numberField: 42,
        };

        it("should return field value when present and type matches", () => {
            expect(getOptionalField(testObj, "stringField", "string")).toBe(
                "test"
            );
            expect(getOptionalField(testObj, "numberField", "number")).toBe(42);
        });

        it("should return undefined when field is missing", () => {
            expect(
                getOptionalField(testObj, "missingField", "string")
            ).toBeUndefined();
        });

        it("should return null when type does not match", () => {
            expect(
                getOptionalField(testObj, "stringField", "number")
            ).toBeNull();
            expect(
                getOptionalField(testObj, "numberField", "string")
            ).toBeNull();
        });
    });

    describe(isValidRecordType, () => {
        it("should validate known DNS record types", () => {
            expect(isValidRecordType("A")).toBeTruthy();
            expect(isValidRecordType("AAAA")).toBeTruthy();
            expect(isValidRecordType("MX")).toBeTruthy();
            expect(isValidRecordType("DNSKEY")).toBeTruthy();
            expect(isValidRecordType("SSHFP")).toBeTruthy();
        });

        it("should reject unknown record types", () => {
            expect(isValidRecordType("UNKNOWN")).toBeFalsy();
            expect(isValidRecordType("INVALID")).toBeFalsy();
        });

        it("should reject non-string inputs", () => {
            expect(isValidRecordType(123)).toBeFalsy();
            expect(isValidRecordType(null)).toBeFalsy();
            expect(isValidRecordType(undefined)).toBeFalsy();
            expect(isValidRecordType({})).toBeFalsy();
        });
    });

    describe(ValidationPerformanceTracker, () => {
        it("should track validation performance", async () => {
            const tracker = new ValidationPerformanceTracker();
            const endTracking = tracker.startValidation();

            // Simulate some work
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 10);
            });

            endTracking();
            tracker.recordSuccess();

            const metrics = tracker.getMetrics();

            expect(metrics.totalValidations).toBe(1);
            expect(metrics.successfulValidations).toBe(1);
            expect(metrics.averageTimeMs).toBeGreaterThan(0);
        });

        it("should track cache hits and misses", () => {
            const tracker = new ValidationPerformanceTracker();

            tracker.recordCacheHit();
            tracker.recordCacheHit();
            tracker.recordCacheMiss();

            const metrics = tracker.getMetrics();

            expect(metrics.cacheHits).toBe(2);
            expect(metrics.cacheMisses).toBe(1);
        });

        it("should reset metrics", () => {
            const tracker = new ValidationPerformanceTracker();

            tracker.recordCacheHit();
            tracker.recordSuccess();

            tracker.reset();

            const metrics = tracker.getMetrics();

            expect(metrics.totalValidations).toBe(0);
            expect(metrics.successfulValidations).toBe(0);
            expect(metrics.cacheHits).toBe(0);
            expect(metrics.cacheMisses).toBe(0);
            expect(metrics.averageTimeMs).toBe(0);
        });

        it("should calculate average time correctly", () => {
            const tracker = new ValidationPerformanceTracker();
            // Guard for environments where performance may not exist
            const originalPerformanceDescriptor =
                Object.getOwnPropertyDescriptor(globalThis, "performance");

            let currentTime = 0;
            const fakePerf = {
                now: vi.fn<() => number>(() => currentTime),
            } as unknown as Performance;

            try {
                Object.defineProperty(globalThis, "performance", {
                    configurable: true,
                    value: fakePerf,
                });

                const endTracking1 = tracker.startValidation();
                currentTime = 100;
                endTracking1();

                const endTracking2 = tracker.startValidation();
                currentTime = 300;
                endTracking2();

                const metrics = tracker.getMetrics();

                expect(metrics.totalValidations).toBe(2);
                expect(metrics.averageTimeMs).toBe(150); // (100 + 200) / 2
            } finally {
                restoreGlobalPerformance(originalPerformanceDescriptor);
            }
        });
    });

    describe(trackPerformance, () => {
        it("should wrap validation function with performance tracking", () => {
            const tracker = new ValidationPerformanceTracker();
            const mockValidation = vi
                .fn<TestValidationFunction>()
                .mockReturnValue({ isValid: true });

            const trackedValidation = trackPerformance(mockValidation, tracker);
            const result = trackedValidation("test");

            expect(result).toStrictEqual({ isValid: true });
            expect(mockValidation).toHaveBeenCalledWith("test");
            expect(tracker.getMetrics().totalValidations).toBe(1);
            expect(tracker.getMetrics().successfulValidations).toBe(1);
        });

        it("should track failed validations", () => {
            const tracker = new ValidationPerformanceTracker();
            const mockValidation = vi
                .fn<TestValidationFunction>()
                .mockReturnValue({ isValid: false });

            const trackedValidation = trackPerformance(mockValidation, tracker);
            trackedValidation("test");

            expect(tracker.getMetrics().totalValidations).toBe(1);
            expect(tracker.getMetrics().successfulValidations).toBe(0);
        });

        it("should handle exceptions in validation functions", () => {
            const tracker = new ValidationPerformanceTracker();
            const mockValidation = vi
                .fn<TestValidationFunction>()
                .mockImplementation(() => {
                    throw new Error("Validation error");
                });

            const trackedValidation = trackPerformance(mockValidation, tracker);

            expect(() => trackedValidation("test")).toThrow("Validation error");
            expect(tracker.getMetrics().totalValidations).toBe(1);
            expect(tracker.getMetrics().successfulValidations).toBe(0);
        });
    });
});
