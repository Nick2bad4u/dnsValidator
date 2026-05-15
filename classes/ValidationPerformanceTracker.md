# Class: ValidationPerformanceTracker

Defined in: [performance.ts:206](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L206)

Performance tracking for validation operations

## Constructors

### Constructor

> **new ValidationPerformanceTracker**(): `ValidationPerformanceTracker`

#### Returns

`ValidationPerformanceTracker`

## Methods

### getMetrics()

> **getMetrics**(): [`ValidationMetrics`](../interfaces/ValidationMetrics.md)

Defined in: [performance.ts:217](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L217)

#### Returns

[`ValidationMetrics`](../interfaces/ValidationMetrics.md)

***

### recordCacheHit()

> **recordCacheHit**(): `void`

Defined in: [performance.ts:221](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L221)

#### Returns

`void`

***

### recordCacheMiss()

> **recordCacheMiss**(): `void`

Defined in: [performance.ts:225](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L225)

#### Returns

`void`

***

### recordSuccess()

> **recordSuccess**(): `void`

Defined in: [performance.ts:229](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L229)

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [performance.ts:233](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L233)

#### Returns

`void`

***

### startValidation()

> **startValidation**(): () => `void`

Defined in: [performance.ts:244](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L244)

#### Returns

() => `void`
