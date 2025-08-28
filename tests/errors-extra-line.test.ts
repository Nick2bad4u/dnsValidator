import { DNSValidationError } from '../src/errors';

describe('Errors extra line coverage', () => {
  it('constructs DNSValidationError with value to cover value assignment', () => {
    const err = new DNSValidationError('msg', 'CODE', 'field', 123);
    expect(err.value).toBe(123);
    expect(err.code).toBe('CODE');
  });
});
