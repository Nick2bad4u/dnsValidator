# Interface: SSHFPRecord

Defined in: [types.ts:644](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L644)

SSHFP record - SSH Public Key Fingerprint, used to publish SSH host key
fingerprints in DNS.

## Example

```typescript
const record: SSHFPRecord = {
    type: "SSHFP",
    algorithm: 4, // Ed25519
    fpType: 2, // SHA-256
    fingerprint: "abcdef1234567890abcdef1234567890abcdef12",
    ttl: 3600,
};
```

## Extends

- [`BaseDNSRecord`](BaseDNSRecord.md)

## Properties

### ttl?

> `optional` **ttl?**: `number`

Defined in: [types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](BaseDNSRecord.md).[`ttl`](BaseDNSRecord.md#ttl)

***

### algorithm

> **algorithm**: `number`

Defined in: [types.ts:646](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L646)

SSH public key algorithm

***

### fingerprint

> **fingerprint**: `string`

Defined in: [types.ts:648](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L648)

Hexadecimal fingerprint

***

### fpType

> **fpType**: `number`

Defined in: [types.ts:650](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L650)

Fingerprint type

***

### type

> **type**: `"SSHFP"`

Defined in: [types.ts:651](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L651)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
