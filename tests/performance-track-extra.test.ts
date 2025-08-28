import {
  trackPerformance,
  ValidationPerformanceTracker,
} from '../src/performance';

describe('Performance tracker additional branch', () => {
  test('trackPerformance with function returning primitive skips success increment', () => {
    const tracker = new ValidationPerformanceTracker();
    const fn = trackPerformance(() => 42, tracker);
    fn();
    const metrics = tracker.getMetrics();
    expect(metrics.totalValidations).toBe(1);
    expect(metrics.successfulValidations).toBe(0); // branch where result not object with isValid true
  });
});
