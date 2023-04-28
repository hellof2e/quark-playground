// import MagicString from 'magic-string';
import {
  parse,
  serializeOuter,
  DefaultTreeAdapterMap,
} from 'parse5';
import {
  cleanPath,
  stripPath,
} from './utils';
import {
  MSG_BUILD_SCRIPT,
  MSG_UPDATE,
} from './const';

const ENTRY_SCRIPT_ID = 'script-preview';

function runScript(
  content: string,
  attrs: Record<string, string> = {},
) {
  const { id, ...restAttrs } = attrs;
  const prevScript = id ? document.getElementById(id) : null;
  const script = document.createElement('script');

  if (id) {
    script.id = id;
  }
  
  script.textContent = content;
  Object.entries(restAttrs).forEach(([key, name]) => {
    script.setAttribute(key, name);
  });

  if (prevScript) {
    prevScript.parentNode?.replaceChild(script, prevScript);
  } else {
    document.head.appendChild(script);
  }
}

// const scriptRE = /<script([^>]*)?>([^<]*)<\/script>/ig;
// const scriptAttrRE = /([^=\s]+)(?:=['"]?([^\s'"]*)['"]?)?/ig;

// function parseScriptAttrs(attrs: string): Record<string, string> {
//   const parsedAttrs = {};
//   let match: RegExpExecArray | null;

//   while ((match = scriptAttrRE.exec(attrs))) {
//     const [_, name, value] = match;
//     parsedAttrs[name] = value || '';
//   }

//   return parsedAttrs;
// }

// function processHTML(rawContent: string) {
//   const s = new MagicString(rawContent);
//   let match: RegExpExecArray | null;
//   const parsedScripts: {
//     content: string;
//     attrs: Record<string, string>;
//   }[] = [];

//   while ((match = scriptRE.exec(rawContent))) {
//     const [full, attrs, content] = match;
//     parsedScripts.push({
//       content,
//       attrs: parseScriptAttrs(attrs),
//     });
//     s.remove(
//       match.index,
//       match.index + full.length
//     );
//   }

//   const content = s.toString();
//   const headMatch = content.match(/<head>([^]*)<\/head>/i);
//   const headContent = headMatch && headMatch[1];

//   if (headContent) {
//     const head = document.createElement('template');
//     head.innerHTML = headContent;
//     document.head.appendChild(head.content);
//   }

//   parsedScripts.forEach(({
//     attrs,
//     content,
//   }) => {
//     runScript(content, attrs);
//   });

//   const root = document.getElementById('preview-root');
  
//   if (root) {
//     const bodyMatch = content.match(/<body>([^]*)<\/body>/i);
//     let bodyContent = bodyMatch && bodyMatch[1];

//     if (!bodyContent && !headContent) {
//       bodyContent = content;
//     }

//     if (bodyContent) {
//       const bodyTmpl = document.createElement('template');
//       bodyTmpl.innerHTML = bodyContent;
//       root.appendChild(bodyTmpl.content);
//     }
//   }
// }

const reqBuildScript = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const onBuilt = (event: MessageEvent) => {
      const {
        type,
        payload,
      } = event.data;

      if (type === MSG_BUILD_SCRIPT) {
        self.removeEventListener('message', onBuilt);

        if (payload) {
          resolve(payload);
        } else {
          reject();
        }
      }
    };
    self.addEventListener('message', onBuilt);
    self.parent.postMessage({
      type: MSG_BUILD_SCRIPT,
    });
  });
};

function isElementNode(node: DefaultTreeAdapterMap['node']): node is DefaultTreeAdapterMap['element'] {
  return node.nodeName[0] !== '#';
}

let currParent: HTMLElement;
const externalRE = /^(https?:)?\/\//

async function nodeVisitor(node: DefaultTreeAdapterMap['node']) {
  if (!isElementNode(node)) {
    return;
  }
  
  const { nodeName } = node;

  if (nodeName === 'head') {
    currParent = document.head;
    return;
  }

  if(nodeName === 'body') {
    currParent = document.getElementById('preview-root');
    return;
  }

  if (!currParent) {
    return;
  }

  if (nodeName === 'script') {
    const attrs = node.attrs.reduce<Record<string, string>>((acc, {
      name,
      value,
    }) => ({
      ...acc,
      [name]: value,
    }), {});
    const {
      src: scriptSrc,
      ...attrsExceptSrc
    } = attrs;

    if (
      scriptSrc
      && !externalRE.test(scriptSrc)
      && stripPath(cleanPath(scriptSrc)).startsWith('index.')
    ) {
      const text = await reqBuildScript();
      runScript(
        text,
        {
          id: ENTRY_SCRIPT_ID,
          type: 'module',
          ...attrsExceptSrc,
        },
      );
      return;
    }

    const scriptTextNode = node.childNodes[0] as DefaultTreeAdapterMap['textNode'];
    runScript(
      scriptTextNode.value,
      attrs,
    );
    return;
  }

  const tmpl = document.createElement('template');
  tmpl.innerHTML = serializeOuter(node);
  currParent.appendChild(tmpl.content);
}

async function traverseNodes(node: DefaultTreeAdapterMap['node']) {
  await nodeVisitor(node);
  const { nodeName } = node;

  if (
    isElementNode(node)
    || nodeName === '#document'
    || nodeName === '#document-fragment'
  ) {
    for (const childNode of node.childNodes) {
      await traverseNodes(childNode);
    }
  }
}

async function traverseHTML(rawContent: string) {
  const ast = parse(rawContent, {
    scriptingEnabled: false,
  });
  await traverseNodes(ast);
}

self.addEventListener('message', async (event) => {
  const {
    type,
    payload,
  } = event.data;

  if (type === MSG_UPDATE) {
    let updateResult = true;
    
    try {
      await traverseHTML(payload);
    } catch (e) {
      updateResult = false;
    } finally {
      self.parent.postMessage({
        type,
        payload: updateResult,
      });
    }
  }
});
