import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import viteCompression from 'vite-plugin-compression';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 3000,
    open: true
  }
});