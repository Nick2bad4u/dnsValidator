# Function: fastPreValidate()

```ts
function fastPreValidate(
  value: string,
  pattern: ValidationPatternName,
): boolean | null;
```

Defined in: [src/performance.ts:74](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L74)

Fast pre-validation using regex patterns Returns null if validation should
proceed, or false if definitely invalid

## Parameters

### value

`string`

### pattern

[`ValidationPatternName`](../type-aliases/ValidationPatternName.md)

## Returns

`boolean` | `null`
