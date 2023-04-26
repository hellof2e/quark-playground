import MagicString from 'magic-string';

const ENTRY_SCRIPT_ID = 'script-preview';

function runScript(
  content: string,
  attrs: Record<string, string> = {}
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

const scriptRE = /<script([^>]*)?>([^<]*)<\/script>/ig;
const scriptAttrRE = /([^=\s]+)(?:=['"]?([^\s'"]*)['"]?)?/ig;

function parseScriptAttrs(attrs: string): Record<string, string> {
  const parsedAttrs = {};
  let match: RegExpExecArray;

  while ((match = scriptAttrRE.exec(attrs))) {
    const [_, name, value] = match;
    parsedAttrs[name] = value || '';
  }

  return parsedAttrs;
}

function processHTML(rawContent: string) {
  const s = new MagicString(rawContent);
  let match: RegExpExecArray;
  const parsedScripts = [];

  while ((match = scriptRE.exec(rawContent))) {
    const [full, attrs, content] = match;
    parsedScripts.push({
      content,
      attrs: parseScriptAttrs(attrs),
    });
    s.remove(
      match.index,
      match.index + full.length
    );
  }

  const content = s.toString();
  const headMatch = content.match(/<head>([^]*)<\/head>/);
  const headContent = headMatch && headMatch[1];

  if (headContent) {
    const head = document.createElement('template');
    head.innerHTML = headContent;
    document.head.appendChild(head.content);
  }

  parsedScripts.forEach(({
    attrs,
    content,
  }) => {
    runScript(content, attrs);
  });

  const app = document.getElementById('app');
  
  if (app) {
    const bodyMatch = content.match(/<body>([^]*)<\/body>/);
    let bodyContent = bodyMatch && bodyMatch[1];

    if (!bodyContent && !headContent) {
      bodyContent = content;
    }

    if (bodyContent) {
      const bodyTmpl = document.createElement('template');
      bodyTmpl.innerHTML = bodyContent;
      app.appendChild(bodyTmpl.content);
    }
  }
}

window.addEventListener('message', (event) => {
  const {
    type,
    payload,
  } = event.data;

  switch (type) {
    case 'script': {
      runScript(payload, {
        id: ENTRY_SCRIPT_ID,
        type: 'module',
      });
      break;
    }
    case 'html': {
      processHTML(payload);
      break;
    }
    default:
      // noop
  }
});
