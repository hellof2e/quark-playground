import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';
import path from "path";
const resolve = path.resolve;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginMdToHTML()
  ],
  build: {
    target: "es2015",
    outDir: "dist",
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        vue: resolve(__dirname, "index.html"),
        preview: resolve(__dirname, "preview.html"),
      },
    },
  },
})
