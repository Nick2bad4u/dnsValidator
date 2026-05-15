# Class: MissingRequiredFieldError

Defined in: [errors.ts:175](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L175)

Error thrown when required fields are missing

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new MissingRequiredFieldError**(`field`, `recordType`): `MissingRequiredFieldError`

Defined in: [errors.ts:176](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L176)

#### Parameters

##### field

`string`

##### recordType

`string`

#### Returns

`MissingRequiredFieldError`

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
