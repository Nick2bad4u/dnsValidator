# Interface: AAAARecord

Defined in: [src/types.ts:18](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L18)

AAAA record - Maps a domain name to an IPv6 address.

## Example

```typescript
const record: AAAARecord = {
  type: "AAAA",
  address: "2001:db8::1",
  ttl: 300,
};
```

## Extends

- [`BaseDNSRecord`](./BaseDNSRecord.md)

## Properties

<a id="address"></a>

### address {#address}

```ts
address: string;
```

Defined in: [src/types.ts:20](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L20)

IPv6 address in colon-separated hexadecimal notation

---

<a id="type"></a>

### type {#type}

```ts
type: "AAAA";
```

Defined in: [src/types.ts:21](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L21)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="ttl"></a>

### ttl? {#ttl}

```ts
optional ttl?: number;
```

Defined in: [src/types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](./BaseDNSRecord.md).[`ttl`](./BaseDNSRecord.md#ttl)
