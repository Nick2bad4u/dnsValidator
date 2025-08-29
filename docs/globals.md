# DNS Validator

DNS Validator Library

A comprehensive TypeScript library for validating DNS query results and individual DNS records.
Supports validation of traditional DNS records (A, AAAA, MX, TXT, etc.) and DNSSEC records
(DNSKEY, DS, RRSIG, NSEC, etc.) with enhanced error reporting and performance optimization.

## Example

```typescript
import { isARecord, validateARecord } from 'dns-response-validator';

// Basic validation
const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
console.log(isARecord(record)); // true

// Enhanced validation with error details
const result = validateARecord(record);
console.log(result.isValid); // true
```

## Enumerations

- [DNSSECAlgorithm](enumerations/DNSSECAlgorithm.md)
- [DigestAlgorithm](enumerations/DigestAlgorithm.md)
- [NSEC3HashAlgorithm](enumerations/NSEC3HashAlgorithm.md)
- [DNSKEYFlags](enumerations/DNSKEYFlags.md)

## Classes

- [DNSValidationError](classes/DNSValidationError.md)
- [InvalidRecordTypeError](classes/InvalidRecordTypeError.md)
- [MalformedRecordError](classes/MalformedRecordError.md)
- [InvalidFieldValueError](classes/InvalidFieldValueError.md)
- [MissingRequiredFieldError](classes/MissingRequiredFieldError.md)
- [InvalidQueryStructureError](classes/InvalidQueryStructureError.md)
- [ValidationContext](classes/ValidationContext.md)
- [ValidationPerformanceTracker](classes/ValidationPerformanceTracker.md)

## Interfaces

- [DetailedValidationResult](interfaces/DetailedValidationResult.md)
- [ValidationMetrics](interfaces/ValidationMetrics.md)
- [BaseDNSRecord](interfaces/BaseDNSRecord.md)
- [ARecord](interfaces/ARecord.md)
- [AAAARecord](interfaces/AAAARecord.md)
- [CNAMERecord](interfaces/CNAMERecord.md)
- [MXRecord](interfaces/MXRecord.md)
- [TXTRecord](interfaces/TXTRecord.md)
- [NSRecord](interfaces/NSRecord.md)
- [PTRRecord](interfaces/PTRRecord.md)
- [SOARecord](interfaces/SOARecord.md)
- [SRVRecord](interfaces/SRVRecord.md)
- [CAARecord](interfaces/CAARecord.md)
- [NAPTRRecord](interfaces/NAPTRRecord.md)
- [TLSARecord](interfaces/TLSARecord.md)
- [ANYRecord](interfaces/ANYRecord.md)
- [DNSKEYRecord](interfaces/DNSKEYRecord.md)
- [DSRecord](interfaces/DSRecord.md)
- [NSECRecord](interfaces/NSECRecord.md)
- [NSEC3Record](interfaces/NSEC3Record.md)
- [NSEC3PARAMRecord](interfaces/NSEC3PARAMRecord.md)
- [RRSIGRecord](interfaces/RRSIGRecord.md)
- [SSHFPRecord](interfaces/SSHFPRecord.md)
- [DNSQueryResult](interfaces/DNSQueryResult.md)
- [ValidationResult](interfaces/ValidationResult.md)

## Type Aliases

- [NodeDNSErrorCode](type-aliases/NodeDNSErrorCode.md)
- [DNSRecordType](type-aliases/DNSRecordType.md)
- [DNSRecord](type-aliases/DNSRecord.md)

## Variables

- [NodeDNSErrorCodes](variables/NodeDNSErrorCodes.md)
- [ValidationErrorFactory](variables/ValidationErrorFactory.md)
- [ValidationPatterns](variables/ValidationPatterns.md)
- [globalPerformanceTracker](variables/globalPerformanceTracker.md)
- [TYPES\_MODULE\_LOADED](variables/TYPES_MODULE_LOADED.md)

## Functions

