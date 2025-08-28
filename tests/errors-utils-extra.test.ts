import { isNodeDNSErrorCode } from '../src/errors';
import { isValidDNSRecord, isValidDNSQueryResult } from '../src/utils';

describe('errors & utils extra branches', () => {
  test('isNodeDNSErrorCode valid and invalid', () => {
    expect(isNodeDNSErrorCode('NODATA')).toBe(true);
    expect(isNodeDNSErrorCode('NOT_A_CODE')).toBe(false);
    expect(isNodeDNSErrorCode(123 as any)).toBe(false);
  });

  test('isValidDNSRecord invalid TTL range and invalid type', () => {
    expect(isValidDNSRecord({ type: 'A', ttl: 999999999999 })).toBe(false); // ttl out of range
    expect(isValidDNSRecord({ type: 'UNKNOWN' } as any)).toBe(false); // unsupported type
  });

  test('isValidDNSQueryResult invalid answers entry', () => {
    const bad = {
      question: { name: 'example.com', type: 'A', class: 'IN' },
      answers: [{}, { type: 'A' }],
    } as any;
    expect(isValidDNSQueryResult(bad)).toBe(false);
  });
});
