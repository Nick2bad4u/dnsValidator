import { ValidationResult } from './types';
import validator from 'validator';
import { isValidTTL, isValidPriority } from './utils';

/**
 * Enhanced validation functions with detailed error reporting
 */

/**
 * Helper function to safely cast unknown to a record type
 */
function toRecord(obj: unknown): Record<string, unknown> {
  return obj as Record<string, unknown>;
}

/**
 * Enhanced A record validation with detailed error messages
 */
export function validateARecord(record: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record || typeof record !== 'object') {
    errors.push('Record must be an object');
    return { isValid: false, errors, warnings };
  }

  const r = toRecord(record);

  // Check type field
  if (r['type'] !== 'A') {
    errors.push(`Expected record type 'A', got '${String(r['type'])}'`);
    return { isValid: false, errors, warnings };
  }

  // Check address field
  if (typeof r['address'] !== 'string') {
    errors.push("A record must have a 'address' field of type string");
  } else if (!validator.isIP(r['address'], 4)) {
    errors.push(
      `Invalid IPv4 address: '${r['address']}'. Example: 192.168.1.1`
    );
  }

  // Check TTL field (optional)
  if (r['ttl'] !== undefined) {
    if (typeof r['ttl'] !== 'number' || !isValidTTL(r['ttl'])) {
      errors.push(
        `Invalid TTL value: ${String(r['ttl'])}. Must be between 0 and 2147483647 seconds`
      );
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Enhanced AAAA record validation with detailed error messages
 */
export function validateAAAARecord(record: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record || typeof record !== 'object') {
    errors.push('Record must be an object');
    return { isValid: false, errors, warnings };
  }

  const r = toRecord(record);

  // Check type field
  if (r['type'] !== 'AAAA') {
    errors.push(`Expected record type 'AAAA', got '${String(r['type'])}'`);
    return { isValid: false, errors, warnings };
  }

  // Check address field
  if (typeof r['address'] !== 'string') {
    errors.push("AAAA record must have a 'address' field of type string");
  } else if (!validator.isIP(r['address'], 6)) {
    errors.push(
      `Invalid IPv6 address: '${r['address']}'. Example: 2001:db8::1`
    );
  }

  // Check TTL field (optional)
  if (r['ttl'] !== undefined) {
    if (typeof r['ttl'] !== 'number' || !isValidTTL(r['ttl'])) {
      errors.push(
        `Invalid TTL value: ${String(r['ttl'])}. Must be between 0 and 2147483647 seconds`
      );
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Enhanced MX record validation with detailed error messages
 */
export function validateMXRecord(record: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record || typeof record !== 'object') {
    errors.push('Record must be an object');
    return { isValid: false, errors, warnings };
  }

  const r = toRecord(record);

  // Check type field
  if (r['type'] !== 'MX') {
    errors.push(`Expected record type 'MX', got '${String(r['type'])}'`);
    return { isValid: false, errors, warnings };
  }

  // Check exchange field
  if (typeof r['exchange'] !== 'string') {
    errors.push("MX record must have an 'exchange' field of type string");
  } else if (!validator.isFQDN(r['exchange'], { require_tld: true })) {
    errors.push(
      `Invalid FQDN for exchange: '${r['exchange']}'. Example: mail.example.com`
    );
  }

  // Check priority field
  if (typeof r['priority'] !== 'number') {
    errors.push("MX record must have a 'priority' field of type number");
  } else if (!isValidPriority(r['priority'])) {
    errors.push(
      `Invalid priority value: ${r['priority']}. Must be between 0 and 65535 (lower = higher priority)`
    );
  }

  // Check TTL field (optional)
  if (r['ttl'] !== undefined) {
    if (typeof r['ttl'] !== 'number' || !isValidTTL(r['ttl'])) {
      errors.push(
        `Invalid TTL value: ${String(r['ttl'])}. Must be between 0 and 2147483647 seconds`
      );
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Provides suggestions for common DNS record validation issues
 */
export function getValidationSuggestions(recordType: string): string[] {
  const suggestions: string[] = [];

  switch (recordType.toUpperCase()) {
    case 'A':
      suggestions.push(
        'A records should contain valid IPv4 addresses (e.g., 192.168.1.1)'
      );
      suggestions.push(
        'Consider setting a reasonable TTL value (300-3600 seconds for dynamic IPs)'
      );
      break;
    case 'AAAA':
      suggestions.push(
        'AAAA records should contain valid IPv6 addresses (e.g., 2001:db8::1)'
      );
      suggestions.push('IPv6 addresses can be compressed using :: notation');
      break;
    case 'MX':
      suggestions.push('MX records require both priority and exchange fields');
      suggestions.push('Lower priority values indicate higher precedence');
      suggestions.push('Exchange must be a fully qualified domain name');
      break;
    case 'CNAME':
      suggestions.push(
        'CNAME records cannot coexist with other record types for the same name'
      );
      suggestions.push('The target must be a fully qualified domain name');
      break;
    default:
      suggestions.push(
        'Ensure all required fields are present and correctly typed'
      );
      suggestions.push('Check that string values are properly formatted');
  }

  return suggestions;
}
