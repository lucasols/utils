import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { runCmdUnwrap } from '../packages/node-utils/src/runShellCmd.ts';
import { deepEqual } from '../packages/utils/src/deepEqual.ts';
import { narrowStringToUnion } from '../packages/utils/src/typingFnUtils.ts';

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
  await checkIfIsSync();

  if (packageName !== 'utils') {
    // build utils first
    await runCmdUnwrap('build utils', [
      'pnpm',
      '--filter',
      '@ls-stack/utils',
      'build',
    ]);
  }

  await runCmdUnwrap('test package', [
    'pnpm',
    '--filter',
    `@ls-stack/${packageName}`,
    'test',
  ]);

  await runCmdUnwrap('lint (tsc+eslint) package', [
    'pnpm',
    '--filter',
    `@ls-stack/${packageName}`,
    'lint',
  ]);

  // check if there are any changes to commit
  const gitStatus = await runCmdUnwrap('check git status', [
    'git',
    'status',
    '--porcelain',
  ]);
  if (gitStatus.trim()) {
    await runCmdUnwrap('stage all changes', ['git', 'add', '.']);
    await runCmdUnwrap('commit fixes', [
      'git',
      'commit',
      '-m',
      `chore: fix linting issues in ${packageName}`,
    ]);
  }

  await runCmdUnwrap('build package', [
    'pnpm',
    '--filter',
    `@ls-stack/${packageName}`,
    'build',
  ]);

  // Update package exports after build
  const previousCwd = process.cwd();
  process.chdir(`./packages/${packageName}`);
  await updatePackageExports(packageName);
  process.chdir(previousCwd);

  await runCmdUnwrap('generate docs', [
    'pnpm',
    '--filter',
    `@ls-stack/${packageName}`,
    'docs',
  ]);

  // check if there are any changes to commit
  await commitChanges(
    `chore: update docs and package.json exports for ${packageName}`,
  );

  // bump version
  await runCmdUnwrap('bump version', ['pnpm', 'version', version], {
    cwd: `./packages/${packageName}`,
  });

  await commitChanges(`chore: bump version for ${packageName}`);

  // publish package
  await runCmdUnwrap(
    'publish package',
    ['pnpm', 'publish', '--access', 'public'],
    {
      cwd: `./packages/${packageName}`,
    },
  );

  console.log(`✅ Successfully published @ls-stack/${packageName}`);
}

async function updatePackageExports(_packageName: string) {
  const packagePath = './package.json';
  const srcDir = './src';
  const libDir = './dist';
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

async function checkIfIsSync() {
  const gitStatus = await runCmdUnwrap('check git status', [
    'git',
    'status',
    '--porcelain',
  ]);

  if (gitStatus.trim()) {
    console.error('Git is not sync, commit your changes first');
    process.exit(1);
  }
}

async function commitChanges(message: string) {
  const gitStatus = await runCmdUnwrap('check git status', [
    'git',
    'status',
    '--porcelain',
  ]);

  if (gitStatus.trim()) {
    await runCmdUnwrap('stage all changes', ['git', 'add', '.']);
    await runCmdUnwrap('commit changes', ['git', 'commit', '-m', message]);
  } else {
    console.log('No changes to commit');
  }
}

async function runFromCli() {
  const packageName = narrowStringToUnion(process.argv[2], availablePackages);
  const version = narrowStringToUnion(process.argv[3], versions);

  if (!packageName || !version) {
    console.error('Usage: pnpm publish-package <packageName> <version>');
    console.error(`Available packages: ${availablePackages.join(', ')}`);
    console.error(`Available versions: ${versions.join(', ')}`);
    process.exit(1);
  }

  await publishPackage(packageName, version);
}

runFromCli();
