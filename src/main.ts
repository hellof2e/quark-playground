import { debounce } from 'lodash-es';
import build from './build';
import * as monaco from 'monaco-editor';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
	getWorker: function (_, label) {
		switch (label) {
			case 'typescript':
			case 'javascript':
				return new tsWorker();
			default:
				return new editorWorker();
		}
	}
};

const initApp = () => {
  /** initial build content */
  let text = `
  import { QuarkElement, property, customElement } from 'quarkc';

  /*
    invoke render function to preview and test your custom element,
    or feel free to write your own render function,
    embeded render function's implementation shown as below:

    function render(
      customElemTag: string,
      root: HTMLElement = document.getElementById('app')
    ) {
      const elem = document.createElement(customElemTag);
      root.innerHTML = '';
      root.appendChild(elem);
    }
  */

  @customElement({ tag: "quark-count" })
  class MyElement extends QuarkElement {
    @property({
      type: Number
    })
    count = 0;

    increment = () => {
      this.count += 1;
    }

    decrement = () => {
      this.count -= 1;
    }
    
    render() {
      return (
        <div>
          <div>Counter: {this.count}</div>
          <button onClick={this.increment}>Increment</button>
          <button onClick={this.decrement}>Decrement</button>
        </div>
      );
    }
  }

  render('quark-count');
  `;

  // * ——preview iframe——
  const iframeElem = document.getElementById('app-preview-iframe') as HTMLIFrameElement;
  let reloadIframeResolve: (value?: unknown) => void;
  const reloadIframe = () => new Promise((resolve) => {
    reloadIframeResolve = resolve;
    iframeElem
        ?.contentWindow
        ?.location
        ?.reload();
  });
  const onIframeReload = () => {
    if (reloadIframeResolve) {
      reloadIframeResolve();
    }
  };
  iframeElem.addEventListener('load', onIframeReload);

  // * ——first run build——
  const doBuild = async (rawText: string) => {
    const result = await build(rawText);

    if (result?.outputFiles) {
      const [outputFile] = result.outputFiles;
      await reloadIframe();
      iframeElem
        ?.contentWindow
        ?.postMessage(outputFile.text);
    }
  };
  const debouncedDoBuild = debounce(doBuild, 500);
  doBuild(text);

  // * ——initialize editor——
  const editorElem = document.getElementById('app-editor') as HTMLDivElement;
  const editor = monaco.editor.create(editorElem!, {
    theme: 'vs-dark',
    automaticLayout: true,
  });
  let model = monaco.editor.createModel(text, 'javascript');
  editor.setModel(model);
  editor.onDidChangeModelContent((event) => {
    let modifiedText = text;

    for (const change of event.changes) {
      const {
        rangeOffset,
        rangeLength,
        text,
      } = change;
      modifiedText = modifiedText.slice(0, rangeOffset)
        + text
        + modifiedText.slice(rangeOffset + rangeLength);
    }
    
    text = modifiedText;
    debouncedDoBuild(text);
  });
};

document.addEventListener('DOMContentLoaded', initApp);
