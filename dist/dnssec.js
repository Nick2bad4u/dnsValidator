"use strict";
/**
 * DNSSEC validation utilities and record type definitions
 * @module DNSSEC
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSKEYFlags = exports.NSEC3HashAlgorithm = exports.DigestAlgorithm = exports.DNSSECAlgorithm = void 0;
exports.validateRRSIG = validateRRSIG;
exports.validateDNSKEY = validateDNSKEY;
exports.validateDS = validateDS;
exports.validateNSEC = validateNSEC;
exports.validateNSEC3 = validateNSEC3;
exports.validateNSEC3PARAM = validateNSEC3PARAM;
exports.calculateKeyTag = calculateKeyTag;
exports.isRecommendedAlgorithm = isRecommendedAlgorithm;
exports.isRecommendedDigestAlgorithm = isRecommendedDigestAlgorithm;
exports.validateSignatureTimestamps = validateSignatureTimestamps;
const errors_1 = require("./errors");
/*
 * DevSkim suppressions:
 * The following enums intentionally include deprecated / weak algorithms (MD5, SHA-1, DSA, etc.)
 * because DNSSEC validation tooling frequently needs to recognize and potentially reject or report
 * records that specify them. They are defined here for completeness of the public algorithm registry
 * (see RFC 8624 / IANA DNSSEC Algorithm Numbers) and are NOT used to perform cryptographic operations
 * within this library. Suppress DevSkim warnings about weak algorithms in these enum declarations.
 * DevSkim: ignore DS126858,DS440010
 */
/**
 * DNSSEC algorithms as defined in RFC 8624
 */
var DNSSECAlgorithm;
(function (DNSSECAlgorithm) {
    DNSSECAlgorithm[DNSSECAlgorithm["RSAMD5"] = 1] = "RSAMD5";
    DNSSECAlgorithm[DNSSECAlgorithm["DH"] = 2] = "DH";
    DNSSECAlgorithm[DNSSECAlgorithm["DSA"] = 3] = "DSA";
    DNSSECAlgorithm[DNSSECAlgorithm["RSASHA1"] = 5] = "RSASHA1";
    DNSSECAlgorithm[DNSSECAlgorithm["DSA_NSEC3_SHA1"] = 6] = "DSA_NSEC3_SHA1";
    DNSSECAlgorithm[DNSSECAlgorithm["RSASHA1_NSEC3_SHA1"] = 7] = "RSASHA1_NSEC3_SHA1";
    DNSSECAlgorithm[DNSSECAlgorithm["RSASHA256"] = 8] = "RSASHA256";
    DNSSECAlgorithm[DNSSECAlgorithm["RSASHA512"] = 10] = "RSASHA512";
    DNSSECAlgorithm[DNSSECAlgorithm["ECC_GOST"] = 12] = "ECC_GOST";
    DNSSECAlgorithm[DNSSECAlgorithm["ECDSAP256SHA256"] = 13] = "ECDSAP256SHA256";
    DNSSECAlgorithm[DNSSECAlgorithm["ECDSAP384SHA384"] = 14] = "ECDSAP384SHA384";
    DNSSECAlgorithm[DNSSECAlgorithm["ED25519"] = 15] = "ED25519";
    DNSSECAlgorithm[DNSSECAlgorithm["ED448"] = 16] = "ED448";
})(DNSSECAlgorithm || (exports.DNSSECAlgorithm = DNSSECAlgorithm = {}));
/**
 * DNSSEC digest algorithms
 */
var DigestAlgorithm;
(function (DigestAlgorithm) {
    DigestAlgorithm[DigestAlgorithm["SHA1"] = 1] = "SHA1";
    DigestAlgorithm[DigestAlgorithm["SHA256"] = 2] = "SHA256";
    DigestAlgorithm[DigestAlgorithm["GOST"] = 3] = "GOST";
    DigestAlgorithm[DigestAlgorithm["SHA384"] = 4] = "SHA384";
})(DigestAlgorithm || (exports.DigestAlgorithm = DigestAlgorithm = {}));
/**
 * NSEC3 hash algorithms
 */
