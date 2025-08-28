import {
  DNSValidationError,
  InvalidRecordTypeError,
  MalformedRecordError,
  InvalidFieldValueError,
  MissingRequiredFieldError,
  InvalidQueryStructureError,
  ValidationContext,
  ValidationErrorFactory,
} from '../src/errors';

describe('DNSValidationError', () => {
  it('should create error with basic properties', () => {
    const error = new DNSValidationError('Test message', 'TEST_CODE');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DNSValidationError);
    expect(error.name).toBe('DNSValidationError');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.field).toBeUndefined();
    expect(error.value).toBeUndefined();
  });

  it('should create error with field and value', () => {
    const error = new DNSValidationError(
      'Invalid value',
      'INVALID_VALUE',
      'address',
      '192.168.1.1'
    );

    expect(error.field).toBe('address');
    expect(error.value).toBe('192.168.1.1');
  });

  it('should maintain proper stack trace', () => {
    const error = new DNSValidationError('Test', 'TEST');
    expect(error.stack).toBeDefined();
  });
});

describe('InvalidRecordTypeError', () => {
  it('should create error for invalid record type', () => {
    const error = new InvalidRecordTypeError('INVALID');

    expect(error).toBeInstanceOf(DNSValidationError);
    expect(error.name).toBe('InvalidRecordTypeError');
    expect(error.code).toBe('INVALID_RECORD_TYPE');
    expect(error.field).toBe('type');
    expect(error.value).toBe('INVALID');
    expect(error.message).toBe(
      'Invalid or unsupported DNS record type: INVALID'
    );
  });

  it('should handle null record type', () => {
    const error = new InvalidRecordTypeError(null);
    expect(error.message).toBe('Invalid or unsupported DNS record type: null');
  });

  it('should handle undefined record type', () => {
    const error = new InvalidRecordTypeError(undefined);
    expect(error.message).toBe(
      'Invalid or unsupported DNS record type: undefined'
    );
  });
});

describe('MalformedRecordError', () => {
  it('should create error for malformed record', () => {
    const error = new MalformedRecordError('Missing required field: address');

    expect(error).toBeInstanceOf(DNSValidationError);
    expect(error.name).toBe('MalformedRecordError');
    expect(error.code).toBe('MALFORMED_RECORD');
    expect(error.message).toBe('Missing required field: address');
  });

  it('should create error with field and value', () => {
    const error = new MalformedRecordError(
      'Invalid structure',
      'type',
      'INVALID'
    );

    expect(error.field).toBe('type');
    expect(error.value).toBe('INVALID');
  });
});

describe('InvalidFieldValueError', () => {
  it('should create error for invalid field value', () => {
    const error = new InvalidFieldValueError('address', '999.999.999.999');

    expect(error).toBeInstanceOf(DNSValidationError);
    expect(error.name).toBe('InvalidFieldValueError');
    expect(error.code).toBe('INVALID_FIELD_VALUE');
    expect(error.field).toBe('address');
    expect(error.value).toBe('999.999.999.999');
    expect(error.message).toBe(
      "Invalid value for field 'address': 999.999.999.999"
    );
  });

  it('should create error with expected format', () => {
    const error = new InvalidFieldValueError(
      'address',
      '999.999.999.999',
      'valid IPv4 address'
    );

    expect(error.message).toBe(
      "Invalid value for field 'address': 999.999.999.999. Expected: valid IPv4 address"
    );
  });
});

describe('MissingRequiredFieldError', () => {
  it('should create error for missing field', () => {
    const error = new MissingRequiredFieldError('address', 'A');

    expect(error).toBeInstanceOf(DNSValidationError);
    expect(error.name).toBe('MissingRequiredFieldError');
    expect(error.code).toBe('MISSING_REQUIRED_FIELD');
    expect(error.field).toBe('address');
    expect(error.message).toBe("Missing required field 'address' for A record");
  });
});

describe('InvalidQueryStructureError', () => {
  it('should create error for invalid query structure', () => {
    const error = new InvalidQueryStructureError('Missing question section');

    expect(error).toBeInstanceOf(DNSValidationError);
    expect(error.name).toBe('InvalidQueryStructureError');
    expect(error.code).toBe('INVALID_QUERY_STRUCTURE');
    expect(error.message).toBe('Missing question section');
  });

  it('should create error with field', () => {
    const error = new InvalidQueryStructureError(
      'Invalid field type',
      'answers'
    );

    expect(error.field).toBe('answers');
  });
});

