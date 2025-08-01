[**@ls-stack/node-utils**](../README.md)

***

[@ls-stack/node-utils](../modules.md) / [runShellCmd](README.md) / \<internal\>

# \<internal\>

## Type Aliases

### CmdResult

```ts
type CmdResult = object;
```

Defined in: [runShellCmd.ts:3](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L3)

#### Properties

##### error

```ts
error: boolean;
```

Defined in: [runShellCmd.ts:6](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L6)

##### label

```ts
label: string | null;
```

Defined in: [runShellCmd.ts:4](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L4)

##### out

```ts
out: string;
```

Defined in: [runShellCmd.ts:5](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L5)

##### stderr

```ts
stderr: string;
```

Defined in: [runShellCmd.ts:8](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L8)

##### stdout

```ts
stdout: string;
```

Defined in: [runShellCmd.ts:7](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L7)

***

### RunCmdOptions

```ts
type RunCmdOptions = object;
```

Defined in: [runShellCmd.ts:13](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L13)

#### Properties

##### cwd?

```ts
optional cwd: string;
```

Defined in: [runShellCmd.ts:16](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L16)

##### mock?

```ts
optional mock: CmdResult;
```

Defined in: [runShellCmd.ts:14](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L14)

##### noCiColorForce?

```ts
optional noCiColorForce: boolean;
```

Defined in: [runShellCmd.ts:18](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L18)

##### silent?

```ts
optional silent: boolean | "timeOnly";
```

Defined in: [runShellCmd.ts:15](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L15)

##### throwOnError?

```ts
optional throwOnError: boolean;
```

Defined in: [runShellCmd.ts:17](https://github.com/lucasols/utils/blob/main/packages/node-utils/src/runShellCmd.ts#L17)
