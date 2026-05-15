/**
 * DNSSEC validation utilities and record type definitions
 *
 * @packageDocumentation DNSSEC
 */

import type { UnknownRecord, ValueOf } from "type-fest";

import { arrayIncludes, isDefined, isInteger, setHas } from "ts-extras";

import type {
    DNSKEYRecord,
    DSRecord,
    NSEC3PARAMRecord,
    NSEC3Record,
    NSECRecord,
    RRSIGRecord,
} from "./types";

import { DNSValidationError } from "./errors";

/*
 * DevSkim suppressions:
 * The following enums intentionally include deprecated / weak algorithms (MD5, SHA-1, DSA, etc.)
 * because DNSSEC validation tooling frequently needs to recognize and potentially reject or report
 * records that specify them. They are defined here for completeness of the public algorithm registry
 * (see RFC 8624 / IANA DNSSEC Algorithm Numbers) and are NOT used to perform cryptographic operations
 * within this library. Suppress DevSkim warnings about weak algorithms in these enum declarations.
 * DevSkim: ignore DS126858,DS440010
 */

const base64Characters = new Set([
    ...Array.from({ length: 26 }, (_, index) =>
        String.fromCodePoint(65 + index)
    ),
    ...Array.from({ length: 26 }, (_, index) =>
        String.fromCodePoint(97 + index)
    ),
    ...Array.from({ length: 10 }, (_, index) =>
        String.fromCodePoint(48 + index)
    ),
    "+",
    "/",
    "=",
]);

function getRequiredIntegerField(
    record: Readonly<UnknownRecord>,
    field: string,
    errorCode: string,
    minimum: number,
    maximum: number
): number {
    const rawValue = record[field];

    if (
        typeof rawValue !== "number" ||
        !isInteger(rawValue) ||
        rawValue < minimum ||
        rawValue > maximum
    ) {
        throw new DNSValidationError(
            `${field} must be between ${minimum} and ${maximum}`,
            errorCode,
            field,
            rawValue
        );
    }

    return rawValue;
}

function getRequiredStringArrayField(
    record: Readonly<UnknownRecord>,
    field: string,
    errorCode: string,
    message: string
): string[] {
    const rawValue = record[field];
    const values: string[] = [];

    if (!Array.isArray(rawValue)) {
        throw new DNSValidationError(message, errorCode, field, rawValue);
    }

    for (const value of rawValue) {
        if (typeof value !== "string") {
            throw new DNSValidationError(message, errorCode, field, value);
        }
        values.push(value);
    }

    return values;
}

function getRequiredStringField(
    record: Readonly<UnknownRecord>,
    field: string,
    errorCode: string,
    message: string
): string {
    const rawValue = record[field];

    if (typeof rawValue !== "string" || rawValue.length === 0) {
        throw new DNSValidationError(message, errorCode, field, rawValue);
    }

    return rawValue;
}

function isRecordObject(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null;
}

/**
 * DNSSEC digest algorithms
 */
export const DigestAlgorithm = {
    SHA1: 1, // Not recommended // DevSkim: ignore DS126858
    SHA256: 2, // Recommended
    GOST: 3, // Optional
    SHA384: 4, // Recommended
} as const;

/**
 * DNSSEC digest algorithm number.
 */
export type DigestAlgorithm = ValueOf<typeof DigestAlgorithm>; // eslint-disable-line @typescript-eslint/no-redeclare -- intentional value+type export pairing for ergonomic API

/**
 * DNSSEC key flags
 */
export const DNSKEYFlags = {
    SEP: 0x00_01, // Secure Entry Point
    REVOKE: 0x00_80, // Revoke flag
    ZONE_KEY: 0x01_00, // Zone Key flag
} as const;

/**
 * DNSKEY flag bitmask value.
 */
export type DNSKEYFlags = ValueOf<typeof DNSKEYFlags>; // eslint-disable-line @typescript-eslint/no-redeclare -- intentional value+type export pairing for ergonomic API

