# Function: getOptionalField()

> **getOptionalField**\<`T`\>(`obj`, `field`, `expectedType`): `undefined` \| `null` \| `T`

Defined in: [performance.ts:123](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L123)

Optimized field access for optional fields

## Type Parameters

### T

`T`

## Parameters

### obj

`Record`\<`string`, `unknown`\>

### field

`string`

### expectedType

`"string"` | `"number"` | `"boolean"` | `"object"`

## Returns

`undefined` \| `null` \| `T`
