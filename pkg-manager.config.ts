import { defineConfig } from '@ls-stack/pkg-manager'

export default defineConfig({
  requireMajorConfirmation: true,
  prePublish: [
    { command: 'pnpm test', label: 'Testing' },
    { command: 'pnpm lint', label: 'Linting' },
    { command: 'pnpm build', label: 'Building' },
    { command: 'pnpm update-exports', label: 'Updating exports' },
    { command: 'pnpm run docs', label: 'Generating docs' },
  ],
  monorepo: {
    packages: [
      { name: '@ls-stack/utils', path: 'packages/utils' },
      {
        name: '@ls-stack/node-utils',
        path: 'packages/node-utils',
        dependsOn: ['@ls-stack/utils'],
      },
      {
        name: '@ls-stack/browser-utils',
        path: 'packages/browser-utils',
        dependsOn: ['@ls-stack/utils'],
      },
      {
        name: '@ls-stack/react-utils',
        path: 'packages/react-utils',
        dependsOn: ['@ls-stack/utils', '@ls-stack/browser-utils'],
      },
    ],
  },
})
