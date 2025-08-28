import {
  isARecord,
  isSOARecord,
  isSRVRecord,
  isCAARecord,
  isNAPTRRecord,
  isDNSRecord,
} from '../src/validators';
import {
  isValidTTL,
  isValidPriority,
  isValidWeight,
  isValidPort,
  isValidNAPTRFlags,
} from '../src/utils';

describe('Additional Validator Edge Cases', () => {
  describe('isSOARecord edge cases', () => {
    it('should reject SOA with missing primary field', () => {
      const invalidSOA = {
        type: 'SOA',
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with invalid primary FQDN', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'invalid..domain',
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with non-string primary', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 123,
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with non-string admin', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 123,
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with invalid admin email format', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'invalid-email',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with non-integer serial', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 123.45,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with negative refresh', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 123,
        refresh: -1,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with non-integer retry', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200.5,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with negative expiration', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: -1,
        minimum: 86400,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should reject SOA with non-integer minimum', () => {
      const invalidSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400.5,
      };
      expect(isSOARecord(invalidSOA)).toBe(false);
    });

    it('should accept SOA without TTL', () => {
      const validSOA = {
        type: 'SOA',
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 123,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(validSOA)).toBe(true);
    });
  });

  describe('isSRVRecord edge cases', () => {
    it('should reject SRV with missing name field', () => {
      const invalidSRV = {
        type: 'SRV',
        priority: 10,
        weight: 20,
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with non-string name', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 123,
        priority: 10,
        weight: 20,
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with invalid FQDN name', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'invalid..domain',
        priority: 10,
        weight: 20,
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with non-number priority', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: '10',
        weight: 20,
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with invalid priority', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: 70000,
        weight: 20,
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with non-number weight', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: 10,
        weight: '20',
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with invalid weight', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: 10,
        weight: 70000,
        port: 80,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with non-number port', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: 10,
        weight: 20,
        port: '80',
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should reject SRV with invalid port', () => {
      const invalidSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: 10,
        weight: 20,
        port: 70000,
      };
      expect(isSRVRecord(invalidSRV)).toBe(false);
    });

    it('should accept SRV without TTL', () => {
      const validSRV = {
        type: 'SRV',
        name: 'example.com',
        priority: 10,
        weight: 20,
        port: 80,
      };
      expect(isSRVRecord(validSRV)).toBe(true);
    });
  });

  describe('isCAARecord edge cases', () => {
    it('should accept CAA with issue property', () => {
      const validCAA = {
        type: 'CAA',
        critical: 0,
        issue: 'ca.example.com',
      };
      expect(isCAARecord(validCAA)).toBe(true);
    });

    it('should accept CAA with issuewild property', () => {
      const validCAA = {
        type: 'CAA',
        critical: 0,
        issuewild: 'ca.example.com',
      };
      expect(isCAARecord(validCAA)).toBe(true);
    });

    it('should accept CAA with iodef property', () => {
      const validCAA = {
        type: 'CAA',
        critical: 0,
        iodef: 'mailto:security@example.com',
      };
      expect(isCAARecord(validCAA)).toBe(true);
    });

    it('should accept CAA with contactemail property', () => {
      const validCAA = {
        type: 'CAA',
        critical: 0,
        contactemail: 'security@example.com',
      };
      expect(isCAARecord(validCAA)).toBe(true);
    });

    it('should accept CAA with contactphone property', () => {
      const validCAA = {
        type: 'CAA',
        critical: 0,
        contactphone: '+1-555-123-4567',
      };
      expect(isCAARecord(validCAA)).toBe(true);
    });

    it('should reject CAA with invalid critical flag', () => {
      const invalidCAA = {
        type: 'CAA',
        critical: 999,
        issue: 'test',
      };
      expect(isCAARecord(invalidCAA)).toBe(false);
    });

    it('should reject CAA with missing required fields', () => {
      const invalidCAA = {
        type: 'CAA',
        critical: 0,
      };
      expect(isCAARecord(invalidCAA)).toBe(false);
    });

    it('should accept CAA without TTL', () => {
      const validCAA = {
        type: 'CAA',
        critical: 0,
        issue: 'ca.example.com',
      };
      expect(isCAARecord(validCAA)).toBe(true);
    });
  });

  describe('isNAPTRRecord edge cases', () => {
    it('should reject NAPTR with non-integer order', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10.5,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with order out of range', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 70000,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with negative order', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: -1,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with non-integer preference', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20.5,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with preference out of range', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 70000,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with non-string flags', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 123,
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with invalid flags', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 'INVALID',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with non-string service', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 'U',
        service: 123,
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with non-string regexp', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: 123,
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with non-string replacement', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 123,
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should reject NAPTR with invalid replacement FQDN', () => {
      const invalidNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'invalid..domain',
      };
      expect(isNAPTRRecord(invalidNAPTR)).toBe(false);
    });

    it('should accept NAPTR without TTL', () => {
      const validNAPTR = {
        type: 'NAPTR',
        order: 10,
        preference: 20,
        flags: 'U',
        service: 'SIP+D2U',
        regexp: '',
        replacement: 'example.com',
      };
      expect(isNAPTRRecord(validNAPTR)).toBe(true);
    });
  });

  describe('isDNSRecord edge cases', () => {
    it('should return false for null', () => {
      expect(isDNSRecord(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isDNSRecord(undefined)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isDNSRecord('string')).toBe(false);
      expect(isDNSRecord(123)).toBe(false);
      expect(isDNSRecord(true)).toBe(false);
    });

    it('should return false for unknown record type', () => {
      const unknownRecord = {
        type: 'UNKNOWN',
        data: 'test',
      };
      expect(isDNSRecord(unknownRecord)).toBe(false);
    });

    it('should handle DNSSEC record types', () => {
      const dnskeyRecord = {
        type: 'DNSKEY',
        flags: 256,
        protocol: 3,
        algorithm: 8,
        publicKey: 'ABCDEF123456',
      };
      expect(isDNSRecord(dnskeyRecord)).toBe(true);
    });
  });

  describe('Utility function edge cases', () => {
    describe('isValidNAPTRFlags', () => {
      it('should accept valid single flags', () => {
        expect(isValidNAPTRFlags('S')).toBe(true);
        expect(isValidNAPTRFlags('A')).toBe(true);
        expect(isValidNAPTRFlags('U')).toBe(true);
        expect(isValidNAPTRFlags('P')).toBe(true);
      });

      it('should accept empty flags', () => {
        expect(isValidNAPTRFlags('')).toBe(true);
      });

      it('should accept lowercase flags', () => {
        expect(isValidNAPTRFlags('s')).toBe(true);
        expect(isValidNAPTRFlags('a')).toBe(true);
        expect(isValidNAPTRFlags('u')).toBe(true);
        expect(isValidNAPTRFlags('p')).toBe(true);
      });

      it('should reject invalid flags', () => {
        expect(isValidNAPTRFlags('X')).toBe(false);
        expect(isValidNAPTRFlags('123')).toBe(false);
      });

      it('should reject combination flags', () => {
        expect(isValidNAPTRFlags('SA')).toBe(false);
        expect(isValidNAPTRFlags('SU')).toBe(false);
        expect(isValidNAPTRFlags('AU')).toBe(false);
      });
    });

    describe('validation utilities with edge cases', () => {
      it('should handle edge case TTL values', () => {
        expect(isValidTTL(0)).toBe(true);
        expect(isValidTTL(2147483647)).toBe(true);
        expect(isValidTTL(-1)).toBe(false);
        expect(isValidTTL(2147483648)).toBe(false);
      });

      it('should handle edge case priority values', () => {
        expect(isValidPriority(0)).toBe(true);
        expect(isValidPriority(65535)).toBe(true);
        expect(isValidPriority(-1)).toBe(false);
        expect(isValidPriority(65536)).toBe(false);
      });

      it('should handle edge case weight values', () => {
        expect(isValidWeight(0)).toBe(true);
        expect(isValidWeight(65535)).toBe(true);
        expect(isValidWeight(-1)).toBe(false);
        expect(isValidWeight(65536)).toBe(false);
      });

      it('should handle edge case port values', () => {
        expect(isValidPort(0)).toBe(true);
        expect(isValidPort(65535)).toBe(true);
        expect(isValidPort(-1)).toBe(false);
        expect(isValidPort(65536)).toBe(false);
      });
    });
  });

  describe('Type coercion and boundary tests', () => {
    it('should handle records with extra properties', () => {
      const recordWithExtra = {
        type: 'A',
        address: '192.168.1.1',
        ttl: 300,
        extraProperty: 'should be ignored',
      };
      expect(isARecord(recordWithExtra)).toBe(true);
    });

    it('should handle records with null/undefined optional fields', () => {
      const recordWithNulls = {
        type: 'A',
        address: '192.168.1.1',
        ttl: null,
      };
      expect(isARecord(recordWithNulls)).toBe(false); // TTL should be number or undefined
    });

    it('should handle array-like objects', () => {
      const arrayLike = {
        0: 'A',
        1: '192.168.1.1',
        length: 2,
        type: 'A',
        address: '192.168.1.1',
      };
      expect(isARecord(arrayLike)).toBe(true);
    });
  });
});
