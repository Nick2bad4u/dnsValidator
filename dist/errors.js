"use strict";
/**
 * Custom error classes for DNS validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorFactory = exports.ValidationContext = exports.InvalidQueryStructureError = exports.MissingRequiredFieldError = exports.InvalidFieldValueError = exports.MalformedRecordError = exports.InvalidRecordTypeError = exports.isNodeDNSErrorCode = exports.NodeDNSErrorCodes = exports.DNSValidationError = void 0;
/**
 * Base class for all DNS validation errors
 */
class DNSValidationError extends Error {
    code;
    field;
    value;
    constructor(message, code, field, value) {
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
exports.DNSValidationError = DNSValidationError;
/**
 * Node.js dns module error code constants (subset) for compatibility.
 * These mirror the standard error codes exposed by the core 'dns' module so that
 * consumers can write portable code when using this library as a validation layer.
 *
 * Source reference: https://nodejs.org/api/dns.html#dns-error-codes
 */
exports.NodeDNSErrorCodes = Object.freeze({
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
});
function isNodeDNSErrorCode(code) {
    return (typeof code === 'string' &&
        Object.values(exports.NodeDNSErrorCodes).includes(code));
}
exports.isNodeDNSErrorCode = isNodeDNSErrorCode;
/**
 * Error thrown when a DNS record type is invalid or unsupported
 */
class InvalidRecordTypeError extends DNSValidationError {
    constructor(recordType) {
        super(`Invalid or unsupported DNS record type: ${String(recordType)}`, 'INVALID_RECORD_TYPE', 'type', recordType);
        this.name = 'InvalidRecordTypeError';
    }
}
exports.InvalidRecordTypeError = InvalidRecordTypeError;
/**
 * Error thrown when a DNS record structure is malformed
 */
class MalformedRecordError extends DNSValidationError {
    constructor(message, field, value) {
        super(message, 'MALFORMED_RECORD', field, value);
        this.name = 'MalformedRecordError';
    }
}
exports.MalformedRecordError = MalformedRecordError;
/**
 * Error thrown when a field value is invalid
 */
class InvalidFieldValueError extends DNSValidationError {
    constructor(field, value, expectedFormat) {
        const message = expectedFormat
            ? `Invalid value for field '${field}': ${String(value)}. Expected: ${expectedFormat}`
            : `Invalid value for field '${field}': ${String(value)}`;
        super(message, 'INVALID_FIELD_VALUE', field, value);
        this.name = 'InvalidFieldValueError';
    }
}
exports.InvalidFieldValueError = InvalidFieldValueError;
/**
 * Error thrown when required fields are missing
 */
class MissingRequiredFieldError extends DNSValidationError {
    constructor(field, recordType) {
        super(`Missing required field '${field}' for ${recordType} record`, 'MISSING_REQUIRED_FIELD', field);
        this.name = 'MissingRequiredFieldError';
    }
}
exports.MissingRequiredFieldError = MissingRequiredFieldError;
/**
 * Error thrown when DNS query structure is invalid
 */
class InvalidQueryStructureError extends DNSValidationError {
    constructor(message, field) {
        super(message, 'INVALID_QUERY_STRUCTURE', field);
        this.name = 'InvalidQueryStructureError';
    }
}
exports.InvalidQueryStructureError = InvalidQueryStructureError;
/**
 * Validation context for tracking field paths and providing better error messages
 */
class ValidationContext {
    path = [];
    errors = [];
    warnings = [];
    suggestions = [];
    enterField(field) {
        this.path.push(field);
    }
    exitField() {
        this.path.pop();
    }
    addError(error) {
        this.errors.push(error);
    }
    addWarning(message) {
        this.warnings.push(message);
    }
    addSuggestion(message) {
        this.suggestions.push(message);
    }
    getCurrentPath() {
        return this.path.length > 0 ? this.path.join('.') : 'root';
    }
    getResult() {
        return {
            isValid: this.errors.length === 0,
            errors: [...this.errors],
            warnings: [...this.warnings],
            suggestions: this.suggestions.length > 0 ? [...this.suggestions] : undefined,
        };
    }
    reset() {
        this.path = [];
        this.errors = [];
        this.warnings = [];
        this.suggestions = [];
    }
}
exports.ValidationContext = ValidationContext;
/**
 * Factory functions for creating validation errors with consistent messaging
 */
exports.ValidationErrorFactory = {
    invalidIPAddress: (address, version) => new InvalidFieldValueError('address', address, `valid IPv${version} address`),
    invalidFQDN: (domain) => new InvalidFieldValueError('value', domain, 'valid FQDN'),
    invalidPort: (port) => new InvalidFieldValueError('port', port, 'integer between 0 and 65535'),
    invalidTTL: (ttl) => new InvalidFieldValueError('ttl', ttl, 'integer between 0 and 2147483647'),
    invalidPriority: (priority) => new InvalidFieldValueError('priority', priority, 'integer between 0 and 65535'),
    invalidWeight: (weight) => new InvalidFieldValueError('weight', weight, 'integer between 0 and 65535'),
    invalidEmail: (email) => new InvalidFieldValueError('admin', email, 'valid email address format'),
    invalidHexString: (value) => new InvalidFieldValueError('certificate', value, 'valid hexadecimal string'),
    missingRequiredField: (field, recordType) => new MissingRequiredFieldError(field, recordType),
    malformedRecord: (message) => new MalformedRecordError(message),
    invalidRecordType: (type) => new InvalidRecordTypeError(type),
};
//# sourceMappingURL=errors.js.map