# Interface: NSRecord

Defined in: [src/types.ts:467](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L467)

NS record - Specifies authoritative name servers for a domain.

## Example

```typescript
const record: NSRecord = {
  type: "NS",
  value: "ns1.example.com",
  ttl: 86400,
};
```

## Extends

- [`BaseDNSRecord`](./BaseDNSRecord.md)

## Properties

<a id="ttl"></a>

### ttl? {#ttl}

```ts
optional ttl?: number;
```

Defined in: [src/types.ts:76](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L76)

Time to live in seconds (optional)

#### Inherited from

[`BaseDNSRecord`](./BaseDNSRecord.md).[`ttl`](./BaseDNSRecord.md#ttl)

---

<a id="type"></a>

### type {#type}

```ts
type: "NS";
```

Defined in: [src/types.ts:468](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L468)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="value"></a>

### value {#value}

```ts
value: string;
```

Defined in: [src/types.ts:470](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L470)

Name server hostname