var NSEC3HashAlgorithm;
(function (NSEC3HashAlgorithm) {
    NSEC3HashAlgorithm[NSEC3HashAlgorithm["SHA1"] = 1] = "SHA1";
})(NSEC3HashAlgorithm || (exports.NSEC3HashAlgorithm = NSEC3HashAlgorithm = {}));
/**
 * DNSSEC key flags
 */
var DNSKEYFlags;
(function (DNSKEYFlags) {
    DNSKEYFlags[DNSKEYFlags["ZONE_KEY"] = 256] = "ZONE_KEY";
    DNSKEYFlags[DNSKEYFlags["SEP"] = 1] = "SEP";
    DNSKEYFlags[DNSKEYFlags["REVOKE"] = 128] = "REVOKE";
})(DNSKEYFlags || (exports.DNSKEYFlags = DNSKEYFlags = {}));
/**
 * Validates a RRSIG record
 */
function validateRRSIG(record) {
    if (!record || typeof record !== 'object') {
        throw new errors_1.DNSValidationError('RRSIG record must be an object', 'INVALID_RRSIG_STRUCTURE');
    }
    // Validate type covered
    if (!record.typeCovered || typeof record.typeCovered !== 'string') {
        throw new errors_1.DNSValidationError('RRSIG record must have a valid typeCovered field', 'INVALID_RRSIG_TYPE_COVERED', 'typeCovered', record.typeCovered);
    }
    // Validate algorithm
    if (!Number.isInteger(record.algorithm) ||
        record.algorithm < 1 ||
        record.algorithm > 16) {
        throw new errors_1.DNSValidationError('RRSIG record must have a valid algorithm', 'INVALID_RRSIG_ALGORITHM', 'algorithm', record.algorithm);
    }
    // Validate labels
    if (!Number.isInteger(record.labels) ||
        record.labels < 0 ||
        record.labels > 127) {
        throw new errors_1.DNSValidationError('RRSIG labels must be between 0 and 127', 'INVALID_RRSIG_LABELS', 'labels', record.labels);
    }
    // Validate TTL
    if (!Number.isInteger(record.originalTTL) || record.originalTTL < 0) {
        throw new errors_1.DNSValidationError('RRSIG originalTTL must be a non-negative integer', 'INVALID_RRSIG_TTL', 'originalTTL', record.originalTTL);
    }
    // Validate timestamps
    if (!Number.isInteger(record.signatureExpiration) ||
        record.signatureExpiration < 0) {
        throw new errors_1.DNSValidationError('RRSIG signatureExpiration must be a valid timestamp', 'INVALID_RRSIG_EXPIRATION', 'signatureExpiration', record.signatureExpiration);
    }
    if (!Number.isInteger(record.signatureInception) ||
        record.signatureInception < 0) {
        throw new errors_1.DNSValidationError('RRSIG signatureInception must be a valid timestamp', 'INVALID_RRSIG_INCEPTION', 'signatureInception', record.signatureInception);
    }
    if (record.signatureInception >= record.signatureExpiration) {
        throw new errors_1.DNSValidationError('RRSIG signatureInception must be before signatureExpiration', 'INVALID_RRSIG_TIMESTAMP_ORDER');
    }
    // Validate key tag
    if (!Number.isInteger(record.keyTag) ||
        record.keyTag < 0 ||
        record.keyTag > 65535) {
        throw new errors_1.DNSValidationError('RRSIG keyTag must be between 0 and 65535', 'INVALID_RRSIG_KEY_TAG', 'keyTag', record.keyTag);
    }
    // Validate signer name
    if (!record.signerName || typeof record.signerName !== 'string') {
        throw new errors_1.DNSValidationError('RRSIG record must have a valid signerName', 'INVALID_RRSIG_SIGNER_NAME', 'signerName', record.signerName);
    }
    // Basic domain name validation for signer
    if (!/^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.?$/.test(record.signerName)) {
        throw new errors_1.DNSValidationError('RRSIG signerName must be a valid domain name', 'INVALID_RRSIG_SIGNER_FORMAT', 'signerName', record.signerName);
    }
    // Validate signature
    if (!record.signature || typeof record.signature !== 'string') {
        throw new errors_1.DNSValidationError('RRSIG record must have a valid signature', 'INVALID_RRSIG_SIGNATURE', 'signature', record.signature);
    }
    // Signature should be base64-encoded
    if (!/^[A-Za-z0-9+/]+=*$/.test(record.signature)) {
        throw new errors_1.DNSValidationError('RRSIG signature must be base64-encoded', 'INVALID_RRSIG_SIGNATURE_FORMAT', 'signature', record.signature);
    }
    return {
        type: 'RRSIG',
        typeCovered: record.typeCovered,
        algorithm: record.algorithm,
        labels: record.labels,
        originalTTL: record.originalTTL,
        signatureExpiration: record.signatureExpiration,
        signatureInception: record.signatureInception,
        keyTag: record.keyTag,
        signerName: record.signerName,
        signature: record.signature,
    };
}
/**
 * Validates a DNSKEY record
 */
