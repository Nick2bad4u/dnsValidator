import validator from "validator";
import {
  DNSRecord,
  DNSQueryResult,
  ValidationResult,
  DNSRecordType,
} from "./types";

/**
 * Utility functions for DNS query response validation
 */

/**
 * Validates if a DNS query result structure is valid
 */
export function isValidDNSQueryResult(
  result: unknown,
): result is DNSQueryResult {
  if (!result || typeof result !== "object") {
    return false;
  }

  const r = result as Record<string, unknown>;

  // Check required question field
  if (!r["question"] || typeof r["question"] !== "object") {
    return false;
  }

  const question = r["question"] as Record<string, unknown>;
  if (
    !question["name"] ||
    typeof question["name"] !== "string" ||
    !question["type"] ||
    typeof question["type"] !== "string" ||
    !question["class"] ||
    typeof question["class"] !== "string"
  ) {
    return false;
  }

  // Check answers array
  if (!Array.isArray(r["answers"])) {
    return false;
  }

  // Validate each answer record
  for (const answer of r["answers"]) {
    if (!isValidDNSRecord(answer)) {
      return false;
    }
  }

  return true;
} /**
 * Validates if a DNS record structure is valid
 */
export function isValidDNSRecord(record: unknown): record is DNSRecord {
  if (!record || typeof record !== "object") {
    return false;
  }

  const r = record as Record<string, unknown>;

  if (!r["type"] || typeof r["type"] !== "string") {
    return false;
  }

  const validTypes: DNSRecordType[] = [
    "A",
    "AAAA",
    "ANY",
    "CAA",
    "CNAME",
    "MX",
    "NAPTR",
    "NS",
    "PTR",
    "SOA",
    "SRV",
    "TLSA",
    "TXT",
  ];
  if (!validTypes.includes(r["type"] as DNSRecordType)) {
    return false;
  }

  // Optional TTL validation
  if (
    r["ttl"] !== undefined &&
    (!Number.isInteger(r["ttl"]) ||
      (r["ttl"] as number) < 0 ||
      (r["ttl"] as number) > 2147483647)
  ) {
    return false;
  }

  return true;
}

/**
 * Validates DNS query response completeness and consistency
 */
export function validateDNSResponse(result: DNSQueryResult): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate question section
  if (!validator.isFQDN(result.question.name, { require_tld: true })) {
    errors.push(`Invalid domain name in question: ${result.question.name}`);
  }

  // Validate answers match question type
  if (result.question.type !== "ANY") {
    for (const answer of result.answers) {
      if (answer.type !== result.question.type) {
        warnings.push(
          `Answer type ${answer.type} does not match question type ${result.question.type}`,
        );
      }
    }
  }

  // Check for empty answers
  if (result.answers.length === 0) {
    warnings.push("No answers found in DNS response");
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
export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 0 && port <= 65535;
}

/**
 * Validates if a number is a valid priority value
 */
export function isValidPriority(priority: number): boolean {
  return Number.isInteger(priority) && priority >= 0 && priority <= 65535;
}

/**
 * Validates if a number is a valid weight value
 */
export function isValidWeight(weight: number): boolean {
  return Number.isInteger(weight) && weight >= 0 && weight <= 65535;
}

/**
 * Validates if a number is a valid TTL value
 */
export function isValidTTL(ttl: number): boolean {
  return Number.isInteger(ttl) && ttl >= 0 && ttl <= 2147483647; // 2^31 - 1
}

/**
 * Validates if a CAA flags value is valid
 */
export function isValidCAAFlags(flags: number): boolean {
  return Number.isInteger(flags) && flags >= 0 && flags <= 255;
}

/**
 * Validates if a NAPTR flags value is valid
 */
export function isValidNAPTRFlags(flags: string): boolean {
  const validFlags = ["S", "A", "U", "P", ""];
  return validFlags.includes(flags.toUpperCase());
}

/**
 * Validates if a TLSA usage value is valid
 */
export function isValidTLSAUsage(usage: number): boolean {
  return Number.isInteger(usage) && usage >= 0 && usage <= 3;
}

/**
 * Validates if a TLSA selector value is valid
 */
export function isValidTLSASelector(selector: number): boolean {
  return Number.isInteger(selector) && selector >= 0 && selector <= 1;
}

/**
 * Validates if a TLSA matching type value is valid
 */
export function isValidTLSAMatchingType(matchingType: number): boolean {
  return (
    Number.isInteger(matchingType) && matchingType >= 0 && matchingType <= 2
  );
}

/**
 * Validates if a string is a valid hexadecimal string
 */
export function isValidHexString(hex: string): boolean {
  return validator.isHexadecimal(hex);
}

/**
 * Validates if a string contains only printable ASCII characters for TXT records
 */
export function isValidTextRecord(text: string): boolean {
  // TXT records can contain any 8-bit data, but we'll validate for printable ASCII
  const printableAsciiRegex = /^[\x20-\x7E]*$/;
  return printableAsciiRegex.test(text);
}
