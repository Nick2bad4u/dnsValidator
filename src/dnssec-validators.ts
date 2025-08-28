import validator from 'validator';
import {
  DNSKEYRecord,
  DSRecord,
  NSECRecord,
  NSEC3Record,
  RRSIGRecord,
  SSHFPRecord,
} from './types';
import { isValidTTL, isValidHexString } from './utils';

/**
 * Helper function to safely cast unknown to a record type
 */
function toRecord(obj: unknown): Record<string, unknown> {
  return obj as Record<string, unknown>;
}

/**
 * Validates DNSSEC algorithm numbers
 */
function isValidDNSSECAlgorithm(algorithm: number): boolean {
  // Valid DNSSEC algorithm numbers (as per IANA registry)
  const validAlgorithms = [1, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16];
  return Number.isInteger(algorithm) && validAlgorithms.includes(algorithm);
}

/**
 * Validates digest type numbers for DS records
 */
function isValidDigestType(digestType: number): boolean {
  // Valid digest types: 1 (SHA-1), 2 (SHA-256), 3 (GOST R 34.11-94), 4 (SHA-384)
  return Number.isInteger(digestType) && digestType >= 1 && digestType <= 4;
}

/**
 * Validates hash algorithm for NSEC3
 */
function isValidHashAlgorithm(algorithm: number): boolean {
  // Currently only SHA-1 (1) is defined
  return algorithm === 1;
}

/**
 * Validates SSH algorithm numbers
 */
function isValidSSHAlgorithm(algorithm: number): boolean {
  // Valid SSH algorithms: 1 (RSA), 2 (DSS), 3 (ECDSA), 4 (Ed25519), 6 (Ed448)
  const validAlgorithms = [1, 2, 3, 4, 6];
  return Number.isInteger(algorithm) && validAlgorithms.includes(algorithm);
}

/**
 * Validates SSH fingerprint types
 */
function isValidSSHFingerprintType(fpType: number): boolean {
  // Valid fingerprint types: 1 (SHA-1), 2 (SHA-256)
  return fpType === 1 || fpType === 2;
}

/**
 * Validates a DNSKEY record
 */
export function isDNSKEYRecord(record: unknown): record is DNSKEYRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = toRecord(record);

  return (
    r['type'] === 'DNSKEY' &&
    typeof r['flags'] === 'number' &&
    Number.isInteger(r['flags']) &&
    r['flags'] >= 0 &&
    r['flags'] <= 65535 &&
    typeof r['protocol'] === 'number' &&
    r['protocol'] === 3 && // Must be 3 for DNSSEC
    typeof r['algorithm'] === 'number' &&
    isValidDNSSECAlgorithm(r['algorithm']) &&
    typeof r['publicKey'] === 'string' &&
    isValidHexString(r['publicKey']) &&
    (r['ttl'] === undefined || isValidTTL(r['ttl'] as number))
  );
}

/**
 * Validates a DS record
 */
export function isDSRecord(record: unknown): record is DSRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = toRecord(record);

  return (
    r['type'] === 'DS' &&
    typeof r['keyTag'] === 'number' &&
    Number.isInteger(r['keyTag']) &&
    r['keyTag'] >= 0 &&
    r['keyTag'] <= 65535 &&
    typeof r['algorithm'] === 'number' &&
    isValidDNSSECAlgorithm(r['algorithm']) &&
    typeof r['digestType'] === 'number' &&
    isValidDigestType(r['digestType']) &&
    typeof r['digest'] === 'string' &&
    isValidHexString(r['digest']) &&
    (r['ttl'] === undefined || isValidTTL(r['ttl'] as number))
  );
}

/**
 * Validates an NSEC record
 */
export function isNSECRecord(record: unknown): record is NSECRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = toRecord(record);

  return (
    r['type'] === 'NSEC' &&
    typeof r['nextDomainName'] === 'string' &&
    validator.isFQDN(r['nextDomainName'], { require_tld: true }) &&
    Array.isArray(r['typeBitMaps']) &&
    r['typeBitMaps'].every((type: unknown) => typeof type === 'string') &&
    (r['ttl'] === undefined || isValidTTL(r['ttl'] as number))
  );
}

/**
 * Validates an NSEC3 record
 */
export function isNSEC3Record(record: unknown): record is NSEC3Record {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = toRecord(record);

  return (
    r['type'] === 'NSEC3' &&
    typeof r['hashAlgorithm'] === 'number' &&
    isValidHashAlgorithm(r['hashAlgorithm']) &&
    typeof r['flags'] === 'number' &&
    Number.isInteger(r['flags']) &&
    r['flags'] >= 0 &&
    r['flags'] <= 255 &&
    typeof r['iterations'] === 'number' &&
    Number.isInteger(r['iterations']) &&
    r['iterations'] >= 0 &&
    r['iterations'] <= 65535 &&
    typeof r['salt'] === 'string' &&
    (r['salt'] === '' || isValidHexString(r['salt'])) &&
    typeof r['nextHashedOwnerName'] === 'string' &&
    Array.isArray(r['typeBitMaps']) &&
    r['typeBitMaps'].every((type: unknown) => typeof type === 'string') &&
    (r['ttl'] === undefined || isValidTTL(r['ttl'] as number))
  );
}

/**
 * Validates an RRSIG record
 */
export function isRRSIGRecord(record: unknown): record is RRSIGRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = toRecord(record);

  return (
    r['type'] === 'RRSIG' &&
    typeof r['typeCovered'] === 'string' &&
    typeof r['algorithm'] === 'number' &&
    isValidDNSSECAlgorithm(r['algorithm']) &&
    typeof r['labels'] === 'number' &&
    Number.isInteger(r['labels']) &&
    r['labels'] >= 0 &&
    r['labels'] <= 255 &&
    typeof r['originalTTL'] === 'number' &&
    isValidTTL(r['originalTTL']) &&
    typeof r['signatureExpiration'] === 'number' &&
    Number.isInteger(r['signatureExpiration']) &&
    r['signatureExpiration'] >= 0 &&
    typeof r['signatureInception'] === 'number' &&
    Number.isInteger(r['signatureInception']) &&
    r['signatureInception'] >= 0 &&
    typeof r['keyTag'] === 'number' &&
    Number.isInteger(r['keyTag']) &&
    r['keyTag'] >= 0 &&
    r['keyTag'] <= 65535 &&
    typeof r['signerName'] === 'string' &&
    validator.isFQDN(r['signerName'], { require_tld: true }) &&
    typeof r['signature'] === 'string' &&
    isValidHexString(r['signature']) &&
    (r['ttl'] === undefined || isValidTTL(r['ttl'] as number))
  );
}

/**
 * Validates an SSHFP record
 */
export function isSSHFPRecord(record: unknown): record is SSHFPRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = toRecord(record);

  return (
    r['type'] === 'SSHFP' &&
    typeof r['algorithm'] === 'number' &&
    isValidSSHAlgorithm(r['algorithm']) &&
    typeof r['fpType'] === 'number' &&
    isValidSSHFingerprintType(r['fpType']) &&
    typeof r['fingerprint'] === 'string' &&
    isValidHexString(r['fingerprint']) &&
    (r['ttl'] === undefined || isValidTTL(r['ttl'] as number))
  );
}
