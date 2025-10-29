# Class: ValidationPerformanceTracker

Defined in: [performance.ts:189](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L189)

Performance tracking for validation operations

## Constructors

### Constructor

> **new ValidationPerformanceTracker**(): `ValidationPerformanceTracker`

#### Returns

`ValidationPerformanceTracker`

## Methods

### startValidation()

> **startValidation**(): () => `void`

Defined in: [performance.ts:200](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L200)

#### Returns

> (): `void`

##### Returns

`void`

***

### recordSuccess()

> **recordSuccess**(): `void`

Defined in: [performance.ts:215](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L215)

#### Returns

`void`

***

### recordCacheHit()

> **recordCacheHit**(): `void`

Defined in: [performance.ts:219](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L219)

#### Returns

`void`

***

### recordCacheMiss()

> **recordCacheMiss**(): `void`

Defined in: [performance.ts:223](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L223)

#### Returns

`void`

***

### getMetrics()

> **getMetrics**(): [`ValidationMetrics`](../interfaces/ValidationMetrics.md)

Defined in: [performance.ts:227](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L227)

#### Returns

[`ValidationMetrics`](../interfaces/ValidationMetrics.md)

***

### reset()

> **reset**(): `void`

Defined in: [performance.ts:231](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L231)

#### Returns

`void`
