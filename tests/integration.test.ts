import { validateDNSResponse, isValidDNSQueryResult } from '../src/utils';
import {
  isDNSRecord,
  isARecord,
  isAAAARecord,
  isCNAMERecord,
  isMXRecord,
  isTXTRecord,
  isNSRecord,
  isSOARecord,
  isSRVRecord,
} from '../src/validators';
import { DNSQueryResult, DNSRecord } from '../src/types';

describe('DNS Validator Integration Tests', () => {
  describe('Real-world DNS query scenarios', () => {
    it('should validate typical A record query response', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '93.184.216.34',
            ttl: 86400,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isDNSRecord(queryResult.answers[0])).toBe(true);
      expect(isARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate IPv6 AAAA record query response', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'ipv6.example.com',
          type: 'AAAA',
          class: 'IN',
        },
        answers: [
          {
            type: 'AAAA',
            address: '2606:2800:220:1:248:1893:25c8:1946',
            ttl: 86400,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isAAAARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate CNAME record with redirect chain', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'www.example.com',
          type: 'CNAME',
          class: 'IN',
        },
        answers: [
          {
            type: 'CNAME',
            value: 'example.com',
            ttl: 3600,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isCNAMERecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate MX record for email configuration', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'MX',
          class: 'IN',
        },
        answers: [
          {
            type: 'MX',
            priority: 10,
            exchange: 'mail.example.com',
            ttl: 3600,
          },
          {
            type: 'MX',
            priority: 20,
            exchange: 'mail2.example.com',
            ttl: 3600,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      queryResult.answers.forEach(answer => {
        expect(isMXRecord(answer)).toBe(true);
      });

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate complex TXT record for SPF/DKIM', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'TXT',
          class: 'IN',
        },
        answers: [
          {
            type: 'TXT',
            entries: ['v=spf1 include:_spf.google.com ~all'],
            ttl: 300,
          },
          {
            type: 'TXT',
            entries: ['google-site-verification=abcdef123456'],
            ttl: 300,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      queryResult.answers.forEach(answer => {
        expect(isTXTRecord(answer)).toBe(true);
      });

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate NS record for nameserver delegation', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'NS',
          class: 'IN',
        },
        answers: [
          {
            type: 'NS',
            value: 'ns1.example.com',
            ttl: 172800,
          },
          {
            type: 'NS',
            value: 'ns2.example.com',
            ttl: 172800,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      queryResult.answers.forEach(answer => {
        expect(isNSRecord(answer)).toBe(true);
      });

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate SOA record for zone authority', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'SOA',
          class: 'IN',
        },
        answers: [
          {
            type: 'SOA',
            primary: 'ns1.example.com',
            admin: 'admin.example.com',
            serial: 2024010101,
            refresh: 86400,
            retry: 7200,
            expiration: 3600000,
            minimum: 86400,
            ttl: 86400,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isSOARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate SRV record for service discovery', () => {
      const srvRecord = {
        type: 'SRV' as const,
        name: 'mail.example.com',
        priority: 10,
        weight: 5,
        port: 25,
        ttl: 300,
      };

      expect(isSRVRecord(srvRecord)).toBe(true);
    });
  });

  describe('Complex multi-record scenarios', () => {
    it('should validate ANY query with multiple record types', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'ANY',
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '93.184.216.34',
            ttl: 86400,
          },
          {
            type: 'AAAA',
            address: '2606:2800:220:1:248:1893:25c8:1946',
            ttl: 86400,
          },
          {
            type: 'MX',
            priority: 10,
            exchange: 'mail.example.com',
            ttl: 3600,
          },
          {
            type: 'TXT',
            entries: ['v=spf1 include:_spf.google.com ~all'],
            ttl: 300,
          },
          {
            type: 'NS',
            value: 'ns1.example.com',
            ttl: 172800,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      // Validate each record type
      const aRecord = queryResult.answers.find(r => r.type === 'A');
      const aaaaRecord = queryResult.answers.find(r => r.type === 'AAAA');
      const mxRecord = queryResult.answers.find(r => r.type === 'MX');
      const txtRecord = queryResult.answers.find(r => r.type === 'TXT');
      const nsRecord = queryResult.answers.find(r => r.type === 'NS');

      expect(isARecord(aRecord!)).toBe(true);
      expect(isAAAARecord(aaaaRecord!)).toBe(true);
      expect(isMXRecord(mxRecord!)).toBe(true);
      expect(isTXTRecord(txtRecord!)).toBe(true);
      expect(isNSRecord(nsRecord!)).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
      // ANY queries don't generate type mismatch warnings
      expect(validation.warnings.length).toBe(0);
    });

    it('should handle CNAME with additional A records', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'www.example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'CNAME',
            value: 'example.com',
            ttl: 3600,
          },
          {
            type: 'A',
            address: '93.184.216.34',
            ttl: 86400,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(0); // CNAME type mismatch
    });

    it('should validate subdomain with different record types', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'api.v2.example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '192.168.1.100',
            ttl: 300,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Error scenarios and edge cases', () => {
    it('should handle empty answers array', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'nonexistent.example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should detect invalid domain names in questions', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'invalid..domain',
          type: 'A',
          class: 'IN',
        },
        answers: [],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true); // Structure is valid

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(false); // Domain validation fails
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should handle records with very short TTL', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '93.184.216.34',
            ttl: 1, // Very short TTL
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should handle records with maximum TTL', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'example.com',
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '93.184.216.34',
            ttl: 2147483647, // Maximum 32-bit signed integer
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });

    it('should validate internationalized domain names (IDN)', () => {
      const queryResult: DNSQueryResult = {
        question: {
          name: 'xn--n3h.example.com', // Punycode for ☃.example.com
          type: 'A',
          class: 'IN',
        },
        answers: [
          {
            type: 'A',
            address: '93.184.216.34',
            ttl: 3600,
          },
        ],
      };

      expect(isValidDNSQueryResult(queryResult)).toBe(true);
      expect(isARecord(queryResult.answers[0])).toBe(true);

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Performance and bulk validation', () => {
    it('should efficiently validate multiple A records', () => {
      const answers: DNSRecord[] = [];

      // Create 100 A records
      for (let i = 1; i <= 100; i++) {
        answers.push({
          type: 'A',
          address: `192.168.1.${i}`,
          ttl: 300,
        });
      }

      const queryResult: DNSQueryResult = {
        question: {
          name: 'bulk.example.com',
          type: 'A',
          class: 'IN',
        },
        answers,
      };

      const startTime = performance.now();
      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      answers.forEach(answer => {
        expect(isARecord(answer)).toBe(true);
      });

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete validation in reasonable time (less than 100ms)
      expect(executionTime).toBeLessThan(100);
    });

    it('should handle mixed record types efficiently', () => {
      const answers: DNSRecord[] = [
        { type: 'A', address: '192.168.1.1', ttl: 300 },
        { type: 'AAAA', address: '2001:db8::1', ttl: 300 },
        { type: 'CNAME', value: 'example.com', ttl: 300 },
        { type: 'MX', priority: 10, exchange: 'mail.example.com', ttl: 300 },
        {
          type: 'TXT',
          entries: ['v=spf1 include:_spf.google.com ~all'],
          ttl: 300,
        },
        { type: 'NS', value: 'ns1.example.com', ttl: 300 },
      ];

      const queryResult: DNSQueryResult = {
        question: {
          name: 'mixed.example.com',
          type: 'ANY',
          class: 'IN',
        },
        answers,
      };

      const startTime = performance.now();

      expect(isValidDNSQueryResult(queryResult)).toBe(true);

      answers.forEach(answer => {
        expect(isDNSRecord(answer)).toBe(true);
      });

      const validation = validateDNSResponse(queryResult);
      expect(validation.isValid).toBe(true);

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete efficiently
      expect(executionTime).toBeLessThan(50);
    });
  });
});