/**
 * DNSSEC algorithms as defined in RFC 8624
 */
export const DNSSECAlgorithm = {
    RSAMD5: 1, // Deprecated // DevSkim: ignore DS126858
    DH: 2, // Not recommended
    DSA: 3, // Not recommended
    RSASHA1: 5, // Not recommended // DevSkim: ignore DS126858
    DSA_NSEC3_SHA1: 6, // Not recommended // DevSkim: ignore DS126858
    RSASHA1_NSEC3_SHA1: 7, // Not recommended // DevSkim: ignore DS126858 DS440010
    RSASHA256: 8, // Recommended
    RSASHA512: 10, // Recommended
    ECC_GOST: 12, // Optional
    ECDSAP256SHA256: 13, // Recommended
    ECDSAP384SHA384: 14, // Recommended
    ED25519: 15, // Recommended
    ED448: 16, // Recommended
} as const;

/**
 * DNSSEC algorithm number.
 */
export type DNSSECAlgorithm = ValueOf<typeof DNSSECAlgorithm>; // eslint-disable-line @typescript-eslint/no-redeclare -- intentional value+type export pairing for ergonomic API

/**
 * NSEC3 hash algorithms
 */
export const NSEC3HashAlgorithm = {
    SHA1: 1,
} as const;

/**
 * NSEC3 hash algorithm number.
 */
export type NSEC3HashAlgorithm = ValueOf<typeof NSEC3HashAlgorithm>; // eslint-disable-line @typescript-eslint/no-redeclare -- intentional value+type export pairing for ergonomic API

/**
 * Calculates DNSKEY key tag (RFC 4034 Appendix B)
 */
export function calculateKeyTag(dnskey: Readonly<DNSKEYRecord>): number {
    // This is a simplified implementation
    // In a real implementation, you would need to properly encode the DNSKEY
    // and calculate the key tag according to RFC 4034

    const data = `${dnskey.flags}${dnskey.protocol}${dnskey.algorithm}${dnskey.publicKey}`;
    let tag = 0;

    for (let i = 0; i < data.length; i++) {
        const codePoint = data.codePointAt(i) ?? 0;
        tag += i % 2 === 0 ? codePoint << 8 : codePoint;
    }

    tag += (tag >> 16) & 0xff_ff;
    return tag & 0xff_ff;
}

/**
 * Checks if a DNSSEC algorithm is recommended for use
 */
export function isRecommendedAlgorithm(algorithm: DNSSECAlgorithm): boolean {
    const recommended = [
        DNSSECAlgorithm.RSASHA256,
        DNSSECAlgorithm.RSASHA512,
        DNSSECAlgorithm.ECDSAP256SHA256,
        DNSSECAlgorithm.ECDSAP384SHA384,
        DNSSECAlgorithm.ED25519,
        DNSSECAlgorithm.ED448,
    ];

    return arrayIncludes(recommended, algorithm);
}

/**
 * Checks if a digest algorithm is recommended for use
 */
export function isRecommendedDigestAlgorithm(
    algorithm: DigestAlgorithm
): boolean {
    const recommended = [DigestAlgorithm.SHA256, DigestAlgorithm.SHA384];

    return arrayIncludes(recommended, algorithm);
}

/**
 * Validates a DNSKEY record
 *
 * @throws DNSValidationError When the DNSKEY record is invalid.
 */
