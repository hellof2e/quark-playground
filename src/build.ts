import * as esbuild from 'esbuild-wasm';
import { read } from './fs';

let initializing: Promise<void>;

try {
  initializing = esbuild.initialize({
    wasmURL: '/wasm-files/esbuild.wasm',
  });
} catch (e) {
  // noop
}

const ignoreBareJsPlugin: esbuild.Plugin = {
  name: 'ignoreBareJs',
  setup(build) {
    // * mark as external
    build.onResolve({ filter: /^(https?:)?\/\// }, ({ path }) => {
      return {
        external: true,
        path,
      };
    });
    // * also mark bare imports as external
    build.onResolve({ filter: /^[\w@][^:]/ }, ({ path }) => {
      return {
        external: true,
        path,
      };
    });
  },
};

const customCssPlugin: esbuild.Plugin = {
  name: 'customCss',
  setup(build) {
    const NAMESPACE = 'custom-css';
    build.onResolve({ filter: /\.css$/ }, (args) => {
      return {
        path: args.path,
        namespace: NAMESPACE,
      };
    });
    build.onLoad({
      filter: /\.css$/,
      namespace: NAMESPACE,
    }, ({ path }) => {
      return {
        contents: `export default ${JSON.stringify(read(path))}`,
        loader: 'js',
      };
    });
  },
};

/** pending contents to be compiled */
let pendingContent: string = '';
/** curr task id */
let taskId = 0;

/** request for building */
const build = async (rawContent: string) => {
  pendingContent = rawContent;
  await initializing;
  const currTaskId = ++taskId;
  const result = await esbuild.build({
    bundle: true,
    format: 'esm',
    write: false,
    stdin: {
      contents: `
        function render(
          customElemTag,
          root = document.getElementById('app')
        ) {
          const elem = document.createElement(customElemTag);
          root.innerHTML = '';
          root.appendChild(elem);
        }

        ${pendingContent}
      `,
      loader: 'tsx',
    },
    jsxFactory: 'QuarkElement.h',
    plugins: [
      ignoreBareJsPlugin,
      customCssPlugin,
    ],
  });

  if (currTaskId !== taskId) {
    return null;
  }

  return result;
};

export {
  build as default,
}
