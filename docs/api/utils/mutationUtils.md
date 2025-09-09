[@ls-stack/utils](modules.md) / mutationUtils

# mutationUtils

## Functions

### updateObject()

```ts
function updateObject<T>(object, updates): void;
```

Defined in: [packages/utils/src/mutationUtils.ts:10](https://github.com/lucasols/utils/blob/main/packages/utils/src/mutationUtils.ts#L10)

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
