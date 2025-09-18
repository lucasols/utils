[@ls-stack/utils](../modules.md) / partialEqual

# partialEqual

## Modules

- [\<internal\>](-internal-.md)

## Variables

### match

```ts
const match: object;
```

Defined in: [packages/utils/src/partialEqual.ts:34](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L34)

#### Type declaration

##### custom()

```ts
custom: (isEqual) => Comparisons;
```

###### Parameters

###### isEqual

(`value`) => `boolean`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### equal()

```ts
equal: (value) => Comparisons;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### hasType

```ts
hasType: object;
```

###### hasType.array

```ts
array: Comparisons;
```

###### hasType.boolean

```ts
boolean: Comparisons;
```

###### hasType.function

```ts
function: Comparisons;
```

###### hasType.number

```ts
number: Comparisons;
```

###### hasType.object

```ts
object: Comparisons;
```

###### hasType.string

```ts
string: Comparisons;
```

##### isInstanceOf()

```ts
isInstanceOf: (constructor) => Comparisons;
```

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### jsonString

```ts
jsonString: object;
```

###### jsonString.hasPartial()

```ts
hasPartial: (value) => Comparisons;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### not

```ts
not: object;
```

###### not.custom()

```ts
custom: (value) => Comparisons;
```

###### Parameters

###### value

(`target`) => `boolean`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.equal()

```ts
equal: (value) => Comparisons;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.hasType

```ts
hasType: object;
```

###### not.hasType.array

```ts
array: Comparisons;
```

###### not.hasType.boolean

```ts
boolean: Comparisons;
```

###### not.hasType.function

```ts
function: Comparisons;
```

###### not.hasType.number

```ts
number: Comparisons;
```

###### not.hasType.object

```ts
object: Comparisons;
```

###### not.hasType.string

```ts
string: Comparisons;
```

###### not.isInstanceOf()

```ts
isInstanceOf: (constructor) => Comparisons;
```

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.jsonString

```ts
jsonString: object;
```

###### not.jsonString.hasPartial()

```ts
hasPartial: (value) => Comparisons;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.num

```ts
num: object;
```

###### not.num.isGreaterThan()

```ts
isGreaterThan: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.num.isGreaterThanOrEqual()

```ts
isGreaterThanOrEqual: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.num.isInRange()

```ts
isInRange: (value) => Comparisons;
```

###### Parameters

###### value

\[`number`, `number`\]

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.num.isLessThan()

```ts
isLessThan: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.num.isLessThanOrEqual()

```ts
isLessThanOrEqual: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.partialEqual()

```ts
partialEqual: (value) => Comparisons;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.str

```ts
str: object;
```

###### not.str.contains()

```ts
contains: (substring) => Comparisons;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.str.endsWith()

```ts
endsWith: (substring) => Comparisons;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.str.matchesRegex()

```ts
matchesRegex: (regex) => Comparisons;
```

###### Parameters

###### regex

`RegExp`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### not.str.startsWith()

```ts
startsWith: (substring) => Comparisons;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### num

```ts
num: object;
```

###### num.isGreaterThan()

```ts
isGreaterThan: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### num.isGreaterThanOrEqual()

```ts
isGreaterThanOrEqual: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### num.isInRange()

```ts
isInRange: (value) => Comparisons;
```

###### Parameters

###### value

\[`number`, `number`\]

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### num.isLessThan()

```ts
isLessThan: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### num.isLessThanOrEqual()

```ts
isLessThanOrEqual: (value) => Comparisons;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### partialEqual()

```ts
partialEqual: (value) => Comparisons;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

##### str

```ts
str: object;
```

###### str.contains()

```ts
contains: (substring) => Comparisons;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### str.endsWith()

```ts
endsWith: (substring) => Comparisons;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### str.matchesRegex()

```ts
matchesRegex: (regex) => Comparisons;
```

###### Parameters

###### regex

`RegExp`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

###### str.startsWith()

```ts
startsWith: (substring) => Comparisons;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparisons`](-internal-.md#comparisons)

## Functions

### partialEqual()

```ts
function partialEqual(target, sub): boolean;
```

Defined in: [packages/utils/src/partialEqual.ts:222](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L222)

#### Parameters

##### target

`any`

##### sub

`any`

#### Returns

`boolean`
