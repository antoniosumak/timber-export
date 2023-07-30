import { defineConfig } from 'astro/config';

// https://astro.build/config
import vue from '@astrojs/vue';

// https://astro.build/config
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
import image from '@astrojs/image';

import astroI18next from 'astro-i18next';

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind(), image(), astroI18next()],
});
