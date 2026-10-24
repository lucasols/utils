[@ls-stack/utils](../modules.md) / matchPath

# matchPath

## Modules

- [\<internal\>](-internal-.md)

## Interfaces

### PathMatch\<ParamKey\>

Defined in: [packages/utils/src/matchPath.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L66)

A PathMatch contains info about how a PathPattern matched on a URL pathname.

#### Type Parameters

##### ParamKey

`ParamKey` *extends* `string` = `string`

#### Properties

##### glob

```ts
glob: PathMatchGlob | null;
```

Defined in: [packages/utils/src/matchPath.ts:76](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L76)

##### params

```ts
params: Params<ParamKey>;
```

Defined in: [packages/utils/src/matchPath.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L68)

The names and values of dynamic parameters in the URL.

##### pathname

```ts
pathname: string;
```

Defined in: [packages/utils/src/matchPath.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L70)

The portion of the URL pathname that was matched.

##### pathnameBase

```ts
pathnameBase: string;
```

Defined in: [packages/utils/src/matchPath.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L72)

The portion of the URL pathname that was matched before child routes.

##### pattern

```ts
pattern: PathPattern;
```

Defined in: [packages/utils/src/matchPath.ts:74](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L74)

The pattern that was used to match.

***

### PathPattern\<Path\>

Defined in: [packages/utils/src/matchPath.ts:37](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L37)

A PathPattern is used to match on some portion of a URL pathname.

#### Type Parameters

##### Path

`Path` *extends* `string` = `string`

#### Properties

##### caseSensitive?

```ts
optional caseSensitive: boolean;
```

Defined in: [packages/utils/src/matchPath.ts:48](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L48)

Should be `true` if the static portions of the `path` should be matched in
the same case.

##### end?

```ts
optional end: boolean;
```

Defined in: [packages/utils/src/matchPath.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L50)

Should be `true` if this pattern should match the entire URL pathname.

##### path

```ts
path: Path;
```

Defined in: [packages/utils/src/matchPath.ts:43](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L43)

A string to match against a URL pathname. May contain `:id`-style segments
to indicate placeholders for dynamic parameters. May also end with `/*` to
indicate matching the rest of the URL pathname.

## Type Aliases

### ParamParseKey\<Segment\>

```ts
type ParamParseKey<Segment> = [PathParam<Segment>] extends [never] ? string : PathParam<Segment>;
```

Defined in: [packages/utils/src/matchPath.ts:32](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L32)

#### Type Parameters

##### Segment

`Segment` *extends* `string`

***

### Params\<Key\>

```ts
type Params<Key> = { readonly [key in Key]: string | undefined };
```

Defined in: [packages/utils/src/matchPath.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L54)

The parameters that were parsed from the URL path.

#### Type Parameters

##### Key

`Key` *extends* `string` = `string`

***

### PathMatchGlob

```ts
type PathMatchGlob = object;
```

Defined in: [packages/utils/src/matchPath.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L58)

#### Properties

##### matchPath()

```ts
matchPath: <K, Path>(pattern) => PathMatch<K> | null;
```

Defined in: [packages/utils/src/matchPath.ts:59](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L59)

###### Type Parameters

###### K

`K` *extends* [`ParamParseKey`](#paramparsekey)\<`Path`\>

###### Path

`Path` *extends* `string`

###### Parameters

###### pattern

[`PathPattern`](#pathpattern)\<`Path`\> | `Path`

###### Returns

[`PathMatch`](#pathmatch)\<`K`\> \| `null`

##### path

```ts
path: string;
```

Defined in: [packages/utils/src/matchPath.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L62)

***

### PathParam\<Path\>

```ts
type PathParam<Path> = Path extends "*" | "/*" ? "*" : Path extends `${infer Rest}/*` ? "*" | _PathParam<Rest> : _PathParam<Path>;
```

Defined in: [packages/utils/src/matchPath.ts:19](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L19)

#### Type Parameters

##### Path

`Path` *extends* `string`

## Functions

### matchPath()

```ts
function matchPath<ParamKey, Path>(pattern, pathname): PathMatch<ParamKey> | null;
```

Defined in: [packages/utils/src/matchPath.ts:87](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L87)

Performs pattern matching on a URL pathname and returns information about the
match.

#### Type Parameters

##### ParamKey

`ParamKey` *extends* `string`

##### Path

`Path` *extends* `string`

#### Parameters

##### pattern

`Path` | [`PathPattern`](#pathpattern)\<`Path`\>

##### pathname

`string`

#### Returns

[`PathMatch`](#pathmatch)\<`ParamKey`\> \| `null`

#### See

https://reactrouter.com/utils/match-path

***

### matchPathWith()

```ts
function matchPathWith(path): object;
```

Defined in: [packages/utils/src/matchPath.ts:223](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L223)

#### Parameters

##### path

`string` | `null` | `undefined`

#### Returns

`object`

##### patterns()

```ts
patterns: <R>(patterns) => R | null;
```

###### Type Parameters

###### R

`R`

###### Parameters

###### patterns

`Record`\<`string`, (`match`) => `R`\>

###### Returns

`R` \| `null`
