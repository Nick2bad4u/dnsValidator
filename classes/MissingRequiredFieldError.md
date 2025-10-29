# Class: MissingRequiredFieldError

Defined in: [errors.ts:113](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L113)

Error thrown when required fields are missing

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new MissingRequiredFieldError**(`field`, `recordType`): `MissingRequiredFieldError`

Defined in: [errors.ts:114](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L114)

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
