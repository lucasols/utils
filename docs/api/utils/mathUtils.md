[@ls-stack/utils](modules.md) / mathUtils

# mathUtils

## Functions

### ceilToStep()

```ts
function ceilToStep(
   value, 
   step, 
   offset): number;
```

Defined in: [packages/utils/src/mathUtils.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L75)

Ceils a number up to the nearest multiple of the specified step value.

#### Parameters

##### value

`number`

The number to ceil

##### step

`number`

The step size to ceil to

##### offset

`number` = `0`

Optional offset to shift the ceiling grid

#### Returns

`number`

The ceiled value

#### Example

```ts
ceilToStep(23, 5) // 25 (smallest multiple of 5 ≥ 23)
```

***

### clamp()

```ts
function clamp(
   num, 
   min, 
   max): number;
```

Defined in: [packages/utils/src/mathUtils.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L17)

#### Parameters

##### num

`number`

##### min

`number`

##### max

`number`

#### Returns

`number`

***

### clampMax()

```ts
function clampMax(value, max): number;
```

Defined in: [packages/utils/src/mathUtils.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L1)

#### Parameters

##### value

`number`

##### max

`number`

#### Returns

`number`

***

### clampMin()

```ts
function clampMin(value, min): number;
```

Defined in: [packages/utils/src/mathUtils.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L5)

#### Parameters

##### value

`number`

##### min

`number`

#### Returns

`number`

***

### clampRange()

```ts
function clampRange(
   num, 
   v1, 
   v2): number;
```

Defined in: [packages/utils/src/mathUtils.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L9)

#### Parameters

##### num

`number`

##### v1

`number`

##### v2

`number`

#### Returns

`number`

***

### fixFloatingPointNumber()

```ts
function fixFloatingPointNumber(value): number;
```

Defined in: [packages/utils/src/mathUtils.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L25)

#### Parameters

##### value

`number`

#### Returns

`number`

***

### floorToStep()

```ts
function floorToStep(
   value, 
   step, 
   offset): number;
```

Defined in: [packages/utils/src/mathUtils.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L58)

Floors a number down to the nearest multiple of the specified step value.

#### Parameters

##### value

`number`

The number to floor

##### step

`number`

The step size to floor to

##### offset

`number` = `0`

Optional offset to shift the flooring grid

#### Returns

`number`

The floored value

#### Example

```ts
floorToStep(23, 5) // 20 (largest multiple of 5 ≤ 23)
```

***

### round()

```ts
function round(num, precision): number;
```

Defined in: [packages/utils/src/mathUtils.ts:91](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L91)

Rounds a number to the specified number of decimal places.

#### Parameters

##### num

`number`

The number to round

##### precision

`number`

Number of decimal places

#### Returns

`number`

The rounded number

#### Example

```ts
round(3.14159, 2) // 3.14
```

***

### roundToStep()

```ts
function roundToStep(
   value, 
   step, 
   offset): number;
```

Defined in: [packages/utils/src/mathUtils.ts:40](https://github.com/lucasols/utils/blob/main/packages/utils/src/mathUtils.ts#L40)

Rounds a number to the nearest multiple of the specified step value.

#### Parameters

##### value

`number`

The number to round

##### step

`number`

The step size to round to

##### offset

`number` = `0`

Optional offset to shift the rounding grid

#### Returns

`number`

The rounded value

#### Example

```ts
roundToStep(23, 5) // 25 (nearest multiple of 5)
```