export function validateDNSKEY(record: unknown): DNSKEYRecord {
    if (!isRecordObject(record)) {
        throw new DNSValidationError(
            "DNSKEY record must be an object",
            "INVALID_DNSKEY_STRUCTURE"
        );
    }

    const flags = getRequiredIntegerField(
        record,
        "flags",
        "INVALID_DNSKEY_FLAGS",
        0,
        65_535
    );

    // Validate protocol (must be 3 for DNSSEC)
    const protocol = record["protocol"];
    if (
        typeof protocol !== "number" ||
        !isInteger(protocol) ||
        protocol !== 3
    ) {
        throw new DNSValidationError(
            "DNSKEY protocol must be 3 for DNSSEC",
            "INVALID_DNSKEY_PROTOCOL",
            "protocol",
            protocol
        );
    }

    const algorithm = getRequiredIntegerField(
        record,
        "algorithm",
        "INVALID_DNSKEY_ALGORITHM",
        1,
        16
    );

    const publicKey = getRequiredStringField(
        record,
        "publicKey",
        "INVALID_DNSKEY_PUBLIC_KEY",
        "DNSKEY record must have a valid publicKey"
    );

    // Public key should be base64-encoded
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- helper intentionally kept with other local utilities
    if (!isBase64Text(publicKey)) {
        throw new DNSValidationError(
            "DNSKEY publicKey must be base64-encoded",
            "INVALID_DNSKEY_PUBLIC_KEY_FORMAT",
            "publicKey",
            publicKey
        );
    }

    return {
        algorithm,
        flags,
        protocol,
        publicKey,
        type: "DNSKEY",
    };
}

/**
 * Validates a DS record
 *
 * @throws DNSValidationError When the DS record is invalid.
 */
export function validateDS(record: unknown): DSRecord {
    if (!isRecordObject(record)) {
        throw new DNSValidationError(
            "DS record must be an object",
            "INVALID_DS_STRUCTURE"
        );
    }

    const keyTag = getRequiredIntegerField(
        record,
        "keyTag",
        "INVALID_DS_KEY_TAG",
        0,
        65_535
    );
    const algorithm = getRequiredIntegerField(
        record,
        "algorithm",
        "INVALID_DS_ALGORITHM",
        1,
        16
    );
    const digestType = getRequiredIntegerField(
        record,
        "digestType",
        "INVALID_DS_DIGEST_TYPE",
        1,
        4
    );
    const digest = getRequiredStringField(
        record,
        "digest",
        "INVALID_DS_DIGEST",
        "DS record must have a valid digest"
    );

    // Digest should be hexadecimal
    if (!/^[\da-f]+$/iv.test(digest)) {
        throw new DNSValidationError(
            "DS digest must be hexadecimal",
            "INVALID_DS_DIGEST_FORMAT",
            "digest",
            digest
        );
    }

    // Validate digest length based on digest type
    const expectedLengths: Record<number, number> = {
        1: 40, // SHA-1: 20 bytes = 40 hex chars
        2: 64, // SHA-256: 32 bytes = 64 hex chars
        3: 64, // GOST: 32 bytes = 64 hex chars
        4: 96, // SHA-384: 48 bytes = 96 hex chars
    };

    const expectedLength = expectedLengths[digestType];
    if (isDefined(expectedLength) && digest.length !== expectedLength) {
        throw new DNSValidationError(
            `DS digest length must be ${expectedLength} characters for digest type ${digestType}`,
            "INVALID_DS_DIGEST_LENGTH",
            "digest",
            digest
        );
    }

    return {
        algorithm,
        digest,
        digestType,
        keyTag,
        type: "DS",
    };
}

/**
 * Validates an NSEC record
 *
 * @throws DNSValidationError When the NSEC record is invalid.
 */
