/**
 * Custom error classes for DNS validation
 */

/**
 * Base class for all DNS validation errors
 */
import type { ValueOf } from "type-fest";

import { arrayIncludes, arrayJoin, isEmpty, objectValues } from "ts-extras";

/**
 * Base class for all DNS validation errors.
 */
export class DNSValidationError extends Error {
    public readonly code: string;
    public readonly field: string | undefined;
    public readonly value: unknown;

    constructor(
        message: string,
        code: string,
        field?: string,
        value?: unknown
    ) {
        super(message);
        this.name = "DNSValidationError";
        this.code = code;
        this.field = field;
        this.value = value;
    }
}

/**
 * Node.js dns module error code constants (subset) for compatibility. These
 * mirror the standard error codes exposed by the core 'dns' module so that
 * consumers can write portable code when using this library as a validation
 * layer.
 *
 * Source reference: https://nodejs.org/api/dns.html#dns-error-codes
 */
/**
 * Map of Node.js DNS error code names to their string values.
 */
export type NodeDNSErrorCodeMap = Readonly<{
    ADDRGETNETWORKPARAMS: "ADDRGETNETWORKPARAMS";
    BADFAMILY: "BADFAMILY";
    BADFLAGS: "BADFLAGS";
    BADHINTS: "BADHINTS";
    BADNAME: "BADNAME";
    BADQUERY: "BADQUERY";
    BADRESP: "BADRESP";
    BADSTR: "BADSTR";
    CANCELLED: "CANCELLED";
    CONNREFUSED: "CONNREFUSED";
    DESTRUCTION: "DESTRUCTION";
    EOF: "EOF";
    FILE: "FILE";
    FORMERR: "FORMERR";
    LOADIPHLPAPI: "LOADIPHLPAPI";
    NODATA: "NODATA";
    NOMEM: "NOMEM";
    NONAME: "NONAME";
    NOTFOUND: "NOTFOUND";
    NOTIMP: "NOTIMP";
    NOTINITIALIZED: "NOTINITIALIZED";
    REFUSED: "REFUSED";
    SERVFAIL: "SERVFAIL";
    TIMEOUT: "TIMEOUT";
}>;

/**
 * Node.js DNS error code constants keyed by code name.
 */
export const NodeDNSErrorCodes: NodeDNSErrorCodeMap = Object.freeze({
    ADDRGETNETWORKPARAMS: "ADDRGETNETWORKPARAMS",
    BADFAMILY: "BADFAMILY",
    BADFLAGS: "BADFLAGS",
    BADHINTS: "BADHINTS",
    BADNAME: "BADNAME",
    BADQUERY: "BADQUERY",
    BADRESP: "BADRESP",
    BADSTR: "BADSTR",
    CANCELLED: "CANCELLED",
    CONNREFUSED: "CONNREFUSED",
    DESTRUCTION: "DESTRUCTION",
    EOF: "EOF",
    FILE: "FILE",
    FORMERR: "FORMERR",
    LOADIPHLPAPI: "LOADIPHLPAPI",
    NODATA: "NODATA",
    NOMEM: "NOMEM",
    NONAME: "NONAME",
    NOTFOUND: "NOTFOUND",
    NOTIMP: "NOTIMP",
    NOTINITIALIZED: "NOTINITIALIZED",
    REFUSED: "REFUSED",
    SERVFAIL: "SERVFAIL",
    TIMEOUT: "TIMEOUT",
} as const);

/**
 * Enhanced validation result with detailed error information
 */
export interface DetailedValidationResult {
    errors: DNSValidationError[];
    isValid: boolean;
    suggestions: string[] | undefined;
    warnings: string[];
}

/**
 * DNS error code emitted by Node's dns module.
 */
export type NodeDNSErrorCode = ValueOf<typeof NodeDNSErrorCodes>;

/**
 * Error thrown when a field value is invalid
 */
export class InvalidFieldValueError extends DNSValidationError {
    constructor(field: string, value: unknown, expectedFormat?: string) {
        const message = expectedFormat
            ? `Invalid value for field '${field}': ${String(value)}. Expected: ${expectedFormat}`
            : `Invalid value for field '${field}': ${String(value)}`;

        super(message, "INVALID_FIELD_VALUE", field, value);
        this.name = "InvalidFieldValueError";
    }
}

/**
 * Error thrown when DNS query structure is invalid
 */
