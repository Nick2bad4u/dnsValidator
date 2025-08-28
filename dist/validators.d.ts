/**
 * DNS Record Validators
 *
 * This module provides validation functions for all supported DNS record types.
 * Each validator function performs type checking and format validation according
 * to DNS standards and RFCs.
 *
 * @example
 * ```typescript
 * import { isARecord, isMXRecord } from './validators';
 *
 * const aRecord = { type: 'A', address: '192.168.1.1', ttl: 300 };
 * console.log(isARecord(aRecord)); // true
 * ```
 *
 * @packageDocumentation
 */
import { ARecord, AAAARecord, CNAMERecord, MXRecord, TXTRecord, NSRecord, PTRRecord, SOARecord, SRVRecord, CAARecord, NAPTRRecord, TLSARecord, ANYRecord, DNSRecord, ValidationResult } from './types';
/**
 * Validates an A record (IPv4 address mapping).
 *
 * Checks that the record has the correct type, a valid IPv4 address,
 * and an optional valid TTL value.
 *
 * @param record - The record to validate
 * @returns True if the record is a valid A record
 *
 * @example
 * ```typescript
 * const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
 * console.log(isARecord(record)); // true
 *
 * const invalid = { type: 'A', address: '999.999.999.999' };
 * console.log(isARecord(invalid)); // false
 * ```
 *
 * @public
 */
export declare function isARecord(record: unknown): record is ARecord;
/**
 * Validates an AAAA record (IPv6 address mapping).
 *
 * Checks that the record has the correct type, a valid IPv6 address,
 * and an optional valid TTL value.
 *
 * @param record - The record to validate
 * @returns True if the record is a valid AAAA record
 *
 * @example
 * ```typescript
 * const record = { type: 'AAAA', address: '2001:db8::1', ttl: 300 };
 * console.log(isAAAARecord(record)); // true
 *
 * const invalid = { type: 'AAAA', address: '192.168.1.1' };
 * console.log(isAAAARecord(invalid)); // false
 * ```
 *
 * @public
 */
export declare function isAAAARecord(record: unknown): record is AAAARecord;
/**
 * Validates a CNAME record (canonical name alias).
 *
 * Checks that the record has the correct type, a valid fully qualified domain name,
 * and an optional valid TTL value.
 *
 * @param record - The record to validate
 * @returns True if the record is a valid CNAME record
 *
 * @example
 * ```typescript
 * const record = { type: 'CNAME', value: 'canonical.example.com', ttl: 300 };
 * console.log(isCNAMERecord(record)); // true
 *
 * const invalid = { type: 'CNAME', value: 'not-a-domain' };
 * console.log(isCNAMERecord(invalid)); // false
 * ```
 *
 * @public
 */
export declare function isCNAMERecord(record: unknown): record is CNAMERecord;
/**
 * Validates an MX record
 */
export declare function isMXRecord(record: unknown): record is MXRecord;
/**
 * Validates a TXT record
 */
export declare function isTXTRecord(record: unknown): record is TXTRecord;
/**
 * Validates an NS record
 */
export declare function isNSRecord(record: unknown): record is NSRecord;
/**
 * Validates a PTR record
 */
export declare function isPTRRecord(record: unknown): record is PTRRecord;
/**
 * Validates an SOA record
 */
export declare function isSOARecord(record: unknown): record is SOARecord;
/**
 * Validates an SRV record
 */
export declare function isSRVRecord(record: unknown): record is SRVRecord;
/**
 * Validates a CAA record
 */
export declare function isCAARecord(record: unknown): record is CAARecord;
/**
 * Validates a NAPTR record
 */
export declare function isNAPTRRecord(record: unknown): record is NAPTRRecord;
/**
 * Validates a TLSA record
 */
export declare function isTLSARecord(record: unknown): record is TLSARecord;
/**
 * Validates an ANY record (can be any type)
 */
export declare function isANYRecord(record: unknown): record is ANYRecord;
/**
 * Validates any DNS record based on its type
 */
export declare function isDNSRecord(record: unknown): record is DNSRecord;
/**
 * Validates a DNS record and returns detailed validation result
 */
export declare function validateDNSRecord(record: unknown): ValidationResult;
//# sourceMappingURL=validators.d.ts.map