export function validateNSEC(record: unknown): NSECRecord {
    if (!isRecordObject(record)) {
        throw new DNSValidationError(
            "NSEC record must be an object",
            "INVALID_NSEC_STRUCTURE"
        );
    }

    const nextDomainName = getRequiredStringField(
        record,
        "nextDomainName",
        "INVALID_NSEC_NEXT_DOMAIN",
        "NSEC record must have a valid nextDomainName"
    );

    // Basic domain name validation
    // eslint-disable-next-line security/detect-unsafe-regex -- bounded hostname tokens; catastrophic backtracking not applicable here
    if (!/^(?:[\d\-A-Za-z]+\.)*[\d\-A-Za-z]+\.?$/v.test(nextDomainName)) {
        throw new DNSValidationError(
            "NSEC nextDomainName must be a valid domain name",
            "INVALID_NSEC_DOMAIN_FORMAT",
            "nextDomainName",
            nextDomainName
        );
    }

    const types = getRequiredStringArrayField(
        record,
        "types",
        "INVALID_NSEC_TYPES",
        "NSEC types must be an array"
    );

    const validTypes = new Set([
        "A",
        "A6",
        "AAAA",
        "AFSDB",
        "APL",
        "ATMA",
        "CDNSKEY",
        "CDS",
        "CERT",
        "CNAME",
        "CSYNC",
        "DHCID",
        "DNAME",
        "DNSKEY",
        "DS",
        "EID",
        "GPOS",
        "HINFO",
        "HIP",
        "HTTPS",
        "IPSECKEY",
        "ISDN",
        "KEY",
        "KX",
        "LOC",
        "MB",
        "MD",
        "MF",
        "MG",
        "MINFO",
        "MR",
        "MX",
        "NAPTR",
        "NIMLOC",
        "NINFO",
        "NS",
        "NSAP",
        "NSAP-PTR",
        "NSEC",
        "NSEC3",
        "NSEC3PARAM",
        "NULL",
        "NXT",
        "OPENPGPKEY",
        "OPT",
        "PTR",
        "PX",
        "RKEY",
        "RP",
        "RRSIG",
        "RT",
        "SIG",
        "SINK",
        "SOA",
        "SRV",
        "SSHFP",
        "SVCB",
        "TALINK",
        "TLSA",
        "TXT",
        "WKS",
        "X25",
        "ZONEMD",
    ]);

    for (const type of types) {
        if (!setHas(validTypes, type)) {
            throw new DNSValidationError(
                `NSEC type "${String(type)}" is not a valid DNS record type`,
                "INVALID_NSEC_TYPE",
                "types",
                type
            );
        }
    }

    return {
        nextDomainName,
        type: "NSEC",
        typeBitMaps: types,
        // Deprecated alias for backward compatibility
        types,
    };
}

/**
 * Validates an NSEC3 record
 *
 * @throws DNSValidationError When the NSEC3 record is invalid.
 */