- [isDNSKEYRecord](functions/isDNSKEYRecord.md)
- [isDSRecord](functions/isDSRecord.md)
- [isNSECRecord](functions/isNSECRecord.md)
- [isNSEC3Record](functions/isNSEC3Record.md)
- [isRRSIGRecord](functions/isRRSIGRecord.md)
- [isSSHFPRecord](functions/isSSHFPRecord.md)
- [validateRRSIG](functions/validateRRSIG.md)
- [validateDNSKEY](functions/validateDNSKEY.md)
- [validateDS](functions/validateDS.md)
- [validateNSEC](functions/validateNSEC.md)
- [validateNSEC3](functions/validateNSEC3.md)
- [validateNSEC3PARAM](functions/validateNSEC3PARAM.md)
- [calculateKeyTag](functions/calculateKeyTag.md)
- [isRecommendedAlgorithm](functions/isRecommendedAlgorithm.md)
- [isRecommendedDigestAlgorithm](functions/isRecommendedDigestAlgorithm.md)
- [validateSignatureTimestamps](functions/validateSignatureTimestamps.md)
- [validateARecord](functions/validateARecord.md)
- [validateAAAARecord](functions/validateAAAARecord.md)
- [validateMXRecord](functions/validateMXRecord.md)
- [getValidationSuggestions](functions/getValidationSuggestions.md)
- [isNodeDNSErrorCode](functions/isNodeDNSErrorCode.md)
- [normalizeSOA](functions/normalizeSOA.md)
- [normalizeTLSA](functions/normalizeTLSA.md)
- [toANYRecord](functions/toANYRecord.md)
- [isNodeSOAShape](functions/isNodeSOAShape.md)
- [isNodeTLSAShape](functions/isNodeTLSAShape.md)
- [fromNodeResolveAny](functions/fromNodeResolveAny.md)
- [fromNodeTxt](functions/fromNodeTxt.md)
- [toNodeTxt](functions/toNodeTxt.md)
- [\_\_testGetCachedRegex](functions/testGetCachedRegex.md)
- [fastPreValidate](functions/fastPreValidate.md)
- [isPlainObject](functions/isPlainObject.md)
- [isValidIntegerInRange](functions/isValidIntegerInRange.md)
- [getRequiredField](functions/getRequiredField.md)
- [getOptionalField](functions/getOptionalField.md)
- [isValidRecordType](functions/isValidRecordType.md)
- [trackPerformance](functions/trackPerformance.md)
- [isValidDNSQueryResult](functions/isValidDNSQueryResult.md)
- [isValidDNSRecord](functions/isValidDNSRecord.md)
- [validateDNSResponse](functions/validateDNSResponse.md)
- [isValidPort](functions/isValidPort.md)
- [isValidPriority](functions/isValidPriority.md)
- [isValidWeight](functions/isValidWeight.md)
- [isValidTTL](functions/isValidTTL.md)
- [isValidCAAFlags](functions/isValidCAAFlags.md)
- [isValidNAPTRFlags](functions/isValidNAPTRFlags.md)
- [isValidTLSAUsage](functions/isValidTLSAUsage.md)
- [isValidTLSASelector](functions/isValidTLSASelector.md)
- [isValidTLSAMatchingType](functions/isValidTLSAMatchingType.md)
- [isValidHexString](functions/isValidHexString.md)
- [isValidTextRecord](functions/isValidTextRecord.md)
- [isARecord](functions/isARecord.md)
- [isAAAARecord](functions/isAAAARecord.md)
- [isCNAMERecord](functions/isCNAMERecord.md)
- [isMXRecord](functions/isMXRecord.md)
- [isTXTRecord](functions/isTXTRecord.md)
- [isNSRecord](functions/isNSRecord.md)
- [isPTRRecord](functions/isPTRRecord.md)
- [isSOARecord](functions/isSOARecord.md)
- [isSRVRecord](functions/isSRVRecord.md)
- [isCAARecord](functions/isCAARecord.md)
- [isNAPTRRecord](functions/isNAPTRRecord.md)
- [isTLSARecord](functions/isTLSARecord.md)
- [isANYRecord](functions/isANYRecord.md)
- [isDNSRecord](functions/isDNSRecord.md)
- [validateDNSRecord](functions/validateDNSRecord.md)