function validateDNSKEY(record) {
    if (!record || typeof record !== 'object') {
        throw new errors_1.DNSValidationError('DNSKEY record must be an object', 'INVALID_DNSKEY_STRUCTURE');
    }
    // Validate flags
    if (!Number.isInteger(record.flags) ||
        record.flags < 0 ||
        record.flags > 65535) {
        throw new errors_1.DNSValidationError('DNSKEY flags must be between 0 and 65535', 'INVALID_DNSKEY_FLAGS', 'flags', record.flags);
    }
    // Validate protocol (must be 3 for DNSSEC)
    if (record.protocol !== 3) {
        throw new errors_1.DNSValidationError('DNSKEY protocol must be 3 for DNSSEC', 'INVALID_DNSKEY_PROTOCOL', 'protocol', record.protocol);
    }
    // Validate algorithm
    if (!Number.isInteger(record.algorithm) ||
        record.algorithm < 1 ||
        record.algorithm > 16) {
        throw new errors_1.DNSValidationError('DNSKEY record must have a valid algorithm', 'INVALID_DNSKEY_ALGORITHM', 'algorithm', record.algorithm);
    }
    // Validate public key
    if (!record.publicKey || typeof record.publicKey !== 'string') {
        throw new errors_1.DNSValidationError('DNSKEY record must have a valid publicKey', 'INVALID_DNSKEY_PUBLIC_KEY', 'publicKey', record.publicKey);
    }
    // Public key should be base64-encoded
    if (!/^[A-Za-z0-9+/]+=*$/.test(record.publicKey)) {
        throw new errors_1.DNSValidationError('DNSKEY publicKey must be base64-encoded', 'INVALID_DNSKEY_PUBLIC_KEY_FORMAT', 'publicKey', record.publicKey);
    }
    return {
        type: 'DNSKEY',
        flags: record.flags,
        protocol: record.protocol,
        algorithm: record.algorithm,
        publicKey: record.publicKey,
    };
}
/**
 * Validates a DS record
 */
function validateDS(record) {
    if (!record || typeof record !== 'object') {
        throw new errors_1.DNSValidationError('DS record must be an object', 'INVALID_DS_STRUCTURE');
    }
    // Validate key tag
    if (!Number.isInteger(record.keyTag) ||
        record.keyTag < 0 ||
        record.keyTag > 65535) {
        throw new errors_1.DNSValidationError('DS keyTag must be between 0 and 65535', 'INVALID_DS_KEY_TAG', 'keyTag', record.keyTag);
    }
    // Validate algorithm
    if (!Number.isInteger(record.algorithm) ||
        record.algorithm < 1 ||
        record.algorithm > 16) {
        throw new errors_1.DNSValidationError('DS record must have a valid algorithm', 'INVALID_DS_ALGORITHM', 'algorithm', record.algorithm);
    }
    // Validate digest type
    if (!Number.isInteger(record.digestType) ||
        record.digestType < 1 ||
        record.digestType > 4) {
        throw new errors_1.DNSValidationError('DS digestType must be between 1 and 4', 'INVALID_DS_DIGEST_TYPE', 'digestType', record.digestType);
    }
    // Validate digest
    if (!record.digest || typeof record.digest !== 'string') {
        throw new errors_1.DNSValidationError('DS record must have a valid digest', 'INVALID_DS_DIGEST', 'digest', record.digest);
    }
    // Digest should be hexadecimal
    if (!/^[0-9a-fA-F]+$/.test(record.digest)) {
        throw new errors_1.DNSValidationError('DS digest must be hexadecimal', 'INVALID_DS_DIGEST_FORMAT', 'digest', record.digest);
    }
    // Validate digest length based on digest type
    const expectedLengths = {
        1: 40, // SHA-1: 20 bytes = 40 hex chars
        2: 64, // SHA-256: 32 bytes = 64 hex chars
        3: 64, // GOST: 32 bytes = 64 hex chars
        4: 96, // SHA-384: 48 bytes = 96 hex chars
    };
    const expectedLength = expectedLengths[record.digestType];
    if (expectedLength && record.digest.length !== expectedLength) {
        throw new errors_1.DNSValidationError(`DS digest length must be ${expectedLength} characters for digest type ${record.digestType}`, 'INVALID_DS_DIGEST_LENGTH', 'digest', record.digest);
    }
    return {
        type: 'DS',
        keyTag: record.keyTag,
        algorithm: record.algorithm,
        digestType: record.digestType,
        digest: record.digest,
    };
}
/**
 * Validates an NSEC record
 */
