/**
 * DNSSEC validation utilities and record type definitions
 * @module DNSSEC
 */

import { DNSValidationError } from './errors';

/**
 * DNSSEC algorithms as defined in RFC 8624
 */
export enum DNSSECAlgorithm {
  RSAMD5 = 1, // Deprecated
  DH = 2, // Not recommended
  DSA = 3, // Not recommended
  RSASHA1 = 5, // Not recommended
  DSA_NSEC3_SHA1 = 6, // Not recommended
  RSASHA1_NSEC3_SHA1 = 7, // Not recommended
  RSASHA256 = 8, // Recommended
  RSASHA512 = 10, // Recommended
  ECC_GOST = 12, // Optional
  ECDSAP256SHA256 = 13, // Recommended
  ECDSAP384SHA384 = 14, // Recommended
  ED25519 = 15, // Recommended
  ED448 = 16, // Recommended
}

/**
 * DNSSEC digest algorithms
 */
export enum DigestAlgorithm {
  SHA1 = 1, // Not recommended
  SHA256 = 2, // Recommended
  GOST = 3, // Optional
  SHA384 = 4, // Recommended
}

/**
 * NSEC3 hash algorithms
 */
export enum NSEC3HashAlgorithm {
  SHA1 = 1,
}

/**
 * DNSSEC key flags
 */
