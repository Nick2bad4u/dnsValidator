# Interface: CAARecord

Defined in: [types.ts:100](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L100)

CAA record - Certification Authority Authorization.

Specifies which certificate authorities are allowed to issue certificates for
a domain.

## Example

```typescript
const record: CAARecord = {
    type: "CAA",
    critical: 0,
    issue: "letsencrypt.org",
    ttl: 86400,
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

### contactemail?

> `optional` **contactemail?**: `string`

Defined in: [types.ts:102](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L102)

Contact email for the domain

***

### contactphone?

> `optional` **contactphone?**: `string`

Defined in: [types.ts:104](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L104)

Contact phone for the domain

***

### critical

> **critical**: `number`

Defined in: [types.ts:106](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L106)

Critical flag (0 or 128)

***

### iodef?

> `optional` **iodef?**: `string`

Defined in: [types.ts:108](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L108)

URL for reporting certificate authority violations

***

### issue?

> `optional` **issue?**: `string`

Defined in: [types.ts:110](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L110)

CA authorized to issue certificates

***

### issuewild?

> `optional` **issuewild?**: `string`

Defined in: [types.ts:112](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L112)

CA authorized to issue wildcard certificates

***

### type

> **type**: `"CAA"`

Defined in: [types.ts:113](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L113)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)
