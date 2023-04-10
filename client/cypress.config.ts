import { defineConfig } from 'cypress';

export default defineConfig({
  // block requests to external resources.
  // In this case blocks the requests to the iconify API
  //blockHosts: ['*api.iconify.design', '*api.simplesvg.com', '*api.unisvg.com'],
  e2e: {
  },
});
