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
    import: {
      import: string;
      types: string;
    };
    require: {
      import: string;
      types: string;
    };
  }
> = {
  '.': {
    import: {
      import: './dist/main.js',
      types: './dist/main.d.ts',
    },
    require: {
      import: './dist/main.cjs',
      types: './dist/main.d.cts',
    },
  },
};

const newTypesVersions: Record<'*', Record<string, string[]>> = {
  '*': {},
};

let dtsBundle = '';
let ctsBundle = '';

for (const exportedUtil of exportedUtils) {
  if (exportedUtil === 'main' || exportedUtil === 'internalUtils') {
    continue;
  }

  newExportsField[`./${exportedUtil}`] = {
    import: {
      import: `./dist/${exportedUtil}.js`,
      types: `./dist/${exportedUtil}.d.ts`,
    },
    require: {
      import: `./dist/${exportedUtil}.cjs`,
      types: `./dist/${exportedUtil}.d.cts`,
    },
  };

  newTypesVersions['*'][exportedUtil] = [`./dist/${exportedUtil}.d.ts`];

  dtsBundle += `///<reference path="${exportedUtil}.d.ts" />\n`;
  ctsBundle += `///<reference path="${exportedUtil}.d.cts" />\n`;
}

writeFileSync('./dist/main.d.ts', dtsBundle);
writeFileSync('./dist/main.d.cts', ctsBundle);

if (
  !deepEqual(packageJson.exports, newExportsField) ||
  !deepEqual(packageJson.typesVersions, newTypesVersions)
) {
  packageJson.exports = newExportsField;
  packageJson.typesVersions = newTypesVersions;

  writeFileSync('./package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

  await sleep(500);
  runCmd(null, 'git add package.json');

  await sleep(500);
  runCmd(null, ['git', 'commit', '-m', '"update package.json exports"']);
}
