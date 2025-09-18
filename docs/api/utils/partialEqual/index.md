[@ls-stack/utils](../modules.md) / partialEqual

# partialEqual

## Modules

- [\<internal\>](-internal-.md)

## Variables

### match

```ts
const match: object;
```

Defined in: [packages/utils/src/partialEqual.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L37)

#### Type declaration

##### custom()

```ts
custom: (isEqual) => Comparison;
```

###### Parameters

###### isEqual

(`value`) => `boolean`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### equal()

```ts
equal: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### hasType

```ts
hasType: object;
```

###### hasType.array

```ts
array: Comparison;
```

###### hasType.boolean

```ts
boolean: Comparison;
```

###### hasType.function

```ts
function: Comparison;
```

###### hasType.number

```ts
number: Comparison;
```

###### hasType.object

```ts
object: Comparison;
```

###### hasType.string

```ts
string: Comparison;
```

##### isInstanceOf()

```ts
isInstanceOf: (constructor) => Comparison;
```

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### jsonString

```ts
jsonString: object;
```

###### jsonString.hasPartial()

```ts
hasPartial: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### not

```ts
not: object;
```

###### not.custom()

```ts
custom: (value) => Comparison;
```

###### Parameters

###### value

(`target`) => `boolean`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.equal()

```ts
equal: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.hasType

```ts
hasType: object;
```

###### not.hasType.array

```ts
array: Comparison;
```

###### not.hasType.boolean

```ts
boolean: Comparison;
```

###### not.hasType.function

```ts
function: Comparison;
```

###### not.hasType.number

```ts
number: Comparison;
```

###### not.hasType.object

```ts
object: Comparison;
```

###### not.hasType.string

```ts
string: Comparison;
```

###### not.isInstanceOf()

```ts
isInstanceOf: (constructor) => Comparison;
```

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.jsonString

```ts
jsonString: object;
```

###### not.jsonString.hasPartial()

```ts
hasPartial: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.num

```ts
num: object;
```

###### not.num.isGreaterThan()

```ts
isGreaterThan: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.num.isGreaterThanOrEqual()

```ts
isGreaterThanOrEqual: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.num.isInRange()

```ts
isInRange: (value) => Comparison;
```

###### Parameters

###### value

\[`number`, `number`\]

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.num.isLessThan()

```ts
isLessThan: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.num.isLessThanOrEqual()

```ts
isLessThanOrEqual: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.partialEqual()

```ts
partialEqual: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.str

```ts
str: object;
```

###### not.str.contains()

```ts
contains: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.str.endsWith()

```ts
endsWith: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.str.matchesRegex()

```ts
matchesRegex: (regex) => Comparison;
```

###### Parameters

###### regex

`RegExp`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### not.str.startsWith()

```ts
startsWith: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### num

```ts
num: object;
```

###### num.isGreaterThan()

```ts
isGreaterThan: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### num.isGreaterThanOrEqual()

```ts
isGreaterThanOrEqual: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### num.isInRange()

```ts
isInRange: (value) => Comparison;
```

###### Parameters

###### value

\[`number`, `number`\]

###### Returns

[`Comparison`](-internal-.md#comparison)

###### num.isLessThan()

```ts
isLessThan: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### num.isLessThanOrEqual()

```ts
isLessThanOrEqual: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### partialEqual()

```ts
partialEqual: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](-internal-.md#comparison)

##### str

```ts
str: object;
```

###### str.contains()

```ts
contains: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### str.endsWith()

```ts
endsWith: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### str.matchesRegex()

```ts
matchesRegex: (regex) => Comparison;
```

###### Parameters

###### regex

`RegExp`

###### Returns

[`Comparison`](-internal-.md#comparison)

###### str.startsWith()

```ts
startsWith: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](-internal-.md#comparison)

## Functions

### partialEqual()

```ts
function partialEqual(target, sub): boolean;
```

Defined in: [packages/utils/src/partialEqual.ts:225](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L225)

#### Parameters

##### target

`any`

##### sub

`any`

#### Returns

`boolean`
