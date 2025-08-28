import {
  // DNSSEC validators
  isDNSKEYRecord,
  isDSRecord,
  isRRSIGRecord,
  isNSECRecord,
  isNSEC3Record,
  isSSHFPRecord,

  // Enhanced validators
  validateARecord,
  validateAAAARecord,
  validateMXRecord,

  // Performance utilities
  ValidationPerformanceTracker,
  trackPerformance,
  fastPreValidate,

  // Error handling
  DNSValidationError,
  ValidationErrorFactory,

  // Types
  DNSKEYRecord,
  DSRecord,
  RRSIGRecord,
  SSHFPRecord,
  ValidationResult,
} from '../src/index';

/**
 * Advanced DNS Validator Examples
 *
 * This example demonstrates advanced features:
 * - DNSSEC record validation
 * - Custom performance tracking
 * - Error handling with custom errors
 * - Batch validation
 * - Pre-validation optimization
 */

console.log('=== Advanced DNS Validator Examples ===\n');

// DNSSEC Records
console.log('1. DNSSEC Record Validation');
console.log('-----------------------------');

// DNSKEY record (public key for DNSSEC)
const dnskeyRecord: DNSKEYRecord = {
  type: 'DNSKEY',
  flags: 257, // KSK (Key Signing Key)
  protocol: 3,
  algorithm: 8, // RSA/SHA-256
  publicKey:
    'AwEAAag/59QSNySLMc8KjBiNe6c7QG1Gs6SjgG4KvDsV7Df3i7n3mvAgHXLs5V2R7Z8KlCJnF9k1J2v8q5W7n2H1',
  ttl: 86400,
};

console.log('DNSKEY Record:', isDNSKEYRecord(dnskeyRecord));

// DS record (delegation signer)
const dsRecord: DSRecord = {
  type: 'DS',
  keyTag: 12345,
  algorithm: 8, // RSA/SHA-256
  digestType: 2, // SHA-256
  digest: 'A1B2C3D4E5F67890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
  ttl: 86400,
};

console.log('DS Record:', isDSRecord(dsRecord));

// RRSIG record (signature)
const rrsigRecord: RRSIGRecord = {
  type: 'RRSIG',
  typeCovered: 'A',
  algorithm: 8,
  labels: 2,
  originalTTL: 300,
  signatureExpiration: 1234567890,
  signatureInception: 1234567800,
  keyTag: 12345,
  signerName: 'example.com',
  signature: 'ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
  ttl: 300,
};

console.log('RRSIG Record:', isRRSIGRecord(rrsigRecord));

// SSHFP record (SSH fingerprint)
const sshfpRecord: SSHFPRecord = {
  type: 'SSHFP',
  algorithm: 4, // Ed25519
  fpType: 2, // SHA-256
  fingerprint:
    'ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
  ttl: 3600,
};

console.log('SSHFP Record:', isSSHFPRecord(sshfpRecord));

// Advanced Performance Tracking
console.log('\n2. Advanced Performance Tracking');
console.log('----------------------------------');

const customTracker = new ValidationPerformanceTracker();

// Create tracked validators
const trackedAValidator = trackPerformance(validateARecord, customTracker);
const trackedMXValidator = trackPerformance(validateMXRecord, customTracker);

// Generate test data
const testARecords = Array.from({ length: 100 }, (_, i) => ({
  type: 'A' as const,
  address: `192.168.1.${i + 1}`,
  ttl: 300,
}));

const testMXRecords = Array.from({ length: 50 }, (_, i) => ({
  type: 'MX' as const,
  priority: (i % 10) + 1,
  exchange: `mail${i}.example.com`,
  ttl: 300,
}));

// Batch validation with performance tracking
console.time('Batch validation');

testARecords.forEach(record => trackedAValidator(record));
testMXRecords.forEach(record => trackedMXValidator(record));

console.timeEnd('Batch validation');

const performanceMetrics = customTracker.getMetrics();
console.log('Performance metrics:', {
  totalValidations: performanceMetrics.totalValidations,
  successfulValidations: performanceMetrics.successfulValidations,
  averageTimeMs: performanceMetrics.averageTimeMs.toFixed(3),
  successRate: `${((performanceMetrics.successfulValidations / performanceMetrics.totalValidations) * 100).toFixed(1)}%`,
});

// Pre-validation optimization
console.log('\n3. Pre-validation Optimization');
console.log('--------------------------------');

const testIPs = [
  '192.168.1.1', // Valid
  '8.8.8.8', // Valid
  '999.999.999.999', // Invalid
  'not.an.ip', // Invalid
  '10.0.0.1', // Valid
];

