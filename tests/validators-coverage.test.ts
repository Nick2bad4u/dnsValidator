import {
  isSRVRecord,
  isCAARecord,
  isNAPTRRecord,
  isANYRecord,
  isTLSARecord,
  validateDNSRecord,
  isDNSRecord
} from '../src/validators';

describe('Validators Coverage Improvements', () => {
  describe('isSRVRecord edge cases', () => {
    it('should validate SRV record priority edge cases', () => {
      const invalidPriority = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: -1, // Invalid negative priority
        weight: 0,
        port: 80,
        target: 'target.example.com'
      };
      expect(isSRVRecord(invalidPriority)).toBe(false);

      const invalidPriorityMax = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: 65536, // Too high
        weight: 0,
        port: 80,
        target: 'target.example.com'
      };
      expect(isSRVRecord(invalidPriorityMax)).toBe(false);
    });

    it('should validate SRV record weight edge cases', () => {
      const invalidWeight = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: 10,
        weight: -1, // Invalid negative weight
        port: 80,
        target: 'target.example.com'
      };
      expect(isSRVRecord(invalidWeight)).toBe(false);

      const invalidWeightMax = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: 10,
        weight: 65536, // Too high
        port: 80,
        target: 'target.example.com'
      };
      expect(isSRVRecord(invalidWeightMax)).toBe(false);
    });

    it('should validate SRV record port edge cases', () => {
      const validPort0 = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: 10,
        weight: 0,
        port: 0, // Port 0 is actually valid
        target: 'target.example.com'
      };
      expect(isSRVRecord(validPort0)).toBe(true);

      const invalidPortMax = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: 10,
        weight: 0,
        port: 65536, // Too high
        target: 'target.example.com'
      };
      expect(isSRVRecord(invalidPortMax)).toBe(false);
    });
  });

  describe('isCAARecord edge cases', () => {
    it('should reject invalid flags', () => {
      const invalidFlags = {
        type: 'CAA',
        critical: 256, // Invalid flag value
        issue: 'ca.example.net'
      };
      expect(isCAARecord(invalidFlags)).toBe(false);

      const negativeFlags = {
        type: 'CAA',
        critical: -1, // Invalid negative flag
        issue: 'ca.example.net'
      };
      expect(isCAARecord(negativeFlags)).toBe(false);
    });

    it('should validate type check paths', () => {
      // Test non-object input
      expect(isCAARecord(null)).toBe(false);
      expect(isCAARecord('string')).toBe(false);

      // Test wrong type
      const wrongType = {
        type: 'A',
        critical: 0,
        issue: 'ca.example.net'
      };
      expect(isCAARecord(wrongType)).toBe(false);
    });

    it('should validate critical value edge cases', () => {
      // Valid critical values
      const valid0 = {
        type: 'CAA',
        critical: 0,
        issue: 'ca.example.net'
      };
      expect(isCAARecord(valid0)).toBe(true);

      const valid128 = {
        type: 'CAA',
        critical: 128,
        issue: 'ca.example.net'
      };
      expect(isCAARecord(valid128)).toBe(true);

      // Invalid critical values - string type
      const invalidString = {
        type: 'CAA',
        critical: 'invalid',
        issue: 'ca.example.net'
      };
      expect(isCAARecord(invalidString)).toBe(false);
    });
  });

  describe('isNAPTRRecord edge cases', () => {
    it('should validate order field boundaries', () => {
      const invalidOrderNegative = {
        type: 'NAPTR',
        order: -1, // Invalid negative order
        preference: 10,
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'sip.example.com'
      };
      expect(isNAPTRRecord(invalidOrderNegative)).toBe(false);

      const invalidOrderMax = {
        type: 'NAPTR',
        order: 65536, // Too high
        preference: 10,
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'sip.example.com'
      };
      expect(isNAPTRRecord(invalidOrderMax)).toBe(false);
    });

    it('should validate preference field boundaries', () => {
      const invalidPrefNegative = {
        type: 'NAPTR',
        order: 10,
        preference: -1, // Invalid negative preference
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'sip.example.com'
      };
      expect(isNAPTRRecord(invalidPrefNegative)).toBe(false);

      const invalidPrefMax = {
        type: 'NAPTR',
        order: 10,
        preference: 65536, // Too high
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'sip.example.com'
      };
      expect(isNAPTRRecord(invalidPrefMax)).toBe(false);
    });

    it('should validate flags string', () => {
      const invalidFlags = {
        type: 'NAPTR',
        order: 10,
        preference: 10,
        flags: 'INVALID', // Invalid flags
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'sip.example.com'
      };
      expect(isNAPTRRecord(invalidFlags)).toBe(false);
    });

    it('should validate replacement field', () => {
      const emptyReplacement = {
        type: 'NAPTR',
        order: 10,
        preference: 10,
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: '' // Empty replacement should be valid
      };
      expect(isNAPTRRecord(emptyReplacement)).toBe(true);

      const invalidFQDN = {
        type: 'NAPTR',
        order: 10,
        preference: 10,
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'invalid..domain' // Invalid FQDN
      };
      expect(isNAPTRRecord(invalidFQDN)).toBe(false);
    });
  });

  describe('isANYRecord', () => {
    it('should validate ANY record structure', () => {
      const validAny = {
        type: 'ANY',
        value: 'any-value'
      };
      expect(isANYRecord(validAny)).toBe(true);

      const validAnyWithTTL = {
        type: 'ANY',
        value: 'any-value',
        ttl: 300
      };
      expect(isANYRecord(validAnyWithTTL)).toBe(true);

      const invalidNoValue = {
        type: 'ANY'
        // Missing value
      };
      expect(isANYRecord(invalidNoValue)).toBe(false);

      const invalidTTL = {
        type: 'ANY',
        value: 'any-value',
        ttl: -1 // Invalid TTL
      };
      expect(isANYRecord(invalidTTL)).toBe(false);
    });
  });

  describe('validateDNSRecord with specific types', () => {
    it('should route to correct validators', () => {
      const srvRecord = {
        type: 'SRV',
        name: 'service.tcp.example.com',
        priority: 10,
        weight: 0,
        port: 80,
        target: 'target.example.com'
      };
      const srvResult = validateDNSRecord(srvRecord);
      expect(srvResult.isValid).toBe(true);

      const caaRecord = {
        type: 'CAA',
        critical: 0,
        issue: 'ca.example.net'
      };
      const caaResult = validateDNSRecord(caaRecord);
      expect(caaResult.isValid).toBe(true);
    });

    it('should handle NAPTR records correctly', () => {
      const naptrRecord = {
        type: 'NAPTR',
        order: 10,
        preference: 10,
        flags: 'S',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'sip.example.com'
      };
      const naptrResult = validateDNSRecord(naptrRecord);
      console.log('NAPTR validation result:', naptrResult);
      expect(naptrResult.isValid).toBe(true);
    });

    it('should handle ANY records correctly', () => {
      const anyRecord = {
        type: 'ANY',
        value: 'any-value'
      };
      const anyResult = validateDNSRecord(anyRecord);
      expect(anyResult.isValid).toBe(true);
    });
  });

  describe('isTLSARecord edge cases', () => {
    it('should validate TLSA usage values', () => {
      const validTLSA = {
        type: 'TLSA',
        usage: 3,
        selector: 1,
        matchingType: 1,
        certificate: 'abcd1234'
      };
      expect(isTLSARecord(validTLSA)).toBe(true);

      // Invalid usage
      const invalidUsage = { ...validTLSA, usage: 5 };
      expect(isTLSARecord(invalidUsage)).toBe(false);
    });

    it('should validate TLSA selector values', () => {
      const validTLSA = {
        type: 'TLSA',
        usage: 3,
        selector: 0,
        matchingType: 1,
        certificate: 'abcd1234'
      };
      expect(isTLSARecord(validTLSA)).toBe(true);

      // Invalid selector
      const invalidSelector = { ...validTLSA, selector: 2 };
      expect(isTLSARecord(invalidSelector)).toBe(false);
    });

    it('should validate TLSA matchingType values', () => {
      const validTLSA = {
        type: 'TLSA',
        usage: 3,
        selector: 1,
        matchingType: 2,
        certificate: 'abcd1234'
      };
      expect(isTLSARecord(validTLSA)).toBe(true);

      // Invalid matchingType
      const invalidMatching = { ...validTLSA, matchingType: 4 };
      expect(isTLSARecord(invalidMatching)).toBe(false);
    });

    it('should validate TLSA certificate hex string', () => {
      const validTLSA = {
        type: 'TLSA',
        usage: 3,
        selector: 1,
        matchingType: 1,
        certificate: 'ABCDEF123456'
      };
      expect(isTLSARecord(validTLSA)).toBe(true);

      // Invalid hex string
      const invalidHex = { ...validTLSA, certificate: 'GHIJK' };
      expect(isTLSARecord(invalidHex)).toBe(false);
    });
  });

  describe('isDNSRecord edge cases', () => {
    it('should handle records without explicit type validation', () => {
      const unknownTypeRecord = {
        type: 'UNKNOWN_TYPE',
        data: 'some-data'
      };
      // Should return false for unknown types
      expect(isDNSRecord(unknownTypeRecord)).toBe(false);
    });
  });
});
