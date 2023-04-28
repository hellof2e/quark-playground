import { debounce } from 'lodash-es';
import { EditorView } from 'codemirror';
import "./compoents/Header"
import "./compoents/Menu"
import {
  getFileId,
  stripPath,
} from './utils';
import { read } from './utils/fs';
import {
  ENTRY_JS,
  ENTRY_CSS,
  ENTRY_HTML
} from './const'
import build from './build';
import createEditor from './compoents/Editor/editor';

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
  const reqBuildIframeHtml = (message: {
    type: string;
    payload: string;
  }): Promise<void> => {
    return new Promise((resolve, reject) => {
      const iframe = iframeElem?.contentWindow;

      if (iframe) {
        const onUpadated = (event: MessageEvent) => {
          const {
            type,
            payload,
          } = event.data;

          if (type === 'update') {
            self.removeEventListener('message', onUpadated);

            if (payload) {
              resolve();
            } else {
              reject();
            }
          }
        };
        self.addEventListener('message', onUpadated);
        iframe.postMessage(message);
      } else {
        reject();
      }
    });
  };
  iframeElem.addEventListener('load', onIframeReload);

  // * ——first run build——
  let currUpdateType = '';
  let scriptCache = '';
  const doBuild = async (language?: string) => {
    currUpdateType = language;

    try {
      await reloadIframe();
      await reqBuildIframeHtml({
        type: 'update',
        payload: read(ENTRY_HTML),
      });
    } catch (e) {
      // noop
    }
  };
  const doBuildScript = async () => {
    if (currUpdateType === 'html' && scriptCache) {
      return scriptCache;
    }
    
    const result = await build(read(ENTRY_JS));
  
    if (result?.outputFiles) {
      [{ text: scriptCache }] = result.outputFiles;
    }

    return scriptCache;
  };
  self.addEventListener('message', async (event) => {
    const {
      type,
    } = event.data;

    if (type === 'buildScript') {
      const buildResult = await doBuildScript();
      iframeElem
        ?.contentWindow
        ?.postMessage({
          type,
          payload: buildResult,
        });
    }
  });
  /* 编译loading状态 */
  const toggleLoading = (loading: boolean) => {
    const banner = document.querySelector('.preview-banner');
  
    if (banner) {
      banner.classList.toggle('preview-banner--loading', loading);
    }
  }; 
  /** 请求发起构建 */
  const reqBuild = async (...args: Parameters<typeof doBuild>) => {
    toggleLoading(true);
    await doBuild(...args);
    toggleLoading(false);
  };
  const debouncedReqBuild = debounce(reqBuild, 500);
  // 首次构建
  reqBuild();
  

  // * ——initialize tabs & editors——
  const tabs = document.getElementById('code-tabs') as HTMLDivElement;
  const editors = document.getElementById('code-editors') as HTMLDivElement;
  let editorsUpdating = false;
  let editorInstance: Record<string, EditorView> = {
    [ENTRY_JS]: undefined,
    [ENTRY_HTML]: undefined,
    [ENTRY_CSS]: undefined
  };
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
      onChange: (fileName: string, text: string) => {
        let language = 'javascript'
        
        if (fileName === ENTRY_HTML) {
          language = 'html'
        } else if (fileName === ENTRY_CSS) {
          language = 'css'
        }

        if (!editorsUpdating) {
          debouncedReqBuild(language)
        }
      }
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
  ].map(async ({
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
    editorInstance[file] = editor;
    return {
      file,
      language,
      tab,
      editor: editor,
      editorContainer: editorContainer,
    };
  });

  const hashValue = window.location.href.split('/#/')[1] ?  window.location.href.split('/#/')[1] : undefined

  if(!hashValue) {
    window.location.href = `${window.location.href}#/hello-world`
  }

  window.addEventListener('hashchange', async () => {
    editorsUpdating = true;
    // 更新 editor
    ;[ENTRY_JS, ENTRY_CSS, ENTRY_HTML]
      .forEach((entry) => {
        const inst = editorInstance[entry];
        const transaction = inst.state.update({
          changes: {
            from: 0,
            to: inst.state.doc.length,
            insert: read(entry),
          }
        });
        inst.dispatch(transaction);
      });
    reqBuild();
    editorsUpdating = false;
  }, false)
};

document.addEventListener('DOMContentLoaded', initApp);
