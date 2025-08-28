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
} from '../src/utils';

describe('Utils Edge Cases and Uncovered Paths', () => {
  describe('isValidDNSQueryResult edge cases', () => {
    it('should reject null input', () => {
      expect(isValidDNSQueryResult(null)).toBe(false);
    });

    it('should reject non-object input', () => {
      expect(isValidDNSQueryResult('string')).toBe(false);
      expect(isValidDNSQueryResult(123)).toBe(false);
      expect(isValidDNSQueryResult(true)).toBe(false);
    });

    it('should reject result with non-object question', () => {
      const invalidResult = {
        question: 'invalid',
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with missing question name', () => {
      const invalidResult = {
        question: {
          type: 'A',
          class: 'IN',
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with non-string question name', () => {
      const invalidResult = {
        question: {
          name: 123,
          type: 'A',
          class: 'IN',
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with missing question type', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          class: 'IN',
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with non-string question type', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          type: 123,
          class: 'IN',
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with missing question class', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          type: 'A',
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with non-string question class', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 123,
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with non-array answers', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN',
        },
        answers: 'not an array',
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject result with invalid answer records', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'INVALID_TYPE',
            address: '192.168.1.1',
          },
        ],
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should accept result with empty answers array', () => {
      const validResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [],
      };
      expect(isValidDNSQueryResult(validResult)).toBe(true);
    });
  });

  describe('isValidDNSRecord edge cases', () => {
    it('should reject null input', () => {
      expect(isValidDNSRecord(null)).toBe(false);
    });

    it('should reject non-object input', () => {
      expect(isValidDNSRecord('string')).toBe(false);
      expect(isValidDNSRecord(123)).toBe(false);
      expect(isValidDNSRecord(true)).toBe(false);
    });

    it('should reject record without type field', () => {
      const invalidRecord = {
        address: '192.168.1.1',
      };
      expect(isValidDNSRecord(invalidRecord)).toBe(false);
    });

    it('should reject record with non-string type', () => {
      const invalidRecord = {
        type: 123,
        address: '192.168.1.1',
      };
      expect(isValidDNSRecord(invalidRecord)).toBe(false);
    });

    it('should reject record with invalid type', () => {
      const invalidRecord = {
        type: 'INVALID_TYPE',
        address: '192.168.1.1',
      };
      expect(isValidDNSRecord(invalidRecord)).toBe(false);
    });

    it('should reject record with invalid TTL (non-integer)', () => {
      const invalidRecord = {
        type: 'A',
        address: '192.168.1.1',
        ttl: 300.5,
      };
      expect(isValidDNSRecord(invalidRecord)).toBe(false);
    });

    it('should reject record with negative TTL', () => {
      const invalidRecord = {
        type: 'A',
        address: '192.168.1.1',
        ttl: -1,
      };
      expect(isValidDNSRecord(invalidRecord)).toBe(false);
    });

    it('should reject record with TTL too large', () => {
      const invalidRecord = {
        type: 'A',
        address: '192.168.1.1',
        ttl: 2147483648, // Max int32 + 1
      };
      expect(isValidDNSRecord(invalidRecord)).toBe(false);
    });

    it('should accept record without TTL', () => {
      const validRecord = {
        type: 'A',
        address: '192.168.1.1',
      };
      expect(isValidDNSRecord(validRecord)).toBe(true);
    });

    it('should accept valid record types', () => {
      const validTypes = [
        'A',
        'AAAA',
        'ANY',
        'CAA',
        'CNAME',
        'MX',
        'NAPTR',
        'NS',
        'PTR',
        'SOA',
        'SRV',
        'TLSA',
        'TXT',
      ];

      validTypes.forEach(type => {
        const record = {
          type,
          data: 'test',
          ttl: 300,
        };
        expect(isValidDNSRecord(record)).toBe(true);
      });
    });
  });

  describe('validateDNSResponse edge cases', () => {
    it('should handle response with invalid records in answers', () => {
      const response = {
        question: {
          name: 'example.com',
          type: 'A' as const,
          class: 'IN',
        },
        answers: [
          {
            type: 'INVALID',
            data: 'test',
          },
        ],
      } as any;

      const result = validateDNSResponse(response);
      expect(result.isValid).toBe(true); // Invalid records in answers don't make the overall result invalid
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should validate complete valid response', () => {
      const response = {
        question: {
          name: 'example.com',
          type: 'A' as const,
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '192.168.1.1',
            ttl: 300,
          },
        ],
      } as any;

      const result = validateDNSResponse(response);
      expect(result.isValid).toBe(true);
    });

    it('should handle response with type mismatch warnings', () => {
      const response = {
        question: {
          name: 'example.com',
          type: 'A' as const,
          class: 'IN',
        },
        answers: [
          {
            type: 'CNAME',
            value: 'alias.example.com',
            ttl: 300,
          },
        ],
      } as any;

      const result = validateDNSResponse(response);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Validation utility edge cases', () => {
    describe('isValidTLSAUsage', () => {
      it('should accept valid usage values', () => {
        expect(isValidTLSAUsage(0)).toBe(true);
        expect(isValidTLSAUsage(1)).toBe(true);
        expect(isValidTLSAUsage(2)).toBe(true);
        expect(isValidTLSAUsage(3)).toBe(true);
      });

      it('should reject invalid usage values', () => {
        expect(isValidTLSAUsage(-1)).toBe(false);
        expect(isValidTLSAUsage(4)).toBe(false);
        expect(isValidTLSAUsage(1.5)).toBe(false);
      });
    });

    describe('isValidTLSASelector', () => {
      it('should accept valid selector values', () => {
        expect(isValidTLSASelector(0)).toBe(true);
        expect(isValidTLSASelector(1)).toBe(true);
      });

      it('should reject invalid selector values', () => {
        expect(isValidTLSASelector(-1)).toBe(false);
        expect(isValidTLSASelector(2)).toBe(false);
        expect(isValidTLSASelector(0.5)).toBe(false);
      });
    });

    describe('isValidTLSAMatchingType', () => {
      it('should accept valid matching type values', () => {
        expect(isValidTLSAMatchingType(0)).toBe(true);
        expect(isValidTLSAMatchingType(1)).toBe(true);
        expect(isValidTLSAMatchingType(2)).toBe(true);
      });

      it('should reject invalid matching type values', () => {
        expect(isValidTLSAMatchingType(-1)).toBe(false);
        expect(isValidTLSAMatchingType(3)).toBe(false);
        expect(isValidTLSAMatchingType(1.5)).toBe(false);
      });
    });

    describe('isValidCAAFlags', () => {
      it('should accept valid CAA flags', () => {
        expect(isValidCAAFlags(0)).toBe(true);
        expect(isValidCAAFlags(128)).toBe(true);
        expect(isValidCAAFlags(255)).toBe(true);
        expect(isValidCAAFlags(1)).toBe(true);
      });

      it('should reject invalid CAA flags', () => {
        expect(isValidCAAFlags(-1)).toBe(false);
        expect(isValidCAAFlags(256)).toBe(false);
        expect(isValidCAAFlags(0.5)).toBe(false);
      });
    });

    describe('isValidHexString', () => {
      it('should accept valid hex strings', () => {
        expect(isValidHexString('0123456789ABCDEF')).toBe(true);
        expect(isValidHexString('abcdef')).toBe(true);
        expect(isValidHexString('FEDCBA9876543210')).toBe(true);
        expect(isValidHexString('123')).toBe(true);
      });

      it('should reject invalid hex strings', () => {
        expect(isValidHexString('')).toBe(false); // Empty string is not valid hex
        expect(isValidHexString('XYZ')).toBe(false);
        expect(isValidHexString('123G')).toBe(false);
        expect(isValidHexString('12 34')).toBe(false);
        expect(isValidHexString('12-34')).toBe(false);
      });
    });

    describe('isValidTextRecord', () => {
      it('should accept valid text records', () => {
        expect(isValidTextRecord('')).toBe(true);
        expect(isValidTextRecord('Simple text')).toBe(true);
        expect(isValidTextRecord('Multiple words with spaces')).toBe(true);
        expect(isValidTextRecord('Text with numbers 123')).toBe(true);
        expect(isValidTextRecord('Special chars: @#$%^&*()')).toBe(true);
      });

      it('should handle very long text records', () => {
        const longText = 'a'.repeat(1000);
        expect(isValidTextRecord(longText)).toBe(true);
      });
    });
  });
});
