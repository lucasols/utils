[@ls-stack/react-utils](../modules.md) / [useDebouncedCallback](index.md) / \<internal\>

# \<internal\>

## Interfaces

### DebouncedFunc()\<T\>

Defined in: packages/utils/dist/debounce.d.cts:9

#### Type Parameters

##### T

`T` *extends* (...`args`) => `void`

```ts
DebouncedFunc(...args): undefined | ReturnType<T>;
```

Defined in: packages/utils/dist/debounce.d.cts:19

Call the original function, but applying the debounce rules.

If the debounced function can be run immediately, this calls it and returns
its return value.

Otherwise, it returns the return value of the last invocation, or undefined
if the debounced function was not invoked yet.

#### Parameters

##### args

...`Parameters`\<`T`\>

#### Returns

`undefined` \| `ReturnType`\<`T`\>

#### Properties

##### cancel()

```ts
cancel: () => void;
```

Defined in: packages/utils/dist/debounce.d.cts:21

Throw away any pending invocation of the debounced function.

###### Returns

`void`

##### flush()

```ts
flush: () => undefined | ReturnType<T>;
```

Defined in: packages/utils/dist/debounce.d.cts:29

If there is a pending invocation of the debounced function, invoke it
immediately and return its return value.

Otherwise, return the value from the last invocation, or undefined if the
debounced function was never invoked.

###### Returns

`undefined` \| `ReturnType`\<`T`\>

##### pending()

```ts
pending: () => boolean;
```

Defined in: packages/utils/dist/debounce.d.cts:31

Return true if the debounced function still has a scheduled run.

###### Returns

`boolean`

##### updateCb()

```ts
updateCb: (callback) => void;
```

Defined in: packages/utils/dist/debounce.d.cts:33

Update the debounced function with a new callback.

###### Parameters

###### callback

`T`

###### Returns

`void`

##### updateParams()

```ts
updateParams: (wait, options?) => void;
```

Defined in: packages/utils/dist/debounce.d.cts:35

Update the debounce wait and options while keeping scheduled runs.

###### Parameters

###### wait

`number`

###### options?

[`DebounceOptions`](#debounceoptions)

###### Returns

`void`

## Type Aliases

### DebounceOptions

```ts
type DebounceOptions = object;
```

Defined in: packages/utils/dist/debounce.d.cts:1

#### Properties

##### leading?

```ts
optional leading: boolean;
```

Defined in: packages/utils/dist/debounce.d.cts:3

###### See

_.leading

##### maxWait?

```ts
optional maxWait: number;
```

Defined in: packages/utils/dist/debounce.d.cts:5

###### See

_.maxWait

##### trailing?

```ts
optional trailing: boolean;
```

Defined in: packages/utils/dist/debounce.d.cts:7

###### See

_.trailing
