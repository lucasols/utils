[@ls-stack/react-utils](modules.md) / useTimeout

# useTimeout

## Functions

### useTimeout()

```ts
function useTimeout(ms, noClearOnUnmount): object;
```

Defined in: [packages/react-utils/src/useTimeout.ts:28](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useTimeout.ts#L28)

Hook that manages multiple timeouts with a stable API.

Automatically clears all pending timeouts on unmount unless `noClearOnUnmount` is true.

#### Parameters

##### ms

`number`

Default timeout duration in milliseconds

##### noClearOnUnmount

`boolean` = `false`

If true, timeouts will not be cleared on unmount (default: false)

#### Returns

`object`

Object with `call`, `clearAndCall`, and `clear` methods

##### call()

```ts
call: (cb, overrideMs?) => void;
```

###### Parameters

###### cb

() => `void`

###### overrideMs?

`number`

###### Returns

`void`

##### clear()

```ts
clear: () => void;
```

###### Returns

`void`

##### clearAndCall()

```ts
clearAndCall: (cb, overrideMs?) => void;
```

###### Parameters

###### cb

() => `void`

###### overrideMs?

`number`

###### Returns

`void`

#### Example

```tsx
function Toast({ message }: { message: string }) {
  const [show, setShow] = useState(true);
  const timeout = useTimeout(3000);

  useEffect(() => {
    timeout.call(() => setShow(false));
  }, [timeout]);

  return show ? <div>{message}</div> : null;
}
```
