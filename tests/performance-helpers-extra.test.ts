import {
  fastPreValidate,
  getRequiredField,
  getOptionalField,
  isValidRecordType,
  isPlainObject,
} from '../src/performance';

describe('performance helpers extra branches', () => {
  test('fastPreValidate returns false on empty or non-string', () => {
    expect(fastPreValidate('', 'ipv4')).toBe(false);
    expect(fastPreValidate('999.999.999.999', 'ipv4')).toBe(false); // fails regex
  });

  test('fastPreValidate returns null on pass-through', () => {
    expect(fastPreValidate('192.168.1.1', 'ipv4')).toBeNull();
  });

  test('getRequiredField object mismatch and success', () => {
    const obj: any = { a: 5, b: { x: 1 }, c: [] };
    expect(getRequiredField<number>(obj, 'a', 'number')).toBe(5);
    expect(
      getRequiredField<Record<string, unknown>>(obj, 'b', 'object')
    ).toEqual({ x: 1 });
    // c is array -> not plain object -> null
    expect(
      getRequiredField<Record<string, unknown>>(obj, 'c', 'object')
    ).toBeNull();
    expect(getRequiredField<any>(obj, 'missing', 'string')).toBeNull();
  });

  test('getOptionalField undefined, null mismatch, success', () => {
    const obj: any = { a: 'hello', b: { y: 2 }, c: [] };
    expect(getOptionalField<string>(obj, 'a', 'string')).toBe('hello');
    expect(
      getOptionalField<Record<string, unknown>>(obj, 'b', 'object')
    ).toEqual({ y: 2 });
    expect(
      getOptionalField<Record<string, unknown>>(obj, 'c', 'object')
    ).toBeNull();
    expect(getOptionalField<string>(obj, 'missing', 'string')).toBeUndefined();
  });

  test('isValidRecordType negative and positive', () => {
    expect(isValidRecordType('A')).toBe(true);
    expect(isValidRecordType('UNKNOWN')).toBe(false);
    expect(isValidRecordType(123 as any)).toBe(false);
  });

  test('isPlainObject negative cases', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
  });
});
