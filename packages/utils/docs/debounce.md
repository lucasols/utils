[**@ls-stack/utils**](README.md)

---

[@ls-stack/utils](modules.md) / debounce

# debounce

## Interfaces

### DebouncedFunc()\<T\>

Defined in: [packages/utils/src/debounce.ts:16](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L16)

#### Type Parameters

##### T

`T` _extends_ (...`args`) => `void`

```ts
DebouncedFunc(...args): undefined | ReturnType<T>;
```

Defined in: [packages/utils/src/debounce.ts:26](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L26)

Call the original function, but applying the debounce rules.

If the debounced function can be run immediately, this calls it and returns its return
value.

Otherwise, it returns the return value of the last invocation, or undefined if the debounced
function was not invoked yet.

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

Defined in: [packages/utils/src/debounce.ts:31](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L31)

Throw away any pending invocation of the debounced function.

###### Returns

`void`

##### flush()

```ts
flush: () => undefined | ReturnType<T>;
```

Defined in: [packages/utils/src/debounce.ts:40](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L40)

If there is a pending invocation of the debounced function, invoke it immediately and return
its return value.

Otherwise, return the value from the last invocation, or undefined if the debounced function
was never invoked.

###### Returns

`undefined` \| `ReturnType`\<`T`\>

## Type Aliases

### DebounceOptions

```ts
type DebounceOptions = object;
```

Defined in: [packages/utils/src/debounce.ts:1](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L1)

#### Properties

##### leading?

```ts
optional leading: boolean;
```

Defined in: [packages/utils/src/debounce.ts:5](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L5)

###### See

\_.leading

##### maxWait?

```ts
optional maxWait: number;
```

Defined in: [packages/utils/src/debounce.ts:9](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L9)

###### See

\_.maxWait

##### trailing?

```ts
optional trailing: boolean;
```

Defined in: [packages/utils/src/debounce.ts:13](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L13)

###### See

\_.trailing

## Functions

### debounce()

```ts
function debounce<T>(func, wait, options?): DebouncedFunc<T>;
```

Defined in: [packages/utils/src/debounce.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L44)

#### Type Parameters

##### T

`T` _extends_ (...`args`) => `void`

#### Parameters

##### func

`T`

##### wait

`number`

##### options?

[`DebounceOptions`](#debounceoptions)

#### Returns

[`DebouncedFunc`](#debouncedfunc)\<`T`\>

---

### isDebouncedFn()

```ts
function isDebouncedFn<T>(
  fn,
): fn is T & { cancel: () => void; flush: () => undefined | ReturnType<T> };
```

Defined in: [packages/utils/src/debounce.ts:176](https://github.com/lucasols/utils/blob/main/packages/utils/src/debounce.ts#L176)

#### Type Parameters

##### T

`T` _extends_ (...`args`) => `void`

#### Parameters

##### fn

`T`

#### Returns

fn is T & \{ cancel: () =\> void; flush: () =\> undefined \| ReturnType\<T\> \}
