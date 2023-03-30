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

window.addEventListener('message', (event) => {
  runScript(event.data);
});

export {}
