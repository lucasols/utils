[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / objUtils

# objUtils

## Functions

### looseGetObjectProperty()

```ts
function looseGetObjectProperty<T>(obj, key): undefined | T[keyof T];
```

Defined in: [src/objUtils.ts:50](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L50)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

##### key

`string`

#### Returns

`undefined` \| `T`\[keyof `T`\]

***

### mapArrayToObject()

```ts
function mapArrayToObject<T, K, O>(array, mapper): Record<K, O>;
```

Defined in: [src/objUtils.ts:18](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L18)

#### Type Parameters

##### T

`T`

##### K

`K` *extends* `string`

##### O

`O`

#### Parameters

##### array

`T`[]

##### mapper

(`item`, `index`) => \[`K`, `O`\]

#### Returns

`Record`\<`K`, `O`\>

***

### mapObjectToObject()

```ts
function mapObjectToObject<I, K, O>(obj, mapper): Record<K, O>;
```

Defined in: [src/objUtils.ts:25](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L25)

#### Type Parameters

##### I

`I` *extends* `Record`\<`string` \| `number` \| `symbol`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

##### O

`O`

#### Parameters

##### obj

`I`

##### mapper

(`key`, `value`) => \[`K`, `O`\]

#### Returns

`Record`\<`K`, `O`\>

***

### ~~objectTypedEntries()~~

```ts
function objectTypedEntries<T>(obj): [Extract<keyof T, string>, T[keyof T]][];
```

Defined in: [src/objUtils.ts:2](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L2)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

\[`Extract`\<keyof `T`, `string`\>, `T`\[keyof `T`\]\][]

#### Deprecated

use typedObjectEntries from @ls-stack/utils/typingFnUtils instead

***

### omit()

```ts
function omit<T, K>(obj, keys): Omit<T, K>;
```

Defined in: [src/objUtils.ts:35](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L35)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### keys

`K`[]

#### Returns

`Omit`\<`T`, `K`\>

***

### pick()

```ts
function pick<T, K>(obj, keys): Pick<T, K>;
```

Defined in: [src/objUtils.ts:6](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L6)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`T`

##### keys

`K`[]

#### Returns

`Pick`\<`T`, `K`\>

***

### rejectObjUndefinedValues()

```ts
function rejectObjUndefinedValues<T>(obj): T;
```

Defined in: [src/objUtils.ts:57](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L57)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

`T`
