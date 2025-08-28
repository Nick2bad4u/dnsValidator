import { normalizeSOA, normalizeTLSA, toANYRecord, isNodeSOAShape, isNodeTLSAShape, fromNodeTxt, toNodeTxt } from '../src/node-compat';
import { isSOARecord, isTLSARecord } from '../src/validators';

describe('node-compat alias branch coverage', () => {
  test('SOA normalization when only primary/admin provided', () => {
    const soa = normalizeSOA({
      type: 'SOA',
      primary: 'ns1.example.com',
      admin: 'admin.example.com',
      serial: 1,
      refresh: 10,
      retry: 5,
      expiration: 100,
      minimum: 50,
    } as any);
    expect(isSOARecord(soa)).toBe(true);
    expect(soa.nsname).toBe('ns1.example.com');
    expect(soa.hostmaster).toBe('admin.example.com');
    expect(isNodeSOAShape(soa)).toBe(true);
  });
  test('SOA normalization when only nsname/hostmaster provided', () => {
    const soa = normalizeSOA({
      type: 'SOA',
      nsname: 'ns2.example.com',
      hostmaster: 'hostmaster.example.com',
      serial: 2,
      refresh: 20,
      retry: 10,
      expire: 200,
      minttl: 60,
    } as any);
    expect(isSOARecord(soa)).toBe(true);
    expect(soa.primary).toBe('ns2.example.com');
    expect(soa.admin).toBe('hostmaster.example.com');
    expect(isNodeSOAShape(soa)).toBe(true);
  });
  test('TLSA normalization when only usage/matchingType/certificate provided', () => {
    const tlsa = normalizeTLSA({ type: 'TLSA', usage: 3, selector: 1, matchingType: 1, certificate: 'abcd' } as any);
    expect(isTLSARecord(tlsa)).toBe(true);
    expect(tlsa.certUsage).toBe(3);
    expect(tlsa.match).toBe(1);
    expect(tlsa.data).toBe('abcd');
    expect(isNodeTLSAShape(tlsa)).toBe(true);
  });
  test('TLSA normalization when only certUsage/match/data provided', () => {
    const tlsa = normalizeTLSA({ type: 'TLSA', certUsage: 2, selector: 0, match: 2, data: 'ef01' } as any);
    expect(isTLSARecord(tlsa)).toBe(true);
    expect(tlsa.usage).toBe(2);
    expect(tlsa.matchingType).toBe(2);
    expect(tlsa.certificate).toBe('ef01');
    expect(isNodeTLSAShape(tlsa)).toBe(true);
  });
  test('toANYRecord simple passthrough', () => {
    const anyRec = toANYRecord([{ type: 'A', address: '1.1.1.1' } as any]);
    expect(anyRec.type).toBe('ANY');
    expect(anyRec.records && anyRec.records.length).toBe(1);
  });
  test('fromNodeTxt and toNodeTxt roundtrip with ttl branch plus no-ttl branch', () => {
    const input = [['v=spf1', 'include:example.com'], ['~all']];
    const internalWithTTL = fromNodeTxt(input, 3600);
    expect(internalWithTTL.every(r => (r as any).ttl === 3600)).toBe(true);
    const backWithTTL = toNodeTxt(internalWithTTL);
    expect(backWithTTL).toEqual(input);

    const internalNoTTL = fromNodeTxt(input);
    expect(internalNoTTL.every(r => (r as any).ttl === undefined)).toBe(true);
    const backNoTTL = toNodeTxt(internalNoTTL);
    expect(backNoTTL).toEqual(input);
  });
});
