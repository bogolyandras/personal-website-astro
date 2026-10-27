// @ts-check
import { defineConfig, envField } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import favicons from 'astro-favicons';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.bogolyandras.com',
  env: {
    schema: {
      // URL the contact form POSTs to; set in CI from the CONTACT_FORM_ENDPOINT repository variable.
      CONTACT_FORM_ENDPOINT: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
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
