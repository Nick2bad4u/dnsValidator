"use strict";
/**
 * DNS Record Validators
 *
 * This module provides validation functions for all supported DNS record types.
 * Each validator function performs type checking and format validation according
 * to DNS standards and RFCs.
 *
 * @example
 * ```typescript
 * import { isARecord, isMXRecord } from './validators';
 *
 * const aRecord = { type: 'A', address: '192.168.1.1', ttl: 300 };
 * console.log(isARecord(aRecord)); // true
 * ```
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isARecord = isARecord;
exports.isAAAARecord = isAAAARecord;
exports.isCNAMERecord = isCNAMERecord;
exports.isMXRecord = isMXRecord;
exports.isTXTRecord = isTXTRecord;
exports.isNSRecord = isNSRecord;
exports.isPTRRecord = isPTRRecord;
exports.isSOARecord = isSOARecord;
exports.isSRVRecord = isSRVRecord;
exports.isCAARecord = isCAARecord;
exports.isNAPTRRecord = isNAPTRRecord;
exports.isTLSARecord = isTLSARecord;
exports.isANYRecord = isANYRecord;
exports.isDNSRecord = isDNSRecord;
exports.validateDNSRecord = validateDNSRecord;
const validator_1 = __importDefault(require("validator"));
const utils_1 = require("./utils");
const dnssec_validators_1 = require("./dnssec-validators");
/**
 * Helper function to safely cast unknown to a record type.
 *
 * @internal
 */
function toRecord(obj) {
    return obj;
}
/**
 * Validates an A record (IPv4 address mapping).
 *
 * Checks that the record has the correct type, a valid IPv4 address,
 * and an optional valid TTL value.
 *
 * @param record - The record to validate
 * @returns True if the record is a valid A record
 *
 * @example
 * ```typescript
 * const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
 * console.log(isARecord(record)); // true
 *
 * const invalid = { type: 'A', address: '999.999.999.999' };
 * console.log(isARecord(invalid)); // false
 * ```
 *
 * @public
 */
function isARecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'A' &&
        typeof r['address'] === 'string' &&
        validator_1.default['isIP'](r['address'], 4) &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates an AAAA record (IPv6 address mapping).
 *
 * Checks that the record has the correct type, a valid IPv6 address,
 * and an optional valid TTL value.
 *
 * @param record - The record to validate
 * @returns True if the record is a valid AAAA record
 *
 * @example
 * ```typescript
 * const record = { type: 'AAAA', address: '2001:db8::1', ttl: 300 };
 * console.log(isAAAARecord(record)); // true
 *
 * const invalid = { type: 'AAAA', address: '192.168.1.1' };
 * console.log(isAAAARecord(invalid)); // false
 * ```
 *
 * @public
 */
function isAAAARecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'AAAA' &&
        typeof r['address'] === 'string' &&
        validator_1.default['isIP'](r['address'], 6) &&
        (r['ttl'] === undefined || (0, utils_1.isValidTTL)(r['ttl'])));
}
/**
 * Validates a CNAME record (canonical name alias).
 *
 * Checks that the record has the correct type, a valid fully qualified domain name,
 * and an optional valid TTL value.
 *
 * @param record - The record to validate
 * @returns True if the record is a valid CNAME record
 *
 * @example
 * ```typescript
 * const record = { type: 'CNAME', value: 'canonical.example.com', ttl: 300 };
 * console.log(isCNAMERecord(record)); // true
 *
 * const invalid = { type: 'CNAME', value: 'not-a-domain' };
 * console.log(isCNAMERecord(invalid)); // false
 * ```
 *
 * @public
 */
function isCNAMERecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'CNAME' &&
        typeof r['value'] === 'string' &&
        validator_1.default['isFQDN'](r['value'], { require_tld: true }) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates an MX record
 */
function isMXRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'MX' &&
        typeof r['exchange'] === 'string' &&
        validator_1.default['isFQDN'](r['exchange'], { require_tld: true }) &&
        typeof r['priority'] === 'number' &&
        (0, utils_1.isValidPriority)(r['priority']) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates a TXT record
 */
function isTXTRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'TXT' &&
        Array.isArray(r['entries']) &&
        r['entries'].every((entry) => typeof entry === 'string' && (0, utils_1.isValidTextRecord)(entry)) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates an NS record
 */
function isNSRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'NS' &&
        typeof r['value'] === 'string' &&
        validator_1.default['isFQDN'](r['value'], { require_tld: true }) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates a PTR record
 */
function isPTRRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'PTR' &&
        typeof r['value'] === 'string' &&
        validator_1.default['isFQDN'](r['value'], { require_tld: true }) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates an SOA record
 */
function isSOARecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    if (r['type'] !== 'SOA')
        return false;
    // Support either internal canonical field names (primary, admin, expiration, minimum)
    // or Node.js dns.resolveSoa field names (nsname, hostmaster, expire, minttl)
    const primary = (typeof r['primary'] === 'string' && r['primary']) ||
        (typeof r['nsname'] === 'string' && r['nsname']);
    const admin = (typeof r['admin'] === 'string' && r['admin']) ||
        (typeof r['hostmaster'] === 'string' && r['hostmaster']);
    const expiration = (typeof r['expiration'] === 'number' && r['expiration']) ||
        (typeof r['expire'] === 'number' && r['expire']);
    const minimum = (typeof r['minimum'] === 'number' && r['minimum']) ||
        (typeof r['minttl'] === 'number' && r['minttl']);
    return !!(primary &&
        validator_1.default['isFQDN'](primary, { require_tld: true }) &&
        admin &&
        // Convert first dot to @ for validation heuristic; SOA hostmaster uses dot format
        validator_1.default['isEmail'](admin.replace(/\./, '@')) &&
        typeof r['serial'] === 'number' &&
        Number['isInteger'](r['serial']) &&
        r['serial'] >= 0 &&
        typeof r['refresh'] === 'number' &&
        Number['isInteger'](r['refresh']) &&
        r['refresh'] >= 0 &&
        typeof r['retry'] === 'number' &&
        Number['isInteger'](r['retry']) &&
        r['retry'] >= 0 &&
        typeof expiration === 'number' &&
        Number['isInteger'](expiration) &&
        expiration >= 0 &&
        typeof minimum === 'number' &&
        Number['isInteger'](minimum) &&
        minimum >= 0 &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates an SRV record
 */
function isSRVRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'SRV' &&
        typeof r['name'] === 'string' &&
        validator_1.default['isFQDN'](r['name'], { require_tld: true }) &&
        typeof r['priority'] === 'number' &&
        (0, utils_1.isValidPriority)(r['priority']) &&
        typeof r['weight'] === 'number' &&
        (0, utils_1.isValidWeight)(r['weight']) &&
        typeof r['port'] === 'number' &&
        (0, utils_1.isValidPort)(r['port']) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates a CAA record
 */
function isCAARecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    if (r['type'] !== 'CAA' ||
        !(typeof r['critical'] === 'number' && (0, utils_1.isValidCAAFlags)(r['critical']))) {
        return false;
    }
    // At least one CAA property should be present
    const hasValidProperty = (r['issue'] !== undefined && typeof r['issue'] === 'string') ||
        (r['issuewild'] !== undefined && typeof r['issuewild'] === 'string') ||
        (r['iodef'] !== undefined && typeof r['iodef'] === 'string') ||
        (r['contactemail'] !== undefined &&
            typeof r['contactemail'] === 'string' &&
            validator_1.default['isEmail'](r['contactemail'])) ||
        (r['contactphone'] !== undefined && typeof r['contactphone'] === 'string');
    return (hasValidProperty &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates a NAPTR record
 */
function isNAPTRRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    return (r['type'] === 'NAPTR' &&
        typeof r['order'] === 'number' &&
        Number['isInteger'](r['order']) &&
        r['order'] >= 0 &&
        r['order'] <= 65535 &&
        typeof r['preference'] === 'number' &&
        Number['isInteger'](r['preference']) &&
        r['preference'] >= 0 &&
        r['preference'] <= 65535 &&
        typeof r['flags'] === 'string' &&
        (0, utils_1.isValidNAPTRFlags)(r['flags']) &&
        typeof r['service'] === 'string' &&
        typeof r['regexp'] === 'string' &&
        typeof r['replacement'] === 'string' &&
        (r['replacement'] === '' ||
            validator_1.default['isFQDN'](r['replacement'], { require_tld: true })) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates a TLSA record
 */
function isTLSARecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    if (r['type'] !== 'TLSA')
        return false;
    const usage = typeof r['usage'] === 'number'
        ? r['usage']
        : typeof r['certUsage'] === 'number'
            ? r['certUsage']
            : undefined;
    const matching = typeof r['matchingType'] === 'number'
        ? r['matchingType']
        : typeof r['match'] === 'number'
            ? r['match']
            : undefined;
    const certData = (typeof r['certificate'] === 'string' && r['certificate']) ||
        (typeof r['data'] === 'string' && r['data']);
    const certOk = (typeof certData === 'string' && (0, utils_1.isValidHexString)(certData)) ||
        r['data'] instanceof ArrayBuffer ||
        r['data'] instanceof Uint8Array;
    return !!(usage !== undefined &&
        (0, utils_1.isValidTLSAUsage)(usage) &&
        typeof r['selector'] === 'number' &&
        (0, utils_1.isValidTLSASelector)(r['selector']) &&
        matching !== undefined &&
        (0, utils_1.isValidTLSAMatchingType)(matching) &&
        certOk &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates an ANY record (can be any type)
 */
function isANYRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    if (r['type'] !== 'ANY')
        return false;
    const hasValue = r['value'] !== undefined;
    const hasRecordsArray = Array['isArray'](r['records']);
    const recordsValid = hasRecordsArray
        ? r['records'].every(entry => entry && typeof entry === 'object' && 'type' in entry)
        : false;
    return !!((hasValue || recordsValid) &&
        (r['ttl'] === undefined ||
            (typeof r['ttl'] === 'number' && (0, utils_1.isValidTTL)(r['ttl']))));
}
/**
 * Validates any DNS record based on its type
 */
function isDNSRecord(record) {
    if (!record || typeof record !== 'object') {
        return false;
    }
    const r = toRecord(record);
    switch (r['type']) {
        case 'A':
            return isARecord(record);
        case 'AAAA':
            return isAAAARecord(record);
        case 'CNAME':
            return isCNAMERecord(record);
        case 'MX':
            return isMXRecord(record);
        case 'TXT':
            return isTXTRecord(record);
        case 'NS':
            return isNSRecord(record);
        case 'PTR':
            return isPTRRecord(record);
        case 'SOA':
            return isSOARecord(record);
        case 'SRV':
            return isSRVRecord(record);
        case 'CAA':
            return isCAARecord(record);
        case 'NAPTR':
            return isNAPTRRecord(record);
        case 'TLSA':
            return isTLSARecord(record);
        case 'ANY':
            return isANYRecord(record);
        case 'DNSKEY':
            return (0, dnssec_validators_1.isDNSKEYRecord)(record);
        case 'DS':
            return (0, dnssec_validators_1.isDSRecord)(record);
        case 'NSEC':
            return (0, dnssec_validators_1.isNSECRecord)(record);
        case 'NSEC3':
            return (0, dnssec_validators_1.isNSEC3Record)(record);
        case 'RRSIG':
            return (0, dnssec_validators_1.isRRSIGRecord)(record);
        case 'SSHFP':
            return (0, dnssec_validators_1.isSSHFPRecord)(record);
        default:
            return false;
    }
}
/**
 * Validates a DNS record and returns detailed validation result
 */
function validateDNSRecord(record) {
    const errors = [];
    const warnings = [];
    if (!record || typeof record !== 'object') {
        errors.push('Record must be an object');
        return { isValid: false, errors, warnings };
    }
    const r = toRecord(record);
    if (!r['type'] || typeof r['type'] !== 'string') {
        errors.push('Record must have a valid type field');
        return { isValid: false, errors, warnings };
    }
    const recordType = r['type'];
    if (!isDNSRecord(record)) {
        errors.push(`Invalid ${recordType} record: Please check required fields and value formats`);
        // Add specific suggestions based on record type
        switch (recordType) {
            case 'A':
                errors.push("A records require: type='A', address (valid IPv4), optional ttl");
                break;
            case 'AAAA':
                errors.push("AAAA records require: type='AAAA', address (valid IPv6), optional ttl");
                break;
            case 'MX':
                errors.push("MX records require: type='MX', priority (0-65535), exchange (valid FQDN), optional ttl");
                break;
            case 'CNAME':
                errors.push("CNAME records require: type='CNAME', value (valid FQDN), optional ttl");
                break;
            case 'TXT':
                errors.push("TXT records require: type='TXT', entries (array of strings), optional ttl");
                break;
            case 'NS':
                errors.push("NS records require: type='NS', value (valid FQDN), optional ttl");
                break;
            case 'PTR':
                errors.push("PTR records require: type='PTR', value (valid FQDN), optional ttl");
                break;
            case 'SOA':
                errors.push("SOA records require: type='SOA', (primary|nsname), (admin|hostmaster), serial, refresh, retry, (expiration|expire), (minimum|minttl), optional ttl");
                break;
            case 'SRV':
                errors.push("SRV records require: type='SRV', priority, weight, port, name (valid FQDN), optional ttl");
                break;
            case 'CAA':
                errors.push("CAA records require: type='CAA', critical (0-255), and at least one property (issue, issuewild, iodef, etc.)");
                break;
            case 'NAPTR':
                errors.push("NAPTR records require: type='NAPTR', order, preference, flags, service, regexp, replacement");
                break;
            case 'TLSA':
                errors.push("TLSA records require: type='TLSA', (usage|certUsage) (0-3), selector (0-1), (matchingType|match) (0-2), (certificate|data) (hex string or binary)");
                break;
            case 'DNSKEY':
                errors.push("DNSKEY records require: type='DNSKEY', flags (0-65535), protocol (3), algorithm (valid DNSSEC), publicKey (hex string)");
                break;
            case 'DS':
                errors.push("DS records require: type='DS', keyTag (0-65535), algorithm (valid DNSSEC), digestType (1-4), digest (hex string)");
                break;
            case 'NSEC':
                errors.push("NSEC records require: type='NSEC', nextDomainName (valid FQDN), typeBitMaps (array of strings)");
                break;
            case 'NSEC3':
                errors.push("NSEC3 records require: type='NSEC3', hashAlgorithm (1), flags (0-255), iterations (0-65535), salt (hex), nextHashedOwnerName, typeBitMaps");
                break;
            case 'RRSIG':
                errors.push("RRSIG records require: type='RRSIG', typeCovered, algorithm, labels, originalTTL, signatureExpiration, signatureInception, keyTag, signerName, signature");
                break;
            case 'SSHFP':
                errors.push("SSHFP records require: type='SSHFP', algorithm (1,2,3,4,6), fpType (1,2), fingerprint (hex string)");
                break;
            default:
                errors.push(`Unsupported record type: ${recordType}. Supported types: A, AAAA, CNAME, MX, TXT, NS, PTR, SOA, SRV, CAA, NAPTR, TLSA, DNSKEY, DS, NSEC, NSEC3, RRSIG, SSHFP, ANY`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
//# sourceMappingURL=validators.js.map