import { DNSRecord, DNSQueryResult, ValidationResult } from './types';
/**
 * Utility functions for DNS query response validation
 */
/**
 * Validates if a DNS query result structure is valid
 */
export declare function isValidDNSQueryResult(result: unknown): result is DNSQueryResult; /**
 * Validates if a DNS record structure is valid
 */
export declare function isValidDNSRecord(record: unknown): record is DNSRecord;
/**
 * Validates DNS query response completeness and consistency
 */
export declare function validateDNSResponse(result: DNSQueryResult): ValidationResult;
/**
 * Validates if a number is within a valid port range
 */
export declare function isValidPort(port: number): boolean;
/**
 * Validates if a number is a valid priority value
 */
export declare function isValidPriority(priority: number): boolean;
/**
 * Validates if a number is a valid weight value
 */
export declare function isValidWeight(weight: number): boolean;
/**
 * Validates if a number is a valid TTL value
 */
export declare function isValidTTL(ttl: number): boolean;
/**
 * Validates if a CAA flags value is valid
 */
export declare function isValidCAAFlags(flags: number): boolean;
/**
 * Validates if a NAPTR flags value is valid
 */
export declare function isValidNAPTRFlags(flags: string): boolean;
/**
 * Validates if a TLSA usage value is valid
 */
export declare function isValidTLSAUsage(usage: number): boolean;
/**
 * Validates if a TLSA selector value is valid
 */
export declare function isValidTLSASelector(selector: number): boolean;
/**
 * Validates if a TLSA matching type value is valid
 */
export declare function isValidTLSAMatchingType(matchingType: number): boolean;
/**
 * Validates if a string is a valid hexadecimal string
 */
export declare function isValidHexString(hex: string): boolean;
/**
 * Validates if a string contains only printable ASCII characters for TXT records
 */
export declare function isValidTextRecord(text: string): boolean;
//# sourceMappingURL=utils.d.ts.map