export class InvalidQueryStructureError extends DNSValidationError {
    constructor(message: string, field?: string) {
        super(message, "INVALID_QUERY_STRUCTURE", field);
        this.name = "InvalidQueryStructureError";
    }
}

/**
 * Error thrown when a DNS record type is invalid or unsupported
 */
export class InvalidRecordTypeError extends DNSValidationError {
    constructor(recordType: unknown) {
        super(
            `Invalid or unsupported DNS record type: ${String(recordType)}`,
            "INVALID_RECORD_TYPE",
            "type",
            recordType
        );
        this.name = "InvalidRecordTypeError";
    }
}

/**
 * Error thrown when a DNS record structure is malformed
 */
export class MalformedRecordError extends DNSValidationError {
    constructor(message: string, field?: string, value?: unknown) {
        super(message, "MALFORMED_RECORD", field, value);
        this.name = "MalformedRecordError";
    }
}

/**
 * Error thrown when required fields are missing
 */
export class MissingRequiredFieldError extends DNSValidationError {
    constructor(field: string, recordType: string) {
        super(
            `Missing required field '${field}' for ${recordType} record`,
            "MISSING_REQUIRED_FIELD",
            field
        );
        this.name = "MissingRequiredFieldError";
    }
}

/**
 * Validation context for tracking field paths and providing better error
 * messages
 */
export class ValidationContext {
    private errors: DNSValidationError[] = [];
    private path: string[] = [];
    private suggestions: string[] = [];
    private warnings: string[] = [];

    public addError(error: DNSValidationError): void {
        this.errors.push(error);
    }

    public addSuggestion(message: string): void {
        this.suggestions.push(message);
    }

    public addWarning(message: string): void {
        this.warnings.push(message);
    }

    public enterField(field: string): void {
        this.path.push(field);
    }

    public exitField(): void {
        this.path.pop();
    }

    public getCurrentPath(): string {
        return this.path.length > 0 ? arrayJoin(this.path, ".") : "root";
    }

    public getResult(): DetailedValidationResult {
        return {
            errors: [...this.errors],
            isValid: isEmpty(this.errors),
            suggestions:
                this.suggestions.length > 0 ? [...this.suggestions] : undefined,
            warnings: [...this.warnings],
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
 * Checks whether a value is one of Node's dns module error codes.
 */
export function isNodeDNSErrorCode(code: unknown): code is NodeDNSErrorCode {
    return (
        typeof code === "string" &&
        arrayIncludes(objectValues(NodeDNSErrorCodes), code)
    );
}

/**
 * Factory functions for creating validation errors with consistent messaging
 */
export const ValidationErrorFactory = {
    invalidEmail: (email: string): InvalidFieldValueError =>
        new InvalidFieldValueError(
            "admin",
            email,
            "valid email address format"
        ),

    invalidFQDN: (domain: string): InvalidFieldValueError =>
        new InvalidFieldValueError("value", domain, "valid FQDN"),

    invalidHexString: (value: string): InvalidFieldValueError =>
        new InvalidFieldValueError(
            "certificate",
            value,
            "valid hexadecimal string"
        ),

    invalidIPAddress: (
        address: string,
        version: 4 | 6
    ): InvalidFieldValueError =>
        new InvalidFieldValueError(
            "address",
            address,
            `valid IPv${version} address`
        ),

    invalidPort: (port: number): InvalidFieldValueError =>
        new InvalidFieldValueError("port", port, "integer between 0 and 65535"),

    invalidPriority: (priority: number): InvalidFieldValueError =>
        new InvalidFieldValueError(
            "priority",
            priority,
            "integer between 0 and 65535"
        ),

    invalidRecordType: (type: unknown): InvalidRecordTypeError =>
        new InvalidRecordTypeError(type),

    invalidTTL: (ttl: number): InvalidFieldValueError =>
        new InvalidFieldValueError(
            "ttl",
            ttl,
            "integer between 0 and 2147483647"
        ),

    invalidWeight: (weight: number): InvalidFieldValueError =>
        new InvalidFieldValueError(
            "weight",
            weight,
            "integer between 0 and 65535"
        ),

    malformedRecord: (message: string): MalformedRecordError =>
        new MalformedRecordError(message),

    missingRequiredField: (
        field: string,
        recordType: string
    ): MissingRequiredFieldError =>
        new MissingRequiredFieldError(field, recordType),
} as const;
