import {
  // Basic validators
  isARecord,
  isMXRecord,
  isTXTRecord,
  isCAARecord,
  isDNSRecord,

  // Enhanced validators with detailed errors
  validateARecord,
  validateMXRecord,
  getValidationSuggestions,

  // DNSSEC validators
  isDNSKEYRecord,
  isSSHFPRecord,

  // Utility functions
  validateDNSRecord,
  validateDNSResponse,

  // Performance utilities
  trackPerformance,
  globalPerformanceTracker,

  // Types
  DNSQueryResult,
  ARecord,
  MXRecord,
  DNSKEYRecord,
} from '../src/index';

/**
 * Example usage of the DNS Validator library
 *
 * This example demonstrates:
 * - Basic record validation
 * - Enhanced validation with detailed errors
 * - DNSSEC record validation
 * - Performance tracking
 * - DNS query response validation
 */

// Example: Validating individual DNS records
console.log('=== Individual Record Validation ===');

// A record validation
const aRecord: ARecord = {
  type: 'A',
  address: '192.168.1.1',
  ttl: 300,
};

console.log('A Record valid:', isARecord(aRecord)); // true
console.log('A Record validation:', validateDNSRecord(aRecord));

// Enhanced A record validation with detailed errors
console.log('\n=== Enhanced Validation ===');
const enhancedResult = validateARecord(aRecord);
console.log('Enhanced A Record validation:', enhancedResult);

// Invalid A record with detailed error messages
const invalidARecord = {
  type: 'A',
  address: '999.999.999.999', // Invalid IP
  ttl: 300,
};

console.log('Invalid A Record valid:', isARecord(invalidARecord)); // false
const invalidResult = validateARecord(invalidARecord);
console.log('Invalid A Record detailed errors:', invalidResult);

// Get suggestions for A records
console.log('A Record suggestions:', getValidationSuggestions('A'));

// MX record validation
console.log('\n=== MX Record Validation ===');
const mxRecord: MXRecord = {
  type: 'MX',
  priority: 10,
  exchange: 'mail.example.com',
  ttl: 300,
};

console.log('MX Record valid:', isMXRecord(mxRecord)); // true

// Enhanced MX validation
const mxValidationResult = validateMXRecord(mxRecord);
console.log('MX Record enhanced validation:', mxValidationResult);

// DNSSEC record validation
console.log('\n=== DNSSEC Record Validation ===');
const dnskeyRecord: DNSKEYRecord = {
  type: 'DNSKEY',
  flags: 256,
  protocol: 3,
  algorithm: 8,
  publicKey: 'ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
  ttl: 3600,
};

console.log('DNSKEY Record valid:', isDNSKEYRecord(dnskeyRecord)); // true

// SSH fingerprint record
const sshfpRecord = {
  type: 'SSHFP',
  algorithm: 1,
  fpType: 1,
  fingerprint: 'ABCDEF1234567890ABCDEF1234567890ABCDEF12',
  ttl: 3600,
};

console.log('SSHFP Record valid:', isSSHFPRecord(sshfpRecord)); // true

// Performance tracking example
console.log('\n=== Performance Tracking ===');
const trackedValidator = trackPerformance(isARecord);

// Run some validations
for (let i = 0; i < 1000; i++) {
  trackedValidator(aRecord);
}

const metrics = globalPerformanceTracker.getMetrics();
console.log('Performance metrics:', metrics);

// DNS query response validation
console.log('\n=== DNS Query Response Validation ===');
const dnsResponse: DNSQueryResult = {
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
    {
      type: 'A',
      address: '93.184.216.35',
      ttl: 86400,
    },
  ],
};

const responseValidation = validateDNSResponse(dnsResponse);
console.log('DNS Response validation:', responseValidation);

// Complex record examples
console.log('\n=== Complex Record Examples ===');

// TXT record with multiple entries
const txtRecord = {
  type: 'TXT',
  entries: [
    'v=spf1 include:_spf.google.com ~all',
    'google-site-verification=abc123def456',
  ],
  ttl: 300,
};

console.log('TXT Record valid:', isTXTRecord(txtRecord)); // true

// CAA record
const caaRecord = {
  type: 'CAA',
  critical: 0,
  issue: 'letsencrypt.org',
  ttl: 86400,
};

console.log('CAA Record valid:', isCAARecord(caaRecord)); // true

// Generic DNS record validation
console.log('\n=== Generic DNS Record Validation ===');
const genericRecord = {
  type: 'A',
  address: '8.8.8.8',
  ttl: 300,
};

console.log('Generic validation:', isDNSRecord(genericRecord)); // true

// Error handling example
console.log('\n=== Error Handling Examples ===');
const malformedRecord = {
  type: 'A',
  // Missing address field
  ttl: 300,
};

const validationWithErrors = validateDNSRecord(malformedRecord);
console.log('Malformed record validation:', validationWithErrors);

console.log('\n=== Example Complete ===');

// Example: Validating complete DNS query results
console.log('\n=== DNS Query Result Validation ===');

const dnsQueryResult: DNSQueryResult = {
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
    {
      type: 'A',
      address: '93.184.216.35',
      ttl: 86400,
    },
  ],
  authority: [
    {
      type: 'NS',
      value: 'ns1.example.com',
      ttl: 172800,
    },
  ],
};

console.log(
  'DNS Query Result validation:',
  validateDNSResponse(dnsQueryResult)
);

// Example: Type mismatch warning
const mismatchedResult: DNSQueryResult = {
  question: {
    name: 'example.com',
    type: 'A', // Question asks for A record
    class: 'IN',
  },
  answers: [
    {
      type: 'CNAME', // But answer is CNAME
      value: 'alias.example.com',
      ttl: 300,
    },
  ],
};

console.log(
  'Mismatched Query Result validation:',
  validateDNSResponse(mismatchedResult)
);

// Example: Using generic isDNSRecord function
console.log('\n=== Generic Record Validation ===');

const unknownRecord = {
  type: 'TXT',
  entries: ['v=spf1 include:_spf.google.com ~all'],
  ttl: 300,
};

console.log('Unknown record is valid DNS record:', isDNSRecord(unknownRecord)); // true

// Example: Real-world DNS records
console.log('\n=== Real-world Examples ===');

// Google's public DNS
const googleDNS = {
  type: 'A',
  address: '8.8.8.8',
  ttl: 21600,
};

console.log('Google DNS A record valid:', isARecord(googleDNS));

// SPF record
const spfRecord = {
  type: 'TXT',
  entries: ['v=spf1 include:_spf.google.com include:mailgun.org ~all'],
  ttl: 300,
};

console.log('SPF TXT record valid:', isTXTRecord(spfRecord));

// MX record for Gmail
const gmailMX = {
  type: 'MX',
  priority: 10,
  exchange: 'aspmx.l.google.com',
  ttl: 3600,
};

console.log('Gmail MX record valid:', isMXRecord(gmailMX));

// CAA record for Let's Encrypt
const letsEncryptCAA = {
  type: 'CAA',
  critical: 0,
  issue: 'letsencrypt.org',
  ttl: 86400,
};

console.log("Let's Encrypt CAA record valid:", isCAARecord(letsEncryptCAA));

console.log('\n=== Library Usage Complete ===');
