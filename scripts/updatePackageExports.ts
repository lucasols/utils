import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { deepEqual } from '../src/deepEqual';
import { runCmd } from '../src/runShellCmd';
import { sleep } from '../src/sleep';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const exportedUtils: string[] = [];

const srcFiles = readdirSync('./src');

for (const srcFile of srcFiles) {
  if (srcFile.endsWith('.test.ts')) {
    continue;
  }

  exportedUtils.push(srcFile.replace(/\.ts$/, ''));
}

const newExportsField: Record<
  string,
  {
    import: string;
    types: string;
  }
> = {};

for (const exportedUtil of exportedUtils) {
  newExportsField[`./${exportedUtil}`] = {
    import: `./dist/${exportedUtil}.js`,
    types: `./dist/${exportedUtil}.d.ts`,
  };
}

if (!deepEqual(packageJson.exports, newExportsField)) {
  packageJson.exports = newExportsField;

  writeFileSync('./package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

  await sleep(500);
  runCmd(null, 'git add package.json');

  await sleep(500);
  runCmd(null, ['git', 'commit', '-m', '"update package.json exports"']);
}
