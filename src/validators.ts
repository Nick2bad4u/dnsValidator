import validator from 'validator';
import {
  ARecord,
  AAAARecord,
  CNAMERecord,
  MXRecord,
  TXTRecord,
  NSRecord,
  PTRRecord,
  SOARecord,
  SRVRecord,
  CAARecord,
  NAPTRRecord,
  TLSARecord,
  ANYRecord,
  DNSRecord,
  ValidationResult
} from './types';
import {
  isValidPort,
  isValidPriority,
  isValidWeight,
  isValidTTL,
  isValidCAAFlags,
  isValidNAPTRFlags,
  isValidTLSAUsage,
  isValidTLSASelector,
  isValidTLSAMatchingType,
  isValidHexString,
  isValidTextRecord
} from './utils';

/**
 * Validates an A record
 */
export function isARecord(record: unknown): record is ARecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'A' &&
    typeof r.address === 'string' &&
    validator.isIP(r.address, 4) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates an AAAA record
 */
export function isAAAARecord(record: unknown): record is AAAARecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'AAAA' &&
    typeof r.address === 'string' &&
    validator.isIP(r.address, 6) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates a CNAME record
 */
export function isCNAMERecord(record: unknown): record is CNAMERecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'CNAME' &&
    typeof r.value === 'string' &&
    validator.isFQDN(r.value, { require_tld: true }) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates an MX record
 */
export function isMXRecord(record: unknown): record is MXRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'MX' &&
    typeof r.exchange === 'string' &&
    validator.isFQDN(r.exchange, { require_tld: true }) &&
    typeof r.priority === 'number' &&
    isValidPriority(r.priority) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates a TXT record
 */
export function isTXTRecord(record: unknown): record is TXTRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'TXT' &&
    Array.isArray(r.entries) &&
    r.entries.every((entry: unknown) =>
      typeof entry === 'string' && isValidTextRecord(entry)
    ) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates an NS record
 */
export function isNSRecord(record: unknown): record is NSRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'NS' &&
    typeof r.value === 'string' &&
    validator.isFQDN(r.value, { require_tld: true }) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates a PTR record
 */
export function isPTRRecord(record: unknown): record is PTRRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'PTR' &&
    typeof r.value === 'string' &&
    validator.isFQDN(r.value, { require_tld: true }) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates an SOA record
 */
export function isSOARecord(record: unknown): record is SOARecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'SOA' &&
    typeof r.primary === 'string' &&
    validator.isFQDN(r.primary, { require_tld: true }) &&
    typeof r.admin === 'string' &&
    validator.isEmail(r.admin.replace('.', '@', 1)) && // SOA admin format: user.domain.tld
    typeof r.serial === 'number' &&
    Number.isInteger(r.serial) &&
    r.serial >= 0 &&
    typeof r.refresh === 'number' &&
    Number.isInteger(r.refresh) &&
    r.refresh >= 0 &&
    typeof r.retry === 'number' &&
    Number.isInteger(r.retry) &&
    r.retry >= 0 &&
    typeof r.expiration === 'number' &&
    Number.isInteger(r.expiration) &&
    r.expiration >= 0 &&
    typeof r.minimum === 'number' &&
    Number.isInteger(r.minimum) &&
    r.minimum >= 0 &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates an SRV record
 */
export function isSRVRecord(record: unknown): record is SRVRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'SRV' &&
    typeof r.name === 'string' &&
    validator.isFQDN(r.name, { require_tld: true }) &&
    typeof r.priority === 'number' &&
    isValidPriority(r.priority) &&
    typeof r.weight === 'number' &&
    isValidWeight(r.weight) &&
    typeof r.port === 'number' &&
    isValidPort(r.port) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates a CAA record
 */
export function isCAARecord(record: unknown): record is CAARecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  if (r.type !== 'CAA' || !isValidCAAFlags(r.critical)) {
    return false;
  }

  // At least one CAA property should be present
  const hasValidProperty = (
    (r.issue !== undefined && typeof r.issue === 'string') ||
    (r.issuewild !== undefined && typeof r.issuewild === 'string') ||
    (r.iodef !== undefined && typeof r.iodef === 'string') ||
    (r.contactemail !== undefined && typeof r.contactemail === 'string' && validator.isEmail(r.contactemail)) ||
    (r.contactphone !== undefined && typeof r.contactphone === 'string')
  );

  return hasValidProperty && (r.ttl === undefined || isValidTTL(r.ttl));
}

/**
 * Validates a NAPTR record
 */
export function isNAPTRRecord(record: unknown): record is NAPTRRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'NAPTR' &&
    typeof r.order === 'number' &&
    Number.isInteger(r.order) &&
    r.order >= 0 &&
    r.order <= 65535 &&
    typeof r.preference === 'number' &&
    Number.isInteger(r.preference) &&
    r.preference >= 0 &&
    r.preference <= 65535 &&
    typeof r.flags === 'string' &&
    isValidNAPTRFlags(r.flags) &&
    typeof r.service === 'string' &&
    typeof r.regexp === 'string' &&
    typeof r.replacement === 'string' &&
    (r.replacement === '' || validator.isFQDN(r.replacement, { require_tld: true })) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates a TLSA record
 */
export function isTLSARecord(record: unknown): record is TLSARecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'TLSA' &&
    typeof r.usage === 'number' &&
    isValidTLSAUsage(r.usage) &&
    typeof r.selector === 'number' &&
    isValidTLSASelector(r.selector) &&
    typeof r.matchingType === 'number' &&
    isValidTLSAMatchingType(r.matchingType) &&
    typeof r.certificate === 'string' &&
    isValidHexString(r.certificate) &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates an ANY record (can be any type)
 */
export function isANYRecord(record: unknown): record is ANYRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  return (
    r.type === 'ANY' &&
    r.value !== undefined &&
    (r.ttl === undefined || isValidTTL(r.ttl))
  );
}

/**
 * Validates any DNS record based on its type
 */
export function isDNSRecord(record: unknown): record is DNSRecord {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const r = record as any;

  switch (r.type) {
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
    default:
      return false;
  }
}

/**
 * Validates a DNS record and returns detailed validation result
 */
export function validateDNSRecord(record: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record || typeof record !== 'object') {
    errors.push('Record must be an object');
    return { isValid: false, errors, warnings };
  }

  const r = record as any;

  if (!r.type || typeof r.type !== 'string') {
    errors.push('Record must have a valid type field');
    return { isValid: false, errors, warnings };
  }

  if (!isDNSRecord(record)) {
    errors.push(`Invalid ${r.type} record structure or values`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
