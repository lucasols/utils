[@ls-stack/utils](../modules.md) / [partialEqual](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### BaseMatch

```ts
type BaseMatch = object;
```

Defined in: [packages/utils/src/partialEqual.ts:52](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L52)

#### Properties

##### all()

```ts
all: (...values) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:101](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L101)

###### Parameters

###### values

...`any`[]

###### Returns

[`Comparison`](#comparison)

##### any()

```ts
any: (...values) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:100](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L100)

###### Parameters

###### values

...`any`[]

###### Returns

[`Comparison`](#comparison)

##### array

```ts
array: object;
```

Defined in: [packages/utils/src/partialEqual.ts:79](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L79)

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

Defined in: [packages/utils/src/partialEqual.ts:96](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L96)

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

Defined in: [packages/utils/src/partialEqual.ts:56](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L56)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### deepNoExtraKeys()

```ts
deepNoExtraKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L54)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### equal()

```ts
equal: (value) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:94](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L94)

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### hasType

```ts
hasType: object;
```

Defined in: [packages/utils/src/partialEqual.ts:57](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L57)

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

Defined in: [packages/utils/src/partialEqual.ts:65](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L65)

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparison`](#comparison)

##### jsonString

```ts
jsonString: object;
```

Defined in: [packages/utils/src/partialEqual.ts:91](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L91)

###### hasPartial()

```ts
hasPartial: (value) => Comparison;
```

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### keyNotBePresent

```ts
keyNotBePresent: Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:99](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L99)

##### noExtraDefinedKeys()

```ts
noExtraDefinedKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L55)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### noExtraKeys()

```ts
noExtraKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:53](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L53)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### num

```ts
num: object;
```

Defined in: [packages/utils/src/partialEqual.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L72)

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

Defined in: [packages/utils/src/partialEqual.ts:95](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L95)

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### str

```ts
str: object;
```

Defined in: [packages/utils/src/partialEqual.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L66)

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

Defined in: [packages/utils/src/partialEqual.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L44)

#### Properties

##### ~sc

```ts
~sc: ComparisonsType;
```

Defined in: [packages/utils/src/partialEqual.ts:45](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L45)

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

### Match

```ts
type Match = BaseMatch & object;
```

Defined in: [packages/utils/src/partialEqual.ts:104](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L104)

#### Type declaration

##### not

```ts
not: BaseMatch;
```

***

### PartialError

```ts
type PartialError = object;
```

Defined in: [packages/utils/src/partialEqual.ts:853](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L853)

#### Properties

##### expected?

```ts
optional expected: any;
```

Defined in: [packages/utils/src/partialEqual.ts:857](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L857)

##### message

```ts
message: string;
```

Defined in: [packages/utils/src/partialEqual.ts:855](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L855)

##### path

```ts
path: string;
```

Defined in: [packages/utils/src/partialEqual.ts:854](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L854)

##### received?

```ts
optional received: any;
```

Defined in: [packages/utils/src/partialEqual.ts:856](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L856)
