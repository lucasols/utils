[@ls-stack/utils](modules.md) / hash

# hash

## Functions

### murmur2()

```ts
function murmur2(str): string;
```

Defined in: [packages/utils/src/hash.ts:8](https://github.com/lucasols/utils/blob/main/packages/utils/src/hash.ts#L8)

#### Parameters

##### str

`string`

The string to hash.

#### Returns

`string`

The hash of the string.

***

### murmur3()

Hashes a string with the MurmurHash3 x86 32-bit algorithm.

#### Param

The string to hash.

#### Param

The output format. Defaults to `'base36'`.

#### Call Signature

```ts
function murmur3(str): string;
```

Defined in: [packages/utils/src/hash.ts:75](https://github.com/lucasols/utils/blob/main/packages/utils/src/hash.ts#L75)

Hashes a string with the MurmurHash3 x86 32-bit algorithm and returns a
base-36 string.

##### Parameters

###### str

`string`

The string to hash.

##### Returns

`string`

The hash of the string.

##### Param

The string to hash.

##### Param

The output format. Defaults to `'base36'`.

#### Call Signature

```ts
function murmur3(str, output): string;
```

Defined in: [packages/utils/src/hash.ts:84](https://github.com/lucasols/utils/blob/main/packages/utils/src/hash.ts#L84)

Hashes a string with the MurmurHash3 x86 32-bit algorithm and returns a
base-36 string.

##### Parameters

###### str

`string`

The string to hash.

###### output

`"base36"`

The output format.

##### Returns

`string`

The hash of the string.

##### Param

The string to hash.

##### Param

The output format. Defaults to `'base36'`.

#### Call Signature

```ts
function murmur3(str, output): number;
```

Defined in: [packages/utils/src/hash.ts:93](https://github.com/lucasols/utils/blob/main/packages/utils/src/hash.ts#L93)

Hashes a string with the MurmurHash3 x86 32-bit algorithm and returns an
unsigned 32-bit integer.

##### Parameters

###### str

`string`

The string to hash.

###### output

`"uint32"`

The output format.

##### Returns

`number`

The hash of the string.

##### Param

The string to hash.

##### Param

The output format. Defaults to `'base36'`.