export enum DNSKEYFlags {
  ZONE_KEY = 0x0100, // Zone Key flag
  SEP = 0x0001, // Secure Entry Point
  REVOKE = 0x0080, // Revoke flag
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
export function validateRRSIG(record: any): RRSIGRecord {
  if (!record || typeof record !== 'object') {
    throw new DNSValidationError(
      'RRSIG record must be an object',
      'INVALID_RRSIG_STRUCTURE'
    );
  }

  // Validate type covered
  if (!record.typeCovered || typeof record.typeCovered !== 'string') {
    throw new DNSValidationError(
      'RRSIG record must have a valid typeCovered field',
      'INVALID_RRSIG_TYPE_COVERED',
      'typeCovered',
      record.typeCovered
    );
  }

  // Validate algorithm
  if (
    !Number.isInteger(record.algorithm) ||
    record.algorithm < 1 ||
    record.algorithm > 16
  ) {
    throw new DNSValidationError(
      'RRSIG record must have a valid algorithm',
      'INVALID_RRSIG_ALGORITHM',
      'algorithm',
      record.algorithm
    );
  }

  // Validate labels
  if (
    !Number.isInteger(record.labels) ||
    record.labels < 0 ||
    record.labels > 127
  ) {
    throw new DNSValidationError(
      'RRSIG labels must be between 0 and 127',
      'INVALID_RRSIG_LABELS',
      'labels',
      record.labels
    );
  }

  // Validate TTL
  if (!Number.isInteger(record.originalTTL) || record.originalTTL < 0) {
    throw new DNSValidationError(
      'RRSIG originalTTL must be a non-negative integer',
      'INVALID_RRSIG_TTL',
      'originalTTL',
      record.originalTTL
    );
  }

  // Validate timestamps
  if (
    !Number.isInteger(record.signatureExpiration) ||
    record.signatureExpiration < 0
  ) {
    throw new DNSValidationError(
      'RRSIG signatureExpiration must be a valid timestamp',
      'INVALID_RRSIG_EXPIRATION',
      'signatureExpiration',
      record.signatureExpiration
    );
  }

  if (
    !Number.isInteger(record.signatureInception) ||
    record.signatureInception < 0
  ) {
    throw new DNSValidationError(
      'RRSIG signatureInception must be a valid timestamp',
      'INVALID_RRSIG_INCEPTION',
      'signatureInception',
      record.signatureInception
    );
  }

  if (record.signatureInception >= record.signatureExpiration) {
    throw new DNSValidationError(
      'RRSIG signatureInception must be before signatureExpiration',
      'INVALID_RRSIG_TIMESTAMP_ORDER'
    );
  }

  // Validate key tag
  if (
    !Number.isInteger(record.keyTag) ||
    record.keyTag < 0 ||
    record.keyTag > 65535
  ) {
    throw new DNSValidationError(
      'RRSIG keyTag must be between 0 and 65535',
      'INVALID_RRSIG_KEY_TAG',
      'keyTag',
      record.keyTag
    );
  }

  // Validate signer name
  if (!record.signerName || typeof record.signerName !== 'string') {
    throw new DNSValidationError(
      'RRSIG record must have a valid signerName',
      'INVALID_RRSIG_SIGNER_NAME',
      'signerName',
      record.signerName
    );
  }

  // Basic domain name validation for signer
  if (!/^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.?$/.test(record.signerName)) {
    throw new DNSValidationError(
      'RRSIG signerName must be a valid domain name',
      'INVALID_RRSIG_SIGNER_FORMAT',
      'signerName',
      record.signerName
    );
  }

  // Validate signature
  if (!record.signature || typeof record.signature !== 'string') {
    throw new DNSValidationError(
      'RRSIG record must have a valid signature',
      'INVALID_RRSIG_SIGNATURE',
      'signature',
      record.signature
    );
  }

  // Signature should be base64-encoded
  if (!/^[A-Za-z0-9+/]+=*$/.test(record.signature)) {
    throw new DNSValidationError(
      'RRSIG signature must be base64-encoded',
      'INVALID_RRSIG_SIGNATURE_FORMAT',
      'signature',
      record.signature
    );
  }

  return {
    typeCovered: record.typeCovered,
    algorithm: record.algorithm,
    labels: record.labels,
    originalTTL: record.originalTTL,
    signatureExpiration: record.signatureExpiration,
    signatureInception: record.signatureInception,
    keyTag: record.keyTag,
    signerName: record.signerName,
    signature: record.signature,
  };
}

/**
 * Validates a DNSKEY record
 */
export function validateDNSKEY(record: any): DNSKEYRecord {
  if (!record || typeof record !== 'object') {
    throw new DNSValidationError(
      'DNSKEY record must be an object',
      'INVALID_DNSKEY_STRUCTURE'
    );
  }

  // Validate flags
  if (
    !Number.isInteger(record.flags) ||
    record.flags < 0 ||
    record.flags > 65535
  ) {
    throw new DNSValidationError(
      'DNSKEY flags must be between 0 and 65535',
      'INVALID_DNSKEY_FLAGS',
      'flags',
      record.flags
    );
  }

  // Validate protocol (must be 3 for DNSSEC)
  if (record.protocol !== 3) {
    throw new DNSValidationError(
      'DNSKEY protocol must be 3 for DNSSEC',
      'INVALID_DNSKEY_PROTOCOL',
      'protocol',
      record.protocol
    );
  }

  // Validate algorithm
  if (
    !Number.isInteger(record.algorithm) ||
    record.algorithm < 1 ||
    record.algorithm > 16
  ) {
    throw new DNSValidationError(
      'DNSKEY record must have a valid algorithm',
      'INVALID_DNSKEY_ALGORITHM',
      'algorithm',
      record.algorithm
    );
  }

  // Validate public key
  if (!record.publicKey || typeof record.publicKey !== 'string') {
    throw new DNSValidationError(
      'DNSKEY record must have a valid publicKey',
      'INVALID_DNSKEY_PUBLIC_KEY',
      'publicKey',
      record.publicKey
    );
  }

  // Public key should be base64-encoded
  if (!/^[A-Za-z0-9+/]+=*$/.test(record.publicKey)) {
    throw new DNSValidationError(
      'DNSKEY publicKey must be base64-encoded',
      'INVALID_DNSKEY_PUBLIC_KEY_FORMAT',
      'publicKey',
      record.publicKey
    );
  }

  return {
    flags: record.flags,
    protocol: record.protocol,
    algorithm: record.algorithm,
    publicKey: record.publicKey,
  };
}

/**
 * Validates a DS record
 */
export function validateDS(record: any): DSRecord {
  if (!record || typeof record !== 'object') {
    throw new DNSValidationError(
      'DS record must be an object',
      'INVALID_DS_STRUCTURE'
    );
  }

  // Validate key tag
  if (
    !Number.isInteger(record.keyTag) ||
    record.keyTag < 0 ||
    record.keyTag > 65535
  ) {
    throw new DNSValidationError(
      'DS keyTag must be between 0 and 65535',
      'INVALID_DS_KEY_TAG',
      'keyTag',
      record.keyTag
    );
  }

  // Validate algorithm
  if (
    !Number.isInteger(record.algorithm) ||
    record.algorithm < 1 ||
    record.algorithm > 16
  ) {
    throw new DNSValidationError(
      'DS record must have a valid algorithm',
      'INVALID_DS_ALGORITHM',
      'algorithm',
      record.algorithm
    );
  }

  // Validate digest type
  if (
    !Number.isInteger(record.digestType) ||
    record.digestType < 1 ||
    record.digestType > 4
  ) {
    throw new DNSValidationError(
      'DS digestType must be between 1 and 4',
      'INVALID_DS_DIGEST_TYPE',
      'digestType',
      record.digestType
    );
  }

  // Validate digest
  if (!record.digest || typeof record.digest !== 'string') {
    throw new DNSValidationError(
      'DS record must have a valid digest',
      'INVALID_DS_DIGEST',
      'digest',
      record.digest
    );
  }

  // Digest should be hexadecimal
  if (!/^[0-9a-fA-F]+$/.test(record.digest)) {
    throw new DNSValidationError(
      'DS digest must be hexadecimal',
      'INVALID_DS_DIGEST_FORMAT',
      'digest',
      record.digest
    );
  }

  // Validate digest length based on digest type
  const expectedLengths: { [key: number]: number } = {
    1: 40, // SHA-1: 20 bytes = 40 hex chars
    2: 64, // SHA-256: 32 bytes = 64 hex chars
    3: 64, // GOST: 32 bytes = 64 hex chars
    4: 96, // SHA-384: 48 bytes = 96 hex chars
  };

  const expectedLength = expectedLengths[record.digestType];
  if (expectedLength && record.digest.length !== expectedLength) {
    throw new DNSValidationError(
      `DS digest length must be ${expectedLength} characters for digest type ${record.digestType}`,
      'INVALID_DS_DIGEST_LENGTH',
      'digest',
      record.digest
    );
  }

  return {
    keyTag: record.keyTag,
    algorithm: record.algorithm,
    digestType: record.digestType,
    digest: record.digest,
  };
}

/**
 * Validates an NSEC record
 */
export function validateNSEC(record: any): NSECRecord {
  if (!record || typeof record !== 'object') {
    throw new DNSValidationError(
      'NSEC record must be an object',
      'INVALID_NSEC_STRUCTURE'
    );
  }

  // Validate next domain name
  if (!record.nextDomainName || typeof record.nextDomainName !== 'string') {
    throw new DNSValidationError(
      'NSEC record must have a valid nextDomainName',
      'INVALID_NSEC_NEXT_DOMAIN',
      'nextDomainName',
      record.nextDomainName
    );
  }

  // Basic domain name validation
  if (!/^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.?$/.test(record.nextDomainName)) {
    throw new DNSValidationError(
      'NSEC nextDomainName must be a valid domain name',
      'INVALID_NSEC_DOMAIN_FORMAT',
      'nextDomainName',
      record.nextDomainName
    );
  }

  // Validate types
  if (!Array.isArray(record.types)) {
    throw new DNSValidationError(
      'NSEC types must be an array',
      'INVALID_NSEC_TYPES',
      'types',
      record.types
    );
  }

  const validTypes = [
    'A',
    'NS',
    'MD',
    'MF',
    'CNAME',
    'SOA',
    'MB',
    'MG',
    'MR',
    'NULL',
    'WKS',
    'PTR',
    'HINFO',
    'MINFO',
    'MX',
    'TXT',
    'RP',
    'AFSDB',
    'X25',
    'ISDN',
    'RT',
    'NSAP',
    'NSAP-PTR',
    'SIG',
    'KEY',
    'PX',
    'GPOS',
    'AAAA',
    'LOC',
    'NXT',
    'EID',
    'NIMLOC',
    'SRV',
    'ATMA',
    'NAPTR',
    'KX',
    'CERT',
    'A6',
    'DNAME',
    'SINK',
    'OPT',
    'APL',
    'DS',
    'SSHFP',
    'IPSECKEY',
    'RRSIG',
    'NSEC',
    'DNSKEY',
    'DHCID',
    'NSEC3',
    'NSEC3PARAM',
    'TLSA',
    'HIP',
    'NINFO',
    'RKEY',
    'TALINK',
    'CDS',
    'CDNSKEY',
    'OPENPGPKEY',
    'CSYNC',
    'ZONEMD',
    'SVCB',
    'HTTPS',
  ];

  for (const type of record.types) {
    if (typeof type !== 'string' || !validTypes.includes(type)) {
      throw new DNSValidationError(
        `NSEC type "${type}" is not a valid DNS record type`,
        'INVALID_NSEC_TYPE',
        'types',
        type
      );
    }
  }

  return {
    nextDomainName: record.nextDomainName,
    types: record.types,
  };
}

/**
 * Validates an NSEC3 record
 */
export function validateNSEC3(record: any): NSEC3Record {
  if (!record || typeof record !== 'object') {
    throw new DNSValidationError(
      'NSEC3 record must be an object',
      'INVALID_NSEC3_STRUCTURE'
    );
  }

  // Validate hash algorithm (SHA-1 is specified by RFC but is weak)
  if (!Number.isInteger(record.hashAlgorithm) || record.hashAlgorithm !== 1) {
    throw new DNSValidationError(
      'NSEC3 hashAlgorithm must be 1 (SHA-1)',
      'INVALID_NSEC3_HASH_ALGORITHM',
      'hashAlgorithm',
      record.hashAlgorithm
    );
  }

  // Validate flags
  if (
    !Number.isInteger(record.flags) ||
    record.flags < 0 ||
    record.flags > 255
  ) {
    throw new DNSValidationError(
      'NSEC3 flags must be between 0 and 255',
      'INVALID_NSEC3_FLAGS',
      'flags',
      record.flags
    );
  }

  // Validate iterations
  if (
    !Number.isInteger(record.iterations) ||
    record.iterations < 0 ||
    record.iterations > 65535
  ) {
    throw new DNSValidationError(
      'NSEC3 iterations must be between 0 and 65535',
      'INVALID_NSEC3_ITERATIONS',
      'iterations',
      record.iterations
    );
  }

  // Validate salt
  if (typeof record.salt !== 'string') {
    throw new DNSValidationError(
      'NSEC3 salt must be a string',
      'INVALID_NSEC3_SALT_TYPE',
      'salt',
      record.salt
    );
  }

  if (record.salt !== '-' && !/^[0-9a-fA-F]*$/.test(record.salt)) {
    throw new DNSValidationError(
      'NSEC3 salt must be hexadecimal or "-" for no salt',
      'INVALID_NSEC3_SALT_FORMAT',
      'salt',
      record.salt
    );
  }

  // Validate next hashed owner name
  if (
    !record.nextHashedOwnerName ||
    typeof record.nextHashedOwnerName !== 'string'
  ) {
    throw new DNSValidationError(
      'NSEC3 record must have a valid nextHashedOwnerName',
      'INVALID_NSEC3_NEXT_HASHED_NAME',
      'nextHashedOwnerName',
      record.nextHashedOwnerName
    );
  }

  // Should be base32-encoded
  if (!/^[A-Z2-7]+=*$/.test(record.nextHashedOwnerName)) {
    throw new DNSValidationError(
      'NSEC3 nextHashedOwnerName must be base32-encoded',
      'INVALID_NSEC3_NEXT_HASHED_FORMAT',
      'nextHashedOwnerName',
      record.nextHashedOwnerName
    );
  }

  // Validate types (same as NSEC)
  if (!Array.isArray(record.types)) {
    throw new DNSValidationError(
      'NSEC3 types must be an array',
      'INVALID_NSEC3_TYPES',
      'types',
      record.types
    );
  }

  const validTypes = [
    'A',
    'NS',
    'MD',
    'MF',
    'CNAME',
    'SOA',
    'MB',
    'MG',
    'MR',
    'NULL',
    'WKS',
    'PTR',
    'HINFO',
    'MINFO',
    'MX',
    'TXT',
    'RP',
    'AFSDB',
    'X25',
    'ISDN',
    'RT',
    'NSAP',
    'NSAP-PTR',
    'SIG',
    'KEY',
    'PX',
    'GPOS',
    'AAAA',
    'LOC',
    'NXT',
    'EID',
    'NIMLOC',
    'SRV',
    'ATMA',
    'NAPTR',
    'KX',
    'CERT',
    'A6',
    'DNAME',
    'SINK',
    'OPT',
    'APL',
    'DS',
    'SSHFP',
    'IPSECKEY',
    'RRSIG',
    'NSEC',
    'DNSKEY',
    'DHCID',
    'NSEC3',
    'NSEC3PARAM',
    'TLSA',
    'HIP',
    'NINFO',
    'RKEY',
    'TALINK',
    'CDS',
    'CDNSKEY',
    'OPENPGPKEY',
    'CSYNC',
    'ZONEMD',
    'SVCB',
    'HTTPS',
  ];

  for (const type of record.types) {
    if (typeof type !== 'string' || !validTypes.includes(type)) {
      throw new DNSValidationError(
        `NSEC3 type "${type}" is not a valid DNS record type`,
        'INVALID_NSEC3_TYPE',
        'types',
        type
      );
    }
  }

  return {
    hashAlgorithm: record.hashAlgorithm,
    flags: record.flags,
    iterations: record.iterations,
    salt: record.salt,
    nextHashedOwnerName: record.nextHashedOwnerName,
    types: record.types,
  };
}

/**
 * Validates an NSEC3PARAM record
 */
export function validateNSEC3PARAM(record: any): NSEC3PARAMRecord {
  if (!record || typeof record !== 'object') {
    throw new DNSValidationError(
      'NSEC3PARAM record must be an object',
      'INVALID_NSEC3PARAM_STRUCTURE'
    );
  }

  // Validate hash algorithm (SHA-1 is specified by RFC but is weak)
  if (!Number.isInteger(record.hashAlgorithm) || record.hashAlgorithm !== 1) {
    throw new DNSValidationError(
      'NSEC3PARAM hashAlgorithm must be 1 (SHA-1)',
      'INVALID_NSEC3PARAM_HASH_ALGORITHM',
      'hashAlgorithm',
      record.hashAlgorithm
    );
  }

  // Validate flags
  if (
    !Number.isInteger(record.flags) ||
    record.flags < 0 ||
    record.flags > 255
  ) {
    throw new DNSValidationError(
      'NSEC3PARAM flags must be between 0 and 255',
      'INVALID_NSEC3PARAM_FLAGS',
      'flags',
      record.flags
    );
  }

  // Validate iterations
  if (
    !Number.isInteger(record.iterations) ||
    record.iterations < 0 ||
    record.iterations > 65535
  ) {
    throw new DNSValidationError(
      'NSEC3PARAM iterations must be between 0 and 65535',
      'INVALID_NSEC3PARAM_ITERATIONS',
      'iterations',
      record.iterations
    );
  }

  // Validate salt
  if (typeof record.salt !== 'string') {
    throw new DNSValidationError(
      'NSEC3PARAM salt must be a string',
      'INVALID_NSEC3PARAM_SALT_TYPE',
      'salt',
      record.salt
    );
  }

  if (record.salt !== '-' && !/^[0-9a-fA-F]*$/.test(record.salt)) {
    throw new DNSValidationError(
      'NSEC3PARAM salt must be hexadecimal or "-" for no salt',
      'INVALID_NSEC3PARAM_SALT_FORMAT',
      'salt',
      record.salt
    );
  }

  return {
    hashAlgorithm: record.hashAlgorithm,
    flags: record.flags,
    iterations: record.iterations,
    salt: record.salt,
  };
}

/**
 * Calculates DNSKEY key tag (RFC 4034 Appendix B)
 */
export function calculateKeyTag(dnskey: DNSKEYRecord): number {
  // This is a simplified implementation
  // In a real implementation, you would need to properly encode the DNSKEY
  // and calculate the key tag according to RFC 4034

  const data = `${dnskey.flags}${dnskey.protocol}${dnskey.algorithm}${dnskey.publicKey}`;
  let tag = 0;

  for (let i = 0; i < data.length; i++) {
    if (i % 2 === 0) {
      tag += data.charCodeAt(i) << 8;
    } else {
      tag += data.charCodeAt(i);
    }
  }

  tag += (tag >> 16) & 0xffff;
  return tag & 0xffff;
}

/**
 * Checks if a DNSSEC algorithm is recommended for use
 */
export function isRecommendedAlgorithm(algorithm: DNSSECAlgorithm): boolean {
  const recommended = [
    DNSSECAlgorithm.RSASHA256,
    DNSSECAlgorithm.RSASHA512,
    DNSSECAlgorithm.ECDSAP256SHA256,
    DNSSECAlgorithm.ECDSAP384SHA384,
    DNSSECAlgorithm.ED25519,
    DNSSECAlgorithm.ED448,
  ];

  return recommended.includes(algorithm);
}

/**
 * Checks if a digest algorithm is recommended for use
 */
export function isRecommendedDigestAlgorithm(
  algorithm: DigestAlgorithm
): boolean {
  const recommended = [DigestAlgorithm.SHA256, DigestAlgorithm.SHA384];

  return recommended.includes(algorithm);
}

/**
 * Validates DNSSEC signature timestamps
 */
export function validateSignatureTimestamps(
  inception: number,
  expiration: number,
  clockSkew: number = 300
): boolean {
  const now = Math.floor(Date.now() / 1000);

  // Check if signature is not yet valid (with clock skew tolerance)
  if (now < inception - clockSkew) {
    return false;
  }

  // Check if signature has expired (with clock skew tolerance)
  if (now > expiration + clockSkew) {
    return false;
  }

  return true;
}
