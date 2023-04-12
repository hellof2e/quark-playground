import * as esbuild from 'esbuild-wasm';
import wasmURL from 'esbuild-wasm/esbuild.wasm?url';
import {
  cleanPath,
  read,
} from './utils';

let initializing: Promise<void>;

try {
  initializing = esbuild.initialize({
    wasmURL,
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
    build.onResolve({ filter: /\.css(?:$|\?)/ }, (args) => {
      return {
        path: args.path,
        namespace: NAMESPACE,
      };
    });
    build.onLoad({
      filter: /.*/,
      namespace: NAMESPACE,
    }, ({ path }) => {
      const code = read(cleanPath(path));
      let contents = `export default ${JSON.stringify(code)};\n`;

      // ? enable stylesheet inject by default
      // if (!/[&?]inline\b/.test(path)) {
      //   // * inject stylesheet into document
      //   contents += `;(function () {
      //     const style = document.createElement('style');
      //     style.textContent = ${JSON.stringify(code)};
      //     document.head.appendChild(style);
      //   })()`;
      // }
      return {
        contents,
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
      contents: pendingContent,
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
