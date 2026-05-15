import { describe, it, expect } from "vitest";
import {
    fastPreValidate,
    isValidRecordType,
    ValidationPerformanceTracker,
    trackPerformance,
} from "../src/performance";

describe("performance helpers extra coverage", () => {
    it("fastPreValidate early false and null path", () => {
        expect(fastPreValidate("", "ipv4")).toBeFalsy(); // Empty string path
        expect(fastPreValidate("999.999.999.999", "ipv4")).toBeFalsy(); // Regex fail
        // success path returns null
        expect(fastPreValidate("127.0.0.1", "ipv4")).toBeNull();
    });

    it("isValidRecordType true/false", () => {
        expect(isValidRecordType("A")).toBeTruthy();
        expect(isValidRecordType("BOGUS")).toBeFalsy();
    });

    it("validationPerformanceTracker metrics update", () => {
        const tracker = new ValidationPerformanceTracker();
        const wrapped = trackPerformance<[boolean], { isValid: boolean }>(
            (valid: boolean) => ({ isValid: valid }),
            tracker
        );
        wrapped(true);
        wrapped(false);
        const m = tracker.getMetrics();

        expect(m.totalValidations).toBe(2);
        expect(m.successfulValidations).toBe(1);

        tracker.reset();
        const m2 = tracker.getMetrics();

        expect(m2.totalValidations).toBe(0);
    });
});
