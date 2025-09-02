import { ValidationResult } from './types';
/**
 * Enhanced A record validation with detailed error messages
 */
export declare function validateARecord(record: unknown): ValidationResult;
/**
 * Enhanced AAAA record validation with detailed error messages
 */
export declare function validateAAAARecord(record: unknown): ValidationResult;
/**
 * Enhanced MX record validation with detailed error messages
 */
export declare function validateMXRecord(record: unknown): ValidationResult;
/**
 * Provides suggestions for common DNS record validation issues
 */
export declare function getValidationSuggestions(recordType: string): string[];
//# sourceMappingURL=enhanced-validators.d.ts.map