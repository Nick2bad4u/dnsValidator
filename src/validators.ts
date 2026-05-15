/**
 * DNS Record Validators
 *
 * This module provides validation functions for all supported DNS record types.
 * Each validator function performs type checking and format validation
 * according to DNS standards and RFCs.
 *
 * @example
 *
 * ```typescript
 * import { isARecord, isMXRecord } from "./validators";
 *
 * const aRecord = { type: "A", address: "192.168.1.1", ttl: 300 };
 * console.log(isARecord(aRecord)); // true
 * ```
 *
 * @packageDocumentation
 */

import type { UnknownRecord } from "type-fest";

import { isDefined, isEmpty, isInteger, keyIn } from "ts-extras";
import validator from "validator";

import type {
    AAAARecord,
    ANYRecord,
    ARecord,
    CAARecord,
    CNAMERecord,
    DNSRecord,
    MXRecord,
    NAPTRRecord,
    NSRecord,
    PTRRecord,
    SOARecord,
    SRVRecord,
    TLSARecord,
    TXTRecord,
    ValidationResult,
} from "./types";

import {
    isDNSKEYRecord,
    isDSRecord,
    isNSEC3Record,
    isNSECRecord,
    isRRSIGRecord,
    isSSHFPRecord,
} from "./dnssec-validators";
import {
    isValidCAAFlags,
    isValidHexString,
    isValidNAPTRFlags,
    isValidPort,
    isValidPriority,
    isValidTextRecord,
    isValidTLSAMatchingType,
    isValidTLSASelector,
    isValidTLSAUsage,
    isValidTTL,
    isValidWeight,
} from "./utils";

/**
 * Validates an AAAA record (IPv6 address mapping).
 *
 * Checks that the record has the correct type, a valid IPv6 address, and an
 * optional valid TTL value.
 *
 * @example
 *
 * ```typescript
 * const record = { type: "AAAA", address: "2001:db8::1", ttl: 300 };
 * console.log(isAAAARecord(record)); // true
 *
 * const invalid = { type: "AAAA", address: "192.168.1.1" };
 * console.log(isAAAARecord(invalid)); // false
 * ```
 *
 * @param record - The record to validate
 *
 * @returns True if the record is a valid AAAA record
 *
 * @public
 */
export function isAAAARecord(record: unknown): record is AAAARecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "AAAA" &&
        typeof r["address"] === "string" &&
        validator.isIP(r["address"], 6) &&
        (!isDefined(r["ttl"]) || isValidTTL(r["ttl"] as number))
    );
}

/**
 * Validates an ANY record (can be any type)
 */
export function isANYRecord(record: unknown): record is ANYRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);
    if (r["type"] !== "ANY") return false;

    const hasValue = isDefined(r["value"]);
    const hasRecordsArray = Array.isArray(r["records"]);
    const recordsValid = hasRecordsArray
        ? (r["records"] as unknown[]).every((entry) =>
              Boolean(
                  entry &&
                  typeof entry === "object" &&
                  keyIn(entry as UnknownRecord, "type")
              )
          )
        : false;

    return Boolean(
        (hasValue || recordsValid) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates an A record (IPv4 address mapping).
 *
 * Checks that the record has the correct type, a valid IPv4 address, and an
 * optional valid TTL value.
 *
 * @example
 *
 * ```typescript
 * const record = { type: "A", address: "192.168.1.1", ttl: 300 };
 * console.log(isARecord(record)); // true
 *
 * const invalid = { type: "A", address: "999.999.999.999" };
 * console.log(isARecord(invalid)); // false
 * ```
 *
 * @param record - The record to validate
 *
 * @returns True if the record is a valid A record
 *
 * @public
 */
export function isARecord(record: unknown): record is ARecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "A" &&
        typeof r["address"] === "string" &&
        validator.isIP(r["address"], 4) &&
        (!isDefined(r["ttl"]) || isValidTTL(r["ttl"] as number))
    );
}

/**
 * Validates a CAA record
 */
