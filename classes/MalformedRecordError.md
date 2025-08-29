# Class: MalformedRecordError

Defined in: [errors.ts:89](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L89)

Error thrown when a DNS record structure is malformed

## Extends

- [`DNSValidationError`](DNSValidationError.md)

## Constructors

### Constructor

> **new MalformedRecordError**(`message`, `field?`, `value?`): `MalformedRecordError`

Defined in: [errors.ts:90](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L90)

#### Parameters

##### message

`string`

##### field?

`string`

##### value?

`unknown`

#### Returns

`MalformedRecordError`

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
