import { readFileSync, readdirSync, writeFileSync } from 'fs';

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
    require: string;
  }
> = {
  '.': {
    import: './lib/main.js',
    require: './lib/main.cjs',
  },
};

for (const exportedUtil of exportedUtils) {
  if (exportedUtil === 'main' || exportedUtil === 'internalUtils') {
    continue;
  }

  newExportsField[`./${exportedUtil}`] = {
    import: `./lib/${exportedUtil}.js`,
    require: `./lib/${exportedUtil}.cjs`,
  };
}

if (JSON.stringify(packageJson.exports) !== JSON.stringify(newExportsField)) {
  packageJson.exports = newExportsField;
  writeFileSync('./package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
}
