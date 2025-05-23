[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / time

# time

## Type Aliases

### DurationObj

```ts
type DurationObj = object;
```

Defined in: [src/time.ts:111](https://github.com/lucasols/utils/blob/main/src/time.ts#L111)

#### Properties

##### days?

```ts
optional days: number;
```

Defined in: [src/time.ts:116](https://github.com/lucasols/utils/blob/main/src/time.ts#L116)

##### hours?

```ts
optional hours: number;
```

Defined in: [src/time.ts:115](https://github.com/lucasols/utils/blob/main/src/time.ts#L115)

##### minutes?

```ts
optional minutes: number;
```

Defined in: [src/time.ts:114](https://github.com/lucasols/utils/blob/main/src/time.ts#L114)

##### ms?

```ts
optional ms: number;
```

Defined in: [src/time.ts:112](https://github.com/lucasols/utils/blob/main/src/time.ts#L112)

##### seconds?

```ts
optional seconds: number;
```

Defined in: [src/time.ts:113](https://github.com/lucasols/utils/blob/main/src/time.ts#L113)

## Variables

### DAY\_AS\_MS

```ts
const DAY_AS_MS: number;
```

Defined in: [src/time.ts:6](https://github.com/lucasols/utils/blob/main/src/time.ts#L6)

***

### DAY\_AS\_SECS

```ts
const DAY_AS_SECS: number;
```

Defined in: [src/time.ts:12](https://github.com/lucasols/utils/blob/main/src/time.ts#L12)

***

### HOUR\_AS\_MS

```ts
const HOUR_AS_MS: number;
```

Defined in: [src/time.ts:5](https://github.com/lucasols/utils/blob/main/src/time.ts#L5)

***

### HOUR\_AS\_SECS

```ts
const HOUR_AS_SECS: number;
```

Defined in: [src/time.ts:11](https://github.com/lucasols/utils/blob/main/src/time.ts#L11)

***

### MINUTE\_AS\_MS

```ts
const MINUTE_AS_MS: number;
```

Defined in: [src/time.ts:4](https://github.com/lucasols/utils/blob/main/src/time.ts#L4)

***

### MONTH\_AS\_MS

```ts
const MONTH_AS_MS: number;
```

Defined in: [src/time.ts:8](https://github.com/lucasols/utils/blob/main/src/time.ts#L8)

***

### MONTH\_AS\_SECS

```ts
const MONTH_AS_SECS: number;
```

Defined in: [src/time.ts:14](https://github.com/lucasols/utils/blob/main/src/time.ts#L14)

***

### WEEK\_AS\_MS

```ts
const WEEK_AS_MS: number;
```

Defined in: [src/time.ts:7](https://github.com/lucasols/utils/blob/main/src/time.ts#L7)

***

### WEEK\_AS\_SECS

```ts
const WEEK_AS_SECS: number;
```

Defined in: [src/time.ts:13](https://github.com/lucasols/utils/blob/main/src/time.ts#L13)

***

### YEAR\_AS\_MS

```ts
const YEAR_AS_MS: number;
```

Defined in: [src/time.ts:9](https://github.com/lucasols/utils/blob/main/src/time.ts#L9)

***

### YEAR\_AS\_SECS

```ts
const YEAR_AS_SECS: number;
```

Defined in: [src/time.ts:15](https://github.com/lucasols/utils/blob/main/src/time.ts#L15)

## Functions

### dateStringOrNullToUnixMs()

```ts
function dateStringOrNullToUnixMs(isoString): null | number;
```

Defined in: [src/time.ts:17](https://github.com/lucasols/utils/blob/main/src/time.ts#L17)

#### Parameters

##### isoString

`undefined` | `null` | `string`

#### Returns

`null` \| `number`

***

### durationObjToMs()

```ts
function durationObjToMs(durationObj): number;
```

Defined in: [src/time.ts:119](https://github.com/lucasols/utils/blob/main/src/time.ts#L119)

#### Parameters

##### durationObj

[`DurationObj`](#durationobj)

#### Returns

`number`

***

### getUnixSeconds()

```ts
function getUnixSeconds(): number;
```

Defined in: [src/time.ts:107](https://github.com/lucasols/utils/blob/main/src/time.ts#L107)

#### Returns

`number`

***

### msToTimeString()

```ts
function msToTimeString(
   ms, 
   format, 
   hoursMinLength): string;
```

Defined in: [src/time.ts:29](https://github.com/lucasols/utils/blob/main/src/time.ts#L29)

#### Parameters

##### ms

`number`

##### format

`"seconds"` | `"minutes"` | `"milliseconds"`

##### hoursMinLength

`number` = `2`

#### Returns

`string`

***

### parseTimeStringToMs()

```ts
function parseTimeStringToMs(timeString): number;
```

Defined in: [src/time.ts:59](https://github.com/lucasols/utils/blob/main/src/time.ts#L59)

#### Parameters

##### timeString

`string`

#### Returns

`number`
