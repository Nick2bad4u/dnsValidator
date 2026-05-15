# Class: InvalidFieldValueError

Defined in: [errors.ts:126](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L126)

Error thrown when a field value is invalid

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new InvalidFieldValueError**(`field`, `value`, `expectedFormat?`): `InvalidFieldValueError`

Defined in: [errors.ts:127](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L127)

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

Defined in: [errors.ts:22](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L22)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`code`](DNSValidationError.md#code)

***

### field

> `readonly` **field**: `string` \| `undefined`

Defined in: [errors.ts:23](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L23)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`field`](DNSValidationError.md#field)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:24](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L24)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`value`](DNSValidationError.md#value)
