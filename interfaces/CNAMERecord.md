# Interface: CNAMERecord

Defined in: [src/types.ts:131](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L131)

CNAME record - Maps an alias name to the canonical domain name.

## Example

```typescript
const record: CNAMERecord = {
  type: "CNAME",
  value: "canonical.example.com",
  ttl: 300,
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
type: "CNAME";
```

Defined in: [src/types.ts:132](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L132)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="value"></a>

### value {#value}

```ts
value: string;
```

Defined in: [src/types.ts:134](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L134)

The canonical domain name
