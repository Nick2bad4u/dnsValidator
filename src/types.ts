/**
 * AAAA record - Maps a domain name to an IPv6 address.
 *
 * @example
 *
 * ```typescript
 * const record: AAAARecord = {
 *     type: "AAAA",
 *     address: "2001:db8::1",
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface AAAARecord extends BaseDNSRecord {
    /** IPv6 address in colon-separated hexadecimal notation */
    address: string;
    type: "AAAA";
}

/**
 * ANY record - Represents a query for any type of DNS record.
 *
 * @example
 *
 * ```typescript
 * const record: ANYRecord = {
 *     type: "ANY",
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface ANYRecord extends BaseDNSRecord {
    /** Optional collection of mixed record results (Node resolveAny style) */
    records?: (
        | { address: string; ttl?: number; type: "A" }
        | { address: string; ttl?: number; type: "AAAA" }
        | {
              certUsage: number;
              data: ArrayBuffer | string;
              match: number;
              selector: number;
              type: "TLSA";
          }
        | { entries: string[]; type: "TXT" }
        | { exchange: string; priority: number; type: "MX" }
        | {
              expire: number;
              hostmaster: string;
              minttl: number;
              nsname: string;
              refresh: number;
              retry: number;
              serial: number;
              type: "SOA";
          }
        | {
              flags: string;
              order: number;
              preference: number;
              regexp: string;
              replacement: string;
              service: string;
              type: "NAPTR";
          }
        | {
              name: string;
              port: number;
              priority: number;
              type: "SRV";
              weight: number;
          }
        | { type: "CNAME"; value: string }
        | { type: "NS"; value: string }
        | { type: "PTR"; value: string }
    )[];
    type: "ANY";
    /** Raw value (deprecated - prefer specific typed arrays) */
    value?: unknown;
}

/**
 * A record - Maps a domain name to an IPv4 address.
 *
 * @example
 *
 * ```typescript
 * const record: ARecord = {
 *     type: "A",
 *     address: "192.168.1.1",
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface ARecord extends BaseDNSRecord {
    /** IPv4 address in dotted decimal notation */
    address: string;
    type: "A";
}

/**
 * Base interface for all DNS records.
 *
 * Provides common properties that all DNS records share.
 *
 * @public
 */
export interface BaseDNSRecord {
    /** Time to live in seconds (optional) */
    ttl?: number;
    /** The type of DNS record */
    type: DNSRecordType;
}

/**
 * CAA record - Certification Authority Authorization.
 *
 * Specifies which certificate authorities are allowed to issue certificates for
 * a domain.
 *
 * @example
 *
 * ```typescript
 * const record: CAARecord = {
 *     type: "CAA",
 *     critical: 0,
 *     issue: "letsencrypt.org",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface CAARecord extends BaseDNSRecord {
    /** Contact email for the domain */
    contactemail?: string;
    /** Contact phone for the domain */
    contactphone?: string;
    /** Critical flag (0 or 128) */
    critical: number;
    /** URL for reporting certificate authority violations */
    iodef?: string;
    /** CA authorized to issue certificates */
    issue?: string;
    /** CA authorized to issue wildcard certificates */
    issuewild?: string;
    type: "CAA";
}

/**
 * CNAME record - Maps an alias name to the canonical domain name.
 *
 * @example
 *
 * ```typescript
 * const record: CNAMERecord = {
 *     type: "CNAME",
 *     value: "canonical.example.com",
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface CNAMERecord extends BaseDNSRecord {
    type: "CNAME";
    /** The canonical domain name */
    value: string;
}

/**
 * DNSKEY record - Contains a public key used for DNSSEC validation.
 *
 * @example
 *
 * ```typescript
 * const record: DNSKEYRecord = {
 *     type: "DNSKEY",
 *     flags: 257, // Key Signing Key
 *     protocol: 3,
 *     algorithm: 8, // RSA/SHA-256
 *     publicKey: "AwEAAag/59Q...",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface DNSKEYRecord extends BaseDNSRecord {
    /** Cryptographic algorithm number */
    algorithm: number;
    /** Flags field (bit 7 = Zone Key, bit 15 = Secure Entry Point) */
    flags: number;
    /** Protocol field (always 3 for DNSSEC) */
    protocol: number;
    /** Base64-encoded public key */
    publicKey: string;
    type: "DNSKEY";
}

/**
 * DNS query result interface representing a complete DNS response.
 *
 * @example
 *
 * ```typescript
 * const result: DNSQueryResult = {
 *     question: {
 *         name: "example.com",
 *         type: "A",
 *         class: "IN",
 *     },
 *     answers: [{ type: "A", address: "93.184.216.34", ttl: 86400 }],
 * };
 * ```
 *
 * @public
 */
