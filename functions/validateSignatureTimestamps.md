# Function: validateSignatureTimestamps()

```ts
function validateSignatureTimestamps(
  inception: number,
  expiration: number,
  clockSkew?: number,
): boolean;
```

Defined in: [src/dnssec.ts:860](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/dnssec.ts#L860)

Validates DNSSEC signature timestamps

## Parameters

### inception

`number`

### expiration

`number`

### clockSkew?

`number` = `300`

## Returns

`boolean`
