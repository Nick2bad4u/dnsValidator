# Interface: NSEC3Record

Defined in: [src/types.ts:407](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L407)

NSEC3 record - Next Secure version 3, provides authenticated denial of
existence with hashed names.

## Example

```typescript
const record: NSEC3Record = {
  type: "NSEC3",
  hashAlgorithm: 1, // SHA-1
  flags: 0,
  iterations: 12,
  salt: "aabbccdd",
  nextHashedOwnerName: "p0llp5g0r78e008k65jk5u69i5smp0n8",
  typeBitMaps: ["A", "RRSIG"],
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

Defined in: [src/types.ts:409](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L409)

Flags field

---

<a id="hashalgorithm"></a>

### hashAlgorithm {#hashalgorithm}

```ts
hashAlgorithm: number;
```

Defined in: [src/types.ts:411](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L411)

Hash algorithm used

---

<a id="iterations"></a>

### iterations {#iterations}

```ts
iterations: number;
```

Defined in: [src/types.ts:413](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L413)

Number of hash iterations

---

<a id="nexthashedownername"></a>

### nextHashedOwnerName {#nexthashedownername}

```ts
nextHashedOwnerName: string;
```

Defined in: [src/types.ts:415](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L415)

Next hashed owner name in base32hex

---

<a id="salt"></a>

### salt {#salt}

```ts
salt: string;
```

Defined in: [src/types.ts:417](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L417)

Salt value in hexadecimal

---

<a id="type"></a>

### type {#type}

```ts
type: "NSEC3";
```

Defined in: [src/types.ts:418](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L418)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="typebitmaps"></a>

### typeBitMaps {#typebitmaps}

```ts
typeBitMaps: string[];
```

Defined in: [src/types.ts:420](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L420)

Array of record types that exist at this name

---

<a id="types"></a>

### ~~types?~~ {#types}

```ts
optional types?: string[];
```

Defined in: [src/types.ts:422](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L422)

#### Deprecated

Use typeBitMaps instead
