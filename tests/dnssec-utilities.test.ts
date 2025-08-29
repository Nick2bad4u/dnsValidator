import {
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
} from '../src/dnssec';
import { DNSValidationError } from '../src/errors';

describe('dnssec utilities', () => {
  test('validateRRSIG success', () => {
    const now = Math.floor(Date.now() / 1000);
    const rec = validateRRSIG({
      typeCovered: 'A',
      algorithm: 8,
      labels: 2,
      originalTTL: 300,
      signatureExpiration: now + 3600,
      signatureInception: now - 60,
      keyTag: 12345,
      signerName: 'example.com',
      signature: 'QUJDRA==', // 'ABCD'
    });
    expect(rec.typeCovered).toBe('A');
  });
  test('validateRRSIG invalid timestamp order', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(() =>
      validateRRSIG({
        typeCovered: 'A',
        algorithm: 8,
        labels: 1,
        originalTTL: 10,
        signatureExpiration: now,
        signatureInception: now + 10,
        keyTag: 1,
        signerName: 'example.com',
        signature: 'QUJDRA==',
      })
    ).toThrow(DNSValidationError);
  });
  test('validateDNSKEY success', () => {
    const rec = validateDNSKEY({
      flags: 256,
      protocol: 3,
      algorithm: 8,
      publicKey: 'QUJDRA==',
    });
    expect(rec.algorithm).toBe(8);
  });
  test('validateDNSKEY invalid protocol', () => {
    expect(() =>
      validateDNSKEY({
        flags: 256,
        protocol: 2,
        algorithm: 8,
        publicKey: 'QUJDRA==',
      })
    ).toThrow(DNSValidationError);
  });
  test('validateDS success', () => {
    const rec = validateDS({
      keyTag: 1,
      algorithm: 8,
      digestType: 2,
      digest: 'a'.repeat(64),
    });
    expect(rec.digest.length).toBe(64);
  });
  test('validateDS invalid digest length', () => {
    expect(() =>
      validateDS({ keyTag: 1, algorithm: 8, digestType: 2, digest: 'abc' })
    ).toThrow(DNSValidationError);
  });
  test('validateNSEC success', () => {
    const rec = validateNSEC({
      nextDomainName: 'b.example.com',
      types: ['A', 'NS'],
    });
    // Prefer canonical property
    expect(rec.typeBitMaps.length).toBe(2);
  });
  test('validateNSEC invalid type', () => {
    expect(() =>
      validateNSEC({ nextDomainName: 'b.example.com', types: ['A', 'BADTYPE'] })
    ).toThrow(DNSValidationError);
  });
  test('validateNSEC3 success', () => {
    // Base32 (RFC4648) uppercase chars only, no padding required here
    const rec = validateNSEC3({
      hashAlgorithm: 1,
      flags: 0,
      iterations: 10,
      salt: 'a1b2',
      nextHashedOwnerName: 'ABCDE234',
      types: ['A', 'NS'],
    });
    expect(rec.hashAlgorithm).toBe(1);
  });
  test('validateNSEC3 invalid nextHashedOwnerName format', () => {
    expect(() =>
      validateNSEC3({
        hashAlgorithm: 1,
        flags: 0,
        iterations: 10,
        salt: 'a1b2',
        nextHashedOwnerName: 'invalid$',
        types: ['A'],
      })
    ).toThrow(DNSValidationError);
  });
  test('validateNSEC3PARAM success', () => {
    const rec = validateNSEC3PARAM({
      hashAlgorithm: 1,
      flags: 0,
      iterations: 10,
      salt: 'abcd',
    });
    expect(rec.flags).toBe(0);
  });
  test('validateNSEC3PARAM invalid salt format', () => {
    expect(() =>
      validateNSEC3PARAM({
        hashAlgorithm: 1,
        flags: 0,
        iterations: 10,
        salt: 'zz',
      })
    ).toThrow(DNSValidationError);
  });
  test('calculateKeyTag deterministic', () => {
    const key = {
      type: 'DNSKEY' as const,
      flags: 256,
      protocol: 3,
      algorithm: 8,
      publicKey: 'QUJDRA==',
    };
    const tag1 = calculateKeyTag(key);
    const tag2 = calculateKeyTag(key);
    expect(tag1).toBe(tag2);
  });
  test('isRecommendedAlgorithm true/false cases', () => {
    expect(isRecommendedAlgorithm(DNSSECAlgorithm.RSASHA256)).toBe(true);
    expect(isRecommendedAlgorithm(DNSSECAlgorithm.RSASHA1)).toBe(false);
  });
  test('isRecommendedDigestAlgorithm true/false', () => {
    expect(isRecommendedDigestAlgorithm(DigestAlgorithm.SHA256)).toBe(true);
    expect(isRecommendedDigestAlgorithm(DigestAlgorithm.SHA1)).toBe(false);
  });
  test('validateSignatureTimestamps not yet valid', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(validateSignatureTimestamps(now + 1000, now + 2000)).toBe(false);
  });
  test('validateSignatureTimestamps expired', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(validateSignatureTimestamps(now - 4000, now - 3000)).toBe(false);
  });
  test('validateSignatureTimestamps valid window', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(validateSignatureTimestamps(now - 100, now + 100)).toBe(true);
  });
});
