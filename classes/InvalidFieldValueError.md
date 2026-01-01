# Class: InvalidFieldValueError

Defined in: [errors.ts:99](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L99)

Error thrown when a field value is invalid

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new InvalidFieldValueError**(`field`, `value`, `expectedFormat?`): `InvalidFieldValueError`

Defined in: [errors.ts:100](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L100)

#### Parameters

##### field

`string`

##### value

`unknown`

##### expectedFormat?

`string`

#### Returns

`InvalidFieldValueError`

#### Overrides

[`DNSValidationError`](DNSValidationError.md).[`constructor`](DNSValidationError.md#constructor)

## Properties

### code

> `readonly` **code**: `string`

Defined in: [errors.ts:9](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L9)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`code`](DNSValidationError.md#code)

***

### field

> `readonly` **field**: `string` \| `undefined`

Defined in: [errors.ts:10](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L10)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`field`](DNSValidationError.md#field)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:11](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L11)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`value`](DNSValidationError.md#value)
