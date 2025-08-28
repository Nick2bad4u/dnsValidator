import { validateDNSRecord } from '../src/validators';
import {
  getValidationSuggestions,
  validateARecord,
  validateAAAARecord,
  validateMXRecord,
} from '../src/enhanced-validators';
import {
  isCNAMERecord,
  isTXTRecord,
  isNSRecord,
  isPTRRecord,
  isANYRecord,
} from '../src/validators';

describe('Validators extra branches', () => {
  test('validateDNSRecord unsupported type suggestions', () => {
    const result = validateDNSRecord({
      type: 'UNSUPPORTED',
      foo: 'bar',
    } as any);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Unsupported record type'))).toBe(
      true
    );
  });

  test('validateDNSRecord per-type suggestions A', () => {
    const r = validateDNSRecord({ type: 'A', address: '999.0.0.1' } as any);
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('A records require'))).toBe(true);
  });

  test('validateDNSRecord per-type suggestions MX', () => {
    const r = validateDNSRecord({ type: 'MX', priority: 10 } as any);
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('MX records require'))).toBe(true);
  });

  test('getValidationSuggestions covers all switch cases', () => {
    const a = getValidationSuggestions('A');
    const aaaa = getValidationSuggestions('AAAA');
    const mx = getValidationSuggestions('MX');
    const cname = getValidationSuggestions('CNAME');
    const def = getValidationSuggestions('SOMETHINGELSE');
    expect(a.some(s => s.includes('IPv4'))).toBe(true);
    expect(aaaa.some(s => s.includes('IPv6'))).toBe(true);
    expect(mx.some(s => s.includes('priority'))).toBe(true);
    expect(cname.some(s => s.includes('CNAME records'))).toBe(true);
    expect(def.length).toBeGreaterThan(0);
  });

  test('enhanced validators negative TTL branches', () => {
    const aRes = validateARecord({ type: 'A', address: '1.2.3.4', ttl: -5 });
    expect(aRes.isValid).toBe(false);
    const aaaaRes = validateAAAARecord({
      type: 'AAAA',
      address: '::1',
      ttl: 999999999999,
    });
    expect(aaaaRes.isValid).toBe(false);
    const mxRes = validateMXRecord({
      type: 'MX',
      exchange: 'mail.example.com',
      priority: -1,
    });
    expect(mxRes.isValid).toBe(false);
  });
});

describe('validators additional ttl and any array branches', () => {
  test('CNAME invalid ttl branch', () => {
    const rec = { type: 'CNAME', value: 'example.com', ttl: -5 };
    expect(isCNAMERecord(rec)).toBe(false);
  });
  test('TXT invalid ttl branch', () => {
    const rec = { type: 'TXT', entries: ['ok'], ttl: -10 };
    expect(isTXTRecord(rec)).toBe(false);
  });
  test('NS invalid ttl branch', () => {
    const rec = { type: 'NS', value: 'ns1.example.com', ttl: -1 };
    expect(isNSRecord(rec)).toBe(false);
  });
  test('PTR invalid ttl branch', () => {
    const rec = { type: 'PTR', value: 'ptr.example.com', ttl: -2 };
    expect(isPTRRecord(rec)).toBe(false);
  });
  test('ANY records array path valid', () => {
    const rec = {
      type: 'ANY',
      records: [{ type: 'A', address: '1.2.3.4' }],
    } as any;
    expect(isANYRecord(rec)).toBe(true);
  });
  test('ANY records array invalid entry', () => {
    const rec = { type: 'ANY', records: [{ notype: true }] } as any;
    expect(isANYRecord(rec)).toBe(false);
  });
});
