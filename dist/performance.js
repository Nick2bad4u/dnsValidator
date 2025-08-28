"use strict";
/**
 * Performance optimizations for DNS validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackPerformance = exports.globalPerformanceTracker = exports.ValidationPerformanceTracker = exports.isValidRecordType = exports.getOptionalField = exports.getRequiredField = exports.isValidIntegerInRange = exports.isPlainObject = exports.fastPreValidate = exports.ValidationPatterns = exports.__testGetCachedRegex = void 0;
/**
 * Cache for compiled regular expressions to avoid recompilation
 */
const regexCache = new Map();
/**
 * Get a cached regular expression or create and cache it
 */
function getCachedRegex(pattern, flags) {
    const key = `${pattern}:${flags || ''}`;
    if (!regexCache.has(key)) {
        regexCache.set(key, new RegExp(pattern, flags));
    }
    return regexCache.get(key);
}
// Test hook (non-public) to exercise cache miss/hit branches explicitly
// eslint-disable-next-line @typescript-eslint/naming-convention
const __testGetCachedRegex = (pattern, flags) => getCachedRegex(pattern, flags);
exports.__testGetCachedRegex = __testGetCachedRegex;
/**
 * Pre-compiled regex patterns for common validations
 */
exports.ValidationPatterns = {
    // IPv4 address pattern (more permissive, final validation with library)
    ipv4: getCachedRegex('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'),
    // Hexadecimal string pattern
    hex: getCachedRegex('^[0-9a-fA-F]+$'),
    // Basic FQDN pattern (more permissive, final validation with library)
    fqdn: getCachedRegex('^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\\.([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?))*$'),
    // Email pattern for SOA admin field
    email: getCachedRegex('^[^@]+@[^@]+\\.[^@]+$'),
};
/**
 * Fast pre-validation using regex patterns
 * Returns null if validation should proceed, or false if definitely invalid
 */
function fastPreValidate(value, pattern) {
    if (typeof value !== 'string' || value.length === 0) {
        return false;
    }
    const regex = exports.ValidationPatterns[pattern];
    if (regex && !regex.test(value)) {
        return false;
    }
    // Passed pre-validation, proceed with full validation
    return null;
}
exports.fastPreValidate = fastPreValidate;
/**
 * Optimized type checking with early returns
 */
function isPlainObject(value) {
    return (value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype);
}
exports.isPlainObject = isPlainObject;
/**
 * Fast integer range validation
 */
function isValidIntegerInRange(value, min, max) {
    return (typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= min &&
        value <= max);
}
exports.isValidIntegerInRange = isValidIntegerInRange;
/**
 * Optimized field access with type checking
 */
function getRequiredField(obj, field, expectedType) {
    const value = obj[field];
    if (value === undefined) {
        return null;
    }
    if (expectedType === 'object') {
        return isPlainObject(value) ? value : null;
    }
    return typeof value === expectedType ? value : null;
}
exports.getRequiredField = getRequiredField;
/**
 * Optimized field access for optional fields
 */
function getOptionalField(obj, field, expectedType) {
    const value = obj[field];
    if (value === undefined) {
        return undefined;
    }
    if (expectedType === 'object') {
        return isPlainObject(value) ? value : null;
    }
    return typeof value === expectedType ? value : null;
}
exports.getOptionalField = getOptionalField;
/**
 * Record type validation cache
 */
const validRecordTypes = new Set([
    'A',
    'AAAA',
    'ANY',
    'CAA',
    'CNAME',
    'DNSKEY',
    'DS',
    'MX',
    'NAPTR',
    'NS',
    'NSEC',
    'NSEC3',
    'PTR',
    'RRSIG',
    'SOA',
    'SRV',
    'SSHFP',
    'TLSA',
    'TXT',
]);
/**
 * Fast record type validation
 */
function isValidRecordType(type) {
    return (typeof type === 'string' && validRecordTypes.has(type));
}
exports.isValidRecordType = isValidRecordType;
/**
 * Performance tracking for validation operations
 */
class ValidationPerformanceTracker {
    metrics = {
        totalValidations: 0,
        successfulValidations: 0,
        averageTimeMs: 0,
        cacheHits: 0,
        cacheMisses: 0,
    };
    totalTime = 0;
    startValidation() {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            this.recordValidation(duration);
        };
    }
    recordValidation(durationMs) {
        this.metrics.totalValidations++;
        this.totalTime += durationMs;
        this.metrics.averageTimeMs = this.totalTime / this.metrics.totalValidations;
    }
    recordSuccess() {
        this.metrics.successfulValidations++;
    }
    recordCacheHit() {
        this.metrics.cacheHits++;
    }
    recordCacheMiss() {
        this.metrics.cacheMisses++;
    }
    getMetrics() {
        return { ...this.metrics };
    }
    reset() {
        this.metrics = {
            totalValidations: 0,
            successfulValidations: 0,
            averageTimeMs: 0,
            cacheHits: 0,
            cacheMisses: 0,
        };
        this.totalTime = 0;
    }
}
exports.ValidationPerformanceTracker = ValidationPerformanceTracker;
/**
 * Global performance tracker instance
 */
exports.globalPerformanceTracker = new ValidationPerformanceTracker();
/**
 * Decorator for tracking validation performance
 */
function trackPerformance(validationFn, tracker = exports.globalPerformanceTracker) {
    return ((...args) => {
        const endTracking = tracker.startValidation();
        try {
            const result = validationFn(...args);
            if (result &&
                typeof result === 'object' &&
                'isValid' in result &&
                result.isValid) {
                tracker.recordSuccess();
            }
            return result;
        }
        finally {
            endTracking();
        }
    });
}
exports.trackPerformance = trackPerformance;
//# sourceMappingURL=performance.js.map