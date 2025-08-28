import {
  validateARecord,
  validateAAAARecord,
  validateMXRecord,
  getValidationSuggestions,
} from '../src/enhanced-validators';

describe('Enhanced Validators', () => {
  describe('validateARecord', () => {
    it('should validate correct A records', () => {
      const validARecord = {
        type: 'A',
        address: '192.168.1.1',
        ttl: 300,
      };
      const result = validateARecord(validARecord);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should provide detailed error messages for invalid IP addresses', () => {
      const invalidARecord = {
        type: 'A',
        address: '999.999.999.999',
        ttl: 300,
      };
      const result = validateARecord(invalidARecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Invalid IPv4 address: '999.999.999.999'. Example: 192.168.1.1"
      );
    });

    it('should provide detailed error messages for missing address field', () => {
      const invalidARecord = {
        type: 'A',
        ttl: 300,
      };
      const result = validateARecord(invalidARecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "A record must have a 'address' field of type string"
      );
    });

    it('should validate records without TTL', () => {
      const validARecord = {
        type: 'A',
        address: '8.8.8.8',
      };
      const result = validateARecord(validARecord);
      expect(result.isValid).toBe(true);
    });

    it('should provide detailed error messages for invalid TTL', () => {
      const invalidARecord = {
        type: 'A',
        address: '192.168.1.1',
        ttl: -1,
      };
      const result = validateARecord(invalidARecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid TTL value: -1. Must be between 0 and 2147483647 seconds'
      );
    });

    it('should reject wrong record type', () => {
      const wrongTypeRecord = {
        type: 'AAAA',
        address: '192.168.1.1',
      };
      const result = validateARecord(wrongTypeRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Expected record type 'A', got 'AAAA'");
    });
  });

  describe('validateAAAARecord', () => {
    it('should validate correct AAAA records', () => {
      const validAAAARecord = {
        type: 'AAAA',
        address: '2001:db8::1',
        ttl: 300,
      };
      const result = validateAAAARecord(validAAAARecord);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should provide detailed error messages for invalid IPv6 addresses', () => {
      const invalidAAAARecord = {
        type: 'AAAA',
        address: 'invalid:ipv6:address',
        ttl: 300,
      };
      const result = validateAAAARecord(invalidAAAARecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Invalid IPv6 address: 'invalid:ipv6:address'. Example: 2001:db8::1"
      );
    });

    it('should accept various IPv6 formats', () => {
      const testCases = [
        '::1',
        '2001:db8:85a3::8a2e:370:7334',
        'fe80::1%lo0',
        '::ffff:192.0.2.1',
      ];

      testCases.forEach(address => {
        const record = { type: 'AAAA', address };
        const result = validateAAAARecord(record);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateMXRecord', () => {
    it('should validate correct MX records', () => {
      const validMXRecord = {
        type: 'MX',
        priority: 10,
        exchange: 'mail.example.com',
        ttl: 300,
      };
      const result = validateMXRecord(validMXRecord);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should provide detailed error messages for invalid exchange', () => {
      const invalidMXRecord = {
        type: 'MX',
        priority: 10,
        exchange: 'invalid..domain',
        ttl: 300,
      };
      const result = validateMXRecord(invalidMXRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Invalid FQDN for exchange: 'invalid..domain'. Example: mail.example.com"
      );
    });

    it('should provide detailed error messages for invalid priority', () => {
      const invalidMXRecord = {
        type: 'MX',
        priority: 70000,
        exchange: 'mail.example.com',
        ttl: 300,
      };
      const result = validateMXRecord(invalidMXRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid priority value: 70000. Must be between 0 and 65535 (lower = higher priority)'
      );
    });

    it('should require both priority and exchange fields', () => {
      const missingFieldsRecord = {
        type: 'MX',
        ttl: 300,
      };
      const result = validateMXRecord(missingFieldsRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "MX record must have an 'exchange' field of type string"
      );
      expect(result.errors).toContain(
        "MX record must have a 'priority' field of type number"
      );
    });
  });

  describe('getValidationSuggestions', () => {
    it('should provide suggestions for A records', () => {
      const suggestions = getValidationSuggestions('A');
      expect(suggestions).toContain(
        'A records should contain valid IPv4 addresses (e.g., 192.168.1.1)'
      );
      expect(suggestions).toContain(
        'Consider setting a reasonable TTL value (300-3600 seconds for dynamic IPs)'
      );
    });

    it('should provide suggestions for AAAA records', () => {
      const suggestions = getValidationSuggestions('AAAA');
      expect(suggestions).toContain(
        'AAAA records should contain valid IPv6 addresses (e.g., 2001:db8::1)'
      );
      expect(suggestions).toContain(
        'IPv6 addresses can be compressed using :: notation'
      );
    });

    it('should provide suggestions for MX records', () => {
      const suggestions = getValidationSuggestions('MX');
      expect(suggestions).toContain(
        'MX records require both priority and exchange fields'
      );
      expect(suggestions).toContain(
        'Lower priority values indicate higher precedence'
      );
      expect(suggestions).toContain(
        'Exchange must be a fully qualified domain name'
      );
    });

    it('should provide suggestions for CNAME records', () => {
      const suggestions = getValidationSuggestions('CNAME');
      expect(suggestions).toContain(
        'CNAME records cannot coexist with other record types for the same name'
      );
      expect(suggestions).toContain(
        'The target must be a fully qualified domain name'
      );
    });

    it('should provide generic suggestions for unknown record types', () => {
      const suggestions = getValidationSuggestions('UNKNOWN');
      expect(suggestions).toContain(
        'Ensure all required fields are present and correctly typed'
      );
      expect(suggestions).toContain(
        'Check that string values are properly formatted'
      );
    });

    it('should be case insensitive', () => {
      const upperSuggestions = getValidationSuggestions('A');
      const lowerSuggestions = getValidationSuggestions('a');
      expect(upperSuggestions).toEqual(lowerSuggestions);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined inputs', () => {
      expect(validateARecord(null).isValid).toBe(false);
      expect(validateARecord(undefined).isValid).toBe(false);
      expect(validateAAAARecord(null).isValid).toBe(false);
      expect(validateMXRecord(undefined).isValid).toBe(false);
    });

    it('should handle non-object inputs', () => {
      expect(validateARecord('string').isValid).toBe(false);
      expect(validateAAAARecord(123).isValid).toBe(false);
      expect(validateMXRecord([]).isValid).toBe(false);
    });

    it('should handle empty objects', () => {
      const result = validateARecord({});
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