export function isCAARecord(record: unknown): record is CAARecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    if (
        r["type"] !== "CAA" ||
        typeof r["critical"] !== "number" ||
        !isValidCAAFlags(r["critical"])
    ) {
        return false;
    }

    // At least one CAA property should be present
    const hasValidProperty =
        (isDefined(r["issue"]) && typeof r["issue"] === "string") ||
        (isDefined(r["issuewild"]) && typeof r["issuewild"] === "string") ||
        (isDefined(r["iodef"]) && typeof r["iodef"] === "string") ||
        (isDefined(r["contactemail"]) &&
            typeof r["contactemail"] === "string" &&
            validator.isEmail(r["contactemail"])) ||
        (isDefined(r["contactphone"]) && typeof r["contactphone"] === "string");

    return (
        hasValidProperty &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates a CNAME record (canonical name alias).
 *
 * Checks that the record has the correct type, a valid fully qualified domain
 * name, and an optional valid TTL value.
 *
 * @example
 *
 * ```typescript
 * const record = {
 *     type: "CNAME",
 *     value: "canonical.example.com",
 *     ttl: 300,
 * };
 * console.log(isCNAMERecord(record)); // true
 *
 * const invalid = { type: "CNAME", value: "not-a-domain" };
 * console.log(isCNAMERecord(invalid)); // false
 * ```
 *
 * @param record - The record to validate
 *
 * @returns True if the record is a valid CNAME record
 *
 * @public
 */
export function isCNAMERecord(record: unknown): record is CNAMERecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "CNAME" &&
        typeof r["value"] === "string" &&
        validator.isFQDN(r["value"], { require_tld: true }) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates any DNS record based on its type
 */
export function isDNSRecord(record: unknown): record is DNSRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    switch (r["type"]) {
        case "A": {
            return isARecord(record);
        }
        case "AAAA": {
            return isAAAARecord(record);
        }
        case "ANY": {
            return isANYRecord(record);
        }
        case "CAA": {
            return isCAARecord(record);
        }
        case "CNAME": {
            return isCNAMERecord(record);
        }
        case "DNSKEY": {
            return isDNSKEYRecord(record);
        }
        case "DS": {
            return isDSRecord(record);
        }
        case "MX": {
            return isMXRecord(record);
        }
        case "NAPTR": {
            return isNAPTRRecord(record);
        }
        case "NS": {
            return isNSRecord(record);
        }
        case "NSEC": {
            return isNSECRecord(record);
        }
        case "NSEC3": {
            return isNSEC3Record(record);
        }
        case "PTR": {
            return isPTRRecord(record);
        }
        case "RRSIG": {
            return isRRSIGRecord(record);
        }
        case "SOA": {
            return isSOARecord(record);
        }
        case "SRV": {
            return isSRVRecord(record);
        }
        case "SSHFP": {
            return isSSHFPRecord(record);
        }
        case "TLSA": {
            return isTLSARecord(record);
        }
        case "TXT": {
            return isTXTRecord(record);
        }
        default: {
            return false;
        }
    }
}

/**
 * Validates an MX record
 */
export function isMXRecord(record: unknown): record is MXRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "MX" &&
        typeof r["exchange"] === "string" &&
        validator.isFQDN(r["exchange"], { require_tld: true }) &&
        typeof r["priority"] === "number" &&
        isValidPriority(r["priority"]) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates a NAPTR record
 */
export function isNAPTRRecord(record: unknown): record is NAPTRRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "NAPTR" &&
        typeof r["order"] === "number" &&
        isInteger(r["order"]) &&
        r["order"] >= 0 &&
        r["order"] <= 65_535 &&
        typeof r["preference"] === "number" &&
        isInteger(r["preference"]) &&
        r["preference"] >= 0 &&
        r["preference"] <= 65_535 &&
        typeof r["flags"] === "string" &&
        isValidNAPTRFlags(r["flags"]) &&
        typeof r["service"] === "string" &&
        typeof r["regexp"] === "string" &&
        typeof r["replacement"] === "string" &&
        (r["replacement"] === "" ||
            validator.isFQDN(r["replacement"], { require_tld: true })) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates an NS record
 */
export function isNSRecord(record: unknown): record is NSRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "NS" &&
        typeof r["value"] === "string" &&
        validator.isFQDN(r["value"], { require_tld: true }) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates a PTR record
 */
export function isPTRRecord(record: unknown): record is PTRRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "PTR" &&
        typeof r["value"] === "string" &&
        validator.isFQDN(r["value"], { require_tld: true }) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates an SOA record
 */
