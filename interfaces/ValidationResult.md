# Interface: ValidationResult

Defined in: [src/types.ts:735](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L735)

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

<a id="errors"></a>

### errors {#errors}

```ts
errors: string[];
```

Defined in: [src/types.ts:737](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L737)

Array of validation error messages

---

<a id="isvalid"></a>

### isValid {#isvalid}

```ts
isValid: boolean;
```

Defined in: [src/types.ts:739](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L739)

Whether the validation passed

---

<a id="warnings"></a>

### warnings {#warnings}

```ts
warnings: string[];
```

Defined in: [src/types.ts:741](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/types.ts#L741)

Array of validation warning messages
