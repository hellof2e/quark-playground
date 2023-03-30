import * as esbuild from 'esbuild-wasm';

let initializing: Promise<void>;

try {
  initializing = esbuild.initialize({
    wasmURL: '/wasm-files/esbuild.wasm',
  });
} catch (e) {
  // noop
}

/** pending contents to be compiled */
let pendingContent: string = '';
/** curr task id */
let taskId = 0;

/** 请求构建 */
const build = async (rawContent: string) => {
  pendingContent = rawContent;
  await initializing;
  const currTaskId = ++taskId;
  const result = await esbuild.build({
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
  });

  if (currTaskId !== taskId) {
    return null;
  }

  return result;
};

export {
  build as default,
}