function validateNSEC(record) {
    if (!record || typeof record !== 'object') {
        throw new errors_1.DNSValidationError('NSEC record must be an object', 'INVALID_NSEC_STRUCTURE');
    }
    // Validate next domain name
    if (!record.nextDomainName || typeof record.nextDomainName !== 'string') {
        throw new errors_1.DNSValidationError('NSEC record must have a valid nextDomainName', 'INVALID_NSEC_NEXT_DOMAIN', 'nextDomainName', record.nextDomainName);
    }
    // Basic domain name validation
    if (!/^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.?$/.test(record.nextDomainName)) {
        throw new errors_1.DNSValidationError('NSEC nextDomainName must be a valid domain name', 'INVALID_NSEC_DOMAIN_FORMAT', 'nextDomainName', record.nextDomainName);
    }
    // Validate types
    if (!Array.isArray(record.types)) {
        throw new errors_1.DNSValidationError('NSEC types must be an array', 'INVALID_NSEC_TYPES', 'types', record.types);
    }
    const validTypes = [
        'A',
        'NS',
        'MD',
        'MF',
        'CNAME',
        'SOA',
        'MB',
        'MG',
        'MR',
        'NULL',
        'WKS',
        'PTR',
        'HINFO',
        'MINFO',
        'MX',
        'TXT',
        'RP',
        'AFSDB',
        'X25',
        'ISDN',
        'RT',
        'NSAP',
        'NSAP-PTR',
        'SIG',
        'KEY',
        'PX',
        'GPOS',
        'AAAA',
        'LOC',
        'NXT',
        'EID',
        'NIMLOC',
        'SRV',
        'ATMA',
        'NAPTR',
        'KX',
        'CERT',
        'A6',
        'DNAME',
        'SINK',
        'OPT',
        'APL',
        'DS',
        'SSHFP',
        'IPSECKEY',
        'RRSIG',
        'NSEC',
        'DNSKEY',
        'DHCID',
        'NSEC3',
        'NSEC3PARAM',
        'TLSA',
        'HIP',
        'NINFO',
        'RKEY',
        'TALINK',
        'CDS',
        'CDNSKEY',
        'OPENPGPKEY',
        'CSYNC',
        'ZONEMD',
        'SVCB',
        'HTTPS',
    ];
    for (const type of record.types) {
        if (typeof type !== 'string' || !validTypes.includes(type)) {
            throw new errors_1.DNSValidationError(`NSEC type "${type}" is not a valid DNS record type`, 'INVALID_NSEC_TYPE', 'types', type);
        }
    }
    return {
        type: 'NSEC',
        nextDomainName: record.nextDomainName,
        typeBitMaps: record.types,
        // Deprecated alias for backward compatibility
        types: record.types,
    };
}
/**
 * Validates an NSEC3 record
 */