export interface DNSQueryResult {
    /** Additional records (optional) */
    additional?: DNSRecord[];
    /** Answer records from the DNS response */
    answers: DNSRecord[];
    /** Authority records (optional) */
    authority?: DNSRecord[];
    /** The question section of the DNS query */
    question: {
        /** Query class (usually 'IN' for Internet) */
        class: string;
        /** Domain name being queried */
        name: string;
        /** Type of record requested */
        type: DNSRecordType;
    };
}

/**
 * Union type for all supported DNS record types.
 *
 * This type can be used when you need to work with any DNS record type in a
 * type-safe manner.
 *
 * @public
 */
export type DNSRecord =
    | AAAARecord
    | ANYRecord
    | ARecord
    | CAARecord
    | CNAMERecord
    | DNSKEYRecord
    | DSRecord
    | MXRecord
    | NAPTRRecord
    | NSEC3PARAMRecord
    | NSEC3Record
    | NSECRecord
    | NSRecord
    | PTRRecord
    | RRSIGRecord
    | SOARecord
    | SRVRecord
    | SSHFPRecord
    | TLSARecord
    | TXTRecord;

/**
 * DNS record types supported by the validator.
 *
 * Includes traditional DNS record types (A, AAAA, MX, TXT, etc.) and DNSSEC
 * record types (DNSKEY, DS, RRSIG, NSEC, etc.)
 *
 * @public
 */
export type DNSRecordType =
    | "A"
    | "AAAA"
    | "ANY"
    | "CAA"
    | "CNAME"
    | "DNSKEY"
    | "DS"
    | "MX"
    | "NAPTR"
    | "NS"
    | "NSEC3"
    | "NSEC3PARAM"
    | "NSEC"
    | "PTR"
    | "RRSIG"
    | "SOA"
    | "SRV"
    | "SSHFP"
    | "TLSA"
    | "TXT";

/**
 * DS record - Delegation Signer, used to secure delegations between DNS zones.
 *
 * @example
 *
 * ```typescript
 * const record: DSRecord = {
 *     type: "DS",
 *     keyTag: 12345,
 *     algorithm: 8, // RSA/SHA-256
 *     digestType: 2, // SHA-256
 *     digest: "A1B2C3D4E5F6...",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface DSRecord extends BaseDNSRecord {
    /** Cryptographic algorithm of the referenced key */
    algorithm: number;
    /** Hexadecimal digest of the DNSKEY record */
    digest: string;
    /** Digest algorithm used to create the digest */
    digestType: number;
    /** Key tag of the referenced DNSKEY record */
    keyTag: number;
    type: "DS";
}

/**
 * MX record - Specifies mail exchange servers for a domain.
 *
 * @example
 *
 * ```typescript
 * const record: MXRecord = {
 *     type: "MX",
 *     priority: 10,
 *     exchange: "mail.example.com",
 *     ttl: 3600,
 * };
 * ```
 *
 * @public
 */
export interface MXRecord extends BaseDNSRecord {
    /** Mail server hostname */
    exchange: string;
    /** Priority value (0-65535, lower values have higher priority) */
    priority: number;
    type: "MX";
}

/**
 * NAPTR record - Naming Authority Pointer.
 *
 * Used for mapping services to domain names, often in ENUM and SIP
 * applications.
 *
 * @example
 *
 * ```typescript
 * const record: NAPTRRecord = {
 *     type: "NAPTR",
 *     order: 100,
 *     preference: 50,
 *     flags: "u",
 *     service: "E2U+sip",
 *     regexp: "!^.*$!sip:info@example.com!",
 *     replacement: "",
 *     ttl: 3600,
 * };
 * ```
 *
 * @public
 */
export interface NAPTRRecord extends BaseDNSRecord {
    /** Flags controlling processing */
    flags: string;
    /** Order value for processing sequence */
    order: number;
    /** Preference value within same order */
    preference: number;
    /** Regular expression for URI construction */
    regexp: string;
    /** Replacement domain name */
    replacement: string;
    /** Service parameters */
    service: string;
    type: "NAPTR";
}

/**
 * NSEC3PARAM record - Provides NSEC3 hashing parameters for a DNS zone.
 *
 * @example
 *
 * ```typescript
 * const record: NSEC3PARAMRecord = {
 *     type: "NSEC3PARAM",
 *     hashAlgorithm: 1,
 *     flags: 0,
 *     iterations: 12,
 *     salt: "aabbccdd",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface NSEC3PARAMRecord extends BaseDNSRecord {
    /** Flags field */
    flags: number;
    /** Hash algorithm used (currently 1 = SHA-1) */
    hashAlgorithm: number;
    /** Number of hash iterations */
    iterations: number;
    /** Salt value in hexadecimal or empty string for none */
    salt: string;
    type: "NSEC3PARAM";
}

