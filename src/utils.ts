import type { UnknownRecord } from "type-fest";

import { arrayIncludes, isDefined, isEmpty, isInteger } from "ts-extras";
import validator from "validator";

import type {
    DNSQueryResult,
    DNSRecord,
    DNSRecordType,
    ValidationResult,
} from "./types";

/**
 * Utility functions for DNS query response validation
 */

/**
 * Validates if a CAA flags value is valid
 */
export function isValidCAAFlags(flags: number): boolean {
    return isInteger(flags) && flags >= 0 && flags <= 255;
} /**
 * Validates if a DNS query result structure is valid
 */
export function isValidDNSQueryResult(
    result: unknown
): result is DNSQueryResult {
    if (!result || typeof result !== "object") {
        return false;
    }

    const r = result as UnknownRecord;

    // Check required question field
    if (!r["question"] || typeof r["question"] !== "object") {
        return false;
    }

    const question = r["question"] as UnknownRecord;
    if (
        !question["name"] ||
        typeof question["name"] !== "string" ||
        !question["type"] ||
        typeof question["type"] !== "string" ||
        !question["class"] ||
        typeof question["class"] !== "string"
    ) {
        return false;
    }

    // Check answers array
    if (!Array.isArray(r["answers"])) {
        return false;
    }

    // Validate each answer record
    for (const answer of r["answers"]) {
        if (!isValidDNSRecord(answer)) {
            return false;
        }
    }

    return true;
}

/**
 * Validates if a DNS record structure is valid
 */
export function isValidDNSRecord(record: unknown): record is DNSRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = record as UnknownRecord;

    if (!r["type"] || typeof r["type"] !== "string") {
        return false;
    }

    const validTypes: DNSRecordType[] = [
        "A",
        "AAAA",
        "ANY",
        "CAA",
        "CNAME",
        "MX",
        "NAPTR",
        "NS",
        "PTR",
        "SOA",
        "SRV",
        "TLSA",
        "TXT",
    ];
    if (!arrayIncludes(validTypes, r["type"] as DNSRecordType)) {
        return false;
    }

    // Optional TTL validation
    const ttl = r["ttl"];
    if (
        isDefined(ttl) &&
        (typeof ttl !== "number" ||
            !isInteger(ttl) ||
            ttl < 0 ||
            ttl > 2_147_483_647)
    ) {
        return false;
    }

    return true;
}

/**
 * Validates if a string is a valid hexadecimal string
 */
export function isValidHexString(hex: string): boolean {
    return validator.isHexadecimal(hex);
}

/**
 * Validates if a NAPTR flags value is valid
 */
export function isValidNAPTRFlags(flags: string): boolean {
    const validFlags = [
        "S",
        "A",
        "U",
        "P",
        "",
    ];
    return arrayIncludes(validFlags, flags.toUpperCase());
}

/**
 * Validates if a number is within a valid port range
 */
export function isValidPort(port: number): boolean {
    return isInteger(port) && port >= 0 && port <= 65_535;
}

/**
 * Validates if a number is a valid priority value
 */
export function isValidPriority(priority: number): boolean {
    return isInteger(priority) && priority >= 0 && priority <= 65_535;
}

/**
 * Validates if a string contains only printable ASCII characters for TXT
 * records
 */
export function isValidTextRecord(text: string): boolean {
    // TXT records can contain any 8-bit data, but we'll validate for printable ASCII
    return [...text].every((character) => {
        const codePoint = character.codePointAt(0);
        return isDefined(codePoint) && codePoint >= 0x20 && codePoint <= 0x7e;
    });
}

/**
 * Validates if a TLSA matching type value is valid
 */
export function isValidTLSAMatchingType(matchingType: number): boolean {
    return isInteger(matchingType) && matchingType >= 0 && matchingType <= 2;
}

/**
 * Validates if a TLSA selector value is valid
 */
export function isValidTLSASelector(selector: number): boolean {
    return isInteger(selector) && selector >= 0 && selector <= 1;
}

/**
 * Validates if a TLSA usage value is valid
 */
export function isValidTLSAUsage(usage: number): boolean {
    return isInteger(usage) && usage >= 0 && usage <= 3;
}

/**
 * Validates if a number is a valid TTL value
 */
export function isValidTTL(ttl: number): boolean {
    return isInteger(ttl) && ttl >= 0 && ttl <= 2_147_483_647; // 2^31 - 1
}

/**
 * Validates if a number is a valid weight value
 */
export function isValidWeight(weight: number): boolean {
    return isInteger(weight) && weight >= 0 && weight <= 65_535;
}

/**
 * Validates DNS query response completeness and consistency
 */
export function validateDNSResponse(result: DNSQueryResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate question section
    if (!validator.isFQDN(result.question.name, { require_tld: true })) {
        errors.push(`Invalid domain name in question: ${result.question.name}`);
    }

    // Validate answers match question type
    if (result.question.type !== "ANY") {
        for (const answer of result.answers) {
            if (answer.type !== result.question.type) {
                warnings.push(
                    `Answer type ${answer.type} does not match question type ${result.question.type}`
                );
            }
        }
    }

    // Check for empty answers
    if (isEmpty(result.answers)) {
        warnings.push("No answers found in DNS response");
    }

    return {
        errors,
        isValid: isEmpty(errors),
        warnings,
    };
}
