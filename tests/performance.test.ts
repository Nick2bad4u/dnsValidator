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
} from '../src/performance';

describe('Performance Utilities', () => {
  describe('ValidationPatterns', () => {
    it('should have IPv4 pattern that matches valid IPs', () => {
      expect(ValidationPatterns.ipv4.test('192.168.1.1')).toBe(true);
      expect(ValidationPatterns.ipv4.test('8.8.8.8')).toBe(true);
      expect(ValidationPatterns.ipv4.test('255.255.255.255')).toBe(true);
      expect(ValidationPatterns.ipv4.test('0.0.0.0')).toBe(true);
    });

    it('should have IPv4 pattern that rejects invalid IPs', () => {
      expect(ValidationPatterns.ipv4.test('999.999.999.999')).toBe(false);
      expect(ValidationPatterns.ipv4.test('192.168.1')).toBe(false);
      expect(ValidationPatterns.ipv4.test('not.an.ip.address')).toBe(false);
      expect(ValidationPatterns.ipv4.test('')).toBe(false);
    });

    it('should have hex pattern that matches valid hex strings', () => {
      expect(ValidationPatterns.hex.test('ABCDEF123456')).toBe(true);
      expect(ValidationPatterns.hex.test('0123456789abcdef')).toBe(true);
      expect(ValidationPatterns.hex.test('FF')).toBe(true);
    });

    it('should have hex pattern that rejects invalid hex strings', () => {
      expect(ValidationPatterns.hex.test('GHIJKL')).toBe(false);
      expect(ValidationPatterns.hex.test('123XYZ')).toBe(false);
      expect(ValidationPatterns.hex.test('12 34')).toBe(false);
    });

    it('should have FQDN pattern that matches valid domain names', () => {
      expect(ValidationPatterns.fqdn.test('example.com')).toBe(true);
      expect(ValidationPatterns.fqdn.test('sub.example.com')).toBe(true);
      expect(ValidationPatterns.fqdn.test('a.b.c.d')).toBe(true);
    });

    it('should have FQDN pattern that rejects invalid domain names', () => {
      expect(ValidationPatterns.fqdn.test('invalid..domain')).toBe(false);
      expect(ValidationPatterns.fqdn.test('.example.com')).toBe(false);
      expect(ValidationPatterns.fqdn.test('example.com.')).toBe(false);
    });

    it('should have email pattern that matches valid email formats', () => {
      expect(ValidationPatterns.email.test('user@example.com')).toBe(true);
      expect(ValidationPatterns.email.test('admin@sub.example.org')).toBe(true);
    });

    it('should have email pattern that rejects invalid email formats', () => {
      expect(ValidationPatterns.email.test('userexample.com')).toBe(false);
      expect(ValidationPatterns.email.test('@example.com')).toBe(false);
      expect(ValidationPatterns.email.test('user@')).toBe(false);
    });
  });

  describe('fastPreValidate', () => {
    it('should return false for definitely invalid values', () => {
      expect(fastPreValidate('999.999.999.999', 'ipv4')).toBe(false);
      expect(fastPreValidate('GHIJKL', 'hex')).toBe(false);
      expect(fastPreValidate('invalid..domain', 'fqdn')).toBe(false);
    });

    it('should return null for values that pass pre-validation', () => {
      expect(fastPreValidate('192.168.1.1', 'ipv4')).toBe(null);
      expect(fastPreValidate('ABCDEF123456', 'hex')).toBe(null);
      expect(fastPreValidate('example.com', 'fqdn')).toBe(null);
    });

    it('should return false for empty strings', () => {
      expect(fastPreValidate('', 'ipv4')).toBe(false);
      expect(fastPreValidate('', 'hex')).toBe(false);
      expect(fastPreValidate('', 'fqdn')).toBe(false);
    });

    it('should return false for non-string inputs', () => {
      expect(fastPreValidate(123 as any, 'ipv4')).toBe(false);
      expect(fastPreValidate(null as any, 'hex')).toBe(false);
      expect(fastPreValidate(undefined as any, 'fqdn')).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(false);
    });

    it('should return false for non-plain objects', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
    });
  });

  describe('isValidIntegerInRange', () => {
    it('should validate integers within range', () => {
      expect(isValidIntegerInRange(5, 0, 10)).toBe(true);
      expect(isValidIntegerInRange(0, 0, 10)).toBe(true);
      expect(isValidIntegerInRange(10, 0, 10)).toBe(true);
    });

    it('should reject integers outside range', () => {
      expect(isValidIntegerInRange(-1, 0, 10)).toBe(false);
      expect(isValidIntegerInRange(11, 0, 10)).toBe(false);
    });

    it('should reject non-integers', () => {
      expect(isValidIntegerInRange(5.5, 0, 10)).toBe(false);
      expect(isValidIntegerInRange('5', 0, 10)).toBe(false);
      expect(isValidIntegerInRange(null, 0, 10)).toBe(false);
    });
  });

  describe('getRequiredField', () => {
    const testObj = {
      stringField: 'test',
      numberField: 42,
      booleanField: true,
      objectField: { nested: true },
      nullField: null,
    };

    it('should return field value when type matches', () => {
      expect(getRequiredField(testObj, 'stringField', 'string')).toBe('test');
      expect(getRequiredField(testObj, 'numberField', 'number')).toBe(42);
      expect(getRequiredField(testObj, 'booleanField', 'boolean')).toBe(true);
      expect(getRequiredField(testObj, 'objectField', 'object')).toEqual({
        nested: true,
      });
    });

    it('should return null when field is missing', () => {
      expect(getRequiredField(testObj, 'missingField', 'string')).toBe(null);
    });

    it('should return null when type does not match', () => {
      expect(getRequiredField(testObj, 'stringField', 'number')).toBe(null);
      expect(getRequiredField(testObj, 'numberField', 'string')).toBe(null);
    });

    it('should return null for null fields', () => {
      expect(getRequiredField(testObj, 'nullField', 'string')).toBe(null);
    });
  });

  describe('getOptionalField', () => {
    const testObj = {
      stringField: 'test',
      numberField: 42,
    };

    it('should return field value when present and type matches', () => {
      expect(getOptionalField(testObj, 'stringField', 'string')).toBe('test');
      expect(getOptionalField(testObj, 'numberField', 'number')).toBe(42);
    });

    it('should return undefined when field is missing', () => {
      expect(getOptionalField(testObj, 'missingField', 'string')).toBe(
        undefined
      );
    });

    it('should return null when type does not match', () => {
      expect(getOptionalField(testObj, 'stringField', 'number')).toBe(null);
      expect(getOptionalField(testObj, 'numberField', 'string')).toBe(null);
    });
  });

  describe('isValidRecordType', () => {
    it('should validate known DNS record types', () => {
      expect(isValidRecordType('A')).toBe(true);
      expect(isValidRecordType('AAAA')).toBe(true);
      expect(isValidRecordType('MX')).toBe(true);
      expect(isValidRecordType('DNSKEY')).toBe(true);
      expect(isValidRecordType('SSHFP')).toBe(true);
    });

    it('should reject unknown record types', () => {
      expect(isValidRecordType('UNKNOWN')).toBe(false);
      expect(isValidRecordType('INVALID')).toBe(false);
    });

    it('should reject non-string inputs', () => {
      expect(isValidRecordType(123)).toBe(false);
      expect(isValidRecordType(null)).toBe(false);
      expect(isValidRecordType(undefined)).toBe(false);
      expect(isValidRecordType({})).toBe(false);
    });
  });

  describe('ValidationPerformanceTracker', () => {
    let tracker: ValidationPerformanceTracker;

    beforeEach(() => {
      tracker = new ValidationPerformanceTracker();
    });

    it('should track validation performance', async () => {
      const endTracking = tracker.startValidation();

      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 10));

      endTracking();
      tracker.recordSuccess();

      const metrics = tracker.getMetrics();
      expect(metrics.totalValidations).toBe(1);
      expect(metrics.successfulValidations).toBe(1);
      expect(metrics.averageTimeMs).toBeGreaterThan(0);
    });

    it('should track cache hits and misses', () => {
      tracker.recordCacheHit();
      tracker.recordCacheHit();
      tracker.recordCacheMiss();

      const metrics = tracker.getMetrics();
      expect(metrics.cacheHits).toBe(2);
      expect(metrics.cacheMisses).toBe(1);
    });

    it('should reset metrics', () => {
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

    it('should calculate average time correctly', () => {
      // Guard for environments where performance may not exist
      const originalPerf = global.performance;
      const hasPerformance = !!originalPerf && typeof originalPerf.now === 'function';
      const originalNow = hasPerformance ? originalPerf.now : undefined;

      let currentTime = 0;
      const fakePerf = {
        now: jest.fn(() => currentTime),
      } as unknown as Performance;

      // Install fake performance (construct minimal object if missing)
      // @ts-ignore
      global.performance = hasPerformance ? (global.performance as any) : ({} as any);
      // @ts-ignore
      global.performance.now = fakePerf.now;

      const endTracking1 = tracker.startValidation();
      currentTime = 100;
      endTracking1();

      const endTracking2 = tracker.startValidation();
      currentTime = 300;
      endTracking2();

      const metrics = tracker.getMetrics();
      expect(metrics.totalValidations).toBe(2);
      expect(metrics.averageTimeMs).toBe(150); // (100 + 200) / 2

      // Restore
      if (hasPerformance && originalNow) {
        // @ts-ignore
        global.performance.now = originalNow;
      } else {
        // @ts-ignore
        delete global.performance;
      }
    });
  });

  describe('trackPerformance', () => {
    it('should wrap validation function with performance tracking', () => {
      const tracker = new ValidationPerformanceTracker();
      const mockValidation = jest.fn().mockReturnValue({ isValid: true });

      const trackedValidation = trackPerformance(mockValidation, tracker);
      const result = trackedValidation('test');

      expect(result).toEqual({ isValid: true });
      expect(mockValidation).toHaveBeenCalledWith('test');
      expect(tracker.getMetrics().totalValidations).toBe(1);
      expect(tracker.getMetrics().successfulValidations).toBe(1);
    });

    it('should track failed validations', () => {
      const tracker = new ValidationPerformanceTracker();
      const mockValidation = jest.fn().mockReturnValue({ isValid: false });

      const trackedValidation = trackPerformance(mockValidation, tracker);
      trackedValidation('test');

      expect(tracker.getMetrics().totalValidations).toBe(1);
      expect(tracker.getMetrics().successfulValidations).toBe(0);
    });

    it('should handle exceptions in validation functions', () => {
      const tracker = new ValidationPerformanceTracker();
      const mockValidation = jest.fn().mockImplementation(() => {
        throw new Error('Validation error');
      });

      const trackedValidation = trackPerformance(mockValidation, tracker);

      expect(() => trackedValidation('test')).toThrow('Validation error');
      expect(tracker.getMetrics().totalValidations).toBe(1);
      expect(tracker.getMetrics().successfulValidations).toBe(0);
    });
  });
});
