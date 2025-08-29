# Class: ValidationContext

Defined in: [errors.ts:147](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L147)

Validation context for tracking field paths and providing better error messages

## Constructors

### Constructor

> **new ValidationContext**(): `ValidationContext`

#### Returns

`ValidationContext`

## Methods

### enterField()

> **enterField**(`field`): `void`

Defined in: [errors.ts:153](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L153)

#### Parameters

##### field

`string`

#### Returns

`void`

***

### exitField()

> **exitField**(): `void`

Defined in: [errors.ts:157](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L157)

#### Returns

`void`

***

### addError()

> **addError**(`error`): `void`

Defined in: [errors.ts:161](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L161)

#### Parameters

##### error

[`DNSValidationError`](DNSValidationError.md)

#### Returns

`void`

***

### addWarning()

> **addWarning**(`message`): `void`

Defined in: [errors.ts:165](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L165)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### addSuggestion()

> **addSuggestion**(`message`): `void`

Defined in: [errors.ts:169](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L169)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### getCurrentPath()

> **getCurrentPath**(): `string`

Defined in: [errors.ts:173](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L173)

#### Returns

`string`

***

### getResult()

> **getResult**(): [`DetailedValidationResult`](../interfaces/DetailedValidationResult.md)

Defined in: [errors.ts:177](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L177)

#### Returns

[`DetailedValidationResult`](../interfaces/DetailedValidationResult.md)

***

### reset()

> **reset**(): `void`

Defined in: [errors.ts:187](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L187)

#### Returns

`void`
