import { defineConfig } from 'vite';
import { resolve } from 'path';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  plugins: [vitePluginString()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        phong: resolve(__dirname, 'phong.html'),
        creative: resolve(__dirname, 'creative.html'),
      },
    },
  },
});
