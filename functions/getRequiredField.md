# Function: getRequiredField()

```ts
function getRequiredField(
  obj: Readonly<UnknownRecord>,
  field: string,
  expectedType: "string" | "number" | "boolean" | "object",
): unknown;
```

Defined in: [src/performance.ts:131](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L131)

Optimized field access with type checking.

## Parameters

### obj

[`Readonly`](../type-aliases/Readonly.md)<[`UnknownRecord`](../type-aliases/UnknownRecord.md)>

### field

`string`

### expectedType

`"string"` | `"number"` | `"boolean"` | `"object"`

## Returns

`unknown`
