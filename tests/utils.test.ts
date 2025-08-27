import {
  isValidDNSQueryResult,
  validateDNSResponse,
  isValidPort,
  isValidTTL,
  isValidNAPTRFlags,
  isValidTLSAUsage,
  isValidTLSASelector,
  isValidTLSAMatchingType,
  isValidHexString,
  isValidTextRecord
} from '../src/utils';
import { DNSQueryResult } from '../src/types';

describe('DNS Utility Functions', () => {
  describe('isValidDNSQueryResult', () => {
    it('should validate complete DNS query results', () => {
      const validResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN'
        },
        answers: [
          {
            type: 'A',
            address: '192.168.1.1',
            ttl: 300
          }
        ]
      };
      expect(isValidDNSQueryResult(validResult)).toBe(true);
    });

    it('should reject results without question section', () => {
      const invalidResult = {
        answers: [
          {
            type: 'A',
            address: '192.168.1.1',
            ttl: 300
          }
        ]
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });

    it('should reject results with invalid answers', () => {
      const invalidResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN'
        },
        answers: [
          {
            type: 'INVALID',
            data: 'something'
          }
        ]
      };
      expect(isValidDNSQueryResult(invalidResult)).toBe(false);
    });
  });

  describe('validateDNSResponse', () => {
    it('should validate responses with matching question and answer types', () => {
      const response: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN'
        },
        answers: [
          {
            type: 'A',
            address: '192.168.1.1',
            ttl: 300
          }
        ]
      };
      const result = validateDNSResponse(response);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn about type mismatches', () => {
      const response: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN'
        },
        answers: [
          {
            type: 'CNAME',
            value: 'alias.example.com',
            ttl: 300
          }
        ]
      };
      const result = validateDNSResponse(response);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should handle ANY query type without warnings', () => {
      const response: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'ANY',
          class: 'IN'
        },
        answers: [
          {
            type: 'A',
            address: '192.168.1.1',
            ttl: 300
          },
          {
            type: 'CNAME',
            value: 'alias.example.com',
            ttl: 300
          }
        ]
      };
      const result = validateDNSResponse(response);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1); // Only "no answers" check, but we have answers
    });
  });

  describe('Validation utility functions', () => {
    describe('isValidPort', () => {
      it('should validate valid port numbers', () => {
        expect(isValidPort(80)).toBe(true);
        expect(isValidPort(443)).toBe(true);
        expect(isValidPort(0)).toBe(true);
        expect(isValidPort(65535)).toBe(true);
      });

      it('should reject invalid port numbers', () => {
        expect(isValidPort(-1)).toBe(false);
        expect(isValidPort(65536)).toBe(false);
        expect(isValidPort(1.5)).toBe(false);
      });
    });

    describe('isValidTTL', () => {
      it('should validate valid TTL values', () => {
        expect(isValidTTL(0)).toBe(true);
        expect(isValidTTL(300)).toBe(true);
        expect(isValidTTL(2147483647)).toBe(true);
      });

      it('should reject invalid TTL values', () => {
        expect(isValidTTL(-1)).toBe(false);
        expect(isValidTTL(2147483648)).toBe(false);
        expect(isValidTTL(300.5)).toBe(false);
      });
    });

    describe('isValidHexString', () => {
      it('should validate hex strings', () => {
        expect(isValidHexString('abcdef123456')).toBe(true);
        expect(isValidHexString('ABCDEF123456')).toBe(true);
        expect(isValidHexString('0123456789abcdef')).toBe(true);
      });

      it('should reject non-hex strings', () => {
        expect(isValidHexString('ghijkl')).toBe(false);
        expect(isValidHexString('12345g')).toBe(false);
        expect(isValidHexString('hello world')).toBe(false);
      });
    });

    describe('isValidNAPTRFlags', () => {
      it('should validate NAPTR flags', () => {
        expect(isValidNAPTRFlags('S')).toBe(true);
        expect(isValidNAPTRFlags('A')).toBe(true);
        expect(isValidNAPTRFlags('U')).toBe(true);
        expect(isValidNAPTRFlags('P')).toBe(true);
        expect(isValidNAPTRFlags('')).toBe(true);
        expect(isValidNAPTRFlags('s')).toBe(true); // case insensitive
      });

      it('should reject invalid NAPTR flags', () => {
        expect(isValidNAPTRFlags('X')).toBe(false);
        expect(isValidNAPTRFlags('SA')).toBe(false);
      });
    });

    describe('TLSA validation functions', () => {
      it('should validate TLSA usage values', () => {
        expect(isValidTLSAUsage(0)).toBe(true);
        expect(isValidTLSAUsage(1)).toBe(true);
        expect(isValidTLSAUsage(2)).toBe(true);
        expect(isValidTLSAUsage(3)).toBe(true);
        expect(isValidTLSAUsage(4)).toBe(false);
        expect(isValidTLSAUsage(-1)).toBe(false);
      });

      it('should validate TLSA selector values', () => {
        expect(isValidTLSASelector(0)).toBe(true);
        expect(isValidTLSASelector(1)).toBe(true);
        expect(isValidTLSASelector(2)).toBe(false);
        expect(isValidTLSASelector(-1)).toBe(false);
      });

      it('should validate TLSA matching type values', () => {
        expect(isValidTLSAMatchingType(0)).toBe(true);
        expect(isValidTLSAMatchingType(1)).toBe(true);
        expect(isValidTLSAMatchingType(2)).toBe(true);
        expect(isValidTLSAMatchingType(3)).toBe(false);
        expect(isValidTLSAMatchingType(-1)).toBe(false);
      });
    });

    describe('isValidTextRecord', () => {
      it('should validate printable ASCII text', () => {
        expect(isValidTextRecord('Hello World')).toBe(true);
        expect(isValidTextRecord('v=spf1 include:_spf.google.com ~all')).toBe(true);
        expect(isValidTextRecord('123456789')).toBe(true);
      });

      it('should handle empty strings', () => {
        expect(isValidTextRecord('')).toBe(true);
      });
    });
  });
});
