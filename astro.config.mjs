// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import favicons from 'astro-favicons';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.bogolyandras.com',
  integrations: [
    sitemap(),
    // Generates favicon.ico, PNG icons and the apple-touch-icon from public/favicon.svg
    // and injects the <link> tags into every page.
    favicons({
      name: 'András Bögöly',
      short_name: 'András Bögöly',
      background: '#8dd35f',
      icons: {
        favicons: ['favicon.ico', 'favicon.svg'],
        appleIcon: ['apple-touch-icon.png'],
        android: false,
        appleStartup: false,
        windows: false,
        yandex: false,
      },
    }),
  ],
});
