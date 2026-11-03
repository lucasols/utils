[@ls-stack/node-utils](../modules.md) / runShellCmd

# runShellCmd

## Modules

- [\<internal\>](-internal-.md)

## Type Aliases

### Command

```ts
type Command = string | (string | null)[];
```

Defined in: [runShellCmd.ts:18](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L18)

A command to run. Strings are split on spaces. In arrays, `null` items are
dropped and items starting with `$` are split on spaces (with the `$`
removed), e.g. `['$git log -1', '--format=%s', ref]`.

## Functions

### concurrentCmd()

```ts
function concurrentCmd(
   label, 
   cmd, 
onResult): Promise<() => void>;
```

Defined in: [runShellCmd.ts:191](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L191)

Runs a command concurrently with logging and error handling.

#### Parameters

##### label

`string`

Label for the command

##### cmd

[`Command`](#command)

The command to run

##### onResult

(`result`) => `void`

Callback function to handle the result

#### Returns

`Promise`\<() => `void`\>

Function to display errors if any occurred

***

### runCmd()

```ts
function runCmd(
   label, 
   command, 
options): Promise<CmdResult>;
```

Defined in: [runShellCmd.ts:81](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L81)

Runs a shell command and returns the result.

#### Parameters

##### label

Optional label for the command (used for logging)

`string` | `null`

##### command

[`Command`](#command)

The command to run, see [Command](#command)

##### options

[`RunCmdOptions`](-internal-.md#runcmdoptions) = `{}`

Configuration options

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

Promise that resolves to the command result

***

### runCmdSilent()

```ts
function runCmdSilent(command): Promise<CmdResult>;
```

Defined in: [runShellCmd.ts:244](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L244)

Runs a command silently without any output.

#### Parameters

##### command

[`Command`](#command)

The command to run

#### Returns

`Promise`\<[`CmdResult`](-internal-.md#cmdresult)\>

Promise that resolves to the command result

***

### runCmdSilentUnwrap()

```ts
function runCmdSilentUnwrap(command): Promise<string>;
```

Defined in: [runShellCmd.ts:254](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L254)

Runs a command silently and returns only the stdout.

#### Parameters

##### command

[`Command`](#command)

The command to run

#### Returns

`Promise`\<`string`\>

Promise that resolves to the stdout string

***

### runCmdUnwrap()

```ts
function runCmdUnwrap(
   label, 
   command, 
options): Promise<string>;
```

Defined in: [runShellCmd.ts:229](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L229)

Runs a command and returns only the stdout, rejecting with an `Error` whose
message is the stderr if the command fails.

#### Parameters

##### label

Optional label for the command

`string` | `null`

##### command

[`Command`](#command)

The command to run

##### options

`Omit`\<[`RunCmdOptions`](-internal-.md#runcmdoptions), `"mock"` \| `"throwOnError"`\> = `{}`

Same options as [runCmd](#runcmd), except `mock` and
  `throwOnError`

#### Returns

`Promise`\<`string`\>

Promise that resolves to the stdout string
