# Interface: ANYRecord

Defined in: [src/types.ts:38](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L38)

ANY record - Represents a query for any type of DNS record.

## Example

```typescript
const record: ANYRecord = {
  type: "ANY",
  ttl: 300,
};
```

## Extends

- [`BaseDNSRecord`](./BaseDNSRecord.md)

## Properties

<a id="records"></a>

### records? {#records}

```ts
optional records?: UnknownRecord[];
```

Defined in: [src/types.ts:40](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L40)

Optional collection of mixed record results (Node resolveAny style)

---

<a id="type"></a>

### type {#type}

```ts
type: "ANY";
```

Defined in: [src/types.ts:41](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L41)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="value"></a>

### value? {#value}

```ts
optional value?: unknown;
```

Defined in: [src/types.ts:43](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L43)

Raw value (deprecated - prefer specific typed arrays)

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
