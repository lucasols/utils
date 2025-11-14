[@ls-stack/utils](modules.md) / mutationUtils

# mutationUtils

## Functions

### getArrayMethodsFromProduce()

```ts
function getArrayMethodsFromProduce<T>(produceFn, getItemId): object;
```

Defined in: [packages/utils/src/mutationUtils.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/mutationUtils.ts#L31)

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### produceFn

(`cb`) => `void` \| `T`[]

##### getItemId

(`item`) => `string`

#### Returns

`object`

##### add()

```ts
add: (item) => void | T[];
```

###### Parameters

###### item

`T`

###### Returns

`void` \| `T`[]

##### remove()

```ts
remove: (id) => void | T[];
```

###### Parameters

###### id

`string`

###### Returns

`void` \| `T`[]

##### update()

```ts
update: (id, updateItem) => void | T[];
```

###### Parameters

###### id

`string`

###### updateItem

`Partial`\<`T`\> | (`draftItem`) => `void` \| `T`

###### Returns

`void` \| `T`[]

***

### updateObject()

```ts
function updateObject<T>(object, updates): void;
```

Defined in: [packages/utils/src/mutationUtils.ts:11](https://github.com/lucasols/utils/blob/main/packages/utils/src/mutationUtils.ts#L11)

Updates an object with a new set of values. undefined values are ignored in
the updates object and deep equal values are not updated.

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### object

The object to update.

`undefined` | `null` | `T`

##### updates

`Partial`\<`T`\>

The new values to update the object with.

#### Returns

`void`
