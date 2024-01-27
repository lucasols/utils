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

export function runCmd(
  label: string | null,
  command: string | string[],
  { mock, silent }: { mock?: CmdResult; silent?: boolean } = {},
): Promise<CmdResult> {
  if (mock) return Promise.resolve(mock);

  if (label && !silent) {
    console.log(`----${label}----`);
    console.time('✅');
  }

  return new Promise((resolve) => {
    const [cmd = '', ...args] =
      Array.isArray(command) ? command : command.split(' ');
    const child = spawn(cmd, args);

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

      if (!silent && label) {
        if (!hasError) {
          console.timeEnd('✅');
        }

        console.log('\n');
      }

      resolve({ label, out, stderr, stdout, error: hasError });
    });
  });
}

export async function concurrentCmd(
  label: string,
  cmd: string,
  onResult: (result: CmdResult) => void,
) {
  const start = Date.now();

  const result = await runCmd(label, cmd, { silent: true });

  onResult(result);

  const ellapsedSeconds = (Date.now() - start) / 1000;

  console.log(
    `${result.error ? '🔴' : '✅'} ${result.label} (${ellapsedSeconds.toFixed(
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
