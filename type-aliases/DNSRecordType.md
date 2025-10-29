# Type Alias: DNSRecordType

> **DNSRecordType** = `"A"` \| `"AAAA"` \| `"ANY"` \| `"CAA"` \| `"CNAME"` \| `"DNSKEY"` \| `"DS"` \| `"MX"` \| `"NAPTR"` \| `"NS"` \| `"NSEC"` \| `"NSEC3"` \| `"NSEC3PARAM"` \| `"PTR"` \| `"RRSIG"` \| `"SOA"` \| `"SRV"` \| `"SSHFP"` \| `"TLSA"` \| `"TXT"`

Defined in: [types.ts:9](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L9)

DNS record types supported by the validator.

Includes traditional DNS record types (A, AAAA, MX, TXT, etc.) and
DNSSEC record types (DNSKEY, DS, RRSIG, NSEC, etc.)
