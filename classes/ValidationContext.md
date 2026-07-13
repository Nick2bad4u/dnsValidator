# Class: ValidationContext

Defined in: [src/errors.ts:190](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L190)

Validation context for tracking field paths and providing better error
messages

## Constructors

<a id="constructor"></a>

### Constructor

```ts
new ValidationContext(): ValidationContext;
```

#### Returns

`ValidationContext`

## Properties

<a id="errors"></a>

### errors {#errors}

```ts
private errors: DNSValidationError[] = [];
```

Defined in: [src/errors.ts:191](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L191)

---

<a id="path"></a>

### path {#path}

```ts
private path: string[] = [];
```

Defined in: [src/errors.ts:192](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L192)

---

<a id="suggestions"></a>

### suggestions {#suggestions}

```ts
private suggestions: string[] = [];
```

Defined in: [src/errors.ts:193](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L193)

---

<a id="warnings"></a>

### warnings {#warnings}

```ts
private warnings: string[] = [];
```

Defined in: [src/errors.ts:194](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L194)

## Methods

<a id="adderror"></a>

### addError() {#adderror}

```ts
addError(error: Readonly<DNSValidationError>): void;
```

Defined in: [src/errors.ts:196](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L196)

#### Parameters

##### error

[`Readonly`](../type-aliases/Readonly.md)<[`DNSValidationError`](./DNSValidationError.md)>

#### Returns

`void`

---

<a id="addsuggestion"></a>

### addSuggestion() {#addsuggestion}

```ts
addSuggestion(message: string): void;
```

Defined in: [src/errors.ts:200](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L200)

#### Parameters

##### message

`string`

#### Returns

`void`

---

<a id="addwarning"></a>

### addWarning() {#addwarning}

```ts
addWarning(message: string): void;
```

Defined in: [src/errors.ts:204](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L204)

#### Parameters

##### message

`string`

#### Returns

`void`

---

<a id="enterfield"></a>

### enterField() {#enterfield}

```ts
enterField(field: string): void;
```

Defined in: [src/errors.ts:208](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L208)

#### Parameters

##### field

`string`

#### Returns

`void`

---

<a id="exitfield"></a>

### exitField() {#exitfield}

```ts
exitField(): void;
```

Defined in: [src/errors.ts:212](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L212)

#### Returns

`void`

---

<a id="getcurrentpath"></a>

### getCurrentPath() {#getcurrentpath}

```ts
getCurrentPath(): string;
```

Defined in: [src/errors.ts:216](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L216)

#### Returns

`string`

---

<a id="getresult"></a>

### getResult() {#getresult}

```ts
getResult(): DetailedValidationResult;
```

Defined in: [src/errors.ts:220](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L220)

#### Returns

[`DetailedValidationResult`](../interfaces/DetailedValidationResult.md)

---

<a id="reset"></a>

### reset() {#reset}

```ts
reset(): void;
```

Defined in: [src/errors.ts:230](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L230)

#### Returns

`void`
