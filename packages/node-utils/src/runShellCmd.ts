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
 * Runs a shell command and returns the result.
 *
 * @param label - Optional label for the command (used for logging)
 * @param command - The command to run (string or array of strings)
 * @param options - Configuration options
 * @param options.mock - Mock result for testing
 * @param options.silent - Whether to suppress output (true, false, or 'timeOnly')
 * @param options.throwOnError - Whether to throw/exit on error
 * @param options.cwd - Working directory for the command
 * @param options.noCiColorForce - Whether to disable CI color forcing
 * @returns Promise that resolves to the command result
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
 * Runs a command concurrently with logging and error handling.
 *
 * @param label - Label for the command
 * @param cmd - The command to run
 * @param onResult - Callback function to handle the result
 * @returns Function to display errors if any occurred
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
 * Runs a command and returns only the stdout, throwing on error.
 *
 * @param label - Optional label for the command
 * @param command - The command to run
 * @param options - Configuration options
 * @param options.silent - Whether to suppress output
 * @param options.cwd - Working directory for the command
 * @returns Promise that resolves to the stdout string
 */
export async function runCmdUnwrap(
  label: string | null,
  command: string | string[],
  {
    silent,
    cwd,
  }: {
    silent?: boolean | 'timeOnly';
    cwd?: string;
  } = {},
) {
  return (await runCmd(label, command, { silent, throwOnError: true, cwd }))
    .stdout;
}

/**
 * Runs a command silently without any output.
 *
 * @param command - The command to run
 * @returns Promise that resolves to the command result
 */
export function runCmdSilent(command: string | string[]) {
  return runCmd(null, command, { silent: true });
}

/**
 * Runs a command silently and returns only the stdout.
 *
 * @param command - The command to run
 * @returns Promise that resolves to the stdout string
 */
export function runCmdSilentUnwrap(command: string | string[]) {
  return runCmdUnwrap(null, command, { silent: true });
}
