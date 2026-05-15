import { describe, it, expect } from "vitest";
import {
    ValidationPerformanceTracker,
    trackPerformance,
} from "../src/performance";

describe("performance additional coverage", () => {
    it("instantiates a fresh tracker and records a successful validation", () => {
        const tracker = new ValidationPerformanceTracker();
        const fn = trackPerformance(() => ({ isValid: true }), tracker);
        const result = fn();

        expect(result.isValid).toBeTruthy();

        const metrics = tracker.getMetrics();

        expect(metrics.totalValidations).toBe(1);
        expect(metrics.successfulValidations).toBe(1);
    });
});
