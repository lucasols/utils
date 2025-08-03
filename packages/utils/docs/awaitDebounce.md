[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / awaitDebounce

# awaitDebounce

## Functions

### awaitDebounce()

```ts
function awaitDebounce(options): Promise<"skip" | "continue">;
```

Defined in: [packages/utils/src/awaitDebounce.ts:41](https://github.com/lucasols/utils/blob/main/packages/utils/src/awaitDebounce.ts#L41)

Creates an awaitable debounce mechanism that allows you to debounce async operations.
When called multiple times with the same `callId`, only the last call will resolve with 'continue',
while all previous calls resolve with 'skip'.

This is useful for debouncing API calls, search operations, or any async work where you want
to ensure only the most recent request is processed.

#### Parameters

##### options

Configuration object

###### callId

`any`

Unique identifier for the debounce group. Calls with the same ID are debounced together

###### debounce

`number`

Debounce delay in milliseconds

#### Returns

`Promise`\<`"skip"` \| `"continue"`\>

Promise that resolves to 'continue' if this call should proceed, or 'skip' if it was superseded

#### Example

```ts
async function searchUsers(query: string) {
  const result = await awaitDebounce({ callId: 'search', debounce: 300 });
  if (result === 'skip') return; // This search was superseded

  // Only the most recent search will reach here
  const users = await fetchUsers(query);
  updateUI(users);
}

// Called rapidly - only the last call will execute
searchUsers('a');
searchUsers('ab');
searchUsers('abc'); // Only this one will continue
```
