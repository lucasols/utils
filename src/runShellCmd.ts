/* eslint-disable no-console -- we need console here to print errors */

type CmdResult = {
  label: string | null;
  out: string;
  error: boolean;
  stdout: string;
  stderr: string;
};

import { spawn } from 'child_process';

(process.env as any).FORCE_COLOR = true;

type RunCmdOptions = {
  mock?: CmdResult;
  silent?: boolean | 'timeOnly';
  cwd?: string;
  throwOnError?: boolean;
};

export function runCmd(
  label: string | null,
  command: string | string[],
  { mock, silent, throwOnError, cwd = process.cwd() }: RunCmdOptions = {},
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

export function runCmdSilent(command: string | string[]) {
  return runCmd(null, command, { silent: true });
}

export function runCmdSilentUnwrap(command: string | string[]) {
  return runCmdUnwrap(null, command, { silent: true });
}
