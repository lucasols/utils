import { createHash } from 'crypto';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { runCmdUnwrap } from '../packages/node-utils/src/runShellCmd.ts';
import { deepEqual } from '../packages/utils/src/deepEqual.ts';
import { narrowStringToUnion } from '../packages/utils/src/typingFnUtils.ts';

const PUBLISH_HASHES_FILE = './scripts/publish-hashes.json';

const availablePackages = [
  'utils',
  'node-utils',
  'browser-utils',
  'react-utils',
] as const;

type PackageName = (typeof availablePackages)[number];

const versions = ['major', 'minor', 'patch'] as const;
type Version = (typeof versions)[number];

async function generateDirectoryHash(dirPath: string): Promise<string> {
  if (!existsSync(dirPath)) {
    throw new Error(`Directory does not exist: ${dirPath}`);
  }

  const hash = createHash('sha256');
  const files: string[] = [];

  function collectFiles(currentPath: string, relativePath = '') {
    const items = readdirSync(currentPath).sort();
    for (const item of items) {
      const fullPath = join(currentPath, item);
      const itemRelativePath = relativePath ? join(relativePath, item) : item;
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        collectFiles(fullPath, itemRelativePath);
      } else {
        files.push(itemRelativePath);
      }
    }
  }

  collectFiles(dirPath);

  for (const filePath of files) {
    const fullPath = join(dirPath, filePath);
    const content = readFileSync(fullPath);
    hash.update(filePath);
    hash.update(content);
  }

  return hash.digest('hex');
}

type PublishHashesData = Record<string, Record<string, string>>;

function readPublishHashes(): PublishHashesData {
  if (!existsSync(PUBLISH_HASHES_FILE)) {
    return {};
  }
  try {
    const content = readFileSync(PUBLISH_HASHES_FILE, 'utf-8');
    return JSON.parse(content) as PublishHashesData;
  } catch {
    return {};
  }
}

function writePublishHashes(data: PublishHashesData): void {
  writeFileSync(PUBLISH_HASHES_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

async function checkHashBeforePublish(
  packageName: string,
  currentHash: string,
  force = false,
): Promise<void> {
  const hashes = readPublishHashes();
  const packageHashes = hashes[packageName] ?? {};
  for (const [version, hash] of Object.entries(packageHashes)) {
    if (hash === currentHash) {
      if (force) {
        console.warn(
          `This build has already been published as ${packageName}@${version}`,
        );
        console.warn(`Hash: ${currentHash}`);
        console.warn('Force flag enabled - proceeding with publish anyway.');
        return;
      }
      console.error(
        `This build has already been published as ${packageName}@${version}`,
      );
      console.error(`Hash: ${currentHash}`);
      console.error('No changes detected in the build output.');
      console.error('Make code changes before attempting to publish.');
      console.error(
        'Or use --force to publish anyway: pnpm publish-package <package> <version> -- --force',
      );
      process.exit(1);
    }
  }
  console.log(`Verified new build hash: ${currentHash.slice(0, 12)}...`);
}

function savePublishHash(
  packageName: string,
  version: string,
  hash: string,
): void {
  const hashes = readPublishHashes();
  hashes[packageName] = hashes[packageName] ?? {};
  hashes[packageName]![version] = hash;
  writePublishHashes(hashes);
}

async function publishPackage(
  packageName: PackageName,
  version: Version,
  force = false,
) {
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

  if (packageName === 'react-utils') {
    // build browser-utils
    await runCmdUnwrap('build browser-utils', [
      'pnpm',
      '--filter',
      '@ls-stack/browser-utils',
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

  const fullPackageName = `@ls-stack/${packageName}`;
  const distPath = join(process.cwd(), 'packages', packageName, 'dist');
  const currentHash = await generateDirectoryHash(distPath);
  await checkHashBeforePublish(fullPackageName, currentHash, force);

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

  const packageJsonPath = join(
    process.cwd(),
    'packages',
    packageName,
    'package.json',
  );
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const publishedVersion = packageJson.version as string;
  savePublishHash(fullPackageName, publishedVersion, currentHash);
  await commitChanges(
    `chore: update publish hashes for ${fullPackageName}@${publishedVersion}`,
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
    if (srcFile.endsWith('.test.ts') || srcFile.endsWith('.test.tsx')) {
      continue;
    }

    exportedUtils.push(srcFile.replace(/\.ts$/, ''));
  }

  const newExportsField: Record<string, string> = {
    '.': `${libDir}/${mainFile}.mjs`,
  };

  for (const exportedUtil of exportedUtils) {
    if (excludeFiles.includes(exportedUtil)) {
      continue;
    }

    newExportsField[`./${exportedUtil}`] = `${libDir}/${exportedUtil}.mjs`;
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
  const force = process.argv.includes('--force');

  if (!packageName || !version) {
    console.error(
      'Usage: pnpm publish-package <packageName> <version> [-- --force]',
    );
    console.error(`Available packages: ${availablePackages.join(', ')}`);
    console.error(`Available versions: ${versions.join(', ')}`);
    process.exit(1);
  }

  await publishPackage(packageName, version, force);
}

runFromCli();
