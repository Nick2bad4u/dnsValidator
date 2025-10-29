# Interface: CAARecord

Defined in: [types.ts:280](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L280)

CAA record - Certification Authority Authorization.

Specifies which certificate authorities are allowed to issue certificates for a domain.

## Example

```typescript
const record: CAARecord = {
  type: 'CAA',
  critical: 0,
  issue: 'letsencrypt.org',
  ttl: 86400
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

> **type**: `"CAA"`

Defined in: [types.ts:281](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L281)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](BaseDNSRecord.md).[`type`](BaseDNSRecord.md#type)

***

### critical

> **critical**: `number`

Defined in: [types.ts:283](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L283)

Critical flag (0 or 128)

***

### issue?

> `optional` **issue**: `string`

Defined in: [types.ts:285](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L285)

CA authorized to issue certificates

***

### issuewild?

> `optional` **issuewild**: `string`

Defined in: [types.ts:287](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L287)

CA authorized to issue wildcard certificates

***

### iodef?

> `optional` **iodef**: `string`

Defined in: [types.ts:289](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L289)

URL for reporting certificate authority violations

***

### contactemail?

> `optional` **contactemail**: `string`

Defined in: [types.ts:291](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L291)

Contact email for the domain

***

### contactphone?

> `optional` **contactphone**: `string`

Defined in: [types.ts:293](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L293)

Contact phone for the domain
