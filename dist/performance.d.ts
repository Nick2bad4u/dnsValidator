/**
 * Performance optimizations for DNS validation
 */
import { DNSRecordType } from './types';
/**
 * Pre-compiled regex patterns for common validations
 */
export declare const ValidationPatterns: Record<string, RegExp>;
/**
 * Fast pre-validation using regex patterns
 * Returns null if validation should proceed, or false if definitely invalid
 */
export declare function fastPreValidate(value: string, pattern: keyof typeof ValidationPatterns): boolean | null;
/**
 * Optimized type checking with early returns
 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
/**
 * Fast integer range validation
 */
export declare function isValidIntegerInRange(value: unknown, min: number, max: number): value is number;
/**
 * Optimized field access with type checking
 */
export declare function getRequiredField<T>(obj: Record<string, unknown>, field: string, expectedType: 'string' | 'number' | 'boolean' | 'object'): T | null;
/**
 * Optimized field access for optional fields
 */
export declare function getOptionalField<T>(obj: Record<string, unknown>, field: string, expectedType: 'string' | 'number' | 'boolean' | 'object'): T | undefined | null;
/**
 * Fast record type validation
 */
export declare function isValidRecordType(type: unknown): type is DNSRecordType;
/**
 * Validation performance metrics
 */
export interface ValidationMetrics {
    totalValidations: number;
    successfulValidations: number;
    averageTimeMs: number;
    cacheHits: number;
    cacheMisses: number;
}
/**
 * Performance tracking for validation operations
 */
export declare class ValidationPerformanceTracker {
    private metrics;
    private totalTime;
    startValidation(): () => void;
    private recordValidation;
    recordSuccess(): void;
    recordCacheHit(): void;
    recordCacheMiss(): void;
    getMetrics(): ValidationMetrics;
    reset(): void;
}
/**
 * Global performance tracker instance
 */
export declare const globalPerformanceTracker: ValidationPerformanceTracker;
/**
 * Decorator for tracking validation performance
 */
export declare function trackPerformance<T extends (...args: any[]) => any>(validationFn: T, tracker?: ValidationPerformanceTracker): T;
//# sourceMappingURL=performance.d.ts.map