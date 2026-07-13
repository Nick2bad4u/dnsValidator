# Function: getOptionalField()

```ts
function getOptionalField(
  obj: Readonly<UnknownRecord>,
  field: string,
  expectedType: "string" | "number" | "boolean" | "object",
): unknown;
```

Defined in: [src/performance.ts:106](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L106)

Optimized field access for optional fields.

## Parameters

### obj

[`Readonly`](../type-aliases/Readonly.md)<[`UnknownRecord`](../type-aliases/UnknownRecord.md)>

### field

`string`

### expectedType

`"string"` | `"number"` | `"boolean"` | `"object"`

## Returns

`unknown`
