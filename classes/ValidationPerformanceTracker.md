# Class: ValidationPerformanceTracker

Defined in: [src/performance.ts:218](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L218)

Performance tracking for validation operations

## Constructors

<a id="constructor"></a>

### Constructor

```ts
new ValidationPerformanceTracker(): ValidationPerformanceTracker;
```

#### Returns

`ValidationPerformanceTracker`

## Properties

<a id="metrics"></a>

### metrics {#metrics}

```ts
private metrics: ValidationMetrics;
```

Defined in: [src/performance.ts:219](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L219)

---

<a id="totaltime"></a>

### totalTime {#totaltime}

```ts
private totalTime: number = 0;
```

Defined in: [src/performance.ts:227](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L227)

## Methods

<a id="getmetrics"></a>

### getMetrics() {#getmetrics}

```ts
getMetrics(): ValidationMetrics;
```

Defined in: [src/performance.ts:229](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L229)

#### Returns

[`ValidationMetrics`](../interfaces/ValidationMetrics.md)

---

<a id="recordcachehit"></a>

### recordCacheHit() {#recordcachehit}

```ts
recordCacheHit(): void;
```

Defined in: [src/performance.ts:233](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L233)

#### Returns

`void`

---

<a id="recordcachemiss"></a>

### recordCacheMiss() {#recordcachemiss}

```ts
recordCacheMiss(): void;
```

Defined in: [src/performance.ts:237](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L237)

#### Returns

`void`

---

<a id="recordsuccess"></a>

### recordSuccess() {#recordsuccess}

```ts
recordSuccess(): void;
```

Defined in: [src/performance.ts:241](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L241)

#### Returns

`void`

---

<a id="reset"></a>

### reset() {#reset}

```ts
reset(): void;
```

Defined in: [src/performance.ts:245](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L245)

#### Returns

`void`

---

<a id="startvalidation"></a>

### startValidation() {#startvalidation}

```ts
startValidation(): () => void;
```

Defined in: [src/performance.ts:256](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L256)

#### Returns

() => `void`

---

<a id="recordvalidation"></a>

### recordValidation() {#recordvalidation}

```ts
private recordValidation(durationMs: number): void;
```

Defined in: [src/performance.ts:265](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L265)

#### Parameters

##### durationMs

`number`

#### Returns

`void`
