# Interface: ValidationResult

Defined in: [types.ts:732](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L732)

Basic validation result interface.

## Example

```typescript
const result: ValidationResult = {
    isValid: false,
    errors: ["Invalid IP address format"],
    warnings: ["TTL value is very low"],
};
```

## Properties

### errors

> **errors**: `string`[]

Defined in: [types.ts:734](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L734)

Array of validation error messages

***

### isValid

> **isValid**: `boolean`

Defined in: [types.ts:736](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L736)

Whether the validation passed

***

### warnings

> **warnings**: `string`[]

Defined in: [types.ts:738](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L738)

Array of validation warning messages
