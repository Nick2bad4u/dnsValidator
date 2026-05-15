/**
 * Performance optimizations for DNS validation
 */

import type { UnknownRecord } from "type-fest";

import { isDefined, isInteger, keyIn, setHas } from "ts-extras";

import type { DNSRecordType } from "./types";

/**
 * Cache for compiled regular expressions to avoid recompilation
 */
const regexCache = new Map<string, RegExp>();

/**
 * Get a cached regular expression or create and cache it
 */
function getCachedRegex(pattern: string, flags?: string): RegExp {
    const key = `${pattern}:${flags ?? ""}`;
    if (!regexCache.has(key)) {
        regexCache.set(key, new RegExp(pattern, flags));
    }
    return regexCache.get(key)!;
}

/**
 * Test hook for exercising cache miss/hit branches.
 *
 * @internal
 */
export const testGetCachedRegex = (pattern: string, flags?: string): RegExp =>
    getCachedRegex(pattern, flags);

/**
 * Name of a precompiled validation pattern.
 */
export type ValidationPatternName = "email" | "fqdn" | "hex" | "ipv4";

/**
 * Pre-compiled regex patterns for common validations.
 */
export const ValidationPatterns: Readonly<
    Record<ValidationPatternName, RegExp>
> = {
    // Email pattern for SOA admin field
    email: getCachedRegex(String.raw`^[^@]+@[^@]+\.[^@]+$`),

    // Basic FQDN pattern (more permissive, final validation with library)
    fqdn: getCachedRegex(
        String.raw`^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?))*$`
    ),

    // Hexadecimal string pattern
    hex: getCachedRegex("^[0-9a-fA-F]+$"),

    // IPv4 address pattern (more permissive, final validation with library)
    ipv4: getCachedRegex(
        String.raw`^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$`
    ),
};

/**
 * Fast pre-validation using regex patterns Returns null if validation should
 * proceed, or false if definitely invalid
 */
export function fastPreValidate(
    value: string,
    pattern: ValidationPatternName
): boolean | null {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }

    const regex = ValidationPatterns[pattern];
    if (regex && !regex.test(value)) {
        return false;
    }

    // Passed pre-validation, proceed with full validation
    return null;
}

/**
 * Optimized field access for optional fields
 */
export function getOptionalField<T>(
    obj: UnknownRecord,
    field: string,
    expectedType: "boolean" | "number" | "object" | "string"
): null | T | undefined {
    const value = obj[field];

    if (!isDefined(value)) {
        return undefined;
    }

    if (expectedType === "object") {
        return isPlainObject(value) ? (value as T) : null;
    }

    return typeof value === expectedType ? (value as T) : null;
}

/**
 * Optimized field access with type checking
 */
export function getRequiredField<T>(
    obj: UnknownRecord,
    field: string,
    expectedType: "boolean" | "number" | "object" | "string"
): null | T {
    const value = obj[field];

    if (!isDefined(value)) {
        return null;
    }

    if (expectedType === "object") {
        return isPlainObject(value) ? (value as T) : null;
    }

    return typeof value === expectedType ? (value as T) : null;
}

/**
 * Optimized type checking with early returns
 */
export function isPlainObject(value: unknown): value is UnknownRecord {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

function isSuccessfulValidationResult(
    value: unknown
): value is { readonly isValid: true } {
    return (
        isPlainObject(value) &&
        keyIn(value, "isValid") &&
        value["isValid"] === true
    );
}

/**
 * Fast integer range validation
 */
export function isValidIntegerInRange(
    value: unknown,
    min: number,
    max: number
): value is number {
    return (
        typeof value === "number" &&
        isInteger(value) &&
        value >= min &&
        value <= max
    );
}

/**
 * Record type validation cache
 */
const validRecordTypes = new Set<DNSRecordType>([
    "A",
    "AAAA",
    "ANY",
    "CAA",
    "CNAME",
    "DNSKEY",
    "DS",
    "MX",
    "NAPTR",
    "NS",
    "NSEC",
    "NSEC3",
    "PTR",
    "RRSIG",
    "SOA",
    "SRV",
    "SSHFP",
    "TLSA",
    "TXT",
]);

/**
 * Validation performance metrics
 */
export interface ValidationMetrics {
    averageTimeMs: number;
    cacheHits: number;
    cacheMisses: number;
    successfulValidations: number;
    totalValidations: number;
}

/**
 * Performance tracking for validation operations
 */
export class ValidationPerformanceTracker {
    private metrics: ValidationMetrics = {
        averageTimeMs: 0,
        cacheHits: 0,
        cacheMisses: 0,
        successfulValidations: 0,
        totalValidations: 0,
    };

    private totalTime = 0;

    public getMetrics(): ValidationMetrics {
        return { ...this.metrics };
    }

    public recordCacheHit(): void {
        this.metrics.cacheHits++;
    }

    public recordCacheMiss(): void {
        this.metrics.cacheMisses++;
    }

    public recordSuccess(): void {
        this.metrics.successfulValidations++;
    }

    public reset(): void {
        this.metrics = {
            averageTimeMs: 0,
            cacheHits: 0,
            cacheMisses: 0,
            successfulValidations: 0,
            totalValidations: 0,
        };
        this.totalTime = 0;
    }

    public startValidation(): () => void {
        const start = performance.now();

        return () => {
            const duration = performance.now() - start;
            this.recordValidation(duration);
        };
    }

    private recordValidation(durationMs: number): void {
        this.metrics.totalValidations++;
        this.totalTime += durationMs;
        this.metrics.averageTimeMs =
            this.totalTime / this.metrics.totalValidations;
    }
}

/**
 * Fast record type validation
 */
export function isValidRecordType(type: unknown): type is DNSRecordType {
    return typeof type === "string" && setHas(validRecordTypes, type);
}

/**
 * Global performance tracker instance
 */
export const globalPerformanceTracker: ValidationPerformanceTracker =
    new ValidationPerformanceTracker();

/**
 * Decorator for tracking validation performance
 */
export function trackPerformance<Arguments extends unknown[], Return>(
    validationFn: (...args: Arguments) => Return,
    tracker: ValidationPerformanceTracker = globalPerformanceTracker
): (...args: Arguments) => Return {
    return (...args: Arguments): Return => {
        const endTracking = tracker.startValidation();
        try {
            const result = validationFn(...args);
            if (isSuccessfulValidationResult(result)) {
                tracker.recordSuccess();
            }
            return result;
        } finally {
            endTracking();
        }
    };
}
