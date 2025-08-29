// Importing the module ensures type declarations are compiled and tree-shaken where appropriate.
// This test intentionally has no runtime assertions; it simply confirms the module loads without side effects.
import * as Types from '../src/types';

describe('types module smoke import', () => {
  it('should load exported type definitions object reference', () => {
    expect(typeof Types).toBe('object');
  });
});
