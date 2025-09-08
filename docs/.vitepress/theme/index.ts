import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import CopyDownloadButtons from './components/CopyDownloadButtons.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CopyDownloadButtons', CopyDownloadButtons)
  }
} satisfies Theme