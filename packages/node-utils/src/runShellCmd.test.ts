import { describe, expect, test } from 'vitest';
import { runCmd, runCmdSilent, runCmdUnwrap } from './runShellCmd';

const printEnvScript = `console.log(JSON.stringify({ NO_COLOR: process.env.NO_COLOR ?? null, FORCE_COLOR: process.env.FORCE_COLOR ?? null, CLICOLOR_FORCE: process.env.CLICOLOR_FORCE ?? null }))`;

describe('runCmd', () => {
  test('should run a simple command', async () => {
    const result = await runCmd('echo test', ['echo', 'hello world'], {
      silent: true,
    });
    expect(result.stdout.trim()).toBe('hello world');
    expect(result.error).toBe(false);
  });

  test('drops null items in array commands', async () => {
    const echoCmd = (withFlag: boolean) => [
      'echo',
      'a',
      withFlag ? '--flag' : null,
      'b',
    ];

    expect((await runCmdSilent(echoCmd(true))).stdout).toMatchInlineSnapshot(`
      "a --flag b
      "
    `);
    expect((await runCmdSilent(echoCmd(false))).stdout).toMatchInlineSnapshot(`
      "a b
      "
    `);
  });

  test('splits array items starting with `$` on spaces', async () => {
    const result = await runCmdSilent([
      '$node -e',
      'process.stdout.write(String(1 + 1))',
    ]);

    expect(result.stdout).toMatchInlineSnapshot(`"2"`);
  });

  test('resolves with error flag when the command fails', async () => {
    const result = await runCmdSilent([
      'node',
      '-e',
      'console.error("boom"); process.exit(1)',
    ]);

    expect(result.error).toBe(true);
    expect(result.stderr).toMatchInlineSnapshot(`
      "boom
      "
    `);
  });

  test('throwOnError rejects with the stderr as message', async () => {
    await expect(
      runCmd(null, ['node', '-e', 'console.error("boom"); process.exit(1)'], {
        silent: true,
        throwOnError: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: boom
      ]
    `);
  });

  test('throwOnError rejects when the command does not exist', async () => {
    await expect(
      runCmd(null, ['non-existent-cmd-xyz'], {
        silent: true,
        throwOnError: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Failed to run command "non-existent-cmd-xyz": spawn non-existent-cmd-xyz ENOENT]`,
    );
  });

  test('exitOnError logs the stderr and exits the process', async () => {
    const script = `
      import { runCmd } from './runShellCmd.ts';
      await runCmd('fail', ['node', '-e', 'console.error("boom"); process.exit(3)'], {
        silent: true,
        exitOnError: true,
      });
      console.log('not reached');
    `;

    const result = await runCmd(
      null,
      ['node', '--input-type=module', '-e', script],
      { silent: true, cwd: import.meta.dirname },
    );

    expect(result.error).toBe(true);
    expect(result.out).toMatchInlineSnapshot(`
      "----fail----
      boom

      "
    `);
  });

  test('timeout kills the command', async () => {
    const result = await runCmd(
      null,
      ['node', '-e', 'setTimeout(() => {}, 5000)'],
      { silent: true, timeout: 100 },
    );

    expect(result.error).toBe(true);
  });

  test('forces colors by default', async () => {
    const result = await runCmdSilent(['node', '-e', printEnvScript]);

    expect(JSON.parse(result.stdout)).toMatchInlineSnapshot(`
      {
        "CLICOLOR_FORCE": "1",
        "FORCE_COLOR": "true",
        "NO_COLOR": null,
      }
    `);
  });

  test('noColor sets NO_COLOR and does not force colors', async () => {
    const stdout = await runCmdUnwrap(null, ['node', '-e', printEnvScript], {
      silent: true,
      noColor: true,
    });

    expect(JSON.parse(stdout)).toMatchInlineSnapshot(`
      {
        "CLICOLOR_FORCE": null,
        "FORCE_COLOR": null,
        "NO_COLOR": "1",
      }
    `);
  });
});

describe('runCmdUnwrap', () => {
  test('returns the stdout', async () => {
    expect(await runCmdUnwrap(null, ['echo', 'hello'], { silent: true }))
      .toMatchInlineSnapshot(`
      "hello
      "
    `);
  });

  test('rejects with the stderr as message', async () => {
    await expect(
      runCmdUnwrap(
        null,
        ['node', '-e', 'console.error("unwrap failed"); process.exit(2)'],
        { silent: true },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: unwrap failed
      ]
    `);
  });
});
