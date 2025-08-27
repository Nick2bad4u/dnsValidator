/**
 * DNS record types supported by the validator
 */
export type DNSRecordType =
  | "A"
  | "AAAA"
  | "ANY"
  | "CAA"
  | "CNAME"
  | "MX"
  | "NAPTR"
  | "NS"
  | "PTR"
  | "SOA"
  | "SRV"
  | "TLSA"
  | "TXT";

/**
 * Base interface for all DNS records
 */
export interface BaseDNSRecord {
  type: DNSRecordType;
  ttl?: number;
}

/**
 * A record - IPv4 address
 */
export interface ARecord extends BaseDNSRecord {
  type: "A";
  address: string;
}

/**
 * AAAA record - IPv6 address
 */
export interface AAAARecord extends BaseDNSRecord {
  type: "AAAA";
  address: string;
}

/**
 * CNAME record - Canonical name
 */
export interface CNAMERecord extends BaseDNSRecord {
  type: "CNAME";
  value: string;
}

/**
 * MX record - Mail exchange
 */
export interface MXRecord extends BaseDNSRecord {
  type: "MX";
  priority: number;
  exchange: string;
}

/**
 * TXT record - Text record
 */
export interface TXTRecord extends BaseDNSRecord {
  type: "TXT";
  entries: string[];
}

/**
 * NS record - Name server
 */
export interface NSRecord extends BaseDNSRecord {
  type: "NS";
  value: string;
}

/**
 * PTR record - Pointer record
 */
export interface PTRRecord extends BaseDNSRecord {
  type: "PTR";
  value: string;
}

/**
 * SOA record - Start of authority
 */
export interface SOARecord extends BaseDNSRecord {
  type: "SOA";
  primary: string;
  admin: string;
  serial: number;
  refresh: number;
  retry: number;
  expiration: number;
  minimum: number;
}

/**
 * SRV record - Service record
 */
export interface SRVRecord extends BaseDNSRecord {
  type: "SRV";
  priority: number;
  weight: number;
  port: number;
  name: string;
}

/**
 * CAA record - Certification Authority Authorization
 */
export interface CAARecord extends BaseDNSRecord {
  type: "CAA";
  critical: number;
  issue?: string;
  issuewild?: string;
  iodef?: string;
  contactemail?: string;
  contactphone?: string;
}

/**
 * NAPTR record - Naming Authority Pointer
 */
export interface NAPTRRecord extends BaseDNSRecord {
  type: "NAPTR";
  order: number;
  preference: number;
  flags: string;
  service: string;
  regexp: string;
  replacement: string;
}

/**
 * TLSA record - DNS-based Authentication of Named Entities
 */
export interface TLSARecord extends BaseDNSRecord {
  type: "TLSA";
  usage: number;
  selector: number;
  matchingType: number;
  certificate: string;
}

/**
 * ANY record - Can represent any type of DNS record
 */
export interface ANYRecord extends BaseDNSRecord {
  type: "ANY";
  value: unknown;
}

/**
 * Union type for all DNS records
 */
export type DNSRecord =
  | ARecord
  | AAAARecord
  | CNAMERecord
  | MXRecord
  | TXTRecord
  | NSRecord
  | PTRRecord
  | SOARecord
  | SRVRecord
  | CAARecord
  | NAPTRRecord
  | TLSARecord
  | ANYRecord;

/**
 * DNS query result interface
 */
export interface DNSQueryResult {
  question: {
    name: string;
    type: DNSRecordType;
    class: string;
  };
  answers: DNSRecord[];
  authority?: DNSRecord[];
  additional?: DNSRecord[];
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
