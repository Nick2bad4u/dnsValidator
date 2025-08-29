# Interface: SSHFPRecord

Defined in: [types.ts:641](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L641)

SSHFP record - SSH Public Key Fingerprint, used to publish SSH host key fingerprints in DNS.

## Example

```typescript
const record: SSHFPRecord = {
  type: 'SSHFP',
  algorithm: 4, // Ed25519
  fpType: 2, // SHA-256
  fingerprint: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  ttl: 3600
};
```

## Extends

- [`BaseDNSRecord`](BaseDNSRecord.md)

## Properties

### ttl?

> `optional` **ttl**: `number`

Defined in: [types.ts:42](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L42)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](BaseDNSRecord.md).[`ttl`](BaseDNSRecord.md#ttl)

***

### type

> **type**: `"SSHFP"`

Defined in: [types.ts:642](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L642)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### algorithm

> **algorithm**: `number`

Defined in: [types.ts:644](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L644)

SSH public key algorithm

***

### fpType

> **fpType**: `number`

Defined in: [types.ts:646](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L646)

Fingerprint type

***

### fingerprint

> **fingerprint**: `string`

Defined in: [types.ts:648](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L648)

Hexadecimal fingerprint
