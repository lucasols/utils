[@ls-stack/node-utils](../modules.md) / [runShellCmd](index.md) / \<internal\>

# \<internal\>

## Type Aliases

### CmdResult

```ts
type CmdResult = object;
```

Defined in: [runShellCmd.ts:5](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L5)

#### Properties

##### error

```ts
error: boolean;
```

Defined in: [runShellCmd.ts:8](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L8)

##### label

```ts
label: string | null;
```

Defined in: [runShellCmd.ts:6](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L6)

##### out

```ts
out: string;
```

Defined in: [runShellCmd.ts:7](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L7)

##### stderr

```ts
stderr: string;
```

Defined in: [runShellCmd.ts:10](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L10)

##### stdout

```ts
stdout: string;
```

Defined in: [runShellCmd.ts:9](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L9)

***

### RunCmdOptions

```ts
type RunCmdOptions = object;
```

Defined in: [runShellCmd.ts:20](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L20)

#### Properties

##### cwd?

```ts
optional cwd: string;
```

Defined in: [runShellCmd.ts:23](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L23)

##### exitOnError?

```ts
optional exitOnError: boolean;
```

Defined in: [runShellCmd.ts:27](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L27)

Logs the stderr and exits the process with code 1

##### mock?

```ts
optional mock: CmdResult;
```

Defined in: [runShellCmd.ts:21](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L21)

##### noCiColorForce?

```ts
optional noCiColorForce: boolean;
```

Defined in: [runShellCmd.ts:31](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L31)

Doesn't force colors, the process env is passed as is

##### noColor?

```ts
optional noColor: boolean;
```

Defined in: [runShellCmd.ts:29](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L29)

Sets `NO_COLOR=1` instead of forcing colors

##### silent?

```ts
optional silent: boolean | "timeOnly";
```

Defined in: [runShellCmd.ts:22](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L22)

##### throwOnError?

```ts
optional throwOnError: boolean;
```

Defined in: [runShellCmd.ts:25](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L25)

Rejects the promise with an `Error` whose message is the stderr

##### timeout?

```ts
optional timeout: number;
```

Defined in: [runShellCmd.ts:33](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L33)

Passed to `spawn`, the process is killed after `timeout` ms
