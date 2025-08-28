import { DNSKEYRecord, DSRecord, NSECRecord, NSEC3Record, RRSIGRecord, SSHFPRecord } from './types';
/**
 * Validates a DNSKEY record
 */
export declare function isDNSKEYRecord(record: unknown): record is DNSKEYRecord;
/**
 * Validates a DS record
 */
export declare function isDSRecord(record: unknown): record is DSRecord;
/**
 * Validates an NSEC record
 */
export declare function isNSECRecord(record: unknown): record is NSECRecord;
/**
 * Validates an NSEC3 record
 */
export declare function isNSEC3Record(record: unknown): record is NSEC3Record;
/**
 * Validates an RRSIG record
 */
export declare function isRRSIGRecord(record: unknown): record is RRSIGRecord;
/**
 * Validates an SSHFP record
 */
export declare function isSSHFPRecord(record: unknown): record is SSHFPRecord;
//# sourceMappingURL=dnssec-validators.d.ts.map