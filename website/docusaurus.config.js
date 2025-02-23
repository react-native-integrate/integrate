// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native Integrate',
  tagline: 'Single-command integration of React Native packages',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: "https://react-native-integrate.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/integrate/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'react-native-integrate', // Usually your GitHub org/user name.
  projectName: 'integrate', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v3.x'
            },
          },
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true,
              converters: [
                'yarn',
                'pnpm',
                'bun',
              ],}],
          ],
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'React Native Integrate',
        logo: {
          alt: 'Integrate Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/react-native-integrate/integrate',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Installation',
                to: '/docs/usage',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/react-native-integrate',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/react-native-integrate/integrate',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} React Native Integrate, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.duotoneLight,
        darkTheme: prismThemes.shadesOfPurple,
        additionalLanguages: ['bash'],
      },
    }),
  plugins: [require.resolve("@cmfcmf/docusaurus-search-local")],
};

export default config;
