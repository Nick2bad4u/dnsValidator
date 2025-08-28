/**
 * Performance optimizations for DNS validation
 */

import { DNSRecordType } from './types';

/**
 * Cache for compiled regular expressions to avoid recompilation
 */
const regexCache = new Map<string, RegExp>();

/**
 * Get a cached regular expression or create and cache it
 */
function getCachedRegex(pattern: string, flags?: string): RegExp {
  const key = `${pattern}:${flags || ''}`;
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  return regexCache.get(key)!;
}

// Test hook (non-public) to exercise cache miss/hit branches explicitly
// eslint-disable-next-line @typescript-eslint/naming-convention
export const __testGetCachedRegex = (pattern: string, flags?: string) =>
  getCachedRegex(pattern, flags);

/**
 * Pre-compiled regex patterns for common validations
 */
export const ValidationPatterns: Record<string, RegExp> = {
  // IPv4 address pattern (more permissive, final validation with library)
  ipv4: getCachedRegex(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
  ),

  // Hexadecimal string pattern
  hex: getCachedRegex('^[0-9a-fA-F]+$'),

  // Basic FQDN pattern (more permissive, final validation with library)
  fqdn: getCachedRegex(
    '^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\\.([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?))*$'
  ),

  // Email pattern for SOA admin field
  email: getCachedRegex('^[^@]+@[^@]+\\.[^@]+$'),
};

/**
 * Fast pre-validation using regex patterns
 * Returns null if validation should proceed, or false if definitely invalid
 */
export function fastPreValidate(
  value: string,
  pattern: keyof typeof ValidationPatterns
): boolean | null {
  if (typeof value !== 'string' || value.length === 0) {
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
 * Optimized type checking with early returns
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
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
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

/**
 * Optimized field access with type checking
 */
export function getRequiredField<T>(
  obj: Record<string, unknown>,
  field: string,
  expectedType: 'string' | 'number' | 'boolean' | 'object'
): T | null {
  const value = obj[field];

  if (value === undefined) {
    return null;
  }

  if (expectedType === 'object') {
    return isPlainObject(value) ? (value as T) : null;
  }

  return typeof value === expectedType ? (value as T) : null;
}

/**
 * Optimized field access for optional fields
 */
export function getOptionalField<T>(
  obj: Record<string, unknown>,
  field: string,
  expectedType: 'string' | 'number' | 'boolean' | 'object'
): T | undefined | null {
  const value = obj[field];

  if (value === undefined) {
    return undefined;
  }

  if (expectedType === 'object') {
    return isPlainObject(value) ? (value as T) : null;
  }

  return typeof value === expectedType ? (value as T) : null;
}

/**
 * Record type validation cache
 */
const validRecordTypes = new Set<DNSRecordType>([
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
export function isValidRecordType(type: unknown): type is DNSRecordType {
  return (
    typeof type === 'string' && validRecordTypes.has(type as DNSRecordType)
  );
}

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
export class ValidationPerformanceTracker {
  private metrics: ValidationMetrics = {
    totalValidations: 0,
    successfulValidations: 0,
    averageTimeMs: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  private totalTime = 0;

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
    this.metrics.averageTimeMs = this.totalTime / this.metrics.totalValidations;
  }

  public recordSuccess(): void {
    this.metrics.successfulValidations++;
  }

  public recordCacheHit(): void {
    this.metrics.cacheHits++;
  }

  public recordCacheMiss(): void {
    this.metrics.cacheMisses++;
  }

  public getMetrics(): ValidationMetrics {
    return { ...this.metrics };
  }

  public reset(): void {
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

/**
 * Global performance tracker instance
 */
export const globalPerformanceTracker: ValidationPerformanceTracker =
  new ValidationPerformanceTracker();

/**
 * Decorator for tracking validation performance
 */
export function trackPerformance<T extends (...args: any[]) => any>(
  validationFn: T,
  tracker: ValidationPerformanceTracker = globalPerformanceTracker
): T {
  return ((...args: Parameters<T>) => {
    const endTracking = tracker.startValidation();
    try {
      const result = validationFn(...args);
      if (
        result &&
        typeof result === 'object' &&
        'isValid' in result &&
        result.isValid
      ) {
        tracker.recordSuccess();
      }
      return result;
    } finally {
      endTracking();
    }
  }) as T;
}
