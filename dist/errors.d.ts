/**
 * Custom error classes for DNS validation
 */
/**
 * Base class for all DNS validation errors
 */
export declare class DNSValidationError extends Error {
    readonly code: string;
    readonly field: string | undefined;
    readonly value: unknown;
    constructor(message: string, code: string, field?: string, value?: unknown);
}
/**
 * Node.js dns module error code constants (subset) for compatibility.
 * These mirror the standard error codes exposed by the core 'dns' module so that
 * consumers can write portable code when using this library as a validation layer.
 *
 * Source reference: https://nodejs.org/api/dns.html#dns-error-codes
 */
export declare const NodeDNSErrorCodes: Readonly<{
    readonly NODATA: "NODATA";
    readonly FORMERR: "FORMERR";
    readonly SERVFAIL: "SERVFAIL";
    readonly NOTFOUND: "NOTFOUND";
    readonly NOTIMP: "NOTIMP";
    readonly REFUSED: "REFUSED";
    readonly BADQUERY: "BADQUERY";
    readonly BADNAME: "BADNAME";
    readonly BADFAMILY: "BADFAMILY";
    readonly BADRESP: "BADRESP";
    readonly CONNREFUSED: "CONNREFUSED";
    readonly TIMEOUT: "TIMEOUT";
    readonly EOF: "EOF";
    readonly FILE: "FILE";
    readonly NOMEM: "NOMEM";
    readonly DESTRUCTION: "DESTRUCTION";
    readonly BADSTR: "BADSTR";
    readonly BADFLAGS: "BADFLAGS";
    readonly NONAME: "NONAME";
    readonly BADHINTS: "BADHINTS";
    readonly NOTINITIALIZED: "NOTINITIALIZED";
    readonly LOADIPHLPAPI: "LOADIPHLPAPI";
    readonly ADDRGETNETWORKPARAMS: "ADDRGETNETWORKPARAMS";
    readonly CANCELLED: "CANCELLED";
}>;
export type NodeDNSErrorCode = (typeof NodeDNSErrorCodes)[keyof typeof NodeDNSErrorCodes];
export declare function isNodeDNSErrorCode(code: unknown): code is NodeDNSErrorCode;
/**
 * Error thrown when a DNS record type is invalid or unsupported
 */
export declare class InvalidRecordTypeError extends DNSValidationError {
    constructor(recordType: unknown);
}
/**
 * Error thrown when a DNS record structure is malformed
 */
export declare class MalformedRecordError extends DNSValidationError {
    constructor(message: string, field?: string, value?: unknown);
}
/**
 * Error thrown when a field value is invalid
 */
export declare class InvalidFieldValueError extends DNSValidationError {
    constructor(field: string, value: unknown, expectedFormat?: string);
}
/**
 * Error thrown when required fields are missing
 */
export declare class MissingRequiredFieldError extends DNSValidationError {
    constructor(field: string, recordType: string);
}
/**
 * Error thrown when DNS query structure is invalid
 */
export declare class InvalidQueryStructureError extends DNSValidationError {
    constructor(message: string, field?: string);
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
export declare class ValidationContext {
    private path;
    private errors;
    private warnings;
    private suggestions;
    enterField(field: string): void;
    exitField(): void;
    addError(error: DNSValidationError): void;
    addWarning(message: string): void;
    addSuggestion(message: string): void;
    getCurrentPath(): string;
    getResult(): DetailedValidationResult;
    reset(): void;
}
/**
 * Factory functions for creating validation errors with consistent messaging
 */
export declare const ValidationErrorFactory: {
    readonly invalidIPAddress: (address: string, version: 4 | 6) => InvalidFieldValueError;
    readonly invalidFQDN: (domain: string) => InvalidFieldValueError;
    readonly invalidPort: (port: number) => InvalidFieldValueError;
    readonly invalidTTL: (ttl: number) => InvalidFieldValueError;
    readonly invalidPriority: (priority: number) => InvalidFieldValueError;
    readonly invalidWeight: (weight: number) => InvalidFieldValueError;
    readonly invalidEmail: (email: string) => InvalidFieldValueError;
    readonly invalidHexString: (value: string) => InvalidFieldValueError;
    readonly missingRequiredField: (field: string, recordType: string) => MissingRequiredFieldError;
    readonly malformedRecord: (message: string) => MalformedRecordError;
    readonly invalidRecordType: (type: unknown) => InvalidRecordTypeError;
};
//# sourceMappingURL=errors.d.ts.map