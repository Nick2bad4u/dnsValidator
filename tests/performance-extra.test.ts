import {
  fastPreValidate,
  isValidRecordType,
  ValidationPerformanceTracker,
  trackPerformance,
} from '../src/performance';

describe('performance helpers extra coverage', () => {
  test('fastPreValidate early false and null path', () => {
    expect(fastPreValidate('', 'ipv4')).toBe(false); // empty string path
    expect(fastPreValidate('999.999.999.999', 'ipv4')).toBe(false); // regex fail
    // success path returns null
    expect(fastPreValidate('127.0.0.1', 'ipv4')).toBeNull();
  });
  test('isValidRecordType true/false', () => {
    expect(isValidRecordType('A')).toBe(true);
    expect(isValidRecordType('BOGUS')).toBe(false);
  });
  test('ValidationPerformanceTracker metrics update', () => {
    const tracker = new ValidationPerformanceTracker();
    const wrapped = trackPerformance(
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
