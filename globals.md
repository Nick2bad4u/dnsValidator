# DNS Validator

DNS Validator Library

A comprehensive TypeScript library for validating DNS query results and
individual DNS records. Supports validation of traditional DNS records (A,
AAAA, MX, TXT, etc.) and DNSSEC records (DNSKEY, DS, RRSIG, NSEC, etc.) with
enhanced error reporting and performance optimization.

## Example

```typescript
import { isARecord, validateARecord } from "dns-response-validator";

// Basic validation
const record = { type: "A", address: "192.168.1.1", ttl: 300 };
console.log(isARecord(record)); // true

// Enhanced validation with error details
const result = validateARecord(record);
console.log(result.isValid); // true
```

## Classes

- [DNSValidationError](classes/DNSValidationError.md)
- [InvalidFieldValueError](classes/InvalidFieldValueError.md)
- [InvalidQueryStructureError](classes/InvalidQueryStructureError.md)
- [InvalidRecordTypeError](classes/InvalidRecordTypeError.md)
- [MalformedRecordError](classes/MalformedRecordError.md)
- [MissingRequiredFieldError](classes/MissingRequiredFieldError.md)
- [ValidationContext](classes/ValidationContext.md)
- [ValidationPerformanceTracker](classes/ValidationPerformanceTracker.md)

## Interfaces

- [DetailedValidationResult](interfaces/DetailedValidationResult.md)
- [ValidationMetrics](interfaces/ValidationMetrics.md)
- [AAAARecord](interfaces/AAAARecord.md)
- [ANYRecord](interfaces/ANYRecord.md)
- [ARecord](interfaces/ARecord.md)
- [BaseDNSRecord](interfaces/BaseDNSRecord.md)
- [CAARecord](interfaces/CAARecord.md)
- [CNAMERecord](interfaces/CNAMERecord.md)
- [DNSKEYRecord](interfaces/DNSKEYRecord.md)
- [DNSQueryResult](interfaces/DNSQueryResult.md)
- [DSRecord](interfaces/DSRecord.md)
- [MXRecord](interfaces/MXRecord.md)
- [NAPTRRecord](interfaces/NAPTRRecord.md)
- [NSEC3PARAMRecord](interfaces/NSEC3PARAMRecord.md)
- [NSEC3Record](interfaces/NSEC3Record.md)
- [NSECRecord](interfaces/NSECRecord.md)
- [NSRecord](interfaces/NSRecord.md)
- [PTRRecord](interfaces/PTRRecord.md)
- [RRSIGRecord](interfaces/RRSIGRecord.md)
- [SOARecord](interfaces/SOARecord.md)
- [SRVRecord](interfaces/SRVRecord.md)
- [SSHFPRecord](interfaces/SSHFPRecord.md)
- [TLSARecord](interfaces/TLSARecord.md)
- [TXTRecord](interfaces/TXTRecord.md)
- [ValidationResult](interfaces/ValidationResult.md)

## Type Aliases

- [DigestAlgorithm](type-aliases/DigestAlgorithm.md)
- [DNSKEYFlags](type-aliases/DNSKEYFlags.md)
- [DNSSECAlgorithm](type-aliases/DNSSECAlgorithm.md)
- [NSEC3HashAlgorithm](type-aliases/NSEC3HashAlgorithm.md)
- [NodeDNSErrorCodeMap](type-aliases/NodeDNSErrorCodeMap.md)
- [NodeDNSErrorCode](type-aliases/NodeDNSErrorCode.md)
- [ValidationPatternName](type-aliases/ValidationPatternName.md)
- [DNSRecord](type-aliases/DNSRecord.md)
- [DNSRecordType](type-aliases/DNSRecordType.md)

## Variables

- [DigestAlgorithm](variables/DigestAlgorithm.md)
- [DNSKEYFlags](variables/DNSKEYFlags.md)
- [DNSSECAlgorithm](variables/DNSSECAlgorithm.md)
- [NSEC3HashAlgorithm](variables/NSEC3HashAlgorithm.md)
- [NodeDNSErrorCodes](variables/NodeDNSErrorCodes.md)
- [ValidationErrorFactory](variables/ValidationErrorFactory.md)
- [ValidationPatterns](variables/ValidationPatterns.md)
- [globalPerformanceTracker](variables/globalPerformanceTracker.md)

