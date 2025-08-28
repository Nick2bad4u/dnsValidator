import { __testGetCachedRegex } from '../src/performance';

describe('Performance regex cache coverage', () => {
  it('creates new regex on first request and reuses on second', () => {
    const first = __testGetCachedRegex('^abc$', 'i');
    const second = __testGetCachedRegex('^abc$', 'i');
    expect(first).toBe(second);
  });
});
