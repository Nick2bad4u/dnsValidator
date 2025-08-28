import {
  validateRRSIG,
  validateDNSKEY,
  validateDS,
  validateNSEC,
  validateNSEC3,
  validateNSEC3PARAM,
  DigestAlgorithm,
} from '../src/dnssec';
import { DNSValidationError } from '../src/errors';

function expectError(fn: () => any, code?: string) {
  try {
    fn();
    throw new Error('Expected error');
  } catch (e) {
    if (!(e instanceof DNSValidationError)) throw e;
    if (code) expect(e.code).toBe(code);
  }
}

describe('DNSSEC additional negative branches', () => {
  test('RRSIG field errors', () => {
    expectError(() => validateRRSIG(null as any), 'INVALID_RRSIG_STRUCTURE');
    expectError(() => validateRRSIG({}), 'INVALID_RRSIG_TYPE_COVERED');
    expectError(
      () => validateRRSIG({ typeCovered: 'A' }),
      'INVALID_RRSIG_ALGORITHM'
    );
    expectError(
      () => validateRRSIG({ typeCovered: 'A', algorithm: 8, labels: -1 }),
      'INVALID_RRSIG_LABELS'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: -5,
        }),
      'INVALID_RRSIG_TTL'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: -1,
        }),
      'INVALID_RRSIG_EXPIRATION'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 10,
          signatureInception: -2,
        }),
      'INVALID_RRSIG_INCEPTION'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 10,
          signatureInception: 12,
        }),
      'INVALID_RRSIG_TIMESTAMP_ORDER'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 12,
          signatureInception: 10,
          keyTag: -1,
        }),
      'INVALID_RRSIG_KEY_TAG'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 12,
          signatureInception: 10,
          keyTag: 1,
        }),
      'INVALID_RRSIG_SIGNER_NAME'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 12,
          signatureInception: 10,
          keyTag: 1,
          signerName: 'bad_domain@',
        }),
      'INVALID_RRSIG_SIGNER_FORMAT'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 12,
          signatureInception: 10,
          keyTag: 1,
          signerName: 'example.com',
        }),
      'INVALID_RRSIG_SIGNATURE'
    );
    expectError(
      () =>
        validateRRSIG({
          typeCovered: 'A',
          algorithm: 8,
          labels: 1,
          originalTTL: 30,
          signatureExpiration: 12,
          signatureInception: 10,
          keyTag: 1,
          signerName: 'example.com',
          signature: '***',
        }),
      'INVALID_RRSIG_SIGNATURE_FORMAT'
    );
  });

  test('DNSKEY field errors', () => {
    expectError(() => validateDNSKEY(null as any), 'INVALID_DNSKEY_STRUCTURE');
    expectError(() => validateDNSKEY({}), 'INVALID_DNSKEY_FLAGS');
    expectError(() => validateDNSKEY({ flags: 1 }), 'INVALID_DNSKEY_PROTOCOL');
    expectError(
      () => validateDNSKEY({ flags: 1, protocol: 3 }),
      'INVALID_DNSKEY_ALGORITHM'
    );
    expectError(
      () => validateDNSKEY({ flags: 1, protocol: 3, algorithm: 8 }),
      'INVALID_DNSKEY_PUBLIC_KEY'
    );
    expectError(
      () =>
        validateDNSKEY({
          flags: 1,
          protocol: 3,
          algorithm: 8,
          publicKey: '***',
        }),
      'INVALID_DNSKEY_PUBLIC_KEY_FORMAT'
    );
  });

  test('DS field errors', () => {
    expectError(() => validateDS(null as any), 'INVALID_DS_STRUCTURE');
    expectError(() => validateDS({}), 'INVALID_DS_KEY_TAG');
    expectError(() => validateDS({ keyTag: 1 }), 'INVALID_DS_ALGORITHM');
    expectError(
      () => validateDS({ keyTag: 1, algorithm: 8 }),
      'INVALID_DS_DIGEST_TYPE'
    );
    expectError(
      () => validateDS({ keyTag: 1, algorithm: 8, digestType: 1 }),
      'INVALID_DS_DIGEST'
    );
    expectError(
      () =>
        validateDS({ keyTag: 1, algorithm: 8, digestType: 1, digest: 'zz' }),
      'INVALID_DS_DIGEST_FORMAT'
    );
    // length mismatch for SHA1 (should be 40)
    expectError(
      () =>
        validateDS({
          keyTag: 1,
          algorithm: 8,
          digestType: DigestAlgorithm.SHA1,
          digest: 'a'.repeat(10),
        }),
      'INVALID_DS_DIGEST_LENGTH'
    );
  });

  test('NSEC field errors', () => {
    expectError(() => validateNSEC(null as any), 'INVALID_NSEC_STRUCTURE');
    expectError(() => validateNSEC({}), 'INVALID_NSEC_NEXT_DOMAIN');
    expectError(
      () => validateNSEC({ nextDomainName: 'bad_domain', types: [] }),
      'INVALID_NSEC_DOMAIN_FORMAT'
    );
    expectError(
      () => validateNSEC({ nextDomainName: 'example.com', types: 'X' as any }),
      'INVALID_NSEC_TYPES'
    );
    expectError(
      () =>
        validateNSEC({ nextDomainName: 'example.com', types: ['NOT_A_TYPE'] }),
      'INVALID_NSEC_TYPE'
    );
  });

  test('NSEC3 field errors', () => {
    expectError(() => validateNSEC3(null as any), 'INVALID_NSEC3_STRUCTURE');
    expectError(() => validateNSEC3({}), 'INVALID_NSEC3_HASH_ALGORITHM');
    expectError(
      () => validateNSEC3({ hashAlgorithm: 1 }),
      'INVALID_NSEC3_FLAGS'
    );
    expectError(
      () => validateNSEC3({ hashAlgorithm: 1, flags: 0 }),
      'INVALID_NSEC3_ITERATIONS'
    );
    expectError(
      () => validateNSEC3({ hashAlgorithm: 1, flags: 0, iterations: 0 }),
      'INVALID_NSEC3_SALT_TYPE'
    );
    expectError(
      () =>
        validateNSEC3({
          hashAlgorithm: 1,
          flags: 0,
          iterations: 0,
          salt: 'zz',
        }),
      'INVALID_NSEC3_SALT_FORMAT'
    );
    expectError(
      () =>
        validateNSEC3({
          hashAlgorithm: 1,
          flags: 0,
          iterations: 0,
          salt: '-',
          nextHashedOwnerName: 5,
        }),
      'INVALID_NSEC3_NEXT_HASHED_NAME'
    );
    expectError(
      () =>
        validateNSEC3({
          hashAlgorithm: 1,
          flags: 0,
          iterations: 0,
          salt: '-',
          nextHashedOwnerName: '***',
        }),
      'INVALID_NSEC3_NEXT_HASHED_FORMAT'
    );
    expectError(
      () =>
        validateNSEC3({
          hashAlgorithm: 1,
          flags: 0,
          iterations: 0,
          salt: '-',
          nextHashedOwnerName: 'AAAA',
          types: 'x' as any,
        }),
      'INVALID_NSEC3_TYPES'
    );
    expectError(
      () =>
        validateNSEC3({
          hashAlgorithm: 1,
          flags: 0,
          iterations: 0,
          salt: '-',
          nextHashedOwnerName: 'AAAA',
          types: ['INVALID'],
        }),
      'INVALID_NSEC3_TYPE'
    );
  });

  test('NSEC3PARAM field errors', () => {
    expectError(
      () => validateNSEC3PARAM(null as any),
      'INVALID_NSEC3PARAM_STRUCTURE'
    );
    expectError(
      () => validateNSEC3PARAM({}),
      'INVALID_NSEC3PARAM_HASH_ALGORITHM'
    );
    expectError(
      () => validateNSEC3PARAM({ hashAlgorithm: 1 }),
      'INVALID_NSEC3PARAM_FLAGS'
    );
    expectError(
      () => validateNSEC3PARAM({ hashAlgorithm: 1, flags: 0 }),
      'INVALID_NSEC3PARAM_ITERATIONS'
    );
    expectError(
      () => validateNSEC3PARAM({ hashAlgorithm: 1, flags: 0, iterations: 0 }),
      'INVALID_NSEC3PARAM_SALT_TYPE'
    );
    expectError(
      () =>
        validateNSEC3PARAM({
          hashAlgorithm: 1,
          flags: 0,
          iterations: 0,
          salt: 'zz',
        }),
      'INVALID_NSEC3PARAM_SALT_FORMAT'
    );
  });
});
