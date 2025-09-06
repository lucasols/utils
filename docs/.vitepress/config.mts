import { defineConfig } from 'vitepress';
// Import TypeDoc-generated sidebars
import llmstxtPlugin from 'vitepress-plugin-llmstxt';
import browserUtilsSidebar from '../api/browser-utils/typedoc-sidebar.json';
import nodeUtilsSidebar from '../api/node-utils/typedoc-sidebar.json';
import reactUtilsSidebar from '../api/react-utils/typedoc-sidebar.json';
import utilsSidebar from '../api/utils/typedoc-sidebar.json';


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ls-stack utils",
  description: "Docs for @ls-stack utils packages",
  vite: {
    plugins: [llmstxtPlugin()],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { 
        text: 'API', 
        items: [
          { text: 'Utils Package', link: '/api/' },
          { text: 'Node Utils', link: '/api/node-utils/' },
          { text: 'Browser Utils', link: '/api/browser-utils/' },
          { text: 'React Utils', link: '/api/react-utils/' }
        ]
      },
    ],

    sidebar: {
      '/api/utils/': [
        {
          text: '@ls-stack/utils',
          items: utilsSidebar
        }
      ],
      '/api/node-utils/': [
        {
          text: '@ls-stack/node-utils',
          items: nodeUtilsSidebar
        }
      ],
      '/api/browser-utils/': [
        {
          text: '@ls-stack/browser-utils',
          items: browserUtilsSidebar
        }
      ],
      '/api/react-utils/': [
        {
          text: '@ls-stack/react-utils',
          items: reactUtilsSidebar
        }
      ],
      '/api/': [
        {
          text: 'API Documentation',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Utils Package', link: '/api/utils/' },
            { text: 'Node Utils Package', link: '/api/node-utils/' },
            { text: 'Browser Utils Package', link: '/api/browser-utils/' },
            { text: 'React Utils Package', link: '/api/react-utils/' }
          ]
        }
      ],
      '/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lucasols/utils' }
    ],

    search: {
      provider: 'local',
    },
  }
})
