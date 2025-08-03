import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { runCmdUnwrap } from '../packages/node-utils/src/runShellCmd';
import { deepEqual } from '../packages/utils/src/deepEqual';
import { narrowStringToUnion } from '../packages/utils/src/typingFnUtils';

const availablePackages = [
  'utils',
  'node-utils',
  'browser-utils',
  'react-utils',
] as const;

type PackageName = (typeof availablePackages)[number];

const versions = ['major', 'minor', 'patch'] as const;
type Version = (typeof versions)[number];

async function publishPackage(packageName: PackageName, version: Version) {
  // check if there are uncommitted changes
  runCmdUnwrap('check if is sync', ['./scripts/check-if-is-sync.sh']);

  if (packageName !== 'utils') {
    // build utils first
    runCmdUnwrap('build utils', ['pnpm', '--filter', 'utils', 'build']);
  }

  runCmdUnwrap('test package', ['pnpm', '--filter', packageName, 'test']);

  runCmdUnwrap('lint (tsc+eslint) package', [
    'pnpm',
    '--filter',
    packageName,
    'lint',
  ]);

  // commit fixes if any
  runCmdUnwrap('commit fixes', [
    'git',
    'commit',
    '-m',
    `chore: fix linting issues in ${packageName}`,
  ]);

  runCmdUnwrap('build package', ['pnpm', '--filter', packageName, 'build']);

  runCmdUnwrap('generate docs', ['pnpm', '--filter', packageName, 'docs']);

  // commit the generated docs
  runCmdUnwrap('commit docs and package.json exports updates', [
    'git',
    'commit',
    '-m',
    `chore: update docs and package.json exports for ${packageName}`,
  ]);

  // bump version
  runCmdUnwrap('bump version', ['pnpm', 'version', version], {
    cwd: `./packages/${packageName}`,
  });

  // publish package
  runCmdUnwrap('publish package', ['pnpm', 'publish', '--access', 'public'], {
    cwd: `./packages/${packageName}`,
  });
}

export async function updatePackageExports(packageName: string) {
  const packagePath = './package.json';
  const srcDir = './src';
  const libDir = './lib';
  const mainFile = 'main';
  const excludeFiles = ['main', 'internalUtils'];

  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  const exportedUtils: string[] = [];
  const srcFiles = readdirSync(srcDir);

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
      import: `${libDir}/${mainFile}.js`,
      require: `${libDir}/${mainFile}.cjs`,
    },
  };

  for (const exportedUtil of exportedUtils) {
    if (excludeFiles.includes(exportedUtil)) {
      continue;
    }

    newExportsField[`./${exportedUtil}`] = {
      import: `${libDir}/${exportedUtil}.js`,
      require: `${libDir}/${exportedUtil}.cjs`,
    };
  }

  if (!deepEqual(packageJson.exports, newExportsField)) {
    packageJson.exports = newExportsField;

    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }
}

function runFromCli() {
  const packageName = narrowStringToUnion(process.argv[2], availablePackages);
  const version = narrowStringToUnion(process.argv[3], versions);

  if (!packageName || !version) {
    console.error('Usage: pnpm publish-package <packageName> <version>');
    process.exit(1);
  }

  if (!packageName) {
    console.error('Invalid package name');
    process.exit(1);
  }

  if (!version) {
    console.error('Invalid version');
    process.exit(1);
  }
  publishPackage(packageName, version);
}

runFromCli();
