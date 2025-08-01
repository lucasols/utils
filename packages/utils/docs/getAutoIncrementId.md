[**@ls-stack/utils**](README.md)

---

[@ls-stack/utils](modules.md) / getAutoIncrementId

# getAutoIncrementId

## Functions

### getAutoIncrementId()

```ts
function getAutoIncrementId(): number;
```

Defined in: [packages/utils/src/getAutoIncrementId.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/getAutoIncrementId.ts#L19)

Returns a unique auto-incrementing number each time it's called.
This is useful for generating simple unique identifiers within a single session/process.

**Note:** This is not suitable for distributed systems or persistent storage.
For cryptographically secure or collision-resistant IDs, use `nanoid()` instead.

#### Returns

`number`

A unique incrementing number starting from 1

#### Example

```ts
const id1 = getAutoIncrementId(); // 1
const id2 = getAutoIncrementId(); // 2
const id3 = getAutoIncrementId(); // 3
```

---

### getLocalAutoIncrementIdGenerator()

```ts
function getLocalAutoIncrementIdGenerator(options): () => string;
```

Defined in: [packages/utils/src/getAutoIncrementId.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/getAutoIncrementId.ts#L44)

Creates a local auto-increment ID generator with optional prefix and suffix.
Each generator maintains its own independent counter starting from 1.
This is useful when you need multiple independent ID sequences or formatted IDs.

#### Parameters

##### options

Configuration object

###### prefix?

`string`

Optional prefix to prepend to each generated ID

###### suffix?

`string`

Optional suffix to append to each generated ID

#### Returns

A function that generates formatted auto-increment IDs

```ts
(): string;
```

##### Returns

`string`

#### Example

```ts
const userIdGen = getLocalAutoIncrementIdGenerator({ prefix: 'user-' });
const postIdGen = getLocalAutoIncrementIdGenerator({
  prefix: 'post-',
  suffix: '-draft',
});

console.log(userIdGen()); // "user-1"
console.log(userIdGen()); // "user-2"
console.log(postIdGen()); // "post-1-draft"
console.log(postIdGen()); // "post-2-draft"
```
