import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function updatePackageExports(options: {
  packagePath?: string;
  srcDir?: string;
  libDir?: string;
  mainFile?: string;
  excludeFiles?: string[];
  gitCommit?: boolean;
} = {}) {
  const {
    packagePath = './package.json',
    srcDir = './src',
    libDir = './lib',
    mainFile = 'main',
    excludeFiles = ['main', 'internalUtils'],
    gitCommit = true,
  } = options;

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

  // Compare using JSON.stringify since we don't have deepEqual available here
  const currentExports = JSON.stringify(packageJson.exports, null, 2);
  const newExports = JSON.stringify(newExportsField, null, 2);

  if (currentExports !== newExports) {
    packageJson.exports = newExportsField;

    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

    if (gitCommit) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await execAsync('git add package.json');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await execAsync('git commit -m "update package.json exports"');
      } catch (error) {
        // Ignore git errors (e.g., no changes to commit)
        console.warn('Git commit failed:', error);
      }
    }
  }
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updatePackageExports().catch(console.error);
}