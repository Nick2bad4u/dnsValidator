# Function: toANYRecord()

```ts
function toANYRecord(entries: Readonly<UnknownRecord[] | undefined>): ANYRecord;
```

Defined in: [src/node-compat.ts:141](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/node-compat.ts#L141)

Create an ANY record container from a heterogeneous Node resolveAny response
array.

## Parameters

### entries

[`Readonly`](../type-aliases/Readonly.md)<[`UnknownRecord`](../type-aliases/UnknownRecord.md)\[] | `undefined`>

## Returns

[`ANYRecord`](../interfaces/ANYRecord.md)
