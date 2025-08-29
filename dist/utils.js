"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDNSQueryResult = isValidDNSQueryResult;
exports.isValidDNSRecord = isValidDNSRecord;
exports.validateDNSResponse = validateDNSResponse;
exports.isValidPort = isValidPort;
exports.isValidPriority = isValidPriority;
exports.isValidWeight = isValidWeight;
exports.isValidTTL = isValidTTL;
exports.isValidCAAFlags = isValidCAAFlags;
exports.isValidNAPTRFlags = isValidNAPTRFlags;
exports.isValidTLSAUsage = isValidTLSAUsage;
exports.isValidTLSASelector = isValidTLSASelector;
exports.isValidTLSAMatchingType = isValidTLSAMatchingType;
exports.isValidHexString = isValidHexString;
exports.isValidTextRecord = isValidTextRecord;
const validator_1 = __importDefault(require("validator"));
/**
 * Utility functions for DNS query response validation
 */
/**
 * Validates if a DNS query result structure is valid
 */
function isValidDNSQueryResult(result) {
    if (!result || typeof result !== 'object') {
        return false;
    }
    const r = result;
    // Check required question field
    if (!r['question'] || typeof r['question'] !== 'object') {
        return false;
    }
    const question = r['question'];
    if (!question['name'] ||
        typeof question['name'] !== 'string' ||
        !question['type'] ||
        typeof question['type'] !== 'string' ||
        !question['class'] ||
        typeof question['class'] !== 'string') {
        return false;
    }
    // Check answers array
    if (!Array.isArray(r['answers'])) {
        return false;
    }
    // Validate each answer record
    for (const answer of r['answers']) {
        if (!isValidDNSRecord(answer)) {
            return false;
        }
    }
    return true;
} /**
 * Validates if a DNS record structure is valid
 */
function isValidDNSRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = record;
    if (!r['type'] || typeof r['type'] !== 'string') {
        return false;
    }
    const validTypes = [
        'A',
        'AAAA',
        'ANY',
        'CAA',
        'CNAME',
        'MX',
        'NAPTR',
        'NS',
        'PTR',
        'SOA',
        'SRV',
        'TLSA',
        'TXT',
    ];
    if (!validTypes.includes(r['type'])) {
        return false;
    }
    // Optional TTL validation
    if (r['ttl'] !== undefined &&
        (!Number.isInteger(r['ttl']) ||
            r['ttl'] < 0 ||
            r['ttl'] > 2147483647)) {
        return false;
    }
    return true;
}
/**
 * Validates DNS query response completeness and consistency
 */
function validateDNSResponse(result) {
    const errors = [];
    const warnings = [];
    // Validate question section
    if (!validator_1.default.isFQDN(result.question.name, { require_tld: true })) {
        errors.push(`Invalid domain name in question: ${result.question.name}`);
    }
    // Validate answers match question type
    if (result.question.type !== 'ANY') {
        for (const answer of result.answers) {
            if (answer.type !== result.question.type) {
                warnings.push(`Answer type ${answer.type} does not match question type ${result.question.type}`);
            }
        }
    }
    // Check for empty answers
    if (result.answers.length === 0) {
        warnings.push('No answers found in DNS response');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Validates if a number is within a valid port range
 */
function isValidPort(port) {
    return Number.isInteger(port) && port >= 0 && port <= 65535;
}
/**
 * Validates if a number is a valid priority value
 */
function isValidPriority(priority) {
    return Number.isInteger(priority) && priority >= 0 && priority <= 65535;
}
/**
 * Validates if a number is a valid weight value
 */
function isValidWeight(weight) {
    return Number.isInteger(weight) && weight >= 0 && weight <= 65535;
}
/**
 * Validates if a number is a valid TTL value
 */
function isValidTTL(ttl) {
    return Number.isInteger(ttl) && ttl >= 0 && ttl <= 2147483647; // 2^31 - 1
}
/**
 * Validates if a CAA flags value is valid
 */
function isValidCAAFlags(flags) {
    return Number.isInteger(flags) && flags >= 0 && flags <= 255;
}
/**
 * Validates if a NAPTR flags value is valid
 */
function isValidNAPTRFlags(flags) {
    const validFlags = ['S', 'A', 'U', 'P', ''];
    return validFlags.includes(flags.toUpperCase());
}
/**
 * Validates if a TLSA usage value is valid
 */
function isValidTLSAUsage(usage) {
    return Number.isInteger(usage) && usage >= 0 && usage <= 3;
}
/**
 * Validates if a TLSA selector value is valid
 */
function isValidTLSASelector(selector) {
    return Number.isInteger(selector) && selector >= 0 && selector <= 1;
}
/**
 * Validates if a TLSA matching type value is valid
 */
function isValidTLSAMatchingType(matchingType) {
    return (Number.isInteger(matchingType) && matchingType >= 0 && matchingType <= 2);
}
/**
 * Validates if a string is a valid hexadecimal string
 */
function isValidHexString(hex) {
    return validator_1.default.isHexadecimal(hex);
}
/**
 * Validates if a string contains only printable ASCII characters for TXT records
 */
function isValidTextRecord(text) {
    // TXT records can contain any 8-bit data, but we'll validate for printable ASCII
    const printableAsciiRegex = /^[\x20-\x7E]*$/;
    return printableAsciiRegex.test(text);
}
//# sourceMappingURL=utils.js.map