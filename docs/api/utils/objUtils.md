[@ls-stack/utils](modules.md) / objUtils

# objUtils

## Functions

### filterObjectKeys()

```ts
function filterObjectKeys<T>(obj, predicate): Partial<T>;
```

Defined in: [packages/utils/src/objUtils.ts:78](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L78)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

##### predicate

(`key`, `value`) => `boolean`

#### Returns

`Partial`\<`T`\>

***

### looseGetObjectProperty()

```ts
function looseGetObjectProperty<T>(obj, key): undefined | T[keyof T];
```

Defined in: [packages/utils/src/objUtils.ts:57](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L57)

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

Defined in: [packages/utils/src/objUtils.ts:25](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L25)

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

Defined in: [packages/utils/src/objUtils.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L32)

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

Defined in: [packages/utils/src/objUtils.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L9)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

\[`Extract`\<keyof `T`, `string`\>, `T`\[keyof `T`\]\][]

#### Deprecated

Use typedObjectEntries from @ls-stack/utils/typingFnUtils instead

***

### omit()

```ts
function omit<T, K>(obj, keys): Omit<T, K>;
```

Defined in: [packages/utils/src/objUtils.ts:42](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L42)

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

Defined in: [packages/utils/src/objUtils.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L13)

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
function rejectObjUndefinedValues<T>(obj): { [P in string | number | symbol]: (Partial<Pick<T, PickUndefinedKeys<T>>> & Pick<T, PickRequiredKeys<T>>)[P] };
```

Defined in: [packages/utils/src/objUtils.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L64)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

#### Returns

\{ \[P in string \| number \| symbol\]: (Partial\<Pick\<T, PickUndefinedKeys\<T\>\>\> & Pick\<T, PickRequiredKeys\<T\>\>)\[P\] \}

***

### sortObjectKeys()

```ts
function sortObjectKeys<T>(
   obj, 
   sortByFn, 
   options?): T;
```

Defined in: [packages/utils/src/objUtils.ts:89](https://github.com/lucasols/utils/blob/main/packages/utils/src/objUtils.ts#L89)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### obj

`T`

##### sortByFn

[`SortByValueFn`](arrayUtils/index.md#sortbyvaluefn)\<\[keyof `T`, `T`\[keyof `T`\]\]\>

##### options?

[`SortByProps`](arrayUtils/index.md#sortbyprops)

#### Returns

`T`