/**
 * NSEC3 record - Next Secure version 3, provides authenticated denial of
 * existence with hashed names.
 *
 * @example
 *
 * ```typescript
 * const record: NSEC3Record = {
 *     type: "NSEC3",
 *     hashAlgorithm: 1, // SHA-1
 *     flags: 0,
 *     iterations: 12,
 *     salt: "aabbccdd",
 *     nextHashedOwnerName: "p0llp5g0r78e008k65jk5u69i5smp0n8",
 *     typeBitMaps: ["A", "RRSIG"],
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface NSEC3Record extends BaseDNSRecord {
    /** Flags field */
    flags: number;
    /** Hash algorithm used */
    hashAlgorithm: number;
    /** Number of hash iterations */
    iterations: number;
    /** Next hashed owner name in base32hex */
    nextHashedOwnerName: string;
    /** Salt value in hexadecimal */
    salt: string;
    type: "NSEC3";
    /** Array of record types that exist at this name */
    typeBitMaps: string[];
    /** @deprecated Use typeBitMaps instead */
    types?: string[];
}

/**
 * NSEC record - Next Secure, used for authenticated denial of existence in
 * DNSSEC.
 *
 * @example
 *
 * ```typescript
 * const record: NSECRecord = {
 *     type: "NSEC",
 *     nextDomainName: "b.example.com",
 *     typeBitmaps: "A NS SOA MX RRSIG NSEC DNSKEY",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface NSECRecord extends BaseDNSRecord {
    /** Next domain name in canonical ordering */
    nextDomainName: string;
    type: "NSEC";
    /** Array of record types that exist at this name */
    typeBitMaps: string[];
    /** @deprecated Use typeBitMaps instead */
    types?: string[];
}

/**
 * NS record - Specifies authoritative name servers for a domain.
 *
 * @example
 *
 * ```typescript
 * const record: NSRecord = {
 *     type: "NS",
 *     value: "ns1.example.com",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface NSRecord extends BaseDNSRecord {
    type: "NS";
    /** Name server hostname */
    value: string;
}

/**
 * PTR record - Maps an IP address to a domain name (reverse DNS).
 *
 * @example
 *
 * ```typescript
 * const record: PTRRecord = {
 *     type: "PTR",
 *     value: "host.example.com",
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface PTRRecord extends BaseDNSRecord {
    type: "PTR";
    /** Domain name */
    value: string;
}

/**
 * RRSIG record - Resource Record Signature, contains DNSSEC signature for a
 * resource record set.
 *
 * @example
 *
 * ```typescript
 * const record: RRSIGRecord = {
 *     type: "RRSIG",
 *     typeCovered: "A",
 *     algorithm: 8, // RSA/SHA-256
 *     labels: 2,
 *     originalTTL: 300,
 *     signatureExpiration: 1640995200,
 *     signatureInception: 1640908800,
 *     keyTag: 12345,
 *     signerName: "example.com",
 *     signature: "ABCDEF123456...",
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface RRSIGRecord extends BaseDNSRecord {
    /** Cryptographic algorithm used */
    algorithm: number;
    /** Key tag of the DNSKEY RR that validates this signature */
    keyTag: number;
    /** Number of labels in the original RRSIG RR owner name */
    labels: number;
    /** Original TTL of the covered RRset */
    originalTTL: number;
    /** Base64-encoded signature */
    signature: string;
    /** Signature expiration time (Unix timestamp) */
    signatureExpiration: number;
    /** Signature inception time (Unix timestamp) */
    signatureInception: number;
    /** Domain name of the signer */
    signerName: string;
    type: "RRSIG";
    /** Type of RRset covered by this signature */
    typeCovered: string;
}

