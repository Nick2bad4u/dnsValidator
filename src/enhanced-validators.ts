import type { UnknownRecord } from "type-fest";

import { isDefined, isEmpty } from "ts-extras";
import validator from "validator";

import type { ValidationResult } from "./types";

import { isValidPriority, isValidTTL } from "./utils";

/**
 * Enhanced validation functions with detailed error reporting
 */

/**
 * Provides suggestions for common DNS record validation issues
 */
export function getValidationSuggestions(recordType: string): string[] {
    const suggestions: string[] = [];

    switch (recordType.toUpperCase()) {
        case "A": {
            suggestions.push(
                "A records should contain valid IPv4 addresses (e.g., 192.168.1.1)",
                "Consider setting a reasonable TTL value (300-3600 seconds for dynamic IPs)"
            );
            break;
        }
        case "AAAA": {
            suggestions.push(
                "AAAA records should contain valid IPv6 addresses (e.g., 2001:db8::1)",
                "IPv6 addresses can be compressed using :: notation"
            );
            break;
        }
        case "CNAME": {
            suggestions.push(
                "CNAME records cannot coexist with other record types for the same name",
                "The target must be a fully qualified domain name"
            );
            break;
        }
        case "MX": {
            suggestions.push(
                "MX records require both priority and exchange fields",
                "Lower priority values indicate higher precedence",
                "Exchange must be a fully qualified domain name"
            );
            break;
        }
        default: {
            suggestions.push(
                "Ensure all required fields are present and correctly typed",
                "Check that string values are properly formatted"
            );
        }
    }

    return suggestions;
}

/**
 * Enhanced AAAA record validation with detailed error messages
 */
export function validateAAAARecord(record: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!record || typeof record !== "object") {
        errors.push("Record must be an object");
        return { errors, isValid: false, warnings };
    }

    const r = toRecord(record);

    // Check type field
    if (r["type"] !== "AAAA") {
        errors.push(`Expected record type 'AAAA', got '${String(r["type"])}'`);
        return { errors, isValid: false, warnings };
    }

    // Check address field
    if (typeof r["address"] !== "string") {
        errors.push("AAAA record must have a 'address' field of type string");
    } else if (!validator.isIP(r["address"], 6)) {
        errors.push(
            `Invalid IPv6 address: '${r["address"]}'. Example: 2001:db8::1`
        );
    }

    // Check TTL field (optional)
    if (
        isDefined(r["ttl"]) &&
        (typeof r["ttl"] !== "number" || !isValidTTL(r["ttl"]))
    ) {
        errors.push(
            `Invalid TTL value: ${String(r["ttl"])}. Must be between 0 and 2147483647 seconds`
        );
    }

    return { errors, isValid: isEmpty(errors), warnings };
}

/**
 * Enhanced A record validation with detailed error messages
 */
export function validateARecord(record: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!record || typeof record !== "object") {
        errors.push("Record must be an object");
        return { errors, isValid: false, warnings };
    }

    const r = toRecord(record);

    // Check type field
    if (r["type"] !== "A") {
        errors.push(`Expected record type 'A', got '${String(r["type"])}'`);
        return { errors, isValid: false, warnings };
    }

    // Check address field
    if (typeof r["address"] !== "string") {
        errors.push("A record must have a 'address' field of type string");
    } else if (!validator.isIP(r["address"], 4)) {
        errors.push(
            `Invalid IPv4 address: '${r["address"]}'. Example: 192.168.1.1`
        );
    }

    // Check TTL field (optional)
    if (
        isDefined(r["ttl"]) &&
        (typeof r["ttl"] !== "number" || !isValidTTL(r["ttl"]))
    ) {
        errors.push(
            `Invalid TTL value: ${String(r["ttl"])}. Must be between 0 and 2147483647 seconds`
        );
    }

    return { errors, isValid: isEmpty(errors), warnings };
}

/**
 * Enhanced MX record validation with detailed error messages
 */
export function validateMXRecord(record: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!record || typeof record !== "object") {
        errors.push("Record must be an object");
        return { errors, isValid: false, warnings };
    }

    const r = toRecord(record);

    // Check type field
    if (r["type"] !== "MX") {
        errors.push(`Expected record type 'MX', got '${String(r["type"])}'`);
        return { errors, isValid: false, warnings };
    }

    // Check exchange field
    if (typeof r["exchange"] !== "string") {
        errors.push("MX record must have an 'exchange' field of type string");
    } else if (!validator.isFQDN(r["exchange"], { require_tld: true })) {
        errors.push(
            `Invalid FQDN for exchange: '${r["exchange"]}'. Example: mail.example.com`
        );
    }

    // Check priority field
    if (typeof r["priority"] !== "number") {
        errors.push("MX record must have a 'priority' field of type number");
    } else if (!isValidPriority(r["priority"])) {
        errors.push(
            `Invalid priority value: ${r["priority"]}. Must be between 0 and 65535 (lower = higher priority)`
        );
    }

    // Check TTL field (optional)
    if (
        isDefined(r["ttl"]) &&
        (typeof r["ttl"] !== "number" || !isValidTTL(r["ttl"]))
    ) {
        errors.push(
            `Invalid TTL value: ${String(r["ttl"])}. Must be between 0 and 2147483647 seconds`
        );
    }

    return { errors, isValid: isEmpty(errors), warnings };
}

/**
 * Helper function to safely cast unknown to a record type
 */
function toRecord(obj: unknown): UnknownRecord {
    return obj as UnknownRecord;
}
