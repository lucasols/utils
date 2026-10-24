[@ls-stack/utils](../modules.md) / [partialEqual](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### BaseMatch

```ts
type BaseMatch = object;
```

Defined in: [packages/utils/src/partialEqual.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L62)

#### Properties

##### all()

```ts
all: (...values) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:109](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L109)

###### Parameters

###### values

...`any`[]

###### Returns

[`Comparison`](#comparison)

##### any()

```ts
any: (...values) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:108](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L108)

###### Parameters

###### values

...`any`[]

###### Returns

[`Comparison`](#comparison)

##### array

```ts
array: object;
```

Defined in: [packages/utils/src/partialEqual.ts:89](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L89)

###### contains()

```ts
contains: (elements) => Comparison;
```

###### Parameters

###### elements

`any`[]

###### Returns

[`Comparison`](#comparison)

###### containsInOrder()

```ts
containsInOrder: (elements) => Comparison;
```

###### Parameters

###### elements

`any`[]

###### Returns

[`Comparison`](#comparison)

###### endsWith()

```ts
endsWith: (elements) => Comparison;
```

###### Parameters

###### elements

`any`[]

###### Returns

[`Comparison`](#comparison)

###### every()

```ts
every: (matcher) => Comparison;
```

###### Parameters

###### matcher

[`Comparison`](#comparison)

###### Returns

[`Comparison`](#comparison)

###### includes()

```ts
includes: (element) => Comparison;
```

###### Parameters

###### element

`any`

###### Returns

[`Comparison`](#comparison)

###### length()

```ts
length: (n) => Comparison;
```

###### Parameters

###### n

`number`

###### Returns

[`Comparison`](#comparison)

###### maxLength()

```ts
maxLength: (n) => Comparison;
```

###### Parameters

###### n

`number`

###### Returns

[`Comparison`](#comparison)

###### minLength()

```ts
minLength: (n) => Comparison;
```

###### Parameters

###### n

`number`

###### Returns

[`Comparison`](#comparison)

###### some()

```ts
some: (matcher) => Comparison;
```

###### Parameters

###### matcher

[`Comparison`](#comparison)

###### Returns

[`Comparison`](#comparison)

###### startsWith()

```ts
startsWith: (elements) => Comparison;
```

###### Parameters

###### elements

`any`[]

###### Returns

[`Comparison`](#comparison)

##### custom()

```ts
custom: (isEqual) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:104](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L104)

###### Parameters

###### isEqual

(`value`) => 
  \| `boolean`
  \| \{
  `error`: `string`;
\}

###### Returns

[`Comparison`](#comparison)

##### deepNoExtraDefinedKeys()

```ts
deepNoExtraDefinedKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L66)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### deepNoExtraKeys()

```ts
deepNoExtraKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L64)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### equal()

```ts
equal: (value) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:102](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L102)

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### hasType

```ts
hasType: object;
```

Defined in: [packages/utils/src/partialEqual.ts:67](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L67)

###### array

```ts
array: Comparison;
```

###### boolean

```ts
boolean: Comparison;
```

###### function

```ts
function: Comparison;
```

###### number

```ts
number: Comparison;
```

###### object

```ts
object: Comparison;
```

###### string

```ts
string: Comparison;
```

##### isInstanceOf()

```ts
isInstanceOf: (constructor) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L75)

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparison`](#comparison)

##### jsonString

```ts
jsonString: object;
```

Defined in: [packages/utils/src/partialEqual.ts:101](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L101)

###### hasPartial()

```ts
hasPartial: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### key

```ts
key: object;
```

Defined in: [packages/utils/src/partialEqual.ts:110](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L110)

###### any

```ts
any: KeyComparison["any"];
```

###### anyOther

```ts
anyOther: KeyComparison["anyOther"];
```

###### containing()

```ts
containing: (substring) => KeyComparison["contains"];
```

###### Parameters

###### substring

`string`

###### Returns

[`KeyComparison`](#keycomparison)\[`"contains"`\]

###### endingWith()

```ts
endingWith: (substring) => KeyComparison["endingWith"];
```

###### Parameters

###### substring

`string`

###### Returns

[`KeyComparison`](#keycomparison)\[`"endingWith"`\]

###### matchingRegex()

```ts
matchingRegex: (regex) => KeyComparison["matchesRegex"];
```

###### Parameters

###### regex

`RegExp`

###### Returns

[`KeyComparison`](#keycomparison)\[`"matchesRegex"`\]

###### numeric

```ts
numeric: KeyComparison["numeric"];
```

###### startingWith()

```ts
startingWith: (substring) => KeyComparison["startingWith"];
```

###### Parameters

###### substring

`string`

###### Returns

[`KeyComparison`](#keycomparison)\[`"startingWith"`\]

##### keyNotBePresent

```ts
keyNotBePresent: Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:107](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L107)

##### noExtraDefinedKeys()

```ts
noExtraDefinedKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L65)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### noExtraKeys()

```ts
noExtraKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:63](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L63)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### num

```ts
num: object;
```

Defined in: [packages/utils/src/partialEqual.ts:82](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L82)

###### isGreaterThan()

```ts
isGreaterThan: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](#comparison)

###### isGreaterThanOrEqual()

```ts
isGreaterThanOrEqual: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](#comparison)

###### isInRange()

```ts
isInRange: (value) => Comparison;
```

###### Parameters

###### value

\[`number`, `number`\]

###### Returns

[`Comparison`](#comparison)

###### isLessThan()

```ts
isLessThan: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](#comparison)

###### isLessThanOrEqual()

```ts
isLessThanOrEqual: (value) => Comparison;
```

###### Parameters

###### value

`number`

###### Returns

[`Comparison`](#comparison)

##### partialEqual()

```ts
partialEqual: (value) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:103](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L103)

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### str

```ts
str: object;
```

Defined in: [packages/utils/src/partialEqual.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L76)

###### contains()

```ts
contains: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](#comparison)

###### endsWith()

```ts
endsWith: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](#comparison)

###### matchesRegex()

```ts
matchesRegex: (regex) => Comparison;
```

###### Parameters

###### regex

`RegExp`

###### Returns

[`Comparison`](#comparison)

###### startsWith()

```ts
startsWith: (substring) => Comparison;
```

###### Parameters

###### substring

`string`

###### Returns

[`Comparison`](#comparison)

***

### Comparison

```ts
type Comparison = object;
```

Defined in: [packages/utils/src/partialEqual.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L56)

#### Properties

##### ~sc

```ts
~sc: ComparisonsType;
```

Defined in: [packages/utils/src/partialEqual.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L56)

***

### ComparisonsType

```ts
type ComparisonsType = 
  | ["strStartsWith", string]
  | ["strEndsWith", string]
  | ["hasType", "string" | "number" | "boolean" | "object" | "array" | "function"]
  | ["strContains", string]
  | ["strMatchesRegex", RegExp]
  | ["deepEqual", any]
  | ["numIsGreaterThan", number]
  | ["numIsGreaterThanOrEqual", number]
  | ["numIsLessThan", number]
  | ["numIsLessThanOrEqual", number]
  | ["numIsInRange", [number, number]]
  | ["arrayContains", any[]]
  | ["arrayContainsInOrder", any[]]
  | ["arrayStartsWith", any[]]
  | ["arrayEndsWith", any[]]
  | ["arrayLength", number]
  | ["arrayMinLength", number]
  | ["arrayMaxLength", number]
  | ["arrayIncludes", any]
  | ["arrayEvery", ComparisonsType]
  | ["arraySome", ComparisonsType]
  | ["jsonStringHasPartial", any]
  | ["partialEqual", any]
  | ["custom", (target) => 
  | boolean
  | {
  error: string;
}]
  | ["isInstanceOf", (...args) => any]
  | ["keyNotBePresent", null]
  | ["not", ComparisonsType]
  | ["any", ComparisonsType[]]
  | ["all", ComparisonsType[]]
  | ["withNoExtraKeys", any]
  | ["withDeepNoExtraKeys", any]
  | ["noExtraDefinedKeys", any]
  | ["deepNoExtraDefinedKeys", any];
```

Defined in: [packages/utils/src/partialEqual.ts:6](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L6)

***

### KeyComparison

```ts
type KeyComparison = object;
```

Defined in: [packages/utils/src/partialEqual.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L46)

#### Properties

##### any

```ts
any: `$${KeyComparisonPrefix}:any$`;
```

Defined in: [packages/utils/src/partialEqual.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L47)

##### anyOther

```ts
anyOther: `$${KeyComparisonPrefix}:anyOther$`;
```

Defined in: [packages/utils/src/partialEqual.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L48)

##### contains

```ts
contains: `$${KeyComparisonPrefix}:contains:${string}$`;
```

Defined in: [packages/utils/src/partialEqual.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L52)

##### endingWith

```ts
endingWith: `$${KeyComparisonPrefix}:endingWith:${string}$`;
```

Defined in: [packages/utils/src/partialEqual.ts:51](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L51)

##### matchesRegex

```ts
matchesRegex: `$${KeyComparisonPrefix}:matchesRegex:${string}$`;
```

Defined in: [packages/utils/src/partialEqual.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L53)

##### numeric

```ts
numeric: `$${KeyComparisonPrefix}:numeric$`;
```

Defined in: [packages/utils/src/partialEqual.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L49)

##### startingWith

```ts
startingWith: `$${KeyComparisonPrefix}:startingWith:${string}$`;
```

Defined in: [packages/utils/src/partialEqual.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L50)

***

### KeyComparisonPrefix

```ts
type KeyComparisonPrefix = "pqkc" | "pqkc-not";
```

Defined in: [packages/utils/src/partialEqual.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L44)

***

### Match

```ts
type Match = BaseMatch & object;
```

Defined in: [packages/utils/src/partialEqual.ts:121](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L121)

#### Type Declaration

##### not

```ts
not: BaseMatch;
```

***

### PartialError

```ts
type PartialError = object;
```

Defined in: [packages/utils/src/partialEqual.ts:981](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L981)

#### Properties

##### expected?

```ts
optional expected: any;
```

Defined in: [packages/utils/src/partialEqual.ts:985](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L985)

##### message

```ts
message: string;
```

Defined in: [packages/utils/src/partialEqual.ts:983](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L983)

##### path

```ts
path: string;
```

Defined in: [packages/utils/src/partialEqual.ts:982](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L982)

##### received?

```ts
optional received: any;
```

Defined in: [packages/utils/src/partialEqual.ts:984](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L984)