export function isSOARecord(record: unknown): record is SOARecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);
    if (r["type"] !== "SOA") return false;

    // Support either internal canonical field names (primary, admin, expiration, minimum)
    // or Node.js dns.resolveSoa field names (nsname, hostmaster, expire, minttl)
    const primary =
        (typeof r["primary"] === "string" && r["primary"]) ||
        (typeof r["nsname"] === "string" && r["nsname"]);
    const admin =
        (typeof r["admin"] === "string" && r["admin"]) ||
        (typeof r["hostmaster"] === "string" && r["hostmaster"]);
    const expiration =
        (typeof r["expiration"] === "number" && r["expiration"]) ||
        (typeof r["expire"] === "number" && r["expire"]);
    const minimum =
        (typeof r["minimum"] === "number" && r["minimum"]) ||
        (typeof r["minttl"] === "number" && r["minttl"]);

    return Boolean(
        primary &&
        validator.isFQDN(primary, { require_tld: true }) &&
        admin &&
        // Convert first dot to @ for validation heuristic; SOA hostmaster uses dot format
        validator.isEmail(admin.replace(/\./v, "@")) &&
        typeof r["serial"] === "number" &&
        isInteger(r["serial"]) &&
        r["serial"] >= 0 &&
        typeof r["refresh"] === "number" &&
        isInteger(r["refresh"]) &&
        r["refresh"] >= 0 &&
        typeof r["retry"] === "number" &&
        isInteger(r["retry"]) &&
        r["retry"] >= 0 &&
        typeof expiration === "number" &&
        isInteger(expiration) &&
        expiration >= 0 &&
        typeof minimum === "number" &&
        isInteger(minimum) &&
        minimum >= 0 &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates an SRV record
 */
export function isSRVRecord(record: unknown): record is SRVRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "SRV" &&
        typeof r["name"] === "string" &&
        validator.isFQDN(r["name"], { require_tld: true }) &&
        typeof r["priority"] === "number" &&
        isValidPriority(r["priority"]) &&
        typeof r["weight"] === "number" &&
        isValidWeight(r["weight"]) &&
        typeof r["port"] === "number" &&
        isValidPort(r["port"]) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates a TLSA record
 */
export function isTLSARecord(record: unknown): record is TLSARecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);
    if (r["type"] !== "TLSA") return false;

    const usage =
        typeof r["usage"] === "number"
            ? r["usage"]
            : typeof r["certUsage"] === "number"
              ? r["certUsage"]
              : undefined;
    const matching =
        typeof r["matchingType"] === "number"
            ? r["matchingType"]
            : typeof r["match"] === "number"
              ? r["match"]
              : undefined;
    const certData =
        (typeof r["certificate"] === "string" && r["certificate"]) ||
        (typeof r["data"] === "string" && r["data"]);

    const certOk =
        (typeof certData === "string" && isValidHexString(certData)) ||
        r["data"] instanceof ArrayBuffer ||
        r["data"] instanceof Uint8Array;

    return Boolean(
        isDefined(usage) &&
        isValidTLSAUsage(usage) &&
        typeof r["selector"] === "number" &&
        isValidTLSASelector(r["selector"]) &&
        isDefined(matching) &&
        isValidTLSAMatchingType(matching) &&
        certOk &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates a TXT record
 */
export function isTXTRecord(record: unknown): record is TXTRecord {
    if (!record || typeof record !== "object") {
        return false;
    }

    const r = toRecord(record);

    return (
        r["type"] === "TXT" &&
        Array.isArray(r["entries"]) &&
        r["entries"].every(
            (entry: unknown) =>
                typeof entry === "string" && isValidTextRecord(entry)
        ) &&
        (!isDefined(r["ttl"]) ||
            (typeof r["ttl"] === "number" && isValidTTL(r["ttl"])))
    );
}

/**
 * Validates a DNS record and returns detailed validation result
 */
export function validateDNSRecord(record: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!record || typeof record !== "object") {
        errors.push("Record must be an object");
        return { errors, isValid: false, warnings };
    }

    const r = toRecord(record);

    if (!r["type"] || typeof r["type"] !== "string") {
        errors.push("Record must have a valid type field");
        return { errors, isValid: false, warnings };
    }

    const recordType = r["type"];

    if (!isDNSRecord(record)) {
        errors.push(
            `Invalid ${recordType} record: Please check required fields and value formats`
        );

        // Add specific suggestions based on record type
        switch (recordType) {
            case "A": {
                errors.push(
                    "A records require: type='A', address (valid IPv4), optional ttl"
                );
                break;
            }
            case "AAAA": {
                errors.push(
                    "AAAA records require: type='AAAA', address (valid IPv6), optional ttl"
                );
                break;
            }
            case "CAA": {
                errors.push(
                    "CAA records require: type='CAA', critical (0-255), and at least one property (issue, issuewild, iodef, etc.)"
                );
                break;
            }
            case "CNAME": {
                errors.push(
                    "CNAME records require: type='CNAME', value (valid FQDN), optional ttl"
                );
                break;
            }
            case "DNSKEY": {
                errors.push(
                    "DNSKEY records require: type='DNSKEY', flags (0-65535), protocol (3), algorithm (valid DNSSEC), publicKey (hex string)"
                );
                break;
            }
            case "DS": {
                errors.push(
                    "DS records require: type='DS', keyTag (0-65535), algorithm (valid DNSSEC), digestType (1-4), digest (hex string)"
                );
                break;
            }
            case "MX": {
                errors.push(
                    "MX records require: type='MX', priority (0-65535), exchange (valid FQDN), optional ttl"
                );
                break;
            }
            case "NAPTR": {
                errors.push(
                    "NAPTR records require: type='NAPTR', order, preference, flags, service, regexp, replacement"
                );
                break;
            }
            case "NS": {
                errors.push(
                    "NS records require: type='NS', value (valid FQDN), optional ttl"
                );
                break;
            }
            case "NSEC": {
                errors.push(
                    "NSEC records require: type='NSEC', nextDomainName (valid FQDN), typeBitMaps (array of strings)"
                );
                break;
            }
            case "NSEC3": {
                errors.push(
                    "NSEC3 records require: type='NSEC3', hashAlgorithm (1), flags (0-255), iterations (0-65535), salt (hex), nextHashedOwnerName, typeBitMaps"
                );
                break;
            }
            case "PTR": {
                errors.push(
                    "PTR records require: type='PTR', value (valid FQDN), optional ttl"
                );
                break;
            }
            case "RRSIG": {
                errors.push(
                    "RRSIG records require: type='RRSIG', typeCovered, algorithm, labels, originalTTL, signatureExpiration, signatureInception, keyTag, signerName, signature"
                );
                break;
            }
            case "SOA": {
                errors.push(
                    "SOA records require: type='SOA', (primary|nsname), (admin|hostmaster), serial, refresh, retry, (expiration|expire), (minimum|minttl), optional ttl"
                );
                break;
            }
            case "SRV": {
                errors.push(
                    "SRV records require: type='SRV', priority, weight, port, name (valid FQDN), optional ttl"
                );
                break;
            }
            case "SSHFP": {
                errors.push(
                    "SSHFP records require: type='SSHFP', algorithm (1,2,3,4,6), fpType (1,2), fingerprint (hex string)"
                );
                break;
            }
            case "TLSA": {
                errors.push(
                    "TLSA records require: type='TLSA', (usage|certUsage) (0-3), selector (0-1), (matchingType|match) (0-2), (certificate|data) (hex string or binary)"
                );
                break;
            }
            case "TXT": {
                errors.push(
                    "TXT records require: type='TXT', entries (array of strings), optional ttl"
                );
                break;
            }
            default: {
                errors.push(
                    `Unsupported record type: ${recordType}. Supported types: A, AAAA, CNAME, MX, TXT, NS, PTR, SOA, SRV, CAA, NAPTR, TLSA, DNSKEY, DS, NSEC, NSEC3, RRSIG, SSHFP, ANY`
                );
            }
        }
    }

    return {
        errors,
        isValid: isEmpty(errors),
        warnings,
    };
}

/**
 * Helper function to safely cast unknown to a record type.
 *
 * @internal
 */
function toRecord(obj: unknown): UnknownRecord {
    return obj as UnknownRecord;
}
