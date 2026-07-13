# Function: trackPerformance()

```ts
function trackPerformance<Arguments, Return>(
  validationFn: (...args: Arguments) => Return,
  tracker?: ValidationPerformanceTracker,
): (...args: Arguments) => Return;
```

Defined in: [src/performance.ts:289](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/performance.ts#L289)

Decorator for tracking validation performance

## Type Parameters

### Arguments

`Arguments` _extends_ `unknown`\[]

### Return

`Return`

## Parameters

### validationFn

(...`args`: `Arguments`) => `Return`

### tracker?

[`ValidationPerformanceTracker`](../classes/ValidationPerformanceTracker.md) = `globalPerformanceTracker`

## Returns

(...`args`: `Arguments`) => `Return`
