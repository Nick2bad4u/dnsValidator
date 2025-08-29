# Class: InvalidQueryStructureError

Defined in: [errors.ts:127](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L127)

Error thrown when DNS query structure is invalid

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new InvalidQueryStructureError**(`message`, `field?`): `InvalidQueryStructureError`

Defined in: [errors.ts:128](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L128)

#### Parameters

##### message

`string`

##### field?

`string`

#### Returns

`InvalidQueryStructureError`

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

> `readonly` **field**: `undefined` \| `string`

Defined in: [errors.ts:10](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L10)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`field`](DNSValidationError.md#field)

***

### value

> `readonly` **value**: `unknown`

Defined in: [errors.ts:11](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L11)

#### Inherited from

[`DNSValidationError`](DNSValidationError.md).[`value`](DNSValidationError.md#value)