console.log('Testing IP pre-validation:');
testIPs.forEach(ip => {
  const preValidationResult = fastPreValidate(ip, 'ipv4');
  console.log(
    `${ip}: ${preValidationResult === null ? 'PASS' : 'FAIL'} (pre-validation)`
  );
});

// Error Handling Examples
console.log('\n4. Advanced Error Handling');
console.log('----------------------------');

// Custom error creation
try {
  throw ValidationErrorFactory.invalidIPAddress('999.999.999.999', 4);
} catch (error) {
  if (error instanceof DNSValidationError) {
    console.log('Custom DNS Validation Error:');
    console.log(`- Code: ${error.code}`);
    console.log(`- Field: ${error.field}`);
    console.log(`- Value: ${error.value}`);
    console.log(`- Message: ${error.message}`);
  }
}

// Batch validation with error collection
console.log('\n5. Batch Validation with Error Collection');
console.log('--------------------------------------------');

const mixedRecords = [
  { type: 'A', address: '192.168.1.1', ttl: 300 }, // Valid
  { type: 'A', address: '999.999.999.999', ttl: 300 }, // Invalid IP
  { type: 'A', ttl: 300 }, // Missing address
  { type: 'MX', priority: 10, exchange: 'mail.example.com', ttl: 300 }, // Valid
  { type: 'MX', priority: 70000, exchange: 'mail.example.com', ttl: 300 }, // Invalid priority
];

interface BatchValidationResult {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: Array<{ index: number; errors: string[] }>;
}

function batchValidate(records: any[]): BatchValidationResult {
  const result: BatchValidationResult = {
    totalRecords: records.length,
    validRecords: 0,
    invalidRecords: 0,
    errors: [],
  };

  records.forEach((record, index) => {
    let validationResult: ValidationResult;

    if (record.type === 'A') {
      validationResult = validateARecord(record);
    } else if (record.type === 'MX') {
      validationResult = validateMXRecord(record);
    } else {
      validationResult = {
        isValid: false,
        errors: [`Unsupported record type: ${record.type}`],
        warnings: [],
      };
    }

    if (validationResult.isValid) {
      result.validRecords++;
    } else {
      result.invalidRecords++;
      result.errors.push({
        index,
        errors: validationResult.errors,
      });
    }
  });

  return result;
}

const batchResult = batchValidate(mixedRecords);
console.log('Batch validation result:', batchResult);

// DNS Query Simulation
console.log('\n6. DNS Query Response Simulation');
console.log('----------------------------------');

function simulateDNSQuery(domain: string, recordType: string) {
  // Simulate different responses
  const responses = {
    'example.com': {
      A: [
        { type: 'A', address: '93.184.216.34', ttl: 86400 },
        { type: 'A', address: '93.184.216.35', ttl: 86400 },
      ],
      MX: [
        { type: 'MX', priority: 10, exchange: 'mail1.example.com', ttl: 3600 },
        { type: 'MX', priority: 20, exchange: 'mail2.example.com', ttl: 3600 },
      ],
    },
    'secure.example.com': {
      A: [{ type: 'A', address: '10.0.0.1', ttl: 300 }],
      DNSKEY: [dnskeyRecord],
      DS: [dsRecord],
      RRSIG: [rrsigRecord],
    },
  };

  const domainResponses = responses[domain as keyof typeof responses];
  if (!domainResponses) {
    return { answers: [] };
  }

  const answers =
    domainResponses[recordType as keyof typeof domainResponses] || [];
  return {
    question: { name: domain, type: recordType, class: 'IN' },
    answers,
  };
}

// Test DNS queries
const queries = [
  ['example.com', 'A'],
  ['example.com', 'MX'],
  ['secure.example.com', 'DNSKEY'],
  ['secure.example.com', 'DS'],
];

queries.forEach(([domain, type]) => {
  const response = simulateDNSQuery(domain, type);
  console.log(`Query: ${domain} ${type}`);
  console.log(`Answers: ${response.answers?.length || 0} records`);

  if (response.answers) {
    response.answers.forEach((answer, i) => {
      console.log(
        `  Answer ${i + 1}: ${answer.type} record - Valid: ${
          answer.type === 'A'
            ? validateARecord(answer).isValid
            : answer.type === 'MX'
              ? validateMXRecord(answer).isValid
              : answer.type === 'DNSKEY'
                ? isDNSKEYRecord(answer)
                : answer.type === 'DS'
                  ? isDSRecord(answer)
                  : 'Unknown'
        }`
      );
    });
  }
  console.log('');
});

console.log('=== Advanced Examples Complete ===');
