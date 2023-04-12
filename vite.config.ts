import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginMdToHTML()
  ],
})
