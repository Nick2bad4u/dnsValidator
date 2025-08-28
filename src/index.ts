/**
 * DNS Validator Library
 *
 * A comprehensive TypeScript library for validating DNS query results and individual DNS records.
 * Supports validation of traditional DNS records (A, AAAA, MX, TXT, etc.) and DNSSEC records
 * (DNSKEY, DS, RRSIG, NSEC, etc.) with enhanced error reporting and performance optimization.
 *
 * @example
 * ```typescript
 * import { isARecord, validateARecord } from 'dns-response-validator';
 *
 * // Basic validation
 * const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
 * console.log(isARecord(record)); // true
 *
 * // Enhanced validation with error details
 * const result = validateARecord(record);
 * console.log(result.isValid); // true
 * ```
 *
 * @packageDocumentation
 */

// Export all types
export * from './types';

// Export validation utilities
export * from './utils';

// Export DNSSEC validators and utilities (avoiding type conflicts)
export {
  validateRRSIG,
  validateDNSKEY,
  validateDS,
  validateNSEC,
  validateNSEC3,
  validateNSEC3PARAM,
  calculateKeyTag,
  isRecommendedAlgorithm,
  isRecommendedDigestAlgorithm,
  validateSignatureTimestamps,
  DNSSECAlgorithm,
  DigestAlgorithm,
  NSEC3HashAlgorithm,
  DNSKEYFlags,
} from './dnssec';

// Export validators
export * from './validators';

// Export DNSSEC and additional record validators
export * from './dnssec-validators';

// Export enhanced validators with detailed error messages
export * from './enhanced-validators';

// Export error classes and utilities
export * from './errors';

// Export performance optimization utilities
export * from './performance';

// Re-export commonly used functions for convenience
export {
  isARecord,
  isAAAARecord,
  isCNAMERecord,
  isMXRecord,
  isTXTRecord,
  isNSRecord,
  isPTRRecord,
  isSOARecord,
  isSRVRecord,
  isCAARecord,
  isNAPTRRecord,
  isTLSARecord,
  isANYRecord,
  isDNSRecord,
  validateDNSRecord,
} from './validators';

export {
  isValidDNSQueryResult,
  isValidDNSRecord,
  validateDNSResponse,
} from './utils';

// Export Node.js dns API compatibility helpers
export * from './node-compat';
