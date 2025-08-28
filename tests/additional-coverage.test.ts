import { runCLI } from '../src/cli';
import { normalizeTLSA, isNodeTLSAShape } from '../src/node-compat';
import {
  validateRRSIG,
  validateDNSKEY,
  validateDS,
  validateNSEC,
  validateNSEC3,
  validateNSEC3PARAM,
  validateSignatureTimestamps,
} from '../src/dnssec';
// (Removed unused readFileSync import)
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

// Helper to capture CLI without spawning for additional edge cases
function capture(argv: string[]) {
  const originalLog = console.log;
  const originalErr = console.error;
  const originalExit = process.exit;
  const logs: string[] = [];
  const errs: string[] = [];
  let code: number | undefined;
  (console as any).log = (...a: any[]) => logs.push(a.join(' '));
  (console as any).error = (...a: any[]) => errs.push(a.join(' '));
  (process as any).exit = (c?: number) => {
    code = c;
    throw new Error('EXIT');
  };
  try {
    runCLI(argv);
  } catch (e: any) {
    if (e.message !== 'EXIT') throw e;
  } finally {
    console.log = originalLog;
    console.error = originalErr;
    process.exit = originalExit;
  }
  return { logs, errs, code };
}

describe('additional targeted coverage', () => {
  test('cli record malformed json error path', () => {
    const res = capture(['record', '--data', '{bad', '--type', 'A']);
    expect(res.code).toBe(1);
    expect(res.errs.join('\n')).toMatch(/Error:/);
  });

  test('cli query missing input error path', () => {
    const res = capture(['query']);
    expect(res.code).toBe(1);
    expect(
      res.errs.some(e => /Must provide either --data or --file/.test(e))
    ).toBeTruthy();
  });

  test('cli bulk missing file option', () => {
    const res = capture(['bulk']);
    expect(res.code).toBe(1);
    expect(res.errs.some(e => /Must provide --file/.test(e))).toBeTruthy();
  });

  test('cli bulk non array file content', () => {
    const p = join(__dirname, 'not-array.json');
    writeFileSync(p, JSON.stringify({}));
    const res = capture(['bulk', '--file', p]);
    expect(res.code).toBe(1);
    unlinkSync(p);
  });

  test('dnssec failing branches for RRSIG invalid typeCovered', () => {
    expect(() => validateRRSIG({} as any)).toThrow(
      /RRSIG record must be an object|typeCovered/
    );
    expect(() => validateRRSIG({ typeCovered: 5 } as any)).toThrow(
      /typeCovered/
    );
  });

  test('dnssec failing DNSKEY algorithm & public key format', () => {
    expect(() =>
      validateDNSKEY({
        flags: 1,
        protocol: 3,
        algorithm: 99,
        publicKey: 'AAAA',
      } as any)
    ).toThrow(/algorithm/);
    expect(() =>
      validateDNSKEY({
        flags: 1,
        protocol: 3,
        algorithm: 8,
        publicKey: '*bad*',
      } as any)
    ).toThrow(/publicKey must be base64/);
  });

  test('dnssec DS digest length error', () => {
    expect(() =>
      validateDS({
        keyTag: 1,
        algorithm: 8,
        digestType: 2,
        digest: 'abcd',
      } as any)
    ).toThrow(/digest length/);
  });

  test('dnssec NSEC invalid type entry', () => {
    expect(() =>
      validateNSEC({
        nextDomainName: 'example.com',
        types: ['A', 'NOPE'],
      } as any)
    ).toThrow(/NSEC type/);
  });

  test('dnssec NSEC3 salt format & types invalid', () => {
    expect(() =>
      validateNSEC3({
        hashAlgorithm: 1,
        flags: 0,
        iterations: 0,
        salt: 'zz',
        nextHashedOwnerName: 'AAAA',
        types: [],
      } as any)
    ).toThrow(/salt must be hexadecimal/);
    expect(() =>
      validateNSEC3({
        hashAlgorithm: 1,
        flags: 0,
        iterations: 0,
        salt: '-',
        nextHashedOwnerName: '!!!!',
        types: [],
      } as any)
    ).toThrow(/nextHashedOwnerName/);
  });

  test('dnssec NSEC3PARAM salt format error', () => {
    expect(() =>
      validateNSEC3PARAM({
        hashAlgorithm: 1,
        flags: 0,
        iterations: 0,
        salt: 'gg',
      } as any)
    ).toThrow(/salt must be hexadecimal/);
  });

  test('dnssec signature timestamps future/past invalid', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(validateSignatureTimestamps(now + 10000, now + 20000)).toBe(false); // inception too far in future
    expect(validateSignatureTimestamps(now - 20000, now - 10000)).toBe(false); // expired
  });

  test('node-compat TLSA normalization ArrayBuffer/Uint8Array paths', () => {
    const ab = new ArrayBuffer(4);
    const view = new Uint8Array(ab);
    const rec: any = {
      type: 'TLSA',
      certUsage: 1,
      selector: 0,
      match: 1,
      data: view,
    };
    expect(isNodeTLSAShape(rec)).toBe(true);
    const normalized = normalizeTLSA({
      type: 'TLSA',
      usage: 1,
      selector: 0,
      matchingType: 1,
      certificate: 'abcd',
    } as any);
    expect(normalized.certUsage).toBe(1);
  });
});