function validateNSEC3(record) {
    if (!record || typeof record !== 'object') {
        throw new errors_1.DNSValidationError('NSEC3 record must be an object', 'INVALID_NSEC3_STRUCTURE');
    }
    // Validate hash algorithm (SHA-1 is specified by RFC but is weak)
    if (!Number.isInteger(record.hashAlgorithm) || record.hashAlgorithm !== 1) {
        throw new errors_1.DNSValidationError('NSEC3 hashAlgorithm must be 1 (SHA-1)', // DevSkim: ignore DS126858
        'INVALID_NSEC3_HASH_ALGORITHM', 'hashAlgorithm', record.hashAlgorithm);
    }
    // Validate flags
    if (!Number.isInteger(record.flags) ||
        record.flags < 0 ||
        record.flags > 255) {
        throw new errors_1.DNSValidationError('NSEC3 flags must be between 0 and 255', 'INVALID_NSEC3_FLAGS', 'flags', record.flags);
    }
    // Validate iterations
    if (!Number.isInteger(record.iterations) ||
        record.iterations < 0 ||
        record.iterations > 65535) {
        throw new errors_1.DNSValidationError('NSEC3 iterations must be between 0 and 65535', 'INVALID_NSEC3_ITERATIONS', 'iterations', record.iterations);
    }
    // Validate salt
    if (typeof record.salt !== 'string') {
        throw new errors_1.DNSValidationError('NSEC3 salt must be a string', 'INVALID_NSEC3_SALT_TYPE', 'salt', record.salt);
    }
    if (record.salt !== '-' && !/^[0-9a-fA-F]*$/.test(record.salt)) {
        throw new errors_1.DNSValidationError('NSEC3 salt must be hexadecimal or "-" for no salt', 'INVALID_NSEC3_SALT_FORMAT', 'salt', record.salt);
    }
    // Validate next hashed owner name
    if (!record.nextHashedOwnerName ||
        typeof record.nextHashedOwnerName !== 'string') {
        throw new errors_1.DNSValidationError('NSEC3 record must have a valid nextHashedOwnerName', 'INVALID_NSEC3_NEXT_HASHED_NAME', 'nextHashedOwnerName', record.nextHashedOwnerName);
    }
    // Should be base32-encoded
    if (!/^[A-Z2-7]+=*$/.test(record.nextHashedOwnerName)) {
        throw new errors_1.DNSValidationError('NSEC3 nextHashedOwnerName must be base32-encoded', 'INVALID_NSEC3_NEXT_HASHED_FORMAT', 'nextHashedOwnerName', record.nextHashedOwnerName);
    }
    // Validate types (same as NSEC)
    if (!Array.isArray(record.types)) {
        throw new errors_1.DNSValidationError('NSEC3 types must be an array', 'INVALID_NSEC3_TYPES', 'types', record.types);
    }
    const validTypes = [
        'A',
        'NS',
        'MD',
        'MF',
        'CNAME',
        'SOA',
        'MB',
        'MG',
        'MR',
        'NULL',
        'WKS',
        'PTR',
        'HINFO',
        'MINFO',
        'MX',
        'TXT',
        'RP',
        'AFSDB',
        'X25',
        'ISDN',
        'RT',
        'NSAP',
        'NSAP-PTR',
        'SIG',
        'KEY',
        'PX',
        'GPOS',
        'AAAA',
        'LOC',
        'NXT',
        'EID',
        'NIMLOC',
        'SRV',
        'ATMA',
        'NAPTR',
        'KX',
        'CERT',
        'A6',
        'DNAME',
        'SINK',
        'OPT',
        'APL',
        'DS',
        'SSHFP',
        'IPSECKEY',
        'RRSIG',
        'NSEC',
        'DNSKEY',
        'DHCID',
        'NSEC3',
        'NSEC3PARAM',
        'TLSA',
        'HIP',
        'NINFO',
        'RKEY',
        'TALINK',
        'CDS',
        'CDNSKEY',
        'OPENPGPKEY',
        'CSYNC',
        'ZONEMD',
        'SVCB',
        'HTTPS',
    ];
    for (const type of record.types) {
        if (typeof type !== 'string' || !validTypes.includes(type)) {
            throw new errors_1.DNSValidationError(`NSEC3 type "${type}" is not a valid DNS record type`, 'INVALID_NSEC3_TYPE', 'types', type);
        }
    }
    return {
        type: 'NSEC3',
        hashAlgorithm: record.hashAlgorithm,
        flags: record.flags,
        iterations: record.iterations,
        salt: record.salt,
        nextHashedOwnerName: record.nextHashedOwnerName,
        typeBitMaps: record.types,
        // Deprecated alias for backward compatibility
        types: record.types,
    };
}
/**
 * Validates an NSEC3PARAM record
 */
