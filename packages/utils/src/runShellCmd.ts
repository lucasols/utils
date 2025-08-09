/* eslint-disable no-console -- we need console here to print errors */

type CmdResult = {
  label: string | null;
  out: string;
  error: boolean;
  stdout: string;
  stderr: string;
};

import { spawn } from 'child_process';

type RunCmdOptions = {
  mock?: CmdResult;
  silent?: boolean | 'timeOnly';
  cwd?: string;
  throwOnError?: boolean;
  noCiColorForce?: boolean;
};

/**
 * @param label
 * @param command
 * @param root0
 * @param root0.mock
 * @param root0.silent
 * @param root0.throwOnError
 * @param root0.cwd
 * @param root0.noCiColorForce
 * @deprecated This utility has been moved to @ls-stack/node-utils. Please update your imports:
 * ```
 * // Old (deprecated)
 * import { runCmd } from '@ls-stack/utils/runShellCmd';
 *
 * // New (preferred)
 * import { runCmd } from '@ls-stack/node-utils/runShellCmd';
 * ```
 */
export function runCmd(
  label: string | null,
  command: string | string[],
  {
    mock,
    silent,
    throwOnError,
    cwd = process.cwd(),
    noCiColorForce,
  }: RunCmdOptions = {},
): Promise<CmdResult> {
  if (mock) return Promise.resolve(mock);

  if (label && (!silent || silent === 'timeOnly')) {
    console.log(`----${label}----`);
    console.time('✅');
  }

  return new Promise((resolve) => {
    const [cmd = '', ...args] =
      Array.isArray(command) ?
        command.flatMap((item) =>
          item.startsWith('$') ? item.replace('$', '').split(' ') : item,
        )
      : command.split(' ');
    const child = spawn(cmd, args, {
      cwd,
      env: noCiColorForce ? undefined : { ...process.env, CLICOLOR_FORCE: '1' },
    });

    let stdout = '';
    let stderr = '';
    let out = '';

    child.stdout.on('data', (data) => {
      stdout += String(data);
      out += String(data);

      if (!silent) {
        console.log(String(data));
      }
    });

    child.stderr.on('data', (data) => {
      stderr += String(data);
      out += String(data);

      if (!silent) {
        console.log(String(data));
      }
    });

    child.on('close', (code) => {
      const hasError = code !== 0;

      if (!silent || silent === 'timeOnly') {
        if (!hasError) {
          console.timeEnd('✅');
        }

        console.log('\n');
      }

      if (throwOnError && hasError) {
        if (silent) {
          if (label) {
            console.log(`----${label}----`);
          } else {
            console.trace();
          }
          console.error(stderr);
        }

        process.exit(1);
      }

      resolve({ label, out, stderr, stdout, error: hasError });
    });
  });
}

/**
 * @param label
 * @param cmd
 * @param onResult
 * @deprecated This utility has been moved to @ls-stack/node-utils. Please update your imports:
 * ```
 * // Old (deprecated)
 * import { concurrentCmd } from '@ls-stack/utils/runShellCmd';
 *
 * // New (preferred)
 * import { concurrentCmd } from '@ls-stack/node-utils/runShellCmd';
 * ```
 */
export async function concurrentCmd(
  label: string,
  cmd: string | string[],
  onResult: (result: CmdResult) => void,
) {
  const start = Date.now();

  const result = await runCmd(label, cmd, { silent: true });

  onResult(result);

  const elapsedSeconds = (Date.now() - start) / 1000;

  console.log(
    `${result.error ? '🔴' : '✅'} ${result.label} (${elapsedSeconds.toFixed(
      1,
    )}s)`,
  );

  return () => {
    if (result.error) {
      console.log(`❌ ${result.label} errors:`);
      console.log(result.out);
      console.log('\n');
    }
  };
}

/**
 * @param label
 * @param command
 * @param root0
 * @param root0.silent
 * @deprecated This utility has been moved to @ls-stack/node-utils. Please update your imports:
 * ```
 * // Old (deprecated)
 * import { runCmdUnwrap } from '@ls-stack/utils/runShellCmd';
 *
 * // New (preferred)
 * import { runCmdUnwrap } from '@ls-stack/node-utils/runShellCmd';
 * ```
 */
export async function runCmdUnwrap(
  label: string | null,
  command: string | string[],
  {
    silent,
  }: {
    silent?: boolean | 'timeOnly';
  } = {},
) {
  return (await runCmd(label, command, { silent, throwOnError: true })).stdout;
}

/**
 * @param command
 * @deprecated This utility has been moved to @ls-stack/node-utils. Please update your imports:
 * ```
 * // Old (deprecated)
 * import { runCmdSilent } from '@ls-stack/utils/runShellCmd';
 *
 * // New (preferred)
 * import { runCmdSilent } from '@ls-stack/node-utils/runShellCmd';
 * ```
 */
export function runCmdSilent(command: string | string[]) {
  return runCmd(null, command, { silent: true });
}

/**
 * @param command
 * @deprecated This utility has been moved to @ls-stack/node-utils. Please update your imports:
 * ```
 * // Old (deprecated)
 * import { runCmdSilentUnwrap } from '@ls-stack/utils/runShellCmd';
 *
 * // New (preferred)
 * import { runCmdSilentUnwrap } from '@ls-stack/node-utils/runShellCmd';
 * ```
 */
export function runCmdSilentUnwrap(command: string | string[]) {
  return runCmdUnwrap(null, command, { silent: true });
}
