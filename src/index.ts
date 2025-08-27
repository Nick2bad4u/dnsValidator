/**
 * DNS Validator Library
 *
 * A TypeScript library for validating DNS query results and individual DNS records.
 * Supports validation of A, AAAA, ANY, CAA, CNAME, MX, NAPTR, NS, PTR, SOA, SRV, TLSA, and TXT records.
 */

// Export all types
export * from './types';

// Export validation utilities
export * from './utils';

// Export individual record validators
export * from './validators';

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
  validateDNSRecord
} from './validators';

export {
  isValidDNSQueryResult,
  isValidDNSRecord,
  validateDNSResponse
} from './utils';
