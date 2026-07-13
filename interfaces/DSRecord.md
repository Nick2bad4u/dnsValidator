# Interface: DSRecord

Defined in: [src/types.ts:281](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L281)

DS record - Delegation Signer, used to secure delegations between DNS zones.

## Example

```typescript
const record: DSRecord = {
  type: "DS",
  keyTag: 12345,
  algorithm: 8, // RSA/SHA-256
  digestType: 2, // SHA-256
  digest: "A1B2C3D4E5F6...",
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

<a id="algorithm"></a>

### algorithm {#algorithm}

```ts
algorithm: number;
```

Defined in: [src/types.ts:283](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L283)

Cryptographic algorithm of the referenced key

---

<a id="digest"></a>

### digest {#digest}

```ts
digest: string;
```

Defined in: [src/types.ts:285](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L285)

Hexadecimal digest of the DNSKEY record

---

<a id="digesttype"></a>

### digestType {#digesttype}

```ts
digestType: number;
```

Defined in: [src/types.ts:287](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L287)

Digest algorithm used to create the digest

---

<a id="keytag"></a>

### keyTag {#keytag}

```ts
keyTag: number;
```

Defined in: [src/types.ts:289](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L289)

Key tag of the referenced DNSKEY record

---

<a id="type"></a>

### type {#type}

```ts
type: "DS";
```

Defined in: [src/types.ts:290](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L290)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
