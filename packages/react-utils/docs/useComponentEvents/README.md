[**@ls-stack/react-utils**](../README.md)

***

[@ls-stack/react-utils](../modules.md) / useComponentEvents

# useComponentEvents

## Modules

- [\<internal\>](-internal-.md)

## Functions

### useComponentEvents()

```ts
function useComponentEvents<E>(emitter, callback): void;
```

Defined in: [packages/react-utils/src/useComponentEvents.ts:55](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useComponentEvents.ts#L55)

Subscribes to events from an emitter and calls appropriate callbacks when events are emitted.
Automatically handles cleanup when the component unmounts.

#### Type Parameters

##### E

`E` *extends* `Record`\<`string`, `unknown`\>

#### Parameters

##### emitter

The event emitter to listen to, typically from useSendComponentEvents

`undefined` | `Emitter`\<`E`\>

##### callback

\{ \[T in string \| number \| symbol\]: (payload: E\[T\]) =\> void \}

Object mapping event names to their callback functions

#### Returns

`void`

***

### useSendComponentEvents()

```ts
function useSendComponentEvents<E>(): object;
```

Defined in: [packages/react-utils/src/useComponentEvents.ts:33](https://github.com/lucasols/utils/blob/main/packages/react-utils/src/useComponentEvents.ts#L33)

Creates an event system for component communication. Returns an emitter for binding
and a type safe send function for emitting events.

#### Type Parameters

##### E

`E` *extends* `Record`\<`string`, `unknown`\>

#### Returns

`object`

##### bind

```ts
bind: Emitter<E>;
```

##### send

```ts
send: SendEvent<E>;
```

#### Example

```tsx
type Events = { userAction: { id: string }; error: string };
const { bind, send } = useSendComponentEvents<Events>();

// In child component
useComponentEvents(bind, {
  userAction: (payload) => console.log(payload.id),
  error: (message) => console.error(message)
});

// Emit events
send('userAction', { id: '123' });
send('error', 'Something went wrong');
```