/**
 * SOA record - Contains administrative information about a DNS zone.
 *
 * @example
 *
 * ```typescript
 * const record: SOARecord = {
 *     type: "SOA",
 *     primary: "ns1.example.com",
 *     admin: "admin.example.com",
 *     serial: 2023010101,
 *     refresh: 3600,
 *     retry: 1800,
 *     expiration: 604800,
 *     minimum: 86400,
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface SOARecord extends BaseDNSRecord {
    /**
     * Administrator email (with @ replaced by .) (internal canonical field,
     * Node uses 'hostmaster')
     */
    admin?: string;
    /** Expiration time in seconds (internal canonical field, Node uses 'expire') */
    expiration?: number;
    /** Node.js compatible expiration field */
    expire?: number;
    /** Node.js compatible field name for administrator email */
    hostmaster?: string;
    /**
     * Minimum TTL for negative caching (internal canonical field, Node uses
     * 'minttl')
     */
    minimum?: number;
    /** Node.js compatible minimum TTL field */
    minttl?: number;
    /** Node.js compatible field name for primary name server */
    nsname?: string;
    /**
     * Primary name server (internal canonical field, Node.js dns.resolveSoa
     * uses 'nsname')
     */
    primary?: string;
    /** Refresh interval in seconds */
    refresh: number;
    /** Retry interval in seconds */
    retry: number;
    /** Serial number for zone transfers */
    serial: number;
    type: "SOA";
}

/**
 * SRV record - Specifies the location of services within a domain.
 *
 * @example
 *
 * ```typescript
 * const record: SRVRecord = {
 *     type: "SRV",
 *     priority: 10,
 *     weight: 5,
 *     port: 443,
 *     name: "server.example.com",
 *     ttl: 3600,
 * };
 * ```
 *
 * @public
 */
export interface SRVRecord extends BaseDNSRecord {
    /** Hostname of the target */
    name: string;
    /** Port number of the service */
    port: number;
    /** Priority of the target host (0-65535, lower values preferred) */
    priority: number;
    type: "SRV";
    /** Weight for load balancing among hosts with same priority */
    weight: number;
}

/**
 * SSHFP record - SSH Public Key Fingerprint, used to publish SSH host key
 * fingerprints in DNS.
 *
 * @example
 *
 * ```typescript
 * const record: SSHFPRecord = {
 *     type: "SSHFP",
 *     algorithm: 4, // Ed25519
 *     fpType: 2, // SHA-256
 *     fingerprint:
 *         "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
 *     ttl: 3600,
 * };
 * ```
 *
 * @public
 */
export interface SSHFPRecord extends BaseDNSRecord {
    /** SSH public key algorithm */
    algorithm: number;
    /** Hexadecimal fingerprint */
    fingerprint: string;
    /** Fingerprint type */
    fpType: number;
    type: "SSHFP";
}

/**
 * TLSA record - DNS-based Authentication of Named Entities (DANE).
 *
 * Associates a TLS server certificate with the domain name where the record is
 * found.
 *
 * @example
 *
 * ```typescript
 * const record: TLSARecord = {
 *     type: "TLSA",
 *     usage: 3,
 *     selector: 1,
 *     matchingType: 1,
 *     certificate: "abcdef1234567890...",
 *     ttl: 86400,
 * };
 * ```
 *
 * @public
 */
export interface TLSARecord extends BaseDNSRecord {
    /**
     * Certificate association data internal canonical (Node uses 'data' as
     * ArrayBuffer/Buffer)
     */
    certificate?: string;
    /** Node.js compatible certificate usage */
    certUsage?: number;
    /** Node.js compatible data (hex/base64 string or Buffer) */
    data?: ArrayBuffer | string | Uint8Array;
    /** Node.js compatible matching type */
    match?: number;
    /** Matching type (0-2) internal canonical (Node uses 'match') */
    matchingType?: number;
    /** Selector (0-1) */
    selector: number;
    type: "TLSA";
    /** Certificate usage (0-3) internal canonical (Node uses 'certUsage') */
    usage?: number;
}

/**
 * TXT record - Contains arbitrary text data.
 *
 * @example
 *
 * ```typescript
 * const record: TXTRecord = {
 *     type: "TXT",
 *     entries: ["v=spf1 include:_spf.google.com ~all"],
 *     ttl: 300,
 * };
 * ```
 *
 * @public
 */
export interface TXTRecord extends BaseDNSRecord {
    /** Array of text strings */
    entries: string[];
    type: "TXT";
}

/**
 * Basic validation result interface.
 *
 * @example
 *
 * ```typescript
 * const result: ValidationResult = {
 *     isValid: false,
 *     errors: ["Invalid IP address format"],
 *     warnings: ["TTL value is very low"],
 * };
 * ```
 *
 * @public
 */
export interface ValidationResult {
    /** Array of validation error messages */
    errors: string[];
    /** Whether the validation passed */
    isValid: boolean;
    /** Array of validation warning messages */
    warnings: string[];
}

/**
 * Runtime constant exported to ensure this module registers executable code for
 * coverage tools. This has no functional impact on consumers but allows
 * statement coverage to reflect that the types module was loaded at runtime
 * (imports that only use types are erased from emitted JS).
 *
 * @internal
 */
