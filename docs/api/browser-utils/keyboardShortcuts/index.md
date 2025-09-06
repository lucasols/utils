[@ls-stack/browser-utils](../modules.md) / keyboardShortcuts

# keyboardShortcuts

## Modules

- [\<internal\>](-internal-.md)

## Interfaces

### KeyBindingHandlerOptions

Defined in: [keyboardShortcuts.ts:15](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L15)

#### Extended by

- [`KeyBindingOptions`](#keybindingoptions)

#### Properties

##### timeout?

```ts
optional timeout: number;
```

Defined in: [keyboardShortcuts.ts:23](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L23)

Keybinding sequences will wait this long between key presses before
cancelling (default: 1000).

**Note:** Setting this value too low (i.e. `300`) will be too fast for many
of your users.

***

### KeyBindingMap

Defined in: [keyboardShortcuts.ts:11](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L11)

A map of keybinding strings to event handlers.

#### Indexable

```ts
[keybinding: string]: (event) => void
```

***

### KeyBindingOptions

Defined in: [keyboardShortcuts.ts:29](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L29)

Options to configure the behavior of keybindings.

#### Extends

- [`KeyBindingHandlerOptions`](#keybindinghandleroptions)

#### Properties

##### capture?

```ts
optional capture: boolean;
```

Defined in: [keyboardShortcuts.ts:38](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L38)

Key presses will use a capture listener (default: false)

##### event?

```ts
optional event: "keydown" | "keyup";
```

Defined in: [keyboardShortcuts.ts:33](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L33)

Key presses will listen to this event (default: "keydown").

##### timeout?

```ts
optional timeout: number;
```

Defined in: [keyboardShortcuts.ts:23](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L23)

Keybinding sequences will wait this long between key presses before
cancelling (default: 1000).

**Note:** Setting this value too low (i.e. `300`) will be too fast for many
of your users.

###### Inherited from

[`KeyBindingHandlerOptions`](#keybindinghandleroptions).[`timeout`](#timeout)

## Type Aliases

### KeyBindingPress

```ts
type KeyBindingPress = [string[], string | RegExp];
```

Defined in: [keyboardShortcuts.ts:6](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L6)

A single press of a keybinding sequence

## Functions

### createKeybindingsHandler()

```ts
function createKeybindingsHandler(keyBindingMap, options): EventListener;
```

Defined in: [keyboardShortcuts.ts:175](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L175)

Creates an event listener for handling keybindings.

#### Parameters

##### keyBindingMap

[`KeyBindingMap`](#keybindingmap)

##### options

[`KeyBindingHandlerOptions`](#keybindinghandleroptions) = `{}`

#### Returns

`EventListener`

#### Example

```js
import { createKeybindingsHandler } from "../src/keybindings"

let handler = createKeybindingsHandler({
	"Shift+d": () => {
		alert("The 'Shift' and 'd' keys were pressed at the same time")
	},
	"y e e t": () => {
		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
	},
	"$mod+d": () => {
		alert("Either 'Control+d' or 'Meta+d' were pressed")
	},
})

window.addEvenListener("keydown", handler)
```

***

### ignoreInputTypingEvents()

```ts
function ignoreInputTypingEvents(callback): (e) => void;
```

Defined in: [keyboardShortcuts.ts:265](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L265)

#### Parameters

##### callback

[`Callback`](-internal-.md#callback) | \{
`current`: [`Callback`](-internal-.md#callback);
\}

#### Returns

```ts
(e): void;
```

##### Parameters

###### e

`KeyboardEvent`

##### Returns

`void`

***

### ignoreRichTextInputTypingEvents()

```ts
function ignoreRichTextInputTypingEvents(callback): (e) => void;
```

Defined in: [keyboardShortcuts.ts:284](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L284)

#### Parameters

##### callback

[`Callback`](-internal-.md#callback) | \{
`current`: [`Callback`](-internal-.md#callback);
\}

#### Returns

```ts
(e): void;
```

##### Parameters

###### e

`KeyboardEvent`

##### Returns

`void`

***

### keyboardShortcuts()

```ts
function keyboardShortcuts(
   target, 
   keyBindingMap, 
   __namedParameters): () => void;
```

Defined in: [keyboardShortcuts.ts:251](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L251)

Subscribes to keybindings.

Returns an unsubscribe method.

#### Parameters

##### target

`Window` | `HTMLElement`

##### keyBindingMap

[`KeyBindingMap`](#keybindingmap)

##### \_\_namedParameters

[`KeyBindingOptions`](#keybindingoptions) = `{}`

#### Returns

```ts
(): void;
```

##### Returns

`void`

#### Example

```js
import { keyboardShortcuts } from "@ls-stack/browser-utils/keyboardShortcuts"

tinykeys(window, {
	"Shift+d": () => {
		alert("The 'Shift' and 'd' keys were pressed at the same time")
	},
	"y e e t": () => {
		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
	},
	"$mod+d": () => {
		alert("Either 'Control+d' or 'Meta+d' were pressed")
	},
})
```

***

### matchKeyBindingPress()

```ts
function matchKeyBindingPress(event, __namedParameters): boolean;
```

Defined in: [keyboardShortcuts.ts:124](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L124)

This tells us if a single keyboard event matches a single keybinding press.

#### Parameters

##### event

`KeyboardEvent`

##### \_\_namedParameters

[`KeyBindingPress`](#keybindingpress)

#### Returns

`boolean`

***

### parseKeybinding()

```ts
function parseKeybinding(str): KeyBindingPress[];
```

Defined in: [keyboardShortcuts.ts:105](https://github.com/lucasols/utils/blob/main/packages/browser-utils/src/keyboardShortcuts.ts#L105)

Parses a "Key Binding String" into its parts

grammar    = `<sequence>`
<sequence> = `<press> <press> <press> ...`
<press>    = `<key>` or `<mods>+<key>`
<mods>     = `<mod>+<mod>+...`
<key>      = `<KeyboardEvent.key>` or `<KeyboardEvent.code>` (case-insensitive)
<key>      = `(<regex>)` -> `/^<regex>$/` (case-sensitive)

#### Parameters

##### str

`string`

#### Returns

[`KeyBindingPress`](#keybindingpress)[]
