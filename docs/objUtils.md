[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / objUtils

# objUtils

## Functions

### looseGetObjectProperty()

```ts
function looseGetObjectProperty<T>(obj, key): undefined | T[keyof T];
```

Defined in: [src/objUtils.ts:55](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L55)

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

Defined in: [src/objUtils.ts:23](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L23)

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

Defined in: [src/objUtils.ts:30](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L30)

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

Defined in: [src/objUtils.ts:40](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L40)

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
function pick<T, K>(
   obj, 
   keys, 
rename?): Record<string, unknown>;
```

Defined in: [src/objUtils.ts:6](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L6)

#### Type Parameters

##### T

`T`

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### obj

`undefined` | `T`

##### keys

`K`[]

##### rename?

`Partial`\<`Record`\<`K`, `string`\>\>

#### Returns

`Record`\<`string`, `unknown`\>

***

### rejectObjUndefinedValues()

```ts
function rejectObjUndefinedValues<T>(obj): T;
```

Defined in: [src/objUtils.ts:62](https://github.com/lucasols/utils/blob/main/src/objUtils.ts#L62)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

`T`
