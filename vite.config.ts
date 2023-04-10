import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/esbuild-wasm/esbuild.wasm',
          dest: 'wasm-files'
        }
      ],
    }),
    vitePluginMdToHTML()
  ],
})
