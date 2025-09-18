[@ls-stack/utils](../modules.md) / [partialEqual](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### BaseMatch

```ts
type BaseMatch = object;
```

Defined in: [packages/utils/src/partialEqual.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L44)

#### Properties

##### all()

```ts
all: (...comparisons) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:79](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L79)

###### Parameters

###### comparisons

...[`Comparison`](#comparison)[]

###### Returns

[`Comparison`](#comparison)

##### any()

```ts
any: (...comparisons) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:78](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L78)

###### Parameters

###### comparisons

...[`Comparison`](#comparison)[]

###### Returns

[`Comparison`](#comparison)

##### custom()

```ts
custom: (isEqual) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L76)

###### Parameters

###### isEqual

(`value`) => `boolean`

###### Returns

[`Comparison`](#comparison)

##### deepNoExtraDefinedKeys()

```ts
deepNoExtraDefinedKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L48)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### deepNoExtraKeys()

```ts
deepNoExtraKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L46)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### equal()

```ts
equal: (value) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:74](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L74)

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### hasType

```ts
hasType: object;
```

Defined in: [packages/utils/src/partialEqual.ts:49](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L49)

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

Defined in: [packages/utils/src/partialEqual.ts:57](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L57)

###### Parameters

###### constructor

(...`args`) => `any`

###### Returns

[`Comparison`](#comparison)

##### jsonString

```ts
jsonString: object;
```

Defined in: [packages/utils/src/partialEqual.ts:71](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L71)

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

Defined in: [packages/utils/src/partialEqual.ts:77](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L77)

##### noExtraDefinedKeys()

```ts
noExtraDefinedKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:47](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L47)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### noExtraKeys()

```ts
noExtraKeys: (partialShape) => Comparison;
```

Defined in: [packages/utils/src/partialEqual.ts:45](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L45)

###### Parameters

###### partialShape

`any`

###### Returns

[`Comparison`](#comparison)

##### num

```ts
num: object;
```

Defined in: [packages/utils/src/partialEqual.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L64)

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

Defined in: [packages/utils/src/partialEqual.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L75)

###### Parameters

###### value

`any`

###### Returns

[`Comparison`](#comparison)

##### str

```ts
str: object;
```

Defined in: [packages/utils/src/partialEqual.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L58)

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

Defined in: [packages/utils/src/partialEqual.ts:36](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L36)

#### Properties

##### ~sc

```ts
~sc: ComparisonsType;
```

Defined in: [packages/utils/src/partialEqual.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L37)

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
  | ["jsonStringHasPartial", any]
  | ["partialEqual", any]
  | ["custom", (target) => boolean]
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

Defined in: [packages/utils/src/partialEqual.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L8)

***

### Match

```ts
type Match = BaseMatch & object;
```

Defined in: [packages/utils/src/partialEqual.ts:82](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L82)

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

Defined in: [packages/utils/src/partialEqual.ts:564](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L564)

#### Properties

##### expected?

```ts
optional expected: any;
```

Defined in: [packages/utils/src/partialEqual.ts:568](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L568)

##### message

```ts
message: string;
```

Defined in: [packages/utils/src/partialEqual.ts:566](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L566)

##### path

```ts
path: string;
```

Defined in: [packages/utils/src/partialEqual.ts:565](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L565)

##### received

```ts
received: any;
```

Defined in: [packages/utils/src/partialEqual.ts:567](https://github.com/lucasols/utils/blob/main/packages/utils/src/partialEqual.ts#L567)
