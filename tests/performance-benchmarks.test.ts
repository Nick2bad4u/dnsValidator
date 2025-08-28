import {
  isARecord,
  isAAAARecord,
  isMXRecord,
  isSOARecord,
  isDNSRecord,
} from '../src/validators';
import { isValidDNSQueryResult } from '../src/utils';
import { DNSQueryResult, DNSRecord } from '../src/types';

describe('DNS Validation Performance Benchmarks', () => {
  describe('Single record validation performance', () => {
    const iterations = 10000;

    it('should validate A records efficiently', () => {
      const testRecord = {
        type: 'A' as const,
        address: '192.168.1.1',
        ttl: 300,
      };

      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        isARecord(testRecord);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const opsPerSecond = iterations / (duration / 1000);

      console.log(
        `A record validation: ${iterations} operations in ${duration.toFixed(2)}ms`
      );
      console.log(`Performance: ${opsPerSecond.toFixed(0)} ops/sec`);

      // Should complete in under 100ms for 10k validations
      expect(duration).toBeLessThan(100);
      expect(opsPerSecond).toBeGreaterThan(50000); // At least 50k ops/sec
    });

    it('should validate AAAA records efficiently', () => {
      const testRecord = {
        type: 'AAAA' as const,
        address: '2001:db8::1',
        ttl: 300,
      };

      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        isAAAARecord(testRecord);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const opsPerSecond = iterations / (duration / 1000);

      console.log(
        `AAAA record validation: ${iterations} operations in ${duration.toFixed(2)}ms`
      );
      console.log(`Performance: ${opsPerSecond.toFixed(0)} ops/sec`);

      expect(duration).toBeLessThan(150);
      expect(opsPerSecond).toBeGreaterThan(30000);
    });

    it('should validate MX records efficiently', () => {
      const testRecord = {
        type: 'MX' as const,
        priority: 10,
        exchange: 'mail.example.com',
        ttl: 300,
      };

      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        isMXRecord(testRecord);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const opsPerSecond = iterations / (duration / 1000);

      console.log(
        `MX record validation: ${iterations} operations in ${duration.toFixed(2)}ms`
      );
      console.log(`Performance: ${opsPerSecond.toFixed(0)} ops/sec`);

      expect(duration).toBeLessThan(200);
      expect(opsPerSecond).toBeGreaterThan(20000);
    });

    it('should validate complex SOA records efficiently', () => {
      const testRecord = {
        type: 'SOA' as const,
        primary: 'ns1.example.com',
        admin: 'admin.example.com',
        serial: 2024010101,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
        ttl: 86400,
      };

      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        isSOARecord(testRecord);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const opsPerSecond = iterations / (duration / 1000);

      console.log(
        `SOA record validation: ${iterations} operations in ${duration.toFixed(2)}ms`
      );
      console.log(`Performance: ${opsPerSecond.toFixed(0)} ops/sec`);

      expect(duration).toBeLessThan(300);
      expect(opsPerSecond).toBeGreaterThan(15000);
    });
  });

  describe('Bulk validation performance', () => {
    it('should efficiently validate large datasets of mixed records', () => {
      const records: DNSRecord[] = [];
      const recordCount = 1000;

      // Generate diverse test data
      for (let i = 0; i < recordCount; i++) {
        const recordType = i % 5;

        switch (recordType) {
          case 0:
            records.push({
              type: 'A',
              address: `192.168.${Math.floor(i / 256)}.${i % 256}`,
              ttl: 300,
            });
            break;
          case 1:
            records.push({
              type: 'AAAA',
              address: `2001:db8::${i.toString(16)}`,
              ttl: 300,
            });
            break;
          case 2:
            records.push({
              type: 'MX',
              priority: (i % 100) + 1,
              exchange: `mail${i}.example.com`,
              ttl: 300,
            });
            break;
          case 3:
            records.push({
              type: 'TXT',
              entries: [`record-${i}`, `data-${i * 2}`],
              ttl: 300,
            });
            break;
          case 4:
            records.push({
              type: 'CNAME',
              value: `target${i}.example.com`,
              ttl: 300,
            });
            break;
        }
      }

      const startTime = performance.now();

      let validCount = 0;
      for (const record of records) {
        if (isDNSRecord(record)) {
          validCount++;
        }
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const recordsPerSecond = records.length / (duration / 1000);

      console.log(
        `Bulk validation: ${records.length} records in ${duration.toFixed(2)}ms`
      );
      console.log(`Performance: ${recordsPerSecond.toFixed(0)} records/sec`);
      console.log(`Valid records: ${validCount}/${records.length}`);

      expect(validCount).toBe(records.length); // All should be valid
      expect(duration).toBeLessThan(500); // Should complete in under 500ms
      expect(recordsPerSecond).toBeGreaterThan(1000); // At least 1k records/sec
    });

    it('should efficiently validate large DNS query responses', () => {
      const queryCount = 100;
      const queries: DNSQueryResult[] = [];

      // Generate test queries with multiple answers each
      for (let i = 0; i < queryCount; i++) {
        const answerCount = 5 + (i % 10); // 5-14 answers per query
        const answers: DNSRecord[] = [];

        for (let j = 0; j < answerCount; j++) {
          answers.push({
            type: 'A',
            address: `10.0.${i}.${j}`,
            ttl: 300,
          });
        }

        queries.push({
          question: {
            name: `test${i}.example.com`,
            type: 'A',
            class: 'IN',
          },
          answers,
        });
      }

      const startTime = performance.now();

      let validQueries = 0;
      let totalRecords = 0;

      for (const query of queries) {
        if (isValidDNSQueryResult(query)) {
          validQueries++;
          totalRecords += query.answers.length;
        }
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const queriesPerSecond = queries.length / (duration / 1000);
      const recordsPerSecond = totalRecords / (duration / 1000);

      console.log(
        `Query validation: ${queries.length} queries, ${totalRecords} total records in ${duration.toFixed(2)}ms`
      );
      console.log(
        `Performance: ${queriesPerSecond.toFixed(0)} queries/sec, ${recordsPerSecond.toFixed(0)} records/sec`
      );
      console.log(`Valid queries: ${validQueries}/${queries.length}`);

      expect(validQueries).toBe(queries.length);
      expect(duration).toBeLessThan(1000);
      expect(queriesPerSecond).toBeGreaterThan(50);
    });
  });

  describe('Memory efficiency tests', () => {
    it('should not leak memory during repeated validations', () => {
      const testRecord = {
        type: 'A' as const,
        address: '192.168.1.1',
        ttl: 300,
      };

      // Get baseline memory
      const initialMemory = process.memoryUsage();

      // Perform many validations
      for (let i = 0; i < 50000; i++) {
        isARecord(testRecord);
        isDNSRecord(testRecord);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      console.log(
        `Memory usage: ${initialMemory.heapUsed} -> ${finalMemory.heapUsed} (${memoryIncrease >= 0 ? '+' : ''}${memoryIncrease} bytes)`
      );

      // Memory increase should be minimal (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });

    it('should handle extremely large record datasets', () => {
      const largeDataset: DNSRecord[] = [];
      const recordCount = 10000;

      // Generate large dataset
      for (let i = 0; i < recordCount; i++) {
        largeDataset.push({
          type: 'A',
          address: `${(i >> 24) & 255}.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`,
          ttl: 300,
        });
      }

      const startTime = performance.now();
      const initialMemory = process.memoryUsage();

      let validCount = 0;
      for (const record of largeDataset) {
        if (isARecord(record)) {
          validCount++;
        }
      }

      const endTime = performance.now();
      const finalMemory = process.memoryUsage();

      const duration = endTime - startTime;
      const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed;
      const recordsPerSecond = recordCount / (duration / 1000);

      console.log(
        `Large dataset: ${recordCount} records in ${duration.toFixed(2)}ms`
      );
      console.log(`Performance: ${recordsPerSecond.toFixed(0)} records/sec`);
      console.log(`Memory used: ${(memoryUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Valid records: ${validCount}/${recordCount}`);

      expect(validCount).toBe(recordCount);
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
      expect(recordsPerSecond).toBeGreaterThan(1000);
      expect(memoryUsed).toBeLessThan(100 * 1024 * 1024); // Less than 100MB memory usage
    });
  });

  describe('Validation accuracy under stress', () => {
    it('should maintain validation accuracy with rapid-fire tests', () => {
      const validRecord = {
        type: 'A' as const,
        address: '192.168.1.1',
        ttl: 300,
      };

      const invalidRecord = {
        type: 'A' as const,
        address: '999.999.999.999', // Invalid IP
        ttl: 300,
      };

      let validResults = 0;
      let invalidResults = 0;
      const testCount = 5000;

      const startTime = performance.now();

      for (let i = 0; i < testCount; i++) {
        if (isARecord(validRecord)) validResults++;
        if (!isARecord(invalidRecord)) invalidResults++;
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(
        `Accuracy test: ${testCount * 2} validations in ${duration.toFixed(2)}ms`
      );
      console.log(
        `Valid results: ${validResults}/${testCount}, Invalid results: ${invalidResults}/${testCount}`
      );

      // Should maintain 100% accuracy
      expect(validResults).toBe(testCount);
      expect(invalidResults).toBe(testCount);
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Real-world performance scenarios', () => {
    it('should handle DNS zone file validation efficiently', () => {
      // Simulate a small DNS zone with various record types
      const zoneRecords: DNSRecord[] = [
        // SOA record
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
        // NS records
        { type: 'NS', value: 'ns1.example.com', ttl: 86400 },
        { type: 'NS', value: 'ns2.example.com', ttl: 86400 },
        // A records
        { type: 'A', address: '93.184.216.34', ttl: 3600 },
        // AAAA records
        {
          type: 'AAAA',
          address: '2606:2800:220:1:248:1893:25c8:1946',
          ttl: 3600,
        },
        // MX records
        { type: 'MX', priority: 10, exchange: 'mail.example.com', ttl: 3600 },
        { type: 'MX', priority: 20, exchange: 'mail2.example.com', ttl: 3600 },
        // TXT records
        {
          type: 'TXT',
          entries: ['v=spf1 include:_spf.google.com ~all'],
          ttl: 300,
        },
        { type: 'TXT', entries: ['google-site-verification=abc123'], ttl: 300 },
        // CNAME records
        { type: 'CNAME', value: 'example.com', ttl: 3600 },
      ];

      const iterations = 1000;
      const startTime = performance.now();

      let totalValidRecords = 0;
      for (let i = 0; i < iterations; i++) {
        for (const record of zoneRecords) {
          if (isDNSRecord(record)) {
            totalValidRecords++;
          }
        }
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const zonesPerSecond = iterations / (duration / 1000);
      const recordsPerSecond =
        (iterations * zoneRecords.length) / (duration / 1000);

      console.log(
        `Zone validation: ${iterations} zones (${zoneRecords.length} records each) in ${duration.toFixed(2)}ms`
      );
      console.log(
        `Performance: ${zonesPerSecond.toFixed(0)} zones/sec, ${recordsPerSecond.toFixed(0)} records/sec`
      );
      console.log(
        `Total valid records: ${totalValidRecords}/${iterations * zoneRecords.length}`
      );

      expect(totalValidRecords).toBe(iterations * zoneRecords.length);
      expect(duration).toBeLessThan(2000);
      expect(zonesPerSecond).toBeGreaterThan(100);
    });
  });
});
