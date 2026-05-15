import { describe, it, expect } from "vitest";
import {
    trackPerformance,
    ValidationPerformanceTracker,
} from "../src/performance";

describe("performance tracker additional branch", () => {
    it("trackPerformance with function returning primitive skips success increment", () => {
        const tracker = new ValidationPerformanceTracker();
        const fn = trackPerformance(() => 42, tracker);
        fn();
        const metrics = tracker.getMetrics();

        expect(metrics.totalValidations).toBe(1);
        expect(metrics.successfulValidations).toBe(0); // Branch where result not object with isValid true
    });
});
