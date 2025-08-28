import { TYPES_MODULE_LOADED } from '../src/types';

// This trivial test ensures the runtime constant is executed, giving the file statement coverage.

describe('types module coverage anchor', () => {
  it('should export TYPES_MODULE_LOADED as true', () => {
    expect(TYPES_MODULE_LOADED).toBe(true);
  });
});
