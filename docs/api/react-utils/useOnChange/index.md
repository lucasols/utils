[@ls-stack/react-utils](../modules.md) / useOnChange

# useOnChange

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useOnChange()

```ts
function useOnChange<T>(
   value, 
   callBack, 
   options): void;
```

Defined in: [packages/react-utils/src/useOnChange.ts:40](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L40)

A replacement for useEffect that doesn't need a dependency array.
Automatically triggers the callback when the value changes based on deep equality comparison.
By default, the callback is not called on mount (use `callOnMount` option to change this).

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

The value to watch for changes

##### callBack

(`values`) => `void` \| [`CleanupFn`](-internal-.md#cleanupfn)

Function called when value changes, receives prev and current values

##### options

[`OnChangeOptions`](-internal-.md#onchangeoptions) = `{}`

Configuration options

#### Returns

`void`

#### Example

```tsx
const [count, setCount] = useState(0);

useOnChange(count, ({ prev, current }) => {
  console.log(`Count changed from ${prev} to ${current}`);
});
```

***

### useOnChangeLayoutEffect()

```ts
function useOnChangeLayoutEffect<T>(
   value, 
   callBack, 
   options): void;
```

Defined in: [packages/react-utils/src/useOnChange.ts:63](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L63)

Layout effect version of useOnChange that runs synchronously before DOM updates.
Similar to useOnChange but uses useLayoutEffect instead of useEffect for timing-sensitive updates.

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

The value to watch for changes

##### callBack

(`values`) => `void` \| [`CleanupFn`](-internal-.md#cleanupfn)

Function called when value changes, receives prev and current values

##### options

`Omit`\<[`OnChangeOptions`](-internal-.md#onchangeoptions), `"layoutEffect"`\> = `{}`

Configuration options

#### Returns

`void`

***

### useOnChangeTo()

```ts
function useOnChangeTo<T, U>(
   value, 
   target, 
   callBack, 
   options): void;
```

Defined in: [packages/react-utils/src/useOnChange.ts:99](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L99)

Triggers callback only when value changes to a specific target value.
Useful for watching for specific state transitions or reaching particular values.

#### Type Parameters

##### T

`T`

##### U

`U`

#### Parameters

##### value

`T`

The value to watch for changes

##### target

`U`

The specific target value to watch for

##### callBack

(`values`) => `void` \| [`CleanupFn`](-internal-.md#cleanupfn)

Function called when value changes to target, receives prev and target values

##### options

[`OnChangeOptions`](-internal-.md#onchangeoptions) = `{}`

Configuration options

#### Returns

`void`

#### Example

```tsx
const [status, setStatus] = useState('idle');

useOnChangeTo(status, 'loading', ({ prev, target }) => {
  console.log(`Status changed from ${prev} to loading`);
});
```

***

### useOnChangeToLayoutEffect()

```ts
function useOnChangeToLayoutEffect<T, U>(
   value, 
   target, 
   callBack, 
   options): void;
```

Defined in: [packages/react-utils/src/useOnChange.ts:124](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useOnChange.ts#L124)

Layout effect version of useOnChangeTo that runs synchronously before DOM updates.
Combines specific target value watching with useLayoutEffect timing for synchronous execution.

#### Type Parameters

##### T

`T`

##### U

`U`

#### Parameters

##### value

`T`

The value to watch for changes

##### target

`U`

The specific target value to watch for

##### callBack

(`values`) => `void` \| [`CleanupFn`](-internal-.md#cleanupfn)

Function called when value changes to target, receives prev and target values

##### options

[`OnChangeOptions`](-internal-.md#onchangeoptions) = `{}`

Configuration options

#### Returns

`void`
