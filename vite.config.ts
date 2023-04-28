import path from 'node:path';
import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginMdToHTML()
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve('src') },
    ],
  },
  build: {
    target: "es2015",
    outDir: "dist",
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        vue: path.resolve('index.html'),
        preview: path.resolve('preview.html'),
      },
    },
  },
})
