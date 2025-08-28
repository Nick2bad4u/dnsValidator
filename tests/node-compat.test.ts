import { normalizeSOA, normalizeTLSA, fromNodeTxt, toNodeTxt, fromNodeResolveAny } from '../src/node-compat';
import { isSOARecord, isTLSARecord, isANYRecord, isTXTRecord } from '../src/validators';
import { NodeDNSErrorCodes, isNodeDNSErrorCode } from '../src/errors';

describe('Node compatibility helpers', () => {
  test('SOA normalization adds aliases', () => {
    const soa = normalizeSOA({
      type: 'SOA',
      nsname: 'ns1.example.com',
      hostmaster: 'admin.example.com',
      serial: 1,
      refresh: 10,
      retry: 5,
      expire: 100,
      minttl: 50,
    });
    expect(isSOARecord(soa)).toBe(true);
    expect(soa.primary).toBe('ns1.example.com');
    expect(soa.admin).toBe('admin.example.com');
  });

  test('TLSA normalization adds aliases', () => {
    const tlsa = normalizeTLSA({
      type: 'TLSA',
      certUsage: 3,
      selector: 1,
      match: 1,
      data: 'abcdef',
    });
    expect(isTLSARecord(tlsa)).toBe(true);
    expect(tlsa.usage).toBe(3);
    expect(tlsa.certificate).toBe('abcdef');
  });

  test('TXT conversion round trip', () => {
    const nodeShape = [['part1', 'part2']];
    const internal = fromNodeTxt(nodeShape, 300);
    expect(internal.length).toBe(1);
    expect(isTXTRecord(internal[0])).toBe(true);
    const back = toNodeTxt(internal);
    expect(back).toEqual(nodeShape);
  });

  test('ANY conversion', () => {
    const anyArr = [
      { type: 'A', address: '1.2.3.4', ttl: 100 },
      { type: 'CNAME', value: 'example.com' },
    ];
    const anyRecord = fromNodeResolveAny(anyArr);
    expect(isANYRecord(anyRecord)).toBe(true);
    expect(anyRecord.records?.length).toBe(2);
  });

  test('Error codes integrity', () => {
    // Spot check some codes
    expect(NodeDNSErrorCodes.NODATA).toBe('NODATA');
    expect(NodeDNSErrorCodes.CANCELLED).toBe('CANCELLED');
    // Guard
    expect(isNodeDNSErrorCode('NOTFOUND')).toBe(true);
    expect(isNodeDNSErrorCode('FAKE_CODE')).toBe(false);
  });
});
