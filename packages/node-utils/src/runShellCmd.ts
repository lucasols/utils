/* oxlint-disable no-console -- we need console here to print errors */

import { spawn } from 'child_process';

type CmdResult = {
  label: string | null;
  out: string;
  error: boolean;
  stdout: string;
  stderr: string;
};

/**
 * A command to run. Strings are split on spaces. In arrays, `null` items are
 * dropped and items starting with `$` are split on spaces (with the `$`
 * removed), e.g. `['$git log -1', '--format=%s', ref]`.
 */
export type Command = string | (string | null)[];

type RunCmdOptions = {
  mock?: CmdResult;
  silent?: boolean | 'timeOnly';
  cwd?: string;
  /** Rejects the promise with an `Error` whose message is the stderr */
  throwOnError?: boolean;
  /** Logs the stderr and exits the process with code 1 */
  exitOnError?: boolean;
  /** Sets `NO_COLOR=1` instead of forcing colors */
  noColor?: boolean;
  /** Doesn't force colors, the process env is passed as is */
  noCiColorForce?: boolean;
  /** Passed to `spawn`, the process is killed after `timeout` ms */
  timeout?: number;
};

function parseCommand(command: Command): string[] {
  if (!Array.isArray(command)) return command.split(' ');

  return command.flatMap((item) => {
    if (item === null) return [];

    return item.startsWith('$') ? item.slice(1).split(' ') : item;
  });
}

function getEnv({
  noColor,
  noCiColorForce,
}: Pick<RunCmdOptions, 'noColor' | 'noCiColorForce'>):
  | NodeJS.ProcessEnv
  | undefined {
  if (noColor) return { ...process.env, NO_COLOR: '1' };

  if (noCiColorForce) return undefined;

  return { ...process.env, FORCE_COLOR: 'true', CLICOLOR_FORCE: '1' };
}

/**
 * Runs a shell command and returns the result.
 *
 * @param label - Optional label for the command (used for logging)
 * @param command - The command to run, see {@link Command}
 * @param options - Configuration options
 * @param options.mock - Mock result for testing
 * @param options.silent - Whether to suppress output (true, false, or
 *   'timeOnly')
 * @param options.throwOnError - Rejects with an `Error` whose message is the
 *   stderr if the command fails
 * @param options.exitOnError - Logs the stderr and exits the process if the
 *   command fails
 * @param options.cwd - Working directory for the command
 * @param options.noColor - Sets `NO_COLOR=1` instead of forcing colors with
 *   `FORCE_COLOR` and `CLICOLOR_FORCE`
 * @param options.noCiColorForce - Doesn't force colors, keeping the process env
 *   as is
 * @param options.timeout - Max time in ms the command can run before being
 *   killed
 * @returns Promise that resolves to the command result
 */
export function runCmd(
  label: string | null,
  command: Command,
  {
    mock,
    silent,
    throwOnError,
    exitOnError,
    cwd = process.cwd(),
    noColor,
    noCiColorForce,
    timeout,
  }: RunCmdOptions = {},
): Promise<CmdResult> {
  if (mock) return Promise.resolve(mock);

  const callSite = new Error('runCmd call site');

  if (label && (!silent || silent === 'timeOnly')) {
    console.log(`----${label}----`);
    console.time('✅');
  }

  return new Promise((resolve, reject) => {
    const [cmd = '', ...args] = parseCommand(command);

    const child = spawn(cmd, args, {
      cwd,
      env: getEnv({ noColor, noCiColorForce }),
      timeout,
    });

    let stdout = '';
    let stderr = '';
    let out = '';
    let spawnError: Error | null = null;

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

    child.on('error', (error) => {
      spawnError = new Error(
        `Failed to run command "${label ?? [cmd, ...args].join(' ')}": ${error.message}`,
        { cause: error },
      );

      if (!silent) {
        console.error(spawnError);
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

      const errorMessage = stderr || spawnError?.message || '';

      if (exitOnError && hasError) {
        if (silent) {
          if (label) {
            console.log(`----${label}----`);
          } else {
            console.trace();
          }
          console.error(errorMessage);
        }

        process.exit(1);
      }

      if (throwOnError && hasError) {
        reject(new Error(errorMessage, { cause: spawnError ?? callSite }));
        return;
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
  cmd: Command,
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
 * Runs a command and returns only the stdout, rejecting with an `Error` whose
 * message is the stderr if the command fails.
 *
 * @param label - Optional label for the command
 * @param command - The command to run
 * @param options - Same options as {@link runCmd}, except `mock` and
 *   `throwOnError`
 * @returns Promise that resolves to the stdout string
 */
export async function runCmdUnwrap(
  label: string | null,
  command: Command,
  options: Omit<RunCmdOptions, 'mock' | 'throwOnError'> = {},
) {
  return (await runCmd(label, command, { ...options, throwOnError: true }))
    .stdout;
}

/**
 * Runs a command silently without any output.
 *
 * @param command - The command to run
 * @returns Promise that resolves to the command result
 */
export function runCmdSilent(command: Command) {
  return runCmd(null, command, { silent: true });
}

/**
 * Runs a command silently and returns only the stdout.
 *
 * @param command - The command to run
 * @returns Promise that resolves to the stdout string
 */
export function runCmdSilentUnwrap(command: Command) {
  return runCmdUnwrap(null, command, { silent: true });
}
