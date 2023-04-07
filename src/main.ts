import { debounce } from 'lodash-es';
import build from './build';
import {
  ENTRY_JS,
  ENTRY_CSS,
  ENTRY_HTML,
  read,
  getFileId,
  stripPath,
} from './fs';
import createEditor from './editor';

const initApp = () => {
  // * ——preview iframe——
  const iframeElem = document.getElementById('preview-iframe') as HTMLIFrameElement;
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
  const updateIframe = (message: {
    type: 'html' | 'script';
    payload: string;
  }) => {
    iframeElem
      ?.contentWindow
      ?.postMessage(message);
  };
  iframeElem.addEventListener('load', onIframeReload);

  // * ——first run build——
  const doBuild = async ({
    language = 'javascript',
    text = '',
  } = {}) => {
    if (language === 'html') {
      updateIframe({
        type: 'html',
        payload: text,
      });
      return;
    }
    
    const result = await build(read(ENTRY_JS));

    if (result?.outputFiles) {
      const [outputFile] = result.outputFiles;
      await reloadIframe();
      updateIframe({
        type: 'script',
        payload: outputFile.text,
      });
      updateIframe({
        type: 'html',
        payload: read(ENTRY_HTML),
      });
    }
  };
  const debouncedDoBuild = debounce(doBuild, 500);
  doBuild();

  // * ——initialize tabs & editors——
  const tabs = document.getElementById('code-tabs') as HTMLDivElement;
  const editors = document.getElementById('code-editors') as HTMLDivElement;
  const getEditorContainerId = (fileName: string) => `code-editor-${getFileId(fileName)}`;
  const createTabElem = (fileName: string) => {
    const tabElem = document.createElement('div');
    tabElem.className = 'code-tab';
    tabElem.textContent = stripPath(fileName);
    tabElem.addEventListener('click', () => {
      if (tabElem.classList.contains('active')) {
        return;
      }
      
      const activeTabElem = document.querySelector('.code-tab.active');

      if (activeTabElem) {
        activeTabElem.classList.remove('active');
      }
      
      tabElem.classList.add('active');

      const activeEditorContainer = document.querySelector('.code-editor.active');

      if (activeEditorContainer) {
        activeEditorContainer.classList.remove('active');
      }

      const editorContainer = document.getElementById(getEditorContainerId(fileName));

      if (editorContainer) {
        editorContainer.classList.add('active');
      }
    });
    return tabElem;
  };
  const createEditorElem = (
    fileName: string,
    language: string,
  ) => {
    const editorContainer = document.createElement('div');
    editorContainer.id = getEditorContainerId(fileName);
    editorContainer.className = 'code-editor';
    const editor = createEditor({
      fileName,
      language,
      container: editorContainer,
      onChange: () => debouncedDoBuild(),
    });
    return {
      editorContainer,
      editor,
    };
  };
  // * render tabs and editors
  [
    {
      file: ENTRY_JS,
      language: 'javascript',
    },
    {
      file: ENTRY_CSS,
      language: 'css',
    },
    {
      file: ENTRY_HTML,
      language: 'html',
    }
  ].map(({
    file,
    language,
  }, index) => {
    const tab = createTabElem(file);

    if (index === 0) {
      tab.classList.add('active');
    }

    tabs.appendChild(tab);
    
    const {
      editorContainer,
      editor,
    } = createEditorElem(file, language);

    if (index === 0) {
      editorContainer.classList.add('active');
    }
    
    editors.appendChild(editorContainer);
    return {
      file,
      language,
      tab,
      editor: editor,
      editorContainer: editorContainer,
    };
  });
};

document.addEventListener('DOMContentLoaded', initApp);
