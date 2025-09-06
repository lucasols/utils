[@ls-stack/utils](modules.md) / consoleFmt

# consoleFmt

## Variables

### ~~consoleFmt~~

```ts
const consoleFmt: object;
```

Defined in: [packages/utils/src/consoleFmt.ts:61](https://github.com/lucasols/utils/blob/main/packages/utils/src/consoleFmt.ts#L61)

#### Type declaration

##### ~~bgColor()~~

```ts
bgColor: (color, text) => string;
```

###### Parameters

###### color

`"red"` | `"green"` | `"yellow"` | `"blue"` | `"magenta"` | `"cyan"` | `"white"` | `"black"` | `"gray"` | `"brightRed"` | `"brightGreen"` | `"brightYellow"` | `"brightBlue"` | `"brightMagenta"` | `"brightCyan"` | `"brightWhite"`

###### text

`string`

###### Returns

`string`

###### Deprecated

Use `styleText` from `node:util` instead.

##### ~~bold()~~

```ts
bold: (text) => string;
```

###### Parameters

###### text

`string`

###### Returns

`string`

###### Deprecated

Use `styleText` from `node:util` instead.

##### ~~color()~~

```ts
color: (color, text) => string = consoleColors;
```

###### Parameters

###### color

`"red"` | `"green"` | `"yellow"` | `"blue"` | `"magenta"` | `"cyan"` | `"white"` | `"black"` | `"gray"` | `"brightRed"` | `"brightGreen"` | `"brightYellow"` | `"brightBlue"` | `"brightMagenta"` | `"brightCyan"` | `"brightWhite"`

###### text

`string`

###### Returns

`string`

###### Deprecated

Use `styleText` from `node:util` instead.

###### Deprecated

Use `styleText` from `node:util` instead.

##### ~~underline()~~

```ts
underline: (text) => string;
```

###### Parameters

###### text

`string`

###### Returns

`string`

###### Deprecated

Use `styleText` from `node:util` instead.

#### Deprecated

Use `styleText` from `node:util` instead.