function validateNSEC3PARAM(record) {
    if (!record || typeof record !== 'object') {
        throw new errors_1.DNSValidationError('NSEC3PARAM record must be an object', 'INVALID_NSEC3PARAM_STRUCTURE');
    }
    // Validate hash algorithm (SHA-1 is specified by RFC but is weak)
    if (!Number.isInteger(record.hashAlgorithm) || record.hashAlgorithm !== 1) {
        throw new errors_1.DNSValidationError('NSEC3PARAM hashAlgorithm must be 1 (SHA-1)', // DevSkim: ignore DS126858
        'INVALID_NSEC3PARAM_HASH_ALGORITHM', 'hashAlgorithm', record.hashAlgorithm);
    }
    // Validate flags
    if (!Number.isInteger(record.flags) ||
        record.flags < 0 ||
        record.flags > 255) {
        throw new errors_1.DNSValidationError('NSEC3PARAM flags must be between 0 and 255', 'INVALID_NSEC3PARAM_FLAGS', 'flags', record.flags);
    }
    // Validate iterations
    if (!Number.isInteger(record.iterations) ||
        record.iterations < 0 ||
        record.iterations > 65535) {
        throw new errors_1.DNSValidationError('NSEC3PARAM iterations must be between 0 and 65535', 'INVALID_NSEC3PARAM_ITERATIONS', 'iterations', record.iterations);
    }
    // Validate salt
    if (typeof record.salt !== 'string') {
        throw new errors_1.DNSValidationError('NSEC3PARAM salt must be a string', 'INVALID_NSEC3PARAM_SALT_TYPE', 'salt', record.salt);
    }
    if (record.salt !== '-' && !/^[0-9a-fA-F]*$/.test(record.salt)) {
        throw new errors_1.DNSValidationError('NSEC3PARAM salt must be hexadecimal or "-" for no salt', 'INVALID_NSEC3PARAM_SALT_FORMAT', 'salt', record.salt);
    }
    return {
        type: 'NSEC3PARAM',
        hashAlgorithm: record.hashAlgorithm,
        flags: record.flags,
        iterations: record.iterations,
        salt: record.salt,
    };
}
/**
 * Calculates DNSKEY key tag (RFC 4034 Appendix B)
 */
function calculateKeyTag(dnskey) {
    // This is a simplified implementation
    // In a real implementation, you would need to properly encode the DNSKEY
    // and calculate the key tag according to RFC 4034
    const data = `${dnskey.flags}${dnskey.protocol}${dnskey.algorithm}${dnskey.publicKey}`;
    let tag = 0;
    for (let i = 0; i < data.length; i++) {
        if (i % 2 === 0) {
            tag += data.charCodeAt(i) << 8;
        }
        else {
            tag += data.charCodeAt(i);
        }
    }
    tag += (tag >> 16) & 0xffff;
    return tag & 0xffff;
}
/**
 * Checks if a DNSSEC algorithm is recommended for use
 */
function isRecommendedAlgorithm(algorithm) {
    const recommended = [
        DNSSECAlgorithm.RSASHA256,
        DNSSECAlgorithm.RSASHA512,
        DNSSECAlgorithm.ECDSAP256SHA256,
        DNSSECAlgorithm.ECDSAP384SHA384,
        DNSSECAlgorithm.ED25519,
        DNSSECAlgorithm.ED448,
    ];
    return recommended.includes(algorithm);
}
/**
 * Checks if a digest algorithm is recommended for use
 */
function isRecommendedDigestAlgorithm(algorithm) {
    const recommended = [DigestAlgorithm.SHA256, DigestAlgorithm.SHA384];
    return recommended.includes(algorithm);
}
/**
 * Validates DNSSEC signature timestamps
 */
function validateSignatureTimestamps(inception, expiration, clockSkew = 300) {
    const now = Math.floor(Date.now() / 1000);
    // Check if signature is not yet valid (with clock skew tolerance)
    if (now < inception - clockSkew) {
        return false;
    }
    // Check if signature has expired (with clock skew tolerance)
    if (now > expiration + clockSkew) {
        return false;
    }
    return true;
}
//# sourceMappingURL=dnssec.js.map