import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { deepEqual } from '../packages/utils/src/deepEqual.ts'

const packagePath = './package.json'
const srcDir = './src'
const libDir = './dist'
const mainFile = 'main'
const excludeFiles = ['main', 'internalUtils']

const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
const exportedUtils: string[] = []
const srcFiles = readdirSync(srcDir)

for (const srcFile of srcFiles) {
  if (srcFile.endsWith('.test.ts') || srcFile.endsWith('.test.tsx')) {
    continue
  }

  exportedUtils.push(srcFile.replace(/\.ts$/, ''))
}

const newExportsField: Record<string, string> = {
  '.': `${libDir}/${mainFile}.mjs`,
}

for (const exportedUtil of exportedUtils) {
  if (excludeFiles.includes(exportedUtil)) {
    continue
  }

  newExportsField[`./${exportedUtil}`] = `${libDir}/${exportedUtil}.mjs`
}

if (!deepEqual(packageJson.exports, newExportsField)) {
  packageJson.exports = newExportsField

  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
}