export function validateNSEC3(record: unknown): NSEC3Record {
    if (!isRecordObject(record)) {
        throw new DNSValidationError(
            "NSEC3 record must be an object",
            "INVALID_NSEC3_STRUCTURE"
        );
    }

    const hashAlgorithm = getRequiredIntegerField(
        record,
        "hashAlgorithm",
        "INVALID_NSEC3_HASH_ALGORITHM",
        1,
        1
    );
    if (hashAlgorithm !== 1) {
        throw new DNSValidationError(
            "NSEC3 hashAlgorithm must be 1 (SHA-1)", // DevSkim: ignore DS126858
            "INVALID_NSEC3_HASH_ALGORITHM",
            "hashAlgorithm",
            hashAlgorithm
        );
    }

    const flags = getRequiredIntegerField(
        record,
        "flags",
        "INVALID_NSEC3_FLAGS",
        0,
        255
    );
    const iterations = getRequiredIntegerField(
        record,
        "iterations",
        "INVALID_NSEC3_ITERATIONS",
        0,
        65_535
    );
    const salt = getRequiredStringField(
        record,
        "salt",
        "INVALID_NSEC3_SALT_TYPE",
        "NSEC3 salt must be a string"
    );
    if (salt !== "-" && !/^[\da-f]*$/iv.test(salt)) {
        throw new DNSValidationError(
            'NSEC3 salt must be hexadecimal or "-" for no salt',
            "INVALID_NSEC3_SALT_FORMAT",
            "salt",
            salt
        );
    }

    const nextHashedOwnerName = getRequiredStringField(
        record,
        "nextHashedOwnerName",
        "INVALID_NSEC3_NEXT_HASHED_NAME",
        "NSEC3 record must have a valid nextHashedOwnerName"
    );

    // Should be base32-encoded
    if (!/^[2-7A-Z]+=*$/v.test(nextHashedOwnerName)) {
        throw new DNSValidationError(
            "NSEC3 nextHashedOwnerName must be base32-encoded",
            "INVALID_NSEC3_NEXT_HASHED_FORMAT",
            "nextHashedOwnerName",
            nextHashedOwnerName
        );
    }

    const types = getRequiredStringArrayField(
        record,
        "types",
        "INVALID_NSEC3_TYPES",
        "NSEC3 types must be an array"
    );

    const validTypes = new Set([
        "A",
        "A6",
        "AAAA",
        "AFSDB",
        "APL",
        "ATMA",
        "CDNSKEY",
        "CDS",
        "CERT",
        "CNAME",
        "CSYNC",
        "DHCID",
        "DNAME",
        "DNSKEY",
        "DS",
        "EID",
        "GPOS",
        "HINFO",
        "HIP",
        "HTTPS",
        "IPSECKEY",
        "ISDN",
        "KEY",
        "KX",
        "LOC",
        "MB",
        "MD",
        "MF",
        "MG",
        "MINFO",
        "MR",
        "MX",
        "NAPTR",
        "NIMLOC",
        "NINFO",
        "NS",
        "NSAP",
        "NSAP-PTR",
        "NSEC",
        "NSEC3",
        "NSEC3PARAM",
        "NULL",
        "NXT",
        "OPENPGPKEY",
        "OPT",
        "PTR",
        "PX",
        "RKEY",
        "RP",
        "RRSIG",
        "RT",
        "SIG",
        "SINK",
        "SOA",
        "SRV",
        "SSHFP",
        "SVCB",
        "TALINK",
        "TLSA",
        "TXT",
        "WKS",
        "X25",
        "ZONEMD",
    ]);

    for (const type of types) {
        if (!setHas(validTypes, type)) {
            throw new DNSValidationError(
                `NSEC3 type "${String(type)}" is not a valid DNS record type`,
                "INVALID_NSEC3_TYPE",
                "types",
                type
            );
        }
    }

    return {
        flags,
        hashAlgorithm,
        iterations,
        nextHashedOwnerName,
        salt,
        type: "NSEC3",
        typeBitMaps: types,
        // Deprecated alias for backward compatibility
        types,
    };
}

/**
 * Validates an NSEC3PARAM record
 *
 * @throws DNSValidationError When the NSEC3PARAM record is invalid.
 */
export function validateNSEC3PARAM(record: unknown): NSEC3PARAMRecord {
    if (!isRecordObject(record)) {
        throw new DNSValidationError(
            "NSEC3PARAM record must be an object",
            "INVALID_NSEC3PARAM_STRUCTURE"
        );
    }

    const hashAlgorithm = getRequiredIntegerField(
        record,
        "hashAlgorithm",
        "INVALID_NSEC3PARAM_HASH_ALGORITHM",
        1,
        1
    );
    if (hashAlgorithm !== 1) {
        throw new DNSValidationError(
            "NSEC3PARAM hashAlgorithm must be 1 (SHA-1)", // DevSkim: ignore DS126858
            "INVALID_NSEC3PARAM_HASH_ALGORITHM",
            "hashAlgorithm",
            hashAlgorithm
        );
    }

    const flags = getRequiredIntegerField(
        record,
        "flags",
        "INVALID_NSEC3PARAM_FLAGS",
        0,
        255
    );
    const iterations = getRequiredIntegerField(
        record,
        "iterations",
        "INVALID_NSEC3PARAM_ITERATIONS",
        0,
        65_535
    );
    const salt = getRequiredStringField(
        record,
        "salt",
        "INVALID_NSEC3PARAM_SALT_TYPE",
        "NSEC3PARAM salt must be a string"
    );

    if (salt !== "-" && !/^[\da-f]*$/iv.test(salt)) {
        throw new DNSValidationError(
            'NSEC3PARAM salt must be hexadecimal or "-" for no salt',
            "INVALID_NSEC3PARAM_SALT_FORMAT",
            "salt",
            salt
        );
    }

    return {
        flags,
        hashAlgorithm,
        iterations,
        salt,
        type: "NSEC3PARAM",
    };
}

