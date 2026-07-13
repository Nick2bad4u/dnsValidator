# Interface: RRSIGRecord

Defined in: [src/types.ts:518](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L518)

RRSIG record - Resource Record Signature, contains DNSSEC signature for a
resource record set.

## Example

```typescript
const record: RRSIGRecord = {
  type: "RRSIG",
  typeCovered: "A",
  algorithm: 8, // RSA/SHA-256
  labels: 2,
  originalTTL: 300,
  signatureExpiration: 1640995200,
  signatureInception: 1640908800,
  keyTag: 12345,
  signerName: "example.com",
  signature: "ABCDEF123456...",
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

<a id="algorithm"></a>

### algorithm {#algorithm}

```ts
algorithm: number;
```

Defined in: [src/types.ts:520](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L520)

Cryptographic algorithm used

---

<a id="keytag"></a>

### keyTag {#keytag}

```ts
keyTag: number;
```

Defined in: [src/types.ts:522](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L522)

Key tag of the DNSKEY RR that validates this signature

---

<a id="labels"></a>

### labels {#labels}

```ts
labels: number;
```

Defined in: [src/types.ts:524](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L524)

Number of labels in the original RRSIG RR owner name

---

<a id="originalttl"></a>

### originalTTL {#originalttl}

```ts
originalTTL: number;
```

Defined in: [src/types.ts:526](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L526)

Original TTL of the covered RRset

---

<a id="signature"></a>

### signature {#signature}

```ts
signature: string;
```

Defined in: [src/types.ts:528](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L528)

Base64-encoded signature

---

<a id="signatureexpiration"></a>

### signatureExpiration {#signatureexpiration}

```ts
signatureExpiration: number;
```

Defined in: [src/types.ts:530](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L530)

Signature expiration time (Unix timestamp)

---

<a id="signatureinception"></a>

### signatureInception {#signatureinception}

```ts
signatureInception: number;
```

Defined in: [src/types.ts:532](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L532)

Signature inception time (Unix timestamp)

---

<a id="signername"></a>

### signerName {#signername}

```ts
signerName: string;
```

Defined in: [src/types.ts:534](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L534)

Domain name of the signer

---

<a id="type"></a>

### type {#type}

```ts
type: "RRSIG";
```

Defined in: [src/types.ts:535](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L535)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)

---

<a id="typecovered"></a>

### typeCovered {#typecovered}

```ts
typeCovered: string;
```

Defined in: [src/types.ts:537](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L537)

Type of RRset covered by this signature
