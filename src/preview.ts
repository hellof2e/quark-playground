const SCRIPT_ID = 'script-preview';

function runScript(content: string) {
  const prevScript = document.getElementById(SCRIPT_ID);

  if (prevScript) {
    prevScript.parentNode?.removeChild(prevScript);
  }
  
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.type = 'module';
  script.textContent = content;
  document.head.appendChild(script);
}

function replaceHtml(content: string) {
  const app = document.getElementById('app');
  
  if (app) {
    app.innerHTML = content;
  }
}

window.addEventListener('message', (event) => {
  const {
    type,
    payload,
  } = event.data;

  switch (type) {
    case 'script': {
      runScript(payload);
      break;
    }
    case 'html': {
      replaceHtml(payload);
      break;
    }
    default:
      // noop
  }
});

export {}
