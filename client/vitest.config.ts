import { defineConfig } from 'vitest/config';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgrPlugin()],
  test: {
    environment: 'happy-dom',
    css: true,
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html']
    }
  },
});
