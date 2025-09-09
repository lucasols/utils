[@ls-stack/utils](../modules.md) / [typeUtils](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### BuildArrayPath\<BasePath\>

```ts
type BuildArrayPath<BasePath> = BasePath extends "$" ? "[*]" : `${BasePath}[*]`;
```

Defined in: [packages/utils/src/typeUtils.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L66)

#### Type Parameters

##### BasePath

`BasePath` *extends* `string`

***

### BuildPath\<BasePath, Key\>

```ts
type BuildPath<BasePath, Key> = BasePath extends "$" ? Key extends string | number ? `${Key}` : never : Key extends string | number ? `${BasePath}.${Key}` : never;
```

Defined in: [packages/utils/src/typeUtils.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L58)

#### Type Parameters

##### BasePath

`BasePath` *extends* `string`

##### Key

`Key` *extends* `PropertyKey`

***

### DeepReplaceValueImpl\<T, ReplaceType, NewType, SkipPaths, SkipType, Path\>

```ts
type DeepReplaceValueImpl<T, ReplaceType, NewType, SkipPaths, SkipType, Path> = SkipPaths extends string ? PathMatches<Path, SkipPaths> extends true ? T : T extends ReplaceType ? T extends SkipType ? T : NewType : T extends readonly infer U[] ? DeepReplaceValueImpl<U, ReplaceType, NewType, SkipPaths, SkipType, BuildArrayPath<Path>>[] : T extends SkipType ? T : T extends Record<string, any> ? { [K in keyof T]: DeepReplaceValueImpl<T[K], ReplaceType, NewType, SkipPaths, SkipType, BuildPath<Path, K>> } : T : T extends ReplaceType ? T extends SkipType ? T : NewType : T extends readonly infer U[] ? DeepReplaceValueImpl<U, ReplaceType, NewType, SkipPaths, SkipType, BuildArrayPath<Path>>[] : T extends SkipType ? T : T extends Record<string, any> ? { [K in keyof T]: DeepReplaceValueImpl<T[K], ReplaceType, NewType, SkipPaths, SkipType, BuildPath<Path, K>> } : T;
```

Defined in: [packages/utils/src/typeUtils.ts:69](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L69)

#### Type Parameters

##### T

`T`

##### ReplaceType

`ReplaceType`

##### NewType

`NewType`

##### SkipPaths

`SkipPaths` *extends* `string` \| `undefined`

##### SkipType

`SkipType`

##### Path

`Path` *extends* `string` = `"$"`

***

### PathMatches\<CurrentPath, SkipPaths\>

```ts
type PathMatches<CurrentPath, SkipPaths> = true extends SkipPaths extends any ? CurrentPath extends SkipPaths ? true : SkipPaths extends `${infer Prefix}[*]${infer Suffix}` ? CurrentPath extends `${Prefix}[${string}]${Suffix}` ? true : false : false : false ? true : false;
```

Defined in: [packages/utils/src/typeUtils.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L44)

#### Type Parameters

##### CurrentPath

`CurrentPath` *extends* `string`

##### SkipPaths

`SkipPaths` *extends* `string`

***

### PickRequiredKeys\<T\>

```ts
type PickRequiredKeys<T> = { [K in keyof T]: undefined extends T[K] ? never : K }[keyof T];
```

Defined in: [packages/utils/src/typeUtils.ts:173](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L173)

#### Type Parameters

##### T

`T`

***

### PickUndefinedKeys\<T\>

```ts
type PickUndefinedKeys<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];
```

Defined in: [packages/utils/src/typeUtils.ts:169](https://github.com/lucasols/utils/blob/main/packages/utils/src/typeUtils.ts#L169)

#### Type Parameters

##### T

`T`
