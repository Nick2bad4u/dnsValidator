# Class: ValidationContext

Defined in: [errors.ts:190](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L190)

Validation context for tracking field paths and providing better error
messages

## Constructors

### Constructor

> **new ValidationContext**(): `ValidationContext`

#### Returns

`ValidationContext`

## Methods

### addError()

> **addError**(`error`): `void`

Defined in: [errors.ts:196](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L196)

#### Parameters

##### error

`Readonly`\<[`DNSValidationError`](DNSValidationError.md)\>

#### Returns

`void`

***

### addSuggestion()

> **addSuggestion**(`message`): `void`

Defined in: [errors.ts:200](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L200)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### addWarning()

> **addWarning**(`message`): `void`

Defined in: [errors.ts:204](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L204)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### enterField()

> **enterField**(`field`): `void`

Defined in: [errors.ts:208](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L208)

#### Parameters

##### field

`string`

#### Returns

`void`

***

### exitField()

> **exitField**(): `void`

Defined in: [errors.ts:212](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L212)

#### Returns

`void`

***

### getCurrentPath()

> **getCurrentPath**(): `string`

Defined in: [errors.ts:216](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L216)

#### Returns

`string`

***

### getResult()

> **getResult**(): [`DetailedValidationResult`](../interfaces/DetailedValidationResult.md)

Defined in: [errors.ts:220](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L220)

#### Returns

[`DetailedValidationResult`](../interfaces/DetailedValidationResult.md)

***

### reset()

> **reset**(): `void`

Defined in: [errors.ts:230](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L230)

#### Returns

`void`
