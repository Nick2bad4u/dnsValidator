"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDNSKEYRecord = isDNSKEYRecord;
exports.isDSRecord = isDSRecord;
exports.isNSECRecord = isNSECRecord;
exports.isNSEC3Record = isNSEC3Record;
exports.isRRSIGRecord = isRRSIGRecord;
exports.isSSHFPRecord = isSSHFPRecord;
const validator_1 = __importDefault(require("validator"));
const utils_1 = require("./utils");
/**
 * Helper function to safely cast unknown to a record type
 */
function toRecord(obj) {
    return obj;
}
/**
 * Validates DNSSEC algorithm numbers
 */
function isValidDNSSECAlgorithm(algorithm) {
    // Valid DNSSEC algorithm numbers (as per IANA registry)
    const validAlgorithms = [1, 3, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16];
    return Number.isInteger(algorithm) && validAlgorithms.includes(algorithm);
}
/**
 * Validates digest type numbers for DS records
 */
function isValidDigestType(digestType) {
    // Valid digest types: 1 (SHA-1), 2 (SHA-256), 3 (GOST R 34.11-94), 4 (SHA-384)
    return Number.isInteger(digestType) && digestType >= 1 && digestType <= 4;
}
/**
 * Validates hash algorithm for NSEC3
 */
function isValidHashAlgorithm(algorithm) {
    // Currently only SHA-1 (1) is defined
    return algorithm === 1;
}
/**
 * Validates SSH algorithm numbers
 */
function isValidSSHAlgorithm(algorithm) {
    // Valid SSH algorithms: 1 (RSA), 2 (DSS), 3 (ECDSA), 4 (Ed25519), 6 (Ed448)
    const validAlgorithms = [1, 2, 3, 4, 6];
    return Number.isInteger(algorithm) && validAlgorithms.includes(algorithm);
}
/**
 * Validates SSH fingerprint types
 */
function isValidSSHFingerprintType(fpType) {
    // Valid fingerprint types: 1 (SHA-1), 2 (SHA-256)
    return fpType === 1 || fpType === 2;
}
/**
 * Validates a DNSKEY record
 */
function isDNSKEYRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'DNSKEY' &&
        typeof r['flags'] === 'number' &&
        Number.isInteger(r['flags']) &&
        r['flags'] >= 0 &&
        r['flags'] <= 65535 &&
        typeof r['protocol'] === 'number' &&
        r['protocol'] === 3 && // Must be 3 for DNSSEC
        typeof r['algorithm'] === 'number' &&
        isValidDNSSECAlgorithm(r['algorithm']) &&
        typeof r['publicKey'] === 'string' &&
        (0, utils_1.isValidHexString)(r['publicKey']) &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates a DS record
 */
function isDSRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'DS' &&
        typeof r['keyTag'] === 'number' &&
        Number.isInteger(r['keyTag']) &&
        r['keyTag'] >= 0 &&
        r['keyTag'] <= 65535 &&
        typeof r['algorithm'] === 'number' &&
        isValidDNSSECAlgorithm(r['algorithm']) &&
        typeof r['digestType'] === 'number' &&
        isValidDigestType(r['digestType']) &&
        typeof r['digest'] === 'string' &&
        (0, utils_1.isValidHexString)(r['digest']) &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates an NSEC record
 */
function isNSECRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'NSEC' &&
        typeof r['nextDomainName'] === 'string' &&
        validator_1.default.isFQDN(r['nextDomainName'], { require_tld: true }) &&
        Array.isArray(r['typeBitMaps']) &&
        r['typeBitMaps'].every((type) => typeof type === 'string') &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates an NSEC3 record
 */
function isNSEC3Record(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'NSEC3' &&
        typeof r['hashAlgorithm'] === 'number' &&
        isValidHashAlgorithm(r['hashAlgorithm']) &&
        typeof r['flags'] === 'number' &&
        Number.isInteger(r['flags']) &&
        r['flags'] >= 0 &&
        r['flags'] <= 255 &&
        typeof r['iterations'] === 'number' &&
        Number.isInteger(r['iterations']) &&
        r['iterations'] >= 0 &&
        r['iterations'] <= 65535 &&
        typeof r['salt'] === 'string' &&
        (r['salt'] === '' || (0, utils_1.isValidHexString)(r['salt'])) &&
        typeof r['nextHashedOwnerName'] === 'string' &&
        Array.isArray(r['typeBitMaps']) &&
        r['typeBitMaps'].every((type) => typeof type === 'string') &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates an RRSIG record
 */
function isRRSIGRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'RRSIG' &&
        typeof r['typeCovered'] === 'string' &&
        typeof r['algorithm'] === 'number' &&
        isValidDNSSECAlgorithm(r['algorithm']) &&
        typeof r['labels'] === 'number' &&
        Number.isInteger(r['labels']) &&
        r['labels'] >= 0 &&
        r['labels'] <= 255 &&
        typeof r['originalTTL'] === 'number' &&
        (0, utils_1.isValidTTL)(r['originalTTL']) &&
        typeof r['signatureExpiration'] === 'number' &&
        Number.isInteger(r['signatureExpiration']) &&
        r['signatureExpiration'] >= 0 &&
        typeof r['signatureInception'] === 'number' &&
        Number.isInteger(r['signatureInception']) &&
        r['signatureInception'] >= 0 &&
        typeof r['keyTag'] === 'number' &&
        Number.isInteger(r['keyTag']) &&
        r['keyTag'] >= 0 &&
        r['keyTag'] <= 65535 &&
        typeof r['signerName'] === 'string' &&
        validator_1.default.isFQDN(r['signerName'], { require_tld: true }) &&
        typeof r['signature'] === 'string' &&
        (0, utils_1.isValidHexString)(r['signature']) &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates an SSHFP record
 */
function isSSHFPRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'SSHFP' &&
        typeof r['algorithm'] === 'number' &&
        isValidSSHAlgorithm(r['algorithm']) &&
        typeof r['fpType'] === 'number' &&
        isValidSSHFingerprintType(r['fpType']) &&
        typeof r['fingerprint'] === 'string' &&
        (0, utils_1.isValidHexString)(r['fingerprint']) &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
//# sourceMappingURL=dnssec-validators.js.map