/**
 * Validates a RRSIG record
 *
 * @throws DNSValidationError When the RRSIG record is invalid.
 */
export function validateRRSIG(record: unknown): RRSIGRecord {
    if (!isRecordObject(record)) {
        throw new DNSValidationError(
            "RRSIG record must be an object",
            "INVALID_RRSIG_STRUCTURE"
        );
    }

    const typeCovered = getRequiredStringField(
        record,
        "typeCovered",
        "INVALID_RRSIG_TYPE_COVERED",
        "RRSIG record must have a valid typeCovered field"
    );
    const algorithm = getRequiredIntegerField(
        record,
        "algorithm",
        "INVALID_RRSIG_ALGORITHM",
        1,
        16
    );
    const labels = getRequiredIntegerField(
        record,
        "labels",
        "INVALID_RRSIG_LABELS",
        0,
        127
    );
    const originalTTL = getRequiredIntegerField(
        record,
        "originalTTL",
        "INVALID_RRSIG_TTL",
        0,
        Number.MAX_SAFE_INTEGER
    );
    const signatureExpiration = getRequiredIntegerField(
        record,
        "signatureExpiration",
        "INVALID_RRSIG_EXPIRATION",
        0,
        Number.MAX_SAFE_INTEGER
    );
    const signatureInception = getRequiredIntegerField(
        record,
        "signatureInception",
        "INVALID_RRSIG_INCEPTION",
        0,
        Number.MAX_SAFE_INTEGER
    );

    if (signatureInception >= signatureExpiration) {
        throw new DNSValidationError(
            "RRSIG signatureInception must be before signatureExpiration",
            "INVALID_RRSIG_TIMESTAMP_ORDER"
        );
    }

    const keyTag = getRequiredIntegerField(
        record,
        "keyTag",
        "INVALID_RRSIG_KEY_TAG",
        0,
        65_535
    );
    const signerName = getRequiredStringField(
        record,
        "signerName",
        "INVALID_RRSIG_SIGNER_NAME",
        "RRSIG record must have a valid signerName"
    );

    // Basic domain name validation for signer
    // eslint-disable-next-line security/detect-unsafe-regex -- bounded hostname tokens; catastrophic backtracking not applicable here
    if (!/^(?:[\d\-A-Za-z]+\.)*[\d\-A-Za-z]+\.?$/v.test(signerName)) {
        throw new DNSValidationError(
            "RRSIG signerName must be a valid domain name",
            "INVALID_RRSIG_SIGNER_FORMAT",
            "signerName",
            signerName
        );
    }

    const signature = getRequiredStringField(
        record,
        "signature",
        "INVALID_RRSIG_SIGNATURE",
        "RRSIG record must have a valid signature"
    );

    // Signature should be base64-encoded
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- helper intentionally kept with other local utilities
    if (!isBase64Text(signature)) {
        throw new DNSValidationError(
            "RRSIG signature must be base64-encoded",
            "INVALID_RRSIG_SIGNATURE_FORMAT",
            "signature",
            signature
        );
    }

    return {
        algorithm,
        keyTag,
        labels,
        originalTTL,
        signature,
        signatureExpiration,
        signatureInception,
        signerName,
        type: "RRSIG",
        typeCovered,
    };
}

/**
 * Validates DNSSEC signature timestamps
 */
export function validateSignatureTimestamps(
    inception: number,
    expiration: number,
    clockSkew = 300
): boolean {
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

function isBase64Text(value: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-misused-spread -- base64 is ASCII-only in this context
    return [...value].every((character) => setHas(base64Characters, character));
}
