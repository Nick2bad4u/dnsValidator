# Function: fromNodeTxt()

```ts
function fromNodeTxt(
  records: readonly (readonly string[][]),
  ttl?: number,
): TXTRecord[];
```

Defined in: [src/node-compat.ts:47](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/node-compat.ts#L47)

Convert Node resolveTxt result (string\[]\[]) to internal TXTRecord\[]

## Parameters

### records

readonly readonly `string`\[]\[]

### ttl?

`number`

## Returns

[`TXTRecord`](../interfaces/TXTRecord.md)\[]
