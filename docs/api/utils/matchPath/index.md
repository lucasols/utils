[@ls-stack/utils](../modules.md) / matchPath

# matchPath

## Modules

- [\<internal\>](-internal-.md)

## Interfaces

### PathMatch\<ParamKey\>

Defined in: [packages/utils/src/matchPath.ts:62](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L62)

A PathMatch contains info about how a PathPattern matched on a URL pathname.

#### Type Parameters

##### ParamKey

`ParamKey` *extends* `string` = `string`

#### Properties

##### glob

```ts
glob: null | PathMatchGlob;
```

Defined in: [packages/utils/src/matchPath.ts:72](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L72)

##### params

```ts
params: Params<ParamKey>;
```

Defined in: [packages/utils/src/matchPath.ts:64](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L64)

The names and values of dynamic parameters in the URL.

##### pathname

```ts
pathname: string;
```

Defined in: [packages/utils/src/matchPath.ts:66](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L66)

The portion of the URL pathname that was matched.

##### pathnameBase

```ts
pathnameBase: string;
```

Defined in: [packages/utils/src/matchPath.ts:68](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L68)

The portion of the URL pathname that was matched before child routes.

##### pattern

```ts
pattern: PathPattern;
```

Defined in: [packages/utils/src/matchPath.ts:70](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L70)

The pattern that was used to match.

***

### PathPattern\<Path\>

Defined in: [packages/utils/src/matchPath.ts:33](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L33)

A PathPattern is used to match on some portion of a URL pathname.

#### Type Parameters

##### Path

`Path` *extends* `string` = `string`

#### Properties

##### caseSensitive?

```ts
optional caseSensitive: boolean;
```

Defined in: [packages/utils/src/matchPath.ts:44](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L44)

Should be `true` if the static portions of the `path` should be matched in
the same case.

##### end?

```ts
optional end: boolean;
```

Defined in: [packages/utils/src/matchPath.ts:46](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L46)

Should be `true` if this pattern should match the entire URL pathname.

##### path

```ts
path: Path;
```

Defined in: [packages/utils/src/matchPath.ts:39](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L39)

A string to match against a URL pathname. May contain `:id`-style segments
to indicate placeholders for dynamic parameters. May also end with `/*` to
indicate matching the rest of the URL pathname.

## Type Aliases

### ParamParseKey\<Segment\>

```ts
type ParamParseKey<Segment> = [PathParam<Segment>] extends [never] ? string : PathParam<Segment>;
```

Defined in: [packages/utils/src/matchPath.ts:28](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L28)

#### Type Parameters

##### Segment

`Segment` *extends* `string`

***

### Params\<Key\>

```ts
type Params<Key> = { readonly [key in Key]: string | undefined };
```

Defined in: [packages/utils/src/matchPath.ts:50](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L50)

The parameters that were parsed from the URL path.

#### Type Parameters

##### Key

`Key` *extends* `string` = `string`

***

### PathMatchGlob

```ts
type PathMatchGlob = object;
```

Defined in: [packages/utils/src/matchPath.ts:54](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L54)

#### Properties

##### matchPath()

```ts
matchPath: <K, Path>(pattern) => PathMatch<K> | null;
```

Defined in: [packages/utils/src/matchPath.ts:55](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L55)

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

Defined in: [packages/utils/src/matchPath.ts:58](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L58)

***

### PathParam\<Path\>

```ts
type PathParam<Path> = Path extends "*" | "/*" ? "*" : Path extends `${infer Rest}/*` ? "*" | _PathParam<Rest> : _PathParam<Path>;
```

Defined in: [packages/utils/src/matchPath.ts:17](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L17)

#### Type Parameters

##### Path

`Path` *extends* `string`

## Functions

### matchPath()

```ts
function matchPath<ParamKey, Path>(pattern, pathname): null | PathMatch<ParamKey>;
```

Defined in: [packages/utils/src/matchPath.ts:83](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L83)

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

`null` \| [`PathMatch`](#pathmatch)\<`ParamKey`\>

#### See

https://reactrouter.com/utils/match-path

***

### matchPathWith()

```ts
function matchPathWith(path): object;
```

Defined in: [packages/utils/src/matchPath.ts:219](https://github.com/lucasols/utils/blob/main/packages/utils/src/matchPath.ts#L219)

#### Parameters

##### path

`undefined` | `null` | `string`

#### Returns

`object`

##### patterns()

```ts
patterns: <R>(patterns) => null | R;
```

###### Type Parameters

###### R

`R`

###### Parameters

###### patterns

`Record`\<`string`, (`match`) => `R`\>

###### Returns

`null` \| `R`
