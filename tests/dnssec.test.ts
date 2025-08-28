import { isDNSKEYRecord } from '../src/dnssec-validators';

describe('DNSSEC basic sanity', () => {
  test('isDNSKEYRecord rejects invalid input', () => {
    expect(isDNSKEYRecord({} as any)).toBe(false);
  });
});