## Functions

- [isDNSKEYRecord](functions/isDNSKEYRecord.md)
- [isDSRecord](functions/isDSRecord.md)
- [isNSEC3Record](functions/isNSEC3Record.md)
- [isNSECRecord](functions/isNSECRecord.md)
- [isRRSIGRecord](functions/isRRSIGRecord.md)
- [isSSHFPRecord](functions/isSSHFPRecord.md)
- [calculateKeyTag](functions/calculateKeyTag.md)
- [isRecommendedAlgorithm](functions/isRecommendedAlgorithm.md)
- [isRecommendedDigestAlgorithm](functions/isRecommendedDigestAlgorithm.md)
- [validateDNSKEY](functions/validateDNSKEY.md)
- [validateDS](functions/validateDS.md)
- [validateNSEC](functions/validateNSEC.md)
- [validateNSEC3](functions/validateNSEC3.md)
- [validateNSEC3PARAM](functions/validateNSEC3PARAM.md)
- [validateRRSIG](functions/validateRRSIG.md)
- [validateSignatureTimestamps](functions/validateSignatureTimestamps.md)
- [getValidationSuggestions](functions/getValidationSuggestions.md)
- [validateAAAARecord](functions/validateAAAARecord.md)
- [validateARecord](functions/validateARecord.md)
- [validateMXRecord](functions/validateMXRecord.md)
- [isNodeDNSErrorCode](functions/isNodeDNSErrorCode.md)
- [fromNodeResolveAny](functions/fromNodeResolveAny.md)
- [fromNodeTxt](functions/fromNodeTxt.md)
- [isNodeSOAShape](functions/isNodeSOAShape.md)
- [isNodeTLSAShape](functions/isNodeTLSAShape.md)
- [normalizeSOA](functions/normalizeSOA.md)
- [normalizeTLSA](functions/normalizeTLSA.md)
- [toANYRecord](functions/toANYRecord.md)
- [toNodeTxt](functions/toNodeTxt.md)
- [testGetCachedRegex](functions/testGetCachedRegex.md)
- [fastPreValidate](functions/fastPreValidate.md)
- [isPlainObject](functions/isPlainObject.md)
- [getOptionalField](functions/getOptionalField.md)
- [getRequiredField](functions/getRequiredField.md)
- [isValidIntegerInRange](functions/isValidIntegerInRange.md)
- [isValidRecordType](functions/isValidRecordType.md)
- [trackPerformance](functions/trackPerformance.md)
- [isValidCAAFlags](functions/isValidCAAFlags.md)
- [isValidDNSQueryResult](functions/isValidDNSQueryResult.md)
- [isValidDNSRecord](functions/isValidDNSRecord.md)
- [isValidHexString](functions/isValidHexString.md)
- [isValidNAPTRFlags](functions/isValidNAPTRFlags.md)
- [isValidPort](functions/isValidPort.md)
- [isValidPriority](functions/isValidPriority.md)
- [isValidTextRecord](functions/isValidTextRecord.md)
- [isValidTLSAMatchingType](functions/isValidTLSAMatchingType.md)
- [isValidTLSASelector](functions/isValidTLSASelector.md)
- [isValidTLSAUsage](functions/isValidTLSAUsage.md)
- [isValidTTL](functions/isValidTTL.md)
- [isValidWeight](functions/isValidWeight.md)
- [validateDNSResponse](functions/validateDNSResponse.md)
- [isAAAARecord](functions/isAAAARecord.md)
- [isANYRecord](functions/isANYRecord.md)
- [isARecord](functions/isARecord.md)
- [isCAARecord](functions/isCAARecord.md)
- [isCNAMERecord](functions/isCNAMERecord.md)
- [isMXRecord](functions/isMXRecord.md)
- [isNAPTRRecord](functions/isNAPTRRecord.md)
- [isNSRecord](functions/isNSRecord.md)
- [isPTRRecord](functions/isPTRRecord.md)
- [isSOARecord](functions/isSOARecord.md)
- [isSRVRecord](functions/isSRVRecord.md)
- [isTLSARecord](functions/isTLSARecord.md)
- [isTXTRecord](functions/isTXTRecord.md)
- [isDNSRecord](functions/isDNSRecord.md)
- [validateDNSRecord](functions/validateDNSRecord.md)
