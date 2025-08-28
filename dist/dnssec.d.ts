/**
 * DNSSEC validation utilities and record type definitions
 * @module DNSSEC
 */
/**
 * DNSSEC algorithms as defined in RFC 8624
 */
export declare enum DNSSECAlgorithm {
    RSAMD5 = 1,// Deprecated // DevSkim: ignore DS126858
    DH = 2,// Not recommended
    DSA = 3,// Not recommended
    RSASHA1 = 5,// Not recommended // DevSkim: ignore DS126858
    DSA_NSEC3_SHA1 = 6,// Not recommended // DevSkim: ignore DS126858
    RSASHA1_NSEC3_SHA1 = 7,// Not recommended // DevSkim: ignore DS126858 DS440010
    RSASHA256 = 8,// Recommended
    RSASHA512 = 10,// Recommended
    ECC_GOST = 12,// Optional
    ECDSAP256SHA256 = 13,// Recommended
    ECDSAP384SHA384 = 14,// Recommended
    ED25519 = 15,// Recommended
    ED448 = 16
}
/**
 * DNSSEC digest algorithms
 */
export declare enum DigestAlgorithm {
    SHA1 = 1,// Not recommended // DevSkim: ignore DS126858
    SHA256 = 2,// Recommended
    GOST = 3,// Optional
    SHA384 = 4
}
/**
 * NSEC3 hash algorithms
 */
export declare enum NSEC3HashAlgorithm {
    SHA1 = 1
}
/**
 * DNSSEC key flags
 */
export declare enum DNSKEYFlags {
    ZONE_KEY = 256,// Zone Key flag
    SEP = 1,// Secure Entry Point
    REVOKE = 128
}
/**
 * RRSIG record structure
 */
export interface RRSIGRecord {
    typeCovered: string;
    algorithm: DNSSECAlgorithm;
    labels: number;
    originalTTL: number;
    signatureExpiration: number;
    signatureInception: number;
    keyTag: number;
    signerName: string;
    signature: string;
}
/**
 * DNSKEY record structure
 */
export interface DNSKEYRecord {
    flags: number;
    protocol: number;
    algorithm: DNSSECAlgorithm;
    publicKey: string;
}
/**
 * DS record structure
 */
export interface DSRecord {
    keyTag: number;
    algorithm: DNSSECAlgorithm;
    digestType: DigestAlgorithm;
    digest: string;
}
/**
 * NSEC record structure
 */
export interface NSECRecord {
    nextDomainName: string;
    types: string[];
}
/**
 * NSEC3 record structure
 */
export interface NSEC3Record {
    hashAlgorithm: NSEC3HashAlgorithm;
    flags: number;
    iterations: number;
    salt: string;
    nextHashedOwnerName: string;
    types: string[];
}
/**
 * NSEC3PARAM record structure
 */
export interface NSEC3PARAMRecord {
    hashAlgorithm: NSEC3HashAlgorithm;
    flags: number;
    iterations: number;
    salt: string;
}
/**
 * Validates a RRSIG record
 */
export declare function validateRRSIG(record: any): RRSIGRecord;
/**
 * Validates a DNSKEY record
 */
export declare function validateDNSKEY(record: any): DNSKEYRecord;
/**
 * Validates a DS record
 */
export declare function validateDS(record: any): DSRecord;
/**
 * Validates an NSEC record
 */
export declare function validateNSEC(record: any): NSECRecord;
/**
 * Validates an NSEC3 record
 */
export declare function validateNSEC3(record: any): NSEC3Record;
/**
 * Validates an NSEC3PARAM record
 */
export declare function validateNSEC3PARAM(record: any): NSEC3PARAMRecord;
/**
 * Calculates DNSKEY key tag (RFC 4034 Appendix B)
 */
export declare function calculateKeyTag(dnskey: DNSKEYRecord): number;
/**
 * Checks if a DNSSEC algorithm is recommended for use
 */
export declare function isRecommendedAlgorithm(algorithm: DNSSECAlgorithm): boolean;
/**
 * Checks if a digest algorithm is recommended for use
 */
export declare function isRecommendedDigestAlgorithm(algorithm: DigestAlgorithm): boolean;
/**
 * Validates DNSSEC signature timestamps
 */
export declare function validateSignatureTimestamps(inception: number, expiration: number, clockSkew?: number): boolean;
//# sourceMappingURL=dnssec.d.ts.map