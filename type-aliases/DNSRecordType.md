# Type Alias: DNSRecordType

> **DNSRecordType** = `"A"` \| `"AAAA"` \| `"ANY"` \| `"CAA"` \| `"CNAME"` \| `"DNSKEY"` \| `"DS"` \| `"MX"` \| `"NAPTR"` \| `"NS"` \| `"NSEC3"` \| `"NSEC3PARAM"` \| `"NSEC"` \| `"PTR"` \| `"RRSIG"` \| `"SOA"` \| `"SRV"` \| `"SSHFP"` \| `"TLSA"` \| `"TXT"`

Defined in: [types.ts:241](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L241)

DNS record types supported by the validator.

Includes traditional DNS record types (A, AAAA, MX, TXT, etc.) and DNSSEC
record types (DNSKEY, DS, RRSIG, NSEC, etc.)
