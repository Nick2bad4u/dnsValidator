"use strict";
/**
 * DNS Validator Library
 *
 * A comprehensive TypeScript library for validating DNS query results and individual DNS records.
 * Supports validation of traditional DNS records (A, AAAA, MX, TXT, etc.) and DNSSEC records
 * (DNSKEY, DS, RRSIG, NSEC, etc.) with enhanced error reporting and performance optimization.
 *
 * @example
 * ```typescript
 * import { isARecord, validateARecord } from 'dns-response-validator';
 *
 * // Basic validation
 * const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
 * console.log(isARecord(record)); // true
 *
 * // Enhanced validation with error details
 * const result = validateARecord(record);
 * console.log(result.isValid); // true
 * ```
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDNSResponse = exports.isValidDNSRecord = exports.isValidDNSQueryResult = exports.validateDNSRecord = exports.isDNSRecord = exports.isANYRecord = exports.isTLSARecord = exports.isNAPTRRecord = exports.isCAARecord = exports.isSRVRecord = exports.isSOARecord = exports.isPTRRecord = exports.isNSRecord = exports.isTXTRecord = exports.isMXRecord = exports.isCNAMERecord = exports.isAAAARecord = exports.isARecord = exports.DNSKEYFlags = exports.NSEC3HashAlgorithm = exports.DigestAlgorithm = exports.DNSSECAlgorithm = exports.validateSignatureTimestamps = exports.isRecommendedDigestAlgorithm = exports.isRecommendedAlgorithm = exports.calculateKeyTag = exports.validateNSEC3PARAM = exports.validateNSEC3 = exports.validateNSEC = exports.validateDS = exports.validateDNSKEY = exports.validateRRSIG = void 0;
// Export all types
__exportStar(require("./types"), exports);
// Export validation utilities
__exportStar(require("./utils"), exports);
// Export DNSSEC validators and utilities (avoiding type conflicts)
var dnssec_1 = require("./dnssec");
Object.defineProperty(exports, "validateRRSIG", { enumerable: true, get: function () { return dnssec_1.validateRRSIG; } });
Object.defineProperty(exports, "validateDNSKEY", { enumerable: true, get: function () { return dnssec_1.validateDNSKEY; } });
Object.defineProperty(exports, "validateDS", { enumerable: true, get: function () { return dnssec_1.validateDS; } });
Object.defineProperty(exports, "validateNSEC", { enumerable: true, get: function () { return dnssec_1.validateNSEC; } });
Object.defineProperty(exports, "validateNSEC3", { enumerable: true, get: function () { return dnssec_1.validateNSEC3; } });
Object.defineProperty(exports, "validateNSEC3PARAM", { enumerable: true, get: function () { return dnssec_1.validateNSEC3PARAM; } });
Object.defineProperty(exports, "calculateKeyTag", { enumerable: true, get: function () { return dnssec_1.calculateKeyTag; } });
Object.defineProperty(exports, "isRecommendedAlgorithm", { enumerable: true, get: function () { return dnssec_1.isRecommendedAlgorithm; } });
Object.defineProperty(exports, "isRecommendedDigestAlgorithm", { enumerable: true, get: function () { return dnssec_1.isRecommendedDigestAlgorithm; } });
Object.defineProperty(exports, "validateSignatureTimestamps", { enumerable: true, get: function () { return dnssec_1.validateSignatureTimestamps; } });
Object.defineProperty(exports, "DNSSECAlgorithm", { enumerable: true, get: function () { return dnssec_1.DNSSECAlgorithm; } });
Object.defineProperty(exports, "DigestAlgorithm", { enumerable: true, get: function () { return dnssec_1.DigestAlgorithm; } });
Object.defineProperty(exports, "NSEC3HashAlgorithm", { enumerable: true, get: function () { return dnssec_1.NSEC3HashAlgorithm; } });
Object.defineProperty(exports, "DNSKEYFlags", { enumerable: true, get: function () { return dnssec_1.DNSKEYFlags; } });
// Export validators
__exportStar(require("./validators"), exports);
// Export DNSSEC and additional record validators
__exportStar(require("./dnssec-validators"), exports);
// Export enhanced validators with detailed error messages
__exportStar(require("./enhanced-validators"), exports);
// Export error classes and utilities
__exportStar(require("./errors"), exports);
// Export performance optimization utilities
__exportStar(require("./performance"), exports);
// Re-export commonly used functions for convenience
var validators_1 = require("./validators");
Object.defineProperty(exports, "isARecord", { enumerable: true, get: function () { return validators_1.isARecord; } });
Object.defineProperty(exports, "isAAAARecord", { enumerable: true, get: function () { return validators_1.isAAAARecord; } });
Object.defineProperty(exports, "isCNAMERecord", { enumerable: true, get: function () { return validators_1.isCNAMERecord; } });
Object.defineProperty(exports, "isMXRecord", { enumerable: true, get: function () { return validators_1.isMXRecord; } });
Object.defineProperty(exports, "isTXTRecord", { enumerable: true, get: function () { return validators_1.isTXTRecord; } });
Object.defineProperty(exports, "isNSRecord", { enumerable: true, get: function () { return validators_1.isNSRecord; } });
Object.defineProperty(exports, "isPTRRecord", { enumerable: true, get: function () { return validators_1.isPTRRecord; } });
Object.defineProperty(exports, "isSOARecord", { enumerable: true, get: function () { return validators_1.isSOARecord; } });
Object.defineProperty(exports, "isSRVRecord", { enumerable: true, get: function () { return validators_1.isSRVRecord; } });
Object.defineProperty(exports, "isCAARecord", { enumerable: true, get: function () { return validators_1.isCAARecord; } });
Object.defineProperty(exports, "isNAPTRRecord", { enumerable: true, get: function () { return validators_1.isNAPTRRecord; } });
Object.defineProperty(exports, "isTLSARecord", { enumerable: true, get: function () { return validators_1.isTLSARecord; } });
Object.defineProperty(exports, "isANYRecord", { enumerable: true, get: function () { return validators_1.isANYRecord; } });
Object.defineProperty(exports, "isDNSRecord", { enumerable: true, get: function () { return validators_1.isDNSRecord; } });
Object.defineProperty(exports, "validateDNSRecord", { enumerable: true, get: function () { return validators_1.validateDNSRecord; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "isValidDNSQueryResult", { enumerable: true, get: function () { return utils_1.isValidDNSQueryResult; } });
Object.defineProperty(exports, "isValidDNSRecord", { enumerable: true, get: function () { return utils_1.isValidDNSRecord; } });
Object.defineProperty(exports, "validateDNSResponse", { enumerable: true, get: function () { return utils_1.validateDNSResponse; } });
// Export Node.js dns API compatibility helpers
__exportStar(require("./node-compat"), exports);
//# sourceMappingURL=index.js.map