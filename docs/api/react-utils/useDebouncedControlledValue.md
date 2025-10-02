[@ls-stack/react-utils](modules.md) / useDebouncedControlledValue

# useDebouncedControlledValue

## Functions

### useDebouncedControlledValue()

```ts
function useDebouncedControlledValue<T>(options): object;
```

Defined in: [packages/react-utils/src/useDebouncedControlledValue.ts:53](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useDebouncedControlledValue.ts#L53)

Hook that manages a controlled value with debounced updates and bidirectional
synchronization.

This hook is useful for controlled inputs where you want to debounce user
input before updating the parent state, while also syncing the internal value
when the controlled value changes externally. It prevents race conditions by
ignoring controlled value changes that originated from debounced updates.

#### Type Parameters

##### T

`T`

#### Parameters

##### options

Configuration options

###### checkIfEmpty?

(`value`) => `boolean` = `...`

Function to determine if value is empty
  (default: `!value`)

###### controlledValue

`T`

The controlled value from parent state

###### debounce

`number`

Debounce delay in milliseconds

###### onUnMount?

`"flush"` \| `"cancel"` = `'flush'`

Whether to flush or cancel pending debounced
  updates on unmount (default: 'flush')

###### readonly

`boolean`

Whether the input is in readonly mode - prevents
  updates to controlled value

###### setControlledValue

(`value`) => `void`

Callback to update the parent controlled
  value

###### setInputValueExtraDeps?

`any`[]

Deps used for derive the input value from the controlledValue

###### setInternalValue

(`value`) => `void`

Callback to update the internal input value

#### Returns

`object`

Object with defaultValue, isEmpty, onChange, isTouched ref, and
  flushDebounce function

##### defaultValue

```ts
defaultValue: T = initialValue;
```

##### flushDebounce()

```ts
flushDebounce: () => undefined | void = debouncedHandleChange.flush;
```

###### Returns

`undefined` \| `void`

##### isEmpty

```ts
isEmpty: boolean;
```

##### isTouched

```ts
isTouched: RefObject<boolean>;
```

##### onChange()

```ts
onChange: (value) => void;
```

###### Parameters

###### value

`T`

###### Returns

`void`

#### Example

```tsx
  function SearchInput({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
    const [internalQuery, setInternalQuery] = useState(query);
    const { defaultValue, onChange, isEmpty } = useDebouncedControlledValue({
      controlledValue: query,
      setControlledValue: onQueryChange,
      setInternalValue: setInternalQuery,
      debounce: 300,
      readonly: false,
    });

    return <input defaultValue={defaultValue} onChange={(e) => onChange(e.target.value)} />;
  }
  ```;
