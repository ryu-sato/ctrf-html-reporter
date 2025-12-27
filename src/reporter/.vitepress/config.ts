import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CTCF HTML Reporter",
  description: "Report test result of CTRF (Common Test Report Format)",
    vite: {
      resolve: {
        alias: {
          'ctrf': 'ctrf'
        }
      },
      ssr: {
        noExternal: ['ctrf', 'chart.js']
      },
    },
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: 'Overview', link: '/#overview' },
        { text: 'Suites', link: '/#suites' },
        { text: 'Insights', link: '/#insights' },
        { text: 'Timeline', link: '/#timeline' },
      ],

      sidebar: [
        {
          text: 'Report',
          items: [
            { text: 'Overview', link: '/#overview' },
            { text: 'Suites', link: '/#suites' },
            { text: 'Insights', link: '/#insights' },
            { text: 'Timeline', link: '/#timeline' }
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/ryu-sato/ctrf-html-reporter' }
      ]
    },
  },
);