describe('ValidationContext', () => {
  let context: ValidationContext;

  beforeEach(() => {
    context = new ValidationContext();
  });

  it('should create empty validation context', () => {
    expect(context.getCurrentPath()).toBe('root');
    expect(context.getResult().isValid).toBe(true);
    expect(context.getResult().errors).toEqual([]);
    expect(context.getResult().warnings).toEqual([]);
  });

  it('should track field paths', () => {
    context.enterField('answers');
    expect(context.getCurrentPath()).toBe('answers');

    context.enterField('0');
    expect(context.getCurrentPath()).toBe('answers.0');

    context.enterField('address');
    expect(context.getCurrentPath()).toBe('answers.0.address');

    context.exitField();
    expect(context.getCurrentPath()).toBe('answers.0');
  });

  it('should add errors', () => {
    const error = new DNSValidationError('Test error', 'TEST');
    context.addError(error);

    const result = context.getResult();
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toBe(error);
  });

  it('should add warnings', () => {
    context.addWarning('Test warning');

    const result = context.getResult();
    expect(result.isValid).toBe(true);
    expect(result.warnings).toEqual(['Test warning']);
  });

  it('should add suggestions', () => {
    context.addSuggestion('Test suggestion');

    const result = context.getResult();
    expect(result.suggestions).toEqual(['Test suggestion']);
  });

  it('should reset context', () => {
    context.enterField('test');
    context.addError(new DNSValidationError('Error', 'CODE'));
    context.addWarning('Warning');
    context.addSuggestion('Suggestion');

    context.reset();

    expect(context.getCurrentPath()).toBe('root');
    const result = context.getResult();
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.suggestions).toBeUndefined();
  });
});

describe('ValidationErrorFactory', () => {
  it('should create invalid IP address error', () => {
    const error = ValidationErrorFactory.invalidIPAddress('999.999.999.999', 4);

    expect(error).toBeInstanceOf(InvalidFieldValueError);
    expect(error.field).toBe('address');
    expect(error.value).toBe('999.999.999.999');
    expect(error.message).toBe(
      "Invalid value for field 'address': 999.999.999.999. Expected: valid IPv4 address"
    );
  });

  it('should create invalid IPv6 address error', () => {
    const error = ValidationErrorFactory.invalidIPAddress('invalid::ipv6', 6);
    expect(error.message).toBe(
      "Invalid value for field 'address': invalid::ipv6. Expected: valid IPv6 address"
    );
  });

  it('should create invalid FQDN error', () => {
    const error = ValidationErrorFactory.invalidFQDN('invalid..domain');

    expect(error).toBeInstanceOf(InvalidFieldValueError);
    expect(error.field).toBe('value');
    expect(error.value).toBe('invalid..domain');
    expect(error.message).toBe(
      "Invalid value for field 'value': invalid..domain. Expected: valid FQDN"
    );
  });

  it('should create invalid port error', () => {
    const error = ValidationErrorFactory.invalidPort(70000);

    expect(error.field).toBe('port');
    expect(error.value).toBe(70000);
    expect(error.message).toBe(
      "Invalid value for field 'port': 70000. Expected: integer between 0 and 65535"
    );
  });

  it('should create invalid TTL error', () => {
    const error = ValidationErrorFactory.invalidTTL(-1);

    expect(error.field).toBe('ttl');
    expect(error.value).toBe(-1);
    expect(error.message).toBe(
      "Invalid value for field 'ttl': -1. Expected: integer between 0 and 2147483647"
    );
  });

  it('should create invalid priority error', () => {
    const error = ValidationErrorFactory.invalidPriority(70000);

    expect(error.field).toBe('priority');
    expect(error.value).toBe(70000);
  });

  it('should create invalid weight error', () => {
    const error = ValidationErrorFactory.invalidWeight(70000);

    expect(error.field).toBe('weight');
    expect(error.value).toBe(70000);
  });

  it('should create invalid email error', () => {
    const error = ValidationErrorFactory.invalidEmail('invalid-email');

    expect(error.field).toBe('admin');
    expect(error.value).toBe('invalid-email');
    expect(error.message).toBe(
      "Invalid value for field 'admin': invalid-email. Expected: valid email address format"
    );
  });

  it('should create invalid hex string error', () => {
    const error = ValidationErrorFactory.invalidHexString('invalid-hex');

    expect(error.field).toBe('certificate');
    expect(error.value).toBe('invalid-hex');
    expect(error.message).toBe(
      "Invalid value for field 'certificate': invalid-hex. Expected: valid hexadecimal string"
    );
  });

  it('should create missing required field error', () => {
    const error = ValidationErrorFactory.missingRequiredField('address', 'A');

    expect(error).toBeInstanceOf(MissingRequiredFieldError);
    expect(error.field).toBe('address');
    expect(error.message).toBe("Missing required field 'address' for A record");
  });

  it('should create malformed record error', () => {
    const error = ValidationErrorFactory.malformedRecord('Invalid structure');

    expect(error).toBeInstanceOf(MalformedRecordError);
    expect(error.message).toBe('Invalid structure');
  });

  it('should create invalid record type error', () => {
    const error = ValidationErrorFactory.invalidRecordType('INVALID');

    expect(error).toBeInstanceOf(InvalidRecordTypeError);
    expect(error.value).toBe('INVALID');
  });
});
