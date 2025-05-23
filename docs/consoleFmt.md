[**@ls-stack/utils**](README.md)

***

[@ls-stack/utils](modules.md) / consoleFmt

# consoleFmt

## Variables

### consoleFmt

```ts
const consoleFmt: object;
```

Defined in: [src/consoleFmt.ts:56](https://github.com/lucasols/utils/blob/main/src/consoleFmt.ts#L56)

#### Type declaration

##### bgColor()

```ts
bgColor: (color, text) => string;
```

###### Parameters

###### color

`"green"` | `"red"` | `"blue"` | `"yellow"` | `"magenta"` | `"cyan"` | `"white"` | `"black"` | `"gray"` | `"brightRed"` | `"brightGreen"` | `"brightYellow"` | `"brightBlue"` | `"brightMagenta"` | `"brightCyan"` | `"brightWhite"`

###### text

`string`

###### Returns

`string`

##### bold()

```ts
bold: (text) => string;
```

###### Parameters

###### text

`string`

###### Returns

`string`

##### color()

```ts
color: (color, text) => string = consoleColors;
```

###### Parameters

###### color

`"green"` | `"red"` | `"blue"` | `"yellow"` | `"magenta"` | `"cyan"` | `"white"` | `"black"` | `"gray"` | `"brightRed"` | `"brightGreen"` | `"brightYellow"` | `"brightBlue"` | `"brightMagenta"` | `"brightCyan"` | `"brightWhite"`

###### text

`string`

###### Returns

`string`

##### underline()

```ts
underline: (text) => string;
```

###### Parameters

###### text

`string`

###### Returns

`string`
