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
function runBodyScript(content: string) {
  setTimeout(() => {
    const script = document.createElement('script');
    script.textContent = content;
    document.body.appendChild(script);
  }, 1000)
  
}

function replaceHtml(content: string) {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = content;
    const str = content.replace(/\t|\n|\v|\r|\f/g,'');
  // 使用正则表达式匹配所有的 <script>...</script> 子串
    const regex = /<script>(.*?)<\/script>/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      // 取出匹配到的子串中的内容
      const content = match[1];
      runBodyScript(content);
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
