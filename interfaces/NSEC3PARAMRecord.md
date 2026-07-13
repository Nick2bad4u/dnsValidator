# Interface: NSEC3PARAMRecord

Defined in: [src/types.ts:374](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L374)

NSEC3PARAM record - Provides NSEC3 hashing parameters for a DNS zone.

## Example

```typescript
const record: NSEC3PARAMRecord = {
  type: "NSEC3PARAM",
  hashAlgorithm: 1,
  flags: 0,
  iterations: 12,
  salt: "aabbccdd",
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

<a id="flags"></a>

### flags {#flags}

```ts
flags: number;
```

Defined in: [src/types.ts:376](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L376)

Flags field

---

<a id="hashalgorithm"></a>

### hashAlgorithm {#hashalgorithm}

```ts
hashAlgorithm: number;
```

Defined in: [src/types.ts:378](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L378)

Hash algorithm used (currently 1 = SHA-1)

---

<a id="iterations"></a>

### iterations {#iterations}

```ts
iterations: number;
```

Defined in: [src/types.ts:380](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L380)

Number of hash iterations

---

<a id="salt"></a>

### salt {#salt}

```ts
salt: string;
```

Defined in: [src/types.ts:382](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L382)

Salt value in hexadecimal or empty string for none

---

<a id="type"></a>

### type {#type}

```ts
type: "NSEC3PARAM";
```

Defined in: [src/types.ts:383](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L383)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
