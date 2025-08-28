/**
 * Custom error classes for DNS validation
 */

/**
 * Base class for all DNS validation errors
 */
export class DNSValidationError extends Error {
  public readonly code: string;
  public readonly field: string | undefined;
  public readonly value: unknown;

  constructor(message: string, code: string, field?: string, value?: unknown) {
    super(message);
    this.name = 'DNSValidationError';
    this.code = code;
    this.field = field;
    this.value = value;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DNSValidationError);
    }
  }
}

/**
 * Node.js dns module error code constants (subset) for compatibility.
 * These mirror the standard error codes exposed by the core 'dns' module so that
 * consumers can write portable code when using this library as a validation layer.
 *
 * Source reference: https://nodejs.org/api/dns.html#dns-error-codes
 */
export const NodeDNSErrorCodes = Object.freeze({
  NODATA: 'NODATA',
  FORMERR: 'FORMERR',
  SERVFAIL: 'SERVFAIL',
  NOTFOUND: 'NOTFOUND',
  NOTIMP: 'NOTIMP',
  REFUSED: 'REFUSED',
  BADQUERY: 'BADQUERY',
  BADNAME: 'BADNAME',
  BADFAMILY: 'BADFAMILY',
  BADRESP: 'BADRESP',
  CONNREFUSED: 'CONNREFUSED',
  TIMEOUT: 'TIMEOUT',
  EOF: 'EOF',
  FILE: 'FILE',
  NOMEM: 'NOMEM',
  DESTRUCTION: 'DESTRUCTION',
  BADSTR: 'BADSTR',
  BADFLAGS: 'BADFLAGS',
  NONAME: 'NONAME',
  BADHINTS: 'BADHINTS',
  NOTINITIALIZED: 'NOTINITIALIZED',
  LOADIPHLPAPI: 'LOADIPHLPAPI',
  ADDRGETNETWORKPARAMS: 'ADDRGETNETWORKPARAMS',
  CANCELLED: 'CANCELLED',
} as const);

export type NodeDNSErrorCode = typeof NodeDNSErrorCodes[keyof typeof NodeDNSErrorCodes];

export function isNodeDNSErrorCode(code: unknown): code is NodeDNSErrorCode {
  return typeof code === 'string' && Object.values(NodeDNSErrorCodes).includes(code as any);
}

/**
 * Error thrown when a DNS record type is invalid or unsupported
 */
export class InvalidRecordTypeError extends DNSValidationError {
  constructor(recordType: unknown) {
    super(
      `Invalid or unsupported DNS record type: ${String(recordType)}`,
      'INVALID_RECORD_TYPE',
      'type',
      recordType
    );
    this.name = 'InvalidRecordTypeError';
  }
}

/**
 * Error thrown when a DNS record structure is malformed
 */
export class MalformedRecordError extends DNSValidationError {
  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'MALFORMED_RECORD', field, value);
    this.name = 'MalformedRecordError';
  }
}

/**
 * Error thrown when a field value is invalid
 */
export class InvalidFieldValueError extends DNSValidationError {
  constructor(field: string, value: unknown, expectedFormat?: string) {
    const message = expectedFormat
      ? `Invalid value for field '${field}': ${String(value)}. Expected: ${expectedFormat}`
      : `Invalid value for field '${field}': ${String(value)}`;

    super(message, 'INVALID_FIELD_VALUE', field, value);
    this.name = 'InvalidFieldValueError';
  }
}

/**
 * Error thrown when required fields are missing
 */
export class MissingRequiredFieldError extends DNSValidationError {
  constructor(field: string, recordType: string) {
    super(
      `Missing required field '${field}' for ${recordType} record`,
      'MISSING_REQUIRED_FIELD',
      field
    );
    this.name = 'MissingRequiredFieldError';
  }
}

/**
 * Error thrown when DNS query structure is invalid
 */
export class InvalidQueryStructureError extends DNSValidationError {
  constructor(message: string, field?: string) {
    super(message, 'INVALID_QUERY_STRUCTURE', field);
    this.name = 'InvalidQueryStructureError';
  }
}

/**
 * Enhanced validation result with detailed error information
 */
export interface DetailedValidationResult {
  isValid: boolean;
  errors: DNSValidationError[];
  warnings: string[];
  suggestions: string[] | undefined;
}

/**
 * Validation context for tracking field paths and providing better error messages
 */
export class ValidationContext {
  private path: string[] = [];
  private errors: DNSValidationError[] = [];
  private warnings: string[] = [];
  private suggestions: string[] = [];

  public enterField(field: string): void {
    this.path.push(field);
  }

  public exitField(): void {
    this.path.pop();
  }

  public addError(error: DNSValidationError): void {
    this.errors.push(error);
  }

  public addWarning(message: string): void {
    this.warnings.push(message);
  }

  public addSuggestion(message: string): void {
    this.suggestions.push(message);
  }

  public getCurrentPath(): string {
    return this.path.length > 0 ? this.path.join('.') : 'root';
  }

  public getResult(): DetailedValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
      suggestions:
        this.suggestions.length > 0 ? [...this.suggestions] : undefined,
    };
  }

  public reset(): void {
    this.path = [];
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }
}

/**
 * Factory functions for creating validation errors with consistent messaging
 */
export const ValidationErrorFactory = {
  invalidIPAddress: (address: string, version: 4 | 6): InvalidFieldValueError =>
    new InvalidFieldValueError(
      'address',
      address,
      `valid IPv${version} address`
    ),

  invalidFQDN: (domain: string): InvalidFieldValueError =>
    new InvalidFieldValueError('value', domain, 'valid FQDN'),

  invalidPort: (port: number): InvalidFieldValueError =>
    new InvalidFieldValueError('port', port, 'integer between 0 and 65535'),

  invalidTTL: (ttl: number): InvalidFieldValueError =>
    new InvalidFieldValueError('ttl', ttl, 'integer between 0 and 2147483647'),

  invalidPriority: (priority: number): InvalidFieldValueError =>
    new InvalidFieldValueError(
      'priority',
      priority,
      'integer between 0 and 65535'
    ),

  invalidWeight: (weight: number): InvalidFieldValueError =>
    new InvalidFieldValueError('weight', weight, 'integer between 0 and 65535'),

  invalidEmail: (email: string): InvalidFieldValueError =>
    new InvalidFieldValueError('admin', email, 'valid email address format'),

  invalidHexString: (value: string): InvalidFieldValueError =>
    new InvalidFieldValueError(
      'certificate',
      value,
      'valid hexadecimal string'
    ),

  missingRequiredField: (
    field: string,
    recordType: string
  ): MissingRequiredFieldError =>
    new MissingRequiredFieldError(field, recordType),

  malformedRecord: (message: string): MalformedRecordError =>
    new MalformedRecordError(message),

  invalidRecordType: (type: unknown): InvalidRecordTypeError =>
    new InvalidRecordTypeError(type),
} as const;
