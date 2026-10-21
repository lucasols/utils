[@ls-stack/react-utils](modules.md) / useArrayToMap

# useArrayToMap

## Functions

### useArrayToMap()

#### Call Signature

```ts
function useArrayToMap<T, K>(arr, key): Map<T[K], T>;
```

Defined in: [react-utils/src/useArrayToMap.ts:8](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useArrayToMap.ts#L8)

Memoized `Map` of the array items by a key or a getter. The map is recomputed
when the array or the key/getter changes, so pass a memoized getter.

##### Type Parameters

###### T

`T` *extends* `Record`\<`string`, `unknown`\>

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### arr

`T`[] | `null` | `undefined`

###### key

`K`

##### Returns

`Map`\<`T`\[`K`\], `T`\>

#### Call Signature

```ts
function useArrayToMap<T, K>(arr, getItemId): Map<K, T>;
```

Defined in: [react-utils/src/useArrayToMap.ts:12](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useArrayToMap.ts#L12)

Memoized `Map` of the array items by a key or a getter. The map is recomputed
when the array or the key/getter changes, so pass a memoized getter.

##### Type Parameters

###### T

`T`

###### K

`K` *extends* `string` \| `number`

##### Parameters

###### arr

`T`[] | `null` | `undefined`

###### getItemId

(`item`, `index`) => `K`

##### Returns

`Map`\<`K`, `T`\>
