# Interface: SSHFPRecord

Defined in: [src/types.ts:644](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L644)

SSHFP record - SSH Public Key Fingerprint, used to publish SSH host key
fingerprints in DNS.

## Example

```typescript
const record: SSHFPRecord = {
  type: "SSHFP",
  algorithm: 4, // Ed25519
  fpType: 2, // SHA-256
  fingerprint: "abcdef1234567890abcdef1234567890abcdef12",
  ttl: 3600,
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

Defined in: [src/types.ts:646](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L646)

SSH public key algorithm

---

<a id="fingerprint"></a>

### fingerprint {#fingerprint}

```ts
fingerprint: string;
```

Defined in: [src/types.ts:648](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L648)

Hexadecimal fingerprint

---

<a id="fptype"></a>

### fpType {#fptype}

```ts
fpType: number;
```

Defined in: [src/types.ts:650](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L650)

Fingerprint type

---

<a id="type"></a>

### type {#type}

```ts
type: "SSHFP";
```

Defined in: [src/types.ts:651](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L651)

The type of DNS record

#### Overrides

[`BaseDNSRecord`](./BaseDNSRecord.md).[`type`](./BaseDNSRecord.md#type)
