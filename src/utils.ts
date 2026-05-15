import type { UnknownRecord } from "type-fest";

import {
    arrayIncludes,
    isDefined,
    isEmpty,
    isInteger,
    setHas,
} from "ts-extras";
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
const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

/**
 * Validates if a CAA flags value is valid
 */
export function isValidCAAFlags(flags: number): boolean {
    return isInteger(flags) && flags >= 0 && flags <= 255;
}

const isValidDNSRecordShape = (record: unknown): record is DNSRecord => {
    if (!isUnknownRecord(record)) {
        return false;
    }

    const candidate = record;
    const type = candidate["type"];
    if (!isDefined(type) || typeof type !== "string") {
        return false;
    }

    const validTypes: ReadonlySet<DNSRecordType> = new Set([
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
    ]);

    if (!setHas(validTypes, type)) {
        return false;
    }

    // Optional TTL validation
    const ttl = candidate["ttl"];
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
};

/**
 * Validates if a DNS query result structure is valid
 */
export function isValidDNSQueryResult(
    result: unknown
): result is DNSQueryResult {
    if (!isUnknownRecord(result)) {
        return false;
    }

    const candidate = result;
    const questionValue = candidate["question"];

    // Check required question field
    if (!isUnknownRecord(questionValue)) {
        return false;
    }

    const question = questionValue;
    if (
        !isDefined(question["name"]) ||
        typeof question["name"] !== "string" ||
        !isDefined(question["type"]) ||
        typeof question["type"] !== "string" ||
        !isDefined(question["class"]) ||
        typeof question["class"] !== "string"
    ) {
        return false;
    }

    // Check answers array
    const answers = candidate["answers"];
    if (!Array.isArray(answers)) {
        return false;
    }

    // Validate each answer record
    for (const answer of answers) {
        if (!isValidDNSRecordShape(answer)) {
            return false;
        }
    }

    return true;
}

/** Validates if a DNS record structure is valid */
export function isValidDNSRecord(record: unknown): record is DNSRecord {
    return isValidDNSRecordShape(record);
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
    const graphemeSegmenter = new Intl.Segmenter("en", {
        granularity: "grapheme",
    });

    // TXT records can contain any 8-bit data, but we'll validate for printable ASCII
    return [...graphemeSegmenter.segment(text)].every((segment) => {
        const codePoint = segment.segment.codePointAt(0);
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
export function validateDNSResponse(
    result: Readonly<DNSQueryResult>
): ValidationResult {